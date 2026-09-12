import React from 'react';
import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, count = null, size = 16, showNumber = false }) {
    const numericRating = Number(rating) || 0;

    return (
        <div className="flex items-center gap-1">
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        size={size}
                        className={`${
                            star <= Math.round(numericRating)
                                ? 'fill-amber-400 text-amber-400'
                                : 'fill-gray-200 text-gray-200'
                        } transition-colors`}
                    />
                ))}
            </div>
            {showNumber && (
                <span className="text-xs font-medium text-brand-text/80 ml-1">
                    {numericRating > 0 ? numericRating.toFixed(1) : 'Belum ada rating'}
                </span>
            )}
            {count !== null && (
                <span className="text-xs text-brand-text/60">
                    ({count})
                </span>
            )}
        </div>
    );
}
