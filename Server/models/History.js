const mongoose = require('mongoose');

const HistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  activityType: {
    type: String, // 'test' | 'lesson' | 'game' | 'practice'
    required: true,
    enum: ['test', 'lesson', 'game', 'practice'],
    default: 'test',
  },
  title: {
    type: String,
    required: true,
  },
  titleUrdu: {
    type: String,
    default: '',
  },
  score: {
    type: Number, // Gross WPM or score points
    required: true,
    default: 0,
  },
  netScore: {
    type: Number, // Net WPM
    default: 0,
  },
  total: {
    type: Number, // Total keys typed or total items
    default: 0,
  },
  percentage: {
    type: Number, // Accuracy percentage
    required: true,
    default: 0,
  },
  errorCount: {
    type: Number,
    default: 0,
  },
  status: {
    type: String, // 'Passed' | 'Failed' | 'Completed'
    required: true,
    enum: ['Passed', 'Failed', 'Completed'],
    default: 'Completed',
  },
  durationSeconds: {
    type: Number,
    default: 0,
  },
  date: {
    type: String, // e.g. "Sep 6, 2026"
    default: '',
  },
  time: {
    type: String, // e.g. "04:45 PM"
    default: '',
  },
}, {
  timestamps: true,
});

// Composite index for fast chronological lookups per user
HistorySchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('History', HistorySchema);
