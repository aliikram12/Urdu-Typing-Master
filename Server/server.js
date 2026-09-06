require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Root health check
app.get('/', (req, res) => res.send('Urdu Typing Master API is running...'));

// Route Mounts
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const historyRoutes = require('./routes/history');

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/history', historyRoutes);

// Resilient MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error, retrying in 3s:', err.message);
    setTimeout(connectDB, 3000);
  }
};

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
