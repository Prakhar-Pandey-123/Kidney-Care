import axios from 'axios';
import FormData from 'form-data';

// Spoonacular API - FREE tier: 150 requests/day
// Get your free API key from: https://spoonacular.com/food-api
const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || 'YOUR_API_KEY_HERE';
const SPOONACULAR_BASE_URL = 'https://api.spoonacular.com';

// Fallback food database for text search
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

// Extract and format nutrients from Spoonacular response
const extractNutrients = (nutrients, foodName, portionSize) => {
  // Find nutrients (Spoonacular uses specific names)
  const protein = nutrients.find(n => n.name === 'Protein') || nutrients.find(n => n.name === 'protein') || { amount: 0 };
  const potassium = nutrients.find(n => n.name === 'Potassium, K') || nutrients.find(n => n.name === 'Potassium') || nutrients.find(n => n.name === 'K') || { amount: 0 };
  const phosphorus = nutrients.find(n => n.name === 'Phosphorus, P') || nutrients.find(n => n.name === 'Phosphorus') || nutrients.find(n => n.name === 'P') || { amount: 0 };
  const sodium = nutrients.find(n => n.name === 'Sodium, Na') || nutrients.find(n => n.name === 'Sodium') || nutrients.find(n => n.name === 'Na') || { amount: 0 };

  return {
    foodName: foodName,
    portionSize: portionSize,
    nutrients: {
      protein: {
        value: Math.round(protein.amount * 10) / 10,
        unit: 'g',
        confidence: 0.90
      },
      potassium: {
        value: Math.round(potassium.amount),
        unit: 'mg',
        confidence: 0.85
      },
      phosphorus: {
        value: Math.round(phosphorus.amount),
        unit: 'mg',
        confidence: 0.85
      },
      sodium: {
        value: Math.round(sodium.amount),
        unit: 'mg',
        confidence: 0.90
      }
    },
    confidenceScore: 0.88,
    disclaimer: true
  };
};

// Get nutrition from Spoonacular API by food name
const getNutritionFromSpoonacular = async (foodName, portionSize = 100) => {
  try {
    // Method 1: Try ingredient search (best for raw foods and nutrition data)
    try {
      const ingredientResponse = await axios.get(`${SPOONACULAR_BASE_URL}/food/ingredients/search`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          query: foodName,
          number: 1
        }
      });

      if (ingredientResponse.data.results && ingredientResponse.data.results.length > 0) {
        const ingredientId = ingredientResponse.data.results[0].id;
        
        // Get ingredient info with nutrition for the specified portion
        const ingredientInfoResponse = await axios.get(`${SPOONACULAR_BASE_URL}/food/ingredients/${ingredientId}/information`, {
          params: {
            apiKey: SPOONACULAR_API_KEY,
            amount: portionSize,
            unit: 'grams'
          }
        });

        if (ingredientInfoResponse.data.nutrition && ingredientInfoResponse.data.nutrition.nutrients) {
          const detectedName = ingredientInfoResponse.data.name || foodName;
          console.log('Found ingredient:', detectedName);
          return extractNutrients(ingredientInfoResponse.data.nutrition.nutrients, detectedName, portionSize);
        }
      }
    } catch (ingredientError) {
      console.log('Ingredient search failed, trying product search...');
    }

    // Method 2: Try product search (for packaged foods)
    try {
      const productResponse = await axios.get(`${SPOONACULAR_BASE_URL}/food/products/search`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          query: foodName,
          number: 1
        }
      });

      if (productResponse.data.products && productResponse.data.products.length > 0) {
        const productId = productResponse.data.products[0].id;
        
        const productInfoResponse = await axios.get(`${SPOONACULAR_BASE_URL}/food/products/${productId}`, {
          params: {
            apiKey: SPOONACULAR_API_KEY
          }
        });

        if (productInfoResponse.data.nutrition && productInfoResponse.data.nutrition.nutrients) {
          const detectedName = productInfoResponse.data.title || foodName;
          console.log('Found product:', detectedName);
          // Products are usually per serving, so we may need to scale
          const nutrients = productInfoResponse.data.nutrition.nutrients;
          return extractNutrients(nutrients, detectedName, portionSize);
        }
      }
    } catch (productError) {
      console.log('Product search failed...');
    }

  } catch (error) {
    console.error('Spoonacular API error:', error.response?.data || error.message);
  }
  return null;
};

