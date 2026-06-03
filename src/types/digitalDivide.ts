export type SidraCategoria = Readonly<Record<string, string>>;

export interface SidraClassificacaoV3 {
  readonly id: string;
  readonly nome: string;
  readonly categoria: SidraCategoria;
}

export interface SidraLocalidadeV3 {
  readonly id: string;
  readonly nome: string;
  readonly nivel?: Readonly<{ id: string; nome: string }>;
}

export interface SidraSeriesEntryV3 {
  readonly localidade: SidraLocalidadeV3;
  readonly serie: Readonly<Record<string, string>>;
}

export interface SidraResultadoV3 {
  readonly classificacoes: readonly SidraClassificacaoV3[];
  readonly series: readonly SidraSeriesEntryV3[];
}

export interface SidraVariableV3 {
  readonly id: string;
  readonly variavel: string;
  readonly unidade: string;
  readonly resultados: readonly SidraResultadoV3[];
}

export type SidraResponseV3 = readonly SidraVariableV3[];

export interface RawSidraPandemic {
  readonly pesquisa: "PNAD COVID-19";
  readonly tabela: "6817" | "6821" | "6841";
  readonly payload: SidraResponseV3;
}

export interface RawSidraTic {
  readonly pesquisa: "PNAD Contínua TIC";
  readonly tabela: "7447" | "7454" | "7455";
  readonly payload: SidraResponseV3;
}

export interface RendimentoTeleworkPoint {
  readonly faixaRendimento: string;
  readonly percentualTeletrabalho: number;
}

export interface DisparatedTeleworkPoint {
  readonly grupo: string;
  readonly percentualTeletrabalho: number;
}

export interface ChoqueTrabalhoRemoto {
  readonly percentualAfastadosDistanciamento: number;
  readonly teleworkByRendimento: readonly RendimentoTeleworkPoint[];
  readonly teleworkByCorRaca: readonly DisparatedTeleworkPoint[];
  readonly teleworkByEscolaridade: readonly DisparatedTeleworkPoint[];
}

export interface MotivoAccessPoint {
  readonly motivo: string;
  readonly percentual: number;
}

export interface EquipamentoAccessPoint {
  readonly equipamento: string;
  readonly percentualUsuarios: number;
}

export interface RealidadeInfraestrutura {
  readonly percentualDomiciliosSemInternet: number;
  readonly motivosDomiciliosSemInternet: readonly MotivoAccessPoint[];
  readonly equipamentosUtilizados: readonly EquipamentoAccessPoint[];
  readonly motivosFaltaAcessoPessoas: readonly MotivoAccessPoint[];
}

export interface NarrativaSummary {
  readonly gapTeleworkRendimentoExtremo: number;
  readonly percentualDependenciaCelular: number;
  readonly principalBarreiraAcesso: string;
  readonly percentualAfastadosEmTeletrabalho: number;
}

export interface MatoGrossoDigitalDivideData {
  readonly territorio: {
    readonly id: "51";
    readonly nome: "Mato Grosso";
    readonly uf: "MT";
  };
  readonly choqueTrabalhoRemoto: ChoqueTrabalhoRemoto;
  readonly realidadeInfraestrutura: RealidadeInfraestrutura;
  readonly resumoNarrativo: NarrativaSummary;
  readonly fonte: {
    readonly pesquisas: readonly ("PNAD COVID-19" | "PNAD Contínua TIC")[];
    readonly tabelas: readonly string[];
    readonly referencia: string;
    readonly dataExtracao: string;
  };
  readonly isFallback: boolean;
}
