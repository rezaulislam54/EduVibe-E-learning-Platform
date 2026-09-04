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
  Star,
  Compass,
  Briefcase,
  ChevronDown,
  Mail,
  HelpCircle,
  Clock,
  Layers,
  Flame
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

const CAREER_PATHS = [
  {
    id: 'fullstack',
    title: 'Full-Stack MERN Architect',
    level: 'Beginner to Senior',
    duration: '24 Weeks',
    modules: ['React 19 & Tailwind', 'Node.js & Express APIs', 'MongoDB & Redis Caching', 'Docker & CI/CD Pipelines'],
    salary: '$120,000 / yr avg.',
    badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    icon: Layers,
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: 'ai-engineer',
    title: 'Generative AI & LLM Engineer',
    level: 'Intermediate',
    duration: '18 Weeks',
    modules: ['Python & PyTorch Essentials', 'LangChain & LlamaIndex', 'Vector DBs & RAG Architecture', 'Fine-Tuning Open Source LLMs'],
    salary: '$145,000 / yr avg.',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    icon: Cpu,
    color: 'from-purple-600 to-pink-600'
  },
  {
    id: 'cloud-devops',
    title: 'Cloud & DevOps Specialist',
    level: 'Intermediate to Pro',
    duration: '16 Weeks',
    modules: ['Linux & Bash Automation', 'Docker Containerization', 'Kubernetes Cluster Orchestration', 'Terraform & AWS Architecture'],
    salary: '$135,000 / yr avg.',
    badgeColor: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    icon: Cloud,
    color: 'from-cyan-600 to-blue-600'
  },
  {
    id: 'ui-ux',
    title: 'UI/UX Product Designer',
    level: 'Beginner to Pro',
    duration: '14 Weeks',
    modules: ['Figma Design Systems', 'UX Research & Wireframing', 'Modern Micro-interactions', 'Design-to-Code with Tailwind'],
    salary: '$105,000 / yr avg.',
    badgeColor: 'bg-amber-100 text-amber-700 border-amber-200',
    icon: Palette,
    color: 'from-amber-500 to-orange-600'
  }
];

const SUCCESS_STORIES = [
  {
    name: 'Tanvir Ahmed',
    prevRole: 'Junior Support Tech',
    newRole: 'Full-Stack Software Engineer at TechCorp',
    salaryBump: '+180% Salary Increase',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    quote: 'The MERN stack curriculum on EduVibe wasn\'t just theory. Building the production chat & payment apps gave me the exact portfolio that got me hired in 4 months.',
    course: 'Full-Stack MERN Architecture Masterclass'
  },
  {
    name: 'Farhana Yasmin',
    prevRole: 'Marketing Specialist',
    newRole: 'Product UI/UX Designer at SaaS Global',
    salaryBump: '+140% Salary Increase',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    quote: 'I transitioned from marketing into product design with zero background. The mentor feedback and portfolio critiques in the Q&A section were invaluable.',
    course: 'Modern Design Systems in Figma'
  },
  {
    name: 'Rashidul Hasan',
    prevRole: 'Self-Taught Coder',
    newRole: 'DevOps & Cloud Engineer at FinTech Ltd',
    salaryBump: '+220% Salary Increase',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    quote: 'The Kubernetes and AWS CI/CD hands-on labs were unmatched. Passing technical interviews felt effortless after building those production pipelines.',
    course: 'Enterprise Kubernetes & Terraform'
  }
];

const FAQS = [
  {
    q: 'How does lifetime access to courses work?',
    a: 'Once you enroll in any EduVibe course, you receive permanent, unrestricted access to all current and future lecture videos, downloadable project files, source code repositories, and instructor Q&A threads with zero recurring monthly subscription fees.'
  },
  {
    q: 'How do I get my cryptographic completion certificate?',
    a: 'Once you mark 100% of lessons as completed and submit any required project milestones, your Certificate of Specialization is instantly generated with a unique cryptographic hash ID. You can download it as a PDF or share the permanent verification URL directly on LinkedIn.'
  },
  {
    q: 'Can I interact with instructors and ask questions during lessons?',
    a: 'Yes! Every lesson has a built-in interactive real-time Q&A sidebar powered by WebSockets. You can ask questions with code snippets, get notifications when instructors respond, and collaborate with thousands of fellow peers enrolled in the same course.'
  },
  {
    q: 'What is the refund policy if I am not satisfied?',
    a: 'We offer a 30-day no-questions-asked refund guarantee. If you decide a course isn\'t right for you and you have watched less than 50% of the content, you can request an instant refund directly via our Help Center.'
  },
  {
    q: 'Are the course projects suitable for my resume and portfolio?',
    a: 'Absolutely. Every course is specifically structured around architecting production-grade applications with modern patterns (clean architecture, authentication, database indexes, payment gateways, and containerization) rather than basic toy apps.'
  }
];

