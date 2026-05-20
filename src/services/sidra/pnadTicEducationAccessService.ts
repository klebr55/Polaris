export interface EducationAccessPoint {
  period: string;
  value: number;
}

export interface EducationAccessSeries {
  indicator: string;
  territory: { code: string; name: string };
  unit: string | null;
  points: EducationAccessPoint[];
}

export class SidraServiceError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message, { cause });
    this.name = "SidraServiceError";
  }
}

interface SidraAdapter<TRaw, TSimplified> {
  adapt(data: TRaw): TSimplified;
}

const SIDRA_BASE_URL = "https://servicodados.ibge.gov.br/api/v3/agregados";
const SIDRA_AGGREGATE_ID = "7176";
const SIDRA_VARIABLE_ID = "10612";
const SIDRA_TERRITORY_LEVEL = "N3";
const SIDRA_TERRITORY_CODE = "51";
const SIDRA_PERIOD = "all";
const SIDRA_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
const INDICATOR_LABEL = "Percentual de estudantes que utilizaram a internet";

interface AggregateLocalidade {
  id: string;
  nome: string;
  nivel?: { id: string; nome: string };
}

interface AggregateSeriesEntry {
  localidade: AggregateLocalidade;
  serie: Record<string, string>;
}

interface AggregateResult {
  classificacoes: unknown[];
  series: AggregateSeriesEntry[];
}

interface AggregateVariableResponse {
  id: string;
  variavel: string;
  unidade: string;
  resultados: AggregateResult[];
}

type SidraAggregateResponse = AggregateVariableResponse[];

class PnadTicEducationAccessAdapter implements SidraAdapter<
  SidraAggregateResponse,
  EducationAccessSeries
> {
  constructor(private readonly indicatorLabel: string) {}

  adapt(rows: SidraAggregateResponse): EducationAccessSeries {
    if (!Array.isArray(rows)) {
      throw new SidraServiceError(
        "invalid-response",
        "Resposta SIDRA invalida.",
      );
    }

    if (rows.length === 0) {
      throw new SidraServiceError("empty-response", "Resposta SIDRA vazia.");
    }

    const variable = rows[0];
    const results = variable?.resultados ?? [];
    const seriesEntry = results[0]?.series?.[0];

    if (!seriesEntry || !seriesEntry.serie) {
      throw new SidraServiceError("empty-response", "Resposta SIDRA vazia.");
    }

    const territory = {
      code: seriesEntry.localidade.id,
      name: seriesEntry.localidade.nome,
    };
    const unit = variable.unidade ?? null;
    const indicator = variable.variavel || this.indicatorLabel;

    const pointsWithSort = Object.entries(seriesEntry.serie)
      .map(([period, value]) => toChartPointFromSeries(period, value))
      .filter((point): point is ChartPointWithSortKey => point !== null);

    const sanitizedPoints = sanitizeSeries(pointsWithSort);

    if (sanitizedPoints.length === 0) {
      throw new SidraServiceError("no-data", "Sem dados validos do SIDRA.");
    }

    return {
      indicator,
      territory,
      unit,
      points: sanitizedPoints,
    };
  }
}

interface ChartPointWithSortKey extends EducationAccessPoint {
  sortKey: string;
}

function parseSidraNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed || trimmed === ".." || trimmed === "..." || trimmed === "X") {
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

function toChartPointFromSeries(
  period: string,
  rawValue: string,
): ChartPointWithSortKey | null {
  const value = parseSidraNumber(rawValue);
  if (value === null) {
    return null;
  }

  if (!period) {
    return null;
  }

  return {
    period,
    value,
    sortKey: period,
  };
}

function parseYear(value: string): number | null {
  const normalized = value.replace(/[^0-9]/g, "");
  if (normalized.length < 4) {
    return null;
  }

  const year = Number(normalized.slice(0, 4));
  if (!Number.isFinite(year) || year < 1900 || year > 2200) {
    return null;
  }

  return year;
}

function roundTo(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function sanitizeSeries(
  points: ChartPointWithSortKey[],
): EducationAccessPoint[] {
  const byYear = new Map<number, number>();

  points.forEach((point) => {
    if (!Number.isFinite(point.value)) {
      return;
    }

    const year = parseYear(point.sortKey) ?? parseYear(point.period);
    if (year === null) {
      return;
    }

    byYear.set(year, point.value);
  });

  const years = Array.from(byYear.keys()).sort((a, b) => a - b);
  if (years.length === 0) {
    return [];
  }

  const sanitized: EducationAccessPoint[] = [];

  years.forEach((year, index) => {
    const value = byYear.get(year) ?? 0;

    if (index === 0) {
      sanitized.push({ period: String(year), value });
      return;
    }

    const previousYear = years[index - 1];
    const previousValue = byYear.get(previousYear) ?? value;
    const gap = year - previousYear;

    if (gap > 1) {
      for (let step = 1; step < gap; step += 1) {
        const interpolated =
          previousValue + (value - previousValue) * (step / gap);
        sanitized.push({
          period: String(previousYear + step),
          value: roundTo(interpolated),
        });
      }
    }

    sanitized.push({ period: String(year), value });
  });

  return sanitized;
}

function buildSidraUrl(): string {
  return `${SIDRA_BASE_URL}/${SIDRA_AGGREGATE_ID}/periodos/${SIDRA_PERIOD}/variaveis/${SIDRA_VARIABLE_ID}?localidades=${SIDRA_TERRITORY_LEVEL}[${SIDRA_TERRITORY_CODE}]`;
}

export async function fetchPnadTicEducationAccessMatoGrosso(): Promise<EducationAccessSeries> {
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
    const adapter = new PnadTicEducationAccessAdapter(INDICATOR_LABEL);

    return adapter.adapt(payload);
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
