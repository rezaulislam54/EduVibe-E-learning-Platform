import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code,
  Sparkles,
  Search,
  BookOpen,
  Users,
  Award,
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Cpu,
  Palette,
  Cloud,
  Lock,
  Smartphone,
  CheckCircle2,
} from 'lucide-react';
import api from '../services/api';
import { CourseCard } from '../components/course/CourseCard';
import { Loader } from '../components/common/Loader';

const CATEGORIES = [
  { name: 'Web Development', icon: Code, color: 'from-blue-500 to-indigo-600', count: '12+ Courses' },
  { name: 'Data Science & AI', icon: Cpu, color: 'from-purple-500 to-pink-600', count: '8+ Courses' },
  { name: 'Design & UI/UX', icon: Palette, color: 'from-amber-500 to-orange-600', count: '6+ Courses' },
  { name: 'Cloud & DevOps', icon: Cloud, color: 'from-cyan-500 to-blue-600', count: '7+ Courses' },
  { name: 'Cybersecurity', icon: Lock, color: 'from-emerald-500 to-teal-600', count: '5+ Courses' },
  { name: 'Mobile Development', icon: Smartphone, color: 'from-rose-500 to-pink-600', count: '6+ Courses' },
];

export const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadFeatured = async () => {
      try {
        const res = await api.get('/courses/featured');
        setFeaturedCourses(res.courses || []);
      } catch (err) {
        console.error('Failed to load featured courses:', err);
      } finally {
        setLoading(false);
      }
    };
    loadFeatured();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        {/* Ambient background glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-6xl mx-auto text-center space-y-8 relative z-10">
          {/* Top Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold tracking-wide uppercase shadow-glow animate-pulse">
            <Sparkles size={14} />
            Next-Gen E-Learning Experience
          </div>

          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Master In-Demand Skills.{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400">
              Build Real-World Tech.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Learn from top industry engineers with hands-on projects, real-time code discussions, interactive lecture video rooms, and verifiable completion certificates.
          </p>

          {/* Search Bar Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto flex items-center bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-2xl shadow-2xl focus-within:ring-2 focus-within:ring-indigo-400 transition-all"
          >
            <div className="pl-3 text-slate-300">
              <Search size={20} />
            </div>
            <input
              type="text"
              placeholder="What do you want to learn today? (e.g., React, AI, DevOps...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2.5 bg-transparent text-white placeholder:text-slate-400 text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all"
            >
              Explore
            </button>
          </form>

          {/* Quick tags */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Popular:</span>
            {['MERN Stack', 'Generative AI', 'UI/UX Design', 'Kubernetes', 'Cybersecurity'].map((tag) => (
              <button
                key={tag}
                onClick={() => navigate(`/courses?search=${encodeURIComponent(tag)}`)}
                className="px-3 py-1 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 hover:text-white transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Quick Stats Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            {[
              { label: 'Active Learners', val: '25,000+', icon: Users },
              { label: 'Expert Courses', val: '120+', icon: BookOpen },
              { label: 'Verified Certificates', val: '15,000+', icon: Award },
              { label: 'Satisfaction Rate', val: '99.4%', icon: Zap },
            ].map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm flex flex-col items-center justify-center text-center"
                >
                  <Icon size={20} className="text-indigo-400 mb-1" />
                  <span className="text-2xl font-black text-white">{stat.val}</span>
                  <span className="text-xs text-slate-400 font-medium">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Browse Categories
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Top Trending Domains
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            All Categories <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <Link
                key={idx}
                to={`/courses?category=${encodeURIComponent(cat.name)}`}
                className="group p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 flex flex-col items-center text-center space-y-3"
              >
                <div
                  className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${cat.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform`}
                >
                  <Icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-xs text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
              Handpicked By Experts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Featured & Top Rated Courses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            View Full Catalog ({featuredCourses.length}) <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {loading ? (
          <Loader text="Loading featured courses..." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </section>

      {/* Why Choose EduVibe Feature Pillars */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Why EduVibe Stands Out
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              Designed For Real Career Outcomes
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              We focus on practical, project-driven learning rather than dry theoretical lectures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Production-Grade Projects',
                desc: 'Build full-stack applications with state-of-the-art architectures, payments, and real-time features that stand out to tech leads.',
                icon: Code,
              },
              {
                title: 'Live Interactive Q&A',
                desc: 'Ask questions directly on any lecture and receive verified answers from instructors and peers with Socket.io real-time notifications.',
                icon: Sparkles,
              },
              {
                title: 'Verifiable Certificates',
                desc: 'Every completed course generates a cryptographic, verifiable diploma with unique IDs that can be linked on your LinkedIn & CV.',
                icon: Award,
              },
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/40 transition-colors space-y-4"
                >
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 rounded-3xl p-8 sm:p-14 text-white text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Start Your Full-Stack Learning Journey Today
            </h2>
            <p className="text-sm text-indigo-100 leading-relaxed">
              Join thousands of developers advancing their careers. Create a free account or explore our catalog instantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link
                to="/register"
                className="px-6 py-3 bg-white text-indigo-600 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:bg-slate-100 hover:scale-105 transition-all"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-6 py-3 bg-indigo-900/40 hover:bg-indigo-900/60 border border-white/30 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                1-Click Demo Login
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
