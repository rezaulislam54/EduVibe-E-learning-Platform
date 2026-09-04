import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <GraduationCap size={32} />
        </div>
        <h1 className="text-6xl font-black text-slate-900 tracking-tight">
          404
        </h1>
        <h2 className="text-xl font-bold text-slate-800">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          The classroom or page you are looking for might have been moved, renamed, or is currently unavailable.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl shadow-md transition-all hover:scale-105"
        >
          <ArrowLeft size={16} />
          Return Home
        </Link>
      </div>
    </div>
  );
};
