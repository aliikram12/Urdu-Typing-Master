import React, { useState } from 'react';
import { Lesson, DifficultyLevel, UserProfile } from '../../types';
import { LESSONS } from '../../data/lessons';
import { storage } from '../../core/storage';
import { BookOpen, CheckCircle, Star, ArrowRight, Award } from 'lucide-react';

interface LessonsListProps {
  user: UserProfile;
  onSelectLesson: (lesson: Lesson) => void;
}

const DIFFICULTIES: ('All' | DifficultyLevel)[] = [
  'All',
  'Beginner',
  'Foundation',
  'Intermediate',
  'Advanced',
  'Professional',
];

export const LessonsList: React.FC<LessonsListProps> = ({ user, onSelectLesson }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'All' | DifficultyLevel>('All');
  const progressMap = storage.getLessonProgress(user.id);

  const filtered = LESSONS.filter(
    l => selectedDifficulty === 'All' || l.difficulty === selectedDifficulty
  );

  const totalCompleted = Object.values(progressMap).filter(p => p.completed).length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
            <BookOpen className="w-4 h-4" />
            <span>Urdu Typing Curriculum</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white mt-1">
            Lessons & Skill Pathway
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Progress from basic characters to high-speed transcription in 25 curated modules.
          </p>
        </div>

        {/* Overall Curriculum Progress Metric */}
        <div className="bg-slate-900/90 border border-slate-800 px-4 py-3 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Curriculum Progress</div>
            <div className="text-xl font-black text-white">
              {totalCompleted} <span className="text-xs text-slate-400 font-normal">/ {LESSONS.length} Completed</span>
            </div>
          </div>
        </div>
      </div>

      {/* Difficulty Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-none">
        {DIFFICULTIES.map(diff => (
          <button
            key={diff}
            onClick={() => setSelectedDifficulty(diff)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
              selectedDifficulty === diff
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
            }`}
          >
            {diff === 'All' ? 'All Lessons (25)' : diff}
          </button>
        ))}
      </div>

      {/* Lesson Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(lesson => {
          const progress = progressMap[lesson.id];
          const isCompleted = progress?.completed;

          return (
            <div
              key={lesson.id}
              className={`flex flex-col justify-between p-5 rounded-2xl border transition-all duration-200 ${
                isCompleted
                  ? 'bg-slate-900/90 border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                  : 'bg-slate-900/70 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
                    Lesson {lesson.id.toString().padStart(2, '0')}
                  </span>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Passed</span>
                      {progress?.stars > 0 && (
                        <div className="flex items-center text-amber-400 ml-1">
                          {Array.from({ length: progress.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Target: {lesson.targetWpm} WPM
                    </span>
                  )}
                </div>

                {/* Lesson Title & Urdu Name */}
                <h3 className="text-base font-bold text-white group-hover:text-blue-400 transition">
                  {lesson.title}
                </h3>
                <div className="font-urdu text-sm text-slate-400 font-bold mb-2">
                  {lesson.titleUrdu}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-3">
                  {lesson.description}
                </p>

                {/* Letters Trained Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-slate-500 mr-1">Keys:</span>
                  {lesson.keysTrained.slice(0, 6).map((k, i) => (
                    <span
                      key={i}
                      className="font-urdu text-xs font-bold bg-slate-800 text-sky-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      {k}
                    </span>
                  ))}
                  {lesson.keysTrained.length > 6 && (
                    <span className="text-[10px] text-slate-500">+{lesson.keysTrained.length - 6}</span>
                  )}
                </div>
              </div>

              {/* Card Bottom CTA & Stats */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                {isCompleted ? (
                  <div className="text-xs">
                    <span className="text-slate-500">Best: </span>
                    <span className="text-white font-bold">{progress?.bestWpm} WPM</span>
                    <span className="text-slate-500 ml-2">Acc: </span>
                    <span className="text-emerald-400 font-bold">{progress?.bestAccuracy}%</span>
                  </div>
                ) : (
                  <div className="text-xs text-slate-500">
                    Difficulty: <span className="text-slate-300 font-semibold">{lesson.difficulty}</span>
                  </div>
                )}

                <button
                  onClick={() => onSelectLesson(lesson)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow shadow-blue-600/20 cursor-pointer"
                >
                  <span>{isCompleted ? 'Practice Again' : 'Start'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
