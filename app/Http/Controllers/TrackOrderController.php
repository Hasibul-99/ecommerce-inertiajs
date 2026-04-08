<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\TrackingSubscription;
use App\Models\TrackingView;
use App\Services\TrackingService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class TrackOrderController extends Controller
{
    public function __construct(
        private TrackingService $trackingService
    ) {
        // Rate limiting on search to prevent abuse
        $this->middleware('throttle:10,1')->only('search');
    }

    /**
     * Show the tracking search form.
     */
    public function index(): Response
    {
        return Inertia::render('TrackOrder/Index', [
            'cartCount' => $this->getCartCount(),
            'wishlistCount' => $this->getWishlistCount(),
        ]);
    }

    /**
     * Search for an order by order number + email or tracking number.
     */
    public function search(Request $request): RedirectResponse
    {
        $validator = Validator::make($request->all(), [
            'search_type' => 'required|in:order_email,tracking_number',
            'order_number' => 'required_if:search_type,order_email|string',
            'email' => 'required_if:search_type,order_email|email',
            'tracking_number' => 'required_if:search_type,tracking_number|string',
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator)
                ->withInput();
        }

        $order = null;

        if ($request->search_type === 'order_email') {
            // Search by order number and email
            $order = Order::where('order_number', $request->order_number)
                ->whereHas('user', function ($query) use ($request) {
                    $query->where('email', $request->email);
                })
                ->first();
        } else {
            // Search by tracking number
            $order = Order::where('tracking_number', $request->tracking_number)
                ->orWhereHas('shipments', function ($query) use ($request) {
                    $query->where('tracking_number', $request->tracking_number);
                })
                ->first();
        }

        if (!$order) {
            return redirect()
                ->back()
                ->withErrors(['search' => 'No order found with the provided information.'])
                ->withInput();
        }

        // Generate tracking token and redirect to tracking page
        $token = $this->trackingService->generateTrackingToken($order);

        return redirect()->route('track-order.show', ['token' => $token]);
    }

    /**
     * Show tracking details for an order using token.
     */
    public function show(string $token): Response|RedirectResponse
    {
        // Find order by tracking token
        $order = $this->trackingService->findOrderByToken($token);

        if (!$order) {
            return redirect()
                ->route('track-order.index')
                ->withErrors(['token' => 'Invalid or expired tracking link.']);
        }

        // Record tracking view for analytics
        TrackingView::record($order->id, $token);

        // Get comprehensive tracking data
        $trackingData = $this->trackingService->getTrackingData($order);

        return Inertia::render('TrackOrder/Show', [
            'trackingData' => $trackingData,
            'trackingToken' => $token,
            'cartCount' => $this->getCartCount(),
            'wishlistCount' => $this->getWishlistCount(),
        ]);
    }

    /**
     * Subscribe to tracking updates.
     */
    public function subscribe(Request $request, string $token): RedirectResponse
    {
        $order = $this->trackingService->findOrderByToken($token);

        if (!$order) {
            return redirect()
                ->back()
                ->withErrors(['error' => 'Invalid tracking link.']);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'phone' => 'nullable|string',
            'email_enabled' => 'boolean',
            'sms_enabled' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()
                ->back()
                ->withErrors($validator);
        }

        // Check if subscription already exists
        $subscription = TrackingSubscription::where('order_id', $order->id)
            ->where('email', $request->email)
            ->first();

        if ($subscription) {
            // Update existing subscription
            $subscription->update([
                'phone' => $request->phone,
                'email_enabled' => $request->email_enabled ?? true,
                'sms_enabled' => $request->sms_enabled ?? false,
            ]);
        } else {
            // Create new subscription
            TrackingSubscription::create([
                'order_id' => $order->id,
                'email' => $request->email,
                'phone' => $request->phone,
                'email_enabled' => $request->email_enabled ?? true,
                'sms_enabled' => $request->sms_enabled ?? false,
                'unsubscribe_token' => Str::random(64),
            ]);
        }

        return redirect()
            ->back()
            ->with('success', 'Successfully subscribed to tracking updates!');
    }

    /**
     * Unsubscribe from tracking updates.
     */
    public function unsubscribe(string $unsubscribeToken): Response
    {
        $subscription = TrackingSubscription::findByUnsubscribeToken($unsubscribeToken);

        if ($subscription) {
            $subscription->unsubscribeAll();
            $message = 'You have been successfully unsubscribed from tracking updates.';
        } else {
            $message = 'Invalid unsubscribe link.';
        }

        return Inertia::render('TrackOrder/Unsubscribed', [
            'message' => $message,
            'success' => $subscription !== null,
        ]);
    }

    /**
     * Get cart count for current user.
     */
    private function getCartCount(): int
    {
        if (auth()->check()) {
            return \App\Models\Cart::getItemCountForUser(auth()->id());
        }
        return 0;
    }

    /**
     * Get wishlist count for current user.
     */
    private function getWishlistCount(): int
    {
        if (auth()->check()) {
            return \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }
        return 0;
    }
}
