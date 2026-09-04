import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { CertificateModal } from '../../components/player/CertificateModal';
import { Award, ShieldCheck, Printer, ArrowRight, ExternalLink } from 'lucide-react';

export const Certificates = () => {
  const { user } = useAuth();
  const [completedEnrollments, setCompletedEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const res = await api.get('/enrollments/my-learning');
        const completed = (res.enrollments || []).filter(
          (e) => e.isCompleted || e.progressPercentage === 100
        );
        setCompletedEnrollments(completed);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  if (loading) {
    return <Loader text="Loading your certified credentials..." />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-amber-300">
          <Award size={28} />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
          My Verified Certificates
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-xl">
          Showcase your verified achievements to recruiters and engineering managers.
        </p>
      </div>

      {/* Grid of Certificates */}
      {completedEnrollments.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedEnrollments.map((enr) => {
            const course = enr.course;
            if (!course) return null;

            return (
              <div
                key={enr._id}
                className="bg-white rounded-3xl border border-amber-200/60 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-bl-full pointer-events-none"></div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-amber-50 text-amber-600">
                      <Award size={22} />
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                      {enr.certificateId || 'EDU-77X92B'}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Instructor: {course.instructor?.name || 'EduVibe Instructor'}
                  </p>
                  <p className="text-xs text-slate-400">
                    Completed on:{' '}
                    {new Date(enr.completedAt || enr.updatedAt).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </p>
                </div>

                <button
                  onClick={() =>
                    setSelectedCert({
                      studentName: user?.name,
                      courseTitle: course.title,
                      instructorName: course.instructor?.name,
                      certificateId: enr.certificateId || 'EDU-77X92B',
                      completionDate: enr.completedAt || new Date(),
                    })
                  }
                  className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white text-xs font-bold rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all hover:scale-[1.02]"
                >
                  <Printer size={14} />
                  View & Print Certificate
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-8 space-y-4">
          <Award size={36} className="text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">
            No completed certificates yet
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Complete 100% of all lectures in any enrolled course to unlock your verified graduation diploma!
          </p>
          <Link
            to="/my-learning"
            className="inline-block px-5 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl"
          >
            Go to My Courses
          </Link>
        </div>
      )}

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
