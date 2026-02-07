# 🍽️ Food Recognition API Setup Guide

## Free API Integration - Spoonacular

I've integrated **Spoonacular Food API** which offers:
- ✅ **FREE Tier**: 150 requests/day (perfect for testing)
- ✅ **Image Analysis**: Recognizes food from images
- ✅ **Nutrition Data**: Accurate protein, potassium, phosphorus, sodium
- ✅ **No Credit Card Required**

---

## Step 1: Get Your Free API Key

1. Go to: **https://spoonacular.com/food-api**
2. Click **"Get API Key"** or **"Sign Up"**
3. Create a free account (no credit card needed)
4. Copy your API key from the dashboard

---

## Step 2: Add API Key to Your Project

1. Open `server/.env` file
2. Add this line:
   ```env
   SPOONACULAR_API_KEY=your_api_key_here
   ```

**Example:**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kidneycare
JWT_SECRET=your_jwt_secret_key_here
NODE_ENV=development
SPOONACULAR_API_KEY=abc123def456ghi789
```

---

## Step 3: Install Dependencies

The code already includes the required packages, but if needed:

```bash
cd server
npm install axios form-data
```

---

## Step 4: Restart Your Server

```bash
npm run dev
```

---

## How It Works

### Image Upload Flow:
1. User uploads food image
2. Image sent to Spoonacular Image Analysis API
3. API identifies the food (e.g., "Grilled Chicken Breast")
4. API fetches nutrition data for that food
5. Nutrients scaled by portion size
6. Data returned to user

### Text Input Flow:
1. User types food name (e.g., "banana")
2. Spoonacular searches for the food
3. API returns nutrition data
4. Nutrients scaled by portion size
5. Data returned to user

---

## What Nutrients Are Extracted

- ✅ **Protein** (grams)
- ✅ **Potassium** (milligrams)
- ✅ **Phosphorus** (milligrams)
- ✅ **Sodium** (milligrams)

All values are automatically scaled based on the portion size you specify!

---

## Free Tier Limits

- **150 requests/day** (resets daily)
- Perfect for personal use and testing
- If you need more, upgrade to paid plan (not required for this app)

---

## Troubleshooting

### "API key not configured" warning
- Make sure you added `SPOONACULAR_API_KEY` to `server/.env`
- Restart the server after adding the key

### "API rate limit exceeded"
- You've used all 150 free requests for today
- Wait until tomorrow or upgrade plan

### "Failed to estimate nutrition"
- Check internet connection
- Verify API key is correct
- Check browser console for detailed errors

### Image not recognized
- Try a clearer image
- Make sure food is visible and well-lit
- Try typing the food name instead

---

## Alternative: Edamam API (Backup Option)

If Spoonacular doesn't work, you can also use **Edamam Food Database API**:

1. Sign up: https://developer.edamam.com/
2. Get API Key and App ID
3. Update `server/utils/aiNutrition.js` to use Edamam

**Edamam Free Tier**: 10,000 requests/month

---

## Testing

1. Upload a food image
2. Check browser console for logs
3. Verify nutrients are calculated correctly
4. Check that values are added to your daily totals

---

## Need Help?

- Check `server/utils/aiNutrition.js` for the implementation
- Check browser console (F12) for API responses
- Check server terminal for API logs

**The API is now integrated and ready to use!** 🎉

