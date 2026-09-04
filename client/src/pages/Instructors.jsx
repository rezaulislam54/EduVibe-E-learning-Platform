import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Award,
  Users,
  DollarSign,
  TrendingUp,
  Globe,
  Video,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Star,
  BookOpen,
  Send,
  HelpCircle,
  Briefcase,
  PlayCircle
} from 'lucide-react';

export const Instructors = () => {
  // Earnings calculator state
  const [studentsCount, setStudentsCount] = useState(500);
  const [coursePrice, setCoursePrice] = useState(49);
  
  // Application form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    expertise: 'Full-Stack Web Development',
    experience: '3-5 years',
    portfolio: '',
    bio: ''
  });
  const [applied, setApplied] = useState(false);

  // Instructor earnings calculation (85% revenue share)
  const estimatedRevenue = Math.round(studentsCount * coursePrice * 0.85);

  const featuredInstructors = [
    {
      name: 'Alex Rivera',
      role: 'Principal Full-Stack Architect',
      company: 'Ex-Google / Meta',
      rating: 4.95,
      reviews: '14.2k',
      students: '38,500+',
      courses: 8,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      expertise: ['React', 'Node.js', 'Microservices', 'GraphQL'],
      bio: '12+ years building enterprise scale distributed web systems. Creator of top-rated MERN architecture series.'
    },
    {
      name: 'Dr. Sarah Lin',
      role: 'AI & Machine Learning Director',
      company: 'Stanford AI Lab Alum',
      rating: 4.98,
      reviews: '9.8k',
      students: '26,100+',
      courses: 5,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
      expertise: ['Python', 'PyTorch', 'LLMs', 'Prompt Eng.'],
      bio: 'Leading researcher in generative AI and deep neural networks. Passionate about making modern AI accessible.'
    },
    {
      name: 'Marcus Vance',
      role: 'Cloud & DevOps Architect',
      company: 'AWS Certified Hero',
      rating: 4.91,
      reviews: '11.5k',
      students: '31,000+',
      courses: 6,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      expertise: ['Kubernetes', 'Docker', 'Terraform', 'CI/CD'],
      bio: 'Helped 50+ startups automate their cloud infrastructure and achieve 99.99% uptime with modern GitOps.'
    },
    {
      name: 'Elena Rostova',
      role: 'Lead Product & UX Designer',
      company: 'Design System Lead',
      rating: 4.96,
      reviews: '8.4k',
      students: '22,400+',
      courses: 4,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
      expertise: ['Figma', 'Design Systems', 'Micro-interactions', 'Tailwind'],
      bio: 'Advocate for human-centric product design and high-converting modern SaaS UI architecture.'
    }
  ];

  const handleApply = (e) => {
    e.preventDefault();
    setApplied(true);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
            <Sparkles size={14} /> World-Class Mentorship
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Learn From Industry Titans or <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-300 to-emerald-400">
              Share Your Expertise
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            EduVibe brings together top engineering leaders, researchers, and creators to deliver high-impact courses that transform tech careers globally.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <a
              href="#apply-to-teach"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition-all hover:scale-105"
            >
              Apply to Teach <ArrowRight size={16} />
            </a>
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm border border-slate-700 transition-all"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Instructors Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Elite Instructors
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Meet the Masters Behind the Courses
          </h2>
          <p className="text-sm text-slate-500">
            Every EduVibe instructor is a proven practitioner with years of production experience in Silicon Valley and global tech companies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredInstructors.map((inst, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="relative">
                  <img
                    src={inst.avatar}
                    alt={inst.name}
                    className="w-24 h-24 rounded-2xl object-cover mx-auto ring-4 ring-indigo-50 shadow-md group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-2 right-1/2 translate-x-10 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={11} /> Verified
                  </div>
                </div>

                <div className="text-center space-y-1">
                  <h3 className="font-bold text-base text-slate-900">{inst.name}</h3>
                  <p className="text-xs font-semibold text-indigo-600">{inst.role}</p>
                  <p className="text-[11px] text-slate-400 font-medium">{inst.company}</p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed text-center italic">
                  "{inst.bio}"
                </p>

                <div className="flex flex-wrap gap-1.5 justify-center">
                  {inst.expertise.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-xs font-bold text-slate-900 block flex items-center justify-center gap-0.5 text-amber-500">
                      <Star size={11} fill="currentColor" /> {inst.rating}
                    </span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Rating</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-xs font-bold text-slate-900 block">{inst.students}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Students</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <span className="text-xs font-bold text-slate-900 block">{inst.courses}</span>
                    <span className="text-[9px] text-slate-400 uppercase font-semibold">Courses</span>
                  </div>
                </div>

                <Link
                  to="/courses"
                  className="w-full py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold text-center block transition-colors"
                >
                  View Masterclasses
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Teach on EduVibe */}
      <section className="bg-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400 bg-indigo-900/50 px-3 py-1 rounded-full border border-indigo-700/50">
              Educator Perks
            </span>
            <h2 className="text-3xl sm:text-4xl font-black">
              Why 1,200+ Experts Teach on EduVibe
            </h2>
            <p className="text-sm text-slate-400 max-w-2xl mx-auto">
              We provide the infrastructure, marketing engine, and community so you can focus 100% on crafting transformative curriculum.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: DollarSign,
                color: 'text-emerald-400',
                title: 'Industry-Leading 85% Payout',
                desc: 'Earn industry-best revenue share on all direct student enrollments with instant bi-weekly automated payouts.'
              },
              {
                icon: Globe,
                color: 'text-sky-400',
                title: 'Global High-Intent Audience',
                desc: 'Reach over 100,000+ ambitious developers, engineers, and product builders eager to upskill.'
              },
              {
                icon: Video,
                color: 'text-indigo-400',
                title: 'Studio & Production Support',
                desc: 'Access dedicated curriculum advisors, high-bitrate video hosting, live Q&A sockets, and automated certificate generation.'
              },
              {
                icon: TrendingUp,
                color: 'text-amber-400',
                title: 'Deep Analytics & Feedback',
                desc: 'Real-time instructor dashboards tracking student completion rates, engagement heatmaps, and instant reviews.'
              },
              {
                icon: ShieldCheck,
                color: 'text-rose-400',
                title: 'Intellectual Property Protection',
                desc: 'You retain full copyright and ownership of your curriculum with enterprise DRM video streaming protection.'
              },
              {
                icon: Users,
                color: 'text-purple-400',
                title: 'Private Instructor Mastermind',
                desc: 'Collaborate with fellow tech authors, participate in private retreats, and co-create multi-course engineering paths.'
              }
            ].map((perk, i) => {
              const Icon = perk.icon;
              return (
                <div
                  key={i}
                  className="bg-slate-800/80 p-6 rounded-2xl border border-slate-700/80 space-y-3 hover:border-indigo-500/50 transition-colors"
                >
                  <div className={`p-3 rounded-xl bg-slate-900/80 w-fit ${perk.color}`}>
                    <Icon size={22} />
                  </div>
                  <h3 className="font-bold text-base text-white">{perk.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{perk.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Instructor Earnings Calculator */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            Earnings Potential
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Calculate Your Instructor Income
          </h2>
          <p className="text-sm text-slate-500">
            Slide the controls below to project your estimated earnings based on course price and student enrollment.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Students count slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Enrolled Students</span>
                  <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg">
                    {studentsCount.toLocaleString()} students
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="5000"
                  step="50"
                  value={studentsCount}
                  onChange={(e) => setStudentsCount(Number(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>50</span>
                  <span>2,500</span>
                  <span>5,000+</span>
                </div>
              </div>

              {/* Course price slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                  <span>Course Enrollment Price</span>
                  <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                    ${coursePrice} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="19"
                  max="199"
                  step="5"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(Number(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer h-2 bg-slate-200 rounded-lg"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>$19</span>
                  <span>$99</span>
                  <span>$199</span>
                </div>
              </div>
            </div>

            {/* Estimated revenue card */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl p-6 text-white flex flex-col justify-between space-y-4 shadow-lg">
              <div className="space-y-1">
                <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
                  Projected Take-Home (85% Share)
                </span>
                <div className="text-4xl sm:text-5xl font-black text-emerald-400">
                  ${estimatedRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400">
                  Estimated revenue for one masterclass with {studentsCount} students at ${coursePrice}/each.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/80 space-y-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>Direct bi-weekly bank deposits via Stripe Connect</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span>No upfront platform listing or hosting fees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Application Form */}
      <section id="apply-to-teach" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Join the Faculty
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Apply to Become an Instructor
          </h2>
          <p className="text-sm text-slate-500">
            Fill out the form below. Our curriculum committee reviews submissions within 48 business hours.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl">
          {applied ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Application Submitted Successfully!</h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto">
                Thank you, <strong className="text-slate-800">{formData.name}</strong>! We have received your instructor application and sent a confirmation to <strong className="text-slate-800">{formData.email}</strong>. Our educator support team will reach out soon.
              </p>
              <button
                onClick={() => setApplied(false)}
                className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Submit Another Application
              </button>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Alex Johnson"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Work Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@techcompany.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Primary Domain of Expertise</label>
                  <select
                    value={formData.expertise}
                    onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option>Full-Stack Web Development (MERN / Next.js)</option>
                    <option>AI, Machine Learning & LLM Engineering</option>
                    <option>Cloud Architecture & DevOps (AWS / K8s)</option>
                    <option>UI/UX Product Design & Figma Systems</option>
                    <option>Mobile App Development (React Native / Flutter)</option>
                    <option>Cybersecurity & Ethical Hacking</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Years of Production Experience</label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option>1-3 years</option>
                    <option>3-5 years</option>
                    <option>5-10 years</option>
                    <option>10+ years (Staff / Principal)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Portfolio / GitHub / LinkedIn URL</label>
                <input
                  type="url"
                  required
                  placeholder="https://github.com/username or https://linkedin.com/in/username"
                  value={formData.portfolio}
                  onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Course Proposal / Teaching Philosophy</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell us about the course you want to build and why developers will love it..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01]"
              >
                <Send size={16} /> Submit Instructor Application
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default Instructors;
