import { SidraServiceError, type SidraAggregateResponse } from "./common";

export interface UrbanRuralAccess {
  urbanPercent: number;
  ruralPercent: number;
  year: string;
}

const SIDRA_BASE_URL = process.env.SIDRA_BASE_URL || "https://servicodados.ibge.gov.br/api/v3/agregados";
const SIDRA_AGGREGATE_ID = "4862";
const SIDRA_VARIABLE_ID = "5000";
const SIDRA_TERRITORY_LEVEL = "N3";
const SIDRA_TERRITORY_CODE = "51";
const SIDRA_PERIOD = "all";

export async function fetchUrbanRuralAccess(): Promise<UrbanRuralAccess> {
  const url = `${SIDRA_BASE_URL}/${SIDRA_AGGREGATE_ID}/periodos/${SIDRA_PERIOD}/variaveis/${SIDRA_VARIABLE_ID}?localidades=${SIDRA_TERRITORY_LEVEL}[${SIDRA_TERRITORY_CODE}]&classificacao=1[1,2]`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new SidraServiceError(
        "http-error",
        `SIDRA respondeu com status ${response.status}.`,
      );
    }

    const payload = (await response.json()) as SidraAggregateResponse;

    if (!Array.isArray(payload) || payload.length === 0) {
      throw new SidraServiceError("empty-response", "Resposta SIDRA vazia.");
    }

    const variableData = payload[0];
    const results = variableData?.resultados ?? [];

    if (results.length < 2) {
      throw new SidraServiceError("no-data", "Dados urbanos ou rurais ausentes.");
    }

    let urbanPercent = 0;
    let ruralPercent = 0;
    let latestYear = "";

    for (const result of results) {
      const isUrbana = result.classificacoes.some(
        (c: any) => c.id === "1" && Object.keys(c.categoria || {}).includes("1")
      );
      const isRural = result.classificacoes.some(
        (c: any) => c.id === "1" && Object.keys(c.categoria || {}).includes("2")
      );

      const seriesEntry = result.series?.[0]?.serie;
      if (!seriesEntry) continue;

      const years = Object.keys(seriesEntry).sort((a, b) => Number(a) - Number(b));
      let lastValidYear = "";
      let lastValidValue = 0;

      for (let i = years.length - 1; i >= 0; i--) {
        const year = years[i];
        const rawValue = seriesEntry[year];
        const value = parseSidraNumber(rawValue);
        if (value !== null) {
          lastValidYear = year;
          lastValidValue = value;
          break;
        }
      }

      if (isUrbana) {
        urbanPercent = lastValidValue;
        if (!latestYear || lastValidYear > latestYear) {
          latestYear = lastValidYear;
        }
      } else if (isRural) {
        ruralPercent = lastValidValue;
        if (!latestYear || lastValidYear > latestYear) {
          latestYear = lastValidYear;
        }
      }
    }

    if (urbanPercent === 0 && ruralPercent === 0) {
      throw new SidraServiceError("no-data", "Sem dados validos do SIDRA.");
    }

    return {
      urbanPercent,
      ruralPercent,
      year: latestYear,
    };
  } catch (error) {
    if (error instanceof SidraServiceError) {
      throw error;
    }

    throw new SidraServiceError(
      "unexpected-error",
      "Falha ao consumir o SIDRA para Urban/Rural.",
      error,
    );
  }
}

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
