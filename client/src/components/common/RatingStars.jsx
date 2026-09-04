import React from 'react';
import { Star, StarHalf } from 'lucide-react';

export const RatingStars = ({ rating = 0, numReviews = null, size = 16, showNumber = true }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.4;
  const emptyStars = Math.max(0, 5 - fullStars - (hasHalfStar ? 1 : 0));

  return (
    <div className="inline-flex items-center gap-1">
      {showNumber && (
        <span className="font-bold text-amber-600 text-sm mr-0.5">
          {Number(rating).toFixed(1)}
        </span>
      )}
      <div className="flex items-center text-amber-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} size={size} className="fill-amber-400 text-amber-400" />
        ))}
        {hasHalfStar && (
          <StarHalf size={size} className="fill-amber-400 text-amber-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} size={size} className="text-slate-300 fill-slate-100" />
        ))}
      </div>
      {numReviews !== null && (
        <span className="text-xs text-slate-500 ml-1">
          ({numReviews.toLocaleString()})
        </span>
      )}
    </div>
  );
};
