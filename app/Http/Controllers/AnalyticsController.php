<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    /**
     * Get customer analytics data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function customerAnalytics(Request $request)
    {
        $user = Auth::user();
        $period = $request->input('period', '30'); // days

        // Orders over time
        $ordersOverTime = Order::where('user_id', $user->id)
            ->where('created_at', '>=', now()->subDays($period))
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count'),
                DB::raw('SUM(total_cents) as total')
            )
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($item) {
                return [
                    'date' => $item->date,
                    'count' => $item->count,
                    'total_cents' => $item->total,
                ];
            });

        // Spending by category
        $spendingByCategory = Order::where('user_id', $user->id)
            ->whereIn('status', ['processing', 'shipped', 'delivered'])
            ->with('items.product.category')
            ->get()
            ->flatMap(function ($order) {
                return $order->items;
            })
            ->groupBy(function ($item) {
                return $item->product->category->name ?? 'Uncategorized';
            })
            ->map(function ($items, $category) {
                return [
                    'category' => $category,
                    'total_cents' => $items->sum('subtotal_cents'),
                    'count' => $items->count(),
                ];
            })
            ->values();

        // Order status distribution
        $ordersByStatus = Order::where('user_id', $user->id)
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->get()
            ->map(function ($item) {
                return [
                    'status' => ucfirst($item->status),
                    'count' => $item->count,
                ];
            });

        return response()->json([
            'orders_over_time' => $ordersOverTime,
            'spending_by_category' => $spendingByCategory,
            'orders_by_status' => $ordersByStatus,
        ]);
    }

    /**
     * Get vendor analytics data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function vendorAnalytics(Request $request)
    {
        $user = Auth::user();
        $vendor = $user->vendor;

        if (!$vendor) {
            return response()->json(['error' => 'Vendor not found'], 404);
        }

        $period = $request->input('period', '30'); // days

        // Sales over time
        $salesOverTime = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->where('created_at', '>=', now()->subDays($period))
        ->whereIn('status', ['processing', 'shipped', 'delivered'])
        ->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as order_count'),
            DB::raw('SUM(total_cents) as revenue')
        )
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function ($item) use ($vendor) {
            return [
                'date' => $item->date,
                'order_count' => $item->order_count,
                'revenue_cents' => $item->revenue,
                'commission_cents' => (int)($item->revenue * $vendor->commission_rate),
            ];
        });

        // Top selling products
        $topProducts = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->whereIn('orders.status', ['processing', 'shipped', 'delivered'])
            ->where('orders.created_at', '>=', now()->subDays($period))
            ->select(
                'products.id',
                'products.name',
                DB::raw('SUM(order_items.quantity) as units_sold'),
                DB::raw('SUM(order_items.subtotal_cents) as revenue_cents')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('revenue_cents')
            ->limit(10)
            ->get();

        // Revenue by category
        $revenueByCategory = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->join('categories', 'products.category_id', '=', 'categories.id')
            ->where('products.vendor_id', $vendor->id)
            ->whereIn('orders.status', ['processing', 'shipped', 'delivered'])
            ->where('orders.created_at', '>=', now()->subDays($period))
            ->select(
                'categories.name as category',
                DB::raw('SUM(order_items.subtotal_cents) as revenue_cents'),
                DB::raw('SUM(order_items.quantity) as units_sold')
            )
            ->groupBy('categories.id', 'categories.name')
            ->get();

        // Order status distribution for vendor's products
        $ordersByStatus = Order::whereHas('items.product', function ($query) use ($vendor) {
            $query->where('vendor_id', $vendor->id);
        })
        ->select('status', DB::raw('COUNT(*) as count'))
        ->groupBy('status')
        ->get()
        ->map(function ($item) {
            return [
                'status' => ucfirst($item->status),
                'count' => $item->count,
            ];
        });

        return response()->json([
            'sales_over_time' => $salesOverTime,
            'top_products' => $topProducts,
            'revenue_by_category' => $revenueByCategory,
            'orders_by_status' => $ordersByStatus,
        ]);
    }
}
