import React from 'react';

interface StarRatingProps {
    rating: number; // 0–5, supports decimals
    size?: 'sm' | 'md' | 'lg';
    showValue?: boolean;
    className?: string;
}

const sizeMap = {
    sm: 14,
    md: 18,
    lg: 24,
};

export default function StarRating({
    rating,
    size = 'md',
    showValue = false,
    className = '',
}: StarRatingProps) {
    const px = sizeMap[size];
    const clampedRating = Math.max(0, Math.min(5, rating));

    return (
        <div className={`inline-flex items-center gap-1 ${className}`}>
            <div className="flex" aria-label={`${clampedRating} out of 5 stars`}>
                {[1, 2, 3, 4, 5].map((star) => {
                    const fill = Math.max(0, Math.min(1, clampedRating - (star - 1)));
                    const uid = `star-${star}-${Math.random().toString(36).slice(2, 7)}`;
                    return (
                        <svg
                            key={star}
                            width={px}
                            height={px}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-shrink-0"
                        >
                            <defs>
                                <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset={`${fill * 100}%`} stopColor="#FBBF24" />
                                    <stop offset={`${fill * 100}%`} stopColor="#D1D5DB" />
                                </linearGradient>
                            </defs>
                            <path
                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                                fill={`url(#${uid})`}
                                stroke={fill > 0 ? '#FBBF24' : '#D1D5DB'}
                                strokeWidth="0.5"
                            />
                        </svg>
                    );
                })}
            </div>
            {showValue && (
                <span className="text-sm font-medium text-gray-700 ml-1">
                    {clampedRating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
