<?php

namespace App\Console\Commands;

use App\Models\OrderShipment;
use App\Services\ShipmentTrackingService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;

class UpdateShipmentsTracking extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'shipments:update-tracking
                            {--shipment= : Update a specific shipment by ID}
                            {--limit=100 : Limit the number of shipments to update}
                            {--force : Force update even if recently updated}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update tracking information for active shipments from carriers';

    /**
     * Execute the console command.
     */
    public function handle(ShipmentTrackingService $trackingService)
    {
        $this->info('Starting shipment tracking updates...');

        $shipmentId = $this->option('shipment');
        $limit = (int) $this->option('limit');
        $force = $this->option('force');

        if ($shipmentId) {
            // Update a specific shipment
            $shipment = OrderShipment::find($shipmentId);

            if (!$shipment) {
                $this->error("Shipment with ID {$shipmentId} not found.");
                return Command::FAILURE;
            }

            return $this->updateShipment($shipment, $trackingService);
        }

        // Update multiple shipments
        $query = OrderShipment::whereNotNull('tracking_number')
            ->whereNotNull('shipping_carrier')
            ->where('shipping_carrier', '!=', 'local')
            ->whereNotIn('status', ['delivered', 'returned']);

        // Only update shipments that haven't been updated recently (unless forced)
        if (!$force) {
            $query->where(function ($q) {
                $q->whereNull('last_tracking_update')
                    ->orWhere('last_tracking_update', '<', now()->subHour());
            });
        }

        $shipments = $query->limit($limit)->get();

        if ($shipments->isEmpty()) {
            $this->info('No shipments to update.');
            return Command::SUCCESS;
        }

        $this->info("Found {$shipments->count()} shipments to update.");

        $bar = $this->output->createProgressBar($shipments->count());
        $bar->start();

        $successCount = 0;
        $failureCount = 0;
        $skippedCount = 0;

        foreach ($shipments as $shipment) {
            try {
                $trackingService->updateTrackingFromCarrier($shipment);
                $successCount++;
            } catch (\Exception $e) {
                Log::error('Failed to update tracking for shipment ' . $shipment->id, [
                    'error' => $e->getMessage(),
                    'tracking_number' => $shipment->tracking_number,
                    'carrier' => $shipment->shipping_carrier,
                ]);
                $failureCount++;
            }

            $bar->advance();

            // Rate limiting: sleep for a short time between requests to avoid API limits
            usleep(250000); // 250ms delay
        }

        $bar->finish();
        $this->newLine(2);

        // Summary
        $this->info("✓ Successfully updated: {$successCount}");
        if ($failureCount > 0) {
            $this->warn("✗ Failed: {$failureCount}");
        }

        return $failureCount === 0 ? Command::SUCCESS : Command::FAILURE;
    }

    /**
     * Update a single shipment and display results.
     *
     * @param OrderShipment $shipment
     * @param ShipmentTrackingService $trackingService
     * @return int
     */
    protected function updateShipment(OrderShipment $shipment, ShipmentTrackingService $trackingService): int
    {
        $this->info("Updating shipment #{$shipment->id} (Tracking: {$shipment->tracking_number})");

        if (!$shipment->tracking_number) {
            $this->warn('Shipment does not have a tracking number.');
            return Command::FAILURE;
        }

        if (!$shipment->shipping_carrier) {
            $this->warn('Shipment does not have a carrier specified.');
            return Command::FAILURE;
        }

        if ($shipment->shipping_carrier === 'local') {
            $this->warn('Local carriers are not supported for automatic updates.');
            return Command::FAILURE;
        }

        try {
            $oldStatus = $shipment->status;
            $trackingService->updateTrackingFromCarrier($shipment);
            $shipment->refresh();

            $this->info("✓ Successfully updated shipment tracking");
            $this->table(
                ['Field', 'Value'],
                [
                    ['Status', $shipment->status . ($oldStatus !== $shipment->status ? " (was: {$oldStatus})" : '')],
                    ['Carrier', $shipment->shipping_carrier],
                    ['Last Update', $shipment->last_tracking_update?->format('Y-m-d H:i:s') ?? 'N/A'],
                    ['Events', count($shipment->tracking_events ?? [])],
                ]
            );

            if ($shipment->tracking_events && count($shipment->tracking_events) > 0) {
                $this->info("\nLatest event:");
                $latestEvent = end($shipment->tracking_events);
                $this->line("  • {$latestEvent['description']}");
                if ($latestEvent['location'] ?? null) {
                    $this->line("    Location: {$latestEvent['location']}");
                }
                $this->line("    Time: {$latestEvent['timestamp']}");
            }

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error("✗ Failed to update tracking: {$e->getMessage()}");
            return Command::FAILURE;
        }
    }
}
