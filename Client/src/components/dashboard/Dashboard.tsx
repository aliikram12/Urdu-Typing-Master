import React from 'react';
import { UserProfile, Lesson, AppSettings } from '../../types';
import { LESSONS } from '../../data/lessons';
import { storage } from '../../core/storage';
import {
  Gauge,
  Target,
  BookOpen,
  Clock,
  Flame,
  ArrowRight,
  Play,
  Award,
  AlertTriangle,
  Timer,
  Gamepad2,
  Sparkles
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  settings: AppSettings;
  onNavigate: (view: string, payload?: unknown) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  onNavigate,
}) => {
  const sessions = storage.getSessions(user.id);
  const progressMap = storage.getLessonProgress(user.id);
  const weakKeys = storage.getWeakKeys(user.id, 4);

  // Performance calculations
  const avgWpm =
    sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length)
      : 32;

  const avgAcc =
    sessions.length > 0
      ? Math.round((sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length) * 10) / 10
      : 96.4;

  const completedLessons = Object.values(progressMap).filter(p => p.completed).length;

  const totalMinutes = Math.round(
    sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60
  );
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const timeFormatted = `${hours}h ${remainingMins}m`;

  // Find next uncompleted lesson
  const nextLesson = LESSONS.find(l => !progressMap[l.id]?.completed) || LESSONS[0];

  // Target Goal Progress (towards targetWpm e.g. 50 WPM)
  const targetWpm = user.targetWpm || 50;
  const goalProgress = Math.min(100, Math.round((avgWpm / targetWpm) * 100));

  // 7-day streak calendar days
  const today = new Date();
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(today.getDate() - (6 - i));
    const isoDate = d.toISOString().split('T')[0];
    const isPracticed = (user.practiceDates || []).includes(isoDate);
    const isCurrent = isoDate === today.toISOString().split('T')[0];
    return {
      name: dayNames[d.getDay()],
      date: isoDate,
      isPracticed,
      isCurrent,
    };
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 select-none">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
            <span>Welcome Back</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Mastering Urdu Phonetic Typing</span>
          </span>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Good Day, {user.name} 👋
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Ready to accelerate your Urdu typing speed and muscle memory?
          </p>
        </div>

        {/* Streak Badge */}
        <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-500/30 px-4 py-2.5 rounded-2xl flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 text-amber-400 rounded-xl">
            <Flame className="w-6 h-6 animate-pulse fill-amber-400" />
          </div>
          <div>
            <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
              {user.streakDays || 1} Day Streak
            </div>
            <div className="text-xs text-slate-300">Daily practice active</div>
          </div>
        </div>
      </div>

      {/* Primary Continue Practice Card & Goal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Large Continue Practice Hero */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-900/40 via-indigo-950/30 to-slate-900/90 border border-blue-800/50 rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400 bg-blue-500/20 px-3 py-1 rounded-full border border-blue-500/30">
                Recommended Next Step
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Lesson {nextLesson.id.toString().padStart(2, '0')} • {nextLesson.difficulty}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-white mt-2">
              {nextLesson.title}
            </h2>
            <div className="font-urdu text-xl text-amber-300 font-bold mt-1">
              {nextLesson.titleUrdu}
            </div>

            <p className="text-xs md:text-sm text-slate-300 max-w-xl mt-3 leading-relaxed">
              {nextLesson.description}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-slate-400">
              Target Speed: <strong className="text-white">{nextLesson.targetWpm} WPM</strong>
              <span className="mx-2">•</span>
              Accuracy: <strong className="text-emerald-400">{nextLesson.targetAccuracy}%</strong>
            </div>

            <button
              onClick={() => onNavigate('lesson', nextLesson)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-xl shadow-blue-600/30 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue Practice</span>
            </button>
          </div>
        </div>

        {/* Current Goal & 7-Day Streak Calendar */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-bold uppercase tracking-wider text-slate-400">Current Milestone</span>
              <span className="text-blue-400 font-bold">{goalProgress}%</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              Reach {targetWpm} WPM
            </h3>
            <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800 my-3">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500">
              <span>Current: {avgWpm} WPM</span>
              <span>Target: {targetWpm} WPM</span>
            </div>
          </div>

          {/* 7-Day Streak Calendar */}
          <div className="mt-6 pt-4 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
              <span className="font-semibold">7-Day Consistency</span>
              <span className="text-amber-400 text-[11px] font-bold">
                {user.streakDays} Day Streak 🔥
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 ${
                    day.isPracticed
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                      : day.isCurrent
                      ? 'bg-slate-950 border-blue-500/60 text-slate-300 ring-1 ring-blue-500/40'
                      : 'bg-slate-950 border-slate-800 text-slate-600'
                  }`}
                >
                  <span className="text-[10px] uppercase font-bold">{day.name[0]}</span>
                  <span className="text-xs">
                    {day.isPracticed ? '✓' : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4 Performance Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Average Speed</span>
            <Gauge className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {avgWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Average Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400">
            {avgAcc}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Curriculum Lessons</span>
            <BookOpen className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-purple-300">
            {completedLessons}{' '}
            <span className="text-xs font-normal text-slate-400">/ {LESSONS.length}</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Practice Time</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-300">
            {timeFormatted}
          </div>
        </div>
      </div>

      {/* Quick Launch Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => onNavigate('lessons')}
          className="p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-3xl text-left transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Full Curriculum</h4>
          <p className="text-[11px] text-slate-400 mt-1">25 progressive lessons from Beginner to Master</p>
        </button>

        <button
          onClick={() => onNavigate('test')}
          className="p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-3xl text-left transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3 group-hover:scale-110 transition">
            <Timer className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Timed Typing Test</h4>
          <p className="text-[11px] text-slate-400 mt-1">1, 2, 5, or 10-minute standardized speed trials</p>
        </button>

        <button
          onClick={() => onNavigate('games')}
          className="p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-3xl text-left transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Arcade Games</h4>
          <p className="text-[11px] text-slate-400 mt-1">Falling Words, Urdu Bubbles, and Speed Race</p>
        </button>

        <button
          onClick={() => onNavigate('learn')}
          className="p-5 bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-slate-700 rounded-3xl text-left transition group cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 mb-3 group-hover:scale-110 transition">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-white">Learn the Keys</h4>
          <p className="text-[11px] text-slate-400 mt-1">Single-letter interactive flashcards & hand guide</p>
        </button>
      </div>

      {/* Weak Keys & Recent Activity Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Keys Callout */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Detected Weak Keys</h3>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              View Diagnostics
            </button>
          </div>

          {weakKeys.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {weakKeys.map(w => (
                <div
                  key={w.urduChar}
                  className="bg-slate-950 p-3 rounded-2xl border border-slate-800/90 flex flex-col items-center"
                >
                  <span className="font-urdu text-2xl font-bold text-amber-300">
                    {w.urduChar}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 mt-1">
                    Key: {w.key.toUpperCase()}
                  </span>
                  <span className="text-xs font-black text-rose-400 mt-0.5">
                    {w.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No weak keys detected yet. Keep typing to populate telemetry.
            </div>
          )}
        </div>

        {/* Recent Sessions */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              History
            </button>
          </div>

          {sessions.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {sessions.slice(0, 4).map(s => (
                <div key={s.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">
                      {s.lessonTitle || `Session (${s.mode})`}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-white">{s.wpm} WPM</span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="font-bold text-emerald-400">{s.accuracy}%</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-slate-500">
              No sessions recorded yet. Start your first lesson today!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
