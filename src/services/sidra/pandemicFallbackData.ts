import type { CleanPandemicImpact } from "../../types/pandemicImpact";

export const fallbackPandemicData: CleanPandemicImpact = {
  territorio: {
    id: "51",
    nome: "Mato Grosso",
    uf: "MT",
  },
  domicilio: [
    {
      situacao: "Urbana",
      pontos: [
        { periodo: "2019", percentual: 76.0 },
        { periodo: "2021", percentual: 84.3 },
        { periodo: "2022", percentual: 87.0 },
      ],
      deltaPercentual: 11.0,
    },
    {
      situacao: "Rural",
      pontos: [
        { periodo: "2019", percentual: 42.0 },
        { periodo: "2021", percentual: 57.4 },
        { periodo: "2022", percentual: 62.0 },
      ],
      deltaPercentual: 20.0,
    },
  ],
  educacao: [
    {
      nivelInstrucao: "Sem instrução",
      pontos: [
        { periodo: "2019", percentual: 20.1 },
        { periodo: "2021", percentual: 31.2 },
        { periodo: "2022", percentual: 34.0 },
      ],
    },
    {
      nivelInstrucao: "Fundamental incompleto ou equivalente",
      pontos: [
        { periodo: "2019", percentual: 43.4 },
        { periodo: "2021", percentual: 55.1 },
        { periodo: "2022", percentual: 59.3 },
      ],
    },
    {
      nivelInstrucao: "Fundamental completo ou equivalente",
      pontos: [
        { periodo: "2019", percentual: 60.2 },
        { periodo: "2021", percentual: 70.8 },
        { periodo: "2022", percentual: 74.5 },
      ],
    },
    {
      nivelInstrucao: "Médio completo ou equivalente",
      pontos: [
        { periodo: "2019", percentual: 79.1 },
        { periodo: "2021", percentual: 88.3 },
        { periodo: "2022", percentual: 91.2 },
      ],
    },
    {
      nivelInstrucao: "Superior completo",
      pontos: [
        { periodo: "2019", percentual: 95.3 },
        { periodo: "2021", percentual: 98.1 },
        { periodo: "2022", percentual: 99.0 },
      ],
    },
  ],
  resumo: {
    gapUrbanRuralPrePandemia: 34.0,
    gapUrbanRuralPosPandemia: 25.0,
    deltaUrbanoPandemia: 11.0,
    deltaRuralPandemia: 20.0,
    gapDesigualdadeEducacaoMaximo: 65.0,
  },
  fonte: {
    pesquisa: "PNAD Contínua TIC",
    agregados: ["fallback"],
    periodos: ["2019", "2021", "2022"],
    dataExtracao: "2024-01-01T00:00:00.000Z",
  },
  isFallback: true,
};
