import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  Sparkles,
  Award,
  Users,
  Globe,
  Rocket,
  ShieldCheck,
  Heart,
  BookOpen,
  ArrowRight,
  Code,
  Cpu,
  CheckCircle2,
} from 'lucide-react';

export const AboutUs = () => {
  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-5xl mx-auto text-center space-y-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider border border-indigo-400/30">
            <Sparkles size={14} /> Our Mission & Vision
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
            Democratizing World-Class Tech Education for Everyone
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
            EduVibe was founded with a single mission: to bridge the gap between academic theory and real-world engineering through project-based mastery.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: '45,000+', label: 'Graduated Students', sub: 'Across 120+ countries' },
            { val: '98.7%', label: 'Career Transition Rate', sub: 'Landed tech roles' },
            { val: '150+', label: 'Production Masterclasses', sub: 'MERN, AI, DevOps & Cloud' },
            { val: '4.9 ★', label: 'Average Course Rating', sub: 'From verified reviews' },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-lg text-center space-y-1 hover:-translate-y-1 transition-transform"
            >
              <span className="text-3xl font-black text-indigo-600 block">{stat.val}</span>
              <span className="text-xs font-bold text-slate-900 block">{stat.label}</span>
              <span className="text-[11px] text-slate-400 block">{stat.sub}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Our Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-600">
            What Drives Us
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Our Core Educational Values
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Every course on EduVibe is designed around proven industry practices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              title: '100% Practical & Project-Based',
              desc: 'No dry theoretical slides. You learn by building real full-stack web applications, AI models, and cloud systems with industry codebases.',
              icon: Code,
            },
            {
              title: 'Learn from Top Engineers',
              desc: 'Our instructors are principal engineers, tech leads, and researchers from industry-leading companies with deep architectural experience.',
              icon: Rocket,
            },
            {
              title: 'Verifiable Industry Diplomas',
              desc: 'Earn cryptographic certificates with unique IDs that can be validated instantly by employers, recruiters, and LinkedIn networks.',
              icon: ShieldCheck,
            },
          ].map((val, i) => {
            const Icon = val.icon;
            return (
              <div
                key={i}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs hover:shadow-xl transition-all space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-base text-slate-900">{val.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Leadership & Instructors */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
              Meet The Mentors
            </span>
            <h2 className="text-3xl font-black tracking-tight">
              Led by Passionate Educators
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Passionate software engineers dedicated to mentoring the next generation of developers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Sarah Jenkins',
                role: 'Lead Full-Stack Architect',
                image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300',
                bio: '12+ years building distributed React and Node.js microservices. Mentored 100,000+ engineers worldwide.',
              },
              {
                name: 'Michael Chen',
                role: 'Principal AI & LLM Specialist',
                image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300',
                bio: 'Former AI researcher at Stanford and OpenAI. Specializes in autonomous multi-agent systems & RAG architectures.',
              },
              {
                name: 'David Miller',
                role: 'Director of Product Design',
                image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
                bio: 'Designed award-winning applications for Fortune 500 tech teams. Author of comprehensive UI/UX Design System books.',
              },
            ].map((leader, i) => (
              <div
                key={i}
                className="bg-slate-800/80 p-6 rounded-3xl border border-slate-700 space-y-4 text-center flex flex-col items-center"
              >
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-24 h-24 rounded-2xl object-cover ring-2 ring-indigo-500/40 shadow-lg"
                />
                <div>
                  <h3 className="font-bold text-base text-white">{leader.name}</h3>
                  <span className="text-xs text-indigo-400 font-semibold">{leader.role}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 sm:p-12 text-white text-center space-y-6 shadow-2xl">
          <h2 className="text-2xl sm:text-3xl font-black">
            Ready to Build Your Engineering Career?
          </h2>
          <p className="text-xs sm:text-sm text-indigo-100 max-w-xl mx-auto">
            Explore our project-driven courses today and join thousands of students mastering the modern stack.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link
              to="/courses"
              className="px-6 py-3 bg-white text-indigo-600 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md hover:scale-105 transition-all"
            >
              Browse All Courses
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
