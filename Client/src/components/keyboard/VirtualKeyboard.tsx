import React from 'react';
import { KEYBOARD_ROWS, FINGER_CONFIG } from '../../core/keyboardLayout';
import { KeyboardKeyInfo } from '../../types';
import { motion } from 'motion/react';

interface VirtualKeyboardProps {
  currentTargetChar?: string;
  expectedKeyPrompt?: string;
  pendingBuffer?: string;
  activeCode?: string;
  showEnglishLabels?: boolean;
  showUrduLabels?: boolean;
  onVirtualKeyPress?: (key: string) => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  currentTargetChar = '',
  expectedKeyPrompt = '',
  pendingBuffer = '',
  activeCode = '',
  showEnglishLabels = true,
  showUrduLabels = true,
  onVirtualKeyPress,
}) => {
  // Determine which key is expected based on expectedKeyPrompt or currentTargetChar
  const normalizedPrompt = expectedKeyPrompt ? expectedKeyPrompt.toLowerCase() : '';
  const currentExpectedKey =
    pendingBuffer.length > 0 && normalizedPrompt.startsWith(pendingBuffer.toLowerCase())
      ? normalizedPrompt[pendingBuffer.length] // next key in sequence e.g. 'h' in 'sh'
      : normalizedPrompt[0] || '';

  const requiresShift =
    expectedKeyPrompt.length === 1 &&
    expectedKeyPrompt !== expectedKeyPrompt.toLowerCase() &&
    expectedKeyPrompt.toUpperCase() === expectedKeyPrompt;

  return (
    <div className="w-full max-w-5xl mx-auto my-3 p-3.5 neu-card-raised rounded-3xl overflow-x-auto select-none">
      {/* Visual Sequence Prompt Header */}
      {expectedKeyPrompt.length > 1 && (
        <div className="flex items-center justify-center gap-2 mb-3 py-1.5 px-3.5 neu-inset rounded-xl text-xs">
          <span className="text-[#94A3B8]">Phonetic Sequence:</span>
          <div className="flex items-center gap-1 font-mono font-bold">
            {expectedKeyPrompt.split('').map((char, i) => {
              const isDone = i < pendingBuffer.length;
              const isNext = i === pendingBuffer.length;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-[#64748B]">→</span>}
                  <span
                    className={`px-2 py-0.5 rounded-lg text-xs transition-all ${
                      isDone
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : isNext
                        ? 'bg-[#2563EB] text-white ring-2 ring-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.5)] animate-pulse'
                        : 'bg-[#16233A] text-[#94A3B8] border border-white/[0.05]'
                    }`}
                  >
                    {char.toUpperCase()}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          <span className="font-urdu text-lg text-[#FACC15] font-bold ml-2 drop-shadow-[0_2px_4px_rgba(250,204,21,0.3)]">
            = {currentTargetChar}
          </span>
        </div>
      )}

      {/* Keyboard Matrix Tray */}
      <div className="p-2.5 neu-inset rounded-2xl flex flex-col gap-1.5 min-w-[760px]">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-1.5 justify-center">
            {row.map((keyInfo: KeyboardKeyInfo) => {
              const isTargetKey =
                currentExpectedKey &&
                (keyInfo.normal.toLowerCase() === currentExpectedKey.toLowerCase() ||
                  (requiresShift && keyInfo.shift === expectedKeyPrompt));

              const isShiftKey =
                requiresShift &&
                (keyInfo.code === 'ShiftLeft' || keyInfo.code === 'ShiftRight');

              const isSpaceTarget = currentTargetChar === ' ' && keyInfo.code === 'Space';

              const isHighlighted = isTargetKey || isShiftKey || isSpaceTarget;
              const isPressed = activeCode === keyInfo.code;
              const fingerColor = FINGER_CONFIG[keyInfo.finger]?.color || '#64748B';

              return (
                <KeyCap
                  key={keyInfo.code}
                  keyInfo={keyInfo}
                  isHighlighted={isHighlighted}
                  isPressed={isPressed}
                  isShiftActive={requiresShift}
                  fingerColor={fingerColor}
                  showEnglish={showEnglishLabels}
                  showUrdu={showUrduLabels}
                  onClick={() => {
                    if (onVirtualKeyPress) {
                      const toSend = requiresShift && keyInfo.shift ? keyInfo.shift : keyInfo.normal;
                      onVirtualKeyPress(toSend);
                    }
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend / Ergonomic hint */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2.5 border-t border-white/[0.06] px-2 text-[11px] text-[#94A3B8]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse"></span>
          <span>Cyan highlight indicates next required key</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] shadow-sm"></span>
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8] shadow-sm"></span>
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-sm"></span>
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] shadow-sm"></span>
            <span>Index</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FACC15] shadow-sm"></span>
            <span>Thumbs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

interface KeyCapProps {
  keyInfo: KeyboardKeyInfo;
  isHighlighted: boolean;
  isPressed: boolean;
  isShiftActive: boolean;
  fingerColor: string;
  showEnglish: boolean;
  showUrdu: boolean;
  onClick: () => void;
}

const KeyCap: React.FC<KeyCapProps> = ({
  keyInfo,
  isHighlighted,
  isPressed,
  isShiftActive,
  fingerColor,
  showEnglish,
  showUrdu,
  onClick,
}) => {
  const widthClass = keyInfo.width || 'w-10 md:w-12';
  const isSpecial = ['Backspace', 'Tab', 'CapsLock', 'Enter', 'ShiftLeft', 'ShiftRight', 'ControlLeft', 'ControlRight', 'AltLeft', 'AltRight', 'Space'].includes(keyInfo.code);

  return (
    <motion.button
      type="button"
      whileTap={{ y: 3 }}
      onClick={onClick}
      className={`
        relative h-12 md:h-13 ${widthClass} select-none cursor-pointer
        flex flex-col justify-between p-1 rounded-lg transition-all duration-100 neu-keycap
        ${
          isHighlighted
            ? 'key-target ring-2 ring-[#38BDF8]/60 text-white'
            : isPressed
            ? 'key-pressed text-white'
            : 'text-[#F8FAFC]'
        }
      `}
    >
      {/* Top finger indicator accent dot */}
      <div
        className="absolute top-1 left-1.5 w-1.5 h-1.5 rounded-full opacity-70"
        style={{ backgroundColor: fingerColor }}
      />

      {/* Top row: English symbol / Shift symbol */}
      <div className="flex justify-between items-start w-full text-[10px] md:text-[11px] font-semibold opacity-85 leading-tight pl-3">
        {showEnglish && (
          <span className={isHighlighted ? 'text-white' : 'text-[#94A3B8]'}>
            {isShiftActive && keyInfo.shift ? keyInfo.shift : keyInfo.normal}
          </span>
        )}
        {keyInfo.shift && keyInfo.shift !== keyInfo.normal && !isSpecial && showEnglish && (
          <span className="text-[9px] text-[#64748B]">{keyInfo.shift}</span>
        )}
      </div>

      {/* Center/Bottom: Urdu character */}
      {showUrdu && (
        <div className="flex justify-center items-center w-full my-auto">
          <span
            className={`font-urdu font-bold leading-none transition-colors ${
              isSpecial ? 'text-xs' : 'text-base md:text-lg'
            } ${isHighlighted ? 'text-[#FACC15] drop-shadow-[0_1px_4px_rgba(250,204,21,0.5)]' : 'text-[#38BDF8]'}`}
          >
            {isShiftActive && keyInfo.urduShift ? keyInfo.urduShift : keyInfo.urduNormal}
          </span>
        </div>
      )}
    </motion.button>
  );
};
