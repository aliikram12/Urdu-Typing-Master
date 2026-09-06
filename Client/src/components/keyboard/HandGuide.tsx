import React from 'react';
import { FingerType } from '../../types';
import { FINGER_CONFIG } from '../../core/keyboardLayout';
import { motion } from 'motion/react';

interface HandGuideProps {
  activeFinger: FingerType;
  expectedChar?: string;
  expectedKeyPrompt?: string;
  visible?: boolean;
}

export const HandGuide: React.FC<HandGuideProps> = ({
  activeFinger,
  expectedChar = '',
  expectedKeyPrompt = '',
  visible = true,
}) => {
  if (!visible) return null;

  const currentConfig = FINGER_CONFIG[activeFinger];

  // Helper to check if a specific finger is active
  const isActive = (f: FingerType) => activeFinger === f;

  return (
    <div className="w-full max-w-4xl mx-auto my-2 p-3.5 neu-card-raised rounded-3xl select-none">
      <div className="flex items-center justify-between px-2 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.8)] animate-pulse"></span>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#94A3B8]">
            Ergonomic Finger Position Guide
          </span>
        </div>

        {currentConfig && (
          <div className="flex items-center gap-2 bg-[#16233A] border border-white/[0.08] px-3 py-1 rounded-full text-xs shadow-sm">
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: currentConfig.color }}
            />
            <span className="text-[#F8FAFC] font-medium">{currentConfig.name}</span>
            <span className="font-urdu text-sm text-[#38BDF8] font-bold">({currentConfig.urduName})</span>
            {expectedKeyPrompt && (
              <span className="ml-1.5 font-mono bg-[#2563EB] text-white font-bold px-1.5 py-0.5 rounded text-[11px] shadow-sm">
                {expectedKeyPrompt.toUpperCase()}
              </span>
            )}
            {expectedChar && (
              <span className="font-urdu font-bold text-[#FACC15] text-base drop-shadow-[0_1px_4px_rgba(250,204,21,0.4)]">
                {expectedChar}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-5 items-end justify-center pt-2 pb-1">
        {/* LEFT HAND */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5 flex items-center gap-1">
            <span>Left Hand</span>
            <span className="font-urdu text-xs text-[#64748B]">(بایاں ہاتھ)</span>
          </div>
          
          <div className="relative flex items-end justify-center gap-2 h-28 px-4 py-2.5 neu-inset rounded-2xl w-full max-w-sm">
            {/* Left Pinky */}
            <FingerItem
              name="Pinky"
              label="A Q Z 1"
              active={isActive('left-pinky')}
              color={FINGER_CONFIG['left-pinky'].color}
              height="h-16"
              delay={0}
            />

            {/* Left Ring */}
            <FingerItem
              name="Ring"
              label="S W X 2"
              active={isActive('left-ring')}
              color={FINGER_CONFIG['left-ring'].color}
              height="h-20"
              delay={0.05}
            />

            {/* Left Middle */}
            <FingerItem
              name="Middle"
              label="D E C 3"
              active={isActive('left-middle')}
              color={FINGER_CONFIG['left-middle'].color}
              height="h-24"
              delay={0.1}
            />

            {/* Left Index */}
            <FingerItem
              name="Index"
              label="F G R T V B 4 5"
              active={isActive('left-index')}
              color={FINGER_CONFIG['left-index'].color}
              height="h-22"
              delay={0.15}
            />

            {/* Left Thumb */}
            <FingerItem
              name="Thumb"
              label="Space"
              active={isActive('thumb')}
              color={FINGER_CONFIG['thumb'].color}
              height="h-12"
              isThumb
              delay={0.2}
            />
          </div>
        </div>

        {/* RIGHT HAND */}
        <div className="flex flex-col items-center">
          <div className="text-[11px] font-semibold text-[#94A3B8] mb-1.5 flex items-center gap-1">
            <span>Right Hand</span>
            <span className="font-urdu text-xs text-[#64748B]">(دایاں ہاتھ)</span>
          </div>

          <div className="relative flex items-end justify-center gap-2 h-28 px-4 py-2.5 neu-inset rounded-2xl w-full max-w-sm">
            {/* Right Thumb */}
            <FingerItem
              name="Thumb"
              label="Space"
              active={isActive('thumb')}
              color={FINGER_CONFIG['thumb'].color}
              height="h-12"
              isThumb
              delay={0.2}
            />

            {/* Right Index */}
            <FingerItem
              name="Index"
              label="J H U Y M N 6 7"
              active={isActive('right-index')}
              color={FINGER_CONFIG['right-index'].color}
              height="h-22"
              delay={0.15}
            />

            {/* Right Middle */}
            <FingerItem
              name="Middle"
              label="K I , 8"
              active={isActive('right-middle')}
              color={FINGER_CONFIG['right-middle'].color}
              height="h-24"
              delay={0.1}
            />

            {/* Right Ring */}
            <FingerItem
              name="Ring"
              label="L O . 9"
              active={isActive('right-ring')}
              color={FINGER_CONFIG['right-ring'].color}
              height="h-20"
              delay={0.05}
            />

            {/* Right Pinky */}
            <FingerItem
              name="Pinky"
              label="; P / 0 - ="
              active={isActive('right-pinky')}
              color={FINGER_CONFIG['right-pinky'].color}
              height="h-16"
              delay={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FingerItemProps {
  name: string;
  label: string;
  active: boolean;
  color: string;
  height: string;
  isThumb?: boolean;
  delay?: number;
}

const FingerItem: React.FC<FingerItemProps> = ({
  name,
  active,
  color,
  height,
  isThumb = false,
}) => {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          y: active ? -8 : 0,
          scale: active ? 1.08 : 1,
        }}
        transition={{ type: 'spring', stiffness: 450, damping: 25 }}
        style={{
          borderColor: active ? color : '#334155',
          backgroundColor: active ? color : '#1E293B',
          boxShadow: active ? `0 0 16px ${color}88` : 'none',
        }}
        className={`w-7 md:w-9 ${height} rounded-t-full border-2 flex flex-col items-center justify-between py-1.5 transition-colors relative cursor-default`}
      >
        {/* Finger nail simulation */}
        <div
          className={`w-3.5 h-3 rounded-t-sm ${
            active ? 'bg-white/70' : 'bg-slate-700/60'
          }`}
        />

        {active && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2 h-2 rounded-full bg-white shadow"
          />
        )}
      </motion.div>

      <span
        className={`mt-1 text-[10px] font-medium transition-colors ${
          active ? 'text-white font-bold' : 'text-slate-500'
        }`}
      >
        {name}
      </span>
    </div>
  );
};
