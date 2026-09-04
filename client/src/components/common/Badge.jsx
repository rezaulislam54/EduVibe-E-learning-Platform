import React from 'react';

export const Badge = ({ children, variant = 'primary', size = 'sm', className = '' }) => {
  const variants = {
    primary: 'bg-indigo-50 text-indigo-700 border-indigo-200/60',
    secondary: 'bg-purple-50 text-purple-700 border-purple-200/60',
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
    warning: 'bg-amber-50 text-amber-700 border-amber-200/60',
    danger: 'bg-rose-50 text-rose-700 border-rose-200/60',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200',
    dark: 'bg-slate-900 text-white border-slate-800',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[10px] font-semibold',
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border ${variants[variant] || variants.primary} ${sizes[size] || sizes.sm} ${className}`}
    >
      {children}
    </span>
  );
};
