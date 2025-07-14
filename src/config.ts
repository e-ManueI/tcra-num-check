import { ValidatorFeatures, ValidatorMode } from "./types";

/**
 * Default feature configurations for different validator modes
 */

// Basic mode: Only essential validation features
export const BASIC_MODE_FEATURES: ValidatorFeatures = {
  // Core validation features
  validateMobile: true,
  validateFixedLine: true,
  validateSpecialService: false,
  validateEmergency: false,
  validateShortCode: false,
  validateSignalingPoint: false,

  // Special service types
  validateTollFree: false,
  validatePremiumRate: false,
  validateSharedCost: false,
  validateVoIP: false,
  validatePaging: false,
  validateUAN: false,

  // Enhanced features
  validatePortability: false,
  validateCarrierSelection: false,
  allowInternational: true,
  allowExtensions: false,
  strictValidation: false,
};

// Full mode: All validation features enabled
export const FULL_MODE_FEATURES: ValidatorFeatures = {
  // Core validation features
  validateMobile: true,
  validateFixedLine: true,
  validateSpecialService: true,
  validateEmergency: true,
  validateShortCode: true,
  validateSignalingPoint: true,

  // Special service types
  validateTollFree: true,
  validatePremiumRate: true,
  validateSharedCost: true,
  validateVoIP: true,
  validatePaging: true,
  validateUAN: true,

  // Enhanced features
  validatePortability: true,
  validateCarrierSelection: true,
  allowInternational: true,
  allowExtensions: true,
  strictValidation: true,
};

// Custom mode: Default to full features, but can be overridden
export const CUSTOM_MODE_FEATURES: ValidatorFeatures = {
  ...FULL_MODE_FEATURES,
  // Users can override these with their own configuration
};

/**
 * Get default features for a given mode
 */
export function getDefaultFeatures(mode: ValidatorMode): ValidatorFeatures {
  switch (mode) {
    case "basic":
      return { ...BASIC_MODE_FEATURES };
    case "full":
      return { ...FULL_MODE_FEATURES };
    case "custom":
      return { ...CUSTOM_MODE_FEATURES };
    default:
      return { ...BASIC_MODE_FEATURES };
  }
}

/**
 * Merge user features with default features
 */
export function mergeFeatures(
  defaultFeatures: ValidatorFeatures,
  userFeatures?: Partial<ValidatorFeatures>
): ValidatorFeatures {
  if (!userFeatures) {
    return defaultFeatures;
  }

  return {
    ...defaultFeatures,
    ...userFeatures,
  };
}
