import React, { useState } from 'react';
import {
  ChevronDown,
  CheckCircle2,
  Circle,
  PlayCircle,
  Award,
  BookOpen,
} from 'lucide-react';

export const CurriculumSidebar = ({
  course,
  activeLessonId,
  completedLessons = [],
  progressPercentage = 0,
  onSelectLesson,
  onToggleComplete,
  onOpenCertificate,
}) => {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalLessons = course?.sections
    ? course.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
    : 0;

  const isComplete = progressPercentage === 100;

  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-200">
      {/* Sidebar Header with Progress Bar */}
      <div className="p-5 border-b border-slate-200 bg-slate-50/70">
        <h3 className="font-black text-sm text-slate-900 line-clamp-1 mb-2">
          {course?.title}
        </h3>

        {/* Progress bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-600">Course Progress</span>
            <span className="font-extrabold text-indigo-600">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-[11px] text-slate-400">
            {completedLessons.length} of {totalLessons} lectures completed
          </p>
        </div>

        {/* Certificate Button */}
        {isComplete && (
          <button
            type="button"
            onClick={onOpenCertificate}
            className="mt-3 w-full py-2 px-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 animate-bounce"
          >
            <Award size={15} />
            View Certificate
          </button>
        )}
      </div>

      {/* Sections and Lessons Accordion */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
        {course?.sections?.map((section, sIdx) => {
          const isOpen = openSections[sIdx] !== false;
          const sectionCompletedCount =
            section.lessons?.filter((l) =>
              completedLessons.includes(l._id.toString())
            ).length || 0;

          return (
            <div key={section._id || sIdx}>
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(sIdx)}
                className="w-full px-4 py-3 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/70 text-left transition-colors"
              >
                <div className="flex items-center gap-2 flex-1 pr-2">
                  <ChevronDown
                    size={15}
                    className={`text-slate-400 transition-transform ${
                      isOpen ? 'transform rotate-180 text-indigo-600' : ''
                    }`}
                  />
                  <span className="font-bold text-xs text-slate-800 line-clamp-1">
                    Section {sIdx + 1}: {section.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">
                  {sectionCompletedCount}/{section.lessons?.length || 0}
                </span>
              </button>

              {/* Lessons */}
              {isOpen && (
                <div className="divide-y divide-slate-50 bg-white">
                  {section.lessons?.map((lesson, lIdx) => {
                    const isCompleted = completedLessons.includes(
                      lesson._id.toString()
                    );
                    const isActive =
                      activeLessonId &&
                      activeLessonId.toString() === lesson._id.toString();

                    return (
                      <div
                        key={lesson._id || lIdx}
                        className={`px-4 py-3 flex items-center justify-between gap-3 text-xs transition-colors cursor-pointer ${
                          isActive
                            ? 'bg-indigo-50/80 border-l-4 border-indigo-600'
                            : 'hover:bg-slate-50'
                        }`}
                        onClick={() => onSelectLesson(lesson)}
                      >
                        <div className="flex items-center gap-2.5 flex-1">
                          {/* Complete Checkbox Toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleComplete(lesson._id, !isCompleted);
                            }}
                            className="text-slate-300 hover:text-indigo-600 transition-colors shrink-0"
                          >
                            {isCompleted ? (
                              <CheckCircle2
                                size={17}
                                className="text-emerald-500 fill-emerald-50"
                              />
                            ) : (
                              <Circle size={17} className="text-slate-300" />
                            )}
                          </button>

                          <span
                            className={`line-clamp-2 ${
                              isActive
                                ? 'font-bold text-indigo-900'
                                : isCompleted
                                ? 'text-slate-500'
                                : 'text-slate-800'
                            }`}
                          >
                            {lIdx + 1}. {lesson.title}
                          </span>
                        </div>

                        <span className="text-[11px] text-slate-400 shrink-0 font-medium">
                          {lesson.duration || 10}m
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
