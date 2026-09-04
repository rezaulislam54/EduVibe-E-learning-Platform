import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  User,
  LayoutDashboard,
} from 'lucide-react';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login, demoLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.user?.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (res.user?.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(from === '/login' ? '/my-learning' : from);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemo = async (role) => {
    setError('');
    setSubmitting(true);
    try {
      const res = await demoLogin(role);
      if (role === 'instructor') {
        navigate('/instructor/dashboard');
      } else if (role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/my-learning');
      }
    } catch (err) {
      setError(err.message || 'Demo login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
            <GraduationCap size={26} />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-slate-900">
            Welcome back to EduVibe
          </h2>
          <p className="text-xs text-slate-500">
            Sign in to continue your learning journey
          </p>
        </div>

        {/* 1-Click Demo Login Box for Portfolio Reviewers */}
        <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
            <Sparkles size={15} className="text-indigo-600" />
            <span>Portfolio Demo 1-Click Logins</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-snug">
            Recruiter or reviewer? Test the platform instantly without registering:
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleDemo('student')}
              disabled={submitting}
              className="py-2 px-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all flex flex-col items-center gap-1 group"
            >
              <User size={14} className="text-indigo-600 group-hover:text-white" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('instructor')}
              disabled={submitting}
              className="py-2 px-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all flex flex-col items-center gap-1 group"
            >
              <LayoutDashboard size={14} className="text-indigo-600 group-hover:text-white" />
              <span>Instructor</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemo('admin')}
              disabled={submitting}
              className="py-2 px-2 bg-white hover:bg-indigo-600 hover:text-white border border-indigo-200 rounded-xl text-xs font-bold text-slate-700 shadow-2xs transition-all flex flex-col items-center gap-1 group"
            >
              <ShieldCheck size={14} className="text-indigo-600 group-hover:text-white" />
              <span>Admin</span>
            </button>
          </div>
        </div>

        {/* Error notification */}
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-medium">
            {error}
          </div>
        )}

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Mail size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
              <Lock size={16} className="absolute left-3.5 top-3 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Bottom register link */}
        <p className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-indigo-600 hover:text-indigo-700"
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
};
