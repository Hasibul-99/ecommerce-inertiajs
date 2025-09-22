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
        ->get();

        // Get sales statistics
        $totalSales = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->where('status', 'completed')
        ->sum('total_cents');

        // Get product statistics
        $totalProducts = Product::where('vendor_id', $vendor->id)->count();
        $publishedProducts = Product::where('vendor_id', $vendor->id)
            ->where('status', 'published')
            ->count();

        return Inertia::render('Vendor/Dashboard', [
            'vendor' => $vendor,
            'recentOrders' => $recentOrders,
            'stats' => [
                'totalSales' => $totalSales / 100, // Convert to dollars
                'totalProducts' => $totalProducts,
                'publishedProducts' => $publishedProducts,
                'pendingOrders' => Order::whereHas('items.product', function ($query) use ($vendor) {
                    $query->where('vendor_id', $vendor->id);
                })
                ->where('status', 'processing')
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
            ->when($request->search, function ($query, $search) {
                return $query->where('title', 'like', "%{$search}%");
            })
            ->when($request->status, function ($query, $status) {
                return $query->where('status', $status);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('Vendor/Products', [
            'products' => $products,
            'filters' => $request->only(['search', 'status']),
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

        return Inertia::render('Vendor/Orders', [
            'orders' => $orders,
            'filters' => $request->only(['status']),
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
            'vendor' => $vendor,
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