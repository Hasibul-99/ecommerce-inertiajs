import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { FiLoader, FiMessageSquare } from 'react-icons/fi';
import RatingBreakdown from './RatingBreakdown';
import ReviewCard, { Review } from './ReviewCard';
import ReviewForm from './ReviewForm';

interface ReviewsSummary {
    average_rating: number;
    total_reviews: number;
    ratings_breakdown: Record<number, number>;
}

interface CanReviewData {
    can_review: boolean;
    message: string | null;
    is_verified_purchase: boolean;
}

interface ReviewListProps {
    productId: number;
    productSlug: string;
    initialReviews: Review[];
    reviewsSummary: ReviewsSummary;
    canReview: CanReviewData;
    currentUserId?: number;
}

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest' | 'most_helpful';

const SORT_LABELS: Record<SortOption, string> = {
    newest: 'Most Recent',
    oldest: 'Oldest First',
    highest: 'Highest Rated',
    lowest: 'Lowest Rated',
    most_helpful: 'Most Helpful',
};

const SORT_TO_API: Record<SortOption, string> = {
    newest: 'recent',
    oldest: 'oldest',
    highest: 'rating_high',
    lowest: 'rating_low',
    most_helpful: 'helpful',
};

export default function ReviewList({
    productId,
    productSlug,
    initialReviews,
    reviewsSummary,
    canReview,
    currentUserId,
}: ReviewListProps) {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [summary, setSummary] = useState<ReviewsSummary>(reviewsSummary);
    const [ratingFilter, setRatingFilter] = useState<number | 'all'>('all');
    const [sortBy, setSortBy] = useState<SortOption>('newest');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialReviews.length >= 10);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [showReviewForm, setShowReviewForm] = useState(false);

    const fetchReviews = useCallback(
        async (opts: {
            rating?: number | 'all';
            sort?: SortOption;
            page?: number;
            append?: boolean;
        }) => {
            const { rating = ratingFilter, sort = sortBy, page: pg = 1, append = false } = opts;
            const loading = append ? setIsLoadingMore : setIsLoading;

            loading(true);
            try {
                const params: Record<string, string> = {
                    sort: SORT_TO_API[sort],
                    page: String(pg),
                };
                if (rating !== 'all') params.rating = String(rating);

                const res = await axios.get(route('reviews.index', productSlug), { params });
                const data = res.data;

                const newReviews: Review[] = data.reviews.data ?? [];
                setReviews(append ? (prev) => [...prev, ...newReviews] : newReviews);
                setHasMore(newReviews.length >= 10 && data.reviews.current_page < data.reviews.last_page);
                if (data.stats) {
                    setSummary({
                        average_rating: data.stats.average_rating,
                        total_reviews: data.stats.total_reviews,
                        ratings_breakdown: data.stats.rating_distribution,
                    });
                }
                setPage(pg);
            } catch {
                // silently keep existing reviews on failure
            } finally {
                loading(false);
            }
        },
        [productSlug, ratingFilter, sortBy]
    );

    const handleFilterChange = (rating: number | 'all') => {
        setRatingFilter(rating);
        fetchReviews({ rating, sort: sortBy, page: 1 });
    };

    const handleSortChange = (sort: SortOption) => {
        setSortBy(sort);
        fetchReviews({ rating: ratingFilter, sort, page: 1 });
    };

    const handleLoadMore = () => {
        fetchReviews({ rating: ratingFilter, sort: sortBy, page: page + 1, append: true });
    };

    const handleHelpfulToggle = (reviewId: number, newIsHelpful: boolean, newCount: number) => {
        setReviews((prev) =>
            prev.map((r) =>
                r.id === reviewId
                    ? { ...r, is_helpful: newIsHelpful, helpful_count: newCount }
                    : r
            )
        );
    };

    const handleDelete = (reviewId: number) => {
        setReviews((prev) => prev.filter((r) => r.id !== reviewId));
        setSummary((prev) => ({
            ...prev,
            total_reviews: Math.max(0, prev.total_reviews - 1),
        }));
    };

    const handleReviewSubmitSuccess = () => {
        setShowReviewForm(false);
        setEditingReview(null);
        // Reload reviews to show new/updated review
        fetchReviews({ rating: 'all', sort: 'newest', page: 1 });
        setRatingFilter('all');
        setSortBy('newest');
    };

    return (
        <div className="space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                    Customer Reviews
                    {summary.total_reviews > 0 && (
                        <span className="ml-2 text-base font-normal text-gray-500">
                            ({summary.total_reviews})
                        </span>
                    )}
                </h3>
                {canReview.can_review && !showReviewForm && (
                    <button
                        onClick={() => setShowReviewForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                        <FiMessageSquare className="w-4 h-4" />
                        Write a Review
                    </button>
                )}
            </div>

            {/* Rating Breakdown */}
            {summary.total_reviews > 0 && (
                <RatingBreakdown
                    averageRating={summary.average_rating}
                    totalReviews={summary.total_reviews}
                    ratingsBreakdown={summary.ratings_breakdown}
                    activeFilter={ratingFilter}
                    onFilterChange={handleFilterChange}
                />
            )}

            {/* Write Review Form */}
            {(showReviewForm || editingReview) && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h4 className="text-base font-semibold text-gray-900">
                            {editingReview ? 'Edit Your Review' : 'Write a Review'}
                        </h4>
                        <button
                            onClick={() => {
                                setShowReviewForm(false);
                                setEditingReview(null);
                            }}
                            className="text-sm text-gray-400 hover:text-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                    <ReviewForm
                        productId={productId}
                        productSlug={productSlug}
                        canReview={canReview}
                        editingReview={editingReview ?? undefined}
                        onSuccess={handleReviewSubmitSuccess}
                    />
                </div>
            )}

            {/* Cannot Review Message */}
            {!canReview.can_review && canReview.message && !showReviewForm && !editingReview && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
                    {canReview.message}
                </div>
            )}

            {/* Sort Controls */}
            {reviews.length > 0 && (
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500">
                        {ratingFilter !== 'all'
                            ? `Showing ${ratingFilter}-star reviews`
                            : `Showing all reviews`}
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => handleSortChange(e.target.value as SortOption)}
                            className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-white"
                        >
                            {(Object.keys(SORT_LABELS) as SortOption[]).map((key) => (
                                <option key={key} value={key}>
                                    {SORT_LABELS[key]}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            )}

            {/* Review Cards */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <FiLoader className="w-6 h-6 text-indigo-400 animate-spin" />
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FiMessageSquare className="w-7 h-7 text-gray-400" />
                    </div>
                    <p className="text-gray-600 font-medium">
                        {ratingFilter !== 'all'
                            ? `No ${ratingFilter}-star reviews yet.`
                            : 'No reviews yet.'}
                    </p>
                    {canReview.can_review && (
                        <button
                            onClick={() => setShowReviewForm(true)}
                            className="mt-4 text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                            Be the first to review this product!
                        </button>
                    )}
                </div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <ReviewCard
                            key={review.id}
                            review={review}
                            productSlug={productSlug}
                            currentUserId={currentUserId}
                            onHelpfulToggle={handleHelpfulToggle}
                            onEdit={(r) => {
                                setEditingReview(r);
                                setShowReviewForm(false);
                            }}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {/* Load More */}
            {hasMore && !isLoading && (
                <div className="text-center pt-2">
                    <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 disabled:opacity-50 transition-colors"
                    >
                        {isLoadingMore ? (
                            <>
                                <FiLoader className="w-4 h-4 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            'Load More Reviews'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
