<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    /**
     * Create a new controller instance.
     */
    public function __construct()
    {
        $this->middleware('auth')->only(['store', 'update', 'destroy']);
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
            ->with('user')
            ->approved();

        // Filter by rating
        if ($request->has('rating') && $request->rating != 'all') {
            $query->where('rating', $request->rating);
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

        // Format reviews for frontend
        $formattedReviews = $reviews->through(function ($review) {
            return [
                'id' => $review->id,
                'rating' => $review->rating,
                'title' => $review->title,
                'comment' => $review->comment,
                'is_verified_purchase' => $review->is_verified_purchase,
                'helpful_count' => $review->helpful_count,
                'created_at' => $review->created_at->toISOString(),
                'user' => [
                    'name' => $review->user->name,
                    'avatar' => $review->user->avatar ?? null,
                ],
            ];
        });

        return response()->json($formattedReviews);
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

        // Check if user has already reviewed this product
        if ($product->reviews()->where('user_id', $user->id)->exists()) {
            return redirect()->back()->with('error', 'You have already reviewed this product.');
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'title' => 'nullable|string|max:255',
            'comment' => 'nullable|string|max:1000',
        ]);

        // Check if this is a verified purchase
        $isVerifiedPurchase = OrderItem::whereHas('order', function ($query) use ($user) {
            $query->where('user_id', $user->id)
                ->whereIn('status', ['delivered', 'completed']);
        })
        ->where('product_id', $product->id)
        ->exists();

        $review = $product->reviews()->create([
            'user_id' => $user->id,
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
            'is_verified_purchase' => $isVerifiedPurchase,
            'is_approved' => true, // Auto-approve for now
        ]);

        return redirect()->back()->with('success', 'Your review has been submitted successfully.');
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
            'comment' => 'nullable|string|max:1000',
        ]);

        $review->update([
            'rating' => $request->rating,
            'title' => $request->title,
            'comment' => $request->comment,
        ]);

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
     * Mark a review as helpful.
     *
     * @param  \App\Models\Review  $review
     * @return \Illuminate\Http\JsonResponse
     */
    public function markHelpful(Review $review)
    {
        $review->increment('helpful_count');

        return response()->json([
            'success' => true,
            'helpful_count' => $review->helpful_count,
        ]);
    }
}
