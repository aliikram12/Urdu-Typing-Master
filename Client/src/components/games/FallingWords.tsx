import React, { useState, useEffect, useRef, useCallback } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { PhoneticMapper } from '../../core/phoneticEngine';
import { audioEngine } from '../../core/audioEngine';
import { storage } from '../../core/storage';
import confetti from 'canvas-confetti';
import { Heart, Trophy, Flame, RotateCcw, ArrowLeft, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FallingWordsProps {
  user: UserProfile;
  settings: AppSettings;
  onBackToGames: () => void;
}

interface WordObject {
  id: number;
  urdu: string;
  romanHint: string;
  x: number; // percentage (10 to 85)
  y: number; // percentage (0 to 100)
  speed: number;
}

const WORD_BANK = [
  { urdu: 'دل', roman: 'dl' },
  { urdu: 'گل', roman: 'gl' },
  { urdu: 'پل', roman: 'pl' },
  { urdu: 'آج', roman: 'aaj' },
  { urdu: 'کل', roman: 'kl' },
  { urdu: 'دن', roman: 'dn' },
  { urdu: 'رات', roman: 'rat' },
  { urdu: 'پانی', roman: 'pani' },
  { urdu: 'روٹی', roman: 'roti' },
  { urdu: 'قلم', roman: 'qlm' },
  { urdu: 'کتاب', roman: 'ktab' },
  { urdu: 'شہر', roman: 'shhr' },
  { urdu: 'باغ', roman: 'bagh' },
  { urdu: 'شام', roman: 'sham' },
  { urdu: 'چاند', roman: 'chand' },
  { urdu: 'ستارہ', roman: 'starh' },
  { urdu: 'ہوا', roman: 'hwa' },
  { urdu: 'سورج', roman: 'sorj' },
  { urdu: 'پاکستان', roman: 'pakstan' },
  { urdu: 'خوش', roman: 'khosh' },
  { urdu: 'محبت', roman: 'mhbt' },
  { urdu: 'روشنی', roman: 'roshni' },
];

export const FallingWords: React.FC<FallingWordsProps> = ({
  user,
  onBackToGames,
}) => {
  const [words, setWords] = useState<WordObject[]>([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [typedUrdu, setTypedUrdu] = useState('');
  const [isGameOver, setIsGameOver] = useState(false);
  const [startTime] = useState(Date.now());

  const wordIdRef = useRef(0);
  const mapperRef = useRef(new PhoneticMapper());
  const wordsRef = useRef<WordObject[]>([]);
  wordsRef.current = words;

  // Spawn new falling word
  const spawnWord = useCallback(() => {
    const randomItem = WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)];
    const newWord: WordObject = {
      id: ++wordIdRef.current,
      urdu: randomItem.urdu,
      romanHint: randomItem.roman,
      x: Math.floor(Math.random() * 65) + 15,
      y: 0,
      speed: 0.28 + Math.min(0.5, wordIdRef.current * 0.015),
    };
    setWords(prev => [...prev, newWord]);
  }, []);

  // Main game tick (60 FPS)
  useEffect(() => {
    if (isGameOver) return;

    // Spawn interval
    const spawnTimer = setInterval(() => {
      if (wordsRef.current.length < 4) {
        spawnWord();
      }
    }, 2400);

    // Physics movement loop
    const moveTimer = setInterval(() => {
      setWords(prevWords => {
        const nextWords: WordObject[] = [];
        let lostLife = false;

        for (const w of prevWords) {
          const nextY = w.y + w.speed;
          if (nextY >= 92) {
            // Word reached bottom!
            lostLife = true;
          } else {
            nextWords.push({ ...w, y: nextY });
          }
        }

        if (lostLife) {
          audioEngine.playError();
          setLives(l => {
            const nextL = l - 1;
            if (nextL <= 0) {
              endGame();
            }
            return nextL;
          });
          setCombo(0);
        }

        return nextWords;
      });
    }, 50);

    return () => {
      clearInterval(spawnTimer);
      clearInterval(moveTimer);
    };
  }, [isGameOver, spawnWord]);

  const endGame = () => {
    setIsGameOver(true);
    const duration = Math.max(1, Math.round((Date.now() - startTime) / 1000));
    const finalWpm = Math.round((wordsCompleted * 4) / (duration / 60));

    storage.addGameScore({
      id: 'score_' + Date.now(),
      userId: user.id,
      gameName: 'falling-words',
      score,
      wpm: finalWpm,
      accuracy: 94,
      wordsCompleted,
      bestCombo: maxCombo,
      durationSeconds: duration,
      createdAt: new Date().toISOString(),
    });

    if (score >= 500) {
      try {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      } catch {
        // Ignored
      }
    }
  };

  // Keyboard handler for typing falling words
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

      // Check if current typedUrdu matches any active falling word
      const matchIndex = wordsRef.current.findIndex(
        w => w.urdu === nextUrdu.trim() || w.urdu === nextRaw.trim()
      );

      if (matchIndex !== -1) {
        // Successful hit!
        const matched = wordsRef.current[matchIndex];
        audioEngine.playSuccess();
        setWords(prev => prev.filter(w => w.id !== matched.id));
        setInputBuffer('');
        setTypedUrdu('');

        setCombo(prev => {
          const next = prev + 1;
          setMaxCombo(m => Math.max(m, next));
          return next;
        });

        const points = 50 + combo * 10;
        setScore(s => s + points);
        setWordsCompleted(c => c + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputBuffer, isGameOver, combo, wordsCompleted, onBackToGames]);

  const restartGame = () => {
    setWords([]);
    setScore(0);
    setLives(3);
    setCombo(0);
    setMaxCombo(0);
    setWordsCompleted(0);
    setInputBuffer('');
    setTypedUrdu('');
    setIsGameOver(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-4 select-none">
      {/* Header bar */}
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
              <span>Falling Urdu Words</span>
              <span className="font-urdu text-base text-blue-400">(گرتے ہوئے الفاظ)</span>
            </h1>
            <p className="text-xs text-slate-400">
              Type each Urdu word phonetically before it reaches the danger zone!
            </p>
          </div>
        </div>

        {/* Live HUD Stats */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition ${
                  i < lives ? 'text-rose-500 fill-rose-500' : 'text-slate-700'
                }`}
              />
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-300">
              {combo}x Combo
            </span>
          </div>

          <div className="bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-xl">
            <span className="text-[11px] text-slate-400 mr-2">Score:</span>
            <span className="text-lg font-black text-white">{score}</span>
          </div>
        </div>
      </div>

      {/* Main Game Stage */}
      <div className="relative w-full h-[460px] my-4 bg-slate-950/90 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        {/* Subtle background grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:32px_32px]"></div>

        {/* Danger zone bottom line */}
        <div className="absolute bottom-12 left-0 right-0 h-1 bg-rose-500/30 border-t border-rose-500/50"></div>
        <div className="absolute bottom-2 left-4 text-[11px] font-bold text-rose-400/80 uppercase tracking-widest flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" />
          <span>Danger Line</span>
        </div>

        {/* Active Falling Words */}
        {words.map(w => (
          <motion.div
            key={w.id}
            style={{
              left: `${w.x}%`,
              top: `${w.y}%`,
            }}
            className="absolute -translate-x-1/2 flex flex-col items-center bg-slate-900/95 border border-blue-500/40 px-4 py-2 rounded-2xl shadow-xl shadow-blue-950/40 backdrop-blur pointer-events-none"
          >
            <span className="font-urdu text-2xl font-bold text-white leading-relaxed">
              {w.urdu}
            </span>
            <span className="text-[10px] font-mono text-slate-400 tracking-wider">
              {w.romanHint}
            </span>
          </motion.div>
        ))}

        {/* Active Typed Input Display */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-slate-900/95 border border-slate-700/80 px-6 py-2 rounded-2xl shadow-2xl flex items-center gap-3">
          <span className="text-xs text-slate-400 font-medium">Your Input:</span>
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
              <div className="w-16 h-16 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center justify-center mx-auto mb-3 text-rose-400 shadow-lg">
                <Trophy className="w-8 h-8 text-amber-400" />
              </div>

              <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                Game Over
              </span>
              <h2 className="text-2xl font-black text-white mt-1">Great Effort!</h2>

              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Final Score</div>
                  <div className="text-2xl font-black text-white">{score}</div>
                </div>
                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                  <div className="text-[11px] text-slate-400">Words Cleared</div>
                  <div className="text-2xl font-black text-emerald-400">{wordsCompleted}</div>
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
