# TCRA Number Check

A comprehensive TypeScript library for validating Tanzanian phone numbers according to the TCRA (Tanzania Communications Regulatory Authority) National Numbering Plan and Signaling Point Codes Plan.

## Features

- ✅ **Mobile Number Validation** - Supports all major Tanzanian mobile operators (Vodacom, Airtel, Tigo, Halotel, Zantel)
- ✅ **Fixed Line Validation** - Validates landline numbers with regional identification
- ✅ **Emergency Services** - Validates emergency numbers (112, 113, 114, 115, 116, 117, 118, 119)
- ✅ **Short Codes** - Supports short code validation (100-109, 150-159)
- ✅ **Signaling Point Codes** - Validates STP, HLR, VLR, MSC, SMSC, and other signaling point codes
- ✅ **Special Service Numbers** - Supports toll-free, premium rate, shared cost, VoIP, paging, and UAN numbers
- ✅ **Number Portability** - Checks portability status for mobile and fixed line numbers
- ✅ **Carrier Selection** - Validates carrier selection codes and automatic/manual selection
- ✅ **International Format Support** - Handles both national and international number formats
- ✅ **Number Formatting** - Convert between national, international, E.164, and RFC3966 formats
- ✅ **Operator Identification** - Automatically identifies the service provider with license information
- ✅ **Regional Information** - Provides regional information for fixed line numbers
- ✅ **Numbering Plan Queries** - Query the numbering plan by type, operator, region, and status
- ✅ **Statistics and Reporting** - Comprehensive numbering plan statistics and analysis
- ✅ **TypeScript Support** - Full TypeScript support with comprehensive type definitions
- ✅ **Comprehensive Testing** - Extensive test coverage for all number types and features

## How It Works

The core logic of this library is implemented in the [`TCRANumberValidator`](src/validator.ts) class. This class provides a comprehensive, extensible, and configurable validator for Tanzanian phone numbers, supporting all number types and features defined by the TCRA National Numbering Plan.

**Key Capabilities:**
- Validates phone numbers for all Tanzanian number types: mobile, fixed line, emergency, short code, special service (toll-free, premium, shared cost, VoIP, paging, UAN), and signaling point codes.
- Identifies the operator and region for a given number, and checks for number portability and carrier selection codes.
- Supports multiple validation modes (basic, full, custom) and feature toggles for fine-grained control.
- Cleans and parses phone numbers, checks formats, and provides detailed error/warning messages.
- Formats numbers to international, national, E.164, and RFC3966 standards.
- Allows querying the numbering plan for prefixes, operators, and regions, and provides comprehensive statistics.

**Main Methods:**
- `validate(phoneNumber, options)`: Validates a phone number and returns detailed information (type, operator, region, portability, errors, etc.).
- `formatInternational(phoneNumber)`, `formatNational(phoneNumber)`, `formatNumber(phoneNumber, options)`: Format numbers in various styles.
- `queryNumberingPlan(query)`: Query the numbering plan for specific types, operators, or regions.
- `getNumberingPlanStatistics()`: Get statistics on the numbering plan (total, by type/operator/region, assigned/available).
- `validateCarrierSelection(carrierCode)`: Check if a carrier selection code is valid.
- `isNumberPortabilitySupported(numberType)`: Check if portability is supported for a number type.
- `getSignalingPointCodes(operator?)`: List signaling point codes, optionally filtered by operator.
- `getEmergencyServices()`: List all emergency services.

The validator is highly extensible and can be configured with custom numbering plans or feature sets, making it suitable for a wide range of Tanzanian telecom applications.

## Installation

```bash
npm install tcra-num-check
```

## Quick Start

```typescript
import { TCRANumberValidator, NumberType, PortabilityStatus } from 'tcra-num-check';

const validator = new TCRANumberValidator();

// Validate a mobile number
const result = validator.validate('0712345678');
console.log(result.isValid); // true
console.log(result.numberType); // NumberType.MOBILE
console.log(result.operator); // 'Airtel Tanzania'

// Validate with portability check
const resultWithPortability = validator.validate('0712345678', { 
  checkPortability: true 
});
console.log(resultWithPortability.portabilityStatus); // PortabilityStatus.PORTABLE

// Format to international
const international = validator.formatInternational('0712345678');
console.log(international); // '+255712345678'

// Query numbering plan
const mobileNumbers = validator.queryNumberingPlan({ 
  numberType: NumberType.MOBILE 
});

// Get statistics
const stats = validator.getNumberingPlanStatistics();
console.log(stats.totalNumbers); // Total available numbers
```

