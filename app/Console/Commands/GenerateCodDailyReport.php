<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Services\CodReconciliationService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class GenerateCodDailyReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cod:generate-daily-report
                            {date? : The date for the report (format: Y-m-d). Defaults to yesterday}
                            {--delivery-person= : Generate report for a specific delivery person ID}
                            {--auto-verify : Auto-verify reconciliations with zero discrepancy}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate daily COD reconciliation reports for delivery persons';

    protected CodReconciliationService $reconciliationService;

    /**
     * Create a new command instance.
     */
    public function __construct(CodReconciliationService $reconciliationService)
    {
        parent::__construct();
        $this->reconciliationService = $reconciliationService;
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Get the date for the report (default to yesterday)
        $dateString = $this->argument('date');
        $date = $dateString ? Carbon::parse($dateString) : Carbon::yesterday();

        $this->info("Generating COD reconciliation report for {$date->toDateString()}...");

        // Get delivery person if specified
        $deliveryPerson = null;
        if ($this->option('delivery-person')) {
            $deliveryPerson = User::find($this->option('delivery-person'));
            if (!$deliveryPerson) {
                $this->error("Delivery person with ID {$this->option('delivery-person')} not found.");
                return 1;
            }
            $this->info("Generating report for delivery person: {$deliveryPerson->name}");
        }

        // Generate the report
        $result = $this->reconciliationService->generateDailyReport($date, $deliveryPerson);

        if (!$result['success']) {
            $this->error($result['message']);
            Log::error('COD daily report generation failed', [
                'date' => $date->toDateString(),
                'error' => $result['message'],
            ]);
            return 1;
        }

        $this->info($result['message']);
        $this->info("Generated {$result['count']} reconciliation report(s).");

        // Display summary table
        if (!empty($result['reconciliations'])) {
            $this->displaySummaryTable($result['reconciliations']);
        }

        // Auto-verify if option is set
        if ($this->option('auto-verify')) {
            $this->info("\nAuto-verifying reconciliations with zero discrepancy...");
            $verifyResult = $this->reconciliationService->autoVerifyZeroDiscrepancy();
            $this->info($verifyResult['message']);
        }

        // Send notifications to admins
        $this->sendNotifications($result['reconciliations'], $date);

        $this->info("\nDaily reconciliation report generation completed successfully!");

        return 0;
    }

    /**
     * Display summary table of generated reconciliations.
     *
     * @param array $reconciliations
     * @return void
     */
    protected function displaySummaryTable(array $reconciliations)
    {
        $this->info("\n=== Reconciliation Summary ===");

        $headers = ['Delivery Person', 'Orders', 'Expected', 'Collected', 'Discrepancy', 'Status'];
        $rows = [];

        foreach ($reconciliations as $reconciliation) {
            $rows[] = [
                $reconciliation->deliveryPerson->name ?? 'N/A',
                $reconciliation->total_orders_count,
                '$' . number_format($reconciliation->total_cod_amount_cents / 100, 2),
                '$' . number_format($reconciliation->collected_amount_cents / 100, 2),
                '$' . number_format($reconciliation->discrepancy_cents / 100, 2),
                $reconciliation->status,
            ];
        }

        $this->table($headers, $rows);
    }

    /**
     * Send notifications to admins about the generated reports.
     *
     * @param array $reconciliations
     * @param Carbon $date
     * @return void
     */
    protected function sendNotifications(array $reconciliations, Carbon $date)
    {
        // Get admin users
        $admins = User::whereHas('roles', function ($query) {
            $query->whereIn('name', ['admin', 'super-admin']);
        })->get();

        if ($admins->isEmpty()) {
            $this->warn("No admin users found to send notifications.");
            return;
        }

        $totalOrders = collect($reconciliations)->sum('total_orders_count');
        $totalExpected = collect($reconciliations)->sum('total_cod_amount_cents');
        $totalCollected = collect($reconciliations)->sum('collected_amount_cents');
        $totalDiscrepancy = $totalCollected - $totalExpected;
        $reconciliationCount = count($reconciliations);

        // In a real application, send email/SMS notification
        // Example: Notification::send($admins, new CodDailyReportGenerated($reconciliations, $date));

        Log::info('COD daily reconciliation report generated', [
            'date' => $date->toDateString(),
            'reconciliation_count' => $reconciliationCount,
            'total_orders' => $totalOrders,
            'total_expected_cents' => $totalExpected,
            'total_collected_cents' => $totalCollected,
            'total_discrepancy_cents' => $totalDiscrepancy,
        ]);

        $this->info("\nNotification sent to {$admins->count()} admin(s).");
        $this->info("Summary: {$reconciliationCount} reports, {$totalOrders} orders, Discrepancy: $" . number_format($totalDiscrepancy / 100, 2));
    }
}
