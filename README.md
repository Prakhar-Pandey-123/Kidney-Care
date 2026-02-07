# Kidney Care: Patient-only CKD Food Tracking Web App

A simple, calm web application for tracking food nutrients (protein, potassium, phosphorus, sodium) for CKD patients. **Not medical treatment. Awareness & tracking only.**

## 🎯 Features

- **Food Logging**: Upload food images or type food names
- **AI Nutrition Estimation**: Automatic nutrient estimation (mock AI for demo)
- **Daily Tracking**: Real-time nutrient tracking with visual status indicators
- **CKD Stage-Based Limits**: Personalized limits based on CKD stage (1-5)
- **Alerts & Notifications**: Gentle reminders for high/low intake
- **Insights Dashboard**: Daily, weekly, and monthly charts
- **Calm UX**: Patient-friendly, non-medical language
- **3D Visuals**: Spline 3D integration (placeholder ready)

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **3D**: Spline (@splinetool/react-spline)
- **Charts**: Recharts
- **Authentication**: JWT

## 📦 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)

### Setup

1. **Install dependencies:**
```bash
npm run install-all
```

2. **Set up environment variables:**
```bash
# Copy server/.env.example to server/.env
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

3. **Start development servers:**
```bash
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend dev server on `http://localhost:3000`

## 📁 Project Structure

```
kidney-care/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   └── utils/         # API utilities
│   └── package.json
├── server/                 # Express backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── utils/             # Utilities (AI, limits)
│   └── package.json
└── package.json           # Root package.json
```

## 🚀 Usage

1. **Landing Page**: Visit `http://localhost:3000`
2. **Onboarding**: Create account with profile (age, weight, CKD stage, activity level)
3. **Dashboard**: View today's nutrient status
4. **Add Food**: Upload image or type food name to log meals
5. **Insights**: View charts and trends

## 🎨 Design

See `DESIGN_DOCUMENT.md` for complete design specifications including:
- Product & UX design
- UI design (Tailwind CSS)
- Spline 3D design
- Dashboard UX
- Food upload flow
- Alert logic
- Charts & insights
- AI nutrition estimation
- Landing page copy

## 🔐 Authentication

- JWT-based authentication
- Protected routes
- User profile management

## 📊 Nutrition Limits

Limits are calculated based on:
- **CKD Stage** (1-5)
- **Body Weight** (kg)
- **Activity Level**

See `server/utils/nutritionLimits.js` for detailed logic.

## 🤖 AI Nutrition Estimation

Currently uses a mock food database. In production, integrate with:
- OpenAI Vision API (for image recognition)
- USDA FoodData Central API (for nutrition data)
- Or your preferred nutrition API

See `server/utils/aiNutrition.js` for implementation.

## 🎭 Spline 3D Integration

The landing page includes a placeholder for Spline 3D scenes. To add your scenes:

1. Create scenes in Spline
2. Update `client/src/pages/Landing.jsx` with your scene URLs
3. Uncomment the Spline component

## ⚠️ Important Notes

- **Not Medical Treatment**: This app is for awareness and tracking only
- **Approximate Values**: Nutrition estimates are approximate
- **Hackathon Demo**: Some features use mock data for demo purposes

## 📝 License

MIT

## 🙏 Acknowledgments

Built with care for CKD patients. Always consult healthcare professionals for medical advice.


