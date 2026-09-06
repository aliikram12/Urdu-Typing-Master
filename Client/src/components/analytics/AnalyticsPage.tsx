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
    <div className="max-w-6xl mx-auto px-4 py-8 select-none">
      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider neu-badge-blue px-3 py-1 mb-3">
          <Activity className="w-4 h-4 text-[#38BDF8]" />
          <span>Keystroke Telemetry & Analytics</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-[#F8FAFC] tracking-tight">
          Performance Analytics
        </h1>
        <p className="text-sm text-[#94A3B8] mt-2 max-w-2xl leading-relaxed">
          In-depth key-level accuracy tracking, latency benchmarks, and adaptive practice recommendations.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-3 font-semibold">
            <span>Average Speed</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#F8FAFC]">
            {avgWpm} <span className="text-xs font-bold text-[#64748B]">WPM</span>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-3 font-semibold">
            <span>Overall Accuracy</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center">
              <Target className="w-4 h-4 text-[#38BDF8]" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#38BDF8]">
            {avgAcc}%
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-3 font-semibold">
            <span>Practice Time</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-[#2563EB]" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#F8FAFC]">
            {totalMinutes} <span className="text-xs font-bold text-[#64748B]">mins</span>
          </div>
        </div>

        <div className="neu-card p-5 rounded-2xl">
          <div className="flex items-center justify-between text-[#94A3B8] text-xs mb-3 font-semibold">
            <span>Sessions Recorded</span>
            <div className="w-8 h-8 rounded-lg neu-inset flex items-center justify-center">
              <Zap className="w-4 h-4 text-[#FACC15]" />
            </div>
          </div>
          <div className="text-2xl md:text-3xl font-black text-[#FACC15]">
            {sessions.length}
          </div>
        </div>
      </div>

      {/* Smart Practice Recommendation Box */}
      <div className="neu-card-raised rounded-3xl p-7 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 border border-[#2563EB]/40">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider neu-badge-cyan px-2.5 py-0.5 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#38BDF8]" />
            <span>AI Weak Key Diagnostic</span>
          </div>
          <h3 className="text-xl font-bold text-[#F8FAFC]">
            Personalized Smart Practice Available
          </h3>
          <p className="text-xs text-[#94A3B8] max-w-xl mt-1.5 leading-relaxed">
            {weakKeys.length > 0 ? (
              <>
                Our telemetry detected lower accuracy on letters{' '}
                <strong className="text-[#FACC15] font-urdu text-lg font-bold">
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
          className="neu-btn-accent px-6 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 cursor-pointer shrink-0"
        >
          <span>Start Smart Practice</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weak Keys List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Left: Weak Keys Breakdown */}
        <div className="neu-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#FACC15]" />
              <h3 className="text-base font-bold text-[#F8FAFC]">Weak Key Detection</h3>
            </div>
            <span className="text-[11px] text-[#64748B]">Sorted by lowest accuracy</span>
          </div>

          {weakKeys.length > 0 ? (
            <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-slate-800/70">
              {weakKeys.map(w => (
                <div key={w.urduChar} className="p-3.5 flex items-center justify-between hover:bg-[#111C31]/40 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl neu-card flex items-center justify-center font-urdu text-xl font-black text-[#FACC15] border border-[#FACC15]/30">
                      {w.urduChar}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F8FAFC]">
                        Key: {w.key.toUpperCase()}
                      </div>
                      <div className="text-[11px] text-[#64748B]">
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
                          ? 'text-[#FACC15]'
                          : 'text-[#38BDF8]'
                      }`}
                    >
                      {w.accuracy}%
                    </div>
                    <div className="text-[10px] text-[#64748B] uppercase font-bold">accuracy</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neu-inset rounded-2xl p-8 text-center text-xs text-[#64748B]">
              No weak keys identified yet. Continue practicing to generate diagnostic data.
            </div>
          )}
        </div>

        {/* Right: Recent Typing History */}
        <div className="neu-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#F8FAFC]">Recent Session Logs</h3>
            <span className="text-[11px] text-[#64748B]">Latest 5 sessions</span>
          </div>

          {sessions.length > 0 ? (
            <div className="neu-inset rounded-2xl overflow-hidden divide-y divide-slate-800/70">
              {sessions.slice(0, 5).map(s => (
                <div key={s.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#111C31]/40 transition">
                  <div>
                    <div className="font-bold text-[#F8FAFC]">
                      {s.lessonTitle || `Session (${s.mode})`}
                    </div>
                    <div className="text-[11px] text-[#64748B]">
                      {new Date(s.createdAt).toLocaleDateString()} at{' '}
                      {new Date(s.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-black text-[#F8FAFC]">
                      {s.wpm} <span className="text-[10px] font-bold text-[#64748B]">WPM</span>
                    </div>
                    <div className="text-[11px] text-[#38BDF8] font-bold">
                      {s.accuracy}% Acc
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="neu-inset rounded-2xl p-8 text-center text-xs text-[#64748B]">
              No typing sessions recorded yet. Start a lesson to build your history!
            </div>
          )}
        </div>
      </div>

      {/* Interactive Key Accuracy Heatmap */}
      <div className="neu-card rounded-3xl p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold text-[#F8FAFC]">Key Accuracy Heatmap</h3>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Visualizes accuracy across all phonetic keys based on your personal keystrokes.
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#38BDF8]"></span>
              <span className="text-[#94A3B8]">&gt; 90% (High)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FACC15]"></span>
              <span className="text-[#94A3B8]">80 - 90% (Medium)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500"></span>
              <span className="text-[#94A3B8]">&lt; 80% (Weak)</span>
            </div>
          </div>
        </div>

        {/* Mini Keyboard Heatmap Bay */}
        <div className="neu-inset p-5 rounded-2xl overflow-x-auto bg-[#080D18]">
          <div className="flex flex-col gap-2 min-w-[500px]">
            {KEYBOARD_ROWS.slice(1, 4).map((row, rIdx) => (
              <div key={rIdx} className="flex gap-2 justify-center">
                {row.map(k => {
                  const stat = keyStats[k.urduNormal];
                  let keycapColorClass = 'text-[#64748B] border-slate-700/60 bg-[#111C31]';

                  if (stat && stat.totalPresses >= 3) {
                    if (stat.accuracy >= 90) {
                      keycapColorClass = 'bg-[#111C31] border-[#38BDF8]/60 text-[#38BDF8] shadow-[0_0_10px_rgba(56,189,248,0.25)]';
                    } else if (stat.accuracy >= 80) {
                      keycapColorClass = 'bg-[#111C31] border-[#FACC15]/60 text-[#FACC15] shadow-[0_0_10px_rgba(250,204,21,0.25)]';
                    } else {
                      keycapColorClass = 'bg-[#111C31] border-rose-500/60 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.25)]';
                    }
                  }

                  return (
                    <div
                      key={k.code}
                      className={`neu-keycap h-12 w-12 md:w-13 rounded-xl flex flex-col items-center justify-center p-1 select-none transition-all ${keycapColorClass}`}
                      title={
                        stat
                          ? `${k.urduNormal} (${k.normal.toUpperCase()}): ${stat.accuracy}% accuracy (${stat.totalPresses} presses)`
                          : `${k.urduNormal} (${k.normal.toUpperCase()}): No data yet`
                      }
                    >
                      <span className="text-[10px] font-mono font-black opacity-80">
                        {k.normal.toUpperCase()}
                      </span>
                      <span className="font-urdu text-sm font-black">
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
    </div>
  );
};
