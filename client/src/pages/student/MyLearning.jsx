import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { CertificateModal } from '../../components/player/CertificateModal';
import {
  GraduationCap,
  PlayCircle,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '../../components/common/Badge';

export const MyLearning = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        setLoading(true);
        const res = await api.get('/enrollments/my-learning');
        setEnrollments(res.enrollments || []);
      } catch (err) {
        console.error('Failed to load enrolled courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  if (loading) {
    return <Loader text="Loading your learning workspace..." />;
  }

  const completedCount = enrollments.filter((e) => e.isCompleted || e.progressPercentage === 100).length;
  const inProgressCount = enrollments.length - completedCount;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
            Student Learning Hub
          </span>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            My Enrolled Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Pick up right where you left off and keep building your tech skills.
          </p>
        </div>

        {/* Mini stats */}
        <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
          <div className="text-center px-3 border-r border-white/20">
            <span className="block text-2xl font-black text-white">{enrollments.length}</span>
            <span className="text-[11px] text-slate-300 font-medium">Enrolled</span>
          </div>
          <div className="text-center px-3 border-r border-white/20">
            <span className="block text-2xl font-black text-amber-400">{inProgressCount}</span>
            <span className="text-[11px] text-slate-300 font-medium">In Progress</span>
          </div>
          <div className="text-center px-3">
            <span className="block text-2xl font-black text-emerald-400">{completedCount}</span>
            <span className="text-[11px] text-slate-300 font-medium">Completed</span>
          </div>
        </div>
      </div>

      {/* Course Cards Grid */}
      {enrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrollments.map((enr) => {
            const course = enr.course;
            if (!course) return null;
            const isCompleted = enr.isCompleted || enr.progressPercentage === 100;

            return (
              <div
                key={enr._id}
                className="bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={
                      course.thumbnail ||
                      'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link
                      to={`/learn/${course._id}`}
                      className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                    >
                      <PlayCircle size={24} />
                    </Link>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge variant="neutral" size="xs" className="bg-slate-900/80 text-white border-transparent backdrop-blur-md">
                      {course.category}
                    </Badge>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      Instructor: {course.instructor?.name || 'EduVibe Expert'}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-700">
                        {isCompleted ? 'Completed' : `${enr.progressPercentage || 0}% Complete`}
                      </span>
                      {isCompleted && (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      )}
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCompleted
                            ? 'bg-emerald-500'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                        }`}
                        style={{ width: `${enr.progressPercentage || 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                    <Link
                      to={`/learn/${course._id}`}
                      className="flex-1 py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs text-center transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>{isCompleted ? 'Review Lectures' : 'Continue Learning'}</span>
                      <ArrowRight size={14} />
                    </Link>

                    {isCompleted && (
                      <button
                        onClick={() =>
                          setSelectedCert({
                            studentName: user?.name,
                            courseTitle: course.title,
                            instructorName: course.instructor?.name,
                            certificateId: enr.certificateId || 'EDU-VERIFIED-2026',
                            completionDate: enr.completedAt || new Date(),
                          })
                        }
                        className="p-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-xl transition-colors"
                        title="View Certificate"
                      >
                        <Award size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto">
            <GraduationCap size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900">
            You are not enrolled in any courses yet
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore our cutting-edge tech courses and start mastering real-world skills today.
          </p>
          <Link
            to="/courses"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md"
          >
            Browse Course Catalog
          </Link>
        </div>
      )}

      {/* Certificate Modal */}
      {selectedCert && (
        <CertificateModal
          isOpen={!!selectedCert}
          onClose={() => setSelectedCert(null)}
          {...selectedCert}
        />
      )}
    </div>
  );
};
