import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { PhoneticMapper } from '../../core/phoneticEngine';
import { audioEngine } from '../../core/audioEngine';
import { storage } from '../../core/storage';
import confetti from 'canvas-confetti';
import { Timer, Trophy, Flame, RotateCcw, ArrowLeft, CircleDot } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface UrduBubblesProps {
  user: UserProfile;
  settings: AppSettings;
  onBackToGames: () => void;
}

interface Bubble {
  id: number;
  urdu: string;
  roman: string;
  x: number; // %
  y: number; // %
  vx: number;
  vy: number;
  color: string;
  size: number;
}

const BUBBLE_WORDS = [
  { urdu: 'آب', roman: 'ab' },
  { urdu: 'رب', roman: 'rb' },
  { urdu: 'سچ', roman: 'sch' },
  { urdu: 'حق', roman: 'hq' },
  { urdu: 'روشنی', roman: 'roshni' },
  { urdu: 'تارا', roman: 'tara' },
  { urdu: 'پھول', roman: 'phool' },
  { urdu: 'صبح', roman: 'sbh' },
  { urdu: 'ہوا', roman: 'hwa' },
  { urdu: 'چاند', roman: 'chand' },
  { urdu: 'خواب', roman: 'khwab' },
  { urdu: 'قلم', roman: 'qlm' },
];

const BUBBLE_COLORS = [
  'from-blue-500/30 to-cyan-500/40 border-cyan-400',
  'from-purple-500/30 to-pink-500/40 border-pink-400',
  'from-emerald-500/30 to-teal-500/40 border-emerald-400',
  'from-amber-500/30 to-orange-500/40 border-amber-400',
];

export const UrduBubbles: React.FC<UrduBubblesProps> = ({
  user,
  onBackToGames,
}) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [combo, setCombo] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [typedUrdu, setTypedUrdu] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);

  const bubbleIdRef = useRef(0);
  const bubblesRef = useRef<Bubble[]>([]);
  bubblesRef.current = bubbles;

  // Initialize bubbles
  useEffect(() => {
    const initial: Bubble[] = [];
    for (let i = 0; i < 5; i++) {
      const item = BUBBLE_WORDS[i % BUBBLE_WORDS.length];
      initial.push({
        id: ++bubbleIdRef.current,
        urdu: item.urdu,
        roman: item.roman,
        x: 15 + Math.random() * 70,
        y: 15 + Math.random() * 60,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        color: BUBBLE_COLORS[i % BUBBLE_COLORS.length],
        size: 90,
      });
    }
    setBubbles(initial);
  }, []);

  // Float movement & timer loop
  useEffect(() => {
    if (isGameOver) return;

    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          endGame();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const physics = setInterval(() => {
      setBubbles(prev =>
        prev.map(b => {
          let nx = b.x + b.vx;
          let ny = b.y + b.vy;
          let nvx = b.vx;
          let nvy = b.vy;

          if (nx < 8 || nx > 85) nvx = -nvx;
          if (ny < 10 || ny > 75) nvy = -nvy;

          return { ...b, x: nx, y: ny, vx: nvx, vy: nvy };
        })
      );
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(physics);
    };
  }, [isGameOver]);

  const endGame = () => {
    setIsGameOver(true);
    storage.addGameScore({
      id: 'score_bubble_' + Date.now(),
      userId: user.id,
      gameName: 'urdu-bubbles',
      score,
      wpm: Math.round(poppedCount * 3),
      accuracy: 95,
      wordsCompleted: poppedCount,
      bestCombo: combo,
      durationSeconds: 60 - timeLeft,
      createdAt: new Date().toISOString(),
    });

    if (score >= 400) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
    }
  };

  // Typing event listener
  useEffect(() => {
    if (isGameOver) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        setInputBuffer(prev => prev.slice(0, -1));
        const updated = inputBuffer.slice(0, -1);
        setTypedUrdu(PhoneticMapper.transliterate(updated));
        audioEngine.playKeyClick();
        return;
      }

      if (e.key === 'Escape') {
        onBackToGames();
        return;
      }

      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

      const nextRaw = inputBuffer + e.key;
      setInputBuffer(nextRaw);
      const nextUrdu = PhoneticMapper.transliterate(nextRaw);
      setTypedUrdu(nextUrdu);
      audioEngine.playKeyClick();

      // Check if matches any active bubble
      const matchIdx = bubblesRef.current.findIndex(
        b => b.urdu === nextUrdu.trim() || b.urdu === nextRaw.trim()
      );

      if (matchIdx !== -1) {
        // Bubble popped!
        const matched = bubblesRef.current[matchIdx];
        audioEngine.playSuccess();
        setInputBuffer('');
        setTypedUrdu('');

        setCombo(c => c + 1);
        setPoppedCount(p => p + 1);
        setScore(s => s + 75 + combo * 15);

        // Replace bubble with a new one
        const newItem = BUBBLE_WORDS[Math.floor(Math.random() * BUBBLE_WORDS.length)];
        setBubbles(prev => [
          ...prev.filter(b => b.id !== matched.id),
          {
            id: ++bubbleIdRef.current,
            urdu: newItem.urdu,
            roman: newItem.roman,
            x: 15 + Math.random() * 70,
            y: 15 + Math.random() * 60,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            color: BUBBLE_COLORS[Math.floor(Math.random() * BUBBLE_COLORS.length)],
            size: 90,
          },
        ]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputBuffer, isGameOver, combo, onBackToGames]);

  const restartGame = () => {
    setTimeLeft(60);
    setScore(0);
    setCombo(0);
    setPoppedCount(0);
    setInputBuffer('');
    setTypedUrdu('');
    setIsGameOver(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 select-none">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGames}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              <span>Urdu Bubbles</span>
              <span className="font-urdu text-base text-cyan-400">(اردو کے بلبلے)</span>
            </h1>
            <p className="text-xs text-slate-400">
              Pop floating bubbles by typing the phonetic Urdu words!
            </p>
          </div>
        </div>

        {/* Live HUD */}
        <div className="flex items-center gap-4">
          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Timer className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-black text-white">{timeLeft}s</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">{combo}x</span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 mr-2">Score:</span>
            <span className="text-lg font-black text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Floating Bubble Stage */}
      <div className="relative w-full h-[460px] my-4 bg-slate-950/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b22_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {bubbles.map(b => (
          <motion.div
            key={b.id}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
            }}
            className={`absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-gradient-to-br ${b.color} backdrop-blur shadow-xl flex flex-col items-center justify-center cursor-default pointer-events-none`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <span className="font-urdu text-xl font-bold text-white drop-shadow">
              {b.urdu}
            </span>
            <span className="text-[10px] font-mono text-slate-300/80">
              {b.roman}
            </span>
          </motion.div>
        ))}

        {/* Input Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700/80 px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Popper:</span>
          <div className="font-urdu text-xl font-bold text-cyan-300 min-w-[60px] text-center">
            {typedUrdu || <span className="text-slate-600 text-sm">type here...</span>}
          </div>
          {inputBuffer && (
            <span className="font-mono text-xs text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {inputBuffer}
            </span>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-cyan-400 shadow-lg">
                <CircleDot className="w-8 h-8 text-cyan-400" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Time Expired
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Bubble Master!</h2>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Total Score</div>
                  <div className="text-2xl font-black text-white">{score}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Bubbles Popped</div>
                  <div className="text-2xl font-black text-emerald-400">{poppedCount}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={restartGame}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
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
