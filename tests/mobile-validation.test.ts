import { TCRANumberValidator, NumberTypes } from "../src/index";

describe("Mobile Number Validation - 10-digit Format", () => {
  let validator: TCRANumberValidator;

  beforeEach(() => {
    validator = new TCRANumberValidator({ mode: "full" });
  });

  describe("Valid Mobile Numbers", () => {
    test("should validate Viettel Tanzania PLC (Halotel) numbers", () => {
      const result1 = validator.validate("0610001234");
      expect(result1.isValid).toBe(true);
      expect(result1.numberType).toBe(NumberTypes.MOBILE);
      expect(result1.operator).toBe("Viettel Tanzania PLC");

      const result2 = validator.validate("0629990000");
      expect(result2.isValid).toBe(true);
      expect(result2.numberType).toBe(NumberTypes.MOBILE);
      expect(result2.operator).toBe("Viettel Tanzania PLC");
    });

    test("should validate Honora Tanzania PLC (Tigo/Yas) numbers", () => {
      const result1 = validator.validate("0651234567");
      expect(result1.isValid).toBe(true);
      expect(result1.numberType).toBe(NumberTypes.MOBILE);
      expect(result1.operator).toBe("Honora Tanzania PLC");

      const result2 = validator.validate("0679876543");
      expect(result2.isValid).toBe(true);
      expect(result2.numberType).toBe(NumberTypes.MOBILE);
      expect(result2.operator).toBe("Honora Tanzania PLC");
    });

    test("should validate Smile Communications numbers", () => {
      const result = validator.validate("0665555555");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe("Smile Communications Tanzania Limited");
    });

    test("should validate Airtel Tanzania PLC numbers", () => {
      const result1 = validator.validate("0681234567");
      expect(result1.isValid).toBe(true);
      expect(result1.numberType).toBe(NumberTypes.MOBILE);
      expect(result1.operator).toBe("Airtel Tanzania PLC");

      const result2 = validator.validate("0699990000");
      expect(result2.isValid).toBe(true);
      expect(result2.numberType).toBe(NumberTypes.MOBILE);
      expect(result2.operator).toBe("Airtel Tanzania PLC");
    });

    test("should validate Vodacom Tanzania PLC numbers", () => {
      const result1 = validator.validate("0741234567");
      expect(result1.isValid).toBe(true);
      expect(result1.numberType).toBe(NumberTypes.MOBILE);
      expect(result1.operator).toBe("Vodacom Tanzania PLC");

      const result2 = validator.validate("0759876543");
      expect(result2.isValid).toBe(true);
      expect(result2.numberType).toBe(NumberTypes.MOBILE);
      expect(result2.operator).toBe("Vodacom Tanzania PLC");

      const result3 = validator.validate("0765555555");
      expect(result3.isValid).toBe(true);
      expect(result3.numberType).toBe(NumberTypes.MOBILE);
      expect(result3.operator).toBe("Vodacom Tanzania PLC");
    });

    test("should validate Tanzania Telecommunications Corporation (TCC) numbers", () => {
      const result = validator.validate("0731234567");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe(
        "Tanzania Telecommunications Corporation (TCC)"
      );
    });
  });

  describe("International Format Support", () => {
    test("should validate numbers with +255 prefix", () => {
      const result = validator.validate("+255612345678");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe("Viettel Tanzania PLC");
    });

    test("should validate numbers with 255 prefix", () => {
      const result = validator.validate("255612345678");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe("Viettel Tanzania PLC");
    });

    test("should validate numbers with 0 prefix", () => {
      const result = validator.validate("0612345678");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe("Viettel Tanzania PLC");
    });
  });

  describe("Access Code Validation", () => {
    test("should reject numbers not starting with 06 or 07", () => {
      const result1 = validator.validate("0812345678");
      expect(result1.isValid).toBe(false);
      expect(result1.errors).toContain(
        "Number does not match any valid Tanzanian number format"
      );

      const result2 = validator.validate("0512345678");
      expect(result2.isValid).toBe(true);
      expect(result2.numberType).toBe(NumberTypes.FIXED_LINE);
    });

    test("should accept numbers starting with 06", () => {
      const result = validator.validate("0612345678");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
    });

    test("should accept numbers starting with 07", () => {
      const result = validator.validate("0731234567");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
    });
  });

  describe("Invalid Mobile Numbers", () => {
    test("should reject 9-digit numbers", () => {
      const result = validator.validate("061234567");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number does not match any valid Tanzanian number format"
      );
    });

    test("should reject 11-digit numbers", () => {
      const result = validator.validate("06123456789");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number does not match any valid Tanzanian number format"
      );
    });

    test("should reject unknown prefixes", () => {
      const result = validator.validate("0701234567");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Unknown mobile operator prefix");
    });

    test("should reject non-numeric characters", () => {
      const result = validator.validate("06A1234567");
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain(
        "Number does not match any valid Tanzanian number format"
      );
    });
  });

  describe("Number Formatting", () => {
    test("should format to international format", () => {
      const result = validator.formatInternational("0612345678");
      expect(result).toBe("+255612345678");
    });

    test("should format to national format", () => {
      const result = validator.formatNational("+255612345678");
      expect(result).toBe("0612345678");
    });

    test("should format 255 prefix to national format", () => {
      const result = validator.formatNational("255612345678");
      expect(result).toBe("0612345678");
    });

    test("should return null for invalid numbers", () => {
      const result = validator.formatInternational("12s21111");
      expect(result).toBeNull();
    });
  });

  describe("Real-world Examples", () => {
    test("should validate common Vodacom numbers", () => {
      const vodacomNumbers = ["0741234567", "0751234567", "0761234567"];

      vodacomNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberTypes.MOBILE);
        expect(result.operator).toBe("Vodacom Tanzania PLC");
      });
    });

    test("should validate common Airtel numbers", () => {
      const airtelNumbers = ["0681234567", "0691234567"];

      airtelNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberTypes.MOBILE);
        expect(result.operator).toBe("Airtel Tanzania PLC");
      });
    });

    test("should validate common Tigo/Yas numbers", () => {
      const tigoNumbers = ["0651234567", "0671234567"];

      tigoNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberTypes.MOBILE);
        expect(result.operator).toBe("Honora Tanzania PLC");
      });
    });

    test("should validate common Halotel numbers", () => {
      const halotelNumbers = ["0611234567", "0621234567"];

      halotelNumbers.forEach((number) => {
        const result = validator.validate(number);
        expect(result.isValid).toBe(true);
        expect(result.numberType).toBe(NumberTypes.MOBILE);
        expect(result.operator).toBe("Viettel Tanzania PLC");
      });
    });

    test("should validate TTCL mobile numbers", () => {
      const result = validator.validate("0731234567");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe(
        "Tanzania Telecommunications Corporation (TCC)"
      );
    });

    test("should validate Smile numbers", () => {
      const result = validator.validate("0661234567");
      expect(result.isValid).toBe(true);
      expect(result.numberType).toBe(NumberTypes.MOBILE);
      expect(result.operator).toBe("Smile Communications Tanzania Limited");
    });
  });

  describe("Numbering Plan Queries", () => {
    test("should query mobile numbers correctly", () => {
      const mobileNumbers = validator.queryNumberingPlan({
        numberType: NumberTypes.MOBILE,
      });

      expect(mobileNumbers).toHaveLength(14); // 11 mobile prefixes

      // Check that all prefixes have the correct structure
      mobileNumbers.forEach((number) => {
        expect(number.prefix).toHaveLength(3); // 3-digit prefix
        expect(number.accessCode).toMatch(/^(06|07)$/); // 06 or 07
        expect(number.destinationCode).toMatch(/^[0-9]$/); // Single digit (operator identifier)
        expect(number.type).toBe(NumberTypes.MOBILE);
        expect(number.operator).toBeDefined();
      });
    });

    test("should query by operator", () => {
      const vodacomNumbers = validator.queryNumberingPlan({
        operator: "Vodacom",
      });
      expect(vodacomNumbers).toHaveLength(3); // 074, 075, 076

      const airtelNumbers = validator.queryNumberingPlan({
        operator: "Airtel",
      });
      expect(airtelNumbers).toHaveLength(3); // 068, 069
    });
  });

  describe("Statistics", () => {
    test("should calculate correct mobile number statistics", () => {
      const stats = validator.getNumberingPlanStatistics();

      // 11 prefixes × 1M numbers per prefix = 11M total mobile numbers
      expect(stats.byType[NumberTypes.MOBILE]).toBe(14000000);

      // Check operator statistics
      expect(stats.byOperator["Vodacom Tanzania PLC"]).toBe(3000000); // 3 prefixes × 1M
      expect(stats.byOperator["Airtel Tanzania PLC"]).toBe(3000000); // 2 prefixes × 1M
      expect(stats.byOperator["Viettel Tanzania PLC"]).toBe(2000000); // 2 prefixes × 1M
      expect(stats.byOperator["Honora Tanzania PLC"]).toBe(4000000); // 2 prefixes × 1M
      expect(stats.byOperator["Smile Communications Tanzania Limited"]).toBe(
        1000000
      ); // 1 prefix × 1M
      expect(
        stats.byOperator["Tanzania Telecommunications Corporation (TCC)"]
      ).toBe(1000000); // 1 prefix × 1M
    });
  });
});
