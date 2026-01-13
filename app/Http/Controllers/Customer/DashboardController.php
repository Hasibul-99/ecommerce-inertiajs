<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Services\BrowsingHistoryService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    protected $browsingHistoryService;

    public function __construct(BrowsingHistoryService $browsingHistoryService)
    {
        $this->middleware(['auth', 'verified']);
        $this->browsingHistoryService = $browsingHistoryService;
    }

    /**
     * Display customer dashboard overview.
     */
    public function index()
    {
        $user = Auth::user();

        // User statistics
        $stats = [
            'total_orders' => Order::where('user_id', $user->id)->count(),
            'active_orders' => Order::where('user_id', $user->id)
                ->whereIn('status', ['pending', 'processing', 'shipped'])
                ->count(),
            'completed_orders' => Order::where('user_id', $user->id)
                ->where('status', 'delivered')
                ->count(),
            'total_spent_cents' => Order::where('user_id', $user->id)
                ->where('payment_status', 'paid')
                ->sum('total_cents'),
        ];

        // Recent orders (last 5)
        $recentOrders = Order::where('user_id', $user->id)
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_cents' => $order->total_cents,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                ];
            });

        // Active orders with details
        $activeOrders = Order::where('user_id', $user->id)
            ->whereIn('status', ['pending', 'processing', 'shipped'])
            ->with('items.product')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($order) {
                return [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'status' => $order->status,
                    'total_cents' => $order->total_cents,
                    'items_count' => $order->items->count(),
                    'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                    'estimated_delivery' => $order->estimated_delivery_date?->format('Y-m-d'),
                ];
            });

        // Wishlist preview (first 4 items)
        $wishlistItems = $user->wishlists()
            ->with(['product.media'])
            ->take(4)
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'title' => $item->product->title,
                        'price_cents' => $item->product->price_cents,
                        'image_url' => $item->product->getFirstMediaUrl('images'),
                    ],
                ];
            });

        // Recently viewed products
        $recentlyViewed = $this->browsingHistoryService->getRecentlyViewed($user, 6)
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'price_cents' => $product->price_cents,
                    'image_url' => $product->getFirstMediaUrl('images'),
                    'slug' => $product->slug,
                ];
            });

        // Recommended products based on history
        $recommendedProducts = $this->browsingHistoryService->getRecommendedProducts($user, 6)
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'price_cents' => $product->price_cents,
                    'image_url' => $product->getFirstMediaUrl('images'),
                    'slug' => $product->slug,
                ];
            });

        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'activeOrders' => $activeOrders,
            'wishlistItems' => $wishlistItems,
            'recentlyViewed' => $recentlyViewed,
            'recommendedProducts' => $recommendedProducts,
        ]);
    }

    /**
     * Display order history.
     */
    public function orders(Request $request)
    {
        $user = Auth::user();

        $query = Order::where('user_id', $user->id)
            ->with(['items.product', 'items.vendor']);

        // Filter by status
        if ($request->status) {
            $query->where('status', $request->status);
        }

        // Filter by date range
        if ($request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }
        if ($request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Filter by vendor
        if ($request->vendor_id) {
            $query->whereHas('items', function ($q) use ($request) {
                $q->where('vendor_id', $request->vendor_id);
            });
        }

        // Search by order number
        if ($request->search) {
            $query->where('order_number', 'like', "%{$request->search}%");
        }

        $orders = $query->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        $orders->getCollection()->transform(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_cents' => $order->total_cents,
                'items_count' => $order->items->count(),
                'vendors' => $order->items->pluck('vendor.business_name')->unique()->values(),
                'created_at' => $order->created_at->format('Y-m-d H:i:s'),
                'can_reorder' => $order->status === 'delivered',
            ];
        });

        return Inertia::render('Customer/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['search', 'status', 'vendor_id', 'date_from', 'date_to']),
        ]);
    }

    /**
     * Display address book.
     */
    public function addresses()
    {
        $user = Auth::user();

        $addresses = $user->addresses()
            ->orderBy('is_default', 'desc')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($address) {
                return [
                    'id' => $address->id,
                    'label' => $address->label,
                    'full_name' => $address->full_name,
                    'phone' => $address->phone,
                    'street' => $address->street,
                    'city' => $address->city,
                    'state' => $address->state,
                    'postal_code' => $address->postal_code,
                    'country' => $address->country,
                    'is_default' => $address->is_default,
                ];
            });

        return Inertia::render('Customer/Addresses/Index', [
            'addresses' => $addresses,
        ]);
    }

    /**
     * Display full wishlist.
     */
    public function wishlist()
    {
        $user = Auth::user();

        $wishlistItems = $user->wishlists()
            ->with(['product.media', 'product.variants'])
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'title' => $item->product->title,
                        'slug' => $item->product->slug,
                        'price_cents' => $item->product->price_cents,
                        'sale_price_cents' => $item->product->sale_price_cents,
                        'in_stock' => $item->product->stock_quantity > 0,
                        'image_url' => $item->product->getFirstMediaUrl('images'),
                    ],
                    'added_at' => $item->created_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Customer/Wishlist', [
            'wishlistItems' => $wishlistItems,
        ]);
    }

    /**
     * Display recently viewed products.
     */
    public function recentlyViewed()
    {
        $user = Auth::user();

        $recentlyViewed = $this->browsingHistoryService->getRecentlyViewed($user, 24)
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'title' => $product->title,
                    'slug' => $product->slug,
                    'price_cents' => $product->price_cents,
                    'sale_price_cents' => $product->sale_price_cents,
                    'in_stock' => $product->stock_quantity > 0,
                    'image_url' => $product->getFirstMediaUrl('images'),
                ];
            });

        return Inertia::render('Customer/RecentlyViewed', [
            'products' => $recentlyViewed,
        ]);
    }

    /**
     * Clear browsing history.
     */
    public function clearBrowsingHistory()
    {
        $user = Auth::user();
        $this->browsingHistoryService->clearHistory($user);

        return redirect()->back()->with('success', 'Browsing history cleared successfully.');
    }
}
