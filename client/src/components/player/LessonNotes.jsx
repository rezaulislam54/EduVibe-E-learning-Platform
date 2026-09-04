import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';

export const LessonNotes = ({
  courseId,
  lessonId,
  lessonTitle,
  initialNotes = [],
}) => {
  const [currentNote, setCurrentNote] = useState('');
  const [allNotes, setAllNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setAllNotes(initialNotes);
    const existing = initialNotes.find(
      (n) => n.lessonId?.toString() === lessonId?.toString()
    );
    setCurrentNote(existing ? existing.noteText : '');
  }, [lessonId, initialNotes]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentNote.trim()) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const res = await api.post(`/enrollments/course/${courseId}/notes`, {
        lessonId,
        lessonTitle,
        noteText: currentNote.trim(),
      });
      setAllNotes(res.notes || []);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Note Editor */}
      <form
        onSubmit={handleSave}
        className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs space-y-3"
      >
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FileText size={16} className="text-indigo-600" />
            Notes for: <span className="text-indigo-600">{lessonTitle}</span>
          </h4>

          {savedSuccess && (
            <span className="text-xs text-emerald-600 font-bold flex items-center gap-1 animate-pulse">
              <CheckCircle2 size={13} /> Saved
            </span>
          )}
        </div>

        <textarea
          rows={6}
          placeholder="Take timestamped lecture notes, copy key snippets, or write reminders for yourself..."
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-mono leading-relaxed"
        ></textarea>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving || !currentNote.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
          >
            <Save size={13} />
            {saving ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </form>

      {/* All Course Notes */}
      <div className="space-y-3">
        <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500">
          All Saved Notes ({allNotes.length})
        </h4>

        {allNotes.length > 0 ? (
          allNotes.map((note, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl p-4 shadow-xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-indigo-900">
                  {note.lessonTitle || 'Lecture Note'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-xs text-slate-600 whitespace-pre-wrap font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {note.noteText}
              </p>
            </div>
          ))
        ) : (
          <p className="text-xs text-slate-400 italic">
            No notes taken for this course yet.
          </p>
        )}
      </div>
    </div>
  );
};
