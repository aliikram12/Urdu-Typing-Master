import React, { useState, useEffect } from 'react';
import { Lesson, UserProfile, AppSettings } from '../../types';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import { HandGuide } from '../keyboard/HandGuide';
import { storage } from '../../core/storage';
import { api } from '../../core/api';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  Pause,
  Play,
  ArrowRight,
  ArrowLeft,
  Trophy,
  CheckCircle2,
  Clock,
  Gauge,
  Target,
  AlertCircle,
  HelpCircle,
  Keyboard,
  Hand
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LessonPageProps {
  lesson: Lesson;
  user: UserProfile;
  settings: AppSettings;
  onNextLesson?: () => void;
  onBackToLessons: () => void;
  onUpdateSettings?: (settings: AppSettings) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({
  lesson,
  user,
  settings,
  onNextLesson,
  onBackToLessons,
}) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedStats, setCompletedStats] = useState<{
    wpm: number;
    netWpm: number;
    accuracy: number;
    errors: number;
    durationSeconds: number;
    isNewBest: boolean;
  } | null>(null);

  const [showKeyboard, setShowKeyboard] = useState(settings.showVirtualKeyboard);
  const [showHand, setShowHand] = useState(settings.showHandGuide);
  const [showTips, setShowTips] = useState(false);

  const currentLineText = lesson.content[currentLineIndex] || '';

  // Hook for typing engine
  const {
    chars,
    currentIndex,
    currentTargetChar,
    currentFinger,
    expectedPrompt,
    pendingBuffer,
    isPaused,
    isCompleted,
    progressPercent,
    stats,
    handleKeystroke,
    togglePause,
    reset,
  } = useTypingEngine({
    targetText: currentLineText,
    strictMode: settings.strictMode,
    onKeyCorrect: (char, latency) => {
      const prompt = expectedPrompt || char;
      storage.recordKeyStat(user.id, prompt, char, true, latency);
    },
    onKeyError: (char) => {
      const prompt = expectedPrompt || char;
      storage.recordKeyStat(user.id, prompt, char, false, 450);
    },
    onComplete: (lineStats) => {
      if (currentLineIndex < lesson.content.length - 1) {
        // Move to next line in the lesson
        setTimeout(() => {
          setCurrentLineIndex(prev => prev + 1);
        }, 300);
      } else {
        // Entire lesson finished!
        const existingProgress = storage.getLessonProgress(user.id)[lesson.id];
        const prevBestWpm = existingProgress?.bestWpm || 0;
        const isNewBest = lineStats.wpm > prevBestWpm;

        // Save progress to database
        storage.saveLessonProgress(user.id, lesson.id, lineStats.wpm, lineStats.accuracy);
        storage.addSession({
          id: 'sess_' + Date.now(),
          userId: user.id,
          mode: 'lesson',
          lessonId: lesson.id,
          lessonTitle: lesson.title,
          wpm: lineStats.wpm,
          netWpm: lineStats.netWpm,
          accuracy: lineStats.accuracy,
          totalCharacters: lineStats.totalChars,
          correctCharacters: lineStats.correctChars,
          incorrectCharacters: lineStats.errors,
          durationSeconds: lineStats.durationSeconds,
          averageLatencyMs: lineStats.averageLatencyMs,
          createdAt: new Date().toISOString(),
        });

        // Persist to MongoDB History collection
        const token = localStorage.getItem('auth_token');
        if (token) {
          api.saveHistory(token, {
            activityType: 'lesson',
            title: lesson.title,
            titleUrdu: lesson.titleUrdu || '',
            score: lineStats.wpm,
            netScore: lineStats.netWpm,
            total: lineStats.totalChars,
            percentage: lineStats.accuracy,
            errors: lineStats.errors,
            durationSeconds: lineStats.durationSeconds,
            status: lineStats.accuracy >= 85 ? 'Passed' : 'Completed',
          }).catch(err => console.error('Failed to save lesson to database', err));
        }

        setCompletedStats({
          wpm: lineStats.wpm,
          netWpm: lineStats.netWpm,
          accuracy: lineStats.accuracy,
          errors: lineStats.errors,
          durationSeconds: lineStats.durationSeconds,
          isNewBest,
        });

        setShowCompletionModal(true);

        // Confetti explosion
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch {
          // Ignored
        }
      }
    },
  });

  // Handle keyboard shortcuts (Ctrl+R, Ctrl+P, Esc)
  useEffect(() => {
    const handleShortcuts = (e: KeyboardEvent) => {
      if (e.ctrlKey && (e.key === 'r' || e.key === 'R')) {
        e.preventDefault();
        setCurrentLineIndex(0);
        reset();
      } else if (e.ctrlKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        togglePause();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onBackToLessons();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [reset, togglePause, onBackToLessons]);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col min-h-full max-w-6xl mx-auto px-4 py-3 relative select-none">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLessons}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
            title="Back to Lessons (Esc)"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Lesson {lesson.id.toString().padStart(2, '0')} • {lesson.difficulty}
              </span>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full border border-slate-700">
                {lesson.category}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-white flex items-center gap-2 mt-0.5">
              <span>{lesson.title}</span>
              <span className="font-urdu text-lg text-slate-400">({lesson.titleUrdu})</span>
            </h1>
          </div>
        </div>

        {/* View toggles & Controls */}
        <div className="flex items-center gap-2">
          {lesson.tips && (
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition ${
                showTips
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </button>
          )}

          <button
            onClick={() => setShowHand(!showHand)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition ${
              showHand
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Hand Guide"
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">Hand Guide</span>
          </button>

          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 border transition ${
              showKeyboard
                ? 'bg-blue-600/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
            title="Toggle Virtual Keyboard"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>

          <button
            onClick={togglePause}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title={isPaused ? 'Resume (Ctrl+P)' : 'Pause (Ctrl+P)'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              setCurrentLineIndex(0);
              reset();
            }}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition"
            title="Restart Lesson (Ctrl+R)"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tips Dropdown */}
      <AnimatePresence>
        {showTips && lesson.tips && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="my-2 p-3 bg-amber-950/30 border border-amber-800/40 rounded-xl text-amber-200 text-xs flex items-start gap-2"
          >
            <HelpCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Instructor Tip: </span>
              {lesson.tips}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Performance HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Speed</div>
            <div className="text-xl font-extrabold text-white">
              {stats.wpm} <span className="text-xs font-normal text-slate-400">WPM</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Accuracy</div>
            <div className="text-xl font-extrabold text-emerald-400">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 text-rose-400 rounded-lg">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Errors</div>
            <div className="text-xl font-extrabold text-rose-400">
              {stats.incorrectKeypresses}
            </div>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-xl flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Time</div>
            <div className="text-xl font-extrabold text-purple-300">
              {formatTime(stats.elapsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Target Urdu Typing Display */}
      <div className="my-2 p-6 md:p-8 bg-slate-900/90 border border-slate-800/90 rounded-2xl shadow-xl flex flex-col items-center justify-center relative min-h-[160px]">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center z-20">
            <Pause className="w-10 h-10 text-blue-400 animate-bounce mb-2" />
            <h2 className="text-lg font-bold text-white">Lesson Paused</h2>
            <p className="text-xs text-slate-400 mt-1">Press Ctrl+P or click resume to continue</p>
            <button
              onClick={togglePause}
              className="mt-3 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-semibold text-xs transition"
            >
              Resume Practice
            </button>
          </div>
        )}

        {/* Line Navigation Indicator */}
        <div className="w-full flex items-center justify-between text-xs text-slate-400 mb-3 px-1">
          <span className="font-semibold text-slate-500 uppercase tracking-wider">
            Line {currentLineIndex + 1} of {lesson.content.length}
          </span>
          {expectedPrompt && (
            <div className="flex items-center gap-1.5 bg-blue-950/70 border border-blue-800/60 px-3 py-1 rounded-full text-blue-200">
              <span>Next keystroke:</span>
              <span className="font-mono font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded text-xs">
                {expectedPrompt.toUpperCase()}
              </span>
              {currentTargetChar && (
                <span className="font-urdu font-bold text-amber-300 text-sm">
                  ({currentTargetChar})
                </span>
              )}
            </div>
          )}
        </div>

        {/* Interactive Text Display (RTL) */}
        <div
          dir="rtl"
          className="w-full font-urdu text-3xl md:text-5xl leading-loose tracking-wide text-right selection:bg-transparent py-4 px-2"
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
                {item.char === ' ' ? ' ' : item.char}
              </span>
            );
          })}
        </div>

        {/* Progress Bar for Current Line */}
        <div className="w-full mt-4 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <motion.div
            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
            animate={{ width: `${progressPercent}%` }}
            transition={{ ease: 'easeOut', duration: 0.2 }}
          />
        </div>
      </div>

      {/* Hand Guide */}
      <HandGuide
        activeFinger={currentFinger}
        expectedChar={currentTargetChar}
        expectedKeyPrompt={expectedPrompt}
        visible={showHand}
      />

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

      {/* Lesson Complete Modal */}
      <AnimatePresence>
        {showCompletionModal && completedStats && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl text-center relative overflow-hidden"
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-blue-500/20 blur-xl rounded-full"></div>

              <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-blue-400 shadow-lg">
                <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Lesson Complete!
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {lesson.title}
              </h2>
              <p className="text-xs text-slate-400 font-urdu mt-0.5">
                مبارک ہو! آپ نے یہ سبق کامیابی سے مکمل کر لیا ہے۔
              </p>

              {completedStats.isNewBest && (
                <div className="inline-block my-2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-amber-300 font-semibold text-xs animate-pulse">
                  ⭐ New Personal Best WPM!
                </div>
              )}

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400 font-medium">Speed</div>
                  <div className="text-2xl font-black text-white">
                    {completedStats.wpm}{' '}
                    <span className="text-xs text-slate-400 font-normal">WPM</span>
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400 font-medium">Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {completedStats.accuracy}%
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400 font-medium">Errors</div>
                  <div className="text-2xl font-black text-rose-400">
                    {completedStats.errors}
                  </div>
                </div>

                <div className="bg-slate-950/70 border border-slate-800/80 p-3 rounded-2xl text-center">
                  <div className="text-[11px] text-slate-400 font-medium">Time Taken</div>
                  <div className="text-2xl font-black text-purple-300">
                    {formatTime(completedStats.durationSeconds)}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 mt-4">
                {onNextLesson && (
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onNextLesson();
                    }}
                    className="w-full py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-xl shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    <span>Next Lesson</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      setCurrentLineIndex(0);
                      reset();
                    }}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onBackToLessons();
                    }}
                    className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition"
                  >
                    Back to Curriculum
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
