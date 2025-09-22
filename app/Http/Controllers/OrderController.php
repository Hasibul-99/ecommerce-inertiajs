<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of the user's orders.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        
        $orders = Order::where('user_id', $user->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }

    /**
     * Display the specified order.
     *
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function show(Order $order)
    {
        $this->authorize('view', $order);

        $order->load('items.product', 'shippingAddress', 'billingAddress');

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }

    /**
     * Cancel the specified order.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function cancel(Order $order)
    {
        $this->authorize('update', $order);

        // Only allow cancellation if order is pending or processing
        if (!in_array($order->status, ['pending', 'processing'])) {
            return redirect()->back()->with('error', 'This order cannot be cancelled.');
        }

        $order->update([
            'status' => 'cancelled',
        ]);

        return redirect()->back()->with('success', 'Order cancelled successfully.');
    }

    /**
     * Request a return for the specified order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function requestReturn(Request $request, Order $order)
    {
        $this->authorize('update', $order);

        // Only allow return requests if order is delivered
        if ($order->status !== 'delivered') {
            return redirect()->back()->with('error', 'Return can only be requested for delivered orders.');
        }

        $request->validate([
            'reason' => 'required|string|max:500',
        ]);

        $order->update([
            'status' => 'return_requested',
            'return_reason' => $request->reason,
        ]);

        return redirect()->back()->with('success', 'Return request submitted successfully.');
    }

    /**
     * Track the specified order.
     *
     * @param  \App\Models\Order  $order
     * @return \Inertia\Response
     */
    public function track(Order $order)
    {
        $this->authorize('view', $order);

        // In a real application, you would fetch tracking information from a shipping API
        $trackingInfo = [
            'status' => $order->status,
            'tracking_number' => $order->tracking_number ?? 'Not available',
            'carrier' => $order->shipping_carrier ?? 'Not available',
            'estimated_delivery' => $order->estimated_delivery_date ?? 'Not available',
            'events' => [
                // Sample tracking events
                [
                    'date' => now()->subDays(3)->format('Y-m-d H:i:s'),
                    'status' => 'Order placed',
                    'location' => 'Online',
                ],
                [
                    'date' => now()->subDays(2)->format('Y-m-d H:i:s'),
                    'status' => 'Processing',
                    'location' => 'Warehouse',
                ],
                [
                    'date' => now()->subDays(1)->format('Y-m-d H:i:s'),
                    'status' => 'Shipped',
                    'location' => 'Distribution Center',
                ],
            ],
        ];

        return Inertia::render('Orders/Track', [
            'order' => $order,
            'trackingInfo' => $trackingInfo,
        ]);
    }

    /**
     * Download the invoice for the specified order.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\Response
     */
    public function invoice(Order $order)
    {
        $this->authorize('view', $order);

        // In a real application, you would generate a PDF invoice
        // For now, we'll just return a message
        return redirect()->back()->with('info', 'Invoice download functionality will be implemented soon.');
    }
}