import React, { useState, useEffect } from 'react';
import { UserProfile, Lesson, AppSettings, HistoryRecord, HistoryStats } from '../../types';
import { LESSONS } from '../../data/lessons';
import { storage } from '../../core/storage';
import { api } from '../../core/api';
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
  Sparkles,
  CheckCircle2,
  XCircle,
  Calendar,
  Mail,
  User,
  History,
  RotateCcw
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
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>([]);
  const [stats, setStats] = useState<HistoryStats | null>(null);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch authentic database history & statistics on mount
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setLoadingHistory(true);
      Promise.all([
        api.getHistory(token).catch(() => []),
        api.getHistoryStats(token).catch(() => null),
      ]).then(([records, statsData]) => {
        setHistoryRecords(records);
        if (statsData) {
          setStats(statsData);
        }
      }).finally(() => {
        setLoadingHistory(false);
      });
    }
  }, [user.id]);

  const localSessions = storage.getSessions(user.id);
  const progressMap = storage.getLessonProgress(user.id);
  const weakKeys = storage.getWeakKeys(user.id, 4);

  // Calculate real performance metrics from database records or local session data (0 if no data)
  const totalTests = stats?.totalTests ?? (historyRecords.length > 0 ? historyRecords.length : localSessions.length);
  
  const avgWpm = stats?.avgWpm ?? (
    historyRecords.length > 0
      ? Math.round(historyRecords.reduce((a, h) => a + (h.score || 0), 0) / historyRecords.length)
      : localSessions.length > 0
      ? Math.round(localSessions.reduce((a, s) => a + s.wpm, 0) / localSessions.length)
      : 0
  );

  const avgAcc = stats?.avgAccuracy ?? (
    historyRecords.length > 0
      ? Math.round((historyRecords.reduce((a, h) => a + (h.percentage || 0), 0) / historyRecords.length) * 10) / 10
      : localSessions.length > 0
      ? Math.round((localSessions.reduce((a, s) => a + s.accuracy, 0) / localSessions.length) * 10) / 10
      : 0
  );

  const completedLessons = Object.values(progressMap).filter(p => p.completed).length;

  const totalPracticeSeconds = stats?.totalPracticeSeconds ?? (
    historyRecords.length > 0
      ? historyRecords.reduce((a, h) => a + (h.durationSeconds || 0), 0)
      : localSessions.reduce((a, s) => a + (s.durationSeconds || 0), 0)
  );

  const totalMinutes = Math.round(totalPracticeSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  const timeFormatted = `${hours}h ${remainingMins}m`;

  const passedCount = stats?.passedTests ?? historyRecords.filter(h => h.status === 'Passed').length;

  // Find next uncompleted lesson
  const nextLesson = LESSONS.find(l => !progressMap[l.id]?.completed) || LESSONS[0];

  // Target Goal Progress (towards targetWpm e.g. 50 WPM)
  const targetWpm = user.targetWpm || 40;
  const goalProgress = avgWpm > 0 ? Math.min(100, Math.round((avgWpm / targetWpm) * 100)) : 0;

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

  const memberSince = user.joinedAt || (user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 select-none">
      {/* Personalized Welcome Header Banner */}
      <div className="neu-card-raised rounded-3xl p-6 md:p-8 mb-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-64 h-64 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-[#3B82F6] via-[#2563EB] to-[#1D4ED8] flex items-center justify-center text-2xl shadow-[0_4px_12px_rgba(37,99,235,0.4),inset_0_1px_1px_rgba(255,255,255,0.35)] border border-white/20 shrink-0">
              {user.avatar || '👨‍💻'}
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
                <span>Personal Dashboard</span>
                <span className="text-[#64748B]">•</span>
                <span className="text-[#94A3B8]">Urdu Phonetic Typing Master</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] mt-1">
                Welcome, {user.name || 'Typist'}! 👋
              </h1>
              <div className="flex flex-wrap items-center gap-2.5 mt-2 text-xs text-[#94A3B8]">
                {user.email && (
                  <span className="flex items-center gap-1.5 bg-[#070B14] px-2.5 py-1 rounded-xl border border-white/[0.06] text-[#94A3B8] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.5)]">
                    <Mail className="w-3.5 h-3.5 text-[#38BDF8]" />
                    <span>{user.email}</span>
                  </span>
                )}
                <span className="flex items-center gap-1.5 bg-[#16233A] px-2.5 py-1 rounded-xl border border-white/[0.07] text-[#94A3B8] shadow-sm">
                  <Calendar className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Joined: {memberSince}</span>
                </span>
                <span className="flex items-center gap-1.5 bg-[#2563EB]/15 text-[#60A5FA] px-2.5 py-1 rounded-xl border border-[#2563EB]/30 font-semibold shadow-sm">
                  <Award className="w-3.5 h-3.5 text-[#38BDF8]" />
                  <span>Level: {user.level || 'Beginner'}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Daily Streak & Practice Status */}
          <div className="flex items-center gap-3 self-stretch md:self-auto justify-end">
            <div className="neu-badge-yellow px-5 py-3 rounded-2xl flex items-center gap-3 shadow-md">
              <div className="p-2.5 bg-[#FACC15]/20 text-[#FACC15] rounded-xl">
                <Flame className="w-6 h-6 animate-pulse fill-[#FACC15]" />
              </div>
              <div>
                <div className="text-sm font-black text-[#FACC15] uppercase tracking-wider">
                  {user.streakDays || 0} Day Streak
                </div>
                <div className="text-xs text-[#94A3B8]">
                  {user.streakDays && user.streakDays > 0 ? 'Daily practice active' : 'Start your streak today'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Continue Practice Card & Goal Container */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
        {/* Large Continue Practice Hero */}
        <div className="lg:col-span-2 neu-card-raised rounded-3xl p-6 md:p-8 flex flex-col justify-between shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#2563EB]/10 rounded-full blur-3xl pointer-events-none"></div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-[#38BDF8] bg-[#38BDF8]/10 px-3 py-1 rounded-full border border-[#38BDF8]/25 shadow-sm">
                Recommended Next Step
              </span>
              <span className="text-xs text-[#94A3B8] font-medium">
                Lesson {nextLesson.id.toString().padStart(2, '0')} • {nextLesson.difficulty}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-[#F8FAFC] mt-2">
              {nextLesson.title}
            </h2>
            <div className="font-urdu text-2xl text-[#FACC15] font-bold mt-1 drop-shadow-[0_2px_8px_rgba(250,204,21,0.25)]">
              {nextLesson.titleUrdu}
            </div>

            <p className="text-xs md:text-sm text-[#94A3B8] max-w-xl mt-3 leading-relaxed">
              {nextLesson.description}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4">
            <div className="text-xs text-[#94A3B8]">
              Target Speed: <strong className="text-[#F8FAFC]">{nextLesson.targetWpm} WPM</strong>
              <span className="mx-2 text-[#64748B]">•</span>
              Accuracy: <strong className="text-emerald-400">{nextLesson.targetAccuracy}%</strong>
            </div>

            {/* Important CTA: Warm Yellow Button with dark navy text */}
            <button
              onClick={() => onNavigate('lesson', nextLesson)}
              className="neu-btn-accent px-6 py-3 rounded-xl text-xs flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Continue Practice</span>
            </button>
          </div>
        </div>

        {/* Current Goal & 7-Day Streak Calendar */}
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2">
              <span className="font-bold uppercase tracking-wider text-[#94A3B8]">Current Milestone</span>
              <span className="text-[#38BDF8] font-bold">{goalProgress}%</span>
            </div>
            <h3 className="text-lg font-bold text-[#F8FAFC]">
              Reach {targetWpm} WPM
            </h3>
            <div className="w-full neu-inset h-2.5 rounded-full overflow-hidden my-3">
              <div
                className="h-full bg-gradient-to-r from-[#2563EB] to-[#38BDF8] rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(56,189,248,0.5)]"
                style={{ width: `${goalProgress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#64748B]">
              <span>Current: {avgWpm} WPM</span>
              <span>Target: {targetWpm} WPM</span>
            </div>
          </div>

          {/* 7-Day Streak Calendar */}
          <div className="mt-6 pt-4 border-t border-white/[0.06]">
            <div className="flex items-center justify-between text-xs text-[#94A3B8] mb-2.5">
              <span className="font-semibold">7-Day Consistency</span>
              <span className="text-[#FACC15] text-[11px] font-bold">
                {user.streakDays || 0} Day Streak 🔥
              </span>
            </div>
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {weekDays.map((day, i) => (
                <div
                  key={i}
                  className={`p-1.5 rounded-xl border flex flex-col items-center gap-1 transition-all ${
                    day.isPracticed
                      ? 'bg-emerald-500/15 border-emerald-500/35 text-emerald-300 shadow-sm'
                      : day.isCurrent
                      ? 'neu-inset border-[#2563EB] text-[#F8FAFC] ring-1 ring-[#2563EB]/40'
                      : 'neu-inset border-white/[0.05] text-[#64748B]'
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
        <div className="neu-card-interactive p-5 rounded-2xl group">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-2">
            <span className="font-medium group-hover:text-[#38BDF8] transition-colors">Average Speed</span>
            <div className="p-1.5 rounded-xl bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 transition shadow-sm">
              <Gauge className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#F8FAFC] tracking-tight">
            {avgWpm} <span className="text-xs font-normal text-[#94A3B8]">WPM</span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            {totalTests > 0 ? `Across ${totalTests} test(s)` : 'No tests recorded'}
          </div>
        </div>

        <div className="neu-card-interactive p-5 rounded-2xl group">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-2">
            <span className="font-medium group-hover:text-emerald-300 transition-colors">Average Accuracy</span>
            <div className="p-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 transition shadow-sm">
              <Target className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400 tracking-tight">
            {avgAcc}%
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            {passedCount > 0 ? `${passedCount} test(s) passed` : 'Target threshold: ≥85%'}
          </div>
        </div>

        <div className="neu-card-interactive p-5 rounded-2xl group">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-2">
            <span className="font-medium group-hover:text-[#60A5FA] transition-colors">Curriculum Lessons</span>
            <div className="p-1.5 rounded-xl bg-[#2563EB]/15 text-[#60A5FA] border border-[#2563EB]/30 transition shadow-sm">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#60A5FA] tracking-tight">
            {completedLessons}{' '}
            <span className="text-xs font-normal text-[#94A3B8]">/ {LESSONS.length}</span>
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            {Math.round((completedLessons / LESSONS.length) * 100)}% completed
          </div>
        </div>

        <div className="neu-card-interactive p-5 rounded-2xl group">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-2">
            <span className="font-medium group-hover:text-[#FACC15] transition-colors">Practice Time</span>
            <div className="p-1.5 rounded-xl bg-[#FACC15]/15 text-[#FACC15] border border-[#FACC15]/30 transition shadow-sm">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#FACC15] tracking-tight">
            {timeFormatted}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Active training time
          </div>
        </div>
      </div>

      {/* User-Specific Test & Activity History Section */}
      <div className="neu-card rounded-3xl p-6 md:p-8 mb-8 shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
              <History className="w-4 h-4" />
              <span>Database Test Records</span>
            </div>
            <h2 className="text-xl font-bold text-[#F8FAFC] mt-1">
              Your Personal Test History
            </h2>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Securely stored in MongoDB and isolated exclusively to your account.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigate('test')}
              className="neu-btn-primary px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
            >
              <Timer className="w-3.5 h-3.5" />
              <span>New Typing Test</span>
            </button>
          </div>
        </div>

        {/* History Table */}
        {loadingHistory ? (
          <div className="py-12 text-center text-[#64748B] text-xs">
            Loading your personal history from the database...
          </div>
        ) : historyRecords.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#94A3B8]">
              <thead className="bg-[#070B14] text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-white/[0.06]">
                <tr>
                  <th scope="col" className="py-3 px-4 rounded-l-xl">Test / Activity</th>
                  <th scope="col" className="py-3 px-4">Score (WPM)</th>
                  <th scope="col" className="py-3 px-4">Percentage</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 rounded-r-xl">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {historyRecords.map((item, index) => {
                  const isPassed = item.status === 'Passed';
                  const isFailed = item.status === 'Failed';
                  return (
                    <tr key={item._id || item.id || index} className="hover:bg-[#16233A]/50 transition">
                      <td className="py-3.5 px-4 font-semibold text-[#F8FAFC] flex items-center gap-2.5">
                        <div className="p-1.5 rounded-lg bg-[#16233A] text-[#38BDF8] border border-white/[0.06] shrink-0">
                          {item.activityType === 'test' ? (
                            <Timer className="w-4 h-4 text-[#38BDF8]" />
                          ) : (
                            <BookOpen className="w-4 h-4 text-[#60A5FA]" />
                          )}
                        </div>
                        <div>
                          <div>{item.title}</div>
                          {item.titleUrdu && (
                            <div className="font-urdu text-[11px] text-[#FACC15]">{item.titleUrdu}</div>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#F8FAFC] text-sm">
                        {item.score} <span className="text-[10px] font-normal text-[#94A3B8]">WPM</span>
                        {item.netScore !== undefined && item.netScore !== item.score && (
                          <span className="text-[10px] text-[#64748B] ml-1">({item.netScore} net)</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-bold">
                        <span className={item.percentage >= 85 ? 'text-emerald-400' : item.percentage >= 70 ? 'text-[#FACC15]' : 'text-rose-400'}>
                          {item.percentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${
                            isPassed
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : isFailed
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                              : 'bg-[#2563EB]/15 text-[#60A5FA] border-[#2563EB]/30'
                          }`}
                        >
                          {isPassed ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isFailed ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Award className="w-3 h-3" />
                          )}
                          <span>{item.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#94A3B8] text-[11px]">
                        <div>{item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '—')}</div>
                        {item.time && <div className="text-[10px] text-[#64748B]">{item.time}</div>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : localSessions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#94A3B8]">
              <thead className="bg-[#070B14] text-[11px] uppercase tracking-wider text-[#94A3B8] border-b border-white/[0.06]">
                <tr>
                  <th scope="col" className="py-3 px-4 rounded-l-xl">Test / Activity</th>
                  <th scope="col" className="py-3 px-4">Score (WPM)</th>
                  <th scope="col" className="py-3 px-4">Percentage</th>
                  <th scope="col" className="py-3 px-4">Status</th>
                  <th scope="col" className="py-3 px-4 rounded-r-xl">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.05]">
                {localSessions.map((s) => (
                  <tr key={s.id} className="hover:bg-[#16233A]/50 transition">
                    <td className="py-3.5 px-4 font-semibold text-[#F8FAFC]">
                      {s.lessonTitle || `Session (${s.mode})`}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#F8FAFC] text-sm">
                      {s.wpm} <span className="text-[10px] font-normal text-[#94A3B8]">WPM</span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-emerald-400">
                      {s.accuracy}%
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                        s.accuracy >= 85 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-[#FACC15]/15 text-[#FACC15] border-[#FACC15]/30'
                      }`}>
                        {s.accuracy >= 85 ? 'Passed' : 'Completed'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-[#94A3B8] text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 px-4 rounded-2xl neu-inset">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB]/15 text-[#38BDF8] border border-[#2563EB]/30 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Timer className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-[#F8FAFC]">No Test History Recorded Yet</h3>
            <p className="text-xs text-[#94A3B8] max-w-md mx-auto mt-1 mb-4">
              Your test history is strictly isolated to your account. Take your first timed speed test or lesson now to generate your personal score and record!
            </p>
            <button
              onClick={() => onNavigate('test')}
              className="neu-btn-primary px-5 py-2.5 rounded-xl text-xs inline-flex items-center gap-2 cursor-pointer font-bold"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Take First Typing Test</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Launch Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => onNavigate('lessons')}
          className="neu-card-interactive p-5 rounded-3xl text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <BookOpen className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">Full Curriculum</h4>
          <p className="text-[11px] text-[#94A3B8] mt-1">25 progressive lessons from Beginner to Master</p>
        </button>

        <button
          onClick={() => onNavigate('test')}
          className="neu-card-interactive p-5 rounded-3xl text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8] mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <Timer className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition-colors">Timed Typing Test</h4>
          <p className="text-[11px] text-[#94A3B8] mt-1">1, 2, 5, or 10-minute standardized speed trials</p>
        </button>

        <button
          onClick={() => onNavigate('games')}
          className="neu-card-interactive p-5 rounded-3xl text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#FACC15]/15 border border-[#FACC15]/30 flex items-center justify-center text-[#FACC15] mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <Gamepad2 className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#FACC15] transition-colors">Arcade Games</h4>
          <p className="text-[11px] text-[#94A3B8] mt-1">Falling Words, Urdu Bubbles, and Speed Race</p>
        </button>

        <button
          onClick={() => onNavigate('learn')}
          className="neu-card-interactive p-5 rounded-3xl text-left group cursor-pointer"
        >
          <div className="w-11 h-11 rounded-2xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#60A5FA] mb-3 group-hover:scale-110 transition-all duration-300 shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-[#F8FAFC] group-hover:text-[#60A5FA] transition-colors">Learn the Keys</h4>
          <p className="text-[11px] text-[#94A3B8] mt-1">Single-letter interactive flashcards & hand guide</p>
        </button>
      </div>

      {/* Weak Keys & Quick Diagnostics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weak Keys Callout */}
        <div className="neu-card rounded-3xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FACC15]" />
              <h3 className="text-sm font-bold text-[#F8FAFC]">Detected Weak Keys</h3>
            </div>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-[#38BDF8] hover:underline font-semibold cursor-pointer"
            >
              View Diagnostics
            </button>
          </div>

          {weakKeys.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {weakKeys.map(w => (
                <div
                  key={w.urduChar}
                  className="neu-inset p-3 rounded-2xl flex flex-col items-center"
                >
                  <span className="font-urdu text-2xl font-bold text-[#FACC15]">
                    {w.urduChar}
                  </span>
                  <span className="text-[11px] font-mono text-[#94A3B8] mt-1">
                    Key: {w.key.toUpperCase()}
                  </span>
                  <span className="text-xs font-black text-rose-400 mt-0.5">
                    {w.accuracy}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-xs text-[#64748B]">
              No weak keys detected yet. Keep typing to populate telemetry.
            </div>
          )}
        </div>

        {/* User Account Summary Card */}
        <div className="neu-card rounded-3xl p-6 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#38BDF8]" />
                <h3 className="text-sm font-bold text-[#F8FAFC]">Authenticated Profile</h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Connected
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-[#94A3B8]">Account Name:</span>
                <strong className="text-[#F8FAFC] font-semibold">{user.name || 'Student'}</strong>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-[#94A3B8]">Account Email:</span>
                <span className="text-[#94A3B8] font-mono text-[11px]">{user.email || '—'}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-[#94A3B8]">Total Activities:</span>
                <span className="text-[#38BDF8] font-bold">{totalTests}</span>
              </div>
              <div className="flex items-center justify-between py-1.5">
                <span className="text-[#94A3B8]">Overall Tests Passed:</span>
                <span className="text-emerald-400 font-bold">{passedCount}</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
            <span className="text-[11px] text-[#64748B]">
              User ID: {user.id ? `${user.id.slice(0, 8)}...` : 'Active'}
            </span>
            <button
              onClick={() => onNavigate('analytics')}
              className="text-xs text-[#38BDF8] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
