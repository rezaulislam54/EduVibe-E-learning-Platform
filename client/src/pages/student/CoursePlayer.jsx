import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Loader } from '../../components/common/Loader';
import { VideoPlayer } from '../../components/player/VideoPlayer';
import { CurriculumSidebar } from '../../components/player/CurriculumSidebar';
import { LessonQA } from '../../components/player/LessonQA';
import { LessonNotes } from '../../components/player/LessonNotes';
import { CertificateModal } from '../../components/player/CertificateModal';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  FileText,
  BookOpen,
  Download,
  Share2,
  Award,
  CheckCircle2,
  Menu,
  X,
} from 'lucide-react';

export const CoursePlayer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'qa' | 'notes'
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    const fetchLearningRoom = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/enrollments/course/${courseId}`);
        setCourse(res.course);
        setEnrollment(res.enrollment);

        // Determine default active lesson
        if (res.course?.sections?.length > 0) {
          const firstSection = res.course.sections[0];
          if (firstSection.lessons?.length > 0) {
            // Find last accessed or first lesson
            if (res.enrollment?.lastAccessedLesson) {
              for (const sec of res.course.sections) {
                const found = sec.lessons?.find(
                  (l) => l._id.toString() === res.enrollment.lastAccessedLesson.toString()
                );
                if (found) {
                  setActiveLesson(found);
                  return;
                }
              }
            }
            setActiveLesson(firstSection.lessons[0]);
          }
        }
      } catch (err) {
        setError(err.message || 'Failed to load learning room');
      } finally {
        setLoading(false);
      }
    };
    fetchLearningRoom();
  }, [courseId]);

  // Flatten lessons list for Next / Prev navigation
  const allLessons = course?.sections
    ? course.sections.flatMap((s) => s.lessons || [])
    : [];

  const currentIndex = allLessons.findIndex(
    (l) => l._id?.toString() === activeLesson?._id?.toString()
  );

  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const handleToggleLessonComplete = async (lessonId, shouldComplete) => {
    try {
      const res = await api.put(
        `/enrollments/course/${courseId}/lesson/${lessonId}`,
        { isCompleted: shouldComplete }
      );
      setEnrollment(res.enrollment);

      // If finished whole course, open certificate celebrate modal!
      if (res.enrollment.progressPercentage === 100) {
        setShowCertModal(true);
      }
    } catch (err) {
      console.error('Failed to update lesson progress:', err);
    }
  };

  const handleSelectLesson = (lesson) => {
    setActiveLesson(lesson);
    // Scroll to player top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return <Loader text="Entering classroom..." />;
  }

  if (error || !course) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Classroom Error</h2>
        <p className="text-xs text-slate-500">{error || 'Could not access learning room.'}</p>
        <Link
          to="/my-learning"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Back to My Learning
        </Link>
      </div>
    );
  }

  const isCurrentLessonCompleted =
    activeLesson &&
    enrollment?.completedLessons?.includes(activeLesson._id.toString());

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* Learning Room Top Navigation Bar */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between z-30 sticky top-0">
        <div className="flex items-center gap-4">
          <Link
            to="/my-learning"
            className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">My Courses</span>
          </Link>
          <div className="h-5 w-px bg-slate-800 hidden sm:block"></div>
          <div>
            <h1 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
              {course.title}
            </h1>
            <span className="text-[11px] text-indigo-400 font-medium line-clamp-1">
              {activeLesson ? activeLesson.title : 'Loading lecture...'}
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2">
          {/* Previous / Next Lecture Buttons */}
          <button
            onClick={() => prevLesson && handleSelectLesson(prevLesson)}
            disabled={!prevLesson}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-xl text-slate-300 transition-colors"
            title="Previous Lecture"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => nextLesson && handleSelectLesson(nextLesson)}
            disabled={!nextLesson}
            className="p-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-30 rounded-xl text-slate-300 transition-colors"
            title="Next Lecture"
          >
            <ChevronRight size={18} />
          </button>

          {/* Toggle Sidebar on mobile */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-indigo-400 rounded-xl transition-colors lg:hidden"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* Main Workspace (Video + Tabs + Sidebar) */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden relative">
        
        {/* Left / Center: Video and Tabs */}
        <div className="flex-1 flex flex-col overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-6">
          
          {/* Main Video Player */}
          {activeLesson ? (
            <VideoPlayer
              videoUrl={activeLesson.videoUrl}
              title={activeLesson.title}
              isCompleted={isCurrentLessonCompleted}
              onToggleComplete={() =>
                handleToggleLessonComplete(
                  activeLesson._id,
                  !isCurrentLessonCompleted
                )
              }
              onEnded={() => {
                if (!isCurrentLessonCompleted) {
                  handleToggleLessonComplete(activeLesson._id, true);
                }
              }}
            />
          ) : (
            <div className="aspect-video bg-slate-950 rounded-2xl flex items-center justify-center text-slate-500">
              No lecture selected
            </div>
          )}

          {/* Lesson Details & Navigation */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/60 border border-slate-800/80 p-5 rounded-2xl">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeLesson?.title}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {activeLesson?.description || 'Learn and practice concepts shown in this lecture video.'}
              </p>
            </div>

            {nextLesson && (
              <button
                onClick={() => handleSelectLesson(nextLesson)}
                className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 whitespace-nowrap self-start sm:self-auto"
              >
                <span>Next Lecture</span>
                <ChevronRight size={14} />
              </button>
            )}
          </div>

          {/* Lecture Workspace Tabs */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 border-b border-slate-800 pb-2">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'overview'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen size={14} />
                Overview & Resources
              </button>
              <button
                onClick={() => setActiveTab('qa')}
                className={`pb-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'qa'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare size={14} />
                Lesson Q&A Discussion
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`pb-2 text-xs font-bold transition-colors flex items-center gap-1.5 ${
                  activeTab === 'notes'
                    ? 'text-indigo-400 border-b-2 border-indigo-500'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText size={14} />
                Personal Notes
              </button>
            </div>

            {/* Tab Contents */}
            {activeTab === 'overview' && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 space-y-6 text-slate-300 text-xs leading-relaxed">
                <div>
                  <h4 className="font-bold text-sm text-white mb-2">About This Lecture</h4>
                  <p>{activeLesson?.description || 'Follow along with the instructor step by step. Download the attachments below to inspect source code.'}</p>
                </div>

                {activeLesson?.resources && activeLesson.resources.length > 0 && (
                  <div>
                    <h4 className="font-bold text-sm text-white mb-3">Downloadable Lesson Resources</h4>
                    <div className="space-y-2">
                      {activeLesson.resources.map((res, rIdx) => (
                        <a
                          key={rIdx}
                          href={res.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-xl flex items-center justify-between text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Download size={14} />
                            <span className="font-bold">{res.title}</span>
                          </div>
                          <span className="text-[10px] uppercase font-mono text-slate-500">{res.fileType || 'PDF'}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'qa' && activeLesson && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 text-slate-900">
                <LessonQA
                  courseId={courseId}
                  lessonId={activeLesson._id}
                  lessonTitle={activeLesson.title}
                />
              </div>
            )}

            {activeTab === 'notes' && activeLesson && (
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-2xl p-6 text-slate-900">
                <LessonNotes
                  courseId={courseId}
                  lessonId={activeLesson._id}
                  lessonTitle={activeLesson.title}
                  initialNotes={enrollment?.notes || []}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Playlist Curriculum */}
        <div
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-full lg:w-96 shrink-0 bg-white text-slate-900 z-20 shadow-2xl lg:shadow-none`}
        >
          <CurriculumSidebar
            course={course}
            activeLessonId={activeLesson?._id}
            completedLessons={enrollment?.completedLessons || []}
            progressPercentage={enrollment?.progressPercentage || 0}
            onSelectLesson={handleSelectLesson}
            onToggleComplete={handleToggleLessonComplete}
            onOpenCertificate={() => setShowCertModal(true)}
          />
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertModal && (
        <CertificateModal
          isOpen={showCertModal}
          onClose={() => setShowCertModal(false)}
          studentName={user?.name}
          courseTitle={course.title}
          instructorName={course.instructor?.name}
          certificateId={enrollment?.certificateId || 'EDU-VERIFIED-2026'}
          completionDate={enrollment?.completedAt || new Date()}
        />
      )}
    </div>
  );
};
