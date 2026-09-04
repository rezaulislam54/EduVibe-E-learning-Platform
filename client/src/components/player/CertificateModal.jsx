import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, Download, Printer, X, ShieldCheck } from 'lucide-react';

export const CertificateModal = ({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  instructorName,
  certificateId = 'EDU-2026-X77A9',
  completionDate = new Date(),
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire celebratory confetti!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors z-20 print:hidden"
        >
          <X size={18} />
        </button>

        {/* Certificate Card */}
        <div className="p-8 sm:p-12 text-center relative border-8 border-double border-indigo-900/20 m-3 sm:m-6 bg-gradient-to-b from-amber-50/40 via-white to-indigo-50/30 rounded-2xl">
          
          {/* Top Seal */}
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-white shadow-lg shadow-amber-500/30">
            <Award size={32} className="stroke-[2]" />
          </div>

          <p className="text-xs font-black uppercase tracking-widest text-amber-700 mb-1">
            EduVibe Academy of Technology
          </p>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-slate-900 tracking-tight mb-4">
            Certificate of Completion
          </h2>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-6">
            This is proudly presented to
          </p>

          {/* Student Name */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-indigo-700 pb-2 border-b-2 border-indigo-200 inline-block px-8 mb-6 font-serif">
            {studentName || 'Valued Learner'}
          </h3>

          {/* Course Details */}
          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
            For successfully completing all lectures, practical exercises, and mastery curriculum in:
          </p>
          <h4 className="text-lg sm:text-xl font-bold text-slate-900 mb-8 max-w-xl mx-auto">
            "{courseTitle}"
          </h4>

          {/* Signatures & Verification Info */}
          <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-200/80 max-w-lg mx-auto text-left">
            <div>
              <p className="font-serif italic font-bold text-slate-800 text-sm">
                {instructorName || 'Lead Instructor'}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Course Instructor
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono font-bold text-slate-800">
                {new Date(completionDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">
                Date Completed
              </p>
            </div>
          </div>

          {/* Verification Code */}
          <div className="mt-8 pt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-mono">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Verifiable ID: <strong className="text-slate-700">{certificateId}</strong></span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-slate-50 px-8 py-4 flex items-center justify-end gap-3 border-t border-slate-100 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Printer size={14} />
            Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
};
