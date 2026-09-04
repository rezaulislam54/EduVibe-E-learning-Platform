import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { CourseCard } from '../components/course/CourseCard';
import { CourseFilter } from '../components/course/CourseFilter';
import { Loader } from '../components/common/Loader';
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';

export const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state from URL query
  const category = searchParams.get('category') || 'All';
  const level = searchParams.get('level') || 'All Levels';
  const priceType = searchParams.get('priceType') || 'all';
  const minRating = searchParams.get('minRating') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'newest';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  // Fetch courses with current filters
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (level && level !== 'All Levels') params.append('level', level);
      if (priceType && priceType !== 'all') params.append('priceType', priceType);
      if (minRating) params.append('minRating', minRating);
      if (search) params.append('search', search);
      if (sort) params.append('sort', sort);
      params.append('page', page.toString());
      params.append('limit', '9');

      const res = await api.get(`/courses?${params.toString()}`);
      setCourses(res.courses || []);
      setTotal(res.total || 0);
      setTotalPages(res.totalPages || 1);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [category, level, priceType, minRating, search, sort, page]);

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All' && value !== 'All Levels' && value !== 'all') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchParams({});
    setSearchInput('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleFilterChange('search', searchInput.trim());
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="space-y-2 max-w-xl relative z-10">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
            Course Catalog
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Explore All Technologies & Domains
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Discover {total} career-accelerating courses with full-stack curricula and verifiable certificates.
          </p>
        </div>

        {/* Search input in banner */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full md:w-80 relative flex items-center z-10"
        >
          <input
            type="text"
            placeholder="Search catalog..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-800/90 border border-slate-700 text-white rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <Search size={16} className="absolute left-3.5 text-slate-400" />
        </form>
      </div>

      {/* Main Grid: Sidebar + Courses */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <div className="sticky top-24">
            <CourseFilter
              filters={{ category, level, priceType, minRating }}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              totalResults={total}
            />
          </div>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center justify-between">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 flex items-center gap-2 shadow-xs"
          >
            <SlidersHorizontal size={14} />
            Filters {category !== 'All' ? '(Active)' : ''}
          </button>
          <span className="text-xs text-slate-500 font-medium">
            Showing {courses.length} of {total} courses
          </span>
        </div>

        {/* Mobile Filter Drawer */}
        {mobileFilterOpen && (
          <div className="lg:hidden">
            <CourseFilter
              filters={{ category, level, priceType, minRating }}
              onFilterChange={(k, v) => {
                handleFilterChange(k, v);
                setMobileFilterOpen(false);
              }}
              onResetFilters={() => {
                handleResetFilters();
                setMobileFilterOpen(false);
              }}
              totalResults={total}
            />
          </div>
        )}

        {/* Courses Listing */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Controls Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80">
            <span className="text-xs font-semibold text-slate-600">
              Showing <strong className="text-slate-900">{courses.length}</strong> of{' '}
              <strong className="text-slate-900">{total}</strong> results
            </span>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <ArrowUpDown size={14} className="text-slate-400" />
              <label htmlFor="sortSelect" className="text-xs text-slate-500 font-medium">Sort by:</label>
              <select
                id="sortSelect"
                value={sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="newest">Newest Releases</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Courses Grid */}
          {loading ? (
            <Loader text="Loading course catalog..." />
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
              <p className="text-base font-bold text-slate-700">
                No courses matched your search criteria
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Try loosening your filters, choosing a different category, or resetting your search.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handleFilterChange('page', pageNum.toString())}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                      page === pageNum
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
