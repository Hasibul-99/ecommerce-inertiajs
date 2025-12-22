<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware(['auth', 'role:vendor']);
    }

    /**
     * Display the vendor dashboard.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        // Get recent orders for vendor's products
        $recentOrders = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->with(['items.product', 'user'])
        ->latest()
        ->take(5)
        ->get()
        ->map(function ($order) {
            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'total_cents' => $order->total_cents,
                'created_at' => $order->created_at->toISOString(),
                'customer_name' => $order->user->name,
                'items_count' => $order->items->count(),
            ];
        });

        // Get sales statistics
        $totalSales = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->whereIn('status', ['processing', 'shipped', 'delivered'])
        ->sum('total_cents');

        // Calculate total earnings (commission-based)
        $totalEarnings = \App\Models\Commission::where('vendor_id', $vendor->id)
            ->sum('amount_cents');

        // Get product statistics
        $totalProducts = Product::where('vendor_id', $vendor->id)->count();
        $publishedProducts = Product::where('vendor_id', $vendor->id)
            ->where('status', 'active')
            ->count();

        // Get recent product performance
        $topProducts = Product::where('vendor_id', $vendor->id)
            ->withCount(['orderItems' => function ($query) {
                $query->whereHas('order', function ($q) {
                    $q->whereIn('status', ['processing', 'shipped', 'delivered']);
                });
            }])
            ->orderBy('order_items_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sales_count' => $product->order_items_count,
                    'price' => $product->price,
                ];
            });

        return Inertia::render('Vendor/Dashboard', [
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'status' => $vendor->status,
                'commission_rate' => $vendor->commission_rate ?? 0.1,
            ],
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'stats' => [
                'total_sales_cents' => $totalSales,
                'total_earnings_cents' => $totalEarnings,
                'total_products' => $totalProducts,
                'published_products' => $publishedProducts,
                'pending_orders' => Order::whereHas('items.product', function ($query) use ($vendor) {
                    $query->where('vendor_id', $vendor->id);
                })
                ->where('status', 'pending')
                ->count(),
            ],
        ]);
    }

    /**
     * Display the vendor's products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function products(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $products = Product::where('vendor_id', $vendor->id)
            ->with(['images', 'category'])
            ->when($request->search, function ($query, $search) {
                return $query->where('name', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        // Format products for frontend
        $formattedProducts = $products->through(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'stock' => $product->stock,
                'status' => $product->status,
                'category' => $product->category ? $product->category->name : null,
                'image' => $product->images->first()?->url ?? null,
                'created_at' => $product->created_at->toISOString(),
            ];
        });

        return Inertia::render('Vendor/Products', [
            'products' => $formattedProducts,
            'filters' => [
                'search' => $request->search ?? '',
                'status' => $request->status ?? 'all',
            ],
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
            ],
        ]);
    }

    /**
     * Display the vendor's orders.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function orders(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $orders = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->with(['items.product', 'user'])
        ->when($request->status, function ($query, $status) {
            return $query->where('status', $status);
        })
        ->orderBy('created_at', 'desc')
        ->paginate(10)
        ->withQueryString();

        // Format orders for frontend
        $formattedOrders = $orders->through(function ($order) use ($vendor) {
            // Get only items for this vendor's products
            $vendorItems = $order->items->filter(function ($item) use ($vendor) {
                return $item->product->vendor_id == $vendor->id;
            });

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_cents' => $order->total_cents,
                'created_at' => $order->created_at->toISOString(),
                'customer_name' => $order->user->name,
                'customer_email' => $order->user->email,
                'vendor_items_count' => $vendorItems->count(),
                'vendor_items_total_cents' => $vendorItems->sum('subtotal_cents'),
            ];
        });

        return Inertia::render('Vendor/Orders', [
            'orders' => $formattedOrders,
            'filters' => [
                'status' => $request->status ?? 'all',
            ],
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
            ],
        ]);
    }

    /**
     * Display the vendor's profile settings.
     *
     * @return \Inertia\Response
     */
    public function settings()
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        return Inertia::render('Vendor/Settings', [
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'slug' => $vendor->slug,
                'phone' => $vendor->phone,
                'status' => $vendor->status,
                'commission_rate' => $vendor->commission_rate ?? 0.1,
            ],
            'user' => [
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }

    /**
     * Update the vendor's profile settings.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function updateSettings(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'logo' => 'nullable|image|max:2048',
        ]);

        $vendor->update($request->except('logo'));

        if ($request->hasFile('logo')) {
            // Handle logo upload
            $path = $request->file('logo')->store('vendors', 'public');
            $vendor->update(['logo' => $path]);
        }

        return redirect()->back()->with('success', 'Vendor profile updated successfully.');
    }
}