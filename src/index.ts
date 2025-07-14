/**
 * TCRA Number Check - Tanzanian Phone Number Validator
 *
 * A comprehensive TypeScript library for validating Tanzanian phone numbers
 * according to the TCRA (Tanzania Communications Regulatory Authority)
 * National Numbering Plan and Signaling Point Codes Plan.
 *
 * This package covers all aspects of the numbering plan including:
 * - Mobile and fixed line number validation
 * - Emergency services and short codes
 * - Signaling point codes (STP, HLR, VLR, etc.)
 * - Number portability and carrier selection
 * - Special service numbers (toll-free, premium rate, etc.)
 * - Number formatting and querying capabilities
 * - Comprehensive statistics and reporting
 * - Multiple validation modes (basic, full, custom)
 *
 * @example
 * ```typescript
 * import { TCRANumberValidator, NumberType, ValidatorMode } from 'tcra-num-check';
 *
 * // Basic mode - only mobile and fixed line validation
 * const basicValidator = new TCRANumberValidator({ mode: 'basic' });
 *
 * // Full mode - all features enabled
 * const fullValidator = new TCRANumberValidator({ mode: 'full' });
 *
 * // Custom mode with specific features
 * const customValidator = new TCRANumberValidator({
 *   mode: 'custom',
 *   features: {
 *     validateMobile: true,
 *     validateEmergency: true,
 *     validateSignalingPoint: false
 *   }
 * });
 *
 * // Validate a mobile number
 * const result = basicValidator.validate('0712345678');
 * console.log(result.isValid); // true
 * console.log(result.numberType); // NumberType.MOBILE
 * console.log(result.operator); // 'Airtel Tanzania'
 *
 * // Validate with portability check
 * const resultWithPortability = fullValidator.validate('0712345678', {
 *   checkPortability: true
 * });
 * console.log(resultWithPortability.portabilityStatus); // PortabilityStatus.PORTABLE
 *
 * // Format to international
 * const international = basicValidator.formatInternational('0712345678');
 * console.log(international); // '+255712345678'
 *
 * // Query numbering plan
 * const mobileNumbers = fullValidator.queryNumberingPlan({
 *   numberType: NumberType.MOBILE
 * });
 *
 * // Get statistics
 * const stats = fullValidator.getNumberingPlanStatistics();
 * console.log(stats.totalNumbers); // Total available numbers
 * ```
 */

export { TCRANumberValidator } from "./validator";
export { TANZANIAN_NUMBERING_PLAN } from "./numberingPlan";

// Export configuration
export {
  getDefaultFeatures,
  mergeFeatures,
  BASIC_MODE_FEATURES,
  FULL_MODE_FEATURES,
  CUSTOM_MODE_FEATURES,
} from "./config";

// Export all types and enums
export type {
  NumberValidationResult,
  NumberType,
  ValidationOptions,
  NumberingPlan,
  OperatorInfo,
  SignalingPointCode,
  EmergencyService,
  PortabilityStatus,
  NumberStatus,
  CarrierSelection,
  NumberFormatOptions,
  NumberingPlanQuery,
  NumberingPlanStatistics,
  ValidatorMode,
  ValidatorFeatures,
  ValidatorConfig,
} from "./types";

// Export enums for convenience
export {
  NumberType as NumberTypes,
  PortabilityStatus as PortabilityStatuses,
  NumberStatus as NumberStatuses,
  CarrierSelection as CarrierSelections,
} from "./types";
