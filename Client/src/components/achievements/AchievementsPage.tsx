import React from 'react';
import { UserProfile } from '../../types';
import { storage } from '../../core/storage';
import {
  Trophy,
  Award,
  Sparkles,
  Zap,
  Flame,
  Target,
  Crown,
  Calendar,
  Gamepad2,
  CircleDot,
  BookOpen,
  Lock
} from 'lucide-react';

interface AchievementsPageProps {
  user: UserProfile;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="w-6 h-6" />,
  Zap: <Zap className="w-6 h-6" />,
  Flame: <Flame className="w-6 h-6" />,
  Award: <Award className="w-6 h-6" />,
  Target: <Target className="w-6 h-6" />,
  Crown: <Crown className="w-6 h-6" />,
  Calendar: <Calendar className="w-6 h-6" />,
  Gamepad2: <Gamepad2 className="w-6 h-6" />,
  CircleDot: <CircleDot className="w-6 h-6" />,
  BookOpen: <BookOpen className="w-6 h-6" />,
  Trophy: <Trophy className="w-6 h-6" />,
};

export const AchievementsPage: React.FC<AchievementsPageProps> = ({ user }) => {
  const achievements = storage.getAchievements(user.id);
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
            <Trophy className="w-4 h-4" />
            <span>Honors & Badges</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Typing Achievements
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Unlock trophies as your Urdu typing speed, accuracy, and streak reach new milestones.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="bg-slate-900/90 border border-slate-800 px-5 py-3 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Unlocked</div>
            <div className="text-xl font-black text-white">
              {unlockedCount}{' '}
              <span className="text-xs font-normal text-slate-400">
                / {achievements.length} Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map(a => {
          const Icon = ICON_MAP[a.icon] || <Trophy className="w-6 h-6" />;

          return (
            <div
              key={a.id}
              className={`p-5 rounded-3xl border flex items-start gap-4 transition duration-200 ${
                a.unlocked
                  ? 'bg-slate-900/90 border-amber-500/40 shadow-xl shadow-amber-950/20'
                  : 'bg-slate-900/40 border-slate-800/80 opacity-70'
              }`}
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border ${
                  a.unlocked
                    ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/10 border-amber-500/40 text-amber-400 shadow'
                    : 'bg-slate-950 border-slate-800 text-slate-600'
                }`}
              >
                {a.unlocked ? Icon : <Lock className="w-5 h-5 text-slate-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3
                    className={`text-sm font-bold truncate ${
                      a.unlocked ? 'text-white' : 'text-slate-400'
                    }`}
                  >
                    {a.title}
                  </h3>
                  {a.unlocked && (
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                      Unlocked
                    </span>
                  )}
                </div>

                <div className="font-urdu text-xs text-slate-400 font-bold mb-1">
                  {a.titleUrdu}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {a.description}
                </p>

                {a.unlocked && a.unlockedAt && (
                  <div className="mt-2 text-[10px] text-slate-500">
                    Earned on {new Date(a.unlockedAt).toLocaleDateString()}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
