import {
  UserProfile,
  TypingSession,
  KeyStat,
  LessonProgress,
  GameScore,
  Achievement,
  AppSettings
} from '../types';
import { API_URL } from './api';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'urdu_master_current_user_id',
  USERS: 'urdu_master_users',
  LESSON_PROGRESS: 'urdu_master_lesson_progress_',
  SESSIONS: 'urdu_master_sessions_',
  KEY_STATS: 'urdu_master_key_stats_',
  GAME_SCORES: 'urdu_master_game_scores_',
  ACHIEVEMENTS: 'urdu_master_achievements_',
  SETTINGS: 'urdu_master_settings',
};

export const INITIAL_SETTINGS: AppSettings = {
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
  uiLanguage: 'en',
};

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_lesson',
    title: 'First Step',
    titleUrdu: 'پہلا قدم',
    description: 'Complete your very first Urdu typing lesson.',
    icon: 'Sparkles',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'speed_starter',
    title: 'Speed Starter',
    titleUrdu: 'رفتار کا آغاز',
    description: 'Reach 20 WPM in any typing session.',
    icon: 'Zap',
    unlocked: false,
    progress: 0,
    maxProgress: 20,
  },
  {
    id: 'fast_typist',
    title: 'Fast Typist',
    titleUrdu: 'تیز رفتار ٹائپسٹ',
    description: 'Reach 40 WPM in a lesson or test.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    maxProgress: 40,
  },
  {
    id: 'speed_master',
    title: 'Speed Master',
    titleUrdu: 'سپیڈ ماسٹر',
    description: 'Surpass 60 WPM in Urdu phonetic typing.',
    icon: 'Award',
    unlocked: false,
    progress: 0,
    maxProgress: 60,
  },
  {
    id: 'accuracy_pro',
    title: 'Accuracy Pro',
    titleUrdu: 'بے داغ درستگی',
    description: 'Complete a session with at least 98% accuracy.',
    icon: 'Target',
    unlocked: false,
    progress: 0,
    maxProgress: 98,
  },
  {
    id: 'perfect_lesson',
    title: 'Flawless Mastery',
    titleUrdu: 'کامل مہارت (۱۰۰٪)',
    description: 'Complete a lesson with 100% accuracy and zero mistakes.',
    icon: 'Crown',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'streak_3',
    title: 'Consistent Learner',
    titleUrdu: 'مسلسل محنت',
    description: 'Maintain a 3-day daily practice streak.',
    icon: 'Calendar',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    title: 'Week Warrior',
    titleUrdu: 'ہفتہ وار تسلسل',
    description: 'Maintain a 7-day daily practice streak.',
    icon: 'Flame',
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  },
  {
    id: 'falling_words_champ',
    title: 'Word Defender',
    titleUrdu: 'الفاظ کا محافظ',
    description: 'Score over 1,000 points in Falling Urdu Words game.',
    icon: 'Gamepad2',
    unlocked: false,
    progress: 0,
    maxProgress: 1000,
  },
  {
    id: 'bubble_popper',
    title: 'Bubble Maestro',
    titleUrdu: 'بلبلوں کا استاد',
    description: 'Pop 30 Urdu word bubbles in a single game.',
    icon: 'CircleDot',
    unlocked: false,
    progress: 0,
    maxProgress: 30,
  },
  {
    id: 'curriculum_half',
    title: 'Scholar in Progress',
    titleUrdu: 'علم کا مسافر',
    description: 'Complete 10 Urdu typing lessons.',
    icon: 'BookOpen',
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: 'grand_master',
    title: 'Urdu Master',
    titleUrdu: 'اردو ماسٹر اعزاز',
    description: 'Complete all lessons across the full curriculum.',
    icon: 'Trophy',
    unlocked: false,
    progress: 0,
    maxProgress: 25,
  },
];

