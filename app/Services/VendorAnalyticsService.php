<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\Vendor;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class VendorAnalyticsService
{
    /**
     * Get comprehensive sales summary for vendor.
     *
     * @param Vendor $vendor
     * @param Carbon $from
     * @param Carbon $to
     * @return array
     */
    public function getSalesSummary(Vendor $vendor, Carbon $from, Carbon $to): array
    {
        $cacheKey = "vendor_{$vendor->id}_sales_summary_{$from->format('Y-m-d')}_{$to->format('Y-m-d')}";

        return Cache::remember($cacheKey, now()->addMinutes(15), function () use ($vendor, $from, $to) {
            // Calculate previous period for comparison
            $diff = $from->diffInDays($to);
            $previousFrom = $from->copy()->subDays($diff + 1);
            $previousTo = $from->copy()->subDay();

            // Current period metrics
            $currentRevenue = $this->getVendorRevenue($vendor, $from, $to);
            $currentOrders = $this->getVendorOrdersCount($vendor, $from, $to);
            $currentItems = $this->getVendorItemsSold($vendor, $from, $to);

            // Previous period metrics
            $previousRevenue = $this->getVendorRevenue($vendor, $previousFrom, $previousTo);
            $previousOrders = $this->getVendorOrdersCount($vendor, $previousFrom, $previousTo);
            $previousItems = $this->getVendorItemsSold($vendor, $previousFrom, $previousTo);

            // Calculate commission
            $commission = $currentRevenue * ($vendor->commission_rate / 100);
            $netRevenue = $currentRevenue - $commission;

            return [
                'total_revenue' => $currentRevenue / 100,
                'total_revenue_cents' => $currentRevenue,
                'net_revenue' => $netRevenue / 100,
                'net_revenue_cents' => $netRevenue,
                'commission' => $commission / 100,
                'commission_cents' => $commission,
                'commission_rate' => $vendor->commission_rate,
                'orders_count' => $currentOrders,
                'items_sold' => $currentItems,
                'avg_order_value' => $currentOrders > 0 ? $currentRevenue / $currentOrders / 100 : 0,
                'avg_order_value_cents' => $currentOrders > 0 ? $currentRevenue / $currentOrders : 0,
                'comparison' => [
                    'revenue_change' => $this->calculatePercentageChange($previousRevenue, $currentRevenue),
                    'orders_change' => $this->calculatePercentageChange($previousOrders, $currentOrders),
                    'items_change' => $this->calculatePercentageChange($previousItems, $currentItems),
                    'previous_revenue' => $previousRevenue / 100,
                    'previous_orders' => $previousOrders,
                    'previous_items' => $previousItems,
                ],
            ];
        });
    }

    /**
     * Get top performing products for vendor.
     *
     * @param Vendor $vendor
     * @param int $limit
     * @return Collection
     */
    public function getProductPerformance(Vendor $vendor, int $limit = 10): Collection
    {
        $cacheKey = "vendor_{$vendor->id}_product_performance_{$limit}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor, $limit) {
            return Product::where('vendor_id', $vendor->id)
                ->select([
                    'products.id',
                    'products.name',
                    'products.sku',
                    'products.price_cents',
                    'products.stock',
                    'products.status',
                    DB::raw('COUNT(DISTINCT order_items.id) as units_sold'),
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
                    DB::raw('COUNT(DISTINCT order_items.order_id) as orders_count'),
                ])
                ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
                ->leftJoin('orders', function ($join) {
                    $join->on('order_items.order_id', '=', 'orders.id')
                        ->whereNotIn('orders.status', ['cancelled', 'failed']);
                })
                ->groupBy('products.id', 'products.name', 'products.sku', 'products.price_cents', 'products.stock', 'products.status')
                ->orderByDesc('revenue_cents')
                ->limit($limit)
                ->get()
                ->map(function ($product) {
                    return [
                        'product_id' => $product->id,
                        'product_name' => $product->name,
                        'sku' => $product->sku,
                        'price' => $product->price_cents / 100,
                        'price_cents' => $product->price_cents,
                        'stock' => $product->stock,
                        'status' => $product->status,
                        'units_sold' => $product->units_sold ?? 0,
                        'revenue' => ($product->revenue_cents ?? 0) / 100,
                        'revenue_cents' => $product->revenue_cents ?? 0,
                        'orders_count' => $product->orders_count ?? 0,
                        'avg_order_value' => $product->orders_count > 0
                            ? ($product->revenue_cents / $product->orders_count) / 100
                            : 0,
                    ];
                });
        });
    }

    /**
     * Get orders breakdown by status for vendor.
     *
     * @param Vendor $vendor
     * @param Carbon $from
     * @param Carbon $to
     * @return array
     */
    public function getOrdersBreakdown(Vendor $vendor, Carbon $from, Carbon $to): array
    {
        $cacheKey = "vendor_{$vendor->id}_orders_breakdown_{$from->format('Y-m-d')}_{$to->format('Y-m-d')}";

        return Cache::remember($cacheKey, now()->addMinutes(15), function () use ($vendor, $from, $to) {
            // Orders by status
            $byStatus = OrderItem::select([
                'orders.status',
                DB::raw('COUNT(DISTINCT orders.id) as count'),
                DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
            ])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('orders.created_at', [$from, $to])
                ->groupBy('orders.status')
                ->get()
                ->map(fn($item) => [
                    'status' => $item->status,
                    'count' => $item->count,
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                ]);

            // Orders by payment method
            $byPaymentMethod = OrderItem::select([
                'orders.payment_method',
                DB::raw('COUNT(DISTINCT orders.id) as count'),
                DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
            ])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->groupBy('orders.payment_method')
                ->get()
                ->map(fn($item) => [
                    'payment_method' => $item->payment_method,
                    'count' => $item->count,
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                ]);

            // Pending shipments
            $pendingShipments = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNull('order_items.vendor_fulfillment_status')
                ->whereIn('orders.status', ['pending', 'processing'])
                ->count();

            $totalOrders = $byStatus->sum('count');
            $successfulOrders = $byStatus->where('status', 'delivered')->sum('count');

            return [
                'by_status' => $byStatus,
                'by_payment_method' => $byPaymentMethod,
                'total_orders' => $totalOrders,
                'successful_orders' => $successfulOrders,
                'pending_shipments' => $pendingShipments,
                'success_rate' => $totalOrders > 0 ? ($successfulOrders / $totalOrders) * 100 : 0,
            ];
        });
    }

    /**
     * Get revenue by day for vendor.
     *
     * @param Vendor $vendor
     * @param Carbon $from
     * @param Carbon $to
     * @return array
     */
    public function getRevenueByDay(Vendor $vendor, Carbon $from, Carbon $to): array
    {
        $cacheKey = "vendor_{$vendor->id}_revenue_by_day_{$from->format('Y-m-d')}_{$to->format('Y-m-d')}";

        return Cache::remember($cacheKey, now()->addMinutes(15), function () use ($vendor, $from, $to) {
            $dailyRevenue = OrderItem::select([
                DB::raw('DATE(orders.created_at) as date'),
                DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
                DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
                DB::raw('SUM(order_items.quantity) as items_sold'),
            ])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->groupBy('date')
                ->orderBy('date')
                ->get()
                ->map(fn($item) => [
                    'date' => $item->date,
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                    'orders_count' => $item->orders_count,
                    'items_sold' => $item->items_sold,
                ]);

            // Revenue by hour of day
            $hourlyRevenue = OrderItem::select([
                DB::raw('HOUR(orders.created_at) as hour'),
                DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
                DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
            ])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->groupBy('hour')
                ->orderBy('hour')
                ->get()
                ->map(fn($item) => [
                    'hour' => $item->hour,
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                    'orders_count' => $item->orders_count,
                ]);

            // Revenue by day of week
            $weekdayRevenue = OrderItem::select([
                DB::raw('DAYOFWEEK(orders.created_at) as day_of_week'),
                DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
                DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
            ])
                ->join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('orders.created_at', [$from, $to])
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->groupBy('day_of_week')
                ->orderBy('day_of_week')
                ->get()
                ->map(fn($item) => [
                    'day_of_week' => $item->day_of_week,
                    'day_name' => $this->getDayName($item->day_of_week),
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                    'orders_count' => $item->orders_count,
                ]);

            return [
                'daily' => $dailyRevenue,
                'hourly' => $hourlyRevenue,
                'by_weekday' => $weekdayRevenue,
            ];
        });
    }

    /**
     * Get customer insights for vendor.
     *
     * @param Vendor $vendor
     * @return array
     */
    public function getCustomerInsights(Vendor $vendor): array
    {
        $cacheKey = "vendor_{$vendor->id}_customer_insights";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor) {
            // Total unique customers
            $totalCustomers = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->distinct('orders.user_id')
                ->count('orders.user_id');

            // Repeat customers
            $repeatCustomers = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select('orders.user_id', DB::raw('COUNT(DISTINCT orders.id) as order_count'))
                ->groupBy('orders.user_id')
                ->having('order_count', '>', 1)
                ->count();

            // Average customer lifetime value
            $avgLifetimeValue = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select([
                    'orders.user_id',
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as total_spent'),
                ])
                ->groupBy('orders.user_id')
                ->get()
                ->avg('total_spent') ?? 0;

            // Geographic distribution
            $geoDistribution = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('addresses', 'orders.shipping_address_id', '=', 'addresses.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select([
                    'addresses.country',
                    DB::raw('COUNT(DISTINCT orders.user_id) as customers_count'),
                    DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as revenue_cents'),
                ])
                ->groupBy('addresses.country')
                ->orderByDesc('revenue_cents')
                ->limit(10)
                ->get()
                ->map(fn($item) => [
                    'country' => $item->country,
                    'customers_count' => $item->customers_count,
                    'orders_count' => $item->orders_count,
                    'revenue' => $item->revenue_cents / 100,
                    'revenue_cents' => $item->revenue_cents,
                ]);

            // Top customers
            $topCustomers = OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
                ->join('products', 'order_items.product_id', '=', 'products.id')
                ->join('users', 'orders.user_id', '=', 'users.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereNotIn('orders.status', ['cancelled', 'failed'])
                ->select([
                    'users.id as customer_id',
                    'users.name as customer_name',
                    'users.email as customer_email',
                    DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
                    DB::raw('SUM(order_items.price_cents * order_items.quantity) as total_spent'),
                ])
                ->groupBy('users.id', 'users.name', 'users.email')
                ->orderByDesc('total_spent')
                ->limit(10)
                ->get()
                ->map(fn($item) => [
                    'customer_id' => $item->customer_id,
                    'customer_name' => $item->customer_name,
                    'customer_email' => $item->customer_email,
                    'orders_count' => $item->orders_count,
                    'total_spent' => $item->total_spent / 100,
                    'total_spent_cents' => $item->total_spent,
                    'avg_order_value' => $item->orders_count > 0 ? ($item->total_spent / $item->orders_count) / 100 : 0,
                ]);

            return [
                'total_customers' => $totalCustomers,
                'repeat_customers' => $repeatCustomers,
                'repeat_rate' => $totalCustomers > 0 ? ($repeatCustomers / $totalCustomers) * 100 : 0,
                'avg_lifetime_value' => $avgLifetimeValue / 100,
                'avg_lifetime_value_cents' => $avgLifetimeValue,
                'geo_distribution' => $geoDistribution,
                'top_customers' => $topCustomers,
            ];
        });
    }

    /**
     * Get conversion statistics for vendor.
     *
     * @param Vendor $vendor
     * @return array
     */
    public function getConversionStats(Vendor $vendor): array
    {
        $cacheKey = "vendor_{$vendor->id}_conversion_stats";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor) {
            // Total products
            $totalProducts = Product::where('vendor_id', $vendor->id)->count();
            $activeProducts = Product::where('vendor_id', $vendor->id)
                ->where('status', 'active')
                ->count();

            // Products with sales
            $productsWithSales = Product::where('vendor_id', $vendor->id)
                ->whereHas('orderItems', function ($query) {
                    $query->whereHas('order', function ($q) {
                        $q->whereNotIn('status', ['cancelled', 'failed']);
                    });
                })
                ->count();

            // Low stock products
            $lowStockProducts = Product::where('vendor_id', $vendor->id)
                ->where('stock', '<=', 10)
                ->where('stock', '>', 0)
                ->select('id', 'name', 'sku', 'stock', 'price_cents')
                ->orderBy('stock')
                ->limit(10)
                ->get()
                ->map(fn($product) => [
                    'product_id' => $product->id,
                    'product_name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => $product->stock,
                    'price' => $product->price_cents / 100,
                ]);

            // Out of stock
            $outOfStockCount = Product::where('vendor_id', $vendor->id)
                ->where('stock', 0)
                ->count();

            return [
                'total_products' => $totalProducts,
                'active_products' => $activeProducts,
                'products_with_sales' => $productsWithSales,
                'conversion_rate' => $activeProducts > 0 ? ($productsWithSales / $activeProducts) * 100 : 0,
                'low_stock_products' => $lowStockProducts,
                'low_stock_count' => $lowStockProducts->count(),
                'out_of_stock_count' => $outOfStockCount,
            ];
        });
    }

    /**
     * Helper: Get vendor revenue for a period.
     */
    private function getVendorRevenue(Vendor $vendor, Carbon $from, Carbon $to): int
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereNotIn('orders.status', ['cancelled', 'failed'])
            ->sum(DB::raw('order_items.price_cents * order_items.quantity'));
    }

    /**
     * Helper: Get vendor orders count for a period.
     */
    private function getVendorOrdersCount(Vendor $vendor, Carbon $from, Carbon $to): int
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereNotIn('orders.status', ['cancelled', 'failed'])
            ->distinct('orders.id')
            ->count('orders.id');
    }

    /**
     * Helper: Get vendor items sold for a period.
     */
    private function getVendorItemsSold(Vendor $vendor, Carbon $from, Carbon $to): int
    {
        return OrderItem::join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->whereBetween('orders.created_at', [$from, $to])
            ->whereNotIn('orders.status', ['cancelled', 'failed'])
            ->sum('order_items.quantity');
    }

    /**
     * Helper: Calculate percentage change.
     */
    private function calculatePercentageChange($old, $new): float
    {
        if ($old == 0) {
            return $new > 0 ? 100 : 0;
        }

        return round((($new - $old) / $old) * 100, 2);
    }

    /**
     * Helper: Get day name from day of week number.
     */
    private function getDayName(int $dayOfWeek): string
    {
        $days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return $days[$dayOfWeek - 1] ?? 'Unknown';
    }

    /**
     * Get product views analytics with conversion rates.
     *
     * @param Vendor $vendor
     * @param int $limit
     * @return Collection
     */
    public function getProductViewsAnalytics(Vendor $vendor, int $limit = 20): Collection
    {
        $cacheKey = "vendor_{$vendor->id}_product_views_analytics_{$limit}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor, $limit) {
            return DB::table('products')
                ->leftJoin('product_views', 'products.id', '=', 'product_views.product_id')
                ->leftJoin('order_items', 'products.id', '=', 'order_items.product_id')
                ->where('products.vendor_id', $vendor->id)
                ->select(
                    'products.id as product_id',
                    'products.name as product_name',
                    'products.sku',
                    'products.price_cents',
                    'products.stock',
                    DB::raw('COUNT(DISTINCT product_views.id) as total_views'),
                    DB::raw('COUNT(DISTINCT order_items.order_id) as total_orders'),
                    DB::raw('SUM(order_items.quantity) as units_sold'),
                    DB::raw('SUM(order_items.subtotal_cents) as revenue_cents'),
                    DB::raw('CASE
                        WHEN COUNT(DISTINCT product_views.id) > 0
                        THEN (COUNT(DISTINCT order_items.order_id) * 100.0 / COUNT(DISTINCT product_views.id))
                        ELSE 0
                    END as conversion_rate')
                )
                ->groupBy('products.id', 'products.name', 'products.sku', 'products.price_cents', 'products.stock')
                ->orderByDesc('total_views')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    return [
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'sku' => $item->sku,
                        'price' => $item->price_cents / 100,
                        'stock' => $item->stock,
                        'total_views' => $item->total_views,
                        'total_orders' => $item->total_orders,
                        'units_sold' => $item->units_sold ?? 0,
                        'revenue' => ($item->revenue_cents ?? 0) / 100,
                        'conversion_rate' => round($item->conversion_rate, 2),
                    ];
                });
        });
    }

    /**
     * Get stock movement history for vendor products.
     *
     * @param Vendor $vendor
     * @param Carbon $from
     * @param Carbon $to
     * @param int $limit
     * @return Collection
     */
    public function getStockMovementHistory(Vendor $vendor, Carbon $from, Carbon $to, int $limit = 50): Collection
    {
        $cacheKey = "vendor_{$vendor->id}_stock_movements_{$from->format('Y-m-d')}_{$to->format('Y-m-d')}_{$limit}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor, $from, $to, $limit) {
            return DB::table('stock_movements')
                ->join('products', 'stock_movements.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->whereBetween('stock_movements.created_at', [$from->startOfDay(), $to->endOfDay()])
                ->select(
                    'stock_movements.id',
                    'stock_movements.product_id',
                    'products.name as product_name',
                    'products.sku',
                    'stock_movements.type',
                    'stock_movements.quantity',
                    'stock_movements.stock_before',
                    'stock_movements.stock_after',
                    'stock_movements.notes',
                    'stock_movements.created_at'
                )
                ->orderByDesc('stock_movements.created_at')
                ->limit($limit)
                ->get()
                ->map(function ($movement) {
                    return [
                        'id' => $movement->id,
                        'product_id' => $movement->product_id,
                        'product_name' => $movement->product_name,
                        'sku' => $movement->sku,
                        'type' => $movement->type,
                        'quantity' => $movement->quantity,
                        'stock_before' => $movement->stock_before,
                        'stock_after' => $movement->stock_after,
                        'notes' => $movement->notes,
                        'created_at' => $movement->created_at,
                    ];
                });
        });
    }

    /**
     * Get price change impact analysis.
     *
     * @param Vendor $vendor
     * @param int $limit
     * @return Collection
     */
    public function getPriceChangeImpact(Vendor $vendor, int $limit = 20): Collection
    {
        $cacheKey = "vendor_{$vendor->id}_price_change_impact_{$limit}";

        return Cache::remember($cacheKey, now()->addMinutes(30), function () use ($vendor, $limit) {
            return DB::table('price_histories')
                ->join('products', 'price_histories.product_id', '=', 'products.id')
                ->where('products.vendor_id', $vendor->id)
                ->select(
                    'price_histories.id',
                    'price_histories.product_id',
                    'products.name as product_name',
                    'products.sku',
                    'price_histories.old_price_cents',
                    'price_histories.new_price_cents',
                    DB::raw('(price_histories.new_price_cents - price_histories.old_price_cents) as change_cents'),
                    DB::raw('CASE
                        WHEN price_histories.old_price_cents > 0
                        THEN ((price_histories.new_price_cents - price_histories.old_price_cents) * 100.0 / price_histories.old_price_cents)
                        ELSE 0
                    END as change_percentage'),
                    'price_histories.reason',
                    'price_histories.created_at',
                    // Get sales 7 days before price change
                    DB::raw('(SELECT COALESCE(SUM(oi.quantity), 0)
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        WHERE oi.product_id = price_histories.product_id
                        AND o.created_at BETWEEN DATE_SUB(price_histories.created_at, INTERVAL 7 DAY)
                        AND price_histories.created_at
                    ) as units_sold_before'),
                    // Get sales 7 days after price change
                    DB::raw('(SELECT COALESCE(SUM(oi.quantity), 0)
                        FROM order_items oi
                        JOIN orders o ON oi.order_id = o.id
                        WHERE oi.product_id = price_histories.product_id
                        AND o.created_at BETWEEN price_histories.created_at
                        AND DATE_ADD(price_histories.created_at, INTERVAL 7 DAY)
                    ) as units_sold_after')
                )
                ->orderByDesc('price_histories.created_at')
                ->limit($limit)
                ->get()
                ->map(function ($item) {
                    $salesChange = $item->units_sold_before > 0
                        ? (($item->units_sold_after - $item->units_sold_before) / $item->units_sold_before) * 100
                        : 0;

                    return [
                        'id' => $item->id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'sku' => $item->sku,
                        'old_price' => $item->old_price_cents / 100,
                        'new_price' => $item->new_price_cents / 100,
                        'change_amount' => $item->change_cents / 100,
                        'change_percentage' => round($item->change_percentage, 2),
                        'units_sold_before' => $item->units_sold_before,
                        'units_sold_after' => $item->units_sold_after,
                        'sales_change_percentage' => round($salesChange, 2),
                        'reason' => $item->reason,
                        'created_at' => $item->created_at,
                    ];
                });
        });
    }

    /**
     * Clear vendor analytics cache.
     *
     * @param Vendor $vendor
     * @return void
     */
    public function clearCache(Vendor $vendor): void
    {
        $keys = [
            "vendor_{$vendor->id}_*",
        ];

        foreach ($keys as $pattern) {
            Cache::forget($pattern);
        }
    }
}
