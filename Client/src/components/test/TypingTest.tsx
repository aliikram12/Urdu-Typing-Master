import React, { useState, useEffect } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { PASSAGES_FOR_TESTS } from '../../data/lessons';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import { storage } from '../../core/storage';
import { api } from '../../core/api';
import confetti from 'canvas-confetti';
import {
  Timer,
  Gauge,
  Target,
  AlertCircle,
  RotateCcw,
  Trophy,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Keyboard
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TypingTestProps {
  user: UserProfile;
  settings: AppSettings;
  onBackToDashboard: () => void;
}

const DURATIONS = [
  { label: '1 Min', seconds: 60 },
  { label: '2 Min', seconds: 120 },
  { label: '5 Min', seconds: 300 },
  { label: '10 Min', seconds: 600 },
];

export const TypingTest: React.FC<TypingTestProps> = ({
  user,
  settings,
  onBackToDashboard,
}) => {
  const [selectedDuration, setSelectedDuration] = useState<number>(60);
  const [selectedPassageIndex, setSelectedPassageIndex] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isTestActive, setIsTestActive] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(settings.showVirtualKeyboard);

  const [testResult, setTestResult] = useState<{
    wpm: number;
    netWpm: number;
    accuracy: number;
    errors: number;
    totalChars: number;
    correctChars: number;
    userAvgWpm: number;
    isNewBest: boolean;
  } | null>(null);

  const passage = PASSAGES_FOR_TESTS[selectedPassageIndex];

  const {
    chars,
    currentTargetChar,
    expectedPrompt,
    pendingBuffer,
    stats,
    handleKeystroke,
    reset,
  } = useTypingEngine({
    targetText: passage.content,
    strictMode: settings.strictMode,
  });

  // Calculate user's average WPM across prior sessions
  const sessions = storage.getSessions(user.id);
  const avgWpm =
    sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length)
      : 30;

  // Countdown timer for test
  useEffect(() => {
    let timer: number | null = null;
    if (isTestActive && remainingSeconds > 0) {
      timer = window.setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // Time is up!
            finishTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isTestActive, remainingSeconds]);

  // Start test on first keypress
  useEffect(() => {
    if (stats.totalKeypresses === 1 && !isTestActive) {
      setIsTestActive(true);
    }
  }, [stats.totalKeypresses, isTestActive]);

  const finishTest = () => {
    setIsTestActive(false);

    const minutes = (selectedDuration - remainingSeconds) / 60 || 0.1;
    const finalGross = Math.round((stats.correctKeypresses / 5) / minutes);
    const finalErrors = stats.incorrectKeypresses;
    const finalNet = Math.max(0, finalGross - Math.round(finalErrors / minutes));
    const finalAcc =
      stats.totalKeypresses > 0
        ? Math.round((stats.correctKeypresses / stats.totalKeypresses) * 100)
        : 100;

    const prevBestWpm = Math.max(0, ...sessions.map(s => s.wpm));
    const isNewBest = finalGross > prevBestWpm && finalGross > 0;

    // Persist session to local Storage
    storage.addSession({
      id: 'sess_test_' + Date.now(),
      userId: user.id,
      mode: 'test',
      lessonTitle: `Timed Test (${selectedDuration / 60} min)`,
      wpm: finalGross,
      netWpm: finalNet,
      accuracy: finalAcc,
      totalCharacters: stats.totalKeypresses,
      correctCharacters: stats.correctKeypresses,
      incorrectCharacters: finalErrors,
      durationSeconds: selectedDuration - remainingSeconds,
      averageLatencyMs: stats.averageLatencyMs,
      createdAt: new Date().toISOString(),
    });

    // Persist to MongoDB History Collection
    const token = localStorage.getItem('auth_token');
    if (token) {
      api.saveHistory(token, {
        activityType: 'test',
        title: `Timed Speed Test (${selectedDuration / 60} min)`,
        titleUrdu: 'رفتار کا امتحان',
        score: finalGross,
        netScore: finalNet,
        total: stats.totalKeypresses,
        percentage: finalAcc,
        errors: finalErrors,
        durationSeconds: selectedDuration - remainingSeconds,
        status: finalAcc >= 85 && finalGross >= 20 ? 'Passed' : finalAcc < 75 ? 'Failed' : 'Completed',
      }).catch(err => console.error('Failed to save test to database', err));
    }

    setTestResult({
      wpm: finalGross,
      netWpm: finalNet,
      accuracy: finalAcc,
      errors: finalErrors,
      totalChars: stats.totalKeypresses,
      correctChars: stats.correctKeypresses,
      userAvgWpm: avgWpm,
      isNewBest,
    });

    setShowResultModal(true);

    try {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    } catch {
      // Ignored
    }
  };

  const restartTest = () => {
    setRemainingSeconds(selectedDuration);
    setIsTestActive(false);
    setShowResultModal(false);
    reset();
  };

  const formatTimer = (s: number) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 select-none">
      {/* Test Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/[0.06]">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
            <Timer className="w-4 h-4" />
            <span>Official Urdu Speed Assessment</span>
          </div>
          <h1 className="text-2xl font-black text-[#F8FAFC] mt-1">Timed Typing Test</h1>
          <p className="text-xs text-[#94A3B8]">
            Select duration and type the standardized Urdu passage with maximum speed & accuracy.
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-1.5 bg-[#070B14] border border-white/[0.06] p-1.5 rounded-2xl shadow-inner">
          {DURATIONS.map(d => (
            <button
              key={d.seconds}
              disabled={isTestActive}
              onClick={() => {
                setSelectedDuration(d.seconds);
                setRemainingSeconds(d.seconds);
                reset();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                selectedDuration === d.seconds
                  ? 'neu-btn-primary text-white shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      {/* Live HUD Gauge */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-4">
        {/* Countdown Timer */}
        <div
          className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
            remainingSeconds <= 10 && isTestActive
              ? 'bg-rose-950/40 border-rose-600/60 animate-pulse'
              : 'neu-card'
          }`}
        >
          <div className="p-2.5 bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 rounded-xl shadow-sm">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
              Time Remaining
            </div>
            <div
              className={`text-2xl font-black ${
                remainingSeconds <= 10 && isTestActive ? 'text-rose-400' : 'text-[#F8FAFC]'
              }`}
            >
              {formatTimer(remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Speed WPM */}
        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30 rounded-xl shadow-sm">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
              Gross Speed
            </div>
            <div className="text-2xl font-black text-[#F8FAFC]">
              {stats.wpm} <span className="text-xs font-normal text-[#94A3B8]">WPM</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-2xl font-black text-emerald-400">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-xl shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">
              Errors
            </div>
            <div className="text-2xl font-black text-rose-400">
              {stats.incorrectKeypresses}
            </div>
          </div>
        </div>
      </div>

      {/* Target Urdu Passage Container */}
      <div className="my-2 p-6 md:p-8 neu-card-raised rounded-3xl shadow-2xl relative">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3 border-b border-white/[0.06] pb-2.5">
          <span className="font-semibold text-[#F8FAFC]">
            Passage: {passage.title}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setSelectedPassageIndex(
                  (selectedPassageIndex + 1) % PASSAGES_FOR_TESTS.length
                )
              }
              className="text-xs text-[#38BDF8] hover:underline cursor-pointer font-semibold"
            >
              Change Passage
            </button>
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="neu-btn-secondary px-2.5 py-1 rounded-lg text-[#F8FAFC] flex items-center gap-1.5 text-[11px] cursor-pointer"
            >
              <Keyboard className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Keyboard</span>
            </button>
          </div>
        </div>

        {/* RTL Passage Display in Deep Inset Well */}
        <div
          dir="rtl"
          className="neu-inset rounded-2xl p-4 font-urdu text-2xl md:text-3xl leading-loose tracking-wide text-right selection:bg-transparent min-h-[160px]"
        >
          {chars.map((item, idx) => {
            let colorClass = 'text-[#64748B]';
            let bgClass = '';

            if (item.status === 'correct') {
              colorClass = 'text-[#38BDF8]';
            } else if (item.status === 'incorrect') {
              colorClass = 'text-rose-400 underline decoration-rose-500 decoration-wavy decoration-2';
            } else if (item.status === 'current') {
              colorClass = 'text-[#F8FAFC] font-extrabold';
              bgClass = 'bg-[#2563EB]/40 ring-2 ring-[#38BDF8] rounded-md px-1.5 py-0.5 shadow-[0_0_12px_rgba(56,189,248,0.5)] animate-pulse';
            }

            return (
              <span
                key={idx}
                className={`transition-colors duration-100 ${colorClass} ${bgClass}`}
              >
                {item.char}
              </span>
            );
          })}
        </div>

        {!isTestActive && stats.totalKeypresses === 0 && (
          <div className="absolute inset-0 bg-[#0B1120]/80 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-4">
            <Sparkles className="w-8 h-8 text-[#FACC15] animate-bounce mb-2" />
            <h3 className="text-xl font-bold text-[#F8FAFC]">Ready to begin?</h3>
            <p className="text-xs text-[#94A3B8] mt-1">
              Start typing on your keyboard to trigger the {selectedDuration / 60}-minute timer!
            </p>
          </div>
        )}
      </div>

      {/* Virtual Keyboard */}
      {showKeyboard && (
        <VirtualKeyboard
          currentTargetChar={currentTargetChar}
          expectedKeyPrompt={expectedPrompt}
          pendingBuffer={pendingBuffer}
          showEnglishLabels={settings.showEnglishLabels}
          showUrduLabels={settings.showUrduLabels}
          onVirtualKeyPress={(key) => handleKeystroke(key)}
        />
      )}

      {/* Test Results Modal */}
      <AnimatePresence>
        {showResultModal && testResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neu-card-raised w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-[#FACC15]/15 border border-[#FACC15]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Trophy className="w-8 h-8 text-[#FACC15] animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                Test Completed
              </span>
              <h2 className="text-3xl font-black text-[#F8FAFC] mt-1">Your Typing Score</h2>

              {testResult.isNewBest && (
                <div className="inline-block my-2 px-3 py-1 neu-badge-yellow rounded-full font-bold text-xs animate-pulse">
                  🌟 New Personal Best WPM Record!
                </div>
              )}

              {/* Main WPM and Accuracy Callout */}
              <div className="flex items-center justify-center gap-6 my-4 py-4 neu-inset rounded-2xl">
                <div>
                  <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Gross WPM
                  </div>
                  <div className="text-4xl font-black text-[#F8FAFC]">
                    {testResult.wpm}
                  </div>
                </div>
                <div className="w-px h-12 bg-white/[0.08]" />
                <div>
                  <div className="text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                    Accuracy
                  </div>
                  <div className="text-4xl font-black text-emerald-400">
                    {testResult.accuracy}%
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-3 gap-2.5 mb-4 text-xs">
                <div className="neu-inset p-3 rounded-xl">
                  <div className="text-[#94A3B8]">Correct Chars</div>
                  <div className="text-lg font-bold text-[#F8FAFC] mt-0.5">
                    {testResult.correctChars}
                  </div>
                </div>
                <div className="neu-inset p-3 rounded-xl">
                  <div className="text-[#94A3B8]">Errors</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">
                    {testResult.errors}
                  </div>
                </div>
                <div className="neu-inset p-3 rounded-xl">
                  <div className="text-[#94A3B8]">Net WPM</div>
                  <div className="text-lg font-bold text-[#38BDF8] mt-0.5">
                    {testResult.netWpm}
                  </div>
                </div>
              </div>

              {/* Comparison Callout */}
              <div className="p-3 bg-[#16233A] border border-white/[0.08] rounded-xl text-xs text-[#94A3B8] flex items-center justify-between mb-4 shadow-sm">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                  <span>Historical Average: <strong className="text-[#F8FAFC]">{testResult.userAvgWpm} WPM</strong></span>
                </div>
                <span className={`font-bold ${testResult.wpm >= testResult.userAvgWpm ? 'text-emerald-400' : 'text-[#FACC15]'}`}>
                  {testResult.wpm >= testResult.userAvgWpm ? `+${testResult.wpm - testResult.userAvgWpm} WPM Faster` : `${testResult.userAvgWpm - testResult.wpm} WPM under`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={restartTest}
                  className="neu-btn-primary py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Test</span>
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="neu-btn-secondary py-3 rounded-xl text-xs font-semibold transition cursor-pointer text-[#F8FAFC]"
                >
                  Back to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
