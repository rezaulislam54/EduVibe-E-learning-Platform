import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Github, Linkedin, Twitter, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <GraduationCap size={22} className="stroke-[2.2]" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Edu<span className="text-indigo-400">Vibe</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Empowering developers, designers, and innovators worldwide with cutting-edge tech courses, interactive coding lessons, and verifiable industry certificates.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all"
              >
                <Github size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all"
              >
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Top Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses?category=Web+Development" className="hover:text-indigo-400 transition-colors">
                  Web Development
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Data+Science+%26+AI" className="hover:text-indigo-400 transition-colors">
                  Data Science & AI
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Design+%26+UI%2FUX" className="hover:text-indigo-400 transition-colors">
                  Design & UI/UX
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cloud+%26+DevOps" className="hover:text-indigo-400 transition-colors">
                  Cloud & DevOps
                </Link>
              </li>
              <li>
                <Link to="/courses?category=Cybersecurity" className="hover:text-indigo-400 transition-colors">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-indigo-400 transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/courses?priceType=free" className="hover:text-indigo-400 transition-colors">
                  Free Courses
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  Become a Student
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-indigo-400 transition-colors">
                  Teach on EduVibe
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Demo Access */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Portfolio Demo
            </h4>
            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              Experience the full role-based portal with 1-click demo logins.
            </p>
            <div className="space-y-2">
              <Link
                to="/login"
                className="block text-center py-2 px-3 bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-semibold transition-all"
              >
                1-Click Demo Login
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EduVibe E-Learning Platform. Built for High-Impact Portfolios.</p>
          <p className="flex items-center gap-1">
            Engineered with MERN Stack & <Heart size={13} className="text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
