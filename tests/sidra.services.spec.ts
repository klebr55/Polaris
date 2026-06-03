/**
 * Testes de backend — Serviços SIDRA
 * Cobertura: parseSidraNumber, SidraServiceError, adaptadores Internet/Educação,
 * fetchPnadTicInternetAccessMatoGrosso, fetchPnadTicEducationAccessMatoGrosso
 */

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { SidraServiceError } from "../src/services/sidra/common";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — fábricas de respostas SIDRA
// ─────────────────────────────────────────────────────────────────────────────

function makeSidraPayload(
  serie: Record<string, string>,
  variavel = "Indicador Teste",
  unidade = "%",
  localidadeId = "51",
  localidadeNome = "Mato Grosso",
) {
  return [
    {
      id: "1",
      variavel,
      unidade,
      resultados: [
        {
          classificacoes: [],
          series: [
            {
              localidade: { id: localidadeId, nome: localidadeNome },
              serie,
            },
          ],
        },
      ],
    },
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. SidraServiceError
// ─────────────────────────────────────────────────────────────────────────────

describe("SidraServiceError", () => {
  it("deve herdar de Error", () => {
    const err = new SidraServiceError("http-error", "Algo deu errado.");
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(SidraServiceError);
  });

  it("deve expor o code correto", () => {
    const err = new SidraServiceError("empty-response", "Vazio.");
    expect(err.code).toBe("empty-response");
  });

  it("deve usar a mensagem fornecida", () => {
    const err = new SidraServiceError("no-data", "Sem dados.");
    expect(err.message).toBe("Sem dados.");
  });

  it("deve definir name como SidraServiceError", () => {
    const err = new SidraServiceError("invalid-response", "Inválido.");
    expect(err.name).toBe("SidraServiceError");
  });

  it("deve armazenar a causa opcional", () => {
    const cause = new Error("causa original");
    const err = new SidraServiceError("unexpected-error", "Inesperado.", cause);
    expect(err.cause).toBe(cause);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 2. fetchPnadTicInternetAccessMatoGrosso — testes via fetch mockado
// ─────────────────────────────────────────────────────────────────────────────

describe("fetchPnadTicInternetAccessMatoGrosso", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function importFresh() {
    // força re-import para respeitar variáveis de ambiente redefinidas
    return import("../src/services/sidra/pnadTicInternetAccessService");
  }

  it("deve retornar uma InternetAccessSeries válida para payload correto", async () => {
    const payload = makeSidraPayload({
      "2019": "72.5",
      "2020": "75.1",
      "2021": "78.3",
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicInternetAccessMatoGrosso();

    expect(result.territory.code).toBe("51");
    expect(result.territory.name).toBe("Mato Grosso");
    expect(result.points.length).toBeGreaterThan(0);
    expect(result.points[0].period).toBe("2019");
    expect(result.points[0].value).toBe(72.5);
  });

  it("deve lançar SidraServiceError com code http-error para status 500", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: "Internal Server Error" }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicInternetAccessMatoGrosso()).rejects.toMatchObject({
      code: "http-error",
    });
  });

  it("deve lançar SidraServiceError para resposta vazia (array vazio)", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicInternetAccessMatoGrosso()).rejects.toThrow(
      SidraServiceError,
    );
  });

  it("deve lançar SidraServiceError para payload não-array", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ erro: true }), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicInternetAccessMatoGrosso()).rejects.toThrow(
      SidraServiceError,
    );
  });

  it("deve ordenar os pontos cronologicamente", async () => {
    const payload = makeSidraPayload({
      "2021": "80.0",
      "2017": "60.0",
      "2019": "70.0",
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicInternetAccessMatoGrosso();

    const years = result.points.map((p) => Number(p.period));
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeGreaterThan(years[i - 1]);
    }
  });

  it("deve interpoler anos faltantes entre pontos", async () => {
    // Somente 2017 e 2019 — espera 2018 interpolado
    const payload = makeSidraPayload({ "2017": "60.0", "2019": "80.0" });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicInternetAccessMatoGrosso();

    const periods = result.points.map((p) => p.period);
    expect(periods).toContain("2018");

    const pt2018 = result.points.find((p) => p.period === "2018");
    expect(pt2018?.value).toBeCloseTo(70, 0);
  });

  it("deve ignorar valores inválidos como '..', '...' e 'X'", async () => {
    const payload = makeSidraPayload({
      "2017": "60.0",
      "2018": "..",
      "2019": "...",
      "2020": "X",
      "2021": "78.0",
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicInternetAccessMatoGrosso();

    // Anos com valor inválido não devem aparecer como pontos diretos (podem ser interpolados)
    const rawPeriods = result.points.map((p) => p.period);
    expect(rawPeriods).toContain("2017");
    expect(rawPeriods).toContain("2021");
  });

  it("deve converter vírgula como separador decimal", async () => {
    const payload = makeSidraPayload({ "2022": "85,7" });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicInternetAccessMatoGrosso();

    expect(result.points[0].value).toBeCloseTo(85.7);
  });

  it("deve lançar unexpected-error para falha de rede", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("Network failure"));

    const { fetchPnadTicInternetAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicInternetAccessMatoGrosso()).rejects.toMatchObject({
      code: "unexpected-error",
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 3. fetchPnadTicEducationAccessMatoGrosso — testes via fetch mockado
// ─────────────────────────────────────────────────────────────────────────────

describe("fetchPnadTicEducationAccessMatoGrosso", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  async function importFresh() {
    return import("../src/services/sidra/pnadTicEducationAccessService");
  }

  it("deve retornar EducationAccessSeries válida", async () => {
    const payload = makeSidraPayload({
      "2019": "72.3",
      "2021": "87.6",
      "2022": "90.2",
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicEducationAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicEducationAccessMatoGrosso();

    expect(result.territory.code).toBe("51");
    expect(result.points.length).toBeGreaterThan(0);
    expect(result.points[0].value).toBe(72.3);
  });

  it("deve lançar SidraServiceError para status 404", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 404, statusText: "Not Found" }),
    );

    const { fetchPnadTicEducationAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicEducationAccessMatoGrosso()).rejects.toMatchObject({
      code: "http-error",
    });
  });

  it("deve lançar SidraServiceError para resposta vazia", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify([]), { status: 200 }),
    );

    const { fetchPnadTicEducationAccessMatoGrosso } = await importFresh();

    await expect(fetchPnadTicEducationAccessMatoGrosso()).rejects.toThrow(
      SidraServiceError,
    );
  });

  it("deve retornar pontos em ordem cronológica crescente", async () => {
    const payload = makeSidraPayload({
      "2022": "90.2",
      "2019": "72.3",
      "2021": "87.6",
    });

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );

    const { fetchPnadTicEducationAccessMatoGrosso } = await importFresh();
    const result = await fetchPnadTicEducationAccessMatoGrosso();

    const years = result.points.map((p) => Number(p.period));
    for (let i = 1; i < years.length; i++) {
      expect(years[i]).toBeGreaterThan(years[i - 1]);
    }
  });

  it("deve lançar unexpected-error para falha de rede", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new TypeError("fetch failed"));

    const { fetchPnadTicEducationAccessMatoGrosso } = await importFresh();

    await expect(
      fetchPnadTicEducationAccessMatoGrosso(),
    ).rejects.toMatchObject({ code: "unexpected-error" });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. parseSidraNumber — testada indiretamente via adapters + casos de borda