// Estimate nutrition from food name
export const estimateNutritionFromText = async (foodName, portionSize = 100) => {
  const normalized = normalizeFoodName(foodName);
  
  // Try Spoonacular API first if API key is set
  if (SPOONACULAR_API_KEY && SPOONACULAR_API_KEY !== 'YOUR_API_KEY_HERE') {
    const spoonacularResult = await getNutritionFromSpoonacular(foodName, portionSize);
    if (spoonacularResult) {
      return spoonacularResult;
    }
  }
  
  // Fallback to local database
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

// Estimate nutrition from image using Spoonacular Image Analysis API
export const estimateNutritionFromImage = async (imageBuffer, portionSize = 100) => {
  try {
    // Check if API key is configured
    if (!SPOONACULAR_API_KEY || SPOONACULAR_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('Spoonacular API key not configured. Using fallback.');
      return getFallbackNutrition('Detected Food', portionSize);
    }

    // Convert buffer to base64
    const base64Image = imageBuffer.toString('base64');

    // Use Spoonacular's Visualize Recipe endpoint with image
    // This endpoint can analyze food images
    const formData = new FormData();
    formData.append('file', imageBuffer, {
      filename: 'food.jpg',
      contentType: 'image/jpeg'
    });

    try {
      // Method 1: Try the food/images/classify endpoint
      const classifyResponse = await axios.post(
        `${SPOONACULAR_BASE_URL}/food/images/classify`,
        formData,
        {
          params: {
            apiKey: SPOONACULAR_API_KEY
          },
          headers: {
            ...formData.getHeaders()
          }
        }
      );

      if (classifyResponse.data && classifyResponse.data.category) {
        const detectedFood = classifyResponse.data.category;
        const foodName = detectedFood.name || detectedFood.title || 'Detected Food';
        
        console.log('Food detected from image:', foodName);
        
        // Get nutrition for detected food
        const nutritionResult = await getNutritionFromSpoonacular(foodName, portionSize);
        if (nutritionResult) {
          return nutritionResult;
        }
      }
    } catch (classifyError) {
      console.log('Classify endpoint failed, trying alternative...');
    }

    // Method 2: Try using the recipe visualizer which can detect dishes
    try {
      const analyzeResponse = await axios.post(
        `${SPOONACULAR_BASE_URL}/recipes/visualizeRecipe`,
        {
          image: base64Image
        },
        {
          params: {
            apiKey: SPOONACULAR_API_KEY
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      if (analyzeResponse.data && analyzeResponse.data.title) {
        const dishName = analyzeResponse.data.title;
        console.log('Dish detected:', dishName);
        
        const nutritionResult = await getNutritionFromSpoonacular(dishName, portionSize);
        if (nutritionResult) {
          return nutritionResult;
        }
      }
    } catch (analyzeError) {
      console.log('Analyze endpoint failed, using fallback...');
    }

  } catch (error) {
    console.error('Image analysis error:', error.response?.data || error.message);
  }

  // Fallback: Try to use a generic food search
  console.log('Using fallback nutrition estimation');
  return getFallbackNutrition('Detected Food', portionSize);
};

// Fallback nutrition when API fails
const getFallbackNutrition = (foodName, portionSize) => {
  return {
    foodName: foodName,
    portionSize: portionSize,
    nutrients: {
      protein: { value: 20, unit: 'g', confidence: 0.50 },
      potassium: { value: 300, unit: 'mg', confidence: 0.50 },
      phosphorus: { value: 150, unit: 'mg', confidence: 0.50 },
      sodium: { value: 200, unit: 'mg', confidence: 0.50 }
    },
    confidenceScore: 0.50,
    disclaimer: true
  };
};


