import { SidraServiceError } from "./common";
import type {
  ChoqueTrabalhoRemoto,
  DisparatedTeleworkPoint,
  EquipamentoAccessPoint,
  MatoGrossoDigitalDivideData,
  MotivoAccessPoint,
  NarrativaSummary,
  RealidadeInfraestrutura,
  RendimentoTeleworkPoint,
  SidraClassificacaoV3,
  SidraResponseV3,
} from "../../types/digitalDivide";
import { fallbackDigitalDivideMT } from "./digitalDivideFallback";

const SIDRA_BASE_URL =
  process.env.SIDRA_BASE_URL ||
  "https://servicodados.ibge.gov.br/api/v3/agregados";

const MT_TERRITORY = "N3[51]";
const MT_CODE = "51";

const SIDRA_REVALIDATE_SECONDS =
  Number(process.env.SIDRA_REVALIDATE_SECONDS) || 604800;

const COVID_PERIODS = process.env.SIDRA_COVID_PERIODS || "all";
const TIC_PERIODS = process.env.SIDRA_TIC_PERIODS || "2020|2021|2022";

const T6817_VARIABLE = process.env.SIDRA_T6817_VARIABLE_ID || "4176";
const T6821_VARIABLE = process.env.SIDRA_T6821_VARIABLE_ID || "4176";
const T6821_CLASS = process.env.SIDRA_T6821_CLASS_ID || "526";
const T6841_VARIABLE = process.env.SIDRA_T6841_VARIABLE_ID || "4176";
const T6841_CLASS_PRIMARY = process.env.SIDRA_T6841_CLASS_PRIMARY_ID || "543";
const T7447_VARIABLE = process.env.SIDRA_T7447_VARIABLE_ID || "11827";
const T7447_CLASS = process.env.SIDRA_T7447_CLASS_ID || "1346";
const T7454_VARIABLE = process.env.SIDRA_T7454_VARIABLE_ID || "11827";
const T7454_CLASS = process.env.SIDRA_T7454_CLASS_ID || "1349";
const T7455_VARIABLE = process.env.SIDRA_T7455_VARIABLE_ID || "11827";
const T7455_CLASS = process.env.SIDRA_T7455_CLASS_ID || "1351";

function parseSidraNumber(value: string): number | null {
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed === ".." ||
    trimmed === "..." ||
    trimmed === "-" ||
    trimmed === "X"
  ) {
    return null;
  }

  let normalized = trimmed;

  if (normalized.includes(",") && normalized.includes(".")) {
    normalized = normalized.replace(/\./g, "").replace(",", ".");
  } else if (normalized.includes(",")) {
    normalized = normalized.replace(",", ".");
  } else if (/^\d{1,3}(\.\d{3})+$/.test(normalized)) {
    normalized = normalized.replace(/\./g, "");
  }

  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function roundTo(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function extractFirstCategoryName(
  classificacoes: readonly SidraClassificacaoV3[],
): string | null {
  const first = classificacoes[0];
  if (!first) return null;
  const values = Object.values(first.categoria as Record<string, string>);
  return values[0] ?? null;
}

function extractLatestValidValue(
  serie: Readonly<Record<string, string>>,
): number | null {
  const sortedEntries = (Object.entries(serie) as [string, string][]).sort(
    ([a], [b]) => b.localeCompare(a),
  );

  for (const [, raw] of sortedEntries) {
    const value = parseSidraNumber(raw);
    if (value !== null) return value;
  }

  return null;
}

function extractSingleLatestValue(payload: SidraResponseV3): number {
  if (!Array.isArray(payload) || payload.length === 0) return 0;

  const variable = payload[0];
  const resultado = variable?.resultados[0];
  if (!resultado) return 0;

  const seriesEntry = resultado.series.find(
    (s: { localidade: { id: string } }) => s.localidade.id === MT_CODE,
  );
  if (!seriesEntry) return 0;

  return extractLatestValidValue(seriesEntry.serie) ?? 0;
}

function extractCategoryValuePairs(
  payload: SidraResponseV3,
): ReadonlyArray<{ categoria: string; percentual: number }> {
  if (!Array.isArray(payload) || payload.length === 0) return [];

  const variable = payload[0];
  const pairs: Array<{ categoria: string; percentual: number }> = [];

  for (const resultado of variable.resultados) {
    const categoryName = extractFirstCategoryName(resultado.classificacoes);
    if (!categoryName) continue;

    const seriesEntry = resultado.series.find(
      (s: { localidade: { id: string } }) => s.localidade.id === MT_CODE,
    );
    if (!seriesEntry) continue;

    const value = extractLatestValidValue(seriesEntry.serie);
    if (value === null) continue;

    pairs.push({ categoria: categoryName, percentual: value });
  }

  return pairs;
}

function buildUrl(
  tableId: string,
  periods: string,
  variableId: string,
  classificationId?: string,
): string {
  const base = `${SIDRA_BASE_URL}/${tableId}/periodos/${periods}/variaveis/${variableId}?localidades=${MT_TERRITORY}`;
  return classificationId
    ? `${base}&classificacao=${classificationId}[allxt]`
    : base;
}

async function fetchTablePayload(
  tableId: string,
  url: string,
  fetchOptions: RequestInit & { next?: { revalidate: number } },
): Promise<SidraResponseV3> {
  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    throw new SidraServiceError(
      "http-error",
      `SIDRA tabela ${tableId} respondeu com status ${response.status}.`,
    );
  }

  return response.json() as Promise<SidraResponseV3>;
}

