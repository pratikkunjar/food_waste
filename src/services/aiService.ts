import { SurplusReport } from '../types';

export interface AIExtractionResult {
  foodType: string;
  category: string;
  quantity: number;
  quantityUnit: string;
  preparedTime: string;
  sourceKitchen: string;
  location: string;
  temperatureCelsius: number;
  storageCondition: string;
  notes: string;
  isRealAI: boolean;
  modelUsed: string;
}

/**
 * AI Service for voice and text transcription extraction.
 * Integrates with Google Gemini API when VITE_GEMINI_API_KEY is available,
 * with intelligent fallback to local natural language pattern extraction.
 */
export async function extractSurplusFromText(
  transcript: string,
  existingKitchen?: string
): Promise<AIExtractionResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (apiKey && apiKey.trim() !== '') {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `You are an AI assistant for AnnaDhara institutional food surplus rescue system. 
Extract structured food surplus details from the following Indian kitchen voice or text message.
Message: "${transcript}"

Return ONLY valid JSON matching this schema:
{
  "foodType": "string (e.g. Veg Meals, Rice & Dal, etc.)",
  "category": "string (Cooked Meal / Cooked Rice / Curry & Gravy / Breads / Dairy)",
  "quantity": number,
  "quantityUnit": "meals" or "kg" or "portions",
  "preparedTime": "HH:MM (24-hour format like 19:30 or 12:00)",
  "sourceKitchen": "string (e.g. Hostel Mess B)",
  "location": "string",
  "temperatureCelsius": number,
  "storageCondition": "string (e.g. Hot Held (>60°C) or Room Temperature Ambient)",
  "notes": "string"
}`
                  }
                ]
              }
            ],
            generationConfig: {
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (textContent) {
          const parsed = JSON.parse(textContent);
          return {
            foodType: parsed.foodType || 'Veg Thali Meals',
            category: parsed.category || 'Cooked Meal',
            quantity: Number(parsed.quantity) || 40,
            quantityUnit: parsed.quantityUnit || 'meals',
            preparedTime: parsed.preparedTime || '19:30',
            sourceKitchen: parsed.sourceKitchen || existingKitchen || 'Hostel Mess B (Kailash Hall)',
            location: parsed.location || 'North Campus Mess Complex',
            temperatureCelsius: Number(parsed.temperatureCelsius) || 64,
            storageCondition: parsed.storageCondition || 'Hot Held (>60°C)',
            notes: parsed.notes || 'Extracted via Gemini 1.5 Flash',
            isRealAI: true,
            modelUsed: 'Google Gemini 1.5 Flash'
          };
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed or encountered network limitation. Using local AI engine fallback.', err);
    }
  }

  // --- LOCAL NATURAL LANGUAGE EXTRACTION ENGINE (DEMO / OFFLINE FALLBACK) ---
  const lower = transcript.toLowerCase();

  // 1. Quantity extraction
  let quantity = 40;
  let quantityUnit = 'meals';
  const qtyMatch = lower.match(/(\d+)\s*(meals|portions|thali|plates|kg|kilo|packets)?/i);
  if (qtyMatch) {
    quantity = parseInt(qtyMatch[1], 10);
    if (qtyMatch[2]) {
      const u = qtyMatch[2].toLowerCase();
      if (u.includes('kg') || u.includes('kilo')) quantityUnit = 'kg';
      else if (u.includes('portion')) quantityUnit = 'portions';
      else quantityUnit = 'meals';
    }
  }

  // 2. Food type extraction
  let foodType = 'Veg Thali Meals (Dal Tadka, Rice, Subzi, Phulka)';
  let category = 'Cooked Meal';
  if (lower.includes('sambar') || lower.includes('sambhar')) {
    foodType = 'Mixed Sambar Rice & Potato Curry';
    category = 'Cooked Grains & Gravy';
  } else if (lower.includes('biryani') || lower.includes('pulao')) {
    foodType = 'Vegetable Dum Biryani with Gravy';
    category = 'Cooked Rice';
  } else if (lower.includes('roti') || lower.includes('chapati')) {
    foodType = 'Fresh Wheat Phulka Rotis & Dry Subzi';
    category = 'Breads & Roti';
  } else if (lower.includes('khichdi')) {
    foodType = 'Nutritious Moong Dal Khichdi';
    category = 'Cooked Meal';
  } else if (lower.includes('veg meal') || lower.includes('veg thali')) {
    foodType = 'Veg Thali Meals (Dal Tadka, Jeera Rice, Subzi, Roti)';
    category = 'Cooked Meal';
  }

  // 3. Time extraction
  let preparedTime = '19:30';
  const timeMatch = lower.match(/(\d{1,2})[:.]?(\d{2})?\s*(pm|am|baje|pm ko|am ko)?/i);
  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const min = timeMatch[2] ? timeMatch[2] : '00';
    const isPm = lower.includes('pm') || lower.includes('dinner') || lower.includes('shaam') || lower.includes('raat');
    if (isPm && hour < 12) hour += 12;
    preparedTime = `${hour.toString().padStart(2, '0')}:${min}`;
  }

  // 4. Storage & Temperature Condition
  let temperatureCelsius = 64;
  let storageCondition = 'Hot Held (>60°C) in Insulated Steel Warmers';

  if (lower.includes('room temp') || lower.includes('ambient') || lower.includes('thanda') || lower.includes('dopahar') || lower.includes('doopahar')) {
    temperatureCelsius = 27;
    storageCondition = 'Room Temperature Ambient (Unchilled)';
  } else if (lower.includes('freeze') || lower.includes('fridge') || lower.includes('chilled')) {
    temperatureCelsius = 4;
    storageCondition = 'Refrigerated Cold Storage (<5°C)';
  }

  return {
    foodType,
    category,
    quantity,
    quantityUnit,
    preparedTime,
    sourceKitchen: existingKitchen || 'Hostel Mess B (Kailash Hall, Block 2)',
    location: 'North Campus, Gate No. 4 Kitchen Wing',
    temperatureCelsius,
    storageCondition,
    notes: `Extracted from voice transcript: "${transcript}"`,
    isRealAI: false,
    modelUsed: 'AnnaDhara NLP Rule Engine (Local Fallback)'
  };
}
