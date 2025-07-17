/**
 * Types and interfaces for TCRA number validation
 */

export interface NumberValidationResult {
  isValid: boolean;
  numberType: NumberType;
  operator?: string;
  aliases?: string[];
  region?: string;
  errors: string[];
  warnings: string[];
  // Enhanced fields
  signalingPointCode?: string;
  emergencyService?: string;
  portabilityStatus?: PortabilityStatus;
  numberStatus?: NumberStatus;
  carrierSelection?: CarrierSelection;
}

export enum NumberType {
  MOBILE = "mobile",
  FIXED_LINE = "fixed_line",
  TOLL_FREE = "toll_free",
  PREMIUM_RATE = "premium_rate",
  SHARED_COST = "shared_cost",
  VOIP = "voip",
  PAGING = "paging",
  UAN = "uan", // Universal Access Number
  EMERGENCY = "emergency",
  SHORT_CODE = "short_code",
  SIGNALING_POINT = "signaling_point",
  INVALID = "invalid",
}

export enum PortabilityStatus {
  PORTABLE = "portable",
  NON_PORTABLE = "non_portable",
  UNKNOWN = "unknown",
}

export enum NumberStatus {
  ACTIVE = "active",
  RESERVED = "reserved",
  ASSIGNED = "assigned",
  UNASSIGNED = "unassigned",
  BLOCKED = "blocked",
}

export enum CarrierSelection {
  AUTOMATIC = "automatic",
  MANUAL = "manual",
  NOT_APPLICABLE = "not_applicable",
}

// Validator modes
export type ValidatorMode = "basic" | "full" | "custom";

// Feature configuration
export interface ValidatorFeatures {
  // Core validation features
  validateMobile: boolean;
  validateFixedLine: boolean;
  validateSpecialService: boolean;
  validateEmergency: boolean;
  validateShortCode: boolean;
  validateSignalingPoint: boolean;

  // Special service types (only used if validateSpecialService is true)
  validateTollFree: boolean;
  validatePremiumRate: boolean;
  validateSharedCost: boolean;
  validateVoIP: boolean;
  validatePaging: boolean;
  validateUAN: boolean;

  // Enhanced features
  validatePortability: boolean;
  validateCarrierSelection: boolean;
  allowInternational: boolean;
  allowExtensions: boolean;
  strictValidation: boolean;
}

// Validator configuration
export interface ValidatorConfig {
  mode?: ValidatorMode;
  features?: Partial<ValidatorFeatures>;
  numberingPlan?: NumberingPlan;
}

export interface OperatorInfo {
  name: string;
  codes: string[];
  type: NumberType;
  licenseNumber?: string;
  serviceAreas?: string[];
  portabilitySupported?: boolean;
  aliases?: string[];
}

export interface SignalingPointCode {
  code: string;
  description: string;
  type:
    | "STP"
    | "SSP"
    | "SCP"
    | "HLR"
    | "VLR"
    | "MSC"
    | "GMSC"
    | "SMSC"
    | "MMSC";
  operator: string;
  location?: string;
  status: "active" | "inactive" | "reserved";
}

export interface EmergencyService {
  code: string;
  service: string;
  description: string;
  priority: "high" | "medium" | "low";

  // TODO: ADD STATUS FIELD
}

export interface TollFreeService {
  prefix: string;
  subPrefix: string;
  operator: string;
  service: string;
  status: string;
  description: string;
}

export interface PremiumRateService {
  prefix: string;
  subPrefix: string;
  operator: string;
  service: string;
  status: string;
  description: string;
}

export interface NumberingPlan {
  countryCode: string;
  nationalPrefix: string;
  mobilePrefixes: string[];
  fixedLinePrefixes: string[];
  tollFreePrefixes: string[];
  premiumRatePrefixes: string[];
  sharedCostPrefixes: string[];
  voipPrefixes: string[];
  pagingPrefixes: string[];
  uanPrefixes: string[];
  emergencyPrefixes: string[];
  shortCodePrefixes: string[];
  signalingPointCodes: SignalingPointCode[];
  emergencyServices: EmergencyService[];
  tollFreeServices: TollFreeService[];
  premiumRateServices: PremiumRateService[];
  operators: OperatorInfo[];
  // Enhanced fields
  numberPortability?: {
    enabled: boolean;
    supportedTypes: NumberType[];
    portingTime?: string;
  };
  carrierSelection?: {
    enabled: boolean;
    codes: string[];
  };
  numberReservation?: {
    enabled: boolean;
    maxReservationDays: number;
  };
}

export interface ValidationOptions {
  strict?: boolean;
  allowInternational?: boolean;
  allowExtensions?: boolean;
  checkPortability?: boolean;
  checkCarrierSelection?: boolean;
  validateSignalingPoint?: boolean;
  allowReservedNumbers?: boolean;
  // Mode and feature overrides
  mode?: ValidatorMode;
  features?: Partial<ValidatorFeatures>;
}

export interface NumberFormatOptions {
  format: "national" | "international" | "e164" | "rfc3966";
  includeExtension?: boolean;
  includeCarrierSelection?: boolean;
}

export interface NumberingPlanQuery {
  numberType?: NumberType;
  operator?: string;
  region?: string;
  status?: NumberStatus;
  portabilityStatus?: PortabilityStatus;
}

export interface NumberingPlanStatistics {
  totalNumbers: number;
  assignedNumbers: number;
  reservedNumbers: number;
  availableNumbers: number;
  byType: Record<NumberType, number>;
  byOperator: Record<string, number>;
  byRegion: Record<string, number>;
}
