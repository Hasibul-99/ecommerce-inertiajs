<?php

namespace App\Http\Controllers\Vendor;

use App\Http\Controllers\Controller;
use App\Exports\VendorReportExport;
use App\Models\Order;
use App\Models\Product;
use App\Services\VendorAnalyticsService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class DashboardController extends Controller
{
    protected VendorAnalyticsService $analyticsService;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct(VendorAnalyticsService $analyticsService)
    {
        $this->middleware(['auth', 'role:vendor']);
        $this->analyticsService = $analyticsService;
    }

    /**
     * Display the vendor dashboard with comprehensive analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        // Parse date range
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        // Get comprehensive analytics
        $salesSummary = $this->analyticsService->getSalesSummary($vendor, $from, $to);
        $productPerformance = $this->analyticsService->getProductPerformance($vendor, 10);
        $ordersBreakdown = $this->analyticsService->getOrdersBreakdown($vendor, $from, $to);
        $revenueByDay = $this->analyticsService->getRevenueByDay($vendor, $from, $to);
        $conversionStats = $this->analyticsService->getConversionStats($vendor);

        // Get recent orders
        $recentOrders = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->with(['items.product', 'user'])
        ->latest()
        ->take(10)
        ->get()
        ->map(function ($order) use ($vendor) {
            $vendorItems = $order->items->filter(fn($item) => $item->product->vendor_id == $vendor->id);

            return [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'status' => $order->status,
                'payment_status' => $order->payment_status,
                'total_cents' => $vendorItems->sum('subtotal_cents'),
                'created_at' => $order->created_at->toISOString(),
                'customer_name' => $order->user->name,
                'items_count' => $vendorItems->count(),
            ];
        });

        // Get recent notifications
        $notifications = $user->notifications()
            ->take(5)
            ->get()
            ->map(function ($notification) {
                return [
                    'id' => $notification->id,
                    'type' => class_basename($notification->type),
                    'data' => $notification->data,
                    'read_at' => $notification->read_at?->toISOString(),
                    'created_at' => $notification->created_at->toISOString(),
                ];
            });

        return Inertia::render('Vendor/Dashboard', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'status' => $vendor->status,
                'commission_rate' => $vendor->commission_rate,
            ],
            'salesSummary' => $salesSummary,
            'topProducts' => $productPerformance,
            'ordersBreakdown' => $ordersBreakdown,
            'revenueChart' => $revenueByDay['daily'],
            'recentOrders' => $recentOrders,
            'conversionStats' => $conversionStats,
            'notifications' => $notifications,
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

    /**
     * Display detailed sales analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function salesAnalytics(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $salesSummary = $this->analyticsService->getSalesSummary($vendor, $from, $to);
        $revenueByDay = $this->analyticsService->getRevenueByDay($vendor, $from, $to);
        $ordersBreakdown = $this->analyticsService->getOrdersBreakdown($vendor, $from, $to);
        $productPerformance = $this->analyticsService->getProductPerformance($vendor, 20);

        return Inertia::render('Vendor/Analytics/Sales', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
                'commission_rate' => $vendor->commission_rate,
            ],
            'salesSummary' => $salesSummary,
            'revenueByDay' => $revenueByDay['daily'],
            'revenueByHour' => $revenueByDay['hourly'],
            'revenueByWeekday' => $revenueByDay['by_weekday'],
            'paymentMethodBreakdown' => $ordersBreakdown['by_payment_method'],
            'productPerformance' => $productPerformance,
        ]);
    }

    /**
     * Display product performance analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function productsAnalytics(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        // Get date range for stock movements
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);

        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        $productPerformance = $this->analyticsService->getProductPerformance($vendor, 50);
        $conversionStats = $this->analyticsService->getConversionStats($vendor);
        $productViewsAnalytics = $this->analyticsService->getProductViewsAnalytics($vendor, 20);
        $stockMovementHistory = $this->analyticsService->getStockMovementHistory($vendor, $from, $to, 50);
        $priceChangeImpact = $this->analyticsService->getPriceChangeImpact($vendor, 20);

        return Inertia::render('Vendor/Analytics/Products', [
            'dateRange' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
            ],
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
            ],
            'productPerformance' => $productPerformance,
            'conversionStats' => $conversionStats,
            'productViewsAnalytics' => $productViewsAnalytics,
            'stockMovementHistory' => $stockMovementHistory,
            'priceChangeImpact' => $priceChangeImpact,
        ]);
    }

    /**
     * Display customer analytics.
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function customersAnalytics(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $customerInsights = $this->analyticsService->getCustomerInsights($vendor);

        return Inertia::render('Vendor/Analytics/Customers', [
            'vendor' => [
                'id' => $vendor->id,
                'business_name' => $vendor->business_name,
            ],
            'customerInsights' => $customerInsights,
        ]);
    }

    /**
     * Export vendor analytics reports.
     *
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     */
    public function exportAnalytics(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return redirect()->route('home')->with('error', 'Vendor profile not found.');
        }

        $request->validate([
            'type' => 'required|in:sales_daily,sales_products,products,customers,customers_geo',
            'format' => 'required|in:csv,xlsx',
            'from' => 'nullable|date',
            'to' => 'nullable|date|after_or_equal:from',
        ]);

        $type = $request->input('type');
        $format = $request->input('format');
        $from = $request->input('from')
            ? Carbon::parse($request->input('from'))
            : Carbon::now()->subDays(30);
        $to = $request->input('to')
            ? Carbon::parse($request->input('to'))
            : Carbon::now();

        // Get the appropriate report data
        $data = match($type) {
            'sales_daily', 'sales_products' => [
                'revenueByDay' => $this->analyticsService->getRevenueByDay($vendor, $from, $to)['daily'],
                'productPerformance' => $this->analyticsService->getProductPerformance($vendor, 50),
            ],
            'products' => [
                'productPerformance' => $this->analyticsService->getProductPerformance($vendor, 100),
            ],
            'customers', 'customers_geo' => [
                'customerInsights' => $this->analyticsService->getCustomerInsights($vendor),
            ],
        };

        $fileName = "{$vendor->slug}_{$type}_" . now()->format('Y-m-d_His') . ".{$format}";

        return Excel::download(
            new VendorReportExport($type, $data),
            $fileName,
            $format === 'csv' ? \Maatwebsite\Excel\Excel::CSV : \Maatwebsite\Excel\Excel::XLSX
        );
    }
}