/**
 * OCR Module - Simulates text extraction from uploaded images
 * In production, this would use pytesseract or similar OCR library
 * For demo purposes, we simulate OCR by extracting mock data from images
 */

export interface OCRResult {
  success: boolean;
  extractedText: string;
  detectedFields?: {
    passengerName?: string;
    pnr?: string;
    flightNumber?: string;
    airline?: string;
    date?: string;
    source?: string;
    destination?: string;
  };
  error?: string;
}

/**
 * Simulate OCR text extraction from uploaded file
 * Returns mock extracted data for demonstration
 */
export async function extractTextFromImage(file: File): Promise<OCRResult> {
  // Simulate processing delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate file type
  if (!file.type.startsWith("image/")) {
    return {
      success: false,
      extractedText: "",
      error: "Invalid file type. Please upload an image file.",
    };
  }

  // Generate mock OCR results based on file name or random data
  const mockResults = generateMockOCRData(file.name);

  return {
    success: true,
    extractedText: mockResults.text,
    detectedFields: mockResults.fields,
  };
}

/**
 * Generate realistic mock OCR data
 */
function generateMockOCRData(fileName: string) {
  // Sample boarding pass data
  const mockBoardingPasses = [
    {
      text: `BOARDING PASS
Air India
Passenger: RAJESH KUMAR
PNR: ABC123XYZ
Flight: AI-342
From: DEL (Delhi) To: BOM (Mumbai)
Date: 15-Mar-2026
Seat: 12A
Gate: 23
Boarding: 14:30`,
      fields: {
        passengerName: "Rajesh Kumar",
        pnr: "ABC123XYZ",
        flightNumber: "AI-342",
        airline: "Air India",
        date: "2026-03-15",
        source: "Delhi",
        destination: "Mumbai",
      },
    },
    {
      text: `E-TICKET
IndiGo Airlines
Name: PRIYA SHARMA
PNR: 6E78945
Flight Number: 6E-2451
Route: BLR - DEL
Date of Journey: 20-Mar-2026
Booking Ref: IND456789`,
      fields: {
        passengerName: "Priya Sharma",
        pnr: "6E78945",
        flightNumber: "6E-2451",
        airline: "IndiGo",
        date: "2026-03-20",
        source: "Bangalore",
        destination: "Delhi",
      },
    },
    {
      text: `SPICEJET BOARDING PASS
Passenger Name: AMIT PATEL
Booking Reference: SG12345
Flight: SG-8756
Departure: HYD (Hyderabad)
Arrival: CCU (Kolkata)
Travel Date: 25-Mar-2026`,
      fields: {
        passengerName: "Amit Patel",
        pnr: "SG12345",
        flightNumber: "SG-8756",
        airline: "SpiceJet",
        date: "2026-03-25",
        source: "Hyderabad",
        destination: "Kolkata",
      },
    },
  ];

  // Return random mock data
  const randomIndex = Math.floor(Math.random() * mockBoardingPasses.length);
  return mockBoardingPasses[randomIndex];
}

/**
 * Extract specific field from OCR text using pattern matching
 */
export function extractField(text: string, fieldName: string): string | null {
  const patterns: Record<string, RegExp> = {
    pnr: /PNR[:\s]+([A-Z0-9]{6,10})/i,
    flight: /Flight[:\s]+([A-Z0-9]{2}-?\d{3,4})/i,
    passenger: /(?:Passenger|Name)[:\s]+([A-Z\s]+)/i,
    date: /Date[:\s]+(\d{2}-\w{3}-\d{4})/i,
  };

  const pattern = patterns[fieldName.toLowerCase()];
  if (!pattern) return null;

  const match = text.match(pattern);
  return match ? match[1].trim() : null;
}