## API Reference

### TCRANumberValidator

The main validator class for Tanzanian phone numbers.

#### Constructor

```typescript
new TCRANumberValidator(numberingPlan?: NumberingPlan)
```

- `numberingPlan` (optional): Custom numbering plan configuration

#### Methods

##### validate(phoneNumber: string, options?: ValidationOptions): NumberValidationResult

Validates a Tanzanian phone number and returns detailed information.

**Parameters:**
- `phoneNumber`: The phone number to validate
- `options`: Validation options (optional)

**Returns:** `NumberValidationResult` object with validation details

**Example:**
```typescript
const result = validator.validate('0712345678', { 
  checkPortability: true,
  validateSignalingPoint: true 
});
console.log(result);
// {
//   isValid: true,
//   numberType: NumberType.MOBILE,
//   operator: 'Airtel Tanzania',
//   region: undefined,
//   portabilityStatus: PortabilityStatus.PORTABLE,
//   numberStatus: NumberStatus.ACTIVE,
//   carrierSelection: CarrierSelection.AUTOMATIC,
//   errors: [],
//   warnings: []
// }
```

##### formatInternational(phoneNumber: string): string | null

Formats a valid number to international format.

**Returns:** International format string or `null` if invalid

**Example:**
```typescript
const international = validator.formatInternational('0712345678');
console.log(international); // '+255712345678'
```

##### formatNational(phoneNumber: string): string | null

Formats a valid number to national format.

**Returns:** National format string or `null` if invalid

**Example:**
```typescript
const national = validator.formatNational('+255712345678');
console.log(national); // '0712345678'
```

##### formatNumber(phoneNumber: string, options: NumberFormatOptions): string | null

Formats a number with various options.

**Parameters:**
- `phoneNumber`: The phone number to format
- `options`: Formatting options

**Returns:** Formatted string or `null` if invalid

**Example:**
```typescript
const rfc3966 = validator.formatNumber('0712345678', { format: 'rfc3966' });
console.log(rfc3966); // 'tel:+255712345678'
```

##### queryNumberingPlan(query: NumberingPlanQuery): any[]

Queries the numbering plan for specific criteria.

**Parameters:**
- `query`: Query criteria

**Returns:** Array of matching numbering plan entries

**Example:**
```typescript
const mobileNumbers = validator.queryNumberingPlan({ 
  numberType: NumberType.MOBILE 
});
const vodacomNumbers = validator.queryNumberingPlan({ 
  operator: 'Vodacom' 
});
```

##### getNumberingPlanStatistics(): NumberingPlanStatistics

Gets comprehensive numbering plan statistics.

**Returns:** Statistics object with detailed breakdowns

**Example:**
```typescript
const stats = validator.getNumberingPlanStatistics();
console.log(stats.totalNumbers); // Total available numbers
console.log(stats.byType[NumberType.MOBILE]); // Mobile numbers count
console.log(stats.byOperator['Vodacom Tanzania']); // Vodacom numbers count
```

##### validateCarrierSelection(carrierCode: string): boolean

Validates a carrier selection code.

**Returns:** `true` if valid, `false` otherwise

**Example:**
```typescript
const isValid = validator.validateCarrierSelection('10');
console.log(isValid); // true
```

##### isNumberPortabilitySupported(numberType: NumberType): boolean

Checks if number portability is supported for a number type.

**Returns:** `true` if supported, `false` otherwise

**Example:**
```typescript
const isPortable = validator.isNumberPortabilitySupported(NumberType.MOBILE);
console.log(isPortable); // true
```

##### getSignalingPointCodes(operator?: string): SignalingPointCode[]

Gets signaling point codes, optionally filtered by operator.

**Returns:** Array of signaling point codes

**Example:**
```typescript
const allSpcs = validator.getSignalingPointCodes();
const vodacomSpcs = validator.getSignalingPointCodes('Vodacom');
```

