/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, AppSettings, Lesson } from './types';
import { storage, createEmptyUser } from './core/storage';
import { audioEngine } from './core/audioEngine';
import { Navbar, NavigationTab } from './components/layout/Navbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { LessonsList } from './components/lessons/LessonsList';
import { LessonPage } from './components/lessons/LessonPage';
import { TypingTest } from './components/test/TypingTest';
import { GamesPage } from './components/games/GamesPage';
import { LearnKeyboardPage } from './components/learn/LearnKeyboardPage';
import { AnalyticsPage } from './components/analytics/AnalyticsPage';
import { AchievementsPage } from './components/achievements/AchievementsPage';
import { KeyboardReferenceModal } from './components/keyboard/KeyboardReferenceModal';
import { SettingsModal } from './components/settings/SettingsModal';
import { LESSONS } from './data/lessons';

import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { motion, AnimatePresence } from 'motion/react';
import { api } from './core/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => storage.getCurrentUser());
  const [settings, setSettings] = useState<AppSettings>(() => storage.getSettings());
  const [currentTab, setCurrentTab] = useState<NavigationTab>('dashboard');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Modals
  const [isReferenceOpen, setIsReferenceOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    if (token) {
      // Authenticate token with backend and pull genuine user data
      storage.pullFromCloud().then(loadedUser => {
        if (loadedUser && loadedUser.id) {
          setIsAuthenticated(true);
          setCurrentUser(loadedUser);
          setSettings(storage.getSettings());
        } else {
          handleLogout();
        }
      }).catch(() => {
        handleLogout();
      });
    } else {
      setIsAuthenticated(false);
    }
  }, [token]);

  // Initialize audio engine settings
  useEffect(() => {
    audioEngine.setTheme(settings.soundTheme);
    audioEngine.setVolume(settings.soundVolume);
  }, [settings.soundTheme, settings.soundVolume]);

  const handleUpdateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = storage.updateSettings(newSettings);
    setSettings({ ...updated });
    if (token) {
      try {
        await api.updateSettings(token, updated);
      } catch (e) {
        console.error('Failed to sync settings');
      }
    }
  };

  const handleUpdateUser = async (newUserData: Partial<UserProfile>) => {
    const updated = storage.updateUser(newUserData);
    setCurrentUser({ ...updated });
    if (token) {
      try {
        await api.updateProfile(token, updated);
      } catch (e) {
        console.error('Failed to sync profile');
      }
    }
  };

  const handleResetAllData = () => {
    storage.resetAllData();
    setCurrentUser(storage.getCurrentUser());
    setSettings(storage.getSettings());
    setActiveLesson(null);
    setCurrentTab('dashboard');
  };

  const handleSelectLesson = (lesson: Lesson) => {
    setActiveLesson(lesson);
  };

  const handleBackToLessons = () => {
    setActiveLesson(null);
    setCurrentTab('lessons');
  };

  const handleToggleSound = () => {
    const nextTheme = settings.soundTheme === 'mute' ? 'mechanical' : 'mute';
    handleUpdateSettings({ soundTheme: nextTheme });
  };

  const handleNavigate = (view: string, payload?: unknown) => {
    if (view === 'lesson' && payload) {
      setActiveLesson(payload as Lesson);
    } else {
      setActiveLesson(null);
      setCurrentTab(view as NavigationTab);
    }
  };

  const handleAuthSuccess = (newToken: string, user: any) => {
    localStorage.setItem('auth_token', newToken);
    if (user && user.profileData) {
      storage.setCurrentUser(user.profileData);
      setCurrentUser(user.profileData);
    }
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    storage.clearSession();
    setToken(null);
    setIsAuthenticated(false);
    setCurrentUser(createEmptyUser());
    setActiveLesson(null);
    setCurrentTab('dashboard');
    setAuthMode('login');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center relative overflow-hidden">
        {/* Dynamic Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
          <div className="absolute top-[60%] -right-[10%] w-[60%] h-[60%] rounded-full bg-purple-600/20 blur-[120px]" />
        </div>
        
        <div className="z-10 w-full px-4 flex justify-center">
          <AnimatePresence mode="wait">
            {authMode === 'login' ? (
              <Login
                key="login"
                onLoginSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setAuthMode('register')}
              />
            ) : (
              <Register
                key="register"
                onRegisterSuccess={handleAuthSuccess}
                onSwitchToLogin={() => setAuthMode('login')}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white ${
        settings.fontFamily === 'Noto Sans Arabic' ? 'font-arabic' : 'font-urdu'
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        currentTab={activeLesson ? 'lessons' : currentTab}
        onSelectTab={tab => {
          setActiveLesson(null);
          setCurrentTab(tab);
        }}
        user={currentUser}
        settings={settings}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenReference={() => setIsReferenceOpen(true)}
        onToggleSound={handleToggleSound}
        onLogout={handleLogout}
      />

      {/* Main View Router */}
      <main className="flex-1 pb-12">
        {activeLesson ? (
          <div className="pt-4">
            <LessonPage
              lesson={activeLesson}
              user={currentUser}
              settings={settings}
              onBackToLessons={handleBackToLessons}
              onNextLesson={nextLessonId => {
                const next = LESSONS.find(l => l.id === nextLessonId);
                if (next) {
                  setActiveLesson(next);
                } else {
                  handleBackToLessons();
                }
              }}
            />
          </div>
        ) : (
          <>
            {currentTab === 'dashboard' && (
              <Dashboard
                user={currentUser}
                settings={settings}
                onNavigate={handleNavigate}
              />
            )}

            {currentTab === 'lessons' && (
              <LessonsList
                user={currentUser}
                onSelectLesson={handleSelectLesson}
              />
            )}

            {currentTab === 'test' && (
              <TypingTest
                user={currentUser}
                settings={settings}
                onBackToDashboard={() => setCurrentTab('dashboard')}
              />
            )}

            {currentTab === 'games' && (
              <GamesPage user={currentUser} settings={settings} />
            )}

            {currentTab === 'learn' && (
              <LearnKeyboardPage
                user={currentUser}
                settings={settings}
                onBack={() => setCurrentTab('dashboard')}
              />
            )}

            {currentTab === 'analytics' && (
              <AnalyticsPage
                user={currentUser}
                settings={settings}
                onLaunchCustomLesson={(text, title) => {
                  setActiveLesson({
                    id: 998,
                    title,
                    titleUrdu: 'مشق کمزور حروف',
                    description: 'Targeted custom practice drill.',
                    difficulty: 'Intermediate',
                    category: 'Smart Practice',
                    targetWpm: 40,
                    targetAccuracy: 95,
                    keysTrained: [],
                    content: [text],
                  });
                }}
              />
            )}

            {currentTab === 'achievements' && (
              <AchievementsPage user={currentUser} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">UrduTyper</span>
            <span>•</span>
            <span className="font-urdu text-sm text-slate-400">اردو فونیٹک ٹائپنگ ٹیوٹر</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <button
              onClick={() => setIsReferenceOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Phonetic Keymap
            </button>
            <span>•</span>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="hover:text-slate-300 transition"
            >
              Preferences
            </button>
            <span>•</span>
            <span>CRULP / NLA Standard</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <KeyboardReferenceModal
        isOpen={isReferenceOpen}
        onClose={() => setIsReferenceOpen(false)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        user={currentUser}
        onUpdateSettings={handleUpdateSettings}
        onUpdateUser={handleUpdateUser}
        onClose={() => setIsSettingsOpen(false)}
        onResetAllData={handleResetAllData}
      />
    </div>
  );
}
