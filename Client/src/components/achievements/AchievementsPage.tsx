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
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider neu-badge-yellow px-3 py-1 mb-3">
            <Trophy className="w-4 h-4 text-[#FACC15]" />
            <span>Honors & Medallions</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight">
            Typing Achievements
          </h1>
          <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
            Unlock skeuomorphic trophies as your Urdu typing speed, accuracy, and streak reach new milestones.
          </p>
        </div>

        {/* Progress Pill */}
        <div className="neu-card px-6 py-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl neu-inset flex items-center justify-center text-[#FACC15]">
            <Award className="w-6 h-6 text-[#FACC15]" />
          </div>
          <div>
            <div className="text-xs text-[#64748B] font-bold uppercase tracking-wider">Total Unlocked</div>
            <div className="text-2xl font-black text-[#F8FAFC]">
              {unlockedCount}{' '}
              <span className="text-xs font-bold text-[#64748B]">
                / {achievements.length} Badges
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {achievements.map(a => {
          const Icon = ICON_MAP[a.icon] || <Trophy className="w-6 h-6" />;

          return (
            <div
              key={a.id}
              className={`p-6 rounded-3xl transition-all duration-200 ${
                a.unlocked
                  ? 'neu-card-raised border border-[#FACC15]/40 shadow-[0_12px_28px_rgba(0,0,0,0.6),0_0_15px_rgba(250,204,21,0.15)]'
                  : 'neu-card opacity-75'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* 3D Skeuomorphic Medallion */}
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform ${
                    a.unlocked
                      ? 'bg-gradient-to-br from-[#FACC15]/25 via-[#FACC15]/10 to-transparent border-t border-white/40 border-b border-black/60 shadow-[0_6px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] text-[#FACC15]'
                      : 'neu-inset text-slate-600'
                  }`}
                >
                  {a.unlocked ? Icon : <Lock className="w-5 h-5 text-[#64748B]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-sm font-bold truncate ${
                        a.unlocked ? 'text-[#F8FAFC]' : 'text-[#94A3B8]'
                      }`}
                    >
                      {a.title}
                    </h3>
                    {a.unlocked && (
                      <span className="neu-badge-yellow text-[10px] font-black uppercase tracking-wider px-2 py-0.5">
                        Unlocked
                      </span>
                    )}
                  </div>

                  <div className="font-urdu text-sm text-[#38BDF8] font-bold mb-1">
                    {a.titleUrdu}
                  </div>

                  <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2">
                    {a.description}
                  </p>

                  {a.unlocked && a.unlockedAt && (
                    <div className="mt-3 text-[10px] text-[#64748B] font-mono">
                      Earned on {new Date(a.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
