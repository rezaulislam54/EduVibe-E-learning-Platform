import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LayoutDashboard,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  PlusCircle,
  Award,
  Search,
  ChevronDown,
  Info,
  Users,
  LifeBuoy
} from 'lucide-react';
import { Badge } from '../common/Badge';

export const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap size={22} className="stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                Edu<span className="text-indigo-600">Vibe</span>
              </span>
              <span className="text-[10px] font-semibold text-slate-400 -mt-1 tracking-wider uppercase">
                E-Learning
              </span>
            </div>
          </Link>

          {/* Search Bar - Desktop */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-sm relative items-center"
          >
            <input
              type="text"
              placeholder="Search courses, skills, roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <Search
              size={17}
              className="absolute left-3.5 text-slate-400 pointer-events-none"
            />
          </form>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5">
            <Link
              to="/courses"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/courses')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <BookOpen size={16} />
              Courses
            </Link>

            <Link
              to="/instructors"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/instructors')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Users size={16} />
              Instructors
            </Link>

            <Link
              to="/about"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/about')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <Info size={16} />
              About
            </Link>

            <Link
              to="/contact"
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                isActive('/contact')
                  ? 'text-indigo-600'
                  : 'text-slate-600 hover:text-indigo-600'
              }`}
            >
              <LifeBuoy size={16} />
              Help & Contact
            </Link>

            {isAuthenticated && user?.role === 'student' && (
              <>
                <Link
                  to="/my-learning"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/my-learning')
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <GraduationCap size={16} />
                  My Learning
                </Link>
                <Link
                  to="/certificates"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/certificates')
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <Award size={16} />
                  Certificates
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'instructor' && (
              <>
                <Link
                  to="/instructor/dashboard"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/instructor/dashboard')
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <LayoutDashboard size={16} />
                  Instructor Hub
                </Link>
                <Link
                  to="/instructor/create-course"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all"
                >
                  <PlusCircle size={15} />
                  New Course
                </Link>
              </>
            )}

            {isAuthenticated && user?.role === 'admin' && (
              <>
                <Link
                  to="/admin/dashboard"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/admin/dashboard')
                      ? 'text-indigo-600'
                      : 'text-slate-600 hover:text-indigo-600'
                  }`}
                >
                  <ShieldCheck size={16} />
                  Admin Panel
                </Link>
                <Link
                  to="/instructor/create-course"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg text-xs font-bold transition-all"
                >
                  <PlusCircle size={15} />
                  + Add Course
                </Link>
              </>
            )}
          </nav>

          {/* Auth Controls / User Profile Dropdown */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                    alt={user?.name}
                    className="w-9 h-9 rounded-full object-cover ring-2 ring-indigo-500/30 shadow-sm"
                  />
                  <div className="hidden md:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight">
                      {user?.name}
                    </span>
                    <span className="text-[10px] font-semibold uppercase text-indigo-600">
                      {user?.role}
                    </span>
                  </div>
                  <ChevronDown size={14} className="text-slate-400 hidden md:block" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user?.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <Badge
                          variant={
                            user?.role === 'admin'
                              ? 'danger'
                              : user?.role === 'instructor'
                              ? 'secondary'
                              : 'primary'
                          }
                          size="xs"
                          className="mt-1.5"
                        >
                          {user?.role?.toUpperCase()}
                        </Badge>
                      </div>

                      <div className="py-1">
                        <Link
                          to="/profile"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <User size={16} />
                          My Profile
                        </Link>

                        <Link
                          to="/verify-certificate"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                        >
                          <ShieldCheck size={16} />
                          Verify Certificate
                        </Link>

                        {user?.role === 'student' && (
                          <Link
                            to="/my-learning"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <GraduationCap size={16} />
                            My Enrolled Courses
                          </Link>
                        )}

                        {user?.role === 'instructor' && (
                          <Link
                            to="/instructor/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <LayoutDashboard size={16} />
                            Instructor Dashboard
                          </Link>
                        )}

                        {user?.role === 'admin' && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-indigo-600 transition-colors"
                          >
                            <ShieldCheck size={16} />
                            Admin Console
                          </Link>
                        )}
                      </div>

                      <div className="border-t border-slate-100 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md shadow-indigo-600/20 hover:shadow-indigo-600/30 transition-all hover:scale-[1.02]"
                >
                  Sign Up Free
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:text-indigo-600 rounded-xl hover:bg-slate-100 transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative mb-3">
            <input
              type="text"
              placeholder="Search courses, roadmaps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100 border border-slate-200 rounded-xl"
            />
            <Search
              size={17}
              className="absolute left-3 top-2.5 text-slate-400"
            />
          </form>

          <Link
            to="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
          >
            Explore Courses
          </Link>

          <Link
            to="/instructors"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
          >
            Meet Instructors
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
          >
            About Us
          </Link>

          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
          >
            Contact & Support
          </Link>

          <Link
            to="/verify-certificate"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-emerald-700 bg-emerald-50"
          >
            Verify Certificate
          </Link>

          {isAuthenticated && user?.role === 'student' && (
            <>
              <Link
                to="/my-learning"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
              >
                My Learning
              </Link>
              <Link
                to="/certificates"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
              >
                My Certificates
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'instructor' && (
            <>
              <Link
                to="/instructor/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
              >
                Instructor Dashboard
              </Link>
              <Link
                to="/instructor/create-course"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-600 bg-indigo-50"
              >
                + Create New Course
              </Link>
            </>
          )}

          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link
                to="/admin/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
              >
                Admin Dashboard
              </Link>
              <Link
                to="/instructor/create-course"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-semibold text-indigo-600 bg-indigo-50"
              >
                + Create New Course
              </Link>
            </>
          )}

          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-100"
          >
            Profile & Settings
          </Link>
        </div>
      )}
    </header>
  );
};
