<?php

namespace App\Console\Commands;

use App\Models\Vendor;
use App\Services\VendorEarningService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class ProcessVendorPayouts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vendor:process-payouts {--vendor_id= : Process payout for specific vendor}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Process automatic payouts for eligible vendors';

    protected $earningService;

    /**
     * Create a new command instance.
     */
    public function __construct(VendorEarningService $earningService)
    {
        parent::__construct();
        $this->earningService = $earningService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting automatic payout processing...');

        // Make pending earnings available
        $madeAvailable = $this->earningService->makeEarningsAvailable();
        $this->info("Made {$madeAvailable} earnings available for payout");

        // Get vendors to process
        $query = Vendor::where('status', 'approved');

        if ($this->option('vendor_id')) {
            $query->where('id', $this->option('vendor_id'));
        }

        $vendors = $query->get();
        $processedCount = 0;
        $skippedCount = 0;

        foreach ($vendors as $vendor) {
            $this->line("Processing vendor: {$vendor->business_name} (ID: {$vendor->id})");

            try {
                $payout = $this->earningService->processAutomaticPayout($vendor);

                if ($payout) {
                    $this->info("✓ Created payout {$payout->payout_id} for {$vendor->business_name}");
                    $processedCount++;
                } else {
                    $this->line("  Skipped: Insufficient balance or auto-payout not enabled");
                    $skippedCount++;
                }
            } catch (\Exception $e) {
                $this->error("✗ Failed to process payout for {$vendor->business_name}: {$e->getMessage()}");
                Log::error('Automatic payout processing failed', [
                    'vendor_id' => $vendor->id,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $this->info("\nProcessing complete!");
        $this->table(
            ['Result', 'Count'],
            [
                ['Processed', $processedCount],
                ['Skipped', $skippedCount],
                ['Total Vendors', $vendors->count()],
            ]
        );

        return 0;
    }
}
