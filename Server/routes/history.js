const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const History = require('../models/History');

// Middleware to verify JWT token and extract authenticated user ID
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is invalid or expired' });
  }
};

// @route   POST /api/history
// @desc    Record a new test/activity result for the authenticated user
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      activityType,
      title,
      titleUrdu,
      score,
      netScore,
      total,
      percentage,
      errors,
      errorCount,
      status,
      durationSeconds,
    } = req.body;

    if (!title) {
      return res.status(400).json({ msg: 'Activity title is required' });
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const formattedTime = now.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // Determine status if not explicitly passed
    let calculatedStatus = status;
    if (!calculatedStatus) {
      const acc = Number(percentage) || 0;
      if (acc >= 85) {
        calculatedStatus = 'Passed';
      } else if (acc >= 60) {
        calculatedStatus = 'Completed';
      } else {
        calculatedStatus = 'Failed';
      }
    }

    const newHistory = new History({
      userId: req.user.id, // Strictly tied to authenticated user ID
      activityType: activityType || 'test',
      title,
      titleUrdu: titleUrdu || '',
      score: Math.round(Number(score) || 0),
      netScore: Math.round(Number(netScore) || 0),
      total: Number(total) || 0,
      percentage: Math.round((Number(percentage) || 0) * 10) / 10,
      errorCount: Number(errorCount !== undefined ? errorCount : errors) || 0,
      status: calculatedStatus,
      durationSeconds: Math.round(Number(durationSeconds) || 0),
      date: formattedDate,
      time: formattedTime,
    });

    const saved = await newHistory.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving history:', err.message);
    res.status(500).json({ msg: 'Server error saving test result' });
  }
});

// @route   GET /api/history
// @desc    Get all history records belonging strictly to the currently authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Database-level filtering strictly by req.user.id
    const historyList = await History.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(200);

    res.json(historyList);
  } catch (err) {
    console.error('Error fetching history:', err.message);
    res.status(500).json({ msg: 'Server error retrieving history' });
  }
});

// @route   GET /api/history/stats
// @desc    Calculate real-time dynamic statistics for the authenticated user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const historyList = await History.find({ userId: req.user.id }).sort({ createdAt: -1 });

    const totalTests = historyList.length;
    if (totalTests === 0) {
      return res.json({
        totalTests: 0,
        avgWpm: 0,
        avgAccuracy: 0,
        passedTests: 0,
        failedTests: 0,
        totalPracticeSeconds: 0,
        latestActivity: null,
      });
    }

    const totalScore = historyList.reduce((acc, h) => acc + (h.score || 0), 0);
    const totalPercentage = historyList.reduce((acc, h) => acc + (h.percentage || 0), 0);
    const passedCount = historyList.filter(h => h.status === 'Passed').length;
    const failedCount = historyList.filter(h => h.status === 'Failed').length;
    const totalSeconds = historyList.reduce((acc, h) => acc + (h.durationSeconds || 0), 0);

    res.json({
      totalTests,
      avgWpm: Math.round(totalScore / totalTests),
      avgAccuracy: Math.round((totalPercentage / totalTests) * 10) / 10,
      passedTests: passedCount,
      failedTests: failedCount,
      totalPracticeSeconds: totalSeconds,
      latestActivity: historyList[0] || null,
    });
  } catch (err) {
    console.error('Error calculating history stats:', err.message);
    res.status(500).json({ msg: 'Server error calculating statistics' });
  }
});

module.exports = router;
