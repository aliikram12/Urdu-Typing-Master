const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  // Complete typing profile synced with frontend
  profileData: {
    type: mongoose.Schema.Types.Mixed,
    default: function() {
      return {
        id: this._id ? this._id.toString() : '',
        name: this.username || '',
        email: this.email || '',
        avatar: '👨‍💻',
        level: 'Beginner',
        targetWpm: 40,
        xp: 0,
        totalKeysTyped: 0,
        totalTimeMs: 0,
        lessonsCompleted: [],
        recentWpmHistory: [],
        streakDays: 1,
        lastPracticeDate: new Date().toISOString().split('T')[0],
        practiceDates: [new Date().toISOString().split('T')[0]],
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        joinedAt: new Date().toISOString(),
        lessonProgress: {},
        sessions: [],
        keyStats: {},
        gameScores: [],
        achievements: []
      };
    }
  },
  // User app settings
  settingsData: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      theme: 'navy',
      soundTheme: 'mechanical',
      fontFamily: 'Noto Nastaliq Urdu',
      fontSize: 'medium',
      showVirtualKeyboard: true,
      showHandGuide: true,
      showEnglishLabels: true,
      showUrduLabels: true,
      soundEnabled: true,
      soundVolume: 0.7,
      errorSound: true,
      gameSound: true,
      strictMode: false,
      autoAdvance: true,
      uiLanguage: 'en'
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
