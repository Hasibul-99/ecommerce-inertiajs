<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OrderController extends Controller
{
    /**
     * Display a listing of the orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $query = Order::query()
            ->with(['user', 'items'])
            ->orderBy('created_at', 'desc');
            
        // Filter by status if provided
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }
        
        // Filter by payment status if provided
        if ($request->has('payment_status') && $request->payment_status) {
            $query->where('payment_status', $request->payment_status);
        }
        
        // Filter by payment method if provided
        if ($request->has('payment_method') && $request->payment_method) {
            $query->where('payment_method', $request->payment_method);
        }
        
        $orders = $query->paginate(10)->withQueryString();
        
        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_status', 'payment_method']),
            'statuses' => [
                'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'
            ],
            'paymentStatuses' => [
                'pending', 'paid', 'refunded', 'failed'
            ],
            'paymentMethods' => [
                'credit_card', 'paypal', 'bank_transfer', 'cod'
            ],
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
        $order->load(['items.product', 'shippingAddress', 'billingAddress', 'user']);
        
        return Inertia::render('Admin/Orders/Show', [
            'order' => $order,
        ]);
    }
    
    /**
     * Update the order status.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|string|in:pending,processing,shipped,delivered,cancelled,refunded',
            'comment' => 'nullable|string|max:500',
        ]);
        
        $order->update([
            'status' => $request->status,
        ]);
        
        // Create order status history
        OrderStatus::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'status' => $request->status,
            'comment' => $request->comment,
        ]);
        
        return redirect()->back()->with('success', 'Order status updated successfully.');
    }
    
    /**
     * Mark a Cash on Delivery order as paid.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function markAsPaid(Order $order)
    {
        // Verify this is a COD order
        if ($order->payment_method !== 'cod') {
            return redirect()->back()->with('error', 'Only Cash on Delivery orders can be marked as paid using this method.');
        }
        
        // Update payment status
        $order->update([
            'payment_status' => 'paid',
            'status' => 'processing', // Update order status to processing after payment
        ]);
        
        // Create order status history
        OrderStatus::create([
            'order_id' => $order->id,
            'user_id' => Auth::id(),
            'status' => 'processing',
            'comment' => 'Cash on Delivery payment received and marked as paid.',
        ]);
        
        return redirect()->back()->with('success', 'Order marked as paid successfully.');
    }
}