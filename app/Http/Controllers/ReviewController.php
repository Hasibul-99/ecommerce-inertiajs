<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    protected $reviewService;

    /**
     * Create a new controller instance.
     */
    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
        $this->middleware('auth')->only(['store', 'update', 'destroy', 'markHelpful', 'report']);
    }

    /**
     * Display reviews for a product.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Product $product, Request $request)
    {
        $query = $product->reviews()
            ->with(['user', 'images', 'vendorResponder'])
            ->approved();

        // Filter by rating
        if ($request->has('rating') && $request->rating != 'all') {
            $query->where('rating', $request->rating);
        }

        // Filter by verified purchase
        if ($request->has('verified') && $request->verified == '1') {
            $query->where('is_verified_purchase', true);
        }

        // Filter by has images
        if ($request->has('with_images') && $request->with_images == '1') {
            $query->has('images');
        }

        // Sort
        $sortBy = $request->get('sort', 'recent');
        switch ($sortBy) {
            case 'helpful':
                $query->orderBy('helpful_count', 'desc');
                break;
            case 'rating_high':
                $query->orderBy('rating', 'desc');
                break;
            case 'rating_low':
                $query->orderBy('rating', 'asc');
                break;
            default: // recent
                $query->latest();
        }

        $reviews = $query->paginate(10);

        // Check if current user has marked reviews as helpful
        $user = Auth::user();
        $helpfulVotes = [];
        if ($user) {
            $helpfulVotes = $user->helpfulVotes()->pluck('review_id')->toArray();
        }

        // Format reviews for frontend
        $formattedReviews = $reviews->through(function ($review) use ($helpfulVotes) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'pros' => $review->pros,
                'cons' => $review->cons,
                'is_verified_purchase' => $review->is_verified_purchase,
                'helpful_count' => $review->helpful_count,
                'is_helpful' => in_array($review->id, $helpfulVotes),
                'created_at' => $review->created_at->toISOString(),
                'images' => $review->images->map(fn($img) => [
                    'id' => $img->id,
                    'url' => $img->url,
                    'order' => $img->order,
                ]),
                'vendor_response' => $review->vendor_response,
                'vendor_response_at' => $review->vendor_response_at?->toISOString(),
                'vendor_responder' => $review->vendorResponder ? [
                    'name' => $review->vendorResponder->name,
                ] : null,
                'user' => [
                    'name' => $review->user->name,
                    'avatar' => $review->user->avatar ?? null,
                ],
            ];
        });

        // Get review statistics
        $stats = $this->reviewService->getProductReviewStats($product);

        return response()->json([
            'reviews' => $formattedReviews,
            'stats' => $stats,
        ]);
    }

    /**
     * Store a newly created review.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request, Product $product)
    {
        $user = Auth::user();

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|max:2000',
            'pros' => 'nullable|string|max:1000',
            'cons' => 'nullable|string|max:1000',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:2048',
        ]);

        try {
            $review = $this->reviewService->createReview($user, $product, [
                'rating' => $request->rating,
                'title' => $request->title,
                'comment' => $request->comment,
                'pros' => $request->pros,
                'cons' => $request->cons,
                'images' => $request->file('images', []),
            ]);

            return redirect()->back()->with('success', 'Your review has been submitted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Update the specified review.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Review $review)
    {
        $user = Auth::user();

        // Ensure the user owns this review
        if ($review->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'required|string|max:2000',
            'pros' => 'nullable|string|max:1000',
            'cons' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'pros' => $request->pros,
            'cons' => $request->cons,
        ]);

        activity()
            ->performedOn($review)
            ->causedBy($user)
            ->log('review_updated');

        return redirect()->back()->with('success', 'Your review has been updated successfully.');
    }

    /**
     * Remove the specified review.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Review $review)
    {
        $user = Auth::user();

        // Ensure the user owns this review
        if ($review->user_id !== $user->id) {
            return redirect()->back()->with('error', 'Unauthorized action.');
        }

        $review->delete();

        return redirect()->back()->with('success', 'Your review has been deleted successfully.');
    }

    /**
     * Mark a review as helpful (toggle).
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function markHelpful(Review $review)
    {
        $user = Auth::user();

        $isHelpful = $this->reviewService->markAsHelpful($user, $review);

        return response()->json([
            'success' => true,
            'is_helpful' => $isHelpful,
            'helpful_count' => $review->fresh()->helpful_count,
        ]);
    }

    /**
     * Report a review.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function report(Request $request, Review $review)
    {
        $user = Auth::user();

        $request->validate([
            'reason' => 'required|string|in:spam,inappropriate,offensive,fake,other',
            'details' => 'nullable|string|max:500',
        ]);

        try {
            $this->reviewService->reportReview(
                $user,
                $review,
                $request->reason,
                $request->details
            );

            return response()->json([
                'success' => true,
                'message' => 'Thank you for your report. We will review it shortly.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 400);
        }
    }

    /**
     * Check if user can review a product.
     *
     * @param  \App\Models\Product  $product
     * @return \Illuminate\Http\JsonResponse
     */
    public function canReview(Product $product)
    {
        $user = Auth::user();

        $result = $this->reviewService->canUserReview($user, $product);

        return response()->json($result);
    }
}
