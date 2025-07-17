// interactive-test.js
const { TCRANumberValidator } = require("../dist/index.js");
const readline = require("readline");

const validator = new TCRANumberValidator();
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

console.log("🧪 TCRA Number Validator - Interactive Test");
console.log('Enter phone numbers to test (or "quit" to exit)\n');

function askForNumber() {
  rl.question("�� Enter phone number: ", (input) => {
    if (input.toLowerCase() === "quit") {
      rl.close();
      return;
    }

    const result = validator.validate(input, {
      allowInternational: true,
      checkPortability: true,
      checkCarrierSelection: true,
      mode: "full",
      features: {
        validateMobile: true,
        validatePortability: true,
      },
    });

    if (result.isValid) {
      console.log("✅ VALID");
      console.log(`   Type: ${result.numberType}`);
      if (result.operator) console.log(`   Operator: ${result.operator}`);
      if (result.aliases) console.log(`   Aliases: ${result.aliases}`);
      if (result.region) console.log(`   Region: ${result.region}`);
      if (result.carrier) console.log(`   Carrier: ${result.carrier}`);
      if (result.portabilityStatus)
        console.log(`   Portability: ${result.portabilityStatus}`);
      if (result.numberStatus)
        console.log(`   Number Status: ${result.numberStatus}`);
      if (result.signalingPointCode)
        console.log(`   Signaling Point Code: ${result.signalingPointCode}`);
      if (result.emergencyService)
        console.log(`   Emergency Service: ${result.emergencyService}`);
    } else {
      console.log("❌ INVALID");
      console.log(`   Errors: ${result.errors.join(", ")}`);
    }

    console.log("");
    askForNumber();
  });
}

askForNumber();
