import express from 'express';
import { authenticate } from '../middleware/auth.js';
import FoodLog from '../models/FoodLog.js';
import User from '../models/User.js';
import { getNutritionLimits, getNutrientStatus } from '../utils/nutritionLimits.js';

const router = express.Router();

// Get daily nutrition summary
router.get('/daily', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    // Set to start of day
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    // Set to end of day
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Get user profile
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get food logs for the day
    const logs = await FoodLog.find({
      userId: req.userId,
      loggedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    // Calculate totals
    const totals = {
      protein: { value: 0, unit: 'g' },
      potassium: { value: 0, unit: 'mg' },
      phosphorus: { value: 0, unit: 'mg' },
      sodium: { value: 0, unit: 'mg' }
    };

    logs.forEach(log => {
      totals.protein.value += log.nutrients.protein.value;
      totals.potassium.value += log.nutrients.potassium.value;
      totals.phosphorus.value += log.nutrients.phosphorus.value;
      totals.sodium.value += log.nutrients.sodium.value;
    });

    // Get limits
    const limits = getNutritionLimits(
      user.profile.ckdStage,
      user.profile.weight,
      user.profile.activityLevel
    );

    // Get status for each nutrient
    const status = {
      protein: getNutrientStatus(totals.protein.value, limits.protein.value),
      potassium: getNutrientStatus(totals.potassium.value, limits.potassium.value),
      phosphorus: getNutrientStatus(totals.phosphorus.value, limits.phosphorus.value),
      sodium: getNutrientStatus(totals.sodium.value, limits.sodium.value)
    };

    res.json({
      date: targetDate.toISOString().split('T')[0],
      totals,
      limits,
      status,
      mealCount: logs.length
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get alerts
router.get('/alerts', authenticate, async (req, res) => {
  try {
    const { date } = req.query;
    const targetDate = date ? new Date(date) : new Date();
    
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const logs = await FoodLog.find({
      userId: req.userId,
      loggedAt: { $gte: startOfDay, $lte: endOfDay }
    });

    const totals = {
      protein: 0,
      potassium: 0,
      phosphorus: 0,
      sodium: 0
    };

    logs.forEach(log => {
      totals.protein += log.nutrients.protein.value;
      totals.potassium += log.nutrients.potassium.value;
      totals.phosphorus += log.nutrients.phosphorus.value;
      totals.sodium += log.nutrients.sodium.value;
    });

    const limits = getNutritionLimits(
      user.profile.ckdStage,
      user.profile.weight,
      user.profile.activityLevel
    );

    const alerts = [];

    // Check each nutrient
    Object.keys(totals).forEach(nutrient => {
      const intake = totals[nutrient];
      const limit = limits[nutrient].value;
      const status = getNutrientStatus(intake, limit);

      if (status.status === 'high') {
        alerts.push({
          type: 'high',
          priority: 1,
          nutrient,
          message: `Your ${nutrient} intake is above your daily limit. Consider lighter meals tomorrow.`,
          intake,
          limit
        });
      } else if (status.status === 'warning') {
        alerts.push({
          type: 'warning',
          priority: 2,
          nutrient,
          message: `You're getting close to your ${nutrient} limit. Consider choosing lower-${nutrient} options for your next meal.`,
          intake,
          limit
        });
      } else if (status.status === 'low') {
        alerts.push({
          type: 'low',
          priority: 2,
          nutrient,
          message: `Your ${nutrient} is below recommended levels. Try adding foods rich in ${nutrient}.`,
          intake,
          limit
        });
      }
    });

    // Add encouragement if all good
    if (alerts.length === 0) {
      alerts.push({
        type: 'info',
        priority: 3,
        message: 'Great job! All your nutrients are in a safe range today. 🌟'
      });
    }

    // Sort by priority
    alerts.sort((a, b) => a.priority - b.priority);

    res.json(alerts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get weekly summary
router.get('/weekly', authenticate, async (req, res) => {
  try {
    const { startDate } = req.query;
    const start = startDate ? new Date(startDate) : new Date();
    start.setDate(start.getDate() - 6); // Last 7 days
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const logs = await FoodLog.find({
      userId: req.userId,
      loggedAt: { $gte: start, $lte: end }
    });

    // Group by date
    const dailyData = {};
    logs.forEach(log => {
      const date = log.loggedAt.toISOString().split('T')[0];
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          protein: 0,
          potassium: 0,
          phosphorus: 0,
          sodium: 0
        };
      }
      dailyData[date].protein += log.nutrients.protein.value;
      dailyData[date].potassium += log.nutrients.potassium.value;
      dailyData[date].phosphorus += log.nutrients.phosphorus.value;
      dailyData[date].sodium += log.nutrients.sodium.value;
    });

    const limits = getNutritionLimits(
      user.profile.ckdStage,
      user.profile.weight,
      user.profile.activityLevel
    );

    res.json({
      data: Object.values(dailyData),
      limits: {
        protein: limits.protein.value,
        potassium: limits.potassium.value,
        phosphorus: limits.phosphorus.value,
        sodium: limits.sodium.value
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


