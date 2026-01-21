<?php

declare(strict_types=1);

namespace Tests\Feature\Cod;

use App\Enums\OrderStatus;
use App\Events\CodOrderConfirmed;
use App\Events\CodOrderOutForDelivery;
use App\Events\CodPaymentCollected;
use App\Events\CodDeliveryFailed;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Services\CodOrderWorkflow;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class CodOrderStatusTest extends TestCase
{
    use RefreshDatabase;

    private CodOrderWorkflow $codWorkflow;

    protected function setUp(): void
    {
        parent::setUp();
        $this->codWorkflow = app(CodOrderWorkflow::class);
        Event::fake();
    }

    /** @test */
    public function admin_can_confirm_pending_cod_order(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = $this->createCodOrder(['status' => 'pending']);

        $result = $this->codWorkflow->confirmOrder($order, 'Order verified and confirmed');

        $this->assertTrue($result['success']);
        $this->assertEquals('confirmed', $order->fresh()->status);

        Event::assertDispatched(CodOrderConfirmed::class);
    }

    /** @test */
    public function confirmed_cod_order_can_be_moved_to_processing(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = $this->createCodOrder(['status' => 'confirmed']);

        $result = $this->codWorkflow->startProcessing($order, 'Vendor started processing');

        $this->assertTrue($result['success']);
        $this->assertEquals('processing', $order->fresh()->status);
    }

    /** @test */
    public function processing_cod_order_can_be_marked_out_for_delivery(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = $this->createCodOrder(['status' => 'processing']);

        $result = $this->codWorkflow->markOutForDelivery($order, null, 'Order dispatched for delivery');

        $this->assertTrue($result['success']);
        $this->assertEquals('out_for_delivery', $order->fresh()->status);

        Event::assertDispatched(CodOrderOutForDelivery::class);
    }

    /** @test */
    public function out_for_delivery_order_can_be_marked_delivered_with_payment_collected(): void
    {
        $deliveryPerson = $this->createCustomer(); // Assuming delivery person is a user
        $this->actingAs($deliveryPerson);

        $order = $this->createCodOrder([
            'status' => 'out_for_delivery',
            'payment_status' => 'unpaid',
        ]);

        $result = $this->codWorkflow->markDelivered($order, $order->total_cents, 'Cash collected');

        $this->assertTrue($result['success']);
        $this->assertEquals('delivered', $order->fresh()->status);
        $this->assertEquals('paid', $order->fresh()->payment_status);

        Event::assertDispatched(CodPaymentCollected::class);
    }

    /** @test */
    public function delivery_can_fail_and_order_marked_as_failed(): void
    {
        $deliveryPerson = $this->createCustomer();
        $this->actingAs($deliveryPerson);

        $order = $this->createCodOrder(['status' => 'out_for_delivery']);

        $result = $this->codWorkflow->markDeliveryFailed($order, 'Customer not available');

        $this->assertTrue($result['success']);
        $this->assertEquals('delivery_failed', $order->fresh()->status);

        Event::assertDispatched(CodDeliveryFailed::class);
    }

    /** @test */
    public function failed_delivery_order_can_be_rescheduled(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = $this->createCodOrder(['status' => 'delivery_failed']);

        $result = $this->codWorkflow->rescheduleDelivery($order, now()->addDays(1), 'Rescheduled for tomorrow');

        $this->assertTrue($result['success']);
        $this->assertEquals('out_for_delivery', $order->fresh()->status);
        $this->assertNotNull($order->fresh()->scheduled_delivery_date);
    }

    /** @test */
    public function cod_order_cannot_be_confirmed_if_not_pending(): void
    {
        $order = $this->createCodOrder(['status' => 'processing']);

        $result = $this->codWorkflow->confirmOrder($order);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('pending', $result['message']);
    }

    /** @test */
    public function non_cod_order_cannot_use_cod_workflow(): void
    {
        $order = Order::factory()->create([
            'payment_method' => 'stripe',
            'status' => 'pending',
        ]);

        $result = $this->codWorkflow->confirmOrder($order);

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('not a COD order', $result['message']);
    }

    /** @test */
    public function cod_order_status_transitions_are_logged(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = $this->createCodOrder(['status' => 'pending']);

        $this->codWorkflow->confirmOrder($order, 'Test confirmation');

        $this->assertDatabaseHas('activity_logs', [
            'subject_type' => Order::class,
            'subject_id' => $order->id,
            'event' => 'confirmed',
        ]);
    }

    /** @test */
    public function vendor_receives_notification_when_cod_order_confirmed(): void
    {
        Event::fake();

        $vendor = $this->createVendor();
        $product = Product::factory()->create(['vendor_id' => $vendor->vendor->id]);

        $order = $this->createCodOrder(['status' => 'pending']);
        OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'vendor_id' => $vendor->vendor->id,
        ]);

        $this->codWorkflow->confirmOrder($order);

        Event::assertDispatched(CodOrderConfirmed::class);
    }

    /** @test */
    public function customer_receives_notification_when_order_out_for_delivery(): void
    {
        Event::fake();

        $order = $this->createCodOrder(['status' => 'processing']);

        $this->codWorkflow->markOutForDelivery($order);

        Event::assertDispatched(CodOrderOutForDelivery::class);
    }

    /** @test */
    public function partial_payment_can_be_recorded(): void
    {
        $order = $this->createCodOrder([
            'status' => 'out_for_delivery',
            'total_cents' => 10000,
        ]);

        $result = $this->codWorkflow->recordPartialPayment($order, 5000, 'Partial payment collected');

        $this->assertTrue($result['success']);
        $this->assertEquals('partially_paid', $order->fresh()->payment_status);
    }

    /** @test */
    public function cod_order_can_be_cancelled_before_delivery(): void
    {
        $customer = $this->createCustomer();
        $order = $this->createCodOrder([
            'user_id' => $customer->id,
            'status' => 'confirmed',
        ]);

        $this->actingAs($customer);

        $result = $this->codWorkflow->cancelOrder($order, 'Customer requested cancellation');

        $this->assertTrue($result['success']);
        $this->assertEquals('cancelled', $order->fresh()->status);
    }

    /** @test */
    public function cod_order_cannot_be_cancelled_after_out_for_delivery(): void
    {
        $customer = $this->createCustomer();
        $order = $this->createCodOrder([
            'user_id' => $customer->id,
            'status' => 'out_for_delivery',
        ]);

        $this->actingAs($customer);

        $result = $this->codWorkflow->cancelOrder($order, 'Customer requested cancellation');

        $this->assertFalse($result['success']);
        $this->assertStringContainsString('cannot be cancelled', $result['message']);
    }

    /**
     * Helper method to create a COD order.
     */
    private function createCodOrder(array $attributes = []): Order
    {
        return Order::factory()->create(array_merge([
            'payment_method' => 'cod',
            'payment_status' => 'unpaid',
        ], $attributes));
    }
}
