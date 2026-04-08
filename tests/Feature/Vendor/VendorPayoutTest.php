<?php

declare(strict_types=1);

namespace Tests\Feature\Vendor;

use App\Models\Commission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Services\PayoutService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\VendorTestCase;

class VendorPayoutTest extends VendorTestCase
{
    use RefreshDatabase;

    private PayoutService $payoutService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->payoutService = app(PayoutService::class);
    }

    /** @test */
    public function vendor_can_view_earnings_dashboard(): void
    {
        $response = $this->get(route('vendor.earnings.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->component('Vendor/Earnings/Index')
            ->has('available_balance')
            ->has('pending_balance')
            ->has('total_earnings')
        );
    }

    /** @test */
    public function vendor_can_request_payout_when_balance_above_minimum(): void
    {
        // Create commissions for delivered orders
        $this->createVendorCommissions(10000); // $100

        $response = $this->post(route('vendor.payouts.request'), [
            'amount' => 100.00,
            'payment_method' => 'bank_transfer',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('payouts', [
            'vendor_id' => $this->vendorProfile->id,
            'amount_cents' => 10000,
            'status' => 'pending',
        ]);
    }

    /** @test */
    public function vendor_cannot_request_payout_below_minimum(): void
    {
        $this->createVendorCommissions(1000); // $10

        $response = $this->post(route('vendor.payouts.request'), [
            'amount' => 10.00,
            'payment_method' => 'bank_transfer',
        ]);

        $response->assertSessionHasErrors(['amount']);
        $this->assertDatabaseCount('payouts', 0);
    }

    /** @test */
    public function vendor_cannot_request_payout_exceeding_available_balance(): void
    {
        $this->createVendorCommissions(5000); // $50

        $response = $this->post(route('vendor.payouts.request'), [
            'amount' => 100.00, // More than available
            'payment_method' => 'bank_transfer',
        ]);

        $response->assertSessionHasErrors(['amount']);
    }

    /** @test */
    public function admin_can_approve_payout_request(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $payout = Payout::factory()->create([
            'vendor_id' => $this->vendorProfile->id,
            'amount_cents' => 10000,
            'status' => 'pending',
        ]);

        $response = $this->post(route('admin.payouts.approve', $payout), [
            'transaction_id' => 'TXN123456',
            'notes' => 'Payout processed via bank transfer',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('payouts', [
            'id' => $payout->id,
            'status' => 'approved',
            'transaction_id' => 'TXN123456',
            'processed_at' => now()->toDateTimeString(),
        ]);
    }

    /** @test */
    public function admin_can_reject_payout_request(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $payout = Payout::factory()->create([
            'vendor_id' => $this->vendorProfile->id,
            'status' => 'pending',
        ]);

        $response = $this->post(route('admin.payouts.reject', $payout), [
            'rejection_reason' => 'Incomplete bank details',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('payouts', [
            'id' => $payout->id,
            'status' => 'rejected',
            'rejection_reason' => 'Incomplete bank details',
        ]);
    }

    /** @test */
    public function vendor_can_view_payout_history(): void
    {
        Payout::factory()->count(5)->create([
            'vendor_id' => $this->vendorProfile->id,
        ]);

        $response = $this->get(route('vendor.payouts.index'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->has('payouts.data', 5));
    }

    /** @test */
    public function available_balance_only_includes_delivered_orders_past_holding_period(): void
    {
        // Delivered today (in holding period)
        $this->createVendorCommissions(5000, [
            'delivered_at' => now(),
        ]);

        // Delivered 10 days ago (past holding period)
        $this->createVendorCommissions(10000, [
            'delivered_at' => now()->subDays(10),
        ]);

        $availableBalance = $this->payoutService->calculateAvailableBalance($this->vendorProfile);

        // Only the order from 10 days ago should be available
        $this->assertEquals(10000, $availableBalance);
    }

    /** @test */
    public function pending_balance_includes_undelivered_orders(): void
    {
        // Pending orders
        $this->createVendorCommissions(5000, [
            'status' => 'pending',
            'delivered_at' => null,
        ]);

        // Processing orders
        $this->createVendorCommissions(3000, [
            'status' => 'processing',
            'delivered_at' => null,
        ]);

        $pendingBalance = $this->payoutService->calculatePendingBalance($this->vendorProfile);

        $this->assertEquals(8000, $pendingBalance);
    }

    /** @test */
    public function vendor_receives_notification_when_payout_approved(): void
    {
        $payout = Payout::factory()->create([
            'vendor_id' => $this->vendorProfile->id,
            'status' => 'pending',
        ]);

        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $this->post(route('admin.payouts.approve', $payout), [
            'transaction_id' => 'TXN123',
        ]);

        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $this->vendor->id,
            'notifiable_type' => \App\Models\User::class,
        ]);
    }

    /** @test */
    public function vendor_can_set_bank_details_for_payouts(): void
    {
        $response = $this->post(route('vendor.settings.bank-details'), [
            'bank_account_name' => 'Test Account',
            'bank_account_number' => '1234567890',
            'bank_routing_number' => '987654321',
            'bank_name' => 'Test Bank',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('vendors', [
            'id' => $this->vendorProfile->id,
            'bank_account_name' => 'Test Account',
            'bank_account_number' => encrypt('1234567890'),
        ]);
    }

    /** @test */
    public function vendor_cannot_request_payout_without_bank_details(): void
    {
        $this->vendorProfile->update([
            'bank_account_name' => null,
            'bank_account_number' => null,
        ]);

        $this->createVendorCommissions(10000);

        $response = $this->post(route('vendor.payouts.request'), [
            'amount' => 100.00,
        ]);

        $response->assertSessionHasErrors(['bank_details']);
    }

    /** @test */
    public function payout_history_shows_commission_breakdown(): void
    {
        $payout = Payout::factory()->create([
            'vendor_id' => $this->vendorProfile->id,
            'status' => 'approved',
        ]);

        // Create commissions associated with this payout
        Commission::factory()->count(3)->create([
            'vendor_id' => $this->vendorProfile->id,
            'payout_id' => $payout->id,
        ]);

        $response = $this->get(route('vendor.payouts.show', $payout));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page
            ->has('payout')
            ->has('commissions', 3)
        );
    }

    /**
     * Helper to create vendor commissions.
     */
    private function createVendorCommissions(int $amountCents, array $orderAttributes = []): void
    {
        $order = Order::factory()->create(array_merge([
            'status' => 'delivered',
            'delivered_at' => now()->subDays(10),
        ], $orderAttributes));

        $product = $this->createVendorProduct();

        $orderItem = OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'vendor_id' => $this->vendorProfile->id,
            'total_cents' => $amountCents,
        ]);

        Commission::factory()->create([
            'order_item_id' => $orderItem->id,
            'vendor_id' => $this->vendorProfile->id,
            'vendor_amount_cents' => $amountCents * 0.85, // 85% to vendor, 15% commission
            'platform_amount_cents' => $amountCents * 0.15,
            'status' => 'confirmed',
        ]);
    }
}
