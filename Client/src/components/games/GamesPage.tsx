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
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          <Gamepad2 className="w-4 h-4" />
          <span>Interactive Typing Games</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
          Arcade & Speed Challenges
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Reinforce Urdu phonetic keystroke muscle memory through fast-paced, interactive typing games.
        </p>
      </div>

      {/* Game Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* GAME 1: Falling Words */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20 transition group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
              <Flame className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              Reaction Speed
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Falling Urdu Words
            </h3>
            <div className="font-urdu text-sm text-slate-400 font-bold mb-2">
              گرتے ہوئے الفاظ
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Urdu words drop towards the danger line. Type them phonetically before they hit the ground to chain combos!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              High Score:{' '}
              <strong className="text-white font-black">
                {bestFalling ? bestFalling.score : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('falling-words')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-blue-600/30 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </button>
          </div>
        </div>

        {/* GAME 2: Urdu Bubbles */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 transition group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition">
              <CircleDot className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
              Focus & Rhythm
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Urdu Bubbles
            </h3>
            <div className="font-urdu text-sm text-slate-400 font-bold mb-2">
              اردو کے بلبلے
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Floating colorful word bubbles across the screen. Pop as many as possible within 60 seconds.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              High Score:{' '}
              <strong className="text-white font-black">
                {bestBubbles ? bestBubbles.score : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('urdu-bubbles')}
              className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-cyan-600/30 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Play</span>
            </button>
          </div>
        </div>

        {/* GAME 3: Speed Race */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/50 hover:shadow-xl hover:shadow-amber-950/20 transition group">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition">
              <Trophy className="w-6 h-6 text-amber-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
              Head-to-Head Race
            </span>
            <h3 className="text-xl font-bold text-white mt-2">
              Speed Race
            </h3>
            <div className="font-urdu text-sm text-slate-400 font-bold mb-2">
              رفتار کی ریس
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Take on automated AI racers across Novice, Pro, and Master levels. Typing faster propels your vehicle to victory!
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            <div className="text-xs text-slate-500">
              Best WPM:{' '}
              <strong className="text-white font-black">
                {bestRace ? `${bestRace.wpm} WPM` : '—'}
              </strong>
            </div>
            <button
              onClick={() => setActiveGame('speed-race')}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-600/30 transition cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Race</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Game History */}
      {scores.length > 0 && (
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-5">
          <h3 className="text-sm font-bold text-white mb-3">Recent Arcade Records</h3>
          <div className="divide-y divide-slate-800/60">
            {scores.slice(0, 5).map(s => (
              <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white capitalize">
                    {s.gameName.replace('-', ' ')}
                  </span>
                  <span className="text-slate-500">•</span>
                  <span className="text-slate-400">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-slate-400">{s.wpm} WPM</span>
                  <span className="font-bold text-cyan-400">{s.score} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
