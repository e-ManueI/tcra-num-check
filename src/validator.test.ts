import { TCRANumberValidator } from "./validator";
import {
  NumberType,
  PortabilityStatus,
  NumberStatus,
  CarrierSelection,
} from "./types";

describe("TCRANumberValidator", () => {
  describe("Mode System", () => {
    describe("Basic Mode", () => {
      let validator: TCRANumberValidator;

      beforeEach(() => {
        validator = new TCRANumberValidator({ mode: "basic" });
      });

      test("should have correct mode", () => {
        expect(validator.getMode()).toBe("basic");
      });

      test("should validate mobile numbers", () => {
        const result = validator.validate("0712345678");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Airtel Tanzania");
      });

      test("should validate fixed line numbers", () => {
        const result = validator.validate("0221234567");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.FIXED_LINE);
        expect(result.region).toBe("Dar es Salaam");
      });

      test("should not validate emergency numbers", () => {
        const result = validator.validate("112");
        expect(result.isValid).toBe(false);
        expect(result.numberType).toBe(NumberType.INVALID);
      });

      test("should not validate special service numbers", () => {
        const result = validator.validate("0800123456");
        expect(result.isValid).toBe(false);
        expect(result.numberType).toBe(NumberType.INVALID);
      });

      test("should not validate short codes", () => {
        const result = validator.validate("100");
        expect(result.isValid).toBe(false);
        expect(result.numberType).toBe(NumberType.INVALID);
      });

      test("should not validate signaling point codes", () => {
        const result = validator.validate("255001001", {
          validateSignalingPoint: true,
        });
        expect(result.isValid).toBe(false);
        expect(result.numberType).toBe(NumberType.INVALID);
      });

      test("should not check portability by default", () => {
        const result = validator.validate("0712345678", {
          checkPortability: true,
        });
        expect(result.isValid).toBe(true);
        expect(result.portabilityStatus).toBeUndefined();
      });

      test("should allow international format", () => {
        const result = validator.validate("+255712345678");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
      });
    });

    describe("Full Mode", () => {
      let validator: TCRANumberValidator;

      beforeEach(() => {
        validator = new TCRANumberValidator({ mode: "full" });
      });

      test("should have correct mode", () => {
        expect(validator.getMode()).toBe("full");
      });

      test("should validate mobile numbers", () => {
        const result = validator.validate("0712345678");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Airtel Tanzania");
      });

      test("should validate fixed line numbers", () => {
        const result = validator.validate("0221234567");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.FIXED_LINE);
        expect(result.region).toBe("Dar es Salaam");
      });

      test("should validate emergency numbers", () => {
        const result = validator.validate("112");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);
        expect(result.emergencyService).toBe("Emergency Services");
      });

      test("should validate special service numbers", () => {
        const result = validator.validate("0800123456");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.TOLL_FREE);
      });

      test("should validate short codes", () => {
        const result = validator.validate("100");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SHORT_CODE);
      });

      test("should validate signaling point codes", () => {
        const result = validator.validate("255001001", {
          validateSignalingPoint: true,
        });
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SIGNALING_POINT);
        expect(result.signalingPointCode).toBeDefined();
      });

      test("should check portability by default", () => {
        const result = validator.validate("0712345678", {
          checkPortability: true,
        });
        expect(result.isValid).toBe(true);
        expect(result.portabilityStatus).toBe(PortabilityStatus.PORTABLE);
      });

      test("should allow international format", () => {
        const result = validator.validate("+255712345678");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
      });
    });

    describe("Custom Mode", () => {
      test("should allow custom feature configuration", () => {
        const validator = new TCRANumberValidator({
          mode: "custom",
          features: {
            validateMobile: true,
            validateFixedLine: false,
            validateEmergency: true,
            validateSpecialService: false,
            validateShortCode: false,
            validateSignalingPoint: false,
          },
        });

        expect(validator.getMode()).toBe("custom");

        // Should validate mobile
        const mobileResult = validator.validate("0712345678");
        expect(mobileResult.isValid).toBe(true);
        expect(mobileResult.numberType).toBe(NumberType.MOBILE);

        // Should validate emergency
        const emergencyResult = validator.validate("112");
        expect(emergencyResult.isValid).toBe(true);
        expect(emergencyResult.numberType).toBe(NumberType.EMERGENCY);

        // Should not validate fixed line
        const fixedResult = validator.validate("0221234567");
        expect(fixedResult.isValid).toBe(false);
        expect(fixedResult.numberType).toBe(NumberType.INVALID);

        // Should not validate special service
        const specialResult = validator.validate("0800123456");
        expect(specialResult.isValid).toBe(false);
        expect(specialResult.numberType).toBe(NumberType.INVALID);
      });
    });

    describe("Mode Switching", () => {
      let validator: TCRANumberValidator;

      beforeEach(() => {
        validator = new TCRANumberValidator({ mode: "basic" });
      });

      test("should switch from basic to full mode", () => {
        expect(validator.getMode()).toBe("basic");

        // Emergency numbers should not work in basic mode
        let result = validator.validate("112");
        expect(result.isValid).toBe(false);

        // Switch to full mode
        validator.setMode("full");
        expect(validator.getMode()).toBe("full");

        // Emergency numbers should work in full mode
        result = validator.validate("112");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);
      });

      test("should switch to custom mode with features", () => {
        validator.setMode("custom", {
          validateMobile: true,
          validateEmergency: true,
          validateSpecialService: false,
        });

        expect(validator.getMode()).toBe("custom");

        // Should validate mobile
        const mobileResult = validator.validate("0712345678");
        expect(mobileResult.isValid).toBe(true);

        // Should validate emergency
        const emergencyResult = validator.validate("112");
        expect(emergencyResult.isValid).toBe(true);

        // Should not validate special service
        const specialResult = validator.validate("0800123456");
        expect(specialResult.isValid).toBe(false);
      });
    });

    describe("Feature Updates", () => {
      let validator: TCRANumberValidator;

      beforeEach(() => {
        validator = new TCRANumberValidator({ mode: "basic" });
      });

      test("should update specific features", () => {
        // Emergency validation should be disabled in basic mode
        let result = validator.validate("112");
        expect(result.isValid).toBe(false);

        // Enable emergency validation
        validator.updateFeatures({ validateEmergency: true });

        // Emergency validation should now work
        result = validator.validate("112");
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);
      });

      test("should get current features", () => {
        const features = validator.getFeatures();
        expect(features.validateMobile).toBe(true);
        expect(features.validateFixedLine).toBe(true);
        expect(features.validateEmergency).toBe(false);
        expect(features.validateSpecialService).toBe(false);
      });
    });

    describe("Per-Call Overrides", () => {
      let validator: TCRANumberValidator;

      beforeEach(() => {
        validator = new TCRANumberValidator({ mode: "basic" });
      });

      test("should allow per-call mode override", () => {
        // Emergency numbers should not work in basic mode
        let result = validator.validate("112");
        expect(result.isValid).toBe(false);

        // Override mode for this call
        result = validator.validate("112", { mode: "full" });
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);

        // Original mode should still be basic
        expect(validator.getMode()).toBe("basic");
      });

      test("should allow per-call feature override", () => {
        // Emergency numbers should not work in basic mode
        let result = validator.validate("112");
        expect(result.isValid).toBe(false);

        // Override features for this call
        result = validator.validate("112", {
          features: { validateEmergency: true },
        });
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);
      });

      test("should allow per-call legacy options", () => {
        // Signaling point codes should not work in basic mode
        let result = validator.validate("255001001");
        expect(result.isValid).toBe(false);

        // Use legacy option for this call
        result = validator.validate("255001001", {
          validateSignalingPoint: true,
        });
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SIGNALING_POINT);
      });
    });
  });

  describe("Mobile Numbers", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should validate Vodacom mobile numbers", () => {
      const vodacomNumbers = [
        "0612345678",
        "0623456789",
        "0634567890",
        "0645678901",
        "0656789012",
        "0667890123",
        "0678901234",
        "0689012345",
        "0690123456",
      ];

      vodacomNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Vodacom Tanzania");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate Airtel mobile numbers", () => {
      const airtelNumbers = [
        "0712345678",
        "0723456789",
        "0734567890",
        "0745678901",
        "0756789012",
        "0767890123",
        "0778901234",
        "0789012345",
        "0790123456",
      ];

      airtelNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Airtel Tanzania");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate Tigo mobile numbers", () => {
      const tigoNumbers = [
        "0812345678",
        "0823456789",
        "0834567890",
        "0845678901",
        "0856789012",
        "0867890123",
        "0878901234",
        "0889012345",
        "0890123456",
      ];

      tigoNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Tigo Tanzania");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate Halotel mobile numbers", () => {
      const halotelNumbers = [
        "0912345678",
        "0923456789",
        "0934567890",
        "0945678901",
        "0956789012",
        "0967890123",
        "0978901234",
        "0989012345",
        "0990123456",
      ];

      halotelNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.MOBILE);
        expect(result.operator).toBe("Halotel");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate mobile numbers with portability check", () => {
      const fullValidator = new TCRANumberValidator({ mode: "full" });
      const result = fullValidator.validate("0712345678", {
        checkPortability: true,
      });
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberType.MOBILE);
      expect(result.portabilityStatus).toBe(PortabilityStatus.PORTABLE);
      expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
      expect(result.carrierSelection).toBe(CarrierSelection.AUTOMATIC);
    });
  });

  describe("Fixed Line Numbers", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should validate Dar es Salaam fixed line numbers", () => {
      const darNumbers = [
        "0221234567",
        "0232345678",
        "0243456789",
        "0254567890",
        "0265678901",
        "0276789012",
        "0287890123",
        "0298901234",
      ];

      darNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.FIXED_LINE);
        expect(result.region).toBe("Dar es Salaam");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate Arusha fixed line numbers", () => {
      const arushaNumbers = [
        "0301234567",
        "0312345678",
        "0323456789",
        "0334567890",
        "0345678901",
        "0356789012",
        "0367890123",
        "0378901234",
        "0389012345",
      ];

      arushaNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.FIXED_LINE);
        expect(result.region).toBe("Arusha");
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate fixed line numbers with portability check", () => {
      const fullValidator = new TCRANumberValidator({ mode: "full" });
      const result = fullValidator.validate("0221234567", {
        checkPortability: true,
      });
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberType.FIXED_LINE);
      expect(result.portabilityStatus).toBe(PortabilityStatus.NON_PORTABLE);
      expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
      expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
    });
  });

  describe("Emergency Numbers", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should validate emergency numbers", () => {
      const emergencyNumbers = [
        "112",
        "113",
        "114",
        "115",
        "116",
        "117",
        "118",
        "119",
      ];

      emergencyNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.EMERGENCY);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should identify emergency services correctly", () => {
      const result = validator.validate("112");
      expect(result.isValid).toBe(true);
      expect(result.emergencyService).toBe("Emergency Services");
    });

    test("should identify police emergency correctly", () => {
      const result = validator.validate("113");
      expect(result.isValid).toBe(true);
      expect(result.emergencyService).toBe("Police");
    });
  });

  describe("Short Codes", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should validate short codes", () => {
      const shortCodes = [
        "100",
        "101",
        "102",
        "103",
        "104",
        "105",
        "106",
        "107",
        "108",
        "109",
        "150",
        "151",
        "152",
        "153",
        "154",
        "155",
        "156",
        "157",
        "158",
        "159",
      ];

      shortCodes.forEach((code) => {
        const result = validator.validate(code);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SHORT_CODE);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe("Special Service Numbers", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should validate toll-free numbers", () => {
      const tollFreeNumbers = [
        "0800123456",
        "0801234567",
        "0802345678",
        "0803456789",
        "0804567890",
        "0805678901",
        "0806789012",
        "0807890123",
        "0808901234",
        "0809012345",
      ];

      tollFreeNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.TOLL_FREE);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate premium rate numbers", () => {
      const premiumNumbers = [
        "0900123456",
        "0901234567",
        "0902345678",
        "0903456789",
        "0904567890",
        "0905678901",
        "0906789012",
        "0907890123",
        "0908901234",
        "0909012345",
      ];

      premiumNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.PREMIUM_RATE);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate shared cost numbers", () => {
      const sharedCostNumbers = [
        "0700123456",
        "0701234567",
        "0702345678",
        "0703456789",
        "0704567890",
        "0705678901",
        "0706789012",
        "0707890123",
        "0708901234",
        "0709012345",
      ];

      sharedCostNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SHARED_COST);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate VoIP numbers", () => {
      const voipNumbers = [
        "0200123456",
        "0201234567",
        "0202345678",
        "0203456789",
        "0204567890",
        "0205678901",
        "0206789012",
        "0207890123",
        "0208901234",
        "0209012345",
      ];

      voipNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.VOIP);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate paging numbers", () => {
      const pagingNumbers = [
        "0100123456",
        "0101234567",
        "0102345678",
        "0103456789",
        "0104567890",
        "0105678901",
        "0106789012",
        "0107890123",
        "0108901234",
        "0109012345",
      ];

      pagingNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.PAGING);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should validate UAN numbers", () => {
      const uanNumbers = [
        "0300123456",
        "0301234567",
        "0302345678",
        "0303456789",
        "0304567890",
        "0305678901",
        "0306789012",
        "0307890123",
        "0308901234",
        "0309012345",
      ];

      uanNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.UAN);
        expect(result.numberStatus).toBe(NumberStatus.ACTIVE);
        expect(result.carrierSelection).toBe(CarrierSelection.NOT_APPLICABLE);
        expect(result.errors).toHaveLength(0);
      });
    });
  });

  describe("Signaling Point Codes", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should validate signaling point codes when enabled", () => {
      const spcNumbers = [
        "255001001",
        "255001002",
        "255002001",
        "255003001",
        "255004001",
        "255005001",
        "255999001",
      ];

      spcNumbers.forEach((number) => {
        const result = validator.validate(number, {
          validateSignalingPoint: true,
        });
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberType.SIGNALING_POINT);
        expect(result.signalingPointCode).toBeDefined();
        expect(result.operator).toBeDefined();
        expect(result.errors).toHaveLength(0);
      });
    });

    test("should not validate signaling point codes when disabled", () => {
      const basicValidator = new TCRANumberValidator({ mode: "basic" });
      const result = basicValidator.validate("255001001", {
        validateSignalingPoint: true,
      });
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });

    test("should get all signaling point codes", () => {
      const spcs = validator.getSignalingPointCodes();
      expect(spcs.length).toBeGreaterThan(0);
      expect(spcs[0].code).toBeDefined();
      expect(spcs[0].type).toBeDefined();
      expect(spcs[0].operator).toBeDefined();
    });

    test("should get signaling point codes by operator", () => {
      const vodacomSpcs = validator.getSignalingPointCodes("Vodacom");
      expect(vodacomSpcs.length).toBeGreaterThan(0);
      vodacomSpcs.forEach((spc) => {
        expect(spc.operator).toContain("Vodacom");
      });
    });
  });

  describe("International Format", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should validate international format when allowed", () => {
      const result = validator.validate("+255712345678", {
        allowInternational: true,
      });
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberType.MOBILE);
      expect(result.operator).toBe("Airtel Tanzania");
    });

    test("should reject international format when not allowed", () => {
      const result = validator.validate("+255712345678", {
        allowInternational: false,
      });
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });
  });

  describe("Number Formatting", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should format to international", () => {
      const result = validator.formatInternational("0712345678");
      expect(result).toBe("+255712345678");
    });

    test("should format to national", () => {
      const result = validator.formatNational("+255712345678");
      expect(result).toBe("0712345678");
    });

    test("should format with options", () => {
      const result = validator.formatNumber("0712345678", {
        format: "rfc3966",
      });
      expect(result).toBe("tel:+255712345678");
    });

    test("should return null for invalid numbers", () => {
      const result = validator.formatInternational("invalid");
      expect(result).toBeNull();
    });
  });

  describe("Numbering Plan Queries", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should query mobile numbers", () => {
      const result = validator.queryNumberingPlan({
        numberType: NumberType.MOBILE,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe(NumberType.MOBILE);
      expect(result[0].operator).toBeDefined();
    });

    test("should query fixed line numbers", () => {
      const result = validator.queryNumberingPlan({
        numberType: NumberType.FIXED_LINE,
      });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].type).toBe(NumberType.FIXED_LINE);
      expect(result[0].operator).toBeDefined();
      expect(result[0].region).toBeDefined();
    });

    test("should query by operator", () => {
      const result = validator.queryNumberingPlan({ operator: "Vodacom" });
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].operator).toContain("Vodacom");
    });
  });

  describe("Numbering Plan Statistics", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should return valid statistics", () => {
      const stats = validator.getNumberingPlanStatistics();
      expect(stats.totalNumbers).toBeGreaterThan(0);
      expect(stats.assignedNumbers).toBeGreaterThan(0);
      expect(stats.availableNumbers).toBeGreaterThan(0);
      expect(stats.byType[NumberType.MOBILE]).toBeGreaterThan(0);
      expect(stats.byType[NumberType.FIXED_LINE]).toBeGreaterThan(0);
      expect(Object.keys(stats.byOperator).length).toBeGreaterThan(0);
      expect(Object.keys(stats.byRegion).length).toBeGreaterThan(0);
    });

    test("should respect mode when calculating statistics", () => {
      const basicValidator = new TCRANumberValidator({ mode: "basic" });
      const fullValidator = new TCRANumberValidator({ mode: "full" });

      const basicStats = basicValidator.getNumberingPlanStatistics();
      const fullStats = fullValidator.getNumberingPlanStatistics();

      // Full mode should have more total numbers due to special services
      expect(fullStats.totalNumbers).toBeGreaterThan(basicStats.totalNumbers);
    });
  });

  describe("Carrier Selection", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should validate carrier selection codes", () => {
      const validCodes = [
        "10",
        "11",
        "12",
        "13",
        "14",
        "15",
        "16",
        "17",
        "18",
        "19",
      ];
      validCodes.forEach((code) => {
        expect(validator.validateCarrierSelection(code)).toBe(true);
      });
    });

    test("should reject invalid carrier selection codes", () => {
      const invalidCodes = ["20", "21", "99", "00"];
      invalidCodes.forEach((code) => {
        expect(validator.validateCarrierSelection(code)).toBe(false);
      });
    });

    test("should not validate carrier selection in basic mode", () => {
      const basicValidator = new TCRANumberValidator({ mode: "basic" });
      expect(basicValidator.validateCarrierSelection("10")).toBe(false);
    });
  });

  describe("Number Portability", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should check mobile number portability", () => {
      expect(validator.isNumberPortabilitySupported(NumberType.MOBILE)).toBe(
        true
      );
    });

    test("should check fixed line number portability", () => {
      expect(
        validator.isNumberPortabilitySupported(NumberType.FIXED_LINE)
      ).toBe(false);
    });

    test("should not check portability in basic mode", () => {
      const basicValidator = new TCRANumberValidator({ mode: "basic" });
      expect(
        basicValidator.isNumberPortabilitySupported(NumberType.MOBILE)
      ).toBe(false);
    });
  });

  describe("Emergency Services", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator({ mode: "full" });
    });

    test("should get emergency services", () => {
      const services = validator.getEmergencyServices();
      expect(services.length).toBeGreaterThan(0);
      expect(services[0].code).toBeDefined();
      expect(services[0].service).toBeDefined();
      expect(services[0].priority).toBeDefined();
    });

    test("should not get emergency services in basic mode", () => {
      const basicValidator = new TCRANumberValidator({ mode: "basic" });
      const services = basicValidator.getEmergencyServices();
      expect(services.length).toBe(0);
    });
  });

  describe("Invalid Numbers", () => {
    let validator: TCRANumberValidator;

    beforeEach(() => {
      validator = new TCRANumberValidator();
    });

    test("should reject numbers that are too short", () => {
      const result = validator.validate("12");
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });

    test("should reject numbers that are too long", () => {
      const result = validator.validate("1234567890123");
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });

    test("should reject invalid mobile prefixes", () => {
      const result = validator.validate("0012345678");
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });

    test("should reject invalid fixed line prefixes", () => {
      const result = validator.validate("0012345678");
      expect(result.isValid).toBe(false);
      expect(result.numberType).toBe(NumberType.INVALID);
    });
  });
});
