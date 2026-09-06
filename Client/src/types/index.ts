export type DifficultyLevel = 'Beginner' | 'Foundation' | 'Intermediate' | 'Advanced' | 'Professional';

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  targetWpm: number;
  createdAt: string;
  lastLogin: string;
  streakDays: number;
  lastPracticeDate: string;
  practiceDates: string[]; // ISO date strings (YYYY-MM-DD)
}

export interface TypingSession {
  id: string;
  userId: string;
  mode: 'lesson' | 'test' | 'game' | 'learn' | 'smart';
  lessonId?: number;
  lessonTitle?: string;
  wpm: number;
  netWpm: number;
  accuracy: number;
  totalCharacters: number;
  correctCharacters: number;
  incorrectCharacters: number;
  durationSeconds: number;
  averageLatencyMs: number;
  createdAt: string;
}

export interface KeyStat {
  key: string;
  urduChar: string;
  totalPresses: number;
  correctPresses: number;
  incorrectPresses: number;
  accuracy: number;
  averageLatencyMs: number;
}

export interface Lesson {
  id: number;
  title: string;
  titleUrdu: string;
  description: string;
  difficulty: DifficultyLevel;
  category: string;
  targetWpm: number;
  targetAccuracy: number;
  content: string[];
  tips?: string;
  keysTrained: string[];
}

export interface LessonProgress {
  lessonId: number;
  completed: boolean;
  bestWpm: number;
  bestAccuracy: number;
  attempts: number;
  lastAttempt: string;
  stars: number; // 1 to 3
}

export interface GameScore {
  id: string;
  userId: string;
  gameName: 'falling-words' | 'urdu-bubbles' | 'speed-race';
  score: number;
  wpm: number;
  accuracy: number;
  wordsCompleted: number;
  bestCombo: number;
  durationSeconds: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  titleUrdu: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  progress: number;
  maxProgress: number;
}

export interface AppSettings {
  theme: 'navy' | 'dark' | 'light';
  soundTheme: 'mechanical' | 'soft' | 'modern' | 'mute';
  fontFamily: 'Noto Nastaliq Urdu' | 'Noto Sans Arabic';
  fontSize: 'small' | 'medium' | 'large' | 'xlarge';
  showVirtualKeyboard: boolean;
  showHandGuide: boolean;
  showEnglishLabels: boolean;
  showUrduLabels: boolean;
  soundEnabled: boolean;
  soundVolume: number; // 0 to 1
  errorSound: boolean;
  gameSound: boolean;
  strictMode: boolean;
  autoAdvance: boolean;
  uiLanguage: 'en' | 'ur';
}

export type FingerType = 
  | 'left-pinky'
  | 'left-ring'
  | 'left-middle'
  | 'left-index'
  | 'thumb'
  | 'right-index'
  | 'right-middle'
  | 'right-ring'
  | 'right-pinky';

export interface KeyboardKeyInfo {
  code: string;
  normal: string;
  shift?: string;
  urduNormal: string;
  urduShift?: string;
  multiSequence?: string[]; // e.g. ['s', 'h'] -> 'ش'
  finger: FingerType;
  row: number; // 1 to 5
  width?: string; // CSS flex or width
}

export interface HistoryRecord {
  _id?: string;
  id?: string;
  userId: string;
  activityType: 'test' | 'lesson' | 'game' | 'practice';
  title: string;
  titleUrdu?: string;
  score: number;
  netScore?: number;
  total?: number;
  percentage: number;
  errorCount?: number;
  errors?: number;
  status: 'Passed' | 'Failed' | 'Completed';
  durationSeconds: number;
  date: string;
  time?: string;
  createdAt?: string;
}

export interface HistoryStats {
  totalTests: number;
  avgWpm: number;
  avgAccuracy: number;
  passedTests: number;
  failedTests: number;
  totalPracticeSeconds: number;
  latestActivity?: HistoryRecord | null;
}
