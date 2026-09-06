import React, { useState } from 'react';
import { UserProfile, AppSettings } from '../../types';
import { FallingWords } from './FallingWords';
import { UrduBubbles } from './UrduBubbles';
import { SpeedRace } from './SpeedRace';
import { storage } from '../../core/storage';
import { Gamepad2, Trophy, Flame, Play, ArrowRight, CircleDot } from 'lucide-react';

interface GamesPageProps {
  user: UserProfile;
  settings: AppSettings;
}

type ActiveGame = 'none' | 'falling-words' | 'urdu-bubbles' | 'speed-race';

export const GamesPage: React.FC<GamesPageProps> = ({ user, settings }) => {
  const [activeGame, setActiveGame] = useState<ActiveGame>('none');
  const scores = storage.getGameScores(user.id);

  if (activeGame === 'falling-words') {
    return (
      <FallingWords
        user={user}
        settings={settings}
        onBackToGames={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'urdu-bubbles') {
    return (
      <UrduBubbles
        user={user}
        settings={settings}
        onBackToGames={() => setActiveGame('none')}
      />
    );
  }

  if (activeGame === 'speed-race') {
    return (
      <SpeedRace
        user={user}
        settings={settings}
        onBackToGames={() => setActiveGame('none')}
      />
    );
  }

  // Get best scores for each game
  const bestFalling = scores
    .filter(s => s.gameName === 'falling-words')
    .sort((a, b) => b.score - a.score)[0];

  const bestBubbles = scores
    .filter(s => s.gameName === 'urdu-bubbles')
    .sort((a, b) => b.score - a.score)[0];

  const bestRace = scores
    .filter(s => s.gameName === 'speed-race')
    .sort((a, b) => b.score - a.score)[0];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider neu-badge-blue px-3 py-1 mb-3">
          <Gamepad2 className="w-4 h-4 text-[#38BDF8]" />
          <span>Interactive Typing Games</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight">
          Arcade & Speed Challenges
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
          Reinforce Urdu phonetic keystroke muscle memory through fast-paced, tactile, and interactive typing games.
        </p>
      </div>

      {/* Game Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {/* GAME 1: Falling Words */}
        <div className="neu-card-interactive rounded-3xl p-6 flex flex-col justify-between group hover:border-[#2563EB]/50 transition-all">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#0B1120] border border-slate-700/60 flex items-center justify-center text-[#38BDF8] mb-5 group-hover:scale-105 transition-transform neu-inset">
              <Flame className="w-7 h-7 text-[#38BDF8]" />
            </div>
            <span className="neu-badge-blue text-[11px] font-bold uppercase tracking-wider px-3 py-1">
              Reaction Speed
            </span>
            <h3 className="text-xl font-bold text-[#F8FAFC] mt-3">
              Falling Urdu Words
            </h3>
            <div className="font-urdu text-base text-[#38BDF8] font-bold mb-2">
              گرتے ہوئے الفاظ
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Urdu words drop towards the danger line. Type them phonetically before they hit the ground to chain combos!
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-[#64748B]">
              High Score:{' '}
              <strong className="text-[#F8FAFC] font-black text-sm">
                {bestFalling ? bestFalling.score : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('falling-words')}
              className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </button>
          </div>
        </div>

        {/* GAME 2: Urdu Bubbles */}
        <div className="neu-card-interactive rounded-3xl p-6 flex flex-col justify-between group hover:border-[#38BDF8]/50 transition-all">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#0B1120] border border-slate-700/60 flex items-center justify-center text-[#38BDF8] mb-5 group-hover:scale-105 transition-transform neu-inset">
              <CircleDot className="w-7 h-7 text-[#38BDF8]" />
            </div>
            <span className="neu-badge-cyan text-[11px] font-bold uppercase tracking-wider px-3 py-1">
              Focus & Rhythm
            </span>
            <h3 className="text-xl font-bold text-[#F8FAFC] mt-3">
              Urdu Bubbles
            </h3>
            <div className="font-urdu text-base text-[#38BDF8] font-bold mb-2">
              اردو کے بلبلے
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Floating colorful word bubbles across the screen. Pop as many as possible within 60 seconds with precision.
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-[#64748B]">
              High Score:{' '}
              <strong className="text-[#F8FAFC] font-black text-sm">
                {bestBubbles ? bestBubbles.score : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('urdu-bubbles')}
              className="neu-btn-secondary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current text-[#38BDF8]" />
              <span className="text-[#38BDF8]">Play</span>
            </button>
          </div>
        </div>

        {/* GAME 3: Speed Race */}
        <div className="neu-card-interactive rounded-3xl p-6 flex flex-col justify-between group hover:border-[#FACC15]/50 transition-all">
          <div>
            <div className="w-14 h-14 rounded-2xl bg-[#0B1120] border border-slate-700/60 flex items-center justify-center text-[#FACC15] mb-5 group-hover:scale-105 transition-transform neu-inset">
              <Trophy className="w-7 h-7 text-[#FACC15]" />
            </div>
            <span className="neu-badge-yellow text-[11px] font-bold uppercase tracking-wider px-3 py-1">
              Head-to-Head Race
            </span>
            <h3 className="text-xl font-bold text-[#F8FAFC] mt-3">
              Speed Race
            </h3>
            <div className="font-urdu text-base text-[#FACC15] font-bold mb-2">
              رفتار کی ریس
            </div>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Take on automated AI racers across Novice, Pro, and Master levels. Fast typing fuels your engine to victory!
            </p>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-[#64748B]">
              Best WPM:{' '}
              <strong className="text-[#FACC15] font-black text-sm">
                {bestRace ? `${bestRace.wpm} WPM` : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('speed-race')}
              className="neu-btn-accent px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Race</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Game History */}
      {scores.length > 0 && (
        <div className="neu-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#F8FAFC] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#FACC15]" />
              <span>Recent Arcade Records</span>
            </h3>
            <span className="text-xs text-[#64748B]">{scores.length} Games Played</span>
          </div>

          <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-slate-800/70">
            {scores.slice(0, 5).map(s => (
              <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#111C31]/40 transition">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  <span className="font-bold text-[#F8FAFC] capitalize text-sm">
                    {s.gameName.replace('-', ' ')}
                  </span>
                  <span className="text-slate-600">•</span>
                  <span className="text-[#64748B]">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-5">
                  <span className="text-[#94A3B8] font-mono">{s.wpm} WPM</span>
                  <span className="font-black text-[#FACC15] bg-[#FACC15]/10 px-2.5 py-1 rounded-lg border border-[#FACC15]/20">
                    {s.score} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
