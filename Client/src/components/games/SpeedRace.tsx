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
    <div className="max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="neu-card rounded-2xl p-4 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGames}
            className="neu-btn-secondary p-2.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#F8FAFC] flex items-center gap-2">
              <span>Speed Race</span>
              <span className="font-urdu text-base text-[#FACC15]">(رفتار کی ریس)</span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Outpace the CPU competitor by typing the Urdu text quickly and accurately!
            </p>
          </div>
        </div>

        {/* CPU Difficulty Picker */}
        <div className="flex items-center gap-1.5 neu-segmented-track p-1.5 rounded-2xl">
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
                  ? 'neu-btn-accent text-[#0B1120]'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              {lvl} ({CPU_PACING[lvl]} WPM)
            </button>
          ))}
        </div>
      </div>

      {/* Visual Race Track */}
      <div className="my-4 p-6 neu-inset rounded-3xl relative overflow-hidden bg-[#080D18]">
        {/* Track lane 1: PLAYER */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2 px-1">
            <div className="flex items-center gap-2 font-bold text-[#F8FAFC]">
              <span className="text-[#38BDF8] flex items-center gap-1">
                <span>YOU (Player)</span>
              </span>
              <span className="text-[11px] text-[#64748B]">• {stats.wpm} WPM</span>
            </div>
            <span className="font-black text-[#38BDF8]">{Math.round(playerProgress)}%</span>
          </div>

          <div className="relative w-full h-14 neu-card rounded-2xl flex items-center px-3 border border-slate-700/60">
            {/* Finish Line check */}
            <div className="absolute right-3 top-1 bottom-1 w-3 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#0B1120_4px,#0B1120_8px)] opacity-60 rounded-r-xl" />

            <motion.div
              animate={{ left: `calc(${Math.min(90, playerProgress)}%)` }}
              transition={{ ease: 'easeOut', duration: 0.15 }}
              className="absolute z-10 flex items-center gap-1 -translate-x-1"
            >
              <div className="px-3 py-1.5 bg-[#2563EB] text-white font-black text-xs rounded-xl shadow-[0_4px_12px_rgba(37,99,235,0.6)] flex items-center gap-1.5 border-t border-white/20">
                <span className="text-sm">🚗</span>
                <span className="text-[10px] hidden sm:inline tracking-wider font-extrabold">YOU</span>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Track lane 2: CPU */}
        <div>
          <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2 px-1">
            <div className="flex items-center gap-2 font-bold text-[#94A3B8]">
              <span className="text-[#FACC15]">CPU Opponent ({difficulty})</span>
              <span className="text-[11px] text-[#64748B]">• {CPU_PACING[difficulty]} WPM Pace</span>
            </div>
            <span className="font-black text-[#FACC15]">{Math.round(cpuProgress)}%</span>
          </div>

          <div className="relative w-full h-14 neu-card rounded-2xl flex items-center px-3 border border-slate-700/60">
            {/* Finish Line */}
            <div className="absolute right-3 top-1 bottom-1 w-3 bg-[repeating-linear-gradient(45deg,#fff,#fff_4px,#0B1120_4px,#0B1120_8px)] opacity-60 rounded-r-xl" />

            <motion.div
              animate={{ left: `calc(${Math.min(90, cpuProgress)}%)` }}
              transition={{ ease: 'linear', duration: 0.1 }}
              className="absolute z-10 flex items-center gap-1 -translate-x-1"
            >
              <div className="px-3 py-1.5 bg-[#FACC15] text-[#0B1120] font-black text-xs rounded-xl shadow-[0_4px_12px_rgba(250,204,21,0.5)] flex items-center gap-1.5 border-t border-white/30">
                <span className="text-sm">🚙</span>
                <span className="text-[10px] hidden sm:inline tracking-wider font-black">CPU</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Target Urdu Text Display */}
      <div className="my-4 p-6 neu-card rounded-3xl">
        <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-3">
          <span className="font-medium">Type continuously to boost your speed:</span>
          <div className="flex items-center gap-3">
            <div className="neu-badge-blue px-3 py-1 flex items-center gap-1.5">
              <Gauge className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="font-black text-[#F8FAFC]">{stats.wpm} WPM</span>
            </div>
            <div className="neu-badge-cyan px-3 py-1 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span className="text-[#38BDF8] font-black">{stats.accuracy}% Acc</span>
            </div>
          </div>
        </div>

        <div className="neu-inset p-5 rounded-2xl">
          <div
            dir="rtl"
            className="font-urdu text-2xl md:text-3xl leading-loose tracking-wide text-right selection:bg-transparent py-2"
          >
            {chars.map((item, idx) => {
              let colorClass = 'text-slate-500';
              let bgClass = '';

              if (item.status === 'correct') {
                colorClass = 'text-[#38BDF8]';
              } else if (item.status === 'incorrect') {
                colorClass = 'text-rose-400 underline decoration-rose-500';
              } else if (item.status === 'current') {
                colorClass = 'text-white font-extrabold';
                bgClass = 'bg-[#2563EB]/40 ring-2 ring-[#38BDF8] rounded px-1.5 shadow-[0_0_12px_rgba(56,189,248,0.5)]';
              }

              return (
                <span key={idx} className={`transition-colors duration-100 ${colorClass} ${bgClass}`}>
                  {item.char}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Race Result Modal */}
      <AnimatePresence>
        {isRaceFinished && winner && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neu-card-raised w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center border border-slate-700"
            >
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                  winner === 'player'
                    ? 'bg-[#FACC15]/15 border border-[#FACC15]/40 text-[#FACC15]'
                    : 'neu-inset text-slate-500'
                }`}
              >
                {winner === 'player' ? (
                  <Trophy className="w-8 h-8 text-[#FACC15] animate-bounce" />
                ) : (
                  <Flag className="w-8 h-8 text-slate-400" />
                )}
              </div>

              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                  winner === 'player' ? 'neu-badge-yellow' : 'neu-badge-blue'
                }`}
              >
                {winner === 'player' ? 'Champion!' : 'Race Concluded'}
              </span>
              <h2 className="text-2xl font-black text-[#F8FAFC] mt-2">
                {winner === 'player' ? 'You Won The Race!' : 'CPU Finished First'}
              </h2>

              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="neu-inset p-3.5 rounded-2xl">
                  <div className="text-[11px] text-[#64748B] font-bold uppercase">Your Speed</div>
                  <div className="text-2xl font-black text-[#F8FAFC] mt-0.5">{stats.wpm} WPM</div>
                </div>
                <div className="neu-inset p-3.5 rounded-2xl">
                  <div className="text-[11px] text-[#64748B] font-bold uppercase">Accuracy</div>
                  <div className="text-2xl font-black text-[#38BDF8] mt-0.5">{stats.accuracy}%</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={restartRace}
                  className="neu-btn-accent w-full py-3 rounded-xl text-xs font-black flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Race Again</span>
                </button>
                <button
                  onClick={onBackToGames}
                  className="neu-btn-secondary w-full py-2.5 rounded-xl text-xs font-bold text-[#94A3B8] hover:text-[#F8FAFC] cursor-pointer"
                >
                  Return to Games Hub
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
