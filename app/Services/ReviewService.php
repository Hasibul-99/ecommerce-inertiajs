<?php

namespace App\Services;

use App\Models\Product;
use App\Models\Review;
use App\Models\ReviewImage;
use App\Models\ReviewReport;
use App\Models\User;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ReviewService
{
    /**
     * Create a new review for a product.
     *
     * @param User $user
     * @param Product $product
     * @param array $data
     * @return Review
     * @throws \Exception
     */
    public function createReview(User $user, Product $product, array $data): Review
    {
        // Check if user can review
        $canReview = $this->canUserReview($user, $product);
        
        if (!$canReview['can_review']) {
            throw new \Exception($canReview['message']);
        }

        return DB::transaction(function () use ($user, $product, $data, $canReview) {
            // Check for spam
            if ($this->isSpam($data)) {
                throw new \Exception('Your review content appears to be spam. Please try again.');
            }

            // Create the review
            $review = Review::create([
                'product_id' => $product->id,
                'user_id' => $user->id,
                'order_item_id' => $canReview['order_item_id'] ?? null,
                'rating' => $data['rating'],
                'title' => $data['title'] ?? null,
                'comment' => $data['comment'],
                'pros' => $data['pros'] ?? null,
                'cons' => $data['cons'] ?? null,
                'is_verified_purchase' => $canReview['is_verified_purchase'],
                'is_approved' => !config('reviews.require_approval', false),
            ]);

            // Handle image uploads
            if (!empty($data['images'])) {
                foreach ($data['images'] as $index => $image) {
                    if ($image && $image->isValid()) {
                        $path = $image->store('reviews/' . $review->id, 'public');
                        
                        ReviewImage::create([
                            'review_id' => $review->id,
                            'image_path' => $path,
                            'order' => $index,
                        ]);
                    }
                }
            }

            // Update product rating cache
            $this->updateProductRatingCache($product);

            // Log activity
            activity()
                ->performedOn($review)
                ->causedBy($user)
                ->withProperties([
                    'product_id' => $product->id,
                    'rating' => $review->rating,
                    'is_verified' => $review->is_verified_purchase,
                ])
                ->log('review_created');

            return $review->load('images', 'user');
        });
    }

    /**
     * Check if a user can review a product.
     *
     * @param User $user
     * @param Product $product
     * @return array
     */
    public function canUserReview(User $user, Product $product): array
    {
        // Check if user has already reviewed this product
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();

        if ($existingReview) {
            return [
                'can_review' => false,
                'message' => 'You have already reviewed this product.',
                'is_verified_purchase' => false,
            ];
        }

        // Check if user has purchased this product
        $orderItem = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->where('status', 'completed');
        })
        ->where('product_id', $product->id)
        ->whereDoesntHave('review')
        ->first();

        if ($orderItem) {
            return [
                'can_review' => true,
                'message' => 'You can review this product as a verified purchase.',
                'is_verified_purchase' => true,
                'order_item_id' => $orderItem->id,
            ];
        }

        // Allow non-verified reviews if configured
        if (config('reviews.allow_non_verified', true)) {
            return [
                'can_review' => true,
                'message' => 'You can review this product.',
                'is_verified_purchase' => false,
            ];
        }

        return [
            'can_review' => false,
            'message' => 'You must purchase this product before reviewing it.',
            'is_verified_purchase' => false,
        ];
    }

    /**
     * Mark a review as helpful.
     *
     * @param User $user
     * @param Review $review
     * @return bool
     */
    public function markAsHelpful(User $user, Review $review): bool
    {
        // Check if user has already marked this review as helpful
        $alreadyMarked = $review->helpfulVotes()
            ->where('user_id', $user->id)
            ->exists();

        if ($alreadyMarked) {
            // Remove the helpful vote (toggle)
            $review->helpfulVotes()->detach($user->id);
            $review->decrement('helpful_count');
            
            return false;
        }

        // Add helpful vote
        $review->helpfulVotes()->attach($user->id);
        $review->increment('helpful_count');

        return true;
    }

    /**
     * Report a review.
     *
     * @param User $user
     * @param Review $review
     * @param string $reason
     * @param string|null $details
     * @return void
     * @throws \Exception
     */
    public function reportReview(User $user, Review $review, string $reason, ?string $details = null): void
    {
        // Check if user has already reported this review
        $existingReport = ReviewReport::where('user_id', $user->id)
            ->where('review_id', $review->id)
            ->first();

        if ($existingReport) {
            throw new \Exception('You have already reported this review.');
        }

        DB::transaction(function () use ($user, $review, $reason, $details) {
            ReviewReport::create([
                'review_id' => $review->id,
                'user_id' => $user->id,
                'reason' => $reason,
                'details' => $details,
                'status' => 'pending',
            ]);

            $review->increment('reported_count');

            // Auto-hide review if reported multiple times
            $reportThreshold = config('reviews.auto_hide_threshold', 5);
            if ($review->reported_count >= $reportThreshold && $review->is_approved) {
                $review->update(['is_approved' => false]);

                activity()
                    ->performedOn($review)
                    ->withProperties(['reason' => 'auto_hidden_reports', 'count' => $review->reported_count])
                    ->log('review_auto_hidden');
            }

            activity()
                ->performedOn($review)
                ->causedBy($user)
                ->withProperties(['reason' => $reason])
                ->log('review_reported');
        });
    }

    /**
     * Get product review statistics.
     *
     * @param Product $product
     * @return array
     */
    public function getProductReviewStats(Product $product): array
    {
        $reviews = Review::where('product_id', $product->id)
            ->approved()
            ->get();

        $totalReviews = $reviews->count();
        
        if ($totalReviews === 0) {
            return [
                'total_reviews' => 0,
                'average_rating' => 0,
                'rating_distribution' => [
                    5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0,
                ],
                'verified_purchases' => 0,
                'with_images' => 0,
            ];
        }

        // Calculate rating distribution
        $ratingDistribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($reviews as $review) {
            $ratingDistribution[$review->rating]++;
        }

        // Calculate average rating
        $averageRating = round($reviews->avg('rating'), 2);

        // Count verified purchases
        $verifiedPurchases = $reviews->where('is_verified_purchase', true)->count();

        // Count reviews with images
        $withImages = Review::where('product_id', $product->id)
            ->approved()
            ->has('images')
            ->count();

        return [
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'rating_distribution' => $ratingDistribution,
            'verified_purchases' => $verifiedPurchases,
            'with_images' => $withImages,
        ];
    }

    /**
     * Update product rating cache.
     *
     * @param Product $product
     * @return void
     */
    protected function updateProductRatingCache(Product $product): void
    {
        $stats = $this->getProductReviewStats($product);
        
        // You might want to store this in a cache or on the product model
        cache()->put(
            "product_review_stats_{$product->id}",
            $stats,
            now()->addHours(24)
        );
    }

    /**
     * Simple spam detection.
     *
     * @param array $data
     * @return bool
     */
    protected function isSpam(array $data): bool
    {
        $comment = strtolower($data['comment'] ?? '');
        $title = strtolower($data['title'] ?? '');
        
        // Check for excessive URLs
        $urlCount = substr_count($comment, 'http://') + substr_count($comment, 'https://');
        if ($urlCount > 2) {
            return true;
        }

        // Check for spam keywords
        $spamKeywords = [
            'click here',
            'buy now',
            'limited time',
            'act now',
            'special offer',
            'viagra',
            'casino',
            'lottery',
            'prize',
            'winner',
        ];

        foreach ($spamKeywords as $keyword) {
            if (str_contains($comment, $keyword) || str_contains($title, $keyword)) {
                return true;
            }
        }

        // Check for excessive repetition
        $words = str_word_count($comment, 1);
        if (count($words) > 10) {
            $uniqueWords = array_unique($words);
            $repetitionRatio = count($words) / count($uniqueWords);
            
            if ($repetitionRatio > 3) {
                return true;
            }
        }

        // Check for excessive capitalization
        $upperCount = 0;
        $totalChars = strlen(preg_replace('/\s+/', '', $comment));
        
        for ($i = 0; $i < strlen($comment); $i++) {
            if (ctype_upper($comment[$i])) {
                $upperCount++;
            }
        }
        
        if ($totalChars > 0 && ($upperCount / $totalChars) > 0.5) {
            return true;
        }

        return false;
    }

    /**
     * Get reviews for a vendor's products.
     *
     * @param int $vendorId
     * @param array $filters
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    public function getVendorReviews(int $vendorId, array $filters = [])
    {
        $query = Review::whereHas('product', function ($q) use ($vendorId) {
            $q->where('vendor_id', $vendorId);
        })
        ->with(['product', 'user', 'images']);

        // Apply filters
        if (!empty($filters['rating'])) {
            $query->where('rating', $filters['rating']);
        }

        if (!empty($filters['status'])) {
            if ($filters['status'] === 'approved') {
                $query->where('is_approved', true);
            } elseif ($filters['status'] === 'pending') {
                $query->where('is_approved', false);
            }
        }

        if (!empty($filters['verified'])) {
            $query->where('is_verified_purchase', true);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', '%' . $filters['search'] . '%')
                    ->orWhere('comment', 'like', '%' . $filters['search'] . '%');
            });
        }

        // Default sorting: most recent first
        $sortBy = $filters['sort_by'] ?? 'created_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';
        $query->orderBy($sortBy, $sortOrder);

        return $query->paginate($filters['per_page'] ?? 15);
    }

    /**
     * Respond to a review as a vendor.
     *
     * @param Review $review
     * @param User $vendor
     * @param string $response
     * @return Review
     * @throws \Exception
     */
    public function respondToReview(Review $review, User $vendor, string $response): Review
    {
        // Verify vendor owns the product
        if ($review->product->vendor_id !== $vendor->vendor->id) {
            throw new \Exception('You do not have permission to respond to this review.');
        }

        $review->update([
            'vendor_response' => $response,
            'vendor_response_at' => now(),
            'vendor_response_by' => $vendor->id,
        ]);

        activity()
            ->performedOn($review)
            ->causedBy($vendor)
            ->log('vendor_responded_to_review');

        return $review->load('vendorResponder');
    }
}
