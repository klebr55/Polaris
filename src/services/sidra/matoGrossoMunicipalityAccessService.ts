export interface MunicipalityData {
  name: string;
  ruralRate: number;
}

export async function fetchMatoGrossoMunicipalityAccess(): Promise<Map<string, MunicipalityData>> {
  const url = "https://servicodados.ibge.gov.br/api/v3/agregados/9923/periodos/2022/variaveis/93?localidades=N6[in n3[51]]&classificacao=1[6795,2]";
  const accessMap = new Map<string, MunicipalityData>();

  try {
    const response = await fetch(url, { next: { revalidate: 604800 } });
    if (!response.ok) {
      return fallbackAccessMap();
    }
    const data = await response.json();
    if (!data || !Array.isArray(data) || data.length === 0 || !data[0].resultados) {
      return fallbackAccessMap();
    }

    const totalMap = new Map<string, number>();
    const ruralMap = new Map<string, number>();
    const namesMap = new Map<string, string>();

    for (const res of data[0].resultados) {
      const isRural = res.classificacoes[0].categoria["2"] !== undefined;
      for (const item of res.series) {
        const safeId = String(item.localidade.id).substring(0, 6);
        const value = parseFloat(item.serie["2022"]);
        namesMap.set(safeId, item.localidade.nome.replace(" - MT", ""));
        if (!isNaN(value)) {
          if (isRural) {
            ruralMap.set(safeId, value);
          } else {
            totalMap.set(safeId, value);
          }
        }
      }
    }

    for (const [id, total] of totalMap.entries()) {
      const rural = ruralMap.get(id) || 0;
      const name = namesMap.get(id) || "Desconhecido";
      if (total > 0) {
        accessMap.set(id, { ruralRate: (rural / total) * 100, name });
      }
    }

    if (accessMap.size === 0) {
      return fallbackAccessMap();
    }
    return accessMap;
  } catch {
    return fallbackAccessMap();
  }
}

function fallbackAccessMap(): Map<string, MunicipalityData> {
  return new Map<string, MunicipalityData>();
}
