// Metro2 Field Definitions
export type Field = {
  name: string;
  required: "A" | "Y" | "N";
  format: "AN" | "N" | "B" | "P";
  length: number;
  position: [number, number];
};

export const headerFields: Field[] = [
  {
    name: "Block Descriptor Word",
    required: "A",
    format: "N",
    length: 4,
    position: [1, 4],
  },
  {
    name: "Record Identifier",
    required: "Y",
    format: "AN",
    length: 6,
    position: [5, 10],
  },
  {
    name: "Cycle Number",
    required: "A",
    format: "AN",
    length: 2,
    position: [11, 12],
  },
  {
    name: "Innovis Program Identifier",
    required: "N",
    format: "AN",
    length: 10,
    position: [13, 22],
  },
  {
    name: "Equifax Program Identifier",
    required: "Y",
    format: "AN",
    length: 10,
    position: [23, 32],
  },
  {
    name: "Experian Program Identifier",
    required: "N",
    format: "AN",
    length: 5,
    position: [33, 37],
  },
  {
    name: "Trans Union Program Identifier",
    required: "N",
    format: "AN",
    length: 10,
    position: [38, 47],
  },
  {
    name: "Activity Date",
    required: "Y",
    format: "N",
    length: 8,
    position: [48, 55],
  },
  {
    name: "Date created",
    required: "Y",
    format: "N",
    length: 8,
    position: [56, 63],
  },
  {
    name: "Program date",
    required: "N",
    format: "N",
    length: 8,
    position: [64, 71],
  },
  {
    name: "Program revision date",
    required: "N",
    format: "N",
    length: 8,
    position: [72, 79],
  },
  {
    name: "Reporter name",
    required: "Y",
    format: "AN",
    length: 40,
    position: [80, 119],
  },
  {
    name: "Reporter address",
    required: "N",
    format: "AN",
    length: 96,
    position: [120, 215],
  },
  {
    name: "Reporter telephone number",
    required: "N",
    format: "N",
    length: 10,
    position: [216, 225],
  },
  {
    name: "Software vendor name",
    required: "A",
    format: "AN",
    length: 40,
    position: [226, 265],
  },
  {
    name: "Software version number",
    required: "N",
    format: "AN",
    length: 5,
    position: [266, 270],
  },
  {
    name: "MicroBilt/PRBC Identifier",
    required: "N",
    format: "AN",
    length: 10,
    position: [271, 280],
  },
  {
    name: "Reserved",
    required: "N",
    format: "AN",
    length: 146,
    position: [281, 426],
  },
];

