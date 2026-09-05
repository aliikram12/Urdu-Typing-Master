import React, { useState } from 'react';
import { UserProfile, KeyStat, AppSettings } from '../../types';
import { storage } from '../../core/storage';
import { KEYBOARD_ROWS } from '../../core/keyboardLayout';
import { LessonPage } from '../lessons/LessonPage';
import {
  TrendingUp,
  Target,
  AlertTriangle,
  Zap,
  Activity,
  BarChart3,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface AnalyticsPageProps {
  user: UserProfile;
  settings: AppSettings;
  onLaunchCustomLesson?: (customText: string, title: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({
  user,
  settings,
  onLaunchCustomLesson,
}) => {
  const [activeSmartPractice, setActiveSmartPractice] = useState<{
    title: string;
    content: string[];
  } | null>(null);

  const sessions = storage.getSessions(user.id);
  const keyStats = storage.getKeyStats(user.id);
  const weakKeys = storage.getWeakKeys(user.id, 6);

  // Calculate statistics
  const avgWpm =
    sessions.length > 0
      ? Math.round(sessions.reduce((a, s) => a + s.wpm, 0) / sessions.length)
      : 0;

  const avgAcc =
    sessions.length > 0
      ? Math.round((sessions.reduce((a, s) => a + s.accuracy, 0) / sessions.length) * 10) / 10
      : 100;

  const totalMinutes = Math.round(
    sessions.reduce((a, s) => a + s.durationSeconds, 0) / 60
  );

  // Generate Smart Practice words based on user's weak keys
  const launchSmartPractice = () => {
    if (weakKeys.length === 0) {
      // Fallback if not enough samples yet
      const sample = ['خوش', 'باغ', 'ثواب', 'ضیافت', 'ظاہر', 'شام'];
      setActiveSmartPractice({
        title: 'Adaptive Drill: Foundational Keys',
        content: [sample.join(' '), sample.slice(0, 3).join(' ') + ' دل سے بولو۔'],
      });
      return;
    }

    const weakChars = weakKeys.map(k => k.urduChar);
    // Dynamic generated sentences emphasizing those weak characters
    const drillWords = [
      `مشق برائے: ${weakChars.join(' ')}`,
      weakChars.map(c => `${c}ا ${c}و ${c}ی ${c}ے`).join(' '),
      'خوشی سے محنت کرو اور وقت کی قدر کرو۔',
      'صبر اور شکر سے کام لو اور سچ بولو۔',
      'علم حاصل کرو اور اچھے اخلاق اپناؤ۔',
    ];

    setActiveSmartPractice({
      title: `Smart Practice: Keys (${weakChars.join('، ')})`,
      content: drillWords,
    });
  };

  if (activeSmartPractice) {
    return (
      <LessonPage
        lesson={{
          id: 999,
          title: activeSmartPractice.title,
          titleUrdu: 'سمارٹ پریکٹس (کمزور حروف)',
          description: 'Adaptive drill dynamically generated to fix your specific weak keys.',
          difficulty: 'Intermediate',
          category: 'Smart Practice',
          targetWpm: Math.max(25, avgWpm),
          targetAccuracy: 95,
          keysTrained: weakKeys.map(k => k.urduChar),
          content: activeSmartPractice.content,
        }}
        user={user}
        settings={settings}
        onBackToLessons={() => setActiveSmartPractice(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
          <Activity className="w-4 h-4" />
          <span>Keystroke Telemetry & Analytics</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
          Performance Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          In-depth key-level accuracy tracking, latency benchmarks, and adaptive practice recommendations.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Average Speed</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-white">
            {avgWpm} <span className="text-xs font-normal text-slate-400">WPM</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Overall Accuracy</span>
            <Target className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-emerald-400">
            {avgAcc}%
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Practice Time</span>
            <BarChart3 className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-purple-300">
            {totalMinutes} <span className="text-xs font-normal text-slate-400">mins</span>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Sessions Recorded</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black text-amber-300">
            {sessions.length}
          </div>
        </div>
      </div>

      {/* Smart Practice Recommendation Box */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-slate-900 border border-blue-800/40 rounded-3xl p-6 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>AI Weak Key Diagnostic</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            Personalized Smart Practice Available
          </h3>
          <p className="text-xs text-slate-300 max-w-xl mt-1">
            {weakKeys.length > 0 ? (
              <>
                Our telemetry detected lower accuracy on letters{' '}
                <strong className="text-amber-300 font-urdu text-base">
                  {weakKeys.map(w => w.urduChar).join('، ')}
                </strong>
                . Complete a 5-minute targeted drill to reinforce those specific fingers.
              </>
            ) : (
              'Complete more typing sessions to let the engine detect your individual weak key patterns.'
            )}
          </p>
        </div>

        <button
          onClick={launchSmartPractice}
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl text-xs flex items-center gap-2 shadow-lg shadow-blue-600/30 transition cursor-pointer shrink-0"
        >
          <span>Start Smart Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weak Keys List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left: Weak Keys Breakdown */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">Weak Key Detection</h3>
            </div>
            <span className="text-[11px] text-slate-500">Sorted by lowest accuracy</span>
          </div>

          {weakKeys.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {weakKeys.map(w => (
                <div key={w.urduChar} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center font-urdu text-xl font-bold text-amber-300">
                      {w.urduChar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">
                        Key: {w.key.toUpperCase()}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {w.totalPresses} attempts • avg latency {w.averageLatencyMs}ms
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div
                      className={`text-sm font-black ${
                        w.accuracy < 75
                          ? 'text-rose-400'
                          : w.accuracy < 85
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      {w.accuracy}%
                    </div>
                    <div className="text-[10px] text-slate-500">accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No weak keys identified yet. Continue practicing to generate diagnostic data.
            </div>
          )}
        </div>

        {/* Right: Recent Typing History */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">Recent Session Logs</h3>
            <span className="text-[11px] text-slate-500">Latest 5 sessions</span>
          </div>

          {sessions.length > 0 ? (
            <div className="divide-y divide-slate-800/80">
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-bold text-white">
                      {s.lessonTitle || `Session (${s.mode})`}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {new Date(s.createdAt).toLocaleDateString()} at{' '}
                      {new Date(s.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-white">
                      {s.wpm} <span className="text-[10px] font-normal text-slate-400">WPM</span>
                    </div>
                    <div className="text-[11px] text-emerald-400 font-semibold">
                      {s.accuracy}% Acc
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              No typing sessions recorded yet. Start a lesson to build your history!
            </div>
          )}
        </div>
      </div>

      {/* Interactive Key Accuracy Heatmap */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Key Accuracy Heatmap</h3>
            <p className="text-xs text-slate-400">
              Visualizes accuracy across all phonetic keys based on your personal keystrokes.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500"></span>
              <span className="text-slate-400">&gt; 90% (High)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-amber-500"></span>
              <span className="text-slate-400">80 - 90% (Medium)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500"></span>
              <span className="text-slate-400">&lt; 80% (Weak)</span>
            </div>
          </div>
        </div>

        {/* Mini Keyboard Heatmap */}
        <div className="flex flex-col gap-1.5 overflow-x-auto pb-2">
          {KEYBOARD_ROWS.slice(1, 4).map((row, rIdx) => (
            <div key={rIdx} className="flex gap-1.5 justify-center">
              {row.map(k => {
                const stat = keyStats[k.urduNormal];
                let bgClass = 'bg-slate-950 border-slate-800 text-slate-500';

                if (stat && stat.totalPresses >= 3) {
                  if (stat.accuracy >= 90) {
                    bgClass = 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300';
                  } else if (stat.accuracy >= 80) {
                    bgClass = 'bg-amber-950/60 border-amber-500/40 text-amber-300';
                  } else {
                    bgClass = 'bg-rose-950/60 border-rose-500/40 text-rose-300';
                  }
                }

                return (
                  <div
                    key={k.code}
                    className={`h-11 w-11 md:w-12 rounded-xl border flex flex-col items-center justify-center p-1 select-none transition ${bgClass}`}
                    title={
                      stat
                        ? `${k.urduNormal} (${k.normal.toUpperCase()}): ${stat.accuracy}% accuracy (${stat.totalPresses} presses)`
                        : `${k.urduNormal} (${k.normal.toUpperCase()}): No data yet`
                    }
                  >
                    <span className="text-[10px] font-mono font-bold opacity-75">
                      {k.normal.toUpperCase()}
                    </span>
                    <span className="font-urdu text-sm font-bold">
                      {k.urduNormal}
                    </span>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
