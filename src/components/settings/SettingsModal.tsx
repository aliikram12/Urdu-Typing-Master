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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">App Preferences & Settings</h2>
              <p className="text-xs text-slate-400">
                Customize typing audio, keyboard ergonomics, Nastaliq typography, and goals
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Settings Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Section 1: Audio & Haptics */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <span>Keystroke Audio Feedback</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              {(['mechanical', 'soft', 'modern', 'mute'] as const).map(theme => (
                <button
                  key={theme}
                  onClick={() => handleSoundThemeChange(theme)}
                  className={`py-2 px-3 rounded-xl font-bold capitalize transition border cursor-pointer ${
                    settings.soundTheme === theme
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {theme}
                </button>
              ))}
            </div>

            {/* Volume slider */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400">Audio Volume:</span>
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
                className="w-32 accent-blue-500"
              />
            </div>
          </div>

          {/* Section 2: Visual Guidance */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Keyboard className="w-4 h-4 text-emerald-400" />
              <span>Keyboard & Ergonomic Guidance</span>
            </div>

            <div className="divide-y divide-slate-850">
              <label className="py-2.5 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show Virtual Keyboard</div>
                  <div className="text-[11px] text-slate-500">
                    Display dynamic on-screen keyboard with animated keypresses
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showVirtualKeyboard}
                  onChange={e => onUpdateSettings({ showVirtualKeyboard: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="py-2.5 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show Hand & Finger Guide</div>
                  <div className="text-[11px] text-slate-500">
                    Highlight exact finger placement for correct touch typing technique
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showHandGuide}
                  onChange={e => onUpdateSettings({ showHandGuide: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="py-2.5 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show English Key Labels</div>
                  <div className="text-[11px] text-slate-500">
                    Display corresponding QWERTY letter on keycaps
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showEnglishLabels}
                  onChange={e => onUpdateSettings({ showEnglishLabels: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="py-2.5 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Show Urdu Key Labels</div>
                  <div className="text-[11px] text-slate-500">
                    Display primary Urdu Nastaliq glyphs on keycaps
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.showUrduLabels}
                  onChange={e => onUpdateSettings({ showUrduLabels: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>

              <label className="py-2.5 flex items-center justify-between cursor-pointer">
                <div>
                  <div className="font-semibold text-white">Strict Mode</div>
                  <div className="text-[11px] text-slate-500">
                    Must fix mistakes before advancing to next character
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={settings.strictMode}
                  onChange={e => onUpdateSettings({ strictMode: e.target.checked })}
                  className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Section 3: Typography */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Type className="w-4 h-4 text-purple-400" />
              <span>Nastaliq Font & Typography</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onUpdateSettings({ fontFamily: 'Noto Nastaliq Urdu' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  settings.fontFamily === 'Noto Nastaliq Urdu'
                    ? 'bg-purple-950/40 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-xs">Noto Nastaliq Urdu</div>
                <div className="font-urdu text-lg mt-1">خوش خط نستعلیق</div>
              </button>

              <button
                onClick={() => onUpdateSettings({ fontFamily: 'Noto Sans Arabic' })}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  settings.fontFamily === 'Noto Sans Arabic'
                    ? 'bg-purple-950/40 border-purple-500 text-white'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <div className="font-bold text-xs">Noto Sans Arabic (Naskh)</div>
                <div className="font-sans text-lg mt-1">خط نسخ واضح</div>
              </button>
            </div>

            {/* Font size picker */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-slate-400">Urdu Text Size:</span>
              <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
                {(['small', 'medium', 'large', 'xlarge'] as const).map(sz => (
                  <button
                    key={sz}
                    onClick={() => onUpdateSettings({ fontSize: sz })}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                      settings.fontSize === sz
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 4: Target WPM Goal */}
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-white text-sm">
                <Target className="w-4 h-4 text-amber-400" />
                <span>Target Speed Goal</span>
              </div>
              <span className="text-sm font-black text-amber-300">
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
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-500">
              <span>Beginner (20 WPM)</span>
              <span>Fluent (50 WPM)</span>
              <span>Pro Master (100 WPM)</span>
            </div>
          </div>

          {/* Section 5: Reset All Data */}
          <div className="p-4 rounded-2xl border border-rose-900/40 bg-rose-950/10 space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold text-rose-300">Reset All Progress & Scores</div>
                <div className="text-[11px] text-slate-400">
                  Clears local session logs, achievements, and weak keys data.
                </div>
              </div>

              {!confirmReset ? (
                <button
                  onClick={() => setConfirmReset(true)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
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
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-xl text-xs cursor-pointer"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setConfirmReset(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-xl text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
