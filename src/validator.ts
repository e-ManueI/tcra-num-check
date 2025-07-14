import {
  NumberValidationResult,
  NumberType,
  ValidationOptions,
  NumberingPlan,
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
import { TANZANIAN_NUMBERING_PLAN } from "./numberingPlan";
import { getDefaultFeatures, mergeFeatures } from "./config";

/**
 * TCRA Number Validator
 * Validates Tanzanian phone numbers according to the national numbering plan
 * Comprehensive implementation covering all aspects of the numbering plan
 * Supports multiple modes: basic, full, and custom
 */
export class TCRANumberValidator {
  private numberingPlan: NumberingPlan;
  private mode: ValidatorMode;
  private features: ValidatorFeatures;

  constructor(config?: ValidatorConfig) {
    this.numberingPlan = config?.numberingPlan || TANZANIAN_NUMBERING_PLAN;
    this.mode = config?.mode || "basic";

    // Initialize features based on mode and user overrides
    const defaultFeatures = getDefaultFeatures(this.mode);
    this.features = mergeFeatures(defaultFeatures, config?.features);
  }

  /**
   * Set the validator mode
   * @param mode - The mode to set
   * @param features - Optional features to override
   */
  setMode(mode: ValidatorMode, features?: Partial<ValidatorFeatures>): void {
    this.mode = mode;
    const defaultFeatures = getDefaultFeatures(mode);
    this.features = mergeFeatures(defaultFeatures, features);
  }

  /**
   * Get the current mode
   */
  getMode(): ValidatorMode {
    return this.mode;
  }

  /**
   * Get the current features configuration
   */
  getFeatures(): ValidatorFeatures {
    return { ...this.features };
  }

  /**
   * Update specific features
   * @param features - Features to update
   */
  updateFeatures(features: Partial<ValidatorFeatures>): void {
    this.features = { ...this.features, ...features };
  }

  /**
   * Validates a Tanzanian phone number
   * @param phoneNumber - The phone number to validate
   * @param options - Validation options
   * @returns Validation result with details
   */
  validate(
    phoneNumber: string,
    options: ValidationOptions = {}
  ): NumberValidationResult {
    const result: NumberValidationResult = {
      isValid: false,
      numberType: NumberType.INVALID,
      errors: [],
      warnings: [],
    };

    try {
      // Clean the phone number
      const cleanedNumber = this.cleanNumber(phoneNumber);

      // Get effective features (class features + per-call overrides)
      const effectiveFeatures = this.getEffectiveFeatures(options);

      // Basic format validation
      if (!this.isValidFormat(cleanedNumber, effectiveFeatures)) {
        result.errors.push("Invalid phone number format");
        return result;
      }

      // Extract number parts
      const numberParts = this.extractNumberParts(
        cleanedNumber,
        effectiveFeatures
      );
      if (!numberParts) {
        result.errors.push("Unable to parse phone number");
        return result;
      }

      // Validate number type and get operator info
      const validation = this.validateNumberType(
        numberParts,
        effectiveFeatures
      );

      result.isValid = validation.isValid;
      result.numberType = validation.numberType;
      if (validation.operator) {
        result.operator = validation.operator;
      }
      if (validation.region) {
        result.region = validation.region;
      }
      if (validation.signalingPointCode) {
        result.signalingPointCode = validation.signalingPointCode;
      }
      if (validation.emergencyService) {
        result.emergencyService = validation.emergencyService;
      }
      if (
        effectiveFeatures.validatePortability &&
        validation.portabilityStatus
      ) {
        result.portabilityStatus = validation.portabilityStatus;
      }
      if (validation.numberStatus) {
        result.numberStatus = validation.numberStatus;
      }
      if (validation.carrierSelection) {
        result.carrierSelection = validation.carrierSelection;
      }
      result.errors.push(...validation.errors);
      result.warnings.push(...validation.warnings);
      if (
        !effectiveFeatures.validatePortability &&
        "portabilityStatus" in result
      ) {
        delete result.portabilityStatus;
      }
    } catch (error) {
      result.errors.push(
        `Validation error: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }

    return result;
  }

  /**
   * Get effective features combining class features with per-call overrides
   */
  private getEffectiveFeatures(options: ValidationOptions): ValidatorFeatures {
    let effectiveFeatures = { ...this.features };

    // Apply per-call mode override
    if (options.mode) {
      const modeFeatures = getDefaultFeatures(options.mode);
      effectiveFeatures = mergeFeatures(modeFeatures, this.features);
    }

    // Apply per-call feature overrides
    if (options.features) {
      effectiveFeatures = { ...effectiveFeatures, ...options.features };
    }

    // Apply legacy options for backward compatibility
    if (options.allowInternational !== undefined) {
      effectiveFeatures.allowInternational = options.allowInternational;
    }
    if (options.validateSignalingPoint !== undefined) {
      effectiveFeatures.validateSignalingPoint = options.validateSignalingPoint;
    }
    if (options.checkPortability !== undefined) {
      effectiveFeatures.validatePortability = options.checkPortability;
    }
    if (options.checkCarrierSelection !== undefined) {
      effectiveFeatures.validateCarrierSelection =
        options.checkCarrierSelection;
    }

    return effectiveFeatures;
  }

  /**
   * Cleans a phone number by removing non-digit characters
   */
  private cleanNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\D/g, "");
  }

  /**
   * Checks if the number format is valid
   */
  private isValidFormat(
    cleanedNumber: string,
    features: ValidatorFeatures
  ): boolean {
    // Check minimum length
    if (cleanedNumber.length < 3) {
      return false;
    }

    // Check maximum length
    if (cleanedNumber.length > 12) {
      return false;
    }

    // If international format is allowed, check for country code
    if (
      features.allowInternational &&
      cleanedNumber.startsWith(this.numberingPlan.countryCode)
    ) {
      const nationalNumber = cleanedNumber.substring(
        this.numberingPlan.countryCode.length
      );
      return nationalNumber.length >= 3;
    }

    // If international format is not allowed and number starts with country code, reject it
    if (
      !features.allowInternational &&
      cleanedNumber.startsWith(this.numberingPlan.countryCode)
    ) {
      return false;
    }

    return true;
  }

  /**
   * Extracts number parts (country code, national prefix, subscriber number)
   */
  private extractNumberParts(
    cleanedNumber: string,
    _features: ValidatorFeatures
  ) {
    let nationalNumber: string;
    let hasCountryCode = false;

    // Check if number starts with country code
    if (cleanedNumber.startsWith(this.numberingPlan.countryCode)) {
      nationalNumber = cleanedNumber.substring(
        this.numberingPlan.countryCode.length
      );
      hasCountryCode = true;
    } else {
      nationalNumber = cleanedNumber;
    }

    // Remove national prefix if present (for all number types)
    if (nationalNumber.startsWith(this.numberingPlan.nationalPrefix)) {
      nationalNumber = nationalNumber.substring(
        this.numberingPlan.nationalPrefix.length
      );
    }

    return {
      nationalNumber,
      hasCountryCode,
      fullNumber: cleanedNumber,
    };
  }

  /**
   * Validates the number type and determines operator
   */
  private validateNumberType(numberParts: any, features: ValidatorFeatures) {
    const { nationalNumber } = numberParts;

    const result: any = {
      isValid: false,
      numberType: NumberType.INVALID as NumberType,
      operator: undefined as string | undefined,
      region: undefined as string | undefined,
      signalingPointCode: undefined as string | undefined,
      emergencyService: undefined as string | undefined,
      numberStatus: undefined as NumberStatus | undefined,
      carrierSelection: undefined as CarrierSelection | undefined,
      errors: [] as string[],
      warnings: [] as string[],
    };

    // Check emergency numbers first (3 digits)
    if (features.validateEmergency && nationalNumber.length === 3) {
      if (this.numberingPlan.emergencyPrefixes.includes(nationalNumber)) {
        result.isValid = true;
        result.numberType = NumberType.EMERGENCY;
        result.emergencyService = this.getEmergencyService(nationalNumber);
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
    }

    // Check short codes (3 digits)
    if (features.validateShortCode && nationalNumber.length === 3) {
      if (this.numberingPlan.shortCodePrefixes.includes(nationalNumber)) {
        result.isValid = true;
        result.numberType = NumberType.SHORT_CODE;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
    }

    // Check special service numbers (3 digits prefix + 6 digits subscriber, total 9 digits after national prefix removal)
    if (nationalNumber.length === 9) {
      const prefix3 = nationalNumber.substring(0, 3);
      const fullPrefix = `0${prefix3}`;
      // If the number matches any special service prefix but the feature is disabled, return invalid
      if (
        (this.numberingPlan.tollFreePrefixes.includes(fullPrefix) &&
          !features.validateTollFree) ||
        (this.numberingPlan.premiumRatePrefixes.includes(fullPrefix) &&
          !features.validatePremiumRate) ||
        (this.numberingPlan.sharedCostPrefixes.includes(fullPrefix) &&
          !features.validateSharedCost) ||
        (this.numberingPlan.voipPrefixes.includes(fullPrefix) &&
          !features.validateVoIP) ||
        (this.numberingPlan.pagingPrefixes.includes(fullPrefix) &&
          !features.validatePaging) ||
        (this.numberingPlan.uanPrefixes.includes(fullPrefix) &&
          !features.validateUAN)
      ) {
        result.errors.push(
          "Special service number type is not enabled in current mode"
        );
        return result;
      }
      // Check each special service type individually based on feature flags
      if (
        features.validateTollFree &&
        this.numberingPlan.tollFreePrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.TOLL_FREE;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
      if (
        features.validatePremiumRate &&
        this.numberingPlan.premiumRatePrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.PREMIUM_RATE;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
      if (
        features.validateSharedCost &&
        this.numberingPlan.sharedCostPrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.SHARED_COST;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
      if (
        features.validateVoIP &&
        this.numberingPlan.voipPrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.VOIP;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
      if (
        features.validatePaging &&
        this.numberingPlan.pagingPrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.PAGING;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
      if (
        features.validateUAN &&
        this.numberingPlan.uanPrefixes.includes(fullPrefix)
      ) {
        result.isValid = true;
        result.numberType = NumberType.UAN;
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
    }

    // Check signaling point codes if enabled and not already matched
    if (
      features.validateSignalingPoint &&
      nationalNumber.length >= 9 &&
      nationalNumber.length <= 12
    ) {
      const spc = this.validateSignalingPointCode(nationalNumber);
      if (spc) {
        result.isValid = true;
        result.numberType = NumberType.SIGNALING_POINT;
        result.signalingPointCode = spc.code;
        result.operator = spc.operator;
        result.numberStatus =
          spc.status === "active" ? NumberStatus.ACTIVE : NumberStatus.BLOCKED;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        return result;
      }
    }

    // Check mobile numbers (9 digits total: 2 prefix + 7 subscriber)
    if (features.validateMobile && nationalNumber.length === 9) {
      const prefix = nationalNumber.substring(0, 2);
      if (this.numberingPlan.mobilePrefixes.includes(prefix)) {
        result.isValid = true;
        result.numberType = NumberType.MOBILE;
        result.operator = this.getOperatorByPrefix(prefix);
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.AUTOMATIC;
        if (features.validatePortability) {
          result.portabilityStatus = this.getPortabilityStatus(
            NumberType.MOBILE
          );
        }
        return result;
      }
    }

    // Check fixed line numbers (9 digits total: 2 prefix + 7 subscriber)
    if (features.validateFixedLine && nationalNumber.length === 9) {
      const prefix = nationalNumber.substring(0, 2);
      if (this.numberingPlan.fixedLinePrefixes.includes(prefix)) {
        result.isValid = true;
        result.numberType = NumberType.FIXED_LINE;
        result.operator = this.getOperatorByPrefix(prefix);
        result.region = this.getRegionByPrefix(prefix);
        result.numberStatus = NumberStatus.ACTIVE;
        result.carrierSelection = CarrierSelection.NOT_APPLICABLE;
        if (features.validatePortability) {
          result.portabilityStatus = this.getPortabilityStatus(
            NumberType.FIXED_LINE
          );
        }
        return result;
      }
    }

    result.errors.push(
      "Number does not match any valid Tanzanian number format"
    );
    return result;
  }

  /**
   * Gets operator name by prefix
   */
  private getOperatorByPrefix(prefix: string): string | undefined {
    const operator = this.numberingPlan.operators.find((op) =>
      op.codes.includes(prefix)
    );
    return operator?.name;
  }

  /**
   * Gets region by prefix
   */
  private getRegionByPrefix(prefix: string): string | undefined {
    const regionMap: Record<string, string> = {
      "22": "Dar es Salaam",
      "23": "Dar es Salaam",
      "24": "Dar es Salaam",
      "25": "Dar es Salaam",
      "26": "Dar es Salaam",
      "27": "Dar es Salaam",
      "28": "Dar es Salaam",
      "29": "Dar es Salaam",
      "30": "Arusha",
      "31": "Arusha",
      "32": "Arusha",
      "33": "Arusha",
      "34": "Arusha",
      "35": "Arusha",
      "36": "Arusha",
      "37": "Arusha",
      "38": "Arusha",
      "39": "Arusha",
      "40": "Dodoma",
      "41": "Dodoma",
      "42": "Dodoma",
      "43": "Dodoma",
      "44": "Dodoma",
      "45": "Dodoma",
      "46": "Dodoma",
      "47": "Dodoma",
      "48": "Dodoma",
      "49": "Dodoma",
      "50": "Mbeya",
      "51": "Mbeya",
      "52": "Mbeya",
      "53": "Mbeya",
      "54": "Mbeya",
      "55": "Mbeya",
      "56": "Mbeya",
      "57": "Mbeya",
      "58": "Mbeya",
      "59": "Mbeya",
      "60": "Mwanza",
      "70": "Mwanza",
      "80": "Mwanza",
      "90": "Mwanza",
    };

    return regionMap[prefix];
  }

  /**
   * Gets emergency service by code
   */
  private getEmergencyService(code: string): string | undefined {
    const service = this.numberingPlan.emergencyServices.find(
      (s) => s.code === code
    );
    return service?.service;
  }

  /**
   * Gets portability status for number type
   */
  private getPortabilityStatus(numberType: NumberType): PortabilityStatus {
    if (!this.numberingPlan.numberPortability?.enabled) {
      return PortabilityStatus.NON_PORTABLE;
    }

    if (
      this.numberingPlan.numberPortability.supportedTypes.includes(numberType)
    ) {
      return PortabilityStatus.PORTABLE;
    }

    return PortabilityStatus.NON_PORTABLE;
  }

  /**
   * Validates signaling point code
   */
  private validateSignalingPointCode(code: string) {
    // Try exact match first
    let spc = this.numberingPlan.signalingPointCodes.find(
      (spc) => spc.code === code
    );

    if (spc) {
      return spc;
    }

    // Try matching without dashes
    const codeWithoutDashes = code.replace(/-/g, "");
    spc = this.numberingPlan.signalingPointCodes.find(
      (spc) => spc.code.replace(/-/g, "") === codeWithoutDashes
    );

    return spc;
  }

  /**
   * Formats a valid number to international format
   */
  formatInternational(phoneNumber: string): string | null {
    const result = this.validate(phoneNumber);
    if (!result.isValid) {
      return null;
    }

    const cleaned = this.cleanNumber(phoneNumber);
    const parts = this.extractNumberParts(cleaned, this.features);

    if (!parts) {
      return null;
    }

    return `+${this.numberingPlan.countryCode}${parts.nationalNumber}`;
  }

  /**
   * Formats a valid number to national format
   */
  formatNational(phoneNumber: string): string | null {
    const result = this.validate(phoneNumber, { allowInternational: true });
    if (!result.isValid) {
      return null;
    }
    const cleaned = this.cleanNumber(phoneNumber);
    let nationalNumber = cleaned;
    if (nationalNumber.startsWith(this.numberingPlan.countryCode)) {
      nationalNumber = nationalNumber.substring(
        this.numberingPlan.countryCode.length
      );
    }
    if (!nationalNumber.startsWith(this.numberingPlan.nationalPrefix)) {
      nationalNumber = this.numberingPlan.nationalPrefix + nationalNumber;
    }
    return nationalNumber;
  }

  /**
   * Formats a number with various options
   */
  formatNumber(
    phoneNumber: string,
    options: NumberFormatOptions
  ): string | null {
    const result = this.validate(phoneNumber);
    if (!result.isValid) {
      return null;
    }

    const cleaned = this.cleanNumber(phoneNumber);
    const parts = this.extractNumberParts(cleaned, this.features);

    if (!parts) {
      return null;
    }

    switch (options.format) {
      case "international":
        return `+${this.numberingPlan.countryCode}${parts.nationalNumber}`;
      case "national":
        return `${this.numberingPlan.nationalPrefix}${parts.nationalNumber}`;
      case "e164":
        return `+${this.numberingPlan.countryCode}${parts.nationalNumber}`;
      case "rfc3966":
        return `tel:+${this.numberingPlan.countryCode}${parts.nationalNumber}`;
      default:
        return `+${this.numberingPlan.countryCode}${parts.nationalNumber}`;
    }
  }

  /**
   * Queries the numbering plan for specific criteria
   */
  queryNumberingPlan(query: NumberingPlanQuery): any[] {
    const results: any[] = [];

    // Query by number type
    if (query.numberType) {
      switch (query.numberType) {
        case NumberType.MOBILE:
          if (this.features.validateMobile) {
            results.push(
              ...this.numberingPlan.mobilePrefixes.map((prefix) => ({
                prefix,
                type: NumberType.MOBILE,
                operator: this.getOperatorByPrefix(prefix),
              }))
            );
          }
          break;
        case NumberType.FIXED_LINE:
          if (this.features.validateFixedLine) {
            results.push(
              ...this.numberingPlan.fixedLinePrefixes.map((prefix) => ({
                prefix,
                type: NumberType.FIXED_LINE,
                operator: this.getOperatorByPrefix(prefix),
                region: this.getRegionByPrefix(prefix),
              }))
            );
          }
          break;
        // Add other number types as needed
      }
    }

    // Query by operator
    if (query.operator) {
      const operator = this.numberingPlan.operators.find((op) =>
        op.name.toLowerCase().includes(query.operator!.toLowerCase())
      );
      if (operator) {
        results.push(
          ...operator.codes.map((code) => ({
            prefix: code,
            type: operator.type,
            operator: operator.name,
          }))
        );
      }
    }

    return results;
  }

  /**
   * Gets numbering plan statistics
   */
  getNumberingPlanStatistics(): NumberingPlanStatistics {
    const stats: NumberingPlanStatistics = {
      totalNumbers: 0,
      assignedNumbers: 0,
      reservedNumbers: 0,
      availableNumbers: 0,
      byType: {} as Record<NumberType, number>,
      byOperator: {} as Record<string, number>,
      byRegion: {} as Record<string, number>,
    };

    // Calculate mobile numbers
    if (this.features.validateMobile) {
      const mobileCount = this.numberingPlan.mobilePrefixes.length * 10000000; // 10M per prefix
      stats.byType[NumberType.MOBILE] = mobileCount;
      stats.totalNumbers += mobileCount;
    }

    // Calculate fixed line numbers
    if (this.features.validateFixedLine) {
      const fixedLineCount =
        this.numberingPlan.fixedLinePrefixes.length * 10000000; // 10M per prefix
      stats.byType[NumberType.FIXED_LINE] = fixedLineCount;
      stats.totalNumbers += fixedLineCount;
    }

    // Calculate special service numbers
    if (this.features.validateSpecialService) {
      const specialServiceCount =
        (this.numberingPlan.tollFreePrefixes.length +
          this.numberingPlan.premiumRatePrefixes.length +
          this.numberingPlan.sharedCostPrefixes.length +
          this.numberingPlan.voipPrefixes.length +
          this.numberingPlan.pagingPrefixes.length +
          this.numberingPlan.uanPrefixes.length) *
        1000000; // 1M per prefix
      stats.byType[NumberType.TOLL_FREE] =
        this.numberingPlan.tollFreePrefixes.length * 1000000;
      stats.byType[NumberType.PREMIUM_RATE] =
        this.numberingPlan.premiumRatePrefixes.length * 1000000;
      stats.byType[NumberType.SHARED_COST] =
        this.numberingPlan.sharedCostPrefixes.length * 1000000;
      stats.byType[NumberType.VOIP] =
        this.numberingPlan.voipPrefixes.length * 1000000;
      stats.byType[NumberType.PAGING] =
        this.numberingPlan.pagingPrefixes.length * 1000000;
      stats.byType[NumberType.UAN] =
        this.numberingPlan.uanPrefixes.length * 1000000;
      stats.totalNumbers += specialServiceCount;
    }

    // Calculate by operator
    this.numberingPlan.operators.forEach((operator) => {
      stats.byOperator[operator.name] = operator.codes.length * 10000000;
    });

    // Calculate by region
    const regionMap: Record<string, number> = {};
    this.numberingPlan.fixedLinePrefixes.forEach((prefix) => {
      const region = this.getRegionByPrefix(prefix);
      if (region) {
        regionMap[region] = (regionMap[region] || 0) + 10000000;
      }
    });
    stats.byRegion = regionMap;

    // Estimate assigned vs available (this would need real data)
    stats.assignedNumbers = Math.floor(stats.totalNumbers * 0.7); // 70% assigned
    stats.availableNumbers = stats.totalNumbers - stats.assignedNumbers;
    stats.reservedNumbers = Math.floor(stats.totalNumbers * 0.1); // 10% reserved

    return stats;
  }

  /**
   * Validates carrier selection code
   */
  validateCarrierSelection(carrierCode: string): boolean {
    if (!this.features.validateCarrierSelection) {
      return false;
    }
    return (
      this.numberingPlan.carrierSelection?.codes.includes(carrierCode) || false
    );
  }

  /**
   * Checks if number portability is supported for a number type
   */
  isNumberPortabilitySupported(numberType: NumberType): boolean {
    if (!this.features.validatePortability) {
      return false;
    }
    return (
      this.numberingPlan.numberPortability?.supportedTypes.includes(
        numberType
      ) || false
    );
  }

  /**
   * Gets all signaling point codes for an operator
   */
  getSignalingPointCodes(operator?: string): any[] {
    if (!this.features.validateSignalingPoint) {
      return [];
    }
    if (operator) {
      return this.numberingPlan.signalingPointCodes.filter((spc) =>
        spc.operator.toLowerCase().includes(operator.toLowerCase())
      );
    }
    return this.numberingPlan.signalingPointCodes;
  }

  /**
   * Gets emergency services
   */
  getEmergencyServices(): any[] {
    if (!this.features.validateEmergency) {
      return [];
    }
    return this.numberingPlan.emergencyServices;
  }
}
