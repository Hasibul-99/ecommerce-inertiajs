<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Services\ReviewService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected $reviewService;

    public function __construct(ReviewService $reviewService)
    {
        $this->reviewService = $reviewService;
        $this->middleware(['auth', 'role:vendor']);
    }

    /**
     * Display a listing of reviews for vendor's products.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $vendor = Auth::user()->vendor;

        if (!$vendor) {
            return redirect()->route('vendor.dashboard')
                ->with('error', 'Vendor profile not found.');
        }

        // Get filters from request
        $filters = [
            'rating' => $request->get('rating'),
            'status' => $request->get('status'),
            'verified' => $request->get('verified'),
            'search' => $request->get('search'),
            'sort_by' => $request->get('sort_by', 'created_at'),
            'sort_order' => $request->get('sort_order', 'desc'),
            'per_page' => $request->get('per_page', 15),
        ];

        $reviews = $this->reviewService->getVendorReviews($vendor->id, $filters);

        // Get statistics for vendor's reviews
        $stats = $this->getVendorReviewStats($vendor->id);

        return Inertia::render('Vendor/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Respond to a review.
     *
     * @param Request $request
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function respond(Request $request, Review $review)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        // Verify vendor owns the product
        if ($review->product->vendor_id !== $vendor->id) {
            return redirect()->back()->with('error', 'You do not have permission to respond to this review.');
        }

        $request->validate([
            'response' => 'required|string|max:1000',
        ]);

        try {
            $this->reviewService->respondToReview($review, $user, $request->response);

            // TODO: Dispatch ReviewResponseNotification event

            return redirect()->back()->with('success', 'Your response has been posted successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Remove vendor response from a review.
     *
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function removeResponse(Review $review)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->back()->with('error', 'Vendor profile not found.');
        }

        // Verify vendor owns the product
        if ($review->product->vendor_id !== $vendor->id) {
            return redirect()->back()->with('error', 'You do not have permission to modify this review.');
        }

        $review->update([
            'vendor_response' => null,
            'vendor_response_at' => null,
            'vendor_response_by' => null,
        ]);

        activity()
            ->performedOn($review)
            ->causedBy($user)
            ->log('vendor_response_removed');

        return redirect()->back()->with('success', 'Your response has been removed.');
    }

    /**
     * Get statistics for vendor's reviews.
     *
     * @param int $vendorId
     * @return array
     */
    protected function getVendorReviewStats(int $vendorId): array
    {
        $reviews = Review::whereHas('product', function ($q) use ($vendorId) {
            $q->where('vendor_id', $vendorId);
        })->get();

        $totalReviews = $reviews->count();

        if ($totalReviews === 0) {
            return [
                'total_reviews' => 0,
                'average_rating' => 0,
                'rating_distribution' => [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0],
                'pending_reviews' => 0,
                'unanswered_reviews' => 0,
                'response_rate' => 0,
            ];
        }

        // Rating distribution
        $ratingDistribution = [5 => 0, 4 => 0, 3 => 0, 2 => 0, 1 => 0];
        foreach ($reviews as $review) {
            $ratingDistribution[$review->rating]++;
        }

        // Calculate stats
        $averageRating = round($reviews->avg('rating'), 2);
        $pendingReviews = $reviews->where('is_approved', false)->count();
        $unansweredReviews = $reviews->where('is_approved', true)
            ->whereNull('vendor_response')
            ->count();
        $answeredReviews = $reviews->whereNotNull('vendor_response')->count();
        $responseRate = $totalReviews > 0 ? round(($answeredReviews / $totalReviews) * 100, 1) : 0;

        return [
            'total_reviews' => $totalReviews,
            'average_rating' => $averageRating,
            'rating_distribution' => $ratingDistribution,
            'pending_reviews' => $pendingReviews,
            'unanswered_reviews' => $unansweredReviews,
            'response_rate' => $responseRate,
        ];
    }
}