##### getEmergencyServices(): EmergencyService[]

Gets all emergency services.

**Returns:** Array of emergency services

**Example:**
```typescript
const services = validator.getEmergencyServices();
console.log(services); // Array of emergency services with codes and descriptions
```

### Types

#### NumberValidationResult

```typescript
interface NumberValidationResult {
  isValid: boolean;
  numberType: NumberType;
  operator?: string;
  region?: string;
  signalingPointCode?: string;
  emergencyService?: string;
  portabilityStatus?: PortabilityStatus;
  numberStatus?: NumberStatus;
  carrierSelection?: CarrierSelection;
  errors: string[];
  warnings: string[];
}
```

#### NumberType

```typescript
enum NumberType {
  MOBILE = 'mobile',
  FIXED_LINE = 'fixed_line',
  TOLL_FREE = 'toll_free',
  PREMIUM_RATE = 'premium_rate',
  SHARED_COST = 'shared_cost',
  VOIP = 'voip',
  PAGING = 'paging',
  UAN = 'uan',
  EMERGENCY = 'emergency',
  SHORT_CODE = 'short_code',
  SIGNALING_POINT = 'signaling_point',
  INVALID = 'invalid'
}
```

#### PortabilityStatus

```typescript
enum PortabilityStatus {
  PORTABLE = 'portable',
  NON_PORTABLE = 'non_portable',
  UNKNOWN = 'unknown'
}
```

#### NumberStatus

```typescript
enum NumberStatus {
  ACTIVE = 'active',
  RESERVED = 'reserved',
  ASSIGNED = 'assigned',
  UNASSIGNED = 'unassigned',
  BLOCKED = 'blocked'
}
```

#### CarrierSelection

```typescript
enum CarrierSelection {
  AUTOMATIC = 'automatic',
  MANUAL = 'manual',
  NOT_APPLICABLE = 'not_applicable'
}
```

#### ValidationOptions

```typescript
interface ValidationOptions {
  strict?: boolean;
  allowInternational?: boolean;
  allowExtensions?: boolean;
  checkPortability?: boolean;
  checkCarrierSelection?: boolean;
  validateSignalingPoint?: boolean;
  allowReservedNumbers?: boolean;
}
```

#### NumberFormatOptions

```typescript
interface NumberFormatOptions {
  format: 'national' | 'international' | 'e164' | 'rfc3966';
  includeExtension?: boolean;
  includeCarrierSelection?: boolean;
}
```

#### SignalingPointCode

```typescript
interface SignalingPointCode {
  code: string;
  description: string;
  type: 'STP' | 'SSP' | 'SCP' | 'HLR' | 'VLR' | 'MSC' | 'GMSC' | 'SMSC' | 'MMSC';
  operator: string;
  location?: string;
  status: 'active' | 'inactive' | 'reserved';
}
```

#### EmergencyService

```typescript
interface EmergencyService {
  code: string;
  service: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
}
```

## Supported Number Types

### Mobile Numbers

| Operator | Prefixes | Example | Portability |
|----------|----------|---------|-------------|
| Vodacom Tanzania | 61-69 | 0712345678 | ✅ Portable |
| Airtel Tanzania | 71-79 | 0712345678 | ✅ Portable |
| Tigo Tanzania | 81-89 | 0812345678 | ✅ Portable |
| Halotel | 91-99 | 0912345678 | ✅ Portable |
| Zantel | 68-69 | 0681234567 | ✅ Portable |

### Fixed Line Numbers

| Region | Prefixes | Example | Portability |
|--------|----------|---------|-------------|
| Dar es Salaam | 22-29 | 0221234567 | ❌ Non-portable |
| Arusha | 30-39 | 0271234567 | ❌ Non-portable |
| Dodoma | 40-49 | 0401234567 | ❌ Non-portable |
| Mbeya | 50-59 | 0501234567 | ❌ Non-portable |
| Mwanza | 60, 70, 80, 90 | 0601234567 | ❌ Non-portable |

### Emergency Numbers

