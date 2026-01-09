<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\ReviewReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'role:admin']);
    }

    /**
     * Display a listing of reviews for moderation.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Review::with(['product', 'user', 'images']);

        // Filter by approval status
        if ($request->has('status')) {
            if ($request->status === 'pending') {
                $query->where('is_approved', false);
            } elseif ($request->status === 'approved') {
                $query->where('is_approved', true);
            }
        }

        // Filter by rating
        if ($request->has('rating') && $request->rating != 'all') {
            $query->where('rating', $request->rating);
        }

        // Filter by verified purchase
        if ($request->has('verified') && $request->verified == '1') {
            $query->where('is_verified_purchase', true);
        }

        // Filter by reported
        if ($request->has('reported') && $request->reported == '1') {
            $query->where('reported_count', '>', 0);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('comment', 'like', '%' . $request->search . '%')
                    ->orWhereHas('user', function ($uq) use ($request) {
                        $uq->where('name', 'like', '%' . $request->search . '%');
                    })
                    ->orWhereHas('product', function ($pq) use ($request) {
                        $pq->where('name', 'like', '%' . $request->search . '%');
                    });
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $reviews = $query->paginate($request->get('per_page', 15));

        // Get statistics
        $stats = [
            'total' => Review::count(),
            'pending' => Review::where('is_approved', false)->count(),
            'approved' => Review::where('is_approved', true)->count(),
            'reported' => Review::where('reported_count', '>', 0)->count(),
        ];

        return Inertia::render('Admin/Reviews/Index', [
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $request->only(['status', 'rating', 'verified', 'reported', 'search', 'sort_by', 'sort_order', 'per_page']),
        ]);
    }

    /**
     * Approve a review.
     *
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function approve(Review $review)
    {
        $review->update(['is_approved' => true]);

        activity()
            ->performedOn($review)
            ->causedBy(Auth::user())
            ->log('review_approved_by_admin');

        // TODO: Dispatch ReviewApprovedNotification event

        return redirect()->back()->with('success', 'Review approved successfully.');
    }

    /**
     * Reject a review.
     *
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Review $review)
    {
        $review->update(['is_approved' => false]);

        activity()
            ->performedOn($review)
            ->causedBy(Auth::user())
            ->log('review_rejected_by_admin');

        return redirect()->back()->with('success', 'Review rejected successfully.');
    }

    /**
     * Delete a review.
     *
     * @param Review $review
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Review $review)
    {
        activity()
            ->performedOn($review)
            ->causedBy(Auth::user())
            ->withProperties($review->toArray())
            ->log('review_deleted_by_admin');

        $review->delete();

        return redirect()->back()->with('success', 'Review deleted successfully.');
    }

    /**
     * Perform bulk actions on reviews.
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function bulkAction(Request $request)
    {
        $request->validate([
            'action' => 'required|in:approve,reject,delete',
            'review_ids' => 'required|array',
            'review_ids.*' => 'exists:reviews,id',
        ]);

        $reviewIds = $request->review_ids;
        $action = $request->action;

        DB::transaction(function () use ($reviewIds, $action) {
            $reviews = Review::whereIn('id', $reviewIds)->get();

            foreach ($reviews as $review) {
                switch ($action) {
                    case 'approve':
                        $review->update(['is_approved' => true]);
                        activity()
                            ->performedOn($review)
                            ->causedBy(Auth::user())
                            ->log('review_bulk_approved');
                        break;

                    case 'reject':
                        $review->update(['is_approved' => false]);
                        activity()
                            ->performedOn($review)
                            ->causedBy(Auth::user())
                            ->log('review_bulk_rejected');
                        break;

                    case 'delete':
                        activity()
                            ->performedOn($review)
                            ->causedBy(Auth::user())
                            ->withProperties($review->toArray())
                            ->log('review_bulk_deleted');
                        $review->delete();
                        break;
                }
            }
        });

        $message = match ($action) {
            'approve' => 'Reviews approved successfully.',
            'reject' => 'Reviews rejected successfully.',
            'delete' => 'Reviews deleted successfully.',
        };

        return redirect()->back()->with('success', $message);
    }

    /**
     * Display reported reviews.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function reports(Request $request)
    {
        $query = ReviewReport::with(['review.product', 'review.user', 'user']);

        // Filter by status
        if ($request->has('status') && $request->status != 'all') {
            $query->where('status', $request->status);
        }

        // Filter by reason
        if ($request->has('reason') && $request->reason != 'all') {
            $query->where('reason', $request->reason);
        }

        // Search
        if ($request->has('search') && $request->search) {
            $query->whereHas('review', function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                    ->orWhere('comment', 'like', '%' . $request->search . '%');
            });
        }

        $reports = $query->orderBy('created_at', 'desc')
            ->paginate($request->get('per_page', 15));

        // Get statistics
        $stats = [
            'total' => ReviewReport::count(),
            'pending' => ReviewReport::where('status', 'pending')->count(),
            'reviewed' => ReviewReport::where('status', 'reviewed')->count(),
            'actioned' => ReviewReport::where('status', 'actioned')->count(),
            'dismissed' => ReviewReport::where('status', 'dismissed')->count(),
        ];

        return Inertia::render('Admin/Reviews/Reports', [
            'reports' => $reports,
            'stats' => $stats,
            'filters' => $request->only(['status', 'reason', 'search', 'per_page']),
        ]);
    }

    /**
     * Handle a review report.
     *
     * @param Request $request
     * @param ReviewReport $report
     * @return \Illuminate\Http\RedirectResponse
     */
    public function handleReport(Request $request, ReviewReport $report)
    {
        $request->validate([
            'action' => 'required|in:approve_review,reject_review,delete_review,dismiss_report',
        ]);

        DB::transaction(function () use ($request, $report) {
            $review = $report->review;

            switch ($request->action) {
                case 'approve_review':
                    $review->update(['is_approved' => true]);
                    $report->update(['status' => 'dismissed']);
                    activity()
                        ->performedOn($review)
                        ->causedBy(Auth::user())
                        ->withProperties(['report_id' => $report->id])
                        ->log('review_report_dismissed_approved');
                    break;

                case 'reject_review':
                    $review->update(['is_approved' => false]);
                    $report->update(['status' => 'actioned']);
                    activity()
                        ->performedOn($review)
                        ->causedBy(Auth::user())
                        ->withProperties(['report_id' => $report->id])
                        ->log('review_report_actioned_rejected');
                    break;

                case 'delete_review':
                    $report->update(['status' => 'actioned']);
                    activity()
                        ->performedOn($review)
                        ->causedBy(Auth::user())
                        ->withProperties(['report_id' => $report->id, 'review' => $review->toArray()])
                        ->log('review_report_actioned_deleted');
                    $review->delete();
                    break;

                case 'dismiss_report':
                    $report->update(['status' => 'dismissed']);
                    activity()
                        ->performedOn($report)
                        ->causedBy(Auth::user())
                        ->log('review_report_dismissed');
                    break;
            }
        });

        $message = match ($request->action) {
            'approve_review' => 'Review approved and report dismissed.',
            'reject_review' => 'Review rejected successfully.',
            'delete_review' => 'Review deleted successfully.',
            'dismiss_report' => 'Report dismissed.',
        };

        return redirect()->back()->with('success', $message);
    }
}
