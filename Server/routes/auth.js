const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Auth middleware for token verification
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

// @route   GET /api/auth/me
// @desc    Get current authenticated user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Ensure profileData has the correct name, email, and id
    const profile = {
      ...(user.profileData || {}),
      id: user._id.toString(),
      name: (user.profileData && user.profileData.name) || user.username,
      email: user.email,
    };

    res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      profileData: profile,
      settingsData: user.settingsData,
      createdAt: user.createdAt,
    });
  } catch (err) {
    console.error('Auth check error:', err.message);
    res.status(500).json({ msg: 'Server error verifying session' });
  }
});

// @route   POST /api/auth/register
// @desc    Register a new user with unique ID and hashed password
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ msg: 'Please provide username, email, and password.' });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ msg: 'Please enter a valid email address.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ msg: 'Password must be at least 6 characters long.' });
    }

    // Prevent duplicate email registration
    const normalizedEmail = email.toLowerCase().trim();
    let existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ msg: 'An account with this email already exists. Please log in instead.' });
    }

    // Secure password hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const newUser = new User({
      username: username.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    // Populate user-specific profile data with real unique ID and name
    newUser.profileData = {
      id: newUser._id.toString(),
      name: username.trim(),
      email: normalizedEmail,
      avatar: '👨‍💻',
      level: 'Beginner',
      targetWpm: 40,
      xp: 0,
      totalKeysTyped: 0,
      totalTimeMs: 0,
      lessonsCompleted: [],
      recentWpmHistory: [],
      streakDays: 1,
      lastPracticeDate: todayStr,
      practiceDates: [todayStr],
      createdAt: now.toISOString(),
      lastLogin: now.toISOString(),
      joinedAt: now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      lessonProgress: {},
      sessions: [],
      keyStats: {},
      gameScores: [],
      achievements: []
    };

    await newUser.save();

    const payload = {
      user: {
        id: newUser.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.status(201).json({
      token,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profileData: newUser.profileData,
        settingsData: newUser.settingsData,
        createdAt: newUser.createdAt,
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ msg: 'Registration failed: ' + err.message });
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get session token
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials. No account found with that email.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials. Incorrect password.' });
    }

    const payload = {
      user: {
        id: user.id
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Update last login
    if (!user.profileData) user.profileData = {};
    user.profileData.lastLogin = new Date().toISOString();
    user.profileData.id = user._id.toString();
    user.profileData.name = user.profileData.name || user.username;
    user.profileData.email = user.email;
    user.markModified('profileData');
    await user.save();

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profileData: user.profileData,
        settingsData: user.settingsData,
        createdAt: user.createdAt,
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Login failed: ' + err.message });
  }
});

module.exports = router;
