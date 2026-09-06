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
  'from-[#2563EB]/40 to-[#38BDF8]/40 border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.35)]',
  'from-[#FACC15]/30 to-[#FACC15]/20 border-[#FACC15] shadow-[0_0_20px_rgba(250,204,21,0.35)]',
  'from-[#2563EB]/50 to-[#1D4ED8]/60 border-[#60A5FA] shadow-[0_0_20px_rgba(37,99,235,0.35)]',
  'from-[#38BDF8]/30 to-[#2563EB]/30 border-[#38BDF8] shadow-[0_0_20px_rgba(56,189,248,0.4)]',
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
    <div className="max-w-5xl mx-auto px-4 py-6 select-none">
      {/* Top Header */}
      <div className="neu-card rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToGames}
            className="neu-btn-secondary p-2.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-black text-[#F8FAFC] flex items-center gap-2">
              <span>Urdu Bubbles</span>
              <span className="font-urdu text-base text-[#38BDF8]">(اردو کے بلبلے)</span>
            </h1>
            <p className="text-xs text-[#94A3B8]">
              Pop floating bubbles by typing the phonetic Urdu words!
            </p>
          </div>
        </div>

        {/* Live HUD */}
        <div className="flex items-center gap-3">
          <div className="neu-badge-cyan px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#38BDF8]" />
            <span className="text-sm font-black text-[#38BDF8]">{timeLeft}s</span>
          </div>

          <div className="neu-badge-yellow px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-[#FACC15]" />
            <span className="text-xs font-black text-[#FACC15]">{combo}x</span>
          </div>

          <div className="neu-inset px-4 py-1.5 rounded-xl flex items-center gap-2">
            <span className="text-[11px] text-[#64748B] font-bold uppercase">Score</span>
            <span className="text-lg font-black text-[#F8FAFC]">{score}</span>
          </div>
        </div>
      </div>

      {/* Floating Bubble Stage */}
      <div className="relative w-full h-[470px] my-4 neu-inset rounded-3xl overflow-hidden shadow-2xl bg-[#080D18]">
        <div className="absolute inset-0 bg-[radial-gradient(#16233A55_1px,transparent_1px)] bg-[size:24px_24px]"></div>

        {bubbles.map(b => (
          <motion.div
            key={b.id}
            style={{
              left: `${b.x}%`,
              top: `${b.y}%`,
            }}
            className={`absolute w-24 h-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-gradient-to-br ${b.color} backdrop-blur-md flex flex-col items-center justify-center cursor-default pointer-events-none transition-transform`}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
          >
            <span className="font-urdu text-xl font-bold text-[#F8FAFC] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {b.urdu}
            </span>
            <span className="text-[10px] font-mono text-[#F8FAFC]/90 font-bold drop-shadow">
              {b.roman}
            </span>
          </motion.div>
        ))}

        {/* Input Bar */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 neu-card-raised px-7 py-2.5 rounded-2xl flex items-center gap-4 border border-[#38BDF8]/40">
          <span className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Popper:</span>
          <div className="font-urdu text-2xl font-bold text-[#38BDF8] min-w-[70px] text-center">
            {typedUrdu || <span className="text-[#64748B] text-sm font-sans">Type here...</span>}
          </div>
          {inputBuffer && (
            <span className="font-mono text-xs text-[#FACC15] bg-[#0B1120] border border-slate-700/60 px-2.5 py-1 rounded-lg neu-inset">
              {inputBuffer}
            </span>
          )}
        </div>
      </div>

      {/* Game Over Modal */}
      <AnimatePresence>
        {isGameOver && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="neu-card-raised w-full max-w-sm rounded-3xl p-6 shadow-2xl text-center border border-slate-700"
            >
              <div className="w-16 h-16 bg-[#38BDF8]/10 border border-[#38BDF8]/30 rounded-2xl flex items-center justify-center mx-auto mb-4 text-[#38BDF8] shadow-lg">
                <CircleDot className="w-8 h-8 text-[#38BDF8]" />
              </div>

              <span className="neu-badge-cyan text-xs font-bold uppercase tracking-wider px-3 py-1">
                Time Expired
              </span>
              <h2 className="text-2xl font-black text-[#F8FAFC] mt-2">Bubble Master!</h2>

              <div className="grid grid-cols-2 gap-3 my-5">
                <div className="neu-inset p-3.5 rounded-2xl">
                  <div className="text-[11px] text-[#64748B] font-bold uppercase">Total Score</div>
                  <div className="text-2xl font-black text-[#F8FAFC] mt-0.5">{score}</div>
                </div>
                <div className="neu-inset p-3.5 rounded-2xl">
                  <div className="text-[11px] text-[#64748B] font-bold uppercase">Bubbles Popped</div>
                  <div className="text-2xl font-black text-[#38BDF8] mt-0.5">{poppedCount}</div>
                </div>
              </div>

              <div className="flex flex-col gap-2.5">
                <button
                  onClick={restartGame}
                  className="neu-btn-primary w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
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
