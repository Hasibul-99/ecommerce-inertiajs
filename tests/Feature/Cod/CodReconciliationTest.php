<?php

declare(strict_types=1);

namespace Tests\Feature\Cod;

use App\Models\Order;
use App\Models\User;
use App\Services\CodReconciliationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class CodReconciliationTest extends TestCase
{
    use RefreshDatabase;

    private CodReconciliationService $reconciliationService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->reconciliationService = app(CodReconciliationService::class);
    }

    /** @test */
    public function daily_cod_reconciliation_report_can_be_generated(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Create delivered COD orders
        $order1 = $this->createDeliveredCodOrder($deliveryPerson, 10000);
        $order2 = $this->createDeliveredCodOrder($deliveryPerson, 15000);
        $order3 = $this->createDeliveredCodOrder($deliveryPerson, 20000);

        $report = $this->reconciliationService->generateDailyReport($deliveryPerson, now()->toDateString());

        $this->assertNotNull($report);
        $this->assertEquals(3, $report['total_deliveries']);
        $this->assertEquals(45000, $report['total_collected_cents']);
        $this->assertEquals($deliveryPerson->id, $report['delivery_person_id']);
    }

    /** @test */
    public function reconciliation_report_shows_only_todays_deliveries(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Today's orders
        $todayOrder = $this->createDeliveredCodOrder($deliveryPerson, 10000);

        // Yesterday's orders
        $yesterdayOrder = Order::factory()->create([
            'payment_method' => 'cod',
            'status' => 'delivered',
            'payment_status' => 'paid',
            'delivered_by_id' => $deliveryPerson->id,
            'delivered_at' => now()->subDay(),
            'total_cents' => 15000,
        ]);

        $report = $this->reconciliationService->generateDailyReport($deliveryPerson, now()->toDateString());

        $this->assertEquals(1, $report['total_deliveries']);
        $this->assertEquals(10000, $report['total_collected_cents']);
    }

    /** @test */
    public function admin_can_verify_reconciliation_report(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $deliveryPerson = $this->createCustomer();
        $order = $this->createDeliveredCodOrder($deliveryPerson, 10000);

        $reconciliation = DB::table('cod_reconciliations')->insertGetId([
            'delivery_person_id' => $deliveryPerson->id,
            'date' => now()->toDateString(),
            'total_deliveries' => 1,
            'total_collected_cents' => 10000,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $result = $this->reconciliationService->verifyReconciliation($reconciliation, $admin->id);

        $this->assertTrue($result['success']);
        $this->assertDatabaseHas('cod_reconciliations', [
            'id' => $reconciliation,
            'status' => 'verified',
            'verified_by_id' => $admin->id,
        ]);
    }

    /** @test */
    public function discrepancy_is_flagged_when_amounts_dont_match(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Create orders totaling 30000 cents
        $this->createDeliveredCodOrder($deliveryPerson, 10000);
        $this->createDeliveredCodOrder($deliveryPerson, 20000);

        // But delivery person reports only 25000
        $reconciliation = $this->reconciliationService->createReconciliation([
            'delivery_person_id' => $deliveryPerson->id,
            'date' => now()->toDateString(),
            'reported_amount_cents' => 25000,
        ]);

        $this->assertTrue($reconciliation['has_discrepancy']);
        $this->assertEquals(5000, $reconciliation['discrepancy_amount_cents']);
        $this->assertEquals('pending_review', $reconciliation['status']);
    }

    /** @test */
    public function reconciliation_without_discrepancy_is_auto_approved(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Create orders totaling 30000 cents
        $this->createDeliveredCodOrder($deliveryPerson, 10000);
        $this->createDeliveredCodOrder($deliveryPerson, 20000);

        // Delivery person reports exact amount
        $reconciliation = $this->reconciliationService->createReconciliation([
            'delivery_person_id' => $deliveryPerson->id,
            'date' => now()->toDateString(),
            'reported_amount_cents' => 30000,
        ]);

        $this->assertFalse($reconciliation['has_discrepancy']);
        $this->assertEquals(0, $reconciliation['discrepancy_amount_cents']);
        $this->assertEquals('verified', $reconciliation['status']);
    }

    /** @test */
    public function admin_can_add_notes_to_reconciliation_with_discrepancy(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $reconciliation = DB::table('cod_reconciliations')->insertGetId([
            'delivery_person_id' => $this->createCustomer()->id,
            'date' => now()->toDateString(),
            'total_deliveries' => 1,
            'total_collected_cents' => 10000,
            'reported_amount_cents' => 9500,
            'has_discrepancy' => true,
            'discrepancy_amount_cents' => 500,
            'status' => 'pending_review',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $notes = 'Customer returned $5 due to damaged product';
        $result = $this->reconciliationService->addNotes($reconciliation, $notes, $admin->id);

        $this->assertTrue($result['success']);
        $this->assertDatabaseHas('cod_reconciliations', [
            'id' => $reconciliation,
            'admin_notes' => $notes,
        ]);
    }

    /** @test */
    public function reconciliation_report_includes_failed_deliveries(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Successful deliveries
        $this->createDeliveredCodOrder($deliveryPerson, 10000);

        // Failed delivery
        Order::factory()->create([
            'payment_method' => 'cod',
            'status' => 'delivery_failed',
            'payment_status' => 'unpaid',
            'assigned_to_id' => $deliveryPerson->id,
            'created_at' => now(),
            'total_cents' => 15000,
        ]);

        $report = $this->reconciliationService->generateDailyReport($deliveryPerson, now()->toDateString());

        $this->assertEquals(1, $report['successful_deliveries']);
        $this->assertEquals(1, $report['failed_deliveries']);
        $this->assertEquals(10000, $report['total_collected_cents']);
    }

    /** @test */
    public function monthly_reconciliation_summary_can_be_generated(): void
    {
        $deliveryPerson = $this->createCustomer();

        // Create reconciliations for the month
        for ($day = 1; $day <= 5; $day++) {
            DB::table('cod_reconciliations')->insert([
                'delivery_person_id' => $deliveryPerson->id,
                'date' => now()->startOfMonth()->addDays($day - 1)->toDateString(),
                'total_deliveries' => 10,
                'total_collected_cents' => 100000,
                'status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $summary = $this->reconciliationService->generateMonthlySummary(
            $deliveryPerson,
            now()->year,
            now()->month
        );

        $this->assertEquals(5, $summary['total_days_worked']);
        $this->assertEquals(50, $summary['total_deliveries']);
        $this->assertEquals(500000, $summary['total_collected_cents']);
    }

    /** @test */
    public function delivery_person_can_view_their_reconciliation_history(): void
    {
        $deliveryPerson = $this->createCustomer();
        $this->actingAs($deliveryPerson);

        // Create some reconciliations
        for ($i = 0; $i < 3; $i++) {
            DB::table('cod_reconciliations')->insert([
                'delivery_person_id' => $deliveryPerson->id,
                'date' => now()->subDays($i)->toDateString(),
                'total_deliveries' => 5,
                'total_collected_cents' => 50000,
                'status' => 'verified',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $response = $this->get(route('delivery.reconciliations.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Delivery/Reconciliations/Index')
            ->has('reconciliations', 3)
        );
    }

    /** @test */
    public function admin_can_view_all_pending_reconciliations(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        // Create pending reconciliations
        for ($i = 0; $i < 5; $i++) {
            DB::table('cod_reconciliations')->insert([
                'delivery_person_id' => $this->createCustomer()->id,
                'date' => now()->toDateString(),
                'total_deliveries' => 5,
                'total_collected_cents' => 50000,
                'reported_amount_cents' => 48000,
                'has_discrepancy' => true,
                'discrepancy_amount_cents' => 2000,
                'status' => 'pending_review',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $response = $this->get(route('admin.reconciliations.pending'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Admin/Reconciliations/Pending')
            ->has('reconciliations', 5)
        );
    }

    /**
     * Helper method to create a delivered COD order.
     */
    private function createDeliveredCodOrder(User $deliveryPerson, int $amountCents): Order
    {
        return Order::factory()->create([
            'payment_method' => 'cod',
            'status' => 'delivered',
            'payment_status' => 'paid',
            'delivered_by_id' => $deliveryPerson->id,
            'delivered_at' => now(),
            'total_cents' => $amountCents,
        ]);
    }
}
