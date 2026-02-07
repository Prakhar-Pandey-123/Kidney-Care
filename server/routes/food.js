import express from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import FoodLog from '../models/FoodLog.js';
import { estimateNutritionFromText, estimateNutritionFromImage } from '../utils/aiNutrition.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Estimate nutrition (text or image)
router.post('/estimate', authenticate, upload.single('image'), async (req, res) => {
  try {
    const { foodName, portionSize = 100 } = req.body;
    const image = req.file;

    let result;

    if (image) {
      // Estimate from image
      result = await estimateNutritionFromImage(image.buffer, parseInt(portionSize));
    } else if (foodName) {
      // Estimate from text
      result = await estimateNutritionFromText(foodName, parseInt(portionSize));
    } else {
      return res.status(400).json({ message: 'Please provide food name or image' });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Log food
router.post('/log', authenticate, async (req, res) => {
  try {
    const { foodName, portionSize, portionUnit, nutrients, confidenceScore, imageUrl } = req.body;

    const foodLog = new FoodLog({
      userId: req.userId,
      foodName,
      portionSize,
      portionUnit: portionUnit || 'g',
      nutrients,
      confidenceScore: confidenceScore || 0.8,
      imageUrl: imageUrl || null
    });

    await foodLog.save();
    res.status(201).json(foodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get food logs
router.get('/logs', authenticate, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const query = { userId: req.userId };

    if (startDate || endDate) {
      query.loggedAt = {};
      if (startDate) query.loggedAt.$gte = new Date(startDate);
      if (endDate) query.loggedAt.$lte = new Date(endDate);
    }

    const logs = await FoodLog.find(query)
      .sort({ loggedAt: -1 })
      .limit(100);

    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete food log
router.delete('/logs/:id', authenticate, async (req, res) => {
  try {
    const log = await FoodLog.findOne({ _id: req.params.id, userId: req.userId });
    if (!log) {
      return res.status(404).json({ message: 'Food log not found' });
    }

    await FoodLog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Food log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;