| Code | Service | Description | Priority |
|------|---------|-------------|----------|
| 112 | Emergency Services | General emergency number | High |
| 113 | Police | Police emergency services | High |
| 114 | Fire Brigade | Fire and rescue services | High |
| 115 | Ambulance | Medical emergency services | High |
| 116 | Traffic Police | Traffic and road safety | Medium |
| 117 | Coast Guard | Maritime emergency services | High |
| 118 | Electricity Emergency | Power grid emergency services | Medium |
| 119 | Water Emergency | Water supply emergency services | Medium |

### Short Codes

| Range | Example | Description |
|-------|---------|-------------|
| 100-109 | 100 | Service short codes |
| 150-159 | 150 | Additional short codes |

### Special Service Numbers

| Service Type | Prefixes | Example | Format |
|--------------|----------|---------|--------|
| Toll-Free | 0800-0809 | 0800123456 | 4+6 digits |
| Premium Rate | 0900-0909 | 0900123456 | 4+6 digits |
| Shared Cost | 0700-0709 | 0700123456 | 4+6 digits |
| VoIP | 0200-0209 | 0200123456 | 4+6 digits |
| Paging | 0100-0109 | 0100123456 | 4+6 digits |
| UAN | 0300-0309 | 0300123456 | 4+6 digits |

### Signaling Point Codes

| Type | Description | Example | Operator |
|------|-------------|---------|----------|
| STP | Signal Transfer Point | 255-001-001 | Vodacom |
| HLR | Home Location Register | 255-001-101 | Vodacom |
| VLR | Visitor Location Register | 255-001-201 | Vodacom |
| MSC | Mobile Switching Center | 255-001-301 | Vodacom |
| SMSC | Short Message Service Center | 255-001-401 | Vodacom |

## Examples

### Basic Validation

```typescript
import { TCRANumberValidator, NumberType } from 'tcra-num-check';

const validator = new TCRANumberValidator();

// Mobile number validation
const mobileResult = validator.validate('0712345678');
console.log(mobileResult.isValid); // true
console.log(mobileResult.numberType); // NumberType.MOBILE
console.log(mobileResult.operator); // 'Airtel Tanzania'

// Fixed line validation
const fixedResult = validator.validate('0221234567');
console.log(fixedResult.isValid); // true
console.log(fixedResult.numberType); // NumberType.FIXED_LINE
console.log(fixedResult.region); // 'Dar es Salaam'

// Emergency number validation
const emergencyResult = validator.validate('112');
console.log(emergencyResult.isValid); // true
console.log(emergencyResult.numberType); // NumberType.EMERGENCY
console.log(emergencyResult.emergencyService); // 'Emergency Services'

// Invalid number
const invalidResult = validator.validate('123456');
console.log(invalidResult.isValid); // false
console.log(invalidResult.numberType); // NumberType.INVALID
```

### Advanced Validation

```typescript
// Validation with portability check
const result = validator.validate('0712345678', { 
  checkPortability: true,
  validateSignalingPoint: true 
});

console.log(result.portabilityStatus); // PortabilityStatus.PORTABLE
console.log(result.numberStatus); // NumberStatus.ACTIVE
console.log(result.carrierSelection); // CarrierSelection.AUTOMATIC

// International format validation
const internationalResult = validator.validate('+255712345678', { 
  allowInternational: true 
});
console.log(internationalResult.isValid); // true
```

### Number Formatting

```typescript
// Different format options
const number = '0712345678';

console.log(validator.formatInternational(number)); // '+255712345678'
console.log(validator.formatNational('+255712345678')); // '0712345678'
console.log(validator.formatNumber(number, { format: 'e164' })); // '+255712345678'
console.log(validator.formatNumber(number, { format: 'rfc3966' })); // 'tel:+255712345678'
```

### Numbering Plan Queries

```typescript
// Query by number type
const mobileNumbers = validator.queryNumberingPlan({ 
  numberType: NumberType.MOBILE 
});
console.log(mobileNumbers.length); // Number of mobile prefixes

// Query by operator
const vodacomNumbers = validator.queryNumberingPlan({ 
  operator: 'Vodacom' 
});
console.log(vodacomNumbers[0].operator); // 'Vodacom Tanzania'

// Get statistics
const stats = validator.getNumberingPlanStatistics();
console.log(`Total numbers: ${stats.totalNumbers}`);
console.log(`Mobile numbers: ${stats.byType[NumberType.MOBILE]}`);
console.log(`Vodacom numbers: ${stats.byOperator['Vodacom Tanzania']}`);
```

