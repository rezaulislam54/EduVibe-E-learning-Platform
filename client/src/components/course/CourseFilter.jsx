import React from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Web Development',
  'Mobile Development',
  'Data Science & AI',
  'Cloud & DevOps',
  'Design & UI/UX',
  'Cybersecurity',
  'Business & Marketing',
];

const LEVELS = ['All Levels', 'Beginner', 'Intermediate', 'Advanced'];

export const CourseFilter = ({
  filters,
  onFilterChange,
  onResetFilters,
  totalResults = 0,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-indigo-600" />
          <h3 className="font-bold text-slate-900 text-sm">Filters</h3>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-slate-500 hover:text-indigo-600 font-medium flex items-center gap-1 transition-colors"
        >
          <RotateCcw size={12} />
          Reset All
        </button>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Category
        </label>
        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <label
              key={cat}
              className="flex items-center justify-between text-xs text-slate-700 hover:text-indigo-600 cursor-pointer py-1 px-1.5 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="category"
                  checked={(filters.category || 'All') === cat}
                  onChange={() => onFilterChange('category', cat)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span className={filters.category === cat ? 'font-bold text-indigo-600' : ''}>
                  {cat}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Level */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Level
        </label>
        <div className="space-y-1.5">
          {LEVELS.map((lvl) => (
            <label
              key={lvl}
              className="flex items-center gap-2 text-xs text-slate-700 hover:text-indigo-600 cursor-pointer py-0.5 px-1.5 rounded-lg hover:bg-slate-50"
            >
              <input
                type="radio"
                name="level"
                checked={(filters.level || 'All Levels') === lvl}
                onChange={() => onFilterChange('level', lvl)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className={filters.level === lvl ? 'font-bold text-indigo-600' : ''}>
                {lvl}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Pricing
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'paid', label: 'Paid' },
            { id: 'free', label: 'Free' },
          ].map((pt) => (
            <button
              key={pt.id}
              type="button"
              onClick={() => onFilterChange('priceType', pt.id)}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                (filters.priceType || 'all') === pt.id
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {pt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Minimum Rating */}
      <div className="pt-2 border-t border-slate-100">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
          Ratings
        </label>
        <div className="space-y-1.5">
          {[
            { val: '', label: 'All Ratings' },
            { val: '4.5', label: '⭐ 4.5 & up' },
            { val: '4.0', label: '⭐ 4.0 & up' },
            { val: '3.5', label: '⭐ 3.5 & up' },
          ].map((rate) => (
            <label
              key={rate.val}
              className="flex items-center gap-2 text-xs text-slate-700 hover:text-indigo-600 cursor-pointer py-0.5 px-1.5"
            >
              <input
                type="radio"
                name="rating"
                checked={(filters.minRating || '') === rate.val}
                onChange={() => onFilterChange('minRating', rate.val)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className={filters.minRating === rate.val ? 'font-bold text-indigo-600' : ''}>
                {rate.label}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
