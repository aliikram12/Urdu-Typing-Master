import React, { useState, useEffect } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { URDU_TO_ENGLISH_MAP, PhoneticMapper } from '../../core/phoneticEngine';
import { getFingerForUrduChar } from '../../core/keyboardLayout';
import { HandGuide } from '../keyboard/HandGuide';
import { VirtualKeyboard } from '../keyboard/VirtualKeyboard';
import { audioEngine } from '../../core/audioEngine';
import confetti from 'canvas-confetti';
import { ArrowLeft, CheckCircle2, RotateCcw, Sparkles, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LearnKeyboardPageProps {
  user: UserProfile;
  settings: AppSettings;
  onBack: () => void;
}

interface LetterDrillItem {
  urdu: string;
  name: string;
  keyPrompt: string;
  category: string;
  description: string;
}

const URDU_LETTERS: LetterDrillItem[] = [
  { urdu: 'ا', name: 'Alif (الف)', keyPrompt: 'a', category: 'Vowel', description: 'Left Pinky on A key' },
  { urdu: 'آ', name: 'Alif Madda (آ)', keyPrompt: 'A', category: 'Vowel', description: 'Shift + A or type "aa"' },
  { urdu: 'ب', name: 'Bay (بے)', keyPrompt: 'b', category: 'Consonant', description: 'Left Index on B key' },
  { urdu: 'پ', name: 'Pay (پے)', keyPrompt: 'p', category: 'Consonant', description: 'Right Pinky on P key' },
  { urdu: 'ت', name: 'Tay (تے)', keyPrompt: 't', category: 'Consonant', description: 'Left Index on T key' },
  { urdu: 'ٹ', name: 'Ttaye (ٹے)', keyPrompt: 'T', category: 'Consonant', description: 'Shift + T with Left Index' },
  { urdu: 'ث', name: 'Say (ثے)', keyPrompt: 'C', category: 'Consonant', description: 'Shift + C with Left Middle' },
  { urdu: 'ج', name: 'Jeem (جیم)', keyPrompt: 'j', category: 'Consonant', description: 'Right Index on J key' },
  { urdu: 'چ', name: 'Chay (چے)', keyPrompt: 'c', category: 'Consonant', description: 'Left Middle on C key or "ch"' },
  { urdu: 'ح', name: 'Bari Hay (حے)', keyPrompt: 'H', category: 'Consonant', description: 'Shift + H with Right Index' },
  { urdu: 'خ', name: 'Khay (خے)', keyPrompt: 'kh', category: 'Consonant', description: 'Type K then H or Shift+K' },
  { urdu: 'د', name: 'Daal (دال)', keyPrompt: 'd', category: 'Consonant', description: 'Left Middle on D key' },
  { urdu: 'ڈ', name: 'Ddaal (ڈال)', keyPrompt: 'D', category: 'Consonant', description: 'Shift + D with Left Middle' },
  { urdu: 'ذ', name: 'Zaal (ذال)', keyPrompt: 'Z', category: 'Consonant', description: 'Shift + Z with Left Pinky' },
  { urdu: 'ر', name: 'Ray (رے)', keyPrompt: 'r', category: 'Consonant', description: 'Left Index on R key' },
  { urdu: 'ڑ', name: 'Rray (ڑے)', keyPrompt: 'R', category: 'Consonant', description: 'Shift + R with Left Index' },
  { urdu: 'ز', name: 'Zay (زے)', keyPrompt: 'z', category: 'Consonant', description: 'Left Pinky on Z key' },
  { urdu: 'ژ', name: 'Zhay (ژے)', keyPrompt: 'X', category: 'Consonant', description: 'Shift + X or type "zh"' },
  { urdu: 'س', name: 'Seen (سین)', keyPrompt: 's', category: 'Consonant', description: 'Left Ring on S key' },
  { urdu: 'ش', name: 'Sheen (شین)', keyPrompt: 'sh', category: 'Consonant', description: 'Type S then H or press X' },
  { urdu: 'ص', name: 'Suad (صاد)', keyPrompt: 'S', category: 'Consonant', description: 'Shift + S with Left Ring' },
  { urdu: 'ض', name: 'Zwad (ضاد)', keyPrompt: 'J', category: 'Consonant', description: 'Shift + J with Right Index' },
  { urdu: 'ط', name: 'Toay (طوئے)', keyPrompt: 'v', category: 'Consonant', description: 'Left Index on V key' },
  { urdu: 'ظ', name: 'Zoay (ظوئے)', keyPrompt: 'V', category: 'Consonant', description: 'Shift + V with Left Index' },
  { urdu: 'ع', name: 'Ain (عین)', keyPrompt: 'e', category: 'Consonant', description: 'Left Middle on E key' },
  { urdu: 'غ', name: 'Ghain (غین)', keyPrompt: 'gh', category: 'Consonant', description: 'Type G then H or Shift+G' },
  { urdu: 'ف', name: 'Fay (فے)', keyPrompt: 'f', category: 'Consonant', description: 'Left Index on F key' },
  { urdu: 'ق', name: 'Qaaf (قاف)', keyPrompt: 'q', category: 'Consonant', description: 'Left Pinky on Q key' },
  { urdu: 'ک', name: 'Kaaf (کاف)', keyPrompt: 'k', category: 'Consonant', description: 'Right Middle on K key' },
  { urdu: 'گ', name: 'Gaaf (گاف)', keyPrompt: 'g', category: 'Consonant', description: 'Left Index on G key' },
  { urdu: 'ل', name: 'Laam (لام)', keyPrompt: 'l', category: 'Consonant', description: 'Right Ring on L key' },
  { urdu: 'م', name: 'Meem (میم)', keyPrompt: 'm', category: 'Consonant', description: 'Right Index on M key' },
  { urdu: 'ن', name: 'Noon (نون)', keyPrompt: 'n', category: 'Consonant', description: 'Right Index on N key' },
  { urdu: 'ں', name: 'Noon Ghunna (ں)', keyPrompt: 'N', category: 'Diacritic', description: 'Shift + N with Right Index' },
  { urdu: 'و', name: 'Wao (واؤ)', keyPrompt: 'w', category: 'Vowel', description: 'Left Ring on W key' },
  { urdu: 'ہ', name: 'Choti Hay (ہ)', keyPrompt: 'h', category: 'Consonant', description: 'Right Index on H key' },
  { urdu: 'ھ', name: 'Do Chashmi Hay (ھ)', keyPrompt: 'O', category: 'Aspirated', description: 'Shift + O with Right Ring' },
  { urdu: 'ء', name: 'Hamza (ہمزہ)', keyPrompt: 'u', category: 'Diacritic', description: 'Right Index on U key' },
  { urdu: 'ی', name: 'Choti Yay (چھوٹی یے)', keyPrompt: 'i', category: 'Vowel', description: 'Right Middle on I key' },
  { urdu: 'ے', name: 'Bari Yay (بڑی یے)', keyPrompt: 'y', category: 'Vowel', description: 'Right Index on Y key' },
];

export const LearnKeyboardPage: React.FC<LearnKeyboardPageProps> = ({
  settings,
  onBack,
}) => {
  const [index, setIndex] = useState(0);
  const [inputBuffer, setInputBuffer] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const currentItem = URDU_LETTERS[index];
  const finger = getFingerForUrduChar(currentItem.urdu);

  // Keyboard handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setIndex(i => Math.min(URDU_LETTERS.length - 1, i + 1));
        setInputBuffer('');
        setIsSuccess(false);
        return;
      }
      if (e.key === 'ArrowLeft') {
        setIndex(i => Math.max(0, i - 1));
        setInputBuffer('');
        setIsSuccess(false);
        return;
      }
      if (e.key === 'Escape') {
        onBack();
        return;
      }

      if (e.key.length !== 1 || e.ctrlKey || e.altKey || e.metaKey) return;

      const nextRaw = inputBuffer + e.key;
      setInputBuffer(nextRaw);

      const isMatch =
        PhoneticMapper.matchesTarget(nextRaw, currentItem.urdu) ||
        PhoneticMapper.matchesTarget(e.key, currentItem.urdu);

      if (isMatch) {
        audioEngine.playSuccess();
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          setInputBuffer('');
          setIndex(i => (i + 1) % URDU_LETTERS.length);
        }, 600);
      } else if (nextRaw.length >= 2) {
        audioEngine.playError();
        setInputBuffer('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [index, inputBuffer, currentItem, onBack]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="neu-card rounded-2xl p-4 mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="neu-btn-secondary p-2.5 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider neu-badge-blue px-2.5 py-0.5 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
              <span>Beginner Drill</span>
            </div>
            <h1 className="text-xl font-black text-[#F8FAFC]">Learn the Urdu Keys</h1>
          </div>
        </div>

        {/* Counter */}
        <div className="neu-inset px-3 py-1.5 rounded-xl text-xs text-[#94A3B8]">
          Letter <strong className="text-[#38BDF8] font-black">{index + 1}</strong> of {URDU_LETTERS.length}
        </div>
      </div>

      {/* Main Flashcard Display */}
      <div className="my-6 p-8 neu-card-raised rounded-3xl flex flex-col items-center text-center relative overflow-hidden">
        {/* Category tag */}
        <span className="neu-badge-cyan text-xs uppercase font-black tracking-widest px-3.5 py-1 mb-3">
          {currentItem.category}
        </span>

        {/* Large Urdu Character */}
        <motion.div
          key={currentItem.urdu}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`font-urdu text-8xl md:text-9xl my-3 drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] transition-colors duration-200 ${
            isSuccess ? 'text-emerald-400' : 'text-[#38BDF8]'
          }`}
        >
          {currentItem.urdu}
        </motion.div>

        {/* Letter name in Urdu & English */}
        <h2 className="text-2xl font-black text-[#F8FAFC] mt-1">
          {currentItem.name}
        </h2>

        {/* Keystroke prompt badge with 3D mechanical keycap */}
        <div className="mt-5 flex items-center gap-3 neu-inset px-6 py-3 rounded-2xl">
          <span className="text-xs text-[#94A3B8] font-bold uppercase tracking-wider">Press on keyboard:</span>
          <div className="neu-keycap px-4 py-1.5 rounded-xl text-base font-black text-[#FACC15] border-t border-white/20">
            {currentItem.keyPrompt.toUpperCase()}
          </div>
        </div>

        <p className="text-xs text-[#94A3B8] mt-4 max-w-sm leading-relaxed">
          {currentItem.description}
        </p>

        {/* Success feedback pill */}
        {isSuccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="mt-4 flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-4 py-1.5 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Shabash! Correct! (شاباش! درست جواب)</span>
          </motion.div>
        )}

        {/* Prev / Next buttons */}
        <div className="flex items-center gap-4 mt-8">
          <button
            onClick={() => {
              setIndex(i => Math.max(0, i - 1));
              setInputBuffer('');
              setIsSuccess(false);
            }}
            disabled={index === 0}
            className="neu-btn-secondary p-3 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setIndex(i => Math.min(URDU_LETTERS.length - 1, i + 1));
              setInputBuffer('');
              setIsSuccess(false);
            }}
            disabled={index === URDU_LETTERS.length - 1}
            className="neu-btn-secondary p-3 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] disabled:opacity-30 transition cursor-pointer"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Hand Guide */}
      <HandGuide
        activeFinger={finger}
        expectedChar={currentItem.urdu}
        expectedKeyPrompt={currentItem.keyPrompt}
        visible={settings.showHandGuide}
      />

      {/* Virtual Keyboard */}
      {settings.showVirtualKeyboard && (
        <VirtualKeyboard
          currentTargetChar={currentItem.urdu}
          expectedKeyPrompt={currentItem.keyPrompt}
          pendingBuffer={inputBuffer}
          showEnglishLabels={settings.showEnglishLabels}
          showUrduLabels={settings.showUrduLabels}
        />
      )}
    </div>
  );
};
