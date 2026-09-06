const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Typing History / Settings saved from the Frontend
  profileData: {
    type: Object,
    default: {
      name: 'New User',
      xp: 0,
      level: 1,
      totalKeysTyped: 0,
      totalTimeMs: 0,
      lessonsCompleted: [],
      recentWpmHistory: [],
      joinedAt: new Date().toISOString(),
      lessonProgress: {},
      sessions: [],
      keyStats: {},
      gameScores: [],
      achievements: []
    }
  },
  settingsData: {
    type: Object,
    default: {
      soundTheme: 'mechanical',
      soundVolume: 0.5,
      keyboardLayout: 'crulp',
      theme: 'dark',
      fontFamily: 'Noto Nastaliq Urdu',
      showKeyboard: true,
      showHands: true
    }
  }
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', UserSchema);
