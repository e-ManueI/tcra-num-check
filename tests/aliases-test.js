// aliases-test.js
const { TCRANumberValidator } = require("../dist/index.js");

const validator = new TCRANumberValidator();

console.log("🧪 Testing Aliases in Validation Results\n");

// Test mobile numbers with aliases
const testNumbers = [
  {
    number: "0651234567",
    expectedOperator: "Honora Tanzania PLC",
    expectedAliases: ["Tigo", "Yas"],
  },
  {
    number: "0611234567",
    expectedOperator: "Viettel Tanzania PLC",
    expectedAliases: ["Halotel"],
  },
  {
    number: "0731234567",
    expectedOperator: "Tanzania Telecommunications Corporation (TCC)",
    expectedAliases: ["TTCL"],
  },
  {
    number: "0741234567",
    expectedOperator: "Vodacom Tanzania PLC",
    expectedAliases: [], // No aliases defined
  },
];

testNumbers.forEach(({ number, expectedOperator, expectedAliases }) => {
  console.log(`Testing: ${number}`);
  const result = validator.validate(number);

  if (result.isValid) {
    console.log(`✅ VALID - ${result.numberType}`);
    console.log(`   Operator: ${result.operator}`);
    console.log(
      `   Aliases: ${result.aliases ? result.aliases.join(", ") : "None"}`
    );

    // Verify operator matches
    if (result.operator === expectedOperator) {
      console.log(`   ✅ Operator matches expected: ${expectedOperator}`);
    } else {
      console.log(
        `   ❌ Operator mismatch. Expected: ${expectedOperator}, Got: ${result.operator}`
      );
    }

    // Verify aliases match
    const actualAliases = result.aliases || [];
    const aliasesMatch =
      actualAliases.length === expectedAliases.length &&
      actualAliases.every((alias) => expectedAliases.includes(alias));

    if (aliasesMatch) {
      console.log(
        `   ✅ Aliases match expected: [${expectedAliases.join(", ")}]`
      );
    } else {
      console.log(
        `   ❌ Aliases mismatch. Expected: [${expectedAliases.join(
          ", "
        )}], Got: [${actualAliases.join(", ")}]`
      );
    }
  } else {
    console.log(`❌ INVALID`);
    console.log(`   Errors: ${result.errors.join(", ")}`);
  }

  console.log("");
});

console.log("🎉 Aliases test completed!");
