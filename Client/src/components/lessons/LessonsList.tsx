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
    <div className="max-w-6xl mx-auto px-4 py-6 select-none">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#38BDF8]">
            <BookOpen className="w-4 h-4" />
            <span>Urdu Typing Curriculum</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-[#F8FAFC] mt-1">
            Lessons & Skill Pathway
          </h1>
          <p className="text-sm text-[#94A3B8] mt-1">
            Progress from basic characters to high-speed transcription in 25 curated modules.
          </p>
        </div>

        {/* Overall Curriculum Progress Metric */}
        <div className="neu-card px-5 py-3.5 rounded-2xl flex items-center gap-4 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-[#2563EB]/15 border border-[#2563EB]/30 flex items-center justify-center text-[#38BDF8] shadow-sm">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-[#94A3B8] font-medium">Curriculum Progress</div>
            <div className="text-xl font-black text-[#F8FAFC]">
              {totalCompleted} <span className="text-xs text-[#94A3B8] font-normal">/ {LESSONS.length} Completed</span>
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
                ? 'neu-btn-primary shadow-md'
                : 'neu-btn-secondary text-[#94A3B8] hover:text-[#F8FAFC]'
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
              className={`flex flex-col justify-between p-5 rounded-2xl transition-all duration-200 ${
                isCompleted
                  ? 'neu-card border-emerald-500/30 shadow-[0_8px_20px_rgba(16,185,129,0.1)]'
                  : 'neu-card-interactive'
              }`}
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#38BDF8] bg-[#38BDF8]/10 px-2.5 py-0.5 rounded-full border border-[#38BDF8]/20">
                    Lesson {lesson.id.toString().padStart(2, '0')}
                  </span>
                  
                  {isCompleted ? (
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>Passed</span>
                      {progress?.stars > 0 && (
                        <div className="flex items-center text-[#FACC15] ml-1">
                          {Array.from({ length: progress.stars }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-[#FACC15] text-[#FACC15]" />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-[#64748B] font-medium">
                      Target: {lesson.targetWpm} WPM
                    </span>
                  )}
                </div>

                {/* Lesson Title & Urdu Name */}
                <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#38BDF8] transition">
                  {lesson.title}
                </h3>
                <div className="font-urdu text-lg text-[#FACC15] font-bold mb-2">
                  {lesson.titleUrdu}
                </div>

                <p className="text-xs text-[#94A3B8] leading-relaxed line-clamp-2 mb-3">
                  {lesson.description}
                </p>

                {/* Letters Trained Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  <span className="text-[10px] uppercase font-bold text-[#64748B] mr-1">Keys:</span>
                  {lesson.keysTrained.slice(0, 6).map((k, i) => (
                    <span
                      key={i}
                      className="font-urdu text-xs font-bold neu-inset text-[#38BDF8] px-2 py-0.5 rounded-lg"
                    >
                      {k}
                    </span>
                  ))}
                  {lesson.keysTrained.length > 6 && (
                    <span className="text-[10px] text-[#64748B]">+{lesson.keysTrained.length - 6}</span>
                  )}
                </div>
              </div>

              {/* Card Bottom CTA & Stats */}
              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
                {isCompleted ? (
                  <div className="text-xs">
                    <span className="text-[#64748B]">Best: </span>
                    <span className="text-[#F8FAFC] font-bold">{progress?.bestWpm} WPM</span>
                    <span className="text-[#64748B] ml-2">Acc: </span>
                    <span className="text-emerald-400 font-bold">{progress?.bestAccuracy}%</span>
                  </div>
                ) : (
                  <div className="text-xs text-[#64748B]">
                    Difficulty: <span className="text-[#94A3B8] font-semibold">{lesson.difficulty}</span>
                  </div>
                )}

                <button
                  onClick={() => onSelectLesson(lesson)}
                  className="neu-btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer"
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
