import React, { useState } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { audioEngine } from '../../core/audioEngine';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import {
  LayoutDashboard,
  BookOpen,
  Timer,
  Gamepad2,
  Sparkles,
  Activity,
  Trophy,
  Keyboard,
  Settings,
  Volume2,
  VolumeX,
  Flame,
  LogOut,
  Mail,
  Award,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

export type NavigationTab =
  | 'dashboard'
  | 'lessons'
  | 'test'
  | 'games'
  | 'learn'
  | 'analytics'
  | 'achievements';

interface NavbarProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user: UserProfile;
  settings: AppSettings;
  onOpenSettings: () => void;
  onOpenReference: () => void;
  onToggleSound: () => void;
  onLogout?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  user,
  settings,
  onOpenSettings,
  onOpenReference,
  onToggleSound,
  onLogout,
}) => {
  const { isInstallable, isInstalled, promptInstall } = usePWAInstall();
  const [showInstallTip, setShowInstallTip] = useState(false);

  const handleInstallClick = async () => {
    if (isInstallable) {
      await promptInstall();
    } else {
      setShowInstallTip(true);
      setTimeout(() => setShowInstallTip(false), 5000);
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'lessons', label: 'Lessons', icon: BookOpen },
    { id: 'test', label: 'Typing Test', icon: Timer },
    { id: 'games', label: 'Games', icon: Gamepad2 },
    { id: 'learn', label: 'Learn Keys', icon: Sparkles },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'achievements', label: 'Badges', icon: Trophy },
  ] as const;

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 select-none shadow-xl">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-lg shadow-blue-500/30 group-hover:scale-105 group-hover:shadow-blue-500/50 transition duration-300">
            <span className="font-urdu font-black text-2xl leading-none -translate-y-0.5">
              ٹ
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-white text-base tracking-tight">
              <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">UrduTyper</span>
              <span className="font-urdu text-amber-400 font-bold text-lg leading-none">
                اردو
              </span>
            </div>
            <div className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
              Phonetic Typing Tutor
            </div>
          </div>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800/90 shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavigationTab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-600/30 scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Side Quick Utility Actions */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={settings.soundTheme === 'mute' ? 'Unmute Audio' : 'Mute Audio'}
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer shadow-sm"
          >
            {settings.soundTheme === 'mute' ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Keyboard Map Reference Button */}
          <button
            onClick={onOpenReference}
            title="Urdu Keyboard Layout Cheat Sheet"
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold shadow-sm"
          >
            <Keyboard className="w-4 h-4 text-blue-400" />
            <span className="hidden md:inline">Keymap</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings & Preferences"
            className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition cursor-pointer shadow-sm"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Navbar: Centered Profile, Install App, & Logout Strip */}
      {user.name && (
        <div className="border-t border-slate-800/70 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 py-2.5 px-4 shadow-md relative">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            {/* User Profile Info Card */}
            <div className="flex items-center gap-2.5 bg-slate-950/80 border border-slate-800 px-3 py-1.5 rounded-2xl shadow-inner">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-sm shadow-md shadow-blue-500/20 border border-blue-400/30 shrink-0">
                {user.avatar || '👨‍💻'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white tracking-wide">
                  {user.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active
                </span>
              </div>
            </div>

            {/* Email pill (if present) */}
            {user.email && (
              <div className="hidden md:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-2xl text-slate-400 font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate max-w-[180px]">{user.email}</span>
              </div>
            )}

            {/* Level Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-slate-950/60 border border-slate-800/80 px-3 py-1.5 rounded-2xl text-purple-300 text-[11px] font-semibold">
              <Award className="w-3.5 h-3.5 text-purple-400" />
              <span>{user.level || 'Beginner'}</span>
            </div>

            {/* Daily Streak Counter */}
            <div className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-2xl text-amber-400 font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-amber-400 animate-pulse" />
              <span>{user.streakDays || 0}d Streak</span>
            </div>

            {/* PWA Install Desktop App Button (Native Monitor-Down-Arrow Icon) */}
            <div className="relative">
              {isInstalled ? (
                <div
                  title="UrduTyper is installed as a standalone app"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Installed</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  title="Install UrduTyper as Desktop/Mobile Application"
                  className="group flex items-center gap-1.5 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-blue-600/20 via-cyan-600/20 to-blue-600/10 hover:from-blue-600 hover:to-cyan-500 text-cyan-300 hover:text-white border border-cyan-500/30 hover:border-cyan-400 font-bold text-xs shadow-md hover:shadow-cyan-500/25 transition-all duration-200 cursor-pointer active:scale-95"
                >
                  {/* Native PWA Desktop Install Icon (Monitor with Downward Arrow) */}
                  <svg
                    className="w-4 h-4 text-cyan-400 group-hover:text-white transition-colors"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                    <path d="M12 7v5m-2.5-2.5 2.5 2.5 2.5-2.5" />
                  </svg>
                  <span>Install App</span>
                </button>
              )}

              {/* Tooltip if browser hasn't prompted or user clicked */}
              {showInstallTip && (
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-slate-900 border border-blue-500/50 rounded-2xl text-[11px] text-slate-200 shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5 mb-1">
                    <span>Install via Browser:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Click the <strong className="text-white">Install icon (🖥️↓)</strong> right inside your browser's address bar at the top right, or select <span className="text-cyan-300">Install UrduTyper</span> from the browser menu.
                  </p>
                </div>
              )}
            </div>

            {/* Centered Sleek Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout from your account"
                className="group flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-gradient-to-r from-rose-600/20 to-red-600/10 hover:from-rose-600 hover:to-red-600 text-rose-300 hover:text-white border border-rose-500/30 hover:border-rose-500 font-bold text-xs shadow-md hover:shadow-rose-600/30 transition-all duration-200 cursor-pointer active:scale-95"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-900 gap-1 scrollbar-none bg-slate-950/90">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