// Metro2 Base Segment Format - Character Format
export const baseFields: Field[] = [
  {
    name: "Block descriptor word",
    required: "A",
    format: "N",
    length: 4,
    position: [1, 4],
  },
  {
    name: "Record descriptor word",
    required: "A",
    format: "N",
    length: 1,
    position: [5, 5],
  },
  {
    name: "Time stamp",
    required: "N",
    format: "N",
    length: 14,
    position: [6, 19],
  },
  {
    name: "Correction indicator",
    required: "Y",
    format: "N",
    length: 1,
    position: [20, 20],
  },
  {
    name: "Identification number",
    required: "Y",
    format: "AN",
    length: 20,
    position: [21, 40],
  },
  {
    name: "Cycle identifier",
    required: "A",
    format: "AN",
    length: 2,
    position: [41, 42],
  },
  {
    name: "Consumer account number",
    required: "Y",
    format: "AN",
    length: 30,
    position: [43, 72],
  },
  {
    name: "Portfolio type",
    required: "Y",
    format: "AN",
    length: 1,
    position: [73, 73],
  },
  {
    name: "Account type",
    required: "Y",
    format: "AN",
    length: 2,
    position: [74, 75],
  },
  {
    name: "Date opened",
    required: "Y",
    format: "N",
    length: 8,
    position: [76, 83],
  },
  {
    name: "Credit limit",
    required: "Y",
    format: "N",
    length: 9,
    position: [84, 92],
  },
  {
    name: "Highest credit or original loan amount",
    required: "Y",
    format: "N",
    length: 9,
    position: [93, 101],
  },
  {
    name: "Terms duration",
    required: "N",
    format: "AN",
    length: 3,
    position: [102, 104],
  },
  {
    name: "Terms frequency",
    required: "Y",
    format: "AN",
    length: 1,
    position: [105, 105],
  },
  {
    name: "Scheduled Payment Amount",
    required: "Y",
    format: "N",
    length: 9,
    position: [106, 114],
  },
  {
    name: "Actual Payment Amount",
    required: "Y",
    format: "N",
    length: 9,
    position: [115, 123],
  },
  {
    name: "Account Status",
    required: "Y",
    format: "AN",
    length: 2,
    position: [124, 125],
  },
  {
    name: "Payment Rating",
    required: "Y",
    format: "AN",
    length: 1,
    position: [126, 126],
  },
  {
    name: "Payment History Profile",
    required: "Y",
    format: "AN",
    length: 24,
    position: [127, 150],
  },
  {
    name: "Special Comment",
    required: "A",
    format: "AN",
    length: 2,
    position: [151, 152],
  },
  {
    name: "Compliance Condition Code",
    required: "A",
    format: "AN",
    length: 2,
    position: [153, 154],
  },
  {
    name: "Current Balance",
    required: "Y",
    format: "N",
    length: 9,
    position: [155, 163],
  },
  {
    name: "Amount Past Due",
    required: "Y",
    format: "N",
    length: 9,
    position: [164, 172],
  },
  {
    name: "Original Charge-Off Amount",
    required: "Y",
    format: "N",
    length: 9,
    position: [173, 181],
  },
  {
    name: "Date of Account Information",
    required: "N",
    format: "N",
    length: 8,
    position: [182, 189],
  },
  {
    name: "FCRA Compliance / Date of First Delinquency",
    required: "Y",
    format: "N",
    length: 8,
    position: [190, 197],
  },
  {
    name: "Date Closed",
    required: "Y",
    format: "N",
    length: 8,
    position: [198, 205],
  },
  {
    name: "Date of Last Payment",
    required: "Y",
    format: "N",
    length: 8,
    position: [206, 213],
  },
  {
    name: "Currency Type Code",
    required: "N",
    format: "AN",
    length: 17,
    position: [214, 230],
  },
  {
    name: "Consumer Transaction Type",
    required: "A",
    format: "N",
    length: 1,
    position: [231, 231],
  },
  {
    name: "Surname",
    required: "Y",
    format: "AN",
    length: 25,
    position: [232, 256],
  },
  {
    name: "First Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [257, 276],
  },
  {
    name: "Middle Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [277, 296],
  },
  {
    name: "Generation Code",
    required: "A",
    format: "AN",
    length: 1,
    position: [297, 297],
  },
  {
    name: "Social Insurance Number",
    required: "A",
    format: "N",
    length: 9,
    position: [298, 306],
  },
  {
    name: "Date of Birth",
    required: "Y",
    format: "N",
    length: 8,
    position: [307, 314],
  },
  {
    name: "Telephone Number",
    required: "Y",
    format: "N",
    length: 10,
    position: [315, 324],
  },
  {
    name: "ECOA/Association Code",
    required: "Y",
    format: "AN",
    length: 1,
    position: [325, 325],
  },
  {
    name: "Consumer Information Indicator",
    required: "A",
    format: "AN",
    length: 2,
    position: [326, 327],
  },
  {
    name: "Country Code",
    required: "A",
    format: "AN",
    length: 2,
    position: [328, 329],
  },
  {
    name: "First Line of Address",
    required: "Y",
    format: "AN",
    length: 32,
    position: [330, 361],
  },
  {
    name: "Second Line of Address",
    required: "Y",
    format: "AN",
    length: 32,
    position: [362, 393],
  },
  {
    name: "City",
    required: "Y",
    format: "AN",
    length: 20,
    position: [394, 413],
  },
  {
    name: "State (Province)",
    required: "Y",
    format: "AN",
    length: 2,
    position: [414, 415],
  },
  {
    name: "Postal Code",
    required: "Y",
    format: "AN",
    length: 9,
    position: [416, 424],
  },
  {
    name: "Address Indicator",
    required: "N",
    format: "AN",
    length: 1,
    position: [425, 425],
  },
  {
    name: "Residence Code",
    required: "N",
    format: "AN",
    length: 1,
    position: [426, 426],
  },
];

