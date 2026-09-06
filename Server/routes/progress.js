const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to verify token
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
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

// Get User Progress & Settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json({ profileData: user.profileData, settingsData: user.settingsData });
  } catch (err) {
    console.error('Get progress error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Update Progress (Profile) - real-time sync from frontend
router.post('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Deep merge profile data
    user.profileData = { ...user.profileData, ...req.body };
    user.markModified('profileData');
    await user.save();

    res.json(user.profileData);
  } catch (err) {
    console.error('Update profile error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

// Update Settings
router.post('/settings', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    user.settingsData = { ...user.settingsData, ...req.body };
    user.markModified('settingsData');
    await user.save();

    res.json(user.settingsData);
  } catch (err) {
    console.error('Update settings error:', err.message);
    res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
