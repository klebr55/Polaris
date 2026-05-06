export type SidraDimensionIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type SidraDimensionCodeKey = `D${SidraDimensionIndex}C`;
export type SidraDimensionNameKey = `D${SidraDimensionIndex}N`;
export type SidraDimensionKey = SidraDimensionCodeKey | SidraDimensionNameKey;

export type SidraValue = string;

export interface SidraHeaderRow {
  [key: string]: string;
}

export interface SidraBaseRow {
  NC: string;
  NN: string;
  V: SidraValue;
  [key: string]: string | undefined;
}

export type SidraApiRow = SidraHeaderRow | SidraBaseRow;
export type SidraApiResponse = SidraApiRow[];

export interface PnadTicDimension {
  code: string;
  name: string;
}

export interface PnadTicTerritory {
  levelCode: string;
  levelName: string;
  code: string;
  name: string;
}

export interface PnadTicValue {
  raw: string;
  numeric: number | null;
  unit: string | null;
}

export interface PnadTicRecord {
  territory: PnadTicTerritory;
  indicator: PnadTicDimension;
  period: PnadTicDimension;
  breakdowns: PnadTicDimension[];
  value: PnadTicValue;
  dimensions: Record<string, PnadTicDimension>;
  metadata?: Record<string, string>;
}

export type PnadTicRawRow = SidraBaseRow & {
  [K in SidraDimensionKey]?: string;
};

export type PnadTicApiResponse = PnadTicRawRow[];