// J2 Segment Format
export const j2Fields: Field[] = [
  {
    name: "Segment Identifier",
    required: "Y",
    format: "AN",
    length: 2,
    position: [1, 2],
  },
  {
    name: "Consumer Transaction Type",
    required: "A",
    format: "AN",
    length: 1,
    position: [3, 3],
  },
  {
    name: "Surname",
    required: "Y",
    format: "AN",
    length: 25,
    position: [4, 28],
  },
  {
    name: "First Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [29, 48],
  },
  {
    name: "Middle Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [49, 68],
  },
  {
    name: "Generation Code",
    required: "A",
    format: "AN",
    length: 1,
    position: [69, 69],
  },
  {
    name: "Social Insurance Number",
    required: "A",
    format: "N",
    length: 9,
    position: [70, 78],
  },
  {
    name: "Date of Birth",
    required: "Y",
    format: "N",
    length: 8,
    position: [79, 86],
  },
  {
    name: "Telephone Number",
    required: "Y",
    format: "N",
    length: 10,
    position: [87, 96],
  },
  {
    name: "ECOA/Association Code",
    required: "Y",
    format: "AN",
    length: 1,
    position: [97, 97],
  },
  {
    name: "Consumer Information Indicator",
    required: "A",
    format: "AN",
    length: 2,
    position: [98, 99],
  },
  {
    name: "Country Code",
    required: "A",
    format: "AN",
    length: 2,
    position: [100, 101],
  },
  {
    name: "First Line of Address",
    required: "Y",
    format: "AN",
    length: 32,
    position: [102, 133],
  },
  {
    name: "Second Line of Address",
    required: "Y",
    format: "AN",
    length: 32,
    position: [134, 165],
  },
  {
    name: "City",
    required: "Y",
    format: "AN",
    length: 20,
    position: [166, 185],
  },
  {
    name: "State (Province)",
    required: "Y",
    format: "AN",
    length: 2,
    position: [186, 187],
  },
  {
    name: "Postal Code",
    required: "Y",
    format: "AN",
    length: 9,
    position: [188, 196],
  },
  {
    name: "Address Indicator",
    required: "N",
    format: "AN",
    length: 1,
    position: [197, 197],
  },
  {
    name: "Residence Code",
    required: "N",
    format: "AN",
    length: 1,
    position: [198, 198],
  },
  {
    name: "Reserved",
    required: "N",
    format: "AN",
    length: 2,
    position: [199, 200],
  },
];

// K1 Segment Format
export const k1Fields: Field[] = [
  {
    name: "Segment Identifier",
    required: "Y",
    format: "AN",
    length: 2,
    position: [1, 2],
  },
  {
    name: "Original Creditor Name",
    required: "A",
    format: "AN",
    length: 30,
    position: [3, 32],
  },
  {
    name: "Creditor Classification",
    required: "N",
    format: "AN",
    length: 2,
    position: [33, 34],
  },
];

export const j1Fields: Field[] = [
  {
    name: "Segment Identifier",
    required: "Y",
    format: "AN",
    length: 2,
    position: [1, 2],
  },
  {
    name: "Consumer Transaction Type",
    required: "A",
    format: "AN",
    length: 1,
    position: [3, 3],
  },
  {
    name: "Surname",
    required: "Y",
    format: "AN",
    length: 25,
    position: [4, 28],
  },
  {
    name: "First Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [29, 48],
  },
  {
    name: "Middle Name",
    required: "Y",
    format: "AN",
    length: 20,
    position: [49, 68],
  },
  {
    name: "Generation Code",
    required: "A",
    format: "AN",
    length: 1,
    position: [69, 69],
  },
  {
    name: "Social Insurance Number",
    required: "A",
    format: "N",
    length: 9,
    position: [70, 78],
  },
  {
    name: "Date of Birth",
    required: "Y",
    format: "N",
    length: 8,
    position: [79, 86],
  },
  {
    name: "Telephone Number",
    required: "Y",
    format: "N",
    length: 10,
    position: [87, 96],
  },
  {
    name: "ECOA/Association Code",
    required: "Y",
    format: "AN",
    length: 1,
    position: [97, 97],
  },
  {
    name: "Consumer Information Indicator",
    required: "A",
    format: "AN",
    length: 2,
    position: [98, 99],
  },
  {
    name: "Reserved",
    required: "N",
    format: "AN",
    length: 1,
    position: [100, 100],
  },
];