//    Usamos a função de serviço para exercitar todos os caminhos
// ─────────────────────────────────────────────────────────────────────────────

describe("parseSidraNumber — cobertura de borda via serviço", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("deve tratar separador de milhar com ponto (ex: 1.234)", async () => {
    const payload = makeSidraPayload({ "2022": "1.234" });
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    const { fetchPnadTicInternetAccessMatoGrosso } = await import(
      "../src/services/sidra/pnadTicInternetAccessService"
    );
    const result = await fetchPnadTicInternetAccessMatoGrosso();
    // 1.234 com ponto de milhar → 1234
    expect(result.points[0].value).toBe(1234);
  });

  it("deve tratar número com vírgula e ponto (ex: 1.234,56)", async () => {
    const payload = makeSidraPayload({ "2022": "1.234,56" });
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    const { fetchPnadTicInternetAccessMatoGrosso } = await import(
      "../src/services/sidra/pnadTicInternetAccessService"
    );
    const result = await fetchPnadTicInternetAccessMatoGrosso();
    expect(result.points[0].value).toBeCloseTo(1234.56);
  });

  it("deve lançar no-data quando todos os valores da série são inválidos", async () => {
    const payload = makeSidraPayload({
      "2019": "..",
      "2020": "...",
      "2021": "X",
    });
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    const { fetchPnadTicInternetAccessMatoGrosso } = await import(
      "../src/services/sidra/pnadTicInternetAccessService"
    );
    await expect(fetchPnadTicInternetAccessMatoGrosso()).rejects.toMatchObject({
      code: "no-data",
    });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. fetchUrbanRuralAccess — testes via fetch mockado
// ─────────────────────────────────────────────────────────────────────────────

describe("fetchUrbanRuralAccess", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function makeUrbanRuralPayload(
    urbanSerie: Record<string, string>,
    ruralSerie: Record<string, string>,
  ) {
    return [
      {
        id: "1",
        variavel: "Proporção de domicílios com internet",
        unidade: "%",
        resultados: [
          {
            classificacoes: [{ id: "1", categoria: { "1": "Urbana" } }],
            series: [
              {
                localidade: { id: "51", nome: "Mato Grosso" },
                serie: urbanSerie,
              },
            ],
          },
          {
            classificacoes: [{ id: "1", categoria: { "2": "Rural" } }],
            series: [
              {
                localidade: { id: "51", nome: "Mato Grosso" },
                serie: ruralSerie,
              },
            ],
          },
        ],
      },
    ];
  }

  it("deve retornar urbanPercent e ruralPercent válidos", async () => {
    const payload = makeUrbanRuralPayload(
      { "2022": "87.0" },
      { "2022": "62.0" },
    );
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify(payload), { status: 200 }),
    );
    const { fetchUrbanRuralAccess } = await import(
      "../src/services/sidra/pnadTicUrbanRuralAccessService"
    );
    const result = await fetchUrbanRuralAccess();
    expect(result.urbanPercent).toBe(87.0);
    expect(result.ruralPercent).toBe(62.0);
    expect(result.year).toBe("2022");
  });

  it("deve lançar SidraServiceError para status não-ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(null, { status: 503 }),
    );
    const { fetchUrbanRuralAccess } = await import(
      "../src/services/sidra/pnadTicUrbanRuralAccessService"
    );
    await expect(fetchUrbanRuralAccess()).rejects.toMatchObject({
      code: "http-error",
    });
  });

  it("deve lançar SidraServiceError para array vazio", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), { status: 200 }),
    );
    const { fetchUrbanRuralAccess } = await import(
      "../src/services/sidra/pnadTicUrbanRuralAccessService"
    );
    await expect(fetchUrbanRuralAccess()).rejects.toThrow(SidraServiceError);
  });
});
