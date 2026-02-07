import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import foodRoutes from './routes/food.js';
import userRoutes from './routes/user.js';
import nutritionRoutes from './routes/nutrition.js';
import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/food', foodRoutes);
app.use('/api/user', userRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Kidney Care API is running' });
});

// Connect to MongoDB


 console.log("MONGO_URI =", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));
 



// mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kidneycare', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('MongoDB connected'))
// .catch(err => console.error('MongoDB connection error:', err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


