import React, { useState, useEffect } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { PASSAGES_FOR_TESTS } from '../../data/lessons';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import { storage } from '../../core/storage';
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

    // Persist session to SQLite / Storage
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <Timer className="w-4 h-4" />
            <span>Official Urdu Speed Assessment</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1">Timed Typing Test</h1>
          <p className="text-xs text-slate-400">
            Select duration and type the standardized Urdu passage with maximum speed & accuracy.
          </p>
        </div>

        {/* Duration Selectors */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
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
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
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
              : 'bg-slate-900/90 border-slate-800'
          }`}
        >
          <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl">
            <Timer className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Time Remaining
            </div>
            <div
              className={`text-2xl font-black ${
                remainingSeconds <= 10 && isTestActive ? 'text-rose-400' : 'text-white'
              }`}
            >
              {formatTimer(remainingSeconds)}
            </div>
          </div>
        </div>

        {/* Speed WPM */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl">
            <Gauge className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Gross Speed
            </div>
            <div className="text-2xl font-black text-white">
              {stats.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        </div>

        {/* Accuracy */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Accuracy
            </div>
            <div className="text-2xl font-black text-cyan-400">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        {/* Errors */}
        <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
              Errors
            </div>
            <div className="text-2xl font-black text-rose-400">
              {stats.incorrectKeypresses}
            </div>
          </div>
        </div>
      </div>

      {/* Target Urdu Passage Container */}
      <div className="my-2 p-6 md:p-8 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl relative">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3 border-b border-slate-800/80 pb-2">
          <span className="font-semibold text-slate-300">
            Passage: {passage.title}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() =>
                setSelectedPassageIndex(
                  (selectedPassageIndex + 1) % PASSAGES_FOR_TESTS.length
                )
              }
              className="text-xs text-blue-400 hover:text-blue-300 underline cursor-pointer"
            >
              Change Passage
            </button>
            <button
              onClick={() => setShowKeyboard(!showKeyboard)}
              className="ml-3 p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 text-[11px]"
            >
              <Keyboard className="w-3.5 h-3.5" />
              <span>Keyboard</span>
            </button>
          </div>
        </div>

        {/* RTL Passage Display */}
        <div
          dir="rtl"
          className="font-urdu text-2xl md:text-3xl leading-loose tracking-wide text-right selection:bg-transparent py-4 min-h-[160px]"
        >
          {chars.map((item, idx) => {
            let colorClass = 'text-slate-500';
            let bgClass = '';

            if (item.status === 'correct') {
              colorClass = 'text-emerald-400';
            } else if (item.status === 'incorrect') {
              colorClass = 'text-rose-400 underline decoration-rose-500 decoration-wavy decoration-2';
            } else if (item.status === 'current') {
              colorClass = 'text-white font-extrabold';
              bgClass = 'bg-blue-600/30 ring-2 ring-blue-500 rounded px-1 animate-pulse';
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
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] rounded-3xl flex flex-col items-center justify-center p-4">
            <Sparkles className="w-8 h-8 text-blue-400 animate-bounce mb-2" />
            <h3 className="text-xl font-bold text-white">Ready to begin?</h3>
            <p className="text-xs text-slate-300 mt-1">
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-6 md:p-8 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-400 shadow-lg">
                <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Test Completed
              </span>
              <h2 className="text-3xl font-black text-white mt-1">Your Typing Score</h2>

              {testResult.isNewBest && (
                <div className="inline-block my-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-semibold text-xs animate-pulse">
                  🌟 New Personal Best WPM Record!
                </div>
              )}

              {/* Main WPM and Accuracy Callout */}
              <div className="flex items-center justify-center gap-6 my-4 py-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Gross WPM
                  </div>
                  <div className="text-4xl font-black text-white">
                    {testResult.wpm}
                  </div>
                </div>
                <div className="w-px h-12 bg-slate-800" />
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Accuracy
                  </div>
                  <div className="text-4xl font-black text-emerald-400">
                    {testResult.accuracy}%
                  </div>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-xs">
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400">Correct Chars</div>
                  <div className="text-lg font-bold text-white mt-0.5">
                    {testResult.correctChars}
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400">Errors</div>
                  <div className="text-lg font-bold text-rose-400 mt-0.5">
                    {testResult.errors}
                  </div>
                </div>
                <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                  <div className="text-slate-400">Net WPM</div>
                  <div className="text-lg font-bold text-cyan-400 mt-0.5">
                    {testResult.netWpm}
                  </div>
                </div>
              </div>

              {/* Comparison Callout */}
              <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl text-xs text-slate-300 flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  <span>Historical Average: <strong className="text-white">{testResult.userAvgWpm} WPM</strong></span>
                </div>
                <span className={`font-bold ${testResult.wpm >= testResult.userAvgWpm ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {testResult.wpm >= testResult.userAvgWpm ? `+${testResult.wpm - testResult.userAvgWpm} WPM Faster` : `${testResult.userAvgWpm - testResult.wpm} WPM under`}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={restartTest}
                  className="py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Take Another Test</span>
                </button>
                <button
                  onClick={onBackToDashboard}
                  className="py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition cursor-pointer"
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
