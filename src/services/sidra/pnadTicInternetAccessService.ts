import type { PnadTicApiResponse, PnadTicDimension, PnadTicRawRow } from "../../types/ibge";

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

const SIDRA_BASE_URL = "https://apisidra.ibge.gov.br/values";
const SIDRA_TABLE_ID = "7127";
const SIDRA_VARIABLE_ID = "4099";
const SIDRA_TERRITORY_LEVEL = "n3";
const SIDRA_TERRITORY_CODE = "51";
const SIDRA_PERIOD = "all";
const SIDRA_REVALIDATE_SECONDS = 60 * 60 * 24 * 7;
const INDICATOR_LABEL = "Proporcao de domicilios com acesso a internet";

class PnadTicInternetAccessAdapter
  implements SidraAdapter<PnadTicApiResponse, InternetAccessSeries>
{
  constructor(private readonly indicatorLabel: string) {}

  adapt(rows: PnadTicApiResponse): InternetAccessSeries {
    if (!Array.isArray(rows)) {
      throw new SidraServiceError(
        "invalid-response",
        "Resposta SIDRA invalida.",
      );
    }

    if (rows.length === 0) {
      throw new SidraServiceError("empty-response", "Resposta SIDRA vazia.");
    }

    const dataRows = isHeaderRow(rows[0]) ? rows.slice(1) : rows;

    if (dataRows.length === 0) {
      throw new SidraServiceError("empty-response", "Resposta SIDRA vazia.");
    }

    const firstRow = dataRows[0];
    const territory = { code: firstRow.NC, name: firstRow.NN };
    const unit = firstRow.UM ?? null;

    const pointsWithSort = dataRows
      .map((row) => toChartPoint(row))
      .filter((point): point is ChartPointWithSortKey => point !== null)
      .sort((a, b) => a.sortKey.localeCompare(b.sortKey))
      .map(({ sortKey, ...point }) => point);

    if (pointsWithSort.length === 0) {
      throw new SidraServiceError("no-data", "Sem dados validos do SIDRA.");
    }

    return {
      indicator: this.indicatorLabel,
      territory,
      unit,
      points: pointsWithSort,
    };
  }
}

interface ChartPointWithSortKey extends InternetAccessPoint {
  sortKey: string;
}

function isHeaderRow(row: PnadTicRawRow): boolean {
  const value = row.V?.toLowerCase();
  return value === "valor";
}

function extractDimensions(row: PnadTicRawRow): PnadTicDimension[] {
  const map = new Map<number, { code?: string; name?: string }>();

  Object.entries(row).forEach(([key, value]) => {
    if (!value) {
      return;
    }

    const match = /^D(\d+)([CN])$/.exec(key);
    if (!match) {
      return;
    }

    const index = Number(match[1]);
    const entry = map.get(index) ?? {};

    if (match[2] === "C") {
      entry.code = value;
    } else {
      entry.name = value;
    }

    map.set(index, entry);
  });

  return Array.from(map.entries())
    .sort(([a], [b]) => a - b)
    .map(([, value]) => ({
      code: value.code ?? "",
      name: value.name ?? value.code ?? "",
    }))
    .filter((dimension) => dimension.code || dimension.name);
}

function parseSidraNumber(value: string): number | null {
  const normalized = value.replace(/\./g, "").replace(",", ".");
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function toChartPoint(row: PnadTicRawRow): ChartPointWithSortKey | null {
  const value = parseSidraNumber(row.V ?? "");
  if (value === null) {
    return null;
  }

  const dimensions = extractDimensions(row);
  const period = dimensions[0];
  const periodLabel = period?.name || period?.code;
  const periodSortKey = period?.code || period?.name;

  if (!periodLabel || !periodSortKey) {
    return null;
  }

  return {
    period: periodLabel,
    value,
    sortKey: periodSortKey,
  };
}

function buildSidraUrl(): string {
  return `${SIDRA_BASE_URL}/t/${SIDRA_TABLE_ID}/${SIDRA_TERRITORY_LEVEL}/${SIDRA_TERRITORY_CODE}/v/${SIDRA_VARIABLE_ID}/p/${SIDRA_PERIOD}`;
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

    const payload = (await response.json()) as PnadTicApiResponse;
    const adapter = new PnadTicInternetAccessAdapter(INDICATOR_LABEL);

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
