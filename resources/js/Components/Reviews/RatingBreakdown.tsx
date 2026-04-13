import React from 'react';
import StarRating from './StarRating';

interface RatingBreakdownProps {
    averageRating: number;
    totalReviews: number;
    ratingsBreakdown: Record<number, number>;
    activeFilter: number | 'all';
    onFilterChange: (rating: number | 'all') => void;
}

export default function RatingBreakdown({
    averageRating,
    totalReviews,
    ratingsBreakdown,
    activeFilter,
    onFilterChange,
}: RatingBreakdownProps) {
    const maxCount = Math.max(...Object.values(ratingsBreakdown), 1);

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Average Score */}
                <div className="text-center flex-shrink-0">
                    <div className="text-6xl font-bold text-gray-900 leading-none">
                        {averageRating.toFixed(1)}
                    </div>
                    <StarRating rating={averageRating} size="md" className="mt-2 justify-center" />
                    <p className="text-sm text-gray-500 mt-1">
                        {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}
                    </p>
                </div>

                {/* Distribution Bars */}
                <div className="flex-1 w-full space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => {
                        const count = ratingsBreakdown[star] ?? 0;
                        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                        const isActive = activeFilter === star;

                        return (
                            <button
                                key={star}
                                onClick={() => onFilterChange(isActive ? 'all' : star)}
                                className={`w-full flex items-center gap-3 group rounded-md px-1 py-0.5 transition-colors ${
                                    isActive ? 'bg-amber-50' : 'hover:bg-gray-50'
                                }`}
                                aria-pressed={isActive}
                                title={`Filter by ${star} stars (${count})`}
                            >
                                <span className="text-sm text-gray-600 w-4 text-right flex-shrink-0">
                                    {star}
                                </span>
                                <svg
                                    className={`w-4 h-4 flex-shrink-0 ${
                                        isActive ? 'text-amber-400 fill-amber-400' : 'text-amber-400 fill-amber-400'
                                    }`}
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                </svg>
                                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-2 rounded-full transition-all duration-500 ${
                                            isActive ? 'bg-amber-400' : 'bg-amber-300 group-hover:bg-amber-400'
                                        }`}
                                        style={{ width: `${pct}%` }}
                                    />
                                </div>
                                <span className="text-xs text-gray-500 w-8 text-right flex-shrink-0">
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Clear Filter */}
            {activeFilter !== 'all' && (
                <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                    <button
                        onClick={() => onFilterChange('all')}
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                    >
                        Show all reviews
                    </button>
                </div>
            )}
        </div>
    );
}
