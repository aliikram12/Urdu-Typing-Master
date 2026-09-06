require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'x-auth-token', 'Authorization'],
  })
);

// Resilient MongoDB connection for both persistent and serverless environments
let isConnecting = false;
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  if (isConnecting) return;
  try {
    isConnecting = true;
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  } finally {
    isConnecting = false;
  }
};

// Ensure database connection for incoming requests in serverless environments
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState < 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(500).json({ msg: 'Database connection error. Please try again in a moment.' });
    }
  }
  next();
});

connectDB();

// Root health check
app.get('/', (req, res) => res.send('Urdu Typing Master API is running...'));

// Route Mounts
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const historyRoutes = require('./routes/history');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/history', historyRoutes);

if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
