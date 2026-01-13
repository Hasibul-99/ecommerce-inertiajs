<?php

namespace App\Services;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class ReportService
{
    /**
     * Get sales report with revenue analytics.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return array
     */
    public function getSalesReport(Carbon $from, Carbon $to, array $filters = []): array
    {
        $cacheKey = $this->getCacheKey('sales', $from, $to, $filters);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to, $filters) {
            $query = Order::whereBetween('created_at', [$from, $to])
                ->whereNotIn('status', ['cancelled', 'failed']);

            // Apply filters
            if (!empty($filters['vendor_id'])) {
                $query->where('vendor_id', $filters['vendor_id']);
            }

            if (!empty($filters['payment_method'])) {
                $query->where('payment_method', $filters['payment_method']);
            }

            // Total revenue
            $totalRevenue = $query->sum('total_cents');

            // Revenue by payment method
            $revenueByPaymentMethod = Order::whereBetween('created_at', [$from, $to])
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->select('payment_method', DB::raw('SUM(total_cents) as revenue'))
                ->groupBy('payment_method')
                ->get()
                ->map(fn($item) => [
                    'payment_method' => $item->payment_method,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Revenue by vendor
            $revenueByVendor = Order::whereBetween('created_at', [$from, $to])
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->with('vendor:id,business_name')
                ->select('vendor_id', DB::raw('SUM(total_cents) as revenue'), DB::raw('COUNT(*) as orders_count'))
                ->groupBy('vendor_id')
                ->orderByDesc('revenue')
                ->limit(10)
                ->get()
                ->map(fn($item) => [
                    'vendor_id' => $item->vendor_id,
                    'vendor_name' => $item->vendor->business_name ?? 'Unknown',
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                    'orders_count' => $item->orders_count,
                ]);

            // Daily revenue trend
            $dailyRevenue = Order::whereBetween('created_at', [$from, $to])
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(total_cents) as revenue'),
                    DB::raw('COUNT(*) as orders_count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'date' => $item->date,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                    'orders_count' => $item->orders_count,
                ]);

            // Average order value
            $ordersCount = $query->count();
            $avgOrderValue = $ordersCount > 0 ? $totalRevenue / $ordersCount : 0;

            return [
                'total_revenue_cents' => $totalRevenue,
                'total_revenue' => $totalRevenue / 100,
                'orders_count' => $ordersCount,
                'avg_order_value_cents' => $avgOrderValue,
                'avg_order_value' => $avgOrderValue / 100,
                'by_payment_method' => $revenueByPaymentMethod,
                'by_vendor' => $revenueByVendor,
                'daily_trend' => $dailyRevenue,
            ];
        });
    }

    /**
     * Get orders report with status breakdown.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return array
     */
    public function getOrdersReport(Carbon $from, Carbon $to, array $filters = []): array
    {
        $cacheKey = $this->getCacheKey('orders', $from, $to, $filters);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to, $filters) {
            $query = Order::whereBetween('created_at', [$from, $to]);

            // Apply filters
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['payment_method'])) {
                $query->where('payment_method', $filters['payment_method']);
            }

            // Orders by status
            $ordersByStatus = Order::whereBetween('created_at', [$from, $to])
                ->select('status', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_cents) as revenue'))
                ->groupBy('status')
                ->get()
                ->map(fn($item) => [
                    'status' => $item->status,
                    'count' => $item->count,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Orders by payment method
            $ordersByPaymentMethod = Order::whereBetween('created_at', [$from, $to])
                ->select('payment_method', DB::raw('COUNT(*) as count'), DB::raw('SUM(total_cents) as revenue'))
                ->groupBy('payment_method')
                ->get()
                ->map(fn($item) => [
                    'payment_method' => $item->payment_method,
                    'count' => $item->count,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Failed/cancelled orders
            $failedOrders = Order::whereBetween('created_at', [$from, $to])
                ->whereIn('status', ['cancelled', 'failed'])
                ->count();

            $successfulOrders = Order::whereBetween('created_at', [$from, $to])
                ->where('status', 'delivered')
                ->count();

            $totalOrders = Order::whereBetween('created_at', [$from, $to])->count();

            // Average fulfillment time (from placed to delivered)
            $avgFulfillmentTime = Order::whereBetween('created_at', [$from, $to])
                ->where('status', 'delivered')
                ->whereNotNull('delivered_at')
                ->selectRaw('AVG(TIMESTAMPDIFF(HOUR, created_at, delivered_at)) as avg_hours')
                ->value('avg_hours');

            // Daily orders trend
            $dailyOrders = Order::whereBetween('created_at', [$from, $to])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count'),
                    DB::raw('SUM(CASE WHEN status = "delivered" THEN 1 ELSE 0 END) as delivered'),
                    DB::raw('SUM(CASE WHEN status IN ("cancelled", "failed") THEN 1 ELSE 0 END) as failed')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            return [
                'total_orders' => $totalOrders,
                'successful_orders' => $successfulOrders,
                'failed_orders' => $failedOrders,
                'success_rate' => $totalOrders > 0 ? ($successfulOrders / $totalOrders) * 100 : 0,
                'by_status' => $ordersByStatus,
                'by_payment_method' => $ordersByPaymentMethod,
                'avg_fulfillment_hours' => round($avgFulfillmentTime ?? 0, 2),
                'daily_trend' => $dailyOrders,
            ];
        });
    }

    /**
     * Get products report with performance metrics.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return array
     */
    public function getProductsReport(Carbon $from, Carbon $to, array $filters = []): array
    {
        $cacheKey = $this->getCacheKey('products', $from, $to, $filters);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to, $filters) {
            // Top selling products
            $topProducts = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select(
                    'products.id',
                    'products.name',
                    DB::raw('SUM(order_items.quantity) as units_sold'),
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue')
                )
                ->groupBy('products.id', 'products.name')
                ->orderByDesc('revenue')
                ->limit(20)
                ->get()
                ->map(fn($item) => [
                    'product_id' => $item->id,
                    'product_name' => $item->name,
                    'units_sold' => $item->units_sold,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Products by category
            $productsByCategory = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('categories', 'products.category_id', '=', 'categories.id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select(
                    'categories.id',
                    'categories.name',
                    DB::raw('SUM(order_items.quantity) as units_sold'),
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue')
                )
                ->groupBy('categories.id', 'categories.name')
                ->orderByDesc('revenue')
                ->get()
                ->map(fn($item) => [
                    'category_id' => $item->id,
                    'category_name' => $item->name,
                    'units_sold' => $item->units_sold,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Low stock products
            $lowStockProducts = Product::where('stock_quantity', '<=', 10)
                ->where('stock_quantity', '>', 0)
                ->select('id', 'name', 'stock_quantity as stock', 'sku')
                ->orderBy('stock_quantity')
                ->limit(20)
                ->get();

            // Out of stock products
            $outOfStockCount = Product::where('stock_quantity', 0)->count();

            // Total products
            $totalProducts = Product::count();

            return [
                'total_products' => $totalProducts,
                'out_of_stock_count' => $outOfStockCount,
                'low_stock_count' => $lowStockProducts->count(),
                'top_products' => $topProducts,
                'by_category' => $productsByCategory,
                'low_stock_products' => $lowStockProducts,
            ];
        });
    }

    /**
     * Get vendors report with performance metrics.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return array
     */
    public function getVendorsReport(Carbon $from, Carbon $to, array $filters = []): array
    {
        $cacheKey = $this->getCacheKey('vendors', $from, $to, $filters);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to, $filters) {
            // Vendor performance
            $vendorPerformance = Vendor::with('user:id,name')
                ->leftJoin('orders', 'vendors.id', '=', 'orders.vendor_id')
                ->leftJoin('products', 'vendors.id', '=', 'products.vendor_id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->orWhereNull('orders.created_at')
                ->select(
                    'vendors.id',
                    'vendors.business_name',
                    'vendors.commission_rate',
                    DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
                    DB::raw('SUM(orders.total_cents) as revenue'),
                    DB::raw('COUNT(DISTINCT products.id) as products_count'),
                    DB::raw('SUM(CASE WHEN orders.status = "delivered" THEN 1 ELSE 0 END) as delivered_orders'),
                    DB::raw('AVG(CASE WHEN orders.status = "delivered" THEN TIMESTAMPDIFF(HOUR, orders.created_at, orders.delivered_at) END) as avg_fulfillment_hours')
                )
                ->groupBy('vendors.id', 'vendors.business_name', 'vendors.commission_rate')
                ->orderByDesc('revenue')
                ->get()
                ->map(function ($vendor) {
                    $revenue = $vendor->revenue ?? 0;
                    $commissionRate = $vendor->commission_rate ?? 0;
                    $commission = ($revenue * $commissionRate) / 100;
                    $fulfillmentRate = $vendor->orders_count > 0
                        ? ($vendor->delivered_orders / $vendor->orders_count) * 100
                        : 0;

                    return [
                        'vendor_id' => $vendor->id,
                        'vendor_name' => $vendor->business_name,
                        'orders_count' => $vendor->orders_count ?? 0,
                        'products_count' => $vendor->products_count ?? 0,
                        'revenue_cents' => $revenue,
                        'revenue' => $revenue / 100,
                        'commission_rate' => $commissionRate,
                        'commission_cents' => $commission,
                        'commission' => $commission / 100,
                        'fulfillment_rate' => round($fulfillmentRate, 2),
                        'avg_fulfillment_hours' => round($vendor->avg_fulfillment_hours ?? 0, 2),
                    ];
                });

            // Total vendors
            $totalVendors = Vendor::count();
            $activeVendors = Vendor::where('status', 'active')->count();

            return [
                'total_vendors' => $totalVendors,
                'active_vendors' => $activeVendors,
                'vendor_performance' => $vendorPerformance,
            ];
        });
    }

    /**
     * Get customers report with analytics.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return array
     */
    public function getCustomersReport(Carbon $from, Carbon $to, array $filters = []): array
    {
        $cacheKey = $this->getCacheKey('customers', $from, $to, $filters);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to, $filters) {
            // New vs returning customers
            $newCustomers = User::whereBetween('created_at', [$from, $to])
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'customer');
                })
                ->count();

            // Top customers by spend
            $topCustomers = DB::table('orders')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select(
                    'users.id',
                    'users.name',
                    'users.email',
                    DB::raw('COUNT(orders.id) as orders_count'),
                    DB::raw('SUM(orders.total_cents) as total_spent')
                )
                ->groupBy('users.id', 'users.name', 'users.email')
                ->orderByDesc('total_spent')
                ->limit(20)
                ->get()
                ->map(fn($item) => [
                    'customer_id' => $item->id,
                    'customer_name' => $item->name,
                    'customer_email' => $item->email,
                    'orders_count' => $item->orders_count,
                    'total_spent_cents' => $item->total_spent,
                    'total_spent' => $item->total_spent / 100,
                    'avg_order_value' => ($item->total_spent / $item->orders_count) / 100,
                ]);

            // Customer acquisition trend
            $acquisitionTrend = User::whereBetween('created_at', [$from, $to])
                ->whereHas('roles', function ($q) {
                    $q->where('name', 'customer');
                })
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('COUNT(*) as count')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get();

            // Geographic distribution (by country)
            $geoDistribution = DB::table('orders')
                ->join('addresses', 'orders.shipping_address_id', '=', 'addresses.id')
                ->whereBetween('orders.created_at', [$from, $to])
                ->select(
                    'addresses.country',
                    DB::raw('COUNT(DISTINCT orders.user_id) as customers_count'),
                    DB::raw('COUNT(orders.id) as orders_count'),
                    DB::raw('SUM(orders.total_cents) as revenue')
                )
                ->groupBy('addresses.country')
                ->orderByDesc('revenue')
                ->get()
                ->map(fn($item) => [
                    'country' => $item->country,
                    'customers_count' => $item->customers_count,
                    'orders_count' => $item->orders_count,
                    'revenue_cents' => $item->revenue,
                    'revenue' => $item->revenue / 100,
                ]);

            // Total customers
            $totalCustomers = User::whereHas('roles', function ($q) {
                $q->where('name', 'customer');
            })->count();

            // Customer lifetime value (average)
            // First, create subquery to calculate total per customer
            $customerTotalsSubquery = DB::table('orders')
                ->select('user_id', DB::raw('SUM(total_cents) as customer_total'))
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->whereNull('deleted_at')
                ->groupBy('user_id');

            // Then join with users and roles to filter customers only
            $avgLifetimeValue = DB::table(DB::raw("({$customerTotalsSubquery->toSql()}) as customer_totals"))
                ->mergeBindings($customerTotalsSubquery)
                ->join('users', 'customer_totals.user_id', '=', 'users.id')
                ->join('model_has_roles', function ($join) {
                    $join->on('users.id', '=', 'model_has_roles.model_id')
                        ->where('model_has_roles.model_type', '=', User::class);
                })
                ->join('roles', 'model_has_roles.role_id', '=', 'roles.id')
                ->where('roles.name', 'customer')
                ->avg('customer_totals.customer_total');

            return [
                'total_customers' => $totalCustomers,
                'new_customers' => $newCustomers,
                'avg_lifetime_value_cents' => $avgLifetimeValue ?? 0,
                'avg_lifetime_value' => ($avgLifetimeValue ?? 0) / 100,
                'top_customers' => $topCustomers,
                'acquisition_trend' => $acquisitionTrend,
                'geo_distribution' => $geoDistribution,
            ];
        });
    }

    /**
     * Get COD (Cash on Delivery) report.
     *
     * @param Carbon $from
     * @param Carbon $to
     * @return array
     */
    public function getCodReport(Carbon $from, Carbon $to): array
    {
        $cacheKey = $this->getCacheKey('cod', $from, $to, []);

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($from, $to) {
            // COD orders
            $codOrders = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', 'cod')
                ->count();

            $codRevenue = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', 'cod')
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->sum('total_cents');

            // Prepaid orders
            $prepaidOrders = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', '!=', 'cod')
                ->count();

            $prepaidRevenue = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', '!=', 'cod')
                ->whereNotIn('status', ['cancelled', 'failed'])
                ->sum('total_cents');

            // COD delivery success rate
            $codDelivered = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', 'cod')
                ->where('status', 'delivered')
                ->count();

            $codCancelled = Order::whereBetween('created_at', [$from, $to])
                ->where('payment_method', 'cod')
                ->whereIn('status', ['cancelled', 'failed'])
                ->count();

            $codSuccessRate = $codOrders > 0 ? ($codDelivered / $codOrders) * 100 : 0;

            // Daily COD vs Prepaid
            $dailyComparison = Order::whereBetween('created_at', [$from, $to])
                ->select(
                    DB::raw('DATE(created_at) as date'),
                    DB::raw('SUM(CASE WHEN payment_method = "cod" THEN 1 ELSE 0 END) as cod_orders'),
                    DB::raw('SUM(CASE WHEN payment_method != "cod" THEN 1 ELSE 0 END) as prepaid_orders'),
                    DB::raw('SUM(CASE WHEN payment_method = "cod" THEN total_cents ELSE 0 END) as cod_revenue'),
                    DB::raw('SUM(CASE WHEN payment_method != "cod" THEN total_cents ELSE 0 END) as prepaid_revenue')
                )
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'date' => $item->date,
                    'cod_orders' => $item->cod_orders,
                    'prepaid_orders' => $item->prepaid_orders,
                    'cod_revenue' => $item->cod_revenue / 100,
                    'prepaid_revenue' => $item->prepaid_revenue / 100,
                ]);

            return [
                'cod_orders' => $codOrders,
                'cod_revenue_cents' => $codRevenue,
                'cod_revenue' => $codRevenue / 100,
                'prepaid_orders' => $prepaidOrders,
                'prepaid_revenue_cents' => $prepaidRevenue,
                'prepaid_revenue' => $prepaidRevenue / 100,
                'cod_success_rate' => round($codSuccessRate, 2),
                'cod_delivered' => $codDelivered,
                'cod_cancelled' => $codCancelled,
                'daily_comparison' => $dailyComparison,
            ];
        });
    }

    /**
     * Generate cache key for reports.
     *
     * @param string $type
     * @param Carbon $from
     * @param Carbon $to
     * @param array $filters
     * @return string
     */
    protected function getCacheKey(string $type, Carbon $from, Carbon $to, array $filters): string
    {
        $filterString = md5(json_encode($filters));
        return "report:{$type}:{$from->format('Y-m-d')}:{$to->format('Y-m-d')}:{$filterString}";
    }

    /**
     * Clear report cache.
     *
     * @return void
     */
    public function clearCache(): void
    {
        Cache::flush();
    }
}
