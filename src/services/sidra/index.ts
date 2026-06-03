export { SidraServiceError } from "./common";
export type { InternetAccessPoint, InternetAccessSeries } from "./pnadTicInternetAccessService";
export { fetchPnadTicInternetAccessMatoGrosso } from "./pnadTicInternetAccessService";
export type { EducationAccessPoint, EducationAccessSeries } from "./pnadTicEducationAccessService";
export { fetchPnadTicEducationAccessMatoGrosso } from "./pnadTicEducationAccessService";
export { fetchUrbanRuralAccess } from "./pnadTicUrbanRuralAccessService";
export { fetchPandemicImpact } from "./pandemicImpactAdapter";
export { fallbackPandemicData } from "./pandemicFallbackData";
export type {
  CleanPandemicImpact,
  DomicilioImpactSeries,
  EducacaoImpactSeries,
  NivelInstrucao,
  PandemicDataPoint,
  PandemicImpactResumo,
  PeriodKey,
  RawPandemicInputs,
  RawSidraPandemicData,
  RawSidraPandemicResponse,
  SituacaoDomicilio,
} from "../../types/pandemicImpact";

export { fetchMatoGrossoDigitalDivide } from "./matoGrossoTechPandemicFacade";
export { fallbackDigitalDivideMT } from "./digitalDivideFallback";
export type {
  ChoqueTrabalhoRemoto,
  DisparatedTeleworkPoint,
  EquipamentoAccessPoint,
  MatoGrossoDigitalDivideData,
  MotivoAccessPoint,
  NarrativaSummary,
  RealidadeInfraestrutura,
  RendimentoTeleworkPoint,
  RawSidraPandemic,
  RawSidraTic
} from "../../types/digitalDivide";