<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Models\Product;
use App\Models\Vendor;
use App\Notifications\VendorDailySummaryNotification;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SendVendorDailySummaries extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vendor:send-daily-summaries {--date= : The date to generate summary for (Y-m-d format)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Send daily sales summaries to all vendors';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $date = $this->option('date')
            ? Carbon::parse($this->option('date'))
            : Carbon::yesterday();

        $this->info("Generating daily summaries for {$date->format('Y-m-d')}...");

        $vendors = Vendor::with('user')
            ->where('status', 'approved')
            ->get();

        $summariesSent = 0;

        foreach ($vendors as $vendor) {
            if (!$vendor->user) {
                $this->warn("Vendor {$vendor->business_name} has no user, skipping.");
                continue;
            }

            $summary = $this->generateDailySummary($vendor, $date);

            // Send notification
            $vendor->user->notify(new VendorDailySummaryNotification($summary, $vendor->business_name));

            $summariesSent++;
            $this->info("Sent summary to {$vendor->business_name}");
        }

        $this->info("Daily summaries sent to {$summariesSent} vendors.");

        return Command::SUCCESS;
    }

    /**
     * Generate daily summary for a vendor.
     */
    protected function generateDailySummary(Vendor $vendor, Carbon $date): array
    {
        $startOfDay = $date->copy()->startOfDay();
        $endOfDay = $date->copy()->endOfDay();

        // Get revenue and orders for the day
        $salesData = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$startOfDay, $endOfDay])
            ->select(
                DB::raw('SUM(order_items.subtotal_cents) as revenue_cents'),
                DB::raw('COUNT(DISTINCT orders.id) as orders_count'),
                DB::raw('SUM(order_items.quantity) as items_sold')
            )
            ->first();

        // Get top product for the day
        $topProduct = DB::table('order_items')
            ->join('orders', 'order_items.order_id', '=', 'orders.id')
            ->join('products', 'order_items.product_id', '=', 'products.id')
            ->where('products.vendor_id', $vendor->id)
            ->where('orders.status', '!=', 'cancelled')
            ->whereBetween('orders.created_at', [$startOfDay, $endOfDay])
            ->select(
                'products.name',
                DB::raw('SUM(order_items.quantity) as sold')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('sold')
            ->first();

        // Get low stock count
        $lowStockCount = Product::where('vendor_id', $vendor->id)
            ->where('stock', '>', 0)
            ->where('stock', '<=', 10)
            ->count();

        return [
            'revenue_cents' => $salesData->revenue_cents ?? 0,
            'orders_count' => $salesData->orders_count ?? 0,
            'items_sold' => $salesData->items_sold ?? 0,
            'top_product' => $topProduct ? [
                'name' => $topProduct->name,
                'sold' => $topProduct->sold,
            ] : null,
            'low_stock_count' => $lowStockCount,
        ];
    }
}
