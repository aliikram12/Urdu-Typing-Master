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
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToLessons}
            className="neu-btn-secondary p-2.5 rounded-xl transition cursor-pointer"
            title="Back to Lessons (Esc)"
          >
            <ArrowLeft className="w-4 h-4 text-[#38BDF8]" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                Lesson {lesson.id.toString().padStart(2, '0')} • {lesson.difficulty}
              </span>
              <span className="text-[11px] neu-badge-blue px-2 py-0.5 rounded-full font-semibold">
                {lesson.category}
              </span>
            </div>
            <h1 className="text-lg md:text-xl font-bold text-[#F8FAFC] flex items-center gap-2 mt-0.5">
              <span>{lesson.title}</span>
              <span className="font-urdu text-lg text-[#FACC15]">({lesson.titleUrdu})</span>
            </h1>
          </div>
        </div>

        {/* View toggles & Controls */}
        <div className="flex items-center gap-2">
          {lesson.tips && (
            <button
              onClick={() => setShowTips(!showTips)}
              className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer ${
                showTips
                  ? 'neu-badge-yellow shadow-sm font-bold'
                  : 'neu-btn-secondary text-[#94A3B8]'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Tips</span>
            </button>
          )}

          <button
            onClick={() => setShowHand(!showHand)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer ${
              showHand
                ? 'neu-btn-primary font-bold shadow-sm'
                : 'neu-btn-secondary text-[#94A3B8]'
            }`}
            title="Toggle Hand Guide"
          >
            <Hand className="w-4 h-4" />
            <span className="hidden sm:inline">Hand Guide</span>
          </button>

          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className={`p-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer ${
              showKeyboard
                ? 'neu-btn-primary font-bold shadow-sm'
                : 'neu-btn-secondary text-[#94A3B8]'
            }`}
            title="Toggle Virtual Keyboard"
          >
            <Keyboard className="w-4 h-4" />
            <span className="hidden sm:inline">Keyboard</span>
          </button>

          <button
            onClick={togglePause}
            className="neu-btn-secondary p-2 rounded-xl transition cursor-pointer"
            title={isPaused ? 'Resume (Ctrl+P)' : 'Pause (Ctrl+P)'}
          >
            {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4 text-[#38BDF8]" />}
          </button>

          <button
            onClick={() => {
              setCurrentLineIndex(0);
              reset();
            }}
            className="neu-btn-secondary p-2 rounded-xl transition cursor-pointer"
            title="Restart Lesson (Ctrl+R)"
          >
            <RotateCcw className="w-4 h-4 text-[#94A3B8] hover:text-[#F8FAFC]" />
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
            className="my-2 p-3.5 neu-badge-yellow rounded-2xl text-xs flex items-start gap-2 shadow-sm"
          >
            <HelpCircle className="w-4 h-4 text-[#FACC15] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Instructor Tip: </span>
              {lesson.tips}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Performance HUD */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-3">
        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 rounded-xl shadow-sm">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Speed</div>
            <div className="text-xl font-extrabold text-[#F8FAFC]">
              {stats.wpm} <span className="text-xs font-normal text-[#94A3B8]">WPM</span>
            </div>
          </div>
        </div>

        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-xl shadow-sm">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Accuracy</div>
            <div className="text-xl font-extrabold text-emerald-400">
              {stats.accuracy}%
            </div>
          </div>
        </div>

        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-rose-500/15 text-rose-400 border border-rose-500/30 rounded-xl shadow-sm">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Errors</div>
            <div className="text-xl font-extrabold text-rose-400">
              {stats.incorrectKeypresses}
            </div>
          </div>
        </div>

        <div className="neu-card p-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 rounded-xl shadow-sm">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#94A3B8] uppercase tracking-wider">Time</div>
            <div className="text-xl font-extrabold text-[#FACC15]">
              {formatTime(stats.elapsedSeconds)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Target Urdu Typing Display (Deep Sunken Inset Arena) */}
      <div className="my-2 p-6 md:p-8 neu-inset rounded-3xl flex flex-col items-center justify-center relative min-h-[160px] shadow-[inset_2px_4px_12px_rgba(0,0,0,0.8)]">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-[#0B1120]/90 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center z-20">
            <Pause className="w-10 h-10 text-[#38BDF8] animate-bounce mb-2" />
            <h2 className="text-lg font-bold text-[#F8FAFC]">Lesson Paused</h2>
            <p className="text-xs text-[#94A3B8] mt-1">Press Ctrl+P or click resume to continue</p>
            <button
              onClick={togglePause}
              className="neu-btn-primary mt-3 px-5 py-2 rounded-xl font-semibold text-xs transition cursor-pointer"
            >
              Resume Practice
            </button>
          </div>
        )}

        {/* Line Navigation Indicator */}
        <div className="w-full flex items-center justify-between text-xs text-[#94A3B8] mb-3 px-1">
          <span className="font-semibold text-[#64748B] uppercase tracking-wider">
            Line {currentLineIndex + 1} of {lesson.content.length}
          </span>
          {expectedPrompt && (
            <div className="flex items-center gap-2 bg-[#111C31] border border-white/[0.08] px-3.5 py-1.5 rounded-full shadow-sm">
              <span className="text-[#94A3B8]">Next key:</span>
              <span className="font-mono font-bold bg-[#2563EB] text-white px-2 py-0.5 rounded text-xs shadow-sm">
                {expectedPrompt.toUpperCase()}
              </span>
              {currentTargetChar && (
                <span className="font-urdu font-bold text-[#FACC15] text-base drop-shadow-[0_1px_4px_rgba(250,204,21,0.4)]">
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
                {item.char === ' ' ? ' ' : item.char}
              </span>
            );
          })}
        </div>

        {/* Progress Bar for Current Line */}
        <div className="w-full mt-4 bg-[#0B1120] h-2.5 rounded-full overflow-hidden border border-white/[0.06] shadow-inner">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.5)]"
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neu-card-raised w-full max-w-md rounded-3xl p-6 md:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
            >
              {/* Decorative top glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-10 bg-[#2563EB]/25 blur-xl rounded-full"></div>

              <div className="w-16 h-16 bg-[#FACC15]/15 border border-[#FACC15]/30 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Trophy className="w-8 h-8 text-[#FACC15] animate-bounce" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                Lesson Complete!
              </span>
              <h2 className="text-2xl font-black text-[#F8FAFC] mt-1">
                {lesson.title}
              </h2>
              <p className="text-sm text-[#FACC15] font-urdu mt-0.5">
                مبارک ہو! آپ نے یہ سبق کامیابی سے مکمل کر لیا ہے۔
              </p>

              {completedStats.isNewBest && (
                <div className="inline-block my-2 px-3 py-1 neu-badge-yellow rounded-full font-bold text-xs animate-pulse">
                  ⭐ New Personal Best WPM!
                </div>
              )}

              {/* Stats Summary Grid */}
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="neu-inset p-3.5 rounded-2xl text-center">
                  <div className="text-[11px] text-[#94A3B8] font-medium">Speed</div>
                  <div className="text-2xl font-black text-[#F8FAFC]">
                    {completedStats.wpm}{' '}
                    <span className="text-xs font-normal text-[#94A3B8]">WPM</span>
                  </div>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl text-center">
                  <div className="text-[11px] text-[#94A3B8] font-medium">Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400">
                    {completedStats.accuracy}%
                  </div>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl text-center">
                  <div className="text-[11px] text-[#94A3B8] font-medium">Errors</div>
                  <div className="text-2xl font-black text-rose-400">
                    {completedStats.errors}
                  </div>
                </div>

                <div className="neu-inset p-3.5 rounded-2xl text-center">
                  <div className="text-[11px] text-[#94A3B8] font-medium">Time Taken</div>
                  <div className="text-2xl font-black text-[#FACC15]">
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
                    className="neu-btn-accent w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition cursor-pointer"
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
                    className="neu-btn-secondary py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry</span>
                  </button>
                  <button
                    onClick={() => {
                      setShowCompletionModal(false);
                      onBackToLessons();
                    }}
                    className="neu-btn-secondary py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer"
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