### Signaling Point Codes

```typescript
// Get all signaling point codes
const allSpcs = validator.getSignalingPointCodes();
console.log(allSpcs.length); // Total number of SPCs

// Get SPCs by operator
const vodacomSpcs = validator.getSignalingPointCodes('Vodacom');
vodacomSpcs.forEach(spc => {
  console.log(`${spc.code}: ${spc.description} (${spc.type})`);
});

// Validate SPC
const spcResult = validator.validate('255001001', { 
  validateSignalingPoint: true 
});
console.log(spcResult.numberType); // NumberType.SIGNALING_POINT
console.log(spcResult.signalingPointCode); // '255-001-001'
```

### Emergency Services

```typescript
// Get all emergency services
const services = validator.getEmergencyServices();
services.forEach(service => {
  console.log(`${service.code}: ${service.service} (${service.priority} priority)`);
});

// Validate emergency number
const emergencyResult = validator.validate('113');
console.log(emergencyResult.emergencyService); // 'Police'
```

### Carrier Selection

```typescript
// Validate carrier selection codes
const validCodes = ['10', '11', '12', '13', '14', '15', '16', '17', '18', '19'];
validCodes.forEach(code => {
  console.log(`${code}: ${validator.validateCarrierSelection(code)}`);
});
```

## Further Usage Examples

### 1. Bulk Validation of Numbers

You can validate a list of numbers efficiently using `Array.map`:

```typescript
const numbers = ['0712345678', '0221234567', '112', '123456'];
const results = numbers.map(num => validator.validate(num));
results.forEach((result, idx) => {
  console.log(`${numbers[idx]}: ${result.isValid ? 'Valid' : 'Invalid'} (${result.numberType})`);
});
```

### 2. Handling Errors and Warnings

The validator provides detailed error and warning messages for each number:

```typescript
const result = validator.validate('123456');
if (!result.isValid) {
  console.error('Validation failed:', result.errors);
  if (result.warnings.length) {
    console.warn('Warnings:', result.warnings);
  }
}
```

### 3. Customizing Features and Modes

You can enable or disable specific features, or switch between validation modes:

```typescript
// Switch to 'full' mode for comprehensive validation
validator.setMode('full');

// Enable only mobile and emergency validation
validator.updateFeatures({
  validateMobile: true,
  validateEmergency: true,
  validateFixedLine: false,
  validateShortCode: false,
});

// Validate with per-call feature overrides
const result = validator.validate('0712345678', {
  features: { validatePortability: true, validateSignalingPoint: false }
});
```

### 4. Using a Custom Numbering Plan

You can provide your own numbering plan for special use cases:

```typescript
import { TCRANumberValidator } from 'tcra-num-check';
import { myCustomPlan } from './myCustomPlan';

const customValidator = new TCRANumberValidator({ numberingPlan: myCustomPlan });
const result = customValidator.validate('0999999999');
console.log(result);
```

### 5. Troubleshooting Common Issues

- **Number not recognized:** Ensure the number matches the expected format and prefix for Tanzanian numbers.
- **International numbers rejected:** Set `allowInternational: true` in options or features.
- **Missing portability or signaling point info:** Enable `validatePortability` or `validateSignalingPoint` in features or options.
- **Custom plan not working:** Double-check your custom numbering plan structure matches the expected schema.

For more help, see the API reference and the source code in [`src/validator.ts`](src/validator.ts).

## Contributing
1. Create a feature branch
2. Make your changes
3. Add tests for new functionality
4. Run the test suite
5. Submit a pull request

## Testing

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## License

MIT License - see LICENSE file for details.

## References

- [TCRA National Numbering Plan](https://www.tcra.go.tz/)
- [ITU-T Q.700 Series - Signaling System No. 7](https://www.itu.int/rec/T-REC-Q.700)
- [E.164 International Numbering Plan](https://www.itu.int/rec/T-REC-E.164)
- [RFC 3966 - The tel URI for Telephone Numbers](https://tools.ietf.org/html/rfc3966)
