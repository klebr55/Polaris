export type PeriodKey = "2019" | "2020" | "2021" | "2022" | "2023";

export type SituacaoDomicilio = "Urbana" | "Rural";

export type NivelInstrucao =
  | "Sem instrução"
  | "Fundamental incompleto ou equivalente"
  | "Fundamental completo ou equivalente"
  | "Médio completo ou equivalente"
  | "Superior completo";

export type SidraCategoriaPandemia = Readonly<Record<string, string>>;

export interface SidraClassificacaoPandemia {
  readonly id: string;
  readonly nome: string;
  readonly categoria: SidraCategoriaPandemia;
}

export interface RawSidraLocalidade {
  readonly id: string;
  readonly nome: string;
  readonly nivel?: Readonly<{ id: string; nome: string }>;
}

export interface RawSidraSeriesEntry {
  readonly localidade: RawSidraLocalidade;
  readonly serie: Readonly<Record<string, string>>;
}

export interface RawSidraResultado {
  readonly classificacoes: readonly SidraClassificacaoPandemia[];
  readonly series: readonly RawSidraSeriesEntry[];
}

export interface RawSidraPandemicData {
  readonly id: string;
  readonly variavel: string;
  readonly unidade: string;
  readonly resultados: readonly RawSidraResultado[];
}

export type RawSidraPandemicResponse = readonly RawSidraPandemicData[];

export interface RawPandemicInputs {
  readonly domicilio: RawSidraPandemicResponse;
  readonly educacao: RawSidraPandemicResponse;
}

export interface PandemicDataPoint {
  readonly periodo: PeriodKey;
  readonly percentual: number;
}

export interface DomicilioImpactSeries {
  readonly situacao: SituacaoDomicilio;
  readonly pontos: readonly PandemicDataPoint[];
  readonly deltaPercentual: number;
}

export interface EducacaoImpactSeries {
  readonly nivelInstrucao: NivelInstrucao;
  readonly pontos: readonly PandemicDataPoint[];
}

export interface PandemicImpactResumo {
  readonly gapUrbanRuralPrePandemia: number;
  readonly gapUrbanRuralPosPandemia: number;
  readonly deltaUrbanoPandemia: number;
  readonly deltaRuralPandemia: number;
  readonly gapDesigualdadeEducacaoMaximo: number;
}

export interface CleanPandemicImpact {
  readonly territorio: {
    readonly id: "51";
    readonly nome: "Mato Grosso";
    readonly uf: "MT";
  };
  readonly domicilio: readonly DomicilioImpactSeries[];
  readonly educacao: readonly EducacaoImpactSeries[];
  readonly resumo: PandemicImpactResumo;
  readonly fonte: {
    readonly pesquisa: "PNAD Contínua TIC";
    readonly agregados: readonly string[];
    readonly periodos: readonly PeriodKey[];
    readonly janelaInicio: "2019";
    readonly janelaFim: "2023";
    readonly dataExtracao: string;
  };
  readonly isFallback: boolean;
}
