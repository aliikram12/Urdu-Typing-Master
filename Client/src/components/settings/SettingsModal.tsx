import React, { useState } from 'react';
import { AppSettings, UserProfile } from '../../types';
import { audioEngine } from '../../core/audioEngine';
import { storage } from '../../core/storage';
import {
  X,
  Volume2,
  VolumeX,
  Keyboard,
  Hand,
  Type,
  Target,
  Trash2,
  Check,
  RotateCcw,
  Sliders
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  settings: AppSettings;
  user: UserProfile;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onUpdateUser: (newUser: Partial<UserProfile>) => void;
  onClose: () => void;
  onResetAllData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  settings,
  user,
  onUpdateSettings,
  onUpdateUser,
  onClose,
  onResetAllData,
}) => {
  const [confirmReset, setConfirmReset] = useState(false);

  if (!isOpen) return null;

  const handleSoundThemeChange = (theme: AppSettings['soundTheme']) => {
    audioEngine.setTheme(theme);
    onUpdateSettings({ soundTheme: theme });
    // Play test click
    audioEngine.playKeyClick();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="neu-card-raised w-full max-w-2xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-700">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neu-inset flex items-center justify-center text-[#38BDF8]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-[#F8FAFC]">App Preferences & Settings</h2>
              <p className="text-xs text-[#94A3B8]">
                Customize typing audio, keyboard ergonomics, Nastaliq typography, and goals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="neu-btn-secondary p-2.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Audio & Haptics */}
          <div className="neu-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm">
              <Volume2 className="w-4 h-4 text-[#38BDF8]" />
              <span>Keystroke Audio Feedback</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {(['mechanical', 'soft', 'modern', 'mute'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleSoundThemeChange(theme)}
                  className={`py-2.5 px-3 rounded-xl font-bold capitalize transition cursor-pointer ${
                    settings.soundTheme === theme
                      ? 'neu-btn-primary text-white'
                      : 'neu-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[#94A3B8] font-semibold">Audio Volume:</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={settings.soundVolume}
                onChange={e => {
                  const vol = parseFloat(e.target.value);
                  audioEngine.setVolume(vol);
                  onUpdateSettings({ soundVolume: vol });
                }}
                className="w-36 accent-[#2563EB] cursor-pointer"
              />
            </div>
          </div>

          {/* Section 2: Visual Guidance */}
          <div className="neu-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm">
              <Keyboard className="w-4 h-4 text-[#38BDF8]" />
              <span>Keyboard & Ergonomic Guidance</span>
            </div>

            <div className="divide-y divide-slate-800/80">
              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-[#F8FAFC]">Show Virtual Keyboard</div>
                  <div className="text-[11px] text-[#64748B]">
                    Display dynamic on-screen 3D keyboard with animated keypresses
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showVirtualKeyboard}
                  onChange={e => onUpdateSettings({ showVirtualKeyboard: e.target.checked })}
                  className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-[#F8FAFC]">Show Hand & Finger Guide</div>
                  <div className="text-[11px] text-[#64748B]">
                    Highlight exact finger placement for correct touch typing technique
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHandGuide}
                  onChange={e => onUpdateSettings({ showHandGuide: e.target.checked })}
                  className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-[#F8FAFC]">Show English Key Labels</div>
                  <div className="text-[11px] text-[#64748B]">
                    Display corresponding QWERTY letter on keycaps
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showEnglishLabels}
                  onChange={e => onUpdateSettings({ showEnglishLabels: e.target.checked })}
                  className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-[#F8FAFC]">Show Urdu Key Labels</div>
                  <div className="text-[11px] text-[#64748B]">
                    Display primary Urdu Nastaliq glyphs on keycaps
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showUrduLabels}
                  onChange={e => onUpdateSettings({ showUrduLabels: e.target.checked })}
                  className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                />
              </label>

              <label className="py-3 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-bold text-[#F8FAFC]">Strict Mode</div>
                  <div className="text-[11px] text-[#64748B]">
                    Must fix mistakes before advancing to next character
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictMode}
                  onChange={e => onUpdateSettings({ strictMode: e.target.checked })}
                  className="w-4 h-4 accent-[#2563EB] rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Typography */}
          <div className="neu-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm">
              <Type className="w-4 h-4 text-[#38BDF8]" />
              <span>Nastaliq Font & Typography</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onUpdateSettings({ fontFamily: 'Noto Nastaliq Urdu' })}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                  settings.fontFamily === 'Noto Nastaliq Urdu'
                    ? 'neu-card-raised border-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                    : 'neu-inset border-transparent text-[#94A3B8]'
                }`}
              >
                <div className="font-bold text-xs text-[#F8FAFC]">Noto Nastaliq Urdu</div>
                <div className="font-urdu text-xl mt-1.5 text-[#38BDF8] font-bold">خوش خط نستعلیق</div>
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'Noto Sans Arabic' })}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition ${
                  settings.fontFamily === 'Noto Sans Arabic'
                    ? 'neu-card-raised border-[#2563EB] shadow-[0_0_15px_rgba(37,99,235,0.3)]'
                    : 'neu-inset border-transparent text-[#94A3B8]'
                }`}
              >
                <div className="font-bold text-xs text-[#F8FAFC]">Noto Sans Arabic (Naskh)</div>
                <div className="font-sans text-lg mt-1.5 text-[#38BDF8] font-bold">خط نسخ واضح</div>
              </button>
            </div>

            {/* Font size picker */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[#94A3B8] font-semibold">Urdu Text Size:</span>
              <div className="flex items-center gap-1.5 neu-segmented-track p-1 rounded-xl">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => onUpdateSettings({ fontSize: sz })}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                      settings.fontSize === sz
                        ? 'neu-btn-primary text-white'
                        : 'text-[#94A3B8] hover:text-[#F8FAFC]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Target WPM Goal */}
          <div className="neu-card p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-[#F8FAFC] text-sm">
                <Target className="w-4 h-4 text-[#FACC15]" />
                <span>Target Speed Goal</span>
              </div>
              <span className="neu-badge-yellow text-xs font-black px-2.5 py-1">
                {user.targetWpm || 50} WPM
              </span>
            </div>

            <input
              type="range"
              min="20"
              max="100"
              step="5"
              value={user.targetWpm || 50}
              onChange={e => onUpdateUser({ targetWpm: parseInt(e.target.value) })}
              className="w-full accent-[#FACC15] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#64748B] font-semibold">
              <span>Beginner (20 WPM)</span>
              <span>Fluent (50 WPM)</span>
              <span>Pro Master (100 WPM)</span>
            </div>
          </div>

          {/* Section 5: Reset All Data */}
          <div className="p-5 rounded-2xl border border-rose-900/40 bg-rose-950/20 space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-bold text-rose-300 text-sm">Reset All Progress & Scores</div>
                <div className="text-[11px] text-[#94A3B8] mt-0.5">
                  Clears local session logs, achievements, and weak keys data.
                </div>
              </div>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer shadow-lg shadow-rose-900/30"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset Data</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      onResetAllData();
                      setConfirmReset(false);
                      onClose();
                    }}
                    className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs cursor-pointer shadow-lg"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="neu-btn-secondary px-3.5 py-2 text-[#94A3B8] rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#080D18] border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="neu-btn-primary px-7 py-2.5 rounded-xl text-white font-bold text-xs cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
