import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Loader } from '../components/common/Loader';
import { RatingStars } from '../components/common/RatingStars';
import { Badge } from '../components/common/Badge';
import { CurriculumAccordion } from '../components/course/CurriculumAccordion';
import { ReviewSection } from '../components/course/ReviewSection';
import {
  Play,
  CheckCircle2,
  Clock,
  BookOpen,
  Award,
  Globe,
  Users,
  ShieldCheck,
  Share2,
  FileText,
  X,
  Sparkles,
} from 'lucide-react';

export const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [course, setCourse] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrollment, setEnrollment] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/${id}`);
        setCourse(res.course);
        setIsEnrolled(res.isEnrolled);
        setEnrollment(res.enrollment);
        setReviews(res.reviews || []);
      } catch (err) {
        setError(err.message || 'Failed to load course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id, isAuthenticated]);

  const handleEnrollFree = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }

    try {
      setEnrolling(true);
      const res = await api.post('/enrollments', { courseId: course._id });
      setIsEnrolled(true);
      setEnrollment(res.enrollment);
      navigate(`/learn/${course._id}`);
    } catch (err) {
      alert(err.message || 'Enrollment failed');
    } finally {
      setEnrolling(false);
    }
  };

  const handleBuyCourse = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/courses/${id}` } } });
      return;
    }
    navigate(`/checkout/${course._id}`);
  };

  if (loading) {
    return <Loader text="Loading course details..." />;
  }

  if (error || !course) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">Course Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The requested course could not be located.'}</p>
        <Link
          to="/courses"
          className="inline-block px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
        >
          Return to Catalog
        </Link>
      </div>
    );
  }

  const isFree = course.isFree || course.price === 0;
  const price = course.discountPrice > 0 ? course.discountPrice : course.price;
  const totalLessons = course.totalLessons || (course.sections
    ? course.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
    : 0);

  return (
    <div className="pb-24">
      {/* Dark Hero Header */}
      <section className="bg-slate-900 text-white pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          
          {/* Main Info (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Breadcrumb & Category */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <Link to="/courses" className="text-slate-400 hover:text-indigo-400 font-medium">
                Courses
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-indigo-400 font-semibold">{course.category}</span>
              <span className="text-slate-600">/</span>
              <Badge variant="neutral" size="xs" className="bg-slate-800 text-slate-300 border-slate-700">
                {course.level}
              </Badge>
            </div>

            {/* Course Title */}
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
              {course.title}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              {course.subtitle}
            </p>

            {/* Meta Row: Rating, Students, Instructor */}
            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <RatingStars rating={course.rating} numReviews={course.numReviews} size={15} />
              <span className="text-slate-400 flex items-center gap-1">
                <Users size={14} />
                {(course.studentsEnrolled || 0).toLocaleString()} learners enrolled
              </span>
              <span className="text-slate-400 flex items-center gap-1">
                <Globe size={14} />
                {course.language || 'English'}
              </span>
            </div>

            {/* Instructor Quick Tag */}
            <div className="flex items-center gap-3 pt-2">
              <img
                src={
                  course.instructor?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                }
                alt={course.instructor?.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/40"
              />
              <div>
                <p className="text-xs text-slate-400">Created by</p>
                <p className="text-sm font-bold text-white">
                  {course.instructor?.name || 'EduVibe Instructor'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Body Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Course Content (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* What You'll Learn Box */}
            {course.learningObjectives && course.learningObjectives.length > 0 && (
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles size={20} className="text-indigo-600" />
                  What you'll learn in this course
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-700">
                  {course.learningObjectives.map((obj, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{obj}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Course Description
              </h3>
              <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-line leading-relaxed">
                {course.description}
              </div>
            </div>

            {/* Course Content / Curriculum Accordion */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Course Content & Syllabus
              </h3>
              <CurriculumAccordion
                sections={course.sections || []}
                onPreviewLesson={(lesson) => setPreviewVideo(lesson.videoUrl)}
              />
            </div>

            {/* Requirements & Target Audience */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Requirements</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {course.requirements && course.requirements.length > 0 ? (
                    course.requirements.map((req, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{req}</span>
                      </li>
                    ))
                  ) : (
                    <li>No prerequisites required. Suitable for beginners!</li>
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-sm text-slate-900">Who this course is for</h4>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {course.targetAudience && course.targetAudience.length > 0 ? (
                    course.targetAudience.map((aud, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-indigo-600 font-bold">•</span>
                        <span>{aud}</span>
                      </li>
                    ))
                  ) : (
                    <li>Anyone looking to elevate their professional tech skills.</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Instructor Profile Card */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Your Instructor
              </h3>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-6 shadow-xs">
                <img
                  src={
                    course.instructor?.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={course.instructor?.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-md shrink-0"
                />
                <div className="space-y-2 flex-1">
                  <h4 className="text-base font-bold text-slate-900">
                    {course.instructor?.name}
                  </h4>
                  <p className="text-xs font-semibold text-indigo-600">
                    {course.instructor?.headline || 'Expert Software Instructor'}
                  </p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {course.instructor?.bio ||
                      'Passionate instructor dedicated to creating modern, industry-aligned web development curricula.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Student Reviews & Feedback */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900">
                Student Feedback & Reviews
              </h3>
              <ReviewSection
                courseId={course._id}
                reviews={reviews}
                rating={course.rating}
                numReviews={course.numReviews}
                isEnrolled={isEnrolled}
                onReviewSubmitted={(newRev) => setReviews([newRev, ...reviews])}
              />
            </div>
          </div>

          {/* Right Floating Purchase / Resume Sidebar */}
          <div className="lg:col-span-1">
            <div className="lg:-mt-48 sticky top-24 bg-white rounded-3xl border border-slate-200/90 shadow-2xl overflow-hidden p-6 space-y-6">
              
              {/* Thumbnail with Trailer Trigger */}
              <div
                className="relative aspect-video rounded-2xl overflow-hidden bg-slate-900 group cursor-pointer shadow-md"
                onClick={() => setPreviewVideo(course.trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4')}
              >
                <img
                  src={
                    course.thumbnail ||
                    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
                  }
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Play size={24} className="ml-1 fill-indigo-600 text-indigo-600" />
                  </div>
                </div>
                <span className="absolute bottom-3 left-3 text-[10px] font-bold text-white bg-black/70 px-2 py-0.5 rounded backdrop-blur-sm">
                  Preview Course Trailer
                </span>
              </div>

              {/* Price Row */}
              <div className="space-y-1">
                {isEnrolled ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                    <span className="text-xs font-bold text-emerald-800 flex items-center justify-center gap-1">
                      <CheckCircle2 size={16} className="text-emerald-600" /> You are enrolled in this course!
                    </span>
                    <Link
                      to={`/learn/${course._id}`}
                      className="block w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
                    >
                      Go to Learning Room ({enrollment?.progressPercentage || 0}%)
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="flex items-baseline gap-3">
                      {isFree ? (
                        <span className="text-3xl font-black text-emerald-600">
                          FREE
                        </span>
                      ) : (
                        <>
                          <span className="text-3xl font-black text-slate-900">
                            ${price}
                          </span>
                          {course.discountPrice > 0 && (
                            <>
                              <span className="text-sm line-through text-slate-400 font-semibold">
                                ${course.price}
                              </span>
                              <span className="text-xs font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">
                                {Math.round(
                                  ((course.price - course.discountPrice) /
                                    course.price) *
                                    100
                                )}
                                % OFF
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className="pt-4 space-y-2.5">
                      {isFree ? (
                        <button
                          onClick={handleEnrollFree}
                          disabled={enrolling}
                          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-emerald-600/25 transition-all hover:scale-[1.02] disabled:opacity-50"
                        >
                          {enrolling ? 'Enrolling...' : 'Enroll For Free'}
                        </button>
                      ) : (
                        <button
                          onClick={handleBuyCourse}
                          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-indigo-600/25 transition-all hover:scale-[1.02]"
                        >
                          Buy Course Now
                        </button>
                      )}

                      <p className="text-[11px] text-center text-slate-400">
                        30-Day Full Refund Guarantee • Lifetime Access
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Course Includes Checklist */}
              <div className="border-t border-slate-100 pt-5 space-y-3 text-xs text-slate-700">
                <h4 className="font-bold text-slate-900">This course includes:</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2.5">
                    <Clock size={15} className="text-indigo-600" />
                    <span>{course.totalDurationMinutes ? `${Math.round(course.totalDurationMinutes / 60)} hours` : '12 hours'} on-demand video</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <BookOpen size={15} className="text-indigo-600" />
                    <span>{totalLessons} downloadable lectures & resources</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Award size={15} className="text-indigo-600" />
                    <span>Verifiable Certificate of Completion</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck size={15} className="text-indigo-600" />
                    <span>Access on mobile, tablet, and desktop</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Preview Lightbox Modal */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl">
            <button
              onClick={() => setPreviewVideo(null)}
              className="absolute top-4 right-4 z-20 p-2 bg-white/20 hover:bg-white/40 text-white rounded-full transition-colors"
            >
              <X size={20} />
            </button>
            <div className="aspect-video w-full">
              <video
                src={previewVideo}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
