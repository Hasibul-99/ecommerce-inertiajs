<?php

namespace App\Http\Controllers;

use App\Events\OrderCancelled;
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
    public function index(Request $request)
    {
        $user = Auth::user();

        $query = Order::where('user_id', $user->id)
            ->with('items.product');

        // Filter by status
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Search by order number
        if ($request->has('search') && $request->search) {
            $query->where('order_number', 'like', '%' . $request->search . '%');
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Format orders for frontend
        $formattedOrders = $orders->through(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_cents' => $order->total_cents,
                'created_at' => $order->created_at->toISOString(),
                'items_count' => $order->items->count(),
                'first_item_image' => $order->items->first()?->product?->images->first()?->url ?? null,
            ];
        });

        // Get wishlist count
        $wishlistCount = 0;
        if (auth()->check()) {
            $wishlistCount = \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }

        // Get cart count
        $cartCount = 0;
        if (auth()->check()) {
            $cartCount = \App\Models\Cart::getItemCountForUser(auth()->id());
        }

        return Inertia::render('Orders/Index', [
            'orders' => $formattedOrders,
            'filters' => [
                'status' => $request->status ?? 'all',
                'search' => $request->search ?? '',
            ],
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
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

        $order->load('items.product.images', 'items.productVariant', 'shippingAddress', 'billingAddress');

        // Format order for frontend
        $formattedOrder = [
            'id' => $order->id,
            'order_number' => $order->order_number,
            'status' => $order->status,
            'payment_status' => $order->payment_status,
            'payment_method' => $order->payment_method,
            'subtotal_cents' => $order->subtotal_cents,
            'tax_cents' => $order->tax_cents,
            'shipping_cents' => $order->shipping_cents ?? 0,
            'discount_cents' => $order->discount_cents ?? 0,
            'total_cents' => $order->total_cents,
            'notes' => $order->notes,
            'tracking_number' => $order->tracking_number,
            'shipping_carrier' => $order->shipping_carrier,
            'created_at' => $order->created_at->toISOString(),
            'items' => $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product_name,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'unit_price_cents' => $item->unit_price_cents,
                    'subtotal_cents' => $item->subtotal_cents,
                    'product' => [
                        'id' => $item->product->id,
                        'slug' => $item->product->slug,
                        'image' => $item->product->images->first()?->url ?? null,
                    ],
                    'variant' => $item->productVariant ? [
                        'id' => $item->productVariant->id,
                        'sku' => $item->productVariant->sku,
                        'attributes' => $item->productVariant->attributes ?? [],
                    ] : null,
                ];
            }),
            'shipping_address' => $order->shippingAddress ? [
                'name' => $order->shippingAddress->name,
                'address_line1' => $order->shippingAddress->address_line1,
                'address_line2' => $order->shippingAddress->address_line2,
                'city' => $order->shippingAddress->city,
                'state' => $order->shippingAddress->state,
                'postal_code' => $order->shippingAddress->postal_code,
                'country' => $order->shippingAddress->country,
                'phone' => $order->shippingAddress->phone,
            ] : null,
            'billing_address' => $order->billingAddress ? [
                'name' => $order->billingAddress->name,
                'address_line1' => $order->billingAddress->address_line1,
                'address_line2' => $order->billingAddress->address_line2,
                'city' => $order->billingAddress->city,
                'state' => $order->billingAddress->state,
                'postal_code' => $order->billingAddress->postal_code,
                'country' => $order->billingAddress->country,
                'phone' => $order->billingAddress->phone,
            ] : null,
            'can_cancel' => in_array($order->status, ['pending', 'processing']),
            'can_request_return' => $order->status === 'delivered',
        ];

        // Get wishlist count
        $wishlistCount = 0;
        if (auth()->check()) {
            $wishlistCount = \App\Models\Wishlist::getItemCountForUser(auth()->id());
        }

        // Get cart count
        $cartCount = 0;
        if (auth()->check()) {
            $cartCount = \App\Models\Cart::getItemCountForUser(auth()->id());
        }

        return Inertia::render('Orders/Show', [
            'order' => $formattedOrder,
            'cartCount' => $cartCount,
            'wishlistCount' => $wishlistCount,
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

        // Dispatch order cancelled event
        event(new OrderCancelled($order));

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

    /**
     * Reorder items from a previous order.
     *
     * @param  \App\Models\Order  $order
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reorder(Order $order)
    {
        $this->authorize('view', $order);

        try {
            $cart = \App\Models\Cart::firstOrCreate(['user_id' => Auth::id()]);
            $addedCount = 0;

            foreach ($order->items as $orderItem) {
                // Check if product is still available
                $product = $orderItem->product;
                if (!$product || !$product->is_active) {
                    continue;
                }

                // Check stock
                if ($product->stock_quantity < $orderItem->quantity) {
                    continue;
                }

                // Add to cart
                $cartItem = $cart->items()->where('product_id', $orderItem->product_id)
                    ->where('product_variant_id', $orderItem->product_variant_id)
                    ->first();

                if ($cartItem) {
                    // Update quantity if already in cart
                    $newQuantity = $cartItem->quantity + $orderItem->quantity;
                    if ($newQuantity <= $product->stock_quantity) {
                        $cartItem->update(['quantity' => $newQuantity]);
                        $addedCount++;
                    }
                } else {
                    // Add new item to cart
                    $cart->items()->create([
                        'product_id' => $orderItem->product_id,
                        'product_variant_id' => $orderItem->product_variant_id,
                        'quantity' => $orderItem->quantity,
                    ]);
                    $addedCount++;
                }
            }

            if ($addedCount > 0) {
                return redirect()->route('cart')->with('success', "{$addedCount} items added to your cart.");
            } else {
                return redirect()->back()->with('error', 'No items could be added. Products may be out of stock or unavailable.');
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Failed to reorder: ' . $e->getMessage());
        }
    }
}