class MatoGrossoTechPandemicFacade {
  private readonly fetchOptions = {
    headers: { Accept: "application/json" },
    next: { revalidate: SIDRA_REVALIDATE_SECONDS },
  } as const;

  private adaptChoqueTrabalhoRemoto(
    p6817: SidraResponseV3,
    p6821: SidraResponseV3,
    p6841: SidraResponseV3,
  ): ChoqueTrabalhoRemoto {
    const percentualAfastadosDistanciamento = extractSingleLatestValue(p6817);

    const rendimentoPairs = extractCategoryValuePairs(p6821);
    const teleworkByRendimento: RendimentoTeleworkPoint[] = rendimentoPairs.map(
      (p) => ({
        faixaRendimento: p.categoria,
        percentualTeletrabalho: p.percentual,
      }),
    );

    const corRacaPairs: DisparatedTeleworkPoint[] = [];
    const escolaridadePairs: DisparatedTeleworkPoint[] = [];

    if (Array.isArray(p6841) && p6841.length > 0) {
      const variable = p6841[0];

      for (const resultado of variable.resultados) {
        const firstClass = resultado.classificacoes[0];
        if (!firstClass) continue;

        const categoryName = Object.values(
          firstClass.categoria as Record<string, string>,
        )[0];
        if (!categoryName) continue;

        const seriesEntry = resultado.series.find(
          (s: { localidade: { id: string } }) => s.localidade.id === MT_CODE,
        );
        if (!seriesEntry) continue;

        const value = extractLatestValidValue(seriesEntry.serie);
        if (value === null) continue;

        const classNomeLower = firstClass.nome.toLowerCase();

        if (
          classNomeLower.includes("cor") ||
          classNomeLower.includes("raça")
        ) {
          corRacaPairs.push({ grupo: categoryName, percentualTeletrabalho: value });
        } else if (
          classNomeLower.includes("instru") ||
          classNomeLower.includes("escolaridade")
        ) {
          escolaridadePairs.push({ grupo: categoryName, percentualTeletrabalho: value });
        }
      }
    }

    return {
      percentualAfastadosDistanciamento,
      teleworkByRendimento,
      teleworkByCorRaca: corRacaPairs,
      teleworkByEscolaridade: escolaridadePairs,
    };
  }

  private adaptRealidadeInfraestrutura(
    p7447: SidraResponseV3,
    p7454: SidraResponseV3,
    p7455: SidraResponseV3,
  ): RealidadeInfraestrutura {
    const percentualDomiciliosSemInternet = extractSingleLatestValue(p7447);

    const motivosDomiciliosPairs = extractCategoryValuePairs(p7447);
    const motivosDomiciliosSemInternet: MotivoAccessPoint[] =
      motivosDomiciliosPairs.map((p) => ({
        motivo: p.categoria,
        percentual: p.percentual,
      }));

    const equipamentoPairs = extractCategoryValuePairs(p7454);
    const equipamentosUtilizados: EquipamentoAccessPoint[] =
      equipamentoPairs
        .map((p) => ({
          equipamento: p.categoria,
          percentualUsuarios: p.percentual,
        }))
        .sort((a, b) => b.percentualUsuarios - a.percentualUsuarios);

    const motivosPessoasPairs = extractCategoryValuePairs(p7455);
    const motivosFaltaAcessoPessoas: MotivoAccessPoint[] =
      motivosPessoasPairs
        .map((p) => ({
          motivo: p.categoria,
          percentual: p.percentual,
        }))
        .sort((a, b) => b.percentual - a.percentual);

    return {
      percentualDomiciliosSemInternet,
      motivosDomiciliosSemInternet,
      equipamentosUtilizados,
      motivosFaltaAcessoPessoas,
    };
  }

