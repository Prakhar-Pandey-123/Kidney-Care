import mongoose from 'mongoose';

const foodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  portionSize: {
    type: Number,
    required: true,
    min: 1
  },
  portionUnit: {
    type: String,
    default: 'g'
  },
  nutrients: {
    protein: {
      value: { type: Number, required: true, min: 0 },
      unit: { type: String, default: 'g' }
    },
    potassium: {
      value: { type: Number, required: true, min: 0 },
      unit: { type: String, default: 'mg' }
    },
    phosphorus: {
      value: { type: Number, required: true, min: 0 },
      unit: { type: String, default: 'mg' }
    },
    sodium: {
      value: { type: Number, required: true, min: 0 },
      unit: { type: String, default: 'mg' }
    }
  },
  confidenceScore: {
    type: Number,
    min: 0,
    max: 1,
    default: 0.8
  },
  imageUrl: {
    type: String,
    default: null
  },
  loggedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for efficient queries
foodLogSchema.index({ userId: 1, loggedAt: -1 });

export default mongoose.model('FoodLog', foodLogSchema);


