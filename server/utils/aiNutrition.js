// Mock AI nutrition estimation (for hackathon demo)
// In production, this would call an actual AI service or food database API

const FOOD_DATABASE = {
  'chicken breast': { protein: 31, potassium: 220, phosphorus: 220, sodium: 74 },
  'grilled chicken': { protein: 31, potassium: 220, phosphorus: 220, sodium: 74 },
  'salmon': { protein: 25, potassium: 363, phosphorus: 200, sodium: 44 },
  'banana': { protein: 1.1, potassium: 358, phosphorus: 22, sodium: 1 },
  'apple': { protein: 0.3, potassium: 107, phosphorus: 12, sodium: 1 },
  'rice': { protein: 2.7, potassium: 35, phosphorus: 43, sodium: 1 },
  'broccoli': { protein: 2.8, potassium: 316, phosphorus: 66, sodium: 33 },
  'potato': { protein: 2, potassium: 421, phosphorus: 57, sodium: 6 },
  'egg': { protein: 13, potassium: 138, phosphorus: 191, sodium: 140 },
  'milk': { protein: 3.4, potassium: 150, phosphorus: 93, sodium: 44 },
  'bread': { protein: 9, potassium: 98, phosphorus: 98, sodium: 491 },
  'cheese': { protein: 25, potassium: 98, phosphorus: 512, sodium: 621 },
  'yogurt': { protein: 10, potassium: 141, phosphorus: 135, sodium: 36 },
  'orange': { protein: 0.9, potassium: 181, phosphorus: 14, sodium: 0 },
  'spinach': { protein: 2.9, potassium: 558, phosphorus: 49, sodium: 79 },
};

// Normalize food name for lookup
const normalizeFoodName = (foodName) => {
  return foodName.toLowerCase().trim();
};

// Estimate nutrition from food name
export const estimateNutritionFromText = async (foodName, portionSize = 100) => {
  const normalized = normalizeFoodName(foodName);
  
  // Try exact match first
  let nutrients = FOOD_DATABASE[normalized];
  
  // Try partial match
  if (!nutrients) {
    const keys = Object.keys(FOOD_DATABASE);
    const match = keys.find(key => normalized.includes(key) || key.includes(normalized));
    if (match) {
      nutrients = FOOD_DATABASE[match];
    }
  }
  
  // Default values if not found
  if (!nutrients) {
    nutrients = { protein: 10, potassium: 200, phosphorus: 100, sodium: 100 };
  }
  
  // Scale by portion size (assuming nutrients are per 100g)
  const scale = portionSize / 100;
  
  return {
    foodName: foodName,
    portionSize: portionSize,
    nutrients: {
      protein: {
        value: Math.round(nutrients.protein * scale * 10) / 10,
        unit: 'g',
        confidence: nutrients ? 0.85 : 0.60
      },
      potassium: {
        value: Math.round(nutrients.potassium * scale),
        unit: 'mg',
        confidence: nutrients ? 0.75 : 0.60
      },
      phosphorus: {
        value: Math.round(nutrients.phosphorus * scale),
        unit: 'mg',
        confidence: nutrients ? 0.80 : 0.60
      },
      sodium: {
        value: Math.round(nutrients.sodium * scale),
        unit: 'mg',
        confidence: nutrients ? 0.90 : 0.60
      }
    },
    confidenceScore: nutrients ? 0.82 : 0.65,
    disclaimer: true
  };
};

// Estimate nutrition from image (mock - would use actual AI in production)
export const estimateNutritionFromImage = async (imageBuffer, portionSize = 100) => {
  // In production, this would:
  // 1. Send image to OpenAI Vision API or similar
  // 2. Extract food name
  // 3. Look up in database
  
  // For demo, return a generic response
  return {
    foodName: 'Detected Food',
    portionSize: portionSize,
    nutrients: {
      protein: { value: 20, unit: 'g', confidence: 0.70 },
      potassium: { value: 300, unit: 'mg', confidence: 0.65 },
      phosphorus: { value: 150, unit: 'mg', confidence: 0.70 },
      sodium: { value: 200, unit: 'mg', confidence: 0.75 }
    },
    confidenceScore: 0.70,
    disclaimer: true
  };
};


