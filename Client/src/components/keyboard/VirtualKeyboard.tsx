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
    <div className="w-full max-w-5xl mx-auto my-3 p-3 bg-slate-950/90 rounded-2xl border border-slate-800/90 shadow-2xl overflow-x-auto">
      {/* Visual Sequence Prompt Header */}
      {expectedKeyPrompt.length > 1 && (
        <div className="flex items-center justify-center gap-2 mb-2 py-1 px-3 bg-blue-950/40 border border-blue-800/50 rounded-lg text-xs">
          <span className="text-slate-400">Phonetic Sequence:</span>
          <div className="flex items-center gap-1 font-mono font-bold">
            {expectedKeyPrompt.split('').map((char, i) => {
              const isDone = i < pendingBuffer.length;
              const isNext = i === pendingBuffer.length;
              return (
                <React.Fragment key={i}>
                  {i > 0 && <span className="text-slate-500">→</span>}
                  <span
                    className={`px-2 py-0.5 rounded text-xs ${
                      isDone
                        ? 'bg-emerald-600 text-white'
                        : isNext
                        ? 'bg-blue-600 text-white ring-2 ring-blue-400 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {char.toUpperCase()}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
          <span className="font-urdu text-base text-amber-300 font-bold ml-2">
            = {currentTargetChar}
          </span>
        </div>
      )}

      {/* Keyboard Matrix */}
      <div className="flex flex-col gap-1.5 min-w-[760px]">
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
      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-2 border-t border-slate-800/80 px-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
          <span>Blue glow indicates current expected key</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7]"></span>
            <span>Pinky</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#06B6D4]"></span>
            <span>Ring</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
            <span>Middle</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6]"></span>
            <span>Index</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
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
      whileTap={{ scale: 0.94, y: 2 }}
      onClick={onClick}
      style={{
        borderBottomColor: isHighlighted ? '#38BDF8' : '#1E293B',
      }}
      className={`
        relative h-12 md:h-13 ${widthClass} rounded-lg select-none cursor-pointer
        flex flex-col justify-between p-1 transition-all duration-150
        ${
          isHighlighted
            ? 'bg-blue-600 text-white ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-950 shadow-lg shadow-blue-500/30 -translate-y-0.5'
            : isPressed
            ? 'bg-slate-700 text-white shadow-inner translate-y-0.5'
            : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 shadow'
        }
      `}
    >
      {/* Top tiny finger indicator bar */}
      <div
        className="absolute top-0 left-1 right-1 h-0.5 rounded-full opacity-60"
        style={{ backgroundColor: fingerColor }}
      />

      {/* Top row: English symbol / Shift symbol */}
      <div className="flex justify-between items-start w-full text-[10px] md:text-[11px] font-semibold opacity-85 leading-tight">
        {showEnglish && (
          <span>
            {isShiftActive && keyInfo.shift ? keyInfo.shift : keyInfo.normal}
          </span>
        )}
        {keyInfo.shift && keyInfo.shift !== keyInfo.normal && !isSpecial && showEnglish && (
          <span className="text-[9px] text-slate-400">{keyInfo.shift}</span>
        )}
      </div>

      {/* Center/Bottom: Urdu character */}
      {showUrdu && (
        <div className="flex justify-center items-center w-full my-auto">
          <span
            className={`font-urdu font-bold leading-none ${
              isSpecial ? 'text-xs' : 'text-base md:text-lg'
            } ${isHighlighted ? 'text-amber-200' : 'text-sky-300'}`}
          >
            {isShiftActive && keyInfo.urduShift ? keyInfo.urduShift : keyInfo.urduNormal}
          </span>
        </div>
      )}
    </motion.button>
  );
};
