import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { useTypingEngine } from '../../hooks/useTypingEngine';
import { storage } from '../../core/storage';
import confetti from 'canvas-confetti';
import { Flag, Trophy, RotateCcw, ArrowLeft, Gauge, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SpeedRaceProps {
  user: UserProfile;
  settings: AppSettings;
  onBackToGames: () => void;
}

const RACE_PASSAGE = 'تیز رفتار اور درست ٹائپنگ انسان کی ذہنی توجہ اور انگلیوں کے تال میل کا شاندار ثبوت ہے۔ ہر روز صرف پندرہ منٹ کی باقاعدہ مشق آپ کو ایک پیشہ ور ٹائپسٹ بنا سکتی ہے۔';

type CpuDifficulty = 'Novice' | 'Pro' | 'Master';

const CPU_PACING: Record<CpuDifficulty, number> = {
  Novice: 26, // WPM
  Pro: 42,
  Master: 58,
};

export const SpeedRace: React.FC<SpeedRaceProps> = ({
  user,
  settings,
  onBackToGames,
}) => {
  const [difficulty, setDifficulty] = useState<CpuDifficulty>('Pro');
  const [cpuProgress, setCpuProgress] = useState(0); // 0 to 100
  const [isRaceFinished, setIsRaceFinished] = useState(false);
  const [winner, setWinner] = useState<'player' | 'cpu' | null>(null);

  const cpuIntervalRef = useRef<number | null>(null);

  const {
    chars,
    currentIndex,
    isStarted,
    progressPercent: playerProgress,
    stats,
    handleKeystroke,
    reset,
  } = useTypingEngine({
    targetText: RACE_PASSAGE,
    strictMode: settings.strictMode,
  });

  // CPU movement based on selected pacing WPM
  useEffect(() => {
    if (isStarted && !isRaceFinished) {
      const targetWpm = CPU_PACING[difficulty];
      const charsPerMinute = targetWpm * 5;
      const totalChars = RACE_PASSAGE.length;
      const totalSeconds = (totalChars / charsPerMinute) * 60;
      const intervalMs = 100;
      const stepPercent = (100 / (totalSeconds * 1000)) * intervalMs;

      cpuIntervalRef.current = window.setInterval(() => {
        setCpuProgress(prev => {
          const next = prev + stepPercent;
          if (next >= 100) {
            finishRace('cpu');
            return 100;
          }
          return next;
        });
      }, intervalMs);
    }
    return () => {
      if (cpuIntervalRef.current) clearInterval(cpuIntervalRef.current);
    };
  }, [isStarted, isRaceFinished, difficulty]);

  // Check if player reaches finish line first
  useEffect(() => {
    if (playerProgress >= 100 && !isRaceFinished) {
      finishRace('player');
    }
  }, [playerProgress, isRaceFinished]);

  const finishRace = (whoWon: 'player' | 'cpu') => {
    setIsRaceFinished(true);
    setWinner(whoWon);
    if (cpuIntervalRef.current) clearInterval(cpuIntervalRef.current);

    if (whoWon === 'player') {
      try {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
    }

    storage.addGameScore({
      id: 'score_race_' + Date.now(),
      userId: user.id,
      gameName: 'speed-race',
      score: whoWon === 'player' ? 1200 : 400,
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      wordsCompleted: Math.round(stats.correctKeypresses / 5),
      bestCombo: whoWon === 'player' ? 1 : 0,
      durationSeconds: stats.elapsedSeconds,
      createdAt: new Date().toISOString(),
    });
  };

  const restartRace = () => {
    setCpuProgress(0);
    setIsRaceFinished(false);
    setWinner(null);
    reset();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGames}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span>Speed Race</span>
              <span className="font-urdu text-base text-amber-400">(رفتار کی ریس)</span>
            </h1>
            <p className="text-xs text-slate-400">
              Outpace the CPU competitor by typing the Urdu text quickly and accurately!
            </p>
          </div>
        </div>

        {/* CPU Difficulty Picker */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1.5 rounded-2xl">
          {(['Novice', 'Pro', 'Master'] as CpuDifficulty[]).map(lvl => (
            <button
              key={lvl}
              disabled={isStarted}
              onClick={() => {
                setDifficulty(lvl);
                restartRace();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                difficulty === lvl
                  ? 'bg-amber-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {lvl} ({CPU_PACING[lvl]} WPM)
            </button>
          ))}
        </div>
      </div>

      {/* Visual Race Track */}
      <div className="my-4 p-5 bg-slate-950/90 border border-slate-800 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Track lane 1: PLAYER */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
            <div className="flex items-center gap-2 font-bold text-white">
              <span className="text-blue-400">YOU (Player)</span>
              <span className="text-[11px] text-slate-500">• {stats.wpm} WPM</span>
            </div>
            <span className="font-bold text-blue-400">{Math.round(playerProgress)}%</span>
          </div>

          <div className="relative w-full h-12 bg-slate-900 rounded-2xl border border-slate-800 flex items-center px-2">
            {/* Finish Line check */}
            <div className="absolute right-3 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-50 rounded-r-xl" />

            <motion.div
              animate={{ left: `calc(${Math.min(92, playerProgress)}%)` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
              className="absolute z-10 flex items-center gap-1 -translate-x-1"
            >
              <div className="px-2 py-1 bg-blue-600 text-white font-black text-xs rounded-lg shadow-lg shadow-blue-600/40 flex items-center gap-1">
                <span>🚗</span>
                <span className="text-[10px] hidden sm:inline">YOU</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Track lane 2: CPU */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1">
            <div className="flex items-center gap-2 font-bold text-slate-300">
              <span className="text-amber-400">CPU Opponent ({difficulty})</span>
              <span className="text-[11px] text-slate-500">• {CPU_PACING[difficulty]} WPM Pace</span>
            </div>
            <span className="font-bold text-amber-400">{Math.round(cpuProgress)}%</span>
          </div>

          <div className="relative w-full h-12 bg-slate-900 rounded-2xl border border-slate-800 flex items-center px-2">
            {/* Finish Line */}
            <div className="absolute right-3 top-0 bottom-0 w-3 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#000_4px,#000_8px)] opacity-50 rounded-r-xl" />

            <motion.div
              animate={{ left: `calc(${Math.min(92, cpuProgress)}%)` }}
              transition={{ ease: 'linear', duration: 0.1 }}
              className="absolute z-10 flex items-center gap-1 -translate-x-1"
            >
              <div className="px-2 py-1 bg-amber-600 text-white font-black text-xs rounded-lg shadow-lg shadow-amber-600/40 flex items-center gap-1">
                <span>🚙</span>
                <span className="text-[10px] hidden sm:inline">CPU</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Target Urdu Text Display */}
      <div className="my-3 p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span>Type fast to boost your speed:</span>
          <div className="flex items-center gap-2">
            <Gauge className="w-4 h-4 text-blue-400" />
            <span className="font-bold text-white">{stats.wpm} WPM</span>
            <span className="text-emerald-400 font-bold ml-2">{stats.accuracy}% Acc</span>
          </div>
        </div>

        <div
          dir="rtl"
          className="font-urdu text-2xl md:text-3xl leading-loose tracking-wide text-right selection:bg-transparent py-2"
        >
          {chars.map((item, idx) => {
            let colorClass = 'text-slate-500';
            let bgClass = '';

            if (item.status === 'correct') {
              colorClass = 'text-emerald-400';
            } else if (item.status === 'incorrect') {
              colorClass = 'text-rose-400 underline';
            } else if (item.status === 'current') {
              colorClass = 'text-white font-extrabold';
              bgClass = 'bg-blue-600/30 ring-2 ring-blue-500 rounded px-1 animate-pulse';
            }

            return (
              <span key={idx} className={`transition-colors duration-100 ${colorClass} ${bgClass}`}>
                {item.char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Race Result Modal */}
      <AnimatePresence>
        {isRaceFinished && winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg ${
                  winner === 'player'
                    ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                    : 'bg-slate-800 border border-slate-700 text-slate-400'
                }`}
              >
                {winner === 'player' ? (
                  <Trophy className="w-8 h-8 text-amber-400 animate-bounce" />
                ) : (
                  <Flag className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wider ${
                  winner === 'player' ? 'text-amber-400' : 'text-slate-400'
                }`}
              >
                {winner === 'player' ? 'Victory!' : 'Race Finished'}
              </span>
              <h2 className="text-2xl font-black text-white mt-1">
                {winner === 'player' ? 'You Won The Race!' : 'CPU Finished First'}
              </h2>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Your Speed</div>
                  <div className="text-2xl font-black text-white">{stats.wpm} WPM</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Accuracy</div>
                  <div className="text-2xl font-black text-emerald-400">{stats.accuracy}%</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={restartRace}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Race Again</span>
                </button>
                <button
                  onClick={onBackToGames}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl text-xs transition cursor-pointer"
                >
                  Change Game
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
