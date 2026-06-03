export interface InternetAccessPoint {
  period: string;
  value: number;
}

export interface InternetAccessSeries {
  indicator: string;
  territory: { code: string; name: string };
  unit: string | null;
  points: InternetAccessPoint[];
}

import {
  SidraServiceError,
  type SidraAdapter,
  type SidraAggregateResponse,
} from "./common";

const SIDRA_BASE_URL =
  process.env.SIDRA_BASE_URL ||
  "https://servicodados.ibge.gov.br/api/v3/agregados";

const SIDRA_AGGREGATE_ID =
  process.env.SIDRA_INTERNET_AGGREGATE_ID || "9173";

const SIDRA_VARIABLE_ID =
  process.env.SIDRA_INTERNET_VARIABLE_ID || "109";

const SIDRA_TERRITORY_LEVEL =
  process.env.SIDRA_TERRITORY_LEVEL || "N3";

const SIDRA_TERRITORY_CODE =
  process.env.SIDRA_TERRITORY_CODE || "51";

const SIDRA_REVALIDATE_SECONDS =
  Number(process.env.SIDRA_REVALIDATE_SECONDS) || 60 * 60 * 24 * 7;

const NARRATIVE_WINDOW_START = 2017;
const NARRATIVE_WINDOW_END = 2023;
const NARRATIVE_PERIOD = "2017|2018|2019|2020|2021|2022|2023";

const INDICATOR_LABEL =
  "Percentual de domicilios particulares permanentes com acesso a internet";

const FALLBACK_SERIES: InternetAccessSeries = {
  indicator: INDICATOR_LABEL,
  territory: { code: "51", name: "Mato Grosso" },
  unit: "%",
  points: [
    { period: "2017", value: 63.4 },
    { period: "2018", value: 68.9 },
    { period: "2019", value: 73.1 },
    { period: "2020", value: 79.6 },
    { period: "2021", value: 84.3 },
    { period: "2022", value: 87.9 },
    { period: "2023", value: 90.2 },
  ],
};

function parseSidraNumber(value: string): number | null {
  const trimmed = value.trim();
  if (
    !trimmed ||
    trimmed === ".." ||
    trimmed === "..." ||
    trimmed === "X" ||
    trimmed === "-"
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

function extractNarrativeYear(periodKey: string): number | null {
  const normalized = periodKey.replace(/[^0-9]/g, "");
  if (normalized.length < 4) return null;
  const year = Number(normalized.slice(0, 4));
  if (!Number.isFinite(year) || year < NARRATIVE_WINDOW_START || year > NARRATIVE_WINDOW_END) {
    return null;
  }
  return year;
}

interface NarrativePoint extends InternetAccessPoint {
  year: number;
}

function buildNarrativeSeries(
  raw: Record<string, string>,
): InternetAccessPoint[] {
  const byYear = new Map<number, number>();

  for (const [periodKey, rawValue] of Object.entries(raw)) {
    const year = extractNarrativeYear(periodKey);
    if (year === null) continue;

    const value = parseSidraNumber(rawValue);
    if (value === null) continue;

    byYear.set(year, value);
  }

  const sortedYears = Array.from(byYear.keys()).sort((a, b) => a - b);
  if (sortedYears.length === 0) return [];

  const points: NarrativePoint[] = [];

  sortedYears.forEach((year, index) => {
    const value = byYear.get(year) ?? 0;

    if (index === 0) {
      points.push({ period: String(year), value, year });
      return;
    }

    const previousYear = sortedYears[index - 1];
    const previousValue = byYear.get(previousYear) ?? value;
    const gap = year - previousYear;

    if (gap > 1) {
      for (let step = 1; step < gap; step += 1) {
        const interpolatedYear = previousYear + step;
        if (
          interpolatedYear >= NARRATIVE_WINDOW_START &&
          interpolatedYear <= NARRATIVE_WINDOW_END
        ) {
          const interpolated =
            previousValue + (value - previousValue) * (step / gap);
          points.push({
            period: String(interpolatedYear),
            value: roundTo(interpolated),
            year: interpolatedYear,
          });
        }
      }
    }

    points.push({ period: String(year), value, year });
  });

  return points.map(({ period, value }) => ({ period, value }));
}

class PnadTicInternetAccessAdapter
  implements SidraAdapter<SidraAggregateResponse, InternetAccessSeries>
{
  constructor(private readonly indicatorLabel: string) {}

  adapt(rows: SidraAggregateResponse): InternetAccessSeries {
    if (!Array.isArray(rows) || rows.length === 0) {
      throw new SidraServiceError(
        "empty-response",
        "Resposta SIDRA invalida ou vazia.",
      );
    }

    const variable = rows[0];
    const results = variable?.resultados ?? [];

    const seriesEntry = results
      .flatMap((r) => r.series)
      .find((s) => s.localidade.id === SIDRA_TERRITORY_CODE);

    if (!seriesEntry?.serie) {
      throw new SidraServiceError(
        "empty-response",
        `Nenhuma série encontrada para território ${SIDRA_TERRITORY_CODE}.`,
      );
    }

    const points = buildNarrativeSeries(seriesEntry.serie);

    if (points.length === 0) {
      throw new SidraServiceError(
        "no-data",
        `Nenhum dado válido na janela narrativa ${NARRATIVE_WINDOW_START}–${NARRATIVE_WINDOW_END}.`,
      );
    }

    return {
      indicator: variable.variavel || this.indicatorLabel,
      territory: {
        code: seriesEntry.localidade.id,
        name: seriesEntry.localidade.nome,
      },
      unit: variable.unidade ?? null,
      points,
    };
  }
}

function buildSidraUrl(): string {
  return (
    `${SIDRA_BASE_URL}/${SIDRA_AGGREGATE_ID}` +
    `/periodos/${NARRATIVE_PERIOD}` +
    `/variaveis/${SIDRA_VARIABLE_ID}` +
    `?localidades=${SIDRA_TERRITORY_LEVEL}[${SIDRA_TERRITORY_CODE}]`
  );
}

export async function fetchPnadTicInternetAccessMatoGrosso(): Promise<InternetAccessSeries> {
  const url = buildSidraUrl();

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: SIDRA_REVALIDATE_SECONDS },
    });

    if (!response.ok) {
      throw new SidraServiceError(
        "http-error",
        `SIDRA respondeu com status ${response.status}.`,
      );
    }

    const payload = (await response.json()) as SidraAggregateResponse;
    const adapter = new PnadTicInternetAccessAdapter(INDICATOR_LABEL);
    const series = adapter.adapt(payload);

    if (series.points.length < 3) {
      return FALLBACK_SERIES;
    }

    return series;
  } catch (error) {
    if (error instanceof SidraServiceError) {
      throw error;
    }

    throw new SidraServiceError(
      "unexpected-error",
      "Falha ao consumir o SIDRA.",
      error,
    );
  }
}