export const trailerFields: Field[] = [
  {
    name: "Record Descriptor Word",
    required: "N",
    format: "N",
    length: 4,
    position: [1, 4],
  },
  {
    name: "Record Identifier",
    required: "N",
    format: "AN",
    length: 7,
    position: [5, 11],
  },
  {
    name: "Total Base Records",
    required: "N",
    format: "N",
    length: 9,
    position: [12, 20],
  },
  {
    name: "Reserved",
    required: "N",
    format: "AN",
    length: 9,
    position: [21, 29],
  },
  {
    name: "Total Status Code DF",
    required: "N",
    format: "N",
    length: 9,
    position: [30, 38],
  },
  {
    name: "Total Associated Consumer Segments (J1)",
    required: "N",
    format: "N",
    length: 9,
    position: [39, 47],
  },
  {
    name: "Total Associated Consumer Segments (J2)",
    required: "N",
    format: "N",
    length: 9,
    position: [48, 56],
  },
  {
    name: "Block Count",
    required: "N",
    format: "N",
    length: 9,
    position: [57, 65],
  },
  {
    name: "Total of Status Code DA",
    required: "N",
    format: "N",
    length: 9,
    position: [66, 74],
  },
  {
    name: "Total of Status Code 05",
    required: "N",
    format: "N",
    length: 9,
    position: [75, 83],
  },
  {
    name: "Total of Status Code 11",
    required: "N",
    format: "N",
    length: 9,
    position: [84, 92],
  },
  {
    name: "Total of Status Code 13",
    required: "N",
    format: "N",
    length: 9,
    position: [93, 101],
  },
  {
    name: "Total of Status Code 61",
    required: "N",
    format: "N",
    length: 9,
    position: [102, 110],
  },
  {
    name: "Total of Status Code 62",
    required: "N",
    format: "B",
    length: 5,
    position: [111, 119],
  },
  {
    name: "Total of Status Code 63",
    required: "N",
    format: "AN",
    length: 5,
    position: [120, 128],
  },
  {
    name: "Total of Status Code 64",
    required: "N",
    format: "P",
    length: 5,
    position: [129, 137],
  },
  {
    name: "Total of Status Code 65",
    required: "N",
    format: "AN",
    length: 5,
    position: [138, 146],
  },
  {
    name: "Total of Status Code 71",
    required: "N",
    format: "P",
    length: 5,
    position: [147, 155],
  },
  {
    name: "Total of Status Code 78",
    required: "N",
    format: "P",
    length: 5,
    position: [156, 164],
  },
  {
    name: "Total of Status Code 80",
    required: "N",
    format: "P",
    length: 5,
    position: [165, 173],
  },
  {
    name: "Total of Status Code 82",
    required: "N",
    format: "P",
    length: 5,
    position: [174, 182],
  },
  {
    name: "Total of Status Code 83",
    required: "N",
    format: "P",
    length: 5,
    position: [183, 191],
  },
  {
    name: "Total of Status Code 84",
    required: "N",
    format: "P",
    length: 5,
    position: [192, 200],
  },
  {
    name: "Total of Status Code 88",
    required: "N",
    format: "P",
    length: 5,
    position: [201, 209],
  },
  {
    name: "Total of Status Code 89",
    required: "N",
    format: "P",
    length: 5,
    position: [210, 218],
  },
  {
    name: "Total of Status Code 93",
    required: "N",
    format: "P",
    length: 5,
    position: [219, 227],
  },
  {
    name: "Total of Status Code 94",
    required: "N",
    format: "P",
    length: 5,
    position: [228, 236],
  },
  {
    name: "Total of Status Code 95",
    required: "N",
    format: "P",
    length: 5,
    position: [237, 245],
  },
  {
    name: "Total of Status Code 96",
    required: "N",
    format: "P",
    length: 5,
    position: [246, 254],
  },
  {
    name: "Total of Status Code 97",
    required: "N",
    format: "P",
    length: 5,
    position: [255, 263],
  },
  {
    name: "Total of ECOA Code Z (All segments)",
    required: "N",
    format: "P",
    length: 5,
    position: [264, 272],
  },
  {
    name: "Total Employment Segments",
    required: "N",
    format: "P",
    length: 5,
    position: [273, 281],
  },
  {
    name: "Total Original Creditor Segments",
    required: "N",
    format: "P",
    length: 5,
    position: [282, 290],
  },
  {
    name: "Total Purchased Portfolio/Sold To Segments",
    required: "N",
    format: "P",
    length: 5,
    position: [291, 299],
  },
  {
    name: "Total Mortgage Information Segments",
    required: "N",
    format: "P",
    length: 5,
    position: [300, 308],
  },
  {
    name: "Total Specialized Payment Information",
    required: "N",
    format: "P",
    length: 5,
    position: [309, 317],
  },
];
