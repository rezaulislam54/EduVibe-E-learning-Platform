import React, { useState } from 'react';
import { RatingStars } from '../common/RatingStars';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const ReviewSection = ({
  courseId,
  reviews = [],
  rating = 5,
  numReviews = 0,
  isEnrolled = false,
  onReviewSubmitted = null,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [userRating, setUserRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setError('Please write a short comment about your experience');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await api.post(`/reviews/${courseId}`, {
        rating: userRating,
        comment: comment.trim(),
      });
      setSuccessMsg('Thank you! Your review has been published.');
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted(res.review);
    } catch (err) {
      setError(err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Reviews Summary Stats */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-8">
        <div className="text-center md:border-r md:border-slate-200 md:pr-8">
          <div className="text-5xl font-black text-slate-900 mb-1">
            {Number(rating).toFixed(1)}
          </div>
          <RatingStars rating={rating} size={20} showNumber={false} />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Course Rating • {numReviews} Reviews
          </p>
        </div>

        {/* Rating Breakdown Bars */}
        <div className="flex-1 w-full space-y-2">
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
            const percentage = numReviews > 0 ? (count / numReviews) * 100 : stars === 5 ? 85 : 5;

            return (
              <div key={stars} className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1 w-12 text-slate-600 font-semibold">
                  <span>{stars}</span>
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                </div>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <span className="w-8 text-right text-slate-400 font-medium">
                  {Math.round(percentage)}%
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Submission Form (For Enrolled Students) */}
      {isEnrolled && isAuthenticated && (
        <form
          onSubmit={handleSubmitReview}
          className="bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <MessageSquare size={16} className="text-indigo-600" />
              Write a Review
            </h4>

            {/* Interactive Stars */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setUserRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 text-slate-300 hover:scale-110 transition-transform"
                >
                  <Star
                    size={22}
                    className={`${
                      (hoverRating || userRating) >= star
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-slate-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <textarea
            rows={3}
            placeholder="Share what you liked about this course, instructor explanations, real-world usefulness..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 placeholder:text-slate-400"
          ></textarea>

          {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
          {successMsg && (
            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <CheckCircle2 size={14} />
              {successMsg}
            </p>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              <Send size={13} />
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div
              key={rev._id}
              className="bg-white border border-slate-100 rounded-2xl p-5 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={
                      rev.user?.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${rev.user?.name}`
                    }
                    alt={rev.user?.name || 'User'}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900">
                      {rev.user?.name || 'EduVibe Learner'}
                    </h5>
                    <p className="text-[10px] text-slate-400">
                      {rev.createdAt
                        ? new Date(rev.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Verified Student'}
                    </p>
                  </div>
                </div>

                <RatingStars rating={rev.rating} size={14} showNumber={false} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {rev.comment}
              </p>
            </div>
          ))
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-xs text-slate-400">
              No reviews yet for this course. Be the first to enroll and share your experience!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
