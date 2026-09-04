import React, { useState } from 'react';
import { ChevronDown, PlayCircle, FileText, Lock, Eye } from 'lucide-react';
import { Badge } from '../common/Badge';

export const CurriculumAccordion = ({ sections = [], onPreviewLesson = null }) => {
  const [openSections, setOpenSections] = useState({ 0: true });

  const toggleSection = (index) => {
    setOpenSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const expandAll = () => {
    const all = {};
    sections.forEach((_, idx) => (all[idx] = true));
    setOpenSections(all);
  };

  const collapseAll = () => {
    setOpenSections({});
  };

  const totalLessons = sections.reduce(
    (acc, sec) => acc + (sec.lessons ? sec.lessons.length : 0),
    0
  );

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
        <span>
          {sections.length} sections • {totalLessons} lectures
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={expandAll}
            className="text-indigo-600 hover:text-indigo-700 font-bold"
          >
            Expand all
          </button>
          <span>•</span>
          <button
            onClick={collapseAll}
            className="text-slate-500 hover:text-slate-700 font-medium"
          >
            Collapse all
          </button>
        </div>
      </div>

      {/* Accordion Sections */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200 bg-white">
        {sections.map((section, sIdx) => {
          const isOpen = openSections[sIdx];
          const sectionDuration = section.lessons
            ? section.lessons.reduce((acc, l) => acc + (l.duration || 0), 0)
            : 0;

          return (
            <div key={section._id || sIdx} className="transition-colors">
              {/* Section Header */}
              <button
                type="button"
                onClick={() => toggleSection(sIdx)}
                className="w-full px-5 py-4 flex items-center justify-between bg-slate-50 hover:bg-slate-100/80 text-left transition-colors"
              >
                <div className="flex items-center gap-3 flex-1 pr-4">
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'transform rotate-180 text-indigo-600' : ''
                    }`}
                  />
                  <h4 className="font-bold text-sm text-slate-900">
                    {section.title}
                  </h4>
                </div>
                <div className="text-xs text-slate-500 font-medium whitespace-nowrap">
                  {section.lessons?.length || 0} lectures • {sectionDuration} mins
                </div>
              </button>

              {/* Lessons List */}
              {isOpen && (
                <div className="divide-y divide-slate-100 bg-white">
                  {section.lessons && section.lessons.length > 0 ? (
                    section.lessons.map((lesson, lIdx) => (
                      <div
                        key={lesson._id || lIdx}
                        className="px-5 py-3.5 flex items-center justify-between hover:bg-slate-50/70 transition-colors text-xs"
                      >
                        <div className="flex items-center gap-3 flex-1 pr-4">
                          <PlayCircle
                            size={16}
                            className="text-slate-400 shrink-0"
                          />
                          <span className="font-medium text-slate-700">
                            {lesson.title}
                          </span>
                          {lesson.resources && lesson.resources.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                              <FileText size={11} />
                              {lesson.resources.length} resources
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          {lesson.isPreview ? (
                            <button
                              type="button"
                              onClick={() =>
                                onPreviewLesson && onPreviewLesson(lesson)
                              }
                              className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-bold hover:underline"
                            >
                              <Eye size={13} />
                              Preview
                            </button>
                          ) : (
                            <Lock size={13} className="text-slate-300" />
                          )}
                          <span className="text-slate-400 font-medium">
                            {lesson.duration || 10}m
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="px-5 py-3 text-xs text-slate-400 italic">
                      No lectures added yet in this section.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