export const createEmptyUser = (id = '', name = '', email = ''): UserProfile => ({
  id: id || '',
  name: name || '',
  email: email || '',
  avatar: '👨‍💻',
  level: 'Beginner',
  targetWpm: 40,
  createdAt: new Date().toISOString(),
  lastLogin: new Date().toISOString(),
  streakDays: 0,
  lastPracticeDate: '',
  practiceDates: [],
});

class StorageManager {
  // Profiles
  public getUsers(): UserProfile[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USERS);
      if (data) return JSON.parse(data);
    } catch {
      // fallback
    }
    return [];
  }

  public saveUsers(users: UserProfile[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }

  public getCurrentUser(): UserProfile {
    const currentId = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    if (!currentId) return createEmptyUser();
    const users = this.getUsers();
    const found = users.find(u => u.id === currentId);
    if (found) return found;
    return createEmptyUser(currentId);
  }

  public setCurrentUserId(id: string) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, id);
  }

  public setCurrentUser(user: UserProfile) {
    if (!user || !user.id) return;
    this.setCurrentUserId(user.id);
    const users = this.getUsers().filter(u => u.id !== user.id);
    users.push(user);
    this.saveUsers(users);
  }

  public clearSession() {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER_ID);
    localStorage.removeItem('auth_token');
  }

  public createUser(name: string, avatar: string, level: UserProfile['level']): UserProfile {
    const users = this.getUsers();
    const today = new Date().toISOString().split('T')[0];
    const newUser: UserProfile = {
      id: 'usr_' + Date.now(),
      name,
      avatar: avatar || '👤',
      level,
      targetWpm: level === 'Advanced' ? 55 : level === 'Intermediate' ? 40 : 25,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
      streakDays: 1,
      lastPracticeDate: today,
      practiceDates: [today],
    };
    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUserId(newUser.id);
    return newUser;
  }

  public updateUser(partial: Partial<UserProfile>, sync = true): UserProfile {
    const current = this.getCurrentUser();
    const updated: UserProfile = { ...current, ...partial };
    const users = this.getUsers().map(u => (u.id === updated.id ? updated : u));
    this.saveUsers(users);
    if (sync) this.syncToCloud();
    return updated;
  }

  // Update Daily Streak
  public recordPracticeActivity(userId: string) {
    const user = this.getCurrentUser();
    if (user.id !== userId) return;

    const today = new Date().toISOString().split('T')[0];
    const lastDate = user.lastPracticeDate;

    let newStreak = user.streakDays || 1;
    const practiceDates = new Set(user.practiceDates || []);
    practiceDates.add(today);

    if (lastDate !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastDate === yesterdayStr) {
        newStreak += 1;
      } else {
        newStreak = 1;
      }
    }

    const updated: UserProfile = {
      ...user,
      streakDays: newStreak,
      lastPracticeDate: today,
      practiceDates: Array.from(practiceDates),
      lastLogin: new Date().toISOString(),
    };
    this.updateUser(updated);
    this.checkStreakAchievements(newStreak);
  }

  // Lessons Progress
  public getLessonProgress(userId: string): Record<number, LessonProgress> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LESSON_PROGRESS + userId);
      if (data) return JSON.parse(data);
    } catch {
      // Ignored
    }
    return {};
  }

  public saveLessonProgress(userId: string, lessonId: number, wpm: number, accuracy: number) {
    const all = this.getLessonProgress(userId);
    const existing = all[lessonId] || {
      lessonId,
      completed: false,
      bestWpm: 0,
      bestAccuracy: 0,
      attempts: 0,
      lastAttempt: new Date().toISOString(),
      stars: 0,
    };

    const isSuccess = accuracy >= 85;
    let stars = existing.stars;
    if (accuracy >= 98 && wpm >= 35) stars = 3;
    else if (accuracy >= 92) stars = 2;
    else if (accuracy >= 85) stars = 1;

    all[lessonId] = {
      lessonId,
      completed: existing.completed || isSuccess,
      bestWpm: Math.max(existing.bestWpm, wpm),
      bestAccuracy: Math.max(existing.bestAccuracy, accuracy),
      attempts: existing.attempts + 1,
      lastAttempt: new Date().toISOString(),
      stars: Math.max(existing.stars, stars),
    };

    localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS + userId, JSON.stringify(all));
    this.recordPracticeActivity(userId);
    this.checkLessonAchievements(all, wpm, accuracy);
    this.syncToCloud();
  }

  // Sessions History
  public getSessions(userId: string): TypingSession[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SESSIONS + userId);
      if (data) return JSON.parse(data);
    } catch {
      // Ignored
    }
    return [];
  }

  public addSession(session: TypingSession) {
    const list = this.getSessions(session.userId);
    list.unshift(session); // latest first
    // keep up to 150 sessions
    if (list.length > 150) list.pop();
    localStorage.setItem(STORAGE_KEYS.SESSIONS + session.userId, JSON.stringify(list));
    this.recordPracticeActivity(session.userId);
    this.checkSpeedAndAccuracyAchievements(session.wpm, session.accuracy);
    this.syncToCloud();
  }

  // Key Statistics
  public getKeyStats(userId: string): Record<string, KeyStat> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.KEY_STATS + userId);
      if (data) return JSON.parse(data);
    } catch {
      // Ignored
    }
    return {};
  }

  public recordKeyStat(
    userId: string,
    key: string,
    urduChar: string,
    isCorrect: boolean,
    latencyMs: number
  ) {
    const stats = this.getKeyStats(userId);
    const existing = stats[urduChar] || {
      key,
      urduChar,
      totalPresses: 0,
      correctPresses: 0,
      incorrectPresses: 0,
      accuracy: 100,
      averageLatencyMs: latencyMs || 250,
    };

    existing.totalPresses += 1;
    if (isCorrect) {
      existing.correctPresses += 1;
    } else {
      existing.incorrectPresses += 1;
    }

    existing.accuracy = Math.round((existing.correctPresses / existing.totalPresses) * 100);
    // Exponential moving average for latency
    if (latencyMs > 0 && latencyMs < 3000) {
      existing.averageLatencyMs = Math.round(
        existing.averageLatencyMs * 0.8 + latencyMs * 0.2
      );
    }

    stats[urduChar] = existing;
    localStorage.setItem(STORAGE_KEYS.KEY_STATS + userId, JSON.stringify(stats));
    // debounce this slightly if called too often, but for now we sync
    this.syncToCloud();
  }

  // Weak Key Detection
  public getWeakKeys(userId: string, limit: number = 5): KeyStat[] {
    const stats = Object.values(this.getKeyStats(userId));
    // Filter only keys that have at least 5 attempts
    const eligible = stats.filter(s => s.totalPresses >= 5);
    // Sort by lowest accuracy first, then highest latency
    eligible.sort((a, b) => {
      if (a.accuracy !== b.accuracy) {
        return a.accuracy - b.accuracy;
      }
      return b.averageLatencyMs - a.averageLatencyMs;
    });
    return eligible.slice(0, limit);
  }

  // Game Scores
  public getGameScores(userId: string): GameScore[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GAME_SCORES + userId);
      if (data) return JSON.parse(data);
    } catch {
      // Ignored
    }
    return [];
  }

  public addGameScore(score: GameScore) {
    const list = this.getGameScores(score.userId);
    list.unshift(score);
    if (list.length > 50) list.pop();
    localStorage.setItem(STORAGE_KEYS.GAME_SCORES + score.userId, JSON.stringify(list));
    this.recordPracticeActivity(score.userId);

    if (score.gameName === 'falling-words' && score.score >= 1000) {
      this.unlockAchievement('falling_words_champ');
    }
    if (score.gameName === 'urdu-bubbles' && score.wordsCompleted >= 30) {
      this.unlockAchievement('bubble_popper');
    }
    this.syncToCloud();
  }

  // Achievements
  public getAchievements(userId: string): Achievement[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS + userId);
      if (data) {
        const stored: Achievement[] = JSON.parse(data);
        // Merge with initial in case new achievements were added
        return INITIAL_ACHIEVEMENTS.map(init => {
          const found = stored.find(s => s.id === init.id);
          return found || init;
        });
      }
    } catch {
      // Ignored
    }
    return INITIAL_ACHIEVEMENTS;
  }

  public unlockAchievement(achievementId: string): boolean {
    const user = this.getCurrentUser();
    const list = this.getAchievements(user.id);
    let justUnlocked = false;

    const updated = list.map(a => {
      if (a.id === achievementId && !a.unlocked) {
        justUnlocked = true;
        return {
          ...a,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: a.maxProgress,
        };
      }
      return a;
    });

    if (justUnlocked) {
      localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS + user.id, JSON.stringify(updated));
      this.syncToCloud();
    }
    return justUnlocked;
  }

  private checkSpeedAndAccuracyAchievements(wpm: number, accuracy: number) {
    if (wpm >= 20) this.unlockAchievement('speed_starter');
    if (wpm >= 40) this.unlockAchievement('fast_typist');
    if (wpm >= 60) this.unlockAchievement('speed_master');
    if (accuracy >= 98) this.unlockAchievement('accuracy_pro');
    if (accuracy === 100) this.unlockAchievement('perfect_lesson');
  }

  private checkLessonAchievements(
    progressMap: Record<number, LessonProgress>,
    _wpm: number,
    _accuracy: number
  ) {
    const completedCount = Object.values(progressMap).filter(p => p.completed).length;
    if (completedCount >= 1) this.unlockAchievement('first_lesson');
    if (completedCount >= 10) this.unlockAchievement('curriculum_half');
    if (completedCount >= 25) this.unlockAchievement('grand_master');
  }

  private checkStreakAchievements(streakDays: number) {
    if (streakDays >= 3) this.unlockAchievement('streak_3');
    if (streakDays >= 7) this.unlockAchievement('streak_7');
  }

  // Settings
  public getSettings(): AppSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return { ...INITIAL_SETTINGS, ...JSON.parse(data) };
    } catch {
      // Ignored
    }
    return INITIAL_SETTINGS;
  }

  public saveSettings(settings: AppSettings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  public updateSettings(partial: Partial<AppSettings>): AppSettings {
    const current = this.getSettings();
    const updated: AppSettings = { ...current, ...partial };
    this.saveSettings(updated);
    return updated;
  }

  public resetAllData() {
    const user = this.getCurrentUser();
    localStorage.removeItem(STORAGE_KEYS.LESSON_PROGRESS + user.id);
    localStorage.removeItem(STORAGE_KEYS.SESSIONS + user.id);
    localStorage.removeItem(STORAGE_KEYS.KEY_STATS + user.id);
    localStorage.removeItem(STORAGE_KEYS.GAME_SCORES + user.id);
    localStorage.removeItem(STORAGE_KEYS.ACHIEVEMENTS + user.id);
    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
  }

  // Export / Import Backup
  public exportDataJSON(): string {
    const user = this.getCurrentUser();
    const backup = {
      exportVersion: '1.0.0',
      exportedAt: new Date().toISOString(),
      user,
      settings: this.getSettings(),
      progress: this.getLessonProgress(user.id),
      sessions: this.getSessions(user.id),
      keyStats: this.getKeyStats(user.id),
      gameScores: this.getGameScores(user.id),
      achievements: this.getAchievements(user.id),
    };
    return JSON.stringify(backup, null, 2);
  }

  // Real-time Cloud Synchronization
  public async syncToCloud() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const user = this.getCurrentUser();
    const fullProfile = {
      ...user,
      lessonProgress: this.getLessonProgress(user.id),
      sessions: this.getSessions(user.id),
      keyStats: this.getKeyStats(user.id),
      gameScores: this.getGameScores(user.id),
      achievements: this.getAchievements(user.id),
    };

    try {
      await fetch(`${API_URL}/progress/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify(fullProfile),
      });
    } catch (e) {
      console.warn('Failed to sync to cloud in real-time (network issue):', e);
    }
  }

  // Import Data from Backend (Run on Login or Session Verification)
  public async pullFromCloud(): Promise<UserProfile | null> {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    try {
      // 1. Fetch current authenticated identity
      const meRes = await fetch(`${API_URL}/auth/me`, {
        headers: { 'x-auth-token': token },
      });
      if (meRes.status === 401) {
        // Token is invalid or expired, clear session
        this.clearSession();
        return null;
      }
      if (!meRes.ok) {
        // Server error or temporary issue, preserve local cached user
        return this.getCurrentUser();
      }
      const meData = await meRes.json();
      const userId = meData.id || meData.profileData?.id;
      const userName = meData.profileData?.name || meData.username;
      const userEmail = meData.email;

      // 2. Fetch progress & settings data
      const res = await fetch(`${API_URL}/progress`, {
        headers: { 'x-auth-token': token },
      });

      let profileData = meData.profileData || createEmptyUser(userId, userName, userEmail);
      if (res.ok) {
        const data = await res.json();
        if (data.profileData) {
          profileData = { ...profileData, ...data.profileData };
        }
        if (data.settingsData) {
          this.saveSettings(data.settingsData);
        }
      }

      profileData.id = userId;
      profileData.name = userName;
      profileData.email = userEmail;

      const { lessonProgress, sessions, keyStats, gameScores, achievements, ...userProps } = profileData;
      const cleanUser: UserProfile = {
        ...createEmptyUser(userId, userName, userEmail),
        ...userProps,
      };

      this.setCurrentUser(cleanUser);

      if (lessonProgress) localStorage.setItem(STORAGE_KEYS.LESSON_PROGRESS + userId, JSON.stringify(lessonProgress));
      if (sessions) localStorage.setItem(STORAGE_KEYS.SESSIONS + userId, JSON.stringify(sessions));
      if (keyStats) localStorage.setItem(STORAGE_KEYS.KEY_STATS + userId, JSON.stringify(keyStats));
      if (gameScores) localStorage.setItem(STORAGE_KEYS.GAME_SCORES + userId, JSON.stringify(gameScores));
      if (achievements) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS + userId, JSON.stringify(achievements));

      return cleanUser;
    } catch(e) {
      console.warn('Failed to pull from cloud (using cached offline user):', e);
      return this.getCurrentUser();
    }
  }

  public importDataJSON(jsonStr: string): boolean {
    try {
      const parsed = JSON.parse(jsonStr);
      if (!parsed.user || !parsed.user.id) return false;

      const user: UserProfile = parsed.user;
      const users = this.getUsers().filter(u => u.id !== user.id);
      users.push(user);
      this.saveUsers(users);
      this.setCurrentUserId(user.id);

      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.progress) {
        localStorage.setItem(
          STORAGE_KEYS.LESSON_PROGRESS + user.id,
          JSON.stringify(parsed.progress)
        );
      }
      if (parsed.sessions) {
        localStorage.setItem(STORAGE_KEYS.SESSIONS + user.id, JSON.stringify(parsed.sessions));
      }
      if (parsed.keyStats) {
        localStorage.setItem(STORAGE_KEYS.KEY_STATS + user.id, JSON.stringify(parsed.keyStats));
      }
      if (parsed.gameScores) {
        localStorage.setItem(
          STORAGE_KEYS.GAME_SCORES + user.id,
          JSON.stringify(parsed.gameScores)
        );
      }
      if (parsed.achievements) {
        localStorage.setItem(
          STORAGE_KEYS.ACHIEVEMENTS + user.id,
          JSON.stringify(parsed.achievements)
        );
      }
      this.syncToCloud();
      return true;
    } catch {
      return false;
    }
  }
}

export const storage = new StorageManager();
