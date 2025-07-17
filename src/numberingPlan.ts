import { NumberingPlan, NumberType } from "./types";

/**
 * Tanzanian National Numbering Plan
 * Based on TCRA (Tanzania Communications Regulatory Authority) standards
 * Comprehensive implementation covering all aspects of the numbering plan
 */

export const TANZANIAN_NUMBERING_PLAN: NumberingPlan = {
  countryCode: "255",
  nationalPrefix: "0",

  // Mobile prefixes (4-digit access codes: 06YA or 07YA format)
  // Format: 06YA XXXXXX or 07YA XXXXXX (10 digits total)
  // 06/07: Access code for "Find Me Anywhere" services
  // A: Destination code (digit 2)
  // Y: Operator identifier (digit 3)
  mobilePrefixes: [
    "061", // Viettel Tanzania PLC (Halotel)
    "062", // Viettel Tanzania PLC (Halotel)
    "065", // Honora Tanzania PLC (Tigo/Yas)
    "066", // Smile Communications Tanzania Limited
    "067", // Honora Tanzania PLC (Tigo/Yas)
    "068", // Airtel Tanzania PLC
    "069", // Airtel Tanzania PLC
    "071", // Honora Tanzania PLC (Tigo/Yas)
    "077", // Honora Tanzania PLC (Tigo/Yas)
    "073", // Tanzania Telecommunications Corporation (TCC)
    "074", // Vodacom Tanzania PLC
    "075", // Vodacom Tanzania PLC
    "076", // Vodacom Tanzania PLC
    "078", // Airtel Tanzania PLC
  ],

  // Fixed line prefixes (7-digit numbers after prefix)
  fixedLinePrefixes: [
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29", // Dar es Salaam
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39", // Arusha
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49", // Dodoma
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59", // Mbeya
    "60",
    "70",
    "80",
    "90", // Mwanza
  ],

  // Toll-free numbers (0800 YY XXXX format)
  // 0800: National Free phone (Local Toll-Free)
  // 0808: International Rate Services (Special Service)
  tollFreePrefixes: [
    "0800", // National Free phone (Local Toll-Free)
    "0808", // International Rate Services (Special Service)
  ],

  // Premium rate numbers (090X YY XXXX format)
  // 0900: Information Services (Premium Services)
  // 0901: Entertainments Services (Multi-media Services)
  // 0902: Competitions/Tele-voting
  // 0903-0909: Spare
  premiumRatePrefixes: [
    "0900", // Information Services (Premium Services)
    "0901", // Entertainments Services (Multi-media Services)
    "0902", // Competitions/Tele-voting
    "0903", // Spare
    "0904", // Spare
    "0905", // Spare
    "0906", // Spare
    "0907", // Spare
    "0908", // Spare
    "0909", // Spare
  ],

  // Shared cost numbers
  sharedCostPrefixes: [
    "0700",
    "0701",
    "0702",
    "0703",
    "0704",
    "0705",
    "0706",
    "0707",
    "0708",
    "0709",
  ],

  // VoIP numbers
  voipPrefixes: [
    "0200",
    "0201",
    "0202",
    "0203",
    "0204",
    "0205",
    "0206",
    "0207",
    "0208",
    "0209",
  ],

  // Paging numbers
  pagingPrefixes: [
    "0100",
    "0101",
    "0102",
    "0103",
    "0104",
    "0105",
    "0106",
    "0107",
    "0108",
    "0109",
  ],

  // Universal Access Numbers
  uanPrefixes: [
    "0300",
    "0301",
    "0302",
    "0303",
    "0304",
    "0305",
    "0306",
    "0307",
    "0308",
    "0309",
  ],

  // Emergency numbers
  emergencyPrefixes: ["112", "113", "114", "115", "116", "117", "118", "119"],

  // Short codes
  shortCodePrefixes: [
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
  ],

  // Signaling Point Codes (based on ITU-T Q.700 series)
  signalingPointCodes: [
    // Vodacom Signaling Points
    {
      code: "255-001-001",
      description: "Vodacom STP-1 Dar es Salaam",
      type: "STP",
      operator: "Vodacom Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-001-002",
      description: "Vodacom STP-2 Arusha",
      type: "STP",
      operator: "Vodacom Tanzania",
      location: "Arusha",
      status: "active",
    },
    {
      code: "255-001-101",
      description: "Vodacom HLR-1",
      type: "HLR",
      operator: "Vodacom Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-001-201",
      description: "Vodacom SMSC",
      type: "SMSC",
      operator: "Vodacom Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },

    // Airtel Signaling Points
    {
      code: "255-002-001",
      description: "Airtel STP-1 Dar es Salaam",
      type: "STP",
      operator: "Airtel Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-002-002",
      description: "Airtel STP-2 Mwanza",
      type: "STP",
      operator: "Airtel Tanzania",
      location: "Mwanza",
      status: "active",
    },
    {
      code: "255-002-101",
      description: "Airtel HLR-1",
      type: "HLR",
      operator: "Airtel Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },

    // Tigo Signaling Points
    {
      code: "255-003-001",
      description: "Tigo STP-1 Dar es Salaam",
      type: "STP",
      operator: "Tigo/Yas Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-003-101",
      description: "Tigo HLR-1",
      type: "HLR",
      operator: "Tigo/Yas Tanzania",
      location: "Dar es Salaam",
      status: "active",
    },

    // Halotel Signaling Points
    {
      code: "255-004-001",
      description: "Halotel STP-1 Dar es Salaam",
      type: "STP",
      operator: "Halotel",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-004-101",
      description: "Halotel HLR-1",
      type: "HLR",
      operator: "Halotel",
      location: "Dar es Salaam",
      status: "active",
    },

    // TTCL Signaling Points
    {
      code: "255-005-001",
      description: "TTCL STP-1 Dar es Salaam",
      type: "STP",
      operator: "TTCL",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-005-002",
      description: "TTCL STP-2 Arusha",
      type: "STP",
      operator: "TTCL",
      location: "Arusha",
      status: "active",
    },

    // Emergency Services Signaling Points
    {
      code: "255-999-001",
      description: "Emergency Services STP",
      type: "STP",
      operator: "TCRA",
      location: "Dar es Salaam",
      status: "active",
    },
    {
      code: "255-999-101",
      description: "Emergency Services SCP",
      type: "SCP",
      operator: "TCRA",
      location: "Dar es Salaam",
      status: "active",
    },
  ],

  // Specific Toll-Free Services with Operator Assignments
  tollFreeServices: [
    {
      prefix: "0800",
      subPrefix: "11",
      operator: "Tanzania Telecommunications Corporation",
      service: "Local Toll Free",
      status: "Operational",
      description: "National Free phone (Local Toll-Free)",
    },
    {
      prefix: "0800",
      subPrefix: "12",
      operator: "Honora Tanzania PLC",
      service: "Local Toll Free",
      status: "Operational",
      description: "National Free phone (Local Toll-Free)",
    },
    {
      prefix: "0800",
      subPrefix: "71",
      operator: "Honora Tanzania PLC",
      service: "Local Toll Free",
      status: "Operational",
      description: "National Free phone (Local Toll-Free)",
    },
    {
      prefix: "0800",
      subPrefix: "75",
      operator: "Vodacom Tanzania PLC",
      service: "Local Toll Free",
      status: "Operational",
      description: "National Free phone (Local Toll-Free)",
    },
    {
      prefix: "0800",
      subPrefix: "78",
      operator: "Airtel Tanzania PLC",
      service: "Local Toll Free",
      status: "Operational",
      description: "National Free phone (Local Toll-Free)",
    },
    {
      prefix: "0808",
      subPrefix: "11",
      operator: "Tanzania Telecommunications Corporation",
      service: "International Toll Number",
      status: "Operational",
      description: "International Rate Services (Special Service)",
    },
    {
      prefix: "0808",
      subPrefix: "00",
      operator: "Vodacom Tanzania PLC",
      service: "International Toll Number",
      status: "Operational",
      description: "International Rate Services (Special Service)",
    },
  ],

  // Specific Premium Rate Services with Operator Assignments
  premiumRateServices: [
    {
      prefix: "0901",
      subPrefix: "00",
      operator: "Airtel Tanzania PLC",
      service: "Entertainments Services (Multi-media Services)",
      status: "Operational",
      description: "Entertainments Services (Multi-media Services)",
    },
    {
      prefix: "0901",
      subPrefix: "12",
      operator: "Vodacom Tanzania PLC",
      service: "Entertainments Services (Multi-media Services)",
      status: "Operational",
      description: "Entertainments Services (Multi-media Services)",
    },
    {
      prefix: "0901",
      subPrefix: "65",
      operator: "Honora Tanzania PLC",
      service: "Entertainments Services (Multi-media Services)",
      status: "Operational",
      description: "Entertainments Services (Multi-media Services)",
    },
    {
      prefix: "0901",
      subPrefix: "76",
      operator: "Vodacom Tanzania PLC",
      service: "Entertainments Services (Multi-media Services)",
      status: "Operational",
      description: "Entertainments Services (Multi-media Services)",
    },
    {
      prefix: "0901",
      subPrefix: "22",
      operator: "Viettel Tanzania PLC",
      service: "Entertainments Services (Multi-media Services)",
      status: "Operational",
      description: "Entertainments Services (Multi-media Services)",
    },
    {
      prefix: "0900",
      subPrefix: "01",
      operator: "Vodacom Tanzania PLC",
      service: "Information Services (Premium Services)",
      status: "Operational",
      description: "Information Services (Premium Services)",
    },
  ],

  // Emergency Services
  // TODO: ADD MORE EMERGENCY SERVICES E.G 110
  emergencyServices: [
    {
      code: "112",
      service: "Emergency Services",
      description: "General emergency number",
      priority: "high",
    },
    {
      code: "113",
      service: "Police",
      description: "Police emergency services",
      priority: "high",
    },
    {
      code: "114",
      service: "Fire Brigade",
      description: "Fire and rescue services",
      priority: "high",
    },
    {
      code: "115",
      service: "Ambulance",
      description: "Medical emergency services",
      priority: "high",
    },
    {
      code: "116",
      service: "Traffic Police",
      description: "Traffic and road safety",
      priority: "medium",
    },
    {
      code: "117",
      service: "Coast Guard",
      description: "Maritime emergency services",
      priority: "high",
    },
    {
      code: "118",
      service: "Electricity Emergency",
      description: "Power grid emergency services",
      priority: "medium",
    },
    {
      code: "119",
      service: "Water Emergency",
      description: "Water supply emergency services",
      priority: "medium",
    },
  ],

  // Enhanced operator information
  operators: [
    {
      name: "Viettel Tanzania PLC",
      codes: ["061", "062"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/001",
      serviceAreas: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya"],
      portabilitySupported: true,
      aliases: ["Halotel"],
    },
    {
      name: "Honora Tanzania PLC",
      codes: ["065", "067", "071", "077"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/002",
      serviceAreas: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya"],
      portabilitySupported: true,
      aliases: ["Tigo", "Yas"],
    },
    {
      name: "Smile Communications Tanzania Limited",
      codes: ["066"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/003",
      serviceAreas: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya"],
      portabilitySupported: true,
      aliases: ["Smile"],
    },
    {
      name: "Airtel Tanzania PLC",
      codes: ["068", "069", "078"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/004",
      serviceAreas: ["Dar es Salaam", "Mwanza", "Arusha", "Dodoma", "Mbeya"],
      portabilitySupported: true,
      aliases: ["Airtel"],
    },
    {
      name: "Vodacom Tanzania PLC",
      codes: ["074", "075", "076"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/005",
      serviceAreas: ["Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya"],
      portabilitySupported: true,
      aliases: ["Vodacom"],
    },
    {
      name: "Tanzania Telecommunications Corporation (TCC)",
      codes: ["073"],
      type: NumberType.MOBILE,
      licenseNumber: "TCRA/LIC/MOB/006",
      serviceAreas: ["Dar es Salaam", "Arusha", "Dodoma", "Mbeya", "Mwanza"],
      portabilitySupported: true,
      aliases: ["TTCL"],
    },
    {
      name: "TTCL",
      codes: ["22", "23", "24", "25", "26", "27", "28", "29"],
      type: NumberType.FIXED_LINE,
      licenseNumber: "TCRA/LIC/FIX/001",
      serviceAreas: ["Dar es Salaam", "Arusha", "Dodoma", "Mbeya", "Mwanza"],
      portabilitySupported: false,
      aliases: ["TTCL"],
    },
  ],

  // Number Portability Configuration
  numberPortability: {
    enabled: true,
    supportedTypes: [NumberType.MOBILE],
    portingTime: "24 hours",
  },

  // Carrier Selection Configuration
  carrierSelection: {
    enabled: true,
    codes: ["10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
  },

  // Number Reservation Configuration
  numberReservation: {
    enabled: true,
    maxReservationDays: 30,
  },
};
