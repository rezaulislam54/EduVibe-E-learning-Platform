import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BookOpen, Users, ArrowRight } from 'lucide-react';
import { RatingStars } from '../common/RatingStars';
import { Badge } from '../common/Badge';

export const CourseCard = ({ course }) => {
  const isFree = course.isFree || course.price === 0;
  const hasDiscount = course.discountPrice > 0 && course.discountPrice < course.price;

  const totalLessons = course.totalLessons || (course.sections
    ? course.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0)
    : 0);

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-slate-100">
        <img
          src={
            course.thumbnail ||
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800'
          }
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        
        {/* Category & Level Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge variant="primary" size="xs" className="shadow-sm backdrop-blur-md bg-white/90">
            {course.category}
          </Badge>
          <Badge variant="neutral" size="xs" className="shadow-sm backdrop-blur-md bg-slate-900/80 text-white border-transparent">
            {course.level}
          </Badge>
        </div>

        {/* Price Tag in corner */}
        <div className="absolute bottom-3 right-3">
          {isFree ? (
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white text-xs font-black shadow-md uppercase tracking-wider">
              Free
            </span>
          ) : (
            <div className="px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-white text-xs font-bold shadow-md flex items-center gap-1.5">
              {hasDiscount ? (
                <>
                  <span className="text-emerald-400 font-extrabold">${course.discountPrice}</span>
                  <span className="line-through text-slate-400 text-[10px]">${course.price}</span>
                </>
              ) : (
                <span className="font-extrabold text-emerald-400">${course.price}</span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Instructor */}
        <div className="flex items-center gap-2 mb-2.5">
          <img
            src={
              course.instructor?.avatar ||
              'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
            }
            alt={course.instructor?.name || 'Instructor'}
            className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
          />
          <span className="text-xs font-semibold text-slate-600 truncate">
            {course.instructor?.name || 'EduVibe Instructor'}
          </span>
        </div>

        {/* Title */}
        <Link to={`/courses/${course._id}`}>
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors mb-2">
            {course.title}
          </h3>
        </Link>

        {/* Subtitle / Short description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed flex-1">
          {course.subtitle}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-100">
          <RatingStars rating={course.rating || 4.8} numReviews={course.numReviews || 0} size={14} />
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <Users size={13} className="text-slate-400" />
            <span>{(course.studentsEnrolled || 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Meta Info & CTA */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-3 text-[11px] font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <BookOpen size={13} className="text-slate-400" />
              {totalLessons} lessons
            </span>
            <span className="flex items-center gap-1">
              <Clock size={13} className="text-slate-400" />
              {course.totalDurationMinutes ? `${Math.round(course.totalDurationMinutes / 60)}h` : '10h'}
            </span>
          </div>

          <Link
            to={`/courses/${course._id}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:text-indigo-700 hover:translate-x-0.5 transition-all"
          >
            Details
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
};