export const Home = () => {
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
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

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
    }
  };

  return (
    <div className="space-y-24 pb-24">
      
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
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/30 hover:scale-105 transition-all whitespace-nowrap"
            >
              Explore Catalog
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

      {/* Structured Career Learning Paths (NEW SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Compass size={14} /> Guided Roadmaps
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
              Career Transformation Learning Paths
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Follow step-by-step curricula curated to take you from fundamentals to high-paying engineering roles.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
          >
            Explore All Paths <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREER_PATHS.map((path) => {
            const Icon = path.icon;
            return (
              <div
                key={path.id}
                className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${path.color} text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                    <Icon size={24} />
                  </div>

                  <div className="space-y-1">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${path.badgeColor}`}>
                      {path.level}
                    </span>
                    <h3 className="font-extrabold text-base text-slate-900 pt-1 group-hover:text-indigo-600 transition-colors">
                      {path.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={12} /> {path.duration}</span>
                      <span>•</span>
                      <span className="font-semibold text-emerald-600">{path.salary}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Key Milestones</span>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {path.modules.map((m, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <CheckCircle2 size={13} className="text-indigo-500 shrink-0 mt-0.5" />
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100">
                  <Link
                    to="/courses"
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-indigo-600 text-white text-xs font-bold text-center block transition-colors shadow-sm"
                  >
                    View Roadmap Details
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-indigo-600 flex items-center gap-1">
              <Flame size={14} className="text-rose-500" /> Handpicked Masterclasses
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

      {/* Top Instructors Showcase (NEW SECTION) */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="max-w-6xl mx-auto space-y-12 relative z-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-700/50">
                Industry Mentors
              </span>
              <h2 className="text-2xl sm:text-4xl font-black mt-2">
                Learn from Silicon Valley & Global Leaders
              </h2>
            </div>
            <Link
              to="/instructors"
              className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group"
            >
              Meet All Instructors <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: 'Alex Rivera',
                role: 'Principal Full-Stack Architect',
                company: 'Ex-Google / Meta',
                rating: '4.95 ★',
                students: '38.5k+',
                avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Dr. Sarah Lin',
                role: 'AI & Machine Learning Director',
                company: 'Stanford AI Lab Alum',
                rating: '4.98 ★',
                students: '26.1k+',
                avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Marcus Vance',
                role: 'Cloud & DevOps Architect',
                company: 'AWS Certified Hero',
                rating: '4.91 ★',
                students: '31.0k+',
                avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
              },
              {
                name: 'Elena Rostova',
                role: 'Lead Product & UX Designer',
                company: 'Design System Lead',
                rating: '4.96 ★',
                students: '22.4k+',
                avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
              },
            ].map((inst, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-4 hover:border-indigo-500/50 transition-all text-center group"
              >
                <img
                  src={inst.avatar}
                  alt={inst.name}
                  className="w-20 h-20 rounded-2xl object-cover mx-auto ring-2 ring-indigo-500/30 group-hover:scale-105 transition-transform"
                />
                <div>
                  <h4 className="font-bold text-base text-white">{inst.name}</h4>
                  <p className="text-xs text-indigo-400 font-medium">{inst.role}</p>
                  <p className="text-[11px] text-slate-400">{inst.company}</p>
                </div>
                <div className="pt-3 border-t border-slate-700/80 flex justify-around text-xs text-slate-300">
                  <span>{inst.rating}</span>
                  <span>•</span>
                  <span>{inst.students} Students</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Career Transformation Stories (NEW SECTION) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Proven Outcomes
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Student Career Transformation Stories
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Real developers and creators who leveled up their skills and landed their dream tech roles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SUCCESS_STORIES.map((story, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{story.name}</h4>
                      <p className="text-[11px] text-slate-400 line-through">{story.prevRole}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {story.salaryBump}
                  </span>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs font-semibold text-indigo-900">
                  🎉 Now: {story.newRole}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{story.quote}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>Completed: <strong className="text-slate-700">{story.course}</strong></span>
              </div>
            </div>
          ))}
        </div>
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

      {/* Interactive FAQ Accordion (NEW SECTION) */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Got Questions?
          </span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about enrollment, certificate verification, and platform features.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                    <HelpCircle size={16} className="text-indigo-600 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-indigo-600' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-500">
            Have more questions? <Link to="/contact" className="text-indigo-600 font-bold underline">Visit our Contact & Help Center</Link>
          </p>
        </div>
      </section>

      {/* Free Newsletter & Code Pack Drop (NEW SECTION) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white border border-indigo-900/50 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="max-w-2xl mx-auto text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
              <Mail size={13} /> Weekly Developer Digest
            </div>
            
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              Get Weekly Curated Code Packs & Architecture Blueprints
            </h2>
            
            <p className="text-xs sm:text-sm text-slate-300">
              Join 40,000+ developers receiving free full-stack project cheat sheets, system design breakdowns, and exclusive course discount coupons every Thursday.
            </p>

            {newsletterSubscribed ? (
              <div className="bg-emerald-500/20 border border-emerald-400/40 p-4 rounded-2xl text-emerald-300 text-xs font-bold flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> You're on the list! Check your inbox for your free MERN Cheat Sheet.
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row items-center gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-indigo-600/30 whitespace-nowrap"
                >
                  Subscribe
                </button>
              </form>
            )}
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

export default Home;
