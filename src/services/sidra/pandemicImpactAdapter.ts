import { SidraServiceError, type SidraAdapter } from "./common";
import type {
  CleanPandemicImpact,
  DomicilioImpactSeries,
  EducacaoImpactSeries,
  NivelInstrucao,
  PandemicDataPoint,
  PandemicImpactResumo,
  PeriodKey,
  RawPandemicInputs,
  RawSidraResultado,
  RawSidraPandemicResponse,
  SidraClassificacaoPandemia,
  SituacaoDomicilio,
} from "../../types/pandemicImpact";
import { fallbackPandemicData } from "./pandemicFallbackData";

const SIDRA_BASE_URL =
  process.env.SIDRA_BASE_URL ||
  "https://servicodados.ibge.gov.br/api/v3/agregados";

const PANDEMIC_DOMICILIO_AGGREGATE =
  process.env.SIDRA_PANDEMIC_DOMICILIO_AGGREGATE_ID || "4862";

const PANDEMIC_DOMICILIO_VARIABLE =
  process.env.SIDRA_PANDEMIC_DOMICILIO_VARIABLE_ID || "5000";

const PANDEMIC_DOMICILIO_CLASSIFICATION =
  process.env.SIDRA_PANDEMIC_DOMICILIO_CLASSIFICATION_ID || "1";

const PANDEMIC_EDUCACAO_AGGREGATE =
  process.env.SIDRA_PANDEMIC_EDUCACAO_AGGREGATE_ID || "7328";

const PANDEMIC_EDUCACAO_VARIABLE =
  process.env.SIDRA_PANDEMIC_EDUCACAO_VARIABLE_ID || "10648";

const PANDEMIC_EDUCACAO_CLASSIFICATION =
  process.env.SIDRA_PANDEMIC_EDUCACAO_CLASSIFICATION_ID || "426";

const PANDEMIC_TERRITORY_LEVEL = "N3";
const PANDEMIC_TERRITORY_CODE = "51";
const PANDEMIC_PERIODS = "2019|2021|2022";

const SIDRA_REVALIDATE_SECONDS =
  Number(process.env.SIDRA_REVALIDATE_SECONDS) || 604800;

const VALID_PERIODS = new Set<string>(["2019", "2021", "2022"]);

function parseSidraNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === ".." || trimmed === "..." || trimmed === "-" || trimmed === "X") {
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

function resolveSituacaoDomicilio(categoryName: string): SituacaoDomicilio | null {
  const lower = categoryName.toLowerCase().trim();
  if (lower === "urbana") return "Urbana";
  if (lower === "rural") return "Rural";
  return null;
}

function resolveNivelInstrucao(categoryName: string): NivelInstrucao | null {
  const lower = categoryName.toLowerCase().trim();

  if (lower.startsWith("sem instrução")) return "Sem instrução";

  if (
    lower.includes("fundamental") &&
    lower.includes("completo") &&
    lower.includes("médio")
  ) {
    return "Fundamental completo ou equivalente";
  }

  if (lower.includes("fundamental") && lower.includes("incompleto")) {
    return "Fundamental incompleto ou equivalente";
  }

  if (lower.includes("fundamental") && lower.includes("completo")) {
    return "Fundamental completo ou equivalente";
  }

  if (
    lower.includes("médio") &&
    lower.includes("completo") &&
    lower.includes("superior")
  ) {
    return "Médio completo ou equivalente";
  }

  if (lower.includes("médio") && lower.includes("completo")) {
    return "Médio completo ou equivalente";
  }

  if (lower.startsWith("superior completo")) return "Superior completo";

  return null;
}

function extractFirstCategoryName(
  classificacoes: readonly SidraClassificacaoPandemia[],
): string | null {
  const first = classificacoes[0];
  if (!first) return null;
  const values = Object.values(first.categoria as Record<string, string>);
  return values[0] ?? null;
}

function extractPeriodPoints(
  serie: Readonly<Record<string, string>>,
): PandemicDataPoint[] {
  return (Object.entries(serie) as [string, string][])
    .filter(([period]) => VALID_PERIODS.has(period))
    .map(([period, raw]) => {
      const percentual = parseSidraNumber(raw);
      if (percentual === null) return null;
      return { periodo: period as PeriodKey, percentual };
    })
    .filter((point): point is PandemicDataPoint => point !== null)
    .sort((a, b) => Number(a.periodo) - Number(b.periodo));
}

function buildDomicilioUrl(): string {
  return (
    `${SIDRA_BASE_URL}/${PANDEMIC_DOMICILIO_AGGREGATE}` +
    `/periodos/${PANDEMIC_PERIODS}` +
    `/variaveis/${PANDEMIC_DOMICILIO_VARIABLE}` +
    `?localidades=${PANDEMIC_TERRITORY_LEVEL}[${PANDEMIC_TERRITORY_CODE}]` +
    `&classificacao=${PANDEMIC_DOMICILIO_CLASSIFICATION}[1,2]`
  );
}

function buildEducacaoUrl(): string {
  return (
    `${SIDRA_BASE_URL}/${PANDEMIC_EDUCACAO_AGGREGATE}` +
    `/periodos/${PANDEMIC_PERIODS}` +
    `/variaveis/${PANDEMIC_EDUCACAO_VARIABLE}` +
    `?localidades=${PANDEMIC_TERRITORY_LEVEL}[${PANDEMIC_TERRITORY_CODE}]` +
    `&classificacao=${PANDEMIC_EDUCACAO_CLASSIFICATION}[allxt]`
  );
}

async function fetchDomicilioRaw(): Promise<RawSidraPandemicResponse> {
  const response = await fetch(buildDomicilioUrl(), {
    headers: { Accept: "application/json" },
    next: { revalidate: SIDRA_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new SidraServiceError(
      "http-error",
      `SIDRA domicílio respondeu com status ${response.status}.`,
    );
  }

  return response.json() as Promise<RawSidraPandemicResponse>;
}

async function fetchEducacaoRaw(): Promise<RawSidraPandemicResponse> {
  const response = await fetch(buildEducacaoUrl(), {
    headers: { Accept: "application/json" },
    next: { revalidate: SIDRA_REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    throw new SidraServiceError(
      "http-error",
      `SIDRA educação respondeu com status ${response.status}.`,
    );
  }

  return response.json() as Promise<RawSidraPandemicResponse>;
}

class PandemicImpactAdapter
  implements SidraAdapter<RawPandemicInputs, CleanPandemicImpact>
{
  adapt(data: RawPandemicInputs): CleanPandemicImpact {
    const domicilio = this.adaptDomicilioData(data.domicilio);
    const educacao = this.adaptEducacaoData(data.educacao);
    const resumo = this.computeResumo(domicilio, educacao);

    return {
      territorio: { id: "51", nome: "Mato Grosso", uf: "MT" },
      domicilio,
      educacao,
      resumo,
      fonte: {
        pesquisa: "PNAD Contínua TIC",
        agregados: [PANDEMIC_DOMICILIO_AGGREGATE, PANDEMIC_EDUCACAO_AGGREGATE],
        periodos: ["2019", "2021", "2022"],
        dataExtracao: new Date().toISOString(),
      },
      isFallback: false,
    };
  }

  private adaptDomicilioData(
    raw: RawSidraPandemicResponse,
  ): DomicilioImpactSeries[] {
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new SidraServiceError(
        "empty-response",
        "Resposta SIDRA domicílio vazia.",
      );
    }

    const resultados: readonly RawSidraResultado[] = raw[0]?.resultados ?? [];
    const series: DomicilioImpactSeries[] = [];

    for (const resultado of resultados) {
      const categoryName = extractFirstCategoryName(resultado.classificacoes);
      if (!categoryName) continue;

      const situacao = resolveSituacaoDomicilio(categoryName);
      if (!situacao) continue;

      const seriesEntry = resultado.series.find(
        (s) => s.localidade.id === PANDEMIC_TERRITORY_CODE,
      );
      if (!seriesEntry) continue;

      const pontos = extractPeriodPoints(seriesEntry.serie);
      if (pontos.length === 0) continue;

      const deltaPercentual =
        pontos.length >= 2
          ? roundTo(
              pontos[pontos.length - 1].percentual - pontos[0].percentual,
            )
          : 0;

      series.push({ situacao, pontos, deltaPercentual });
    }

    if (series.length === 0) {
      throw new SidraServiceError(
        "no-data",
        "Nenhuma série domicílio válida encontrada para Mato Grosso.",
      );
    }

    return series;
  }

  private adaptEducacaoData(
    raw: RawSidraPandemicResponse,
  ): EducacaoImpactSeries[] {
    if (!Array.isArray(raw) || raw.length === 0) {
      throw new SidraServiceError(
        "empty-response",
        "Resposta SIDRA educação vazia.",
      );
    }

    const resultados: readonly RawSidraResultado[] = raw[0]?.resultados ?? [];
    const series: EducacaoImpactSeries[] = [];

    const instrucaoOrder: NivelInstrucao[] = [
      "Sem instrução",
      "Fundamental incompleto ou equivalente",
      "Fundamental completo ou equivalente",
      "Médio completo ou equivalente",
      "Superior completo",
    ];

    for (const resultado of resultados) {
      const categoryName = extractFirstCategoryName(resultado.classificacoes);
      if (!categoryName) continue;

      const nivelInstrucao = resolveNivelInstrucao(categoryName);
      if (!nivelInstrucao) continue;

      if (series.some((s) => s.nivelInstrucao === nivelInstrucao)) continue;

      const seriesEntry = resultado.series.find(
        (s) => s.localidade.id === PANDEMIC_TERRITORY_CODE,
      );
      if (!seriesEntry) continue;

      const pontos = extractPeriodPoints(seriesEntry.serie);
      if (pontos.length === 0) continue;

      series.push({ nivelInstrucao, pontos });
    }

    if (series.length === 0) {
      throw new SidraServiceError(
        "no-data",
        "Nenhuma série educação válida encontrada para Mato Grosso.",
      );
    }

    return series.sort(
      (a, b) =>
        instrucaoOrder.indexOf(a.nivelInstrucao) -
        instrucaoOrder.indexOf(b.nivelInstrucao),
    );
  }

  private computeResumo(
    domicilio: DomicilioImpactSeries[],
    educacao: EducacaoImpactSeries[],
  ): PandemicImpactResumo {
    const getDomicilioValue = (
      situacao: SituacaoDomicilio,
      periodo: PeriodKey,
    ): number => {
      const serie = domicilio.find((s) => s.situacao === situacao);
      const ponto =
        serie?.pontos.find((p) => p.periodo === periodo) ??
        serie?.pontos[serie.pontos.length - 1];
      return ponto?.percentual ?? 0;
    };

    const latestPeriod: PeriodKey = "2022";
    const basePeriod: PeriodKey = "2019";

    const urbanaBase = getDomicilioValue("Urbana", basePeriod);
    const ruralBase = getDomicilioValue("Rural", basePeriod);
    const urbanaLatest = getDomicilioValue("Urbana", latestPeriod);
    const ruralLatest = getDomicilioValue("Rural", latestPeriod);

    const eduValuesLatest = educacao
      .map(
        (e) =>
          e.pontos.find((p) => p.periodo === latestPeriod)?.percentual ??
          e.pontos[e.pontos.length - 1]?.percentual,
      )
      .filter((v): v is number => v !== undefined);

    const gapDesigualdadeEducacaoMaximo =
      eduValuesLatest.length >= 2
        ? roundTo(Math.max(...eduValuesLatest) - Math.min(...eduValuesLatest))
        : 0;

    return {
      gapUrbanRuralPrePandemia: roundTo(urbanaBase - ruralBase),
      gapUrbanRuralPosPandemia: roundTo(urbanaLatest - ruralLatest),
      deltaUrbanoPandemia: roundTo(urbanaLatest - urbanaBase),
      deltaRuralPandemia: roundTo(ruralLatest - ruralBase),
      gapDesigualdadeEducacaoMaximo,
    };
  }
}

export async function fetchPandemicImpact(): Promise<CleanPandemicImpact> {
  try {
    const [domicilioPayload, educacaoPayload] = await Promise.all([
      fetchDomicilioRaw(),
      fetchEducacaoRaw(),
    ]);

    const adapter = new PandemicImpactAdapter();
    return adapter.adapt({ domicilio: domicilioPayload, educacao: educacaoPayload });
  } catch {
    return fallbackPandemicData;
  }
}
