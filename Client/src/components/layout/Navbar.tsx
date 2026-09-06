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
    <header className="sticky top-0 z-40 bg-[#111C31] border-b border-white/[0.07] select-none shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)]">
      {/* Primary Top Bar */}
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onSelectTab('dashboard')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-white shadow-[0_4px_12px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/20 group-hover:scale-105 transition-all duration-300">
            <span className="font-urdu font-black text-2xl leading-none -translate-y-0.5">
              ٹ
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-black text-white text-base tracking-tight">
              <span className="text-[#F8FAFC]">UrduTyper</span>
              <span className="font-urdu text-[#FACC15] font-bold text-lg leading-none drop-shadow-[0_2px_8px_rgba(250,204,21,0.3)]">
                اردو
              </span>
            </div>
            <div className="text-[10px] font-semibold text-[#94A3B8] tracking-wider uppercase">
              Phonetic Typing Tutor
            </div>
          </div>
        </div>

        {/* Primary Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#070B14] p-1.5 rounded-2xl border border-white/[0.06] shadow-[inset_1px_2px_4px_rgba(0,0,0,0.6)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavigationTab)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 cursor-pointer ${
                  isActive
                    ? 'neu-btn-primary shadow-[0_4px_12px_rgba(37,99,235,0.45)]'
                    : 'text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#16233A]/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#38BDF8]'}`} />
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
            className="p-2.5 rounded-xl neu-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            {settings.soundTheme === 'mute' ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-[#38BDF8]" />
            )}
          </button>

          {/* Keyboard Map Reference Button */}
          <button
            onClick={onOpenReference}
            title="Urdu Keyboard Layout Cheat Sheet"
            className="p-2.5 rounded-xl neu-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
          >
            <Keyboard className="w-4 h-4 text-[#38BDF8]" />
            <span className="hidden md:inline">Keymap</span>
          </button>

          {/* Settings Trigger */}
          <button
            onClick={onOpenSettings}
            title="Settings & Preferences"
            className="p-2.5 rounded-xl neu-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Sub-Navbar: Centered Profile, Install App, & Logout Strip */}
      {user.name && (
        <div className="border-t border-white/[0.05] bg-[#0E1729] py-2 px-4 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] relative">
          <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs">
            {/* User Profile Info Card */}
            <div className="flex items-center gap-2.5 bg-[#111C31] border border-white/[0.07] px-3 py-1.5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-xs shadow-sm border border-white/20 shrink-0">
                {user.avatar || '👨‍💻'}
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#F8FAFC] tracking-wide">
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
              <div className="hidden md:flex items-center gap-1.5 bg-[#070B14] border border-white/[0.06] px-3 py-1.5 rounded-xl text-[#94A3B8] font-mono text-[11px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                <span className="truncate max-w-[180px]">{user.email}</span>
              </div>
            )}

            {/* Level Pill */}
            <div className="hidden sm:flex items-center gap-1.5 bg-[#111C31] border border-white/[0.07] px-3 py-1.5 rounded-xl text-[#38BDF8] text-[11px] font-semibold shadow-sm">
              <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>{user.level || 'Beginner'}</span>
            </div>

            {/* Daily Streak Counter - Warm Yellow Accent */}
            <div className="flex items-center gap-1.5 neu-badge-yellow px-3 py-1.5 rounded-xl font-bold text-[11px]">
              <Flame className="w-3.5 h-3.5 fill-[#FACC15] animate-pulse" />
              <span>{user.streakDays || 0}d Streak</span>
            </div>

            {/* PWA Install Desktop App Button */}
            <div className="relative">
              {isInstalled ? (
                <div
                  title="UrduTyper is installed as a standalone app"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Installed</span>
                </div>
              ) : (
                <button
                  onClick={handleInstallClick}
                  title="Install UrduTyper as Desktop/Mobile Application"
                  className="neu-btn-secondary flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer text-[#38BDF8]"
                >
                  <svg
                    className="w-3.5 h-3.5 text-[#38BDF8]"
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
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-64 p-3 bg-[#111C31] border border-[#38BDF8]/40 rounded-xl text-[11px] text-[#F8FAFC] shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
                  <div className="font-bold text-[#38BDF8] flex items-center gap-1.5 mb-1">
                    <span>Install via Browser:</span>
                  </div>
                  <p className="text-[#94A3B8] leading-relaxed">
                    Click the <strong className="text-white">Install icon (🖥️↓)</strong> right inside your browser's address bar at the top right, or select <span className="text-[#38BDF8]">Install UrduTyper</span> from the browser menu.
                  </p>
                </div>
              )}
            </div>

            {/* Centered Sleek Logout Button */}
            {onLogout && (
              <button
                onClick={onLogout}
                title="Logout from your account"
                className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1F1418] hover:bg-[#2E141D] text-rose-300 hover:text-white border border-rose-500/25 hover:border-rose-500/50 font-bold text-xs shadow-sm transition-all duration-150 cursor-pointer active:translate-y-0.5"
              >
                <LogOut className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Mobile Sub-Navigation Bar */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-white/[0.05] gap-1.5 scrollbar-none bg-[#0B1120]">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as NavigationTab)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition shrink-0 ${
                isActive
                  ? 'neu-btn-primary'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC] bg-[#111C31]'
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