  private computeResumoNarrativo(
    choque: ChoqueTrabalhoRemoto,
    infra: RealidadeInfraestrutura,
  ): NarrativaSummary {
    const rendimentoValues = choque.teleworkByRendimento.map(
      (p) => p.percentualTeletrabalho,
    );

    const gapTeleworkRendimentoExtremo =
      rendimentoValues.length >= 2
        ? roundTo(
            Math.max(...rendimentoValues) - Math.min(...rendimentoValues),
          )
        : 0;

    const celularEquip = infra.equipamentosUtilizados.find(
      (e) =>
        e.equipamento.toLowerCase().includes("celular") ||
        e.equipamento.toLowerCase().includes("telefone"),
    );

    const principalBarreira =
      infra.motivosFaltaAcessoPessoas.reduce<MotivoAccessPoint | null>(
        (max, curr) => (!max || curr.percentual > max.percentual ? curr : max),
        null,
      );

    const percentualAfastadosEmTeletrabalho =
      rendimentoValues.length > 0
        ? roundTo(
            rendimentoValues.reduce((sum, v) => sum + v, 0) /
              rendimentoValues.length,
          )
        : 0;

    return {
      gapTeleworkRendimentoExtremo,
      percentualDependenciaCelular: celularEquip?.percentualUsuarios ?? 0,
      principalBarreiraAcesso:
        principalBarreira?.motivo ?? "Não identificado",
      percentualAfastadosEmTeletrabalho,
    };
  }

  private hasMinimalData(
    choque: ChoqueTrabalhoRemoto,
    infra: RealidadeInfraestrutura,
  ): boolean {
    return (
      choque.percentualAfastadosDistanciamento > 0 ||
      choque.teleworkByRendimento.length > 0 ||
      infra.equipamentosUtilizados.length > 0 ||
      infra.motivosFaltaAcessoPessoas.length > 0
    );
  }

  async execute(): Promise<MatoGrossoDigitalDivideData> {
    const [r6817, r6821, r6841, r7447, r7454, r7455] =
      await Promise.allSettled([
        fetchTablePayload(
          "6817",
          buildUrl("6817", COVID_PERIODS, T6817_VARIABLE),
          this.fetchOptions,
        ),
        fetchTablePayload(
          "6821",
          buildUrl("6821", COVID_PERIODS, T6821_VARIABLE, T6821_CLASS),
          this.fetchOptions,
        ),
        fetchTablePayload(
          "6841",
          buildUrl("6841", COVID_PERIODS, T6841_VARIABLE, T6841_CLASS_PRIMARY),
          this.fetchOptions,
        ),
        fetchTablePayload(
          "7447",
          buildUrl("7447", TIC_PERIODS, T7447_VARIABLE, T7447_CLASS),
          this.fetchOptions,
        ),
        fetchTablePayload(
          "7454",
          buildUrl("7454", TIC_PERIODS, T7454_VARIABLE, T7454_CLASS),
          this.fetchOptions,
        ),
        fetchTablePayload(
          "7455",
          buildUrl("7455", TIC_PERIODS, T7455_VARIABLE, T7455_CLASS),
          this.fetchOptions,
        ),
      ]);

    const choqueGroupFailed =
      r6817.status === "rejected" &&
      r6821.status === "rejected" &&
      r6841.status === "rejected";

    const infraGroupFailed =
      r7447.status === "rejected" &&
      r7454.status === "rejected" &&
      r7455.status === "rejected";

    if (choqueGroupFailed && infraGroupFailed) {
      return fallbackDigitalDivideMT;
    }

    try {
      const emptyPayload: SidraResponseV3 = [];

      const choque = this.adaptChoqueTrabalhoRemoto(
        r6817.status === "fulfilled" ? r6817.value : emptyPayload,
        r6821.status === "fulfilled" ? r6821.value : emptyPayload,
        r6841.status === "fulfilled" ? r6841.value : emptyPayload,
      );

      const infra = this.adaptRealidadeInfraestrutura(
        r7447.status === "fulfilled" ? r7447.value : emptyPayload,
        r7454.status === "fulfilled" ? r7454.value : emptyPayload,
        r7455.status === "fulfilled" ? r7455.value : emptyPayload,
      );

      if (!this.hasMinimalData(choque, infra)) {
        return fallbackDigitalDivideMT;
      }

      const resumoNarrativo = this.computeResumoNarrativo(choque, infra);

      return {
        territorio: { id: "51", nome: "Mato Grosso", uf: "MT" },
        choqueTrabalhoRemoto: choque,
        realidadeInfraestrutura: infra,
        resumoNarrativo,
        fonte: {
          pesquisas: ["PNAD COVID-19", "PNAD Contínua TIC"],
          tabelas: ["6817", "6821", "6841", "7447", "7454", "7455"],
          referencia: "IBGE SIDRA API v3",
          dataExtracao: new Date().toISOString(),
        },
        isFallback: false,
      };
    } catch {
      return fallbackDigitalDivideMT;
    }
  }
}

export async function fetchMatoGrossoDigitalDivide(): Promise<MatoGrossoDigitalDivideData> {
  const facade = new MatoGrossoTechPandemicFacade();
  return facade.execute();
}
