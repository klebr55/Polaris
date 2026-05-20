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

export interface SidraAdapter<TRaw, TSimplified> {
  adapt(data: TRaw): TSimplified;
}

export interface AggregateLocalidade {
  id: string;
  nome: string;
  nivel?: { id: string; nome: string };
}

export interface AggregateSeriesEntry {
  localidade: AggregateLocalidade;
  serie: Record<string, string>;
}

export interface AggregateResult {
  classificacoes: unknown[];
  series: AggregateSeriesEntry[];
}

export interface AggregateVariableResponse {
  id: string;
  variavel: string;
  unidade: string;
  resultados: AggregateResult[];
}

export type SidraAggregateResponse = AggregateVariableResponse[];
