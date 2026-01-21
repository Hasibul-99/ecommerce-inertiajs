<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderStatusFlowTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_can_transition_from_pending_to_processing(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->pending()->create();

        $response = $this->patch(route('admin.orders.update-status', $order), [
            'status' => 'processing',
        ]);

        $response->assertRedirect();
        $this->assertEquals('processing', $order->fresh()->status);
    }

    /** @test */
    public function order_can_transition_from_processing_to_shipped(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->processing()->create();

        $response = $this->patch(route('admin.orders.update-status', $order), [
            'status' => 'shipped',
            'tracking_number' => 'TRACK123',
        ]);

        $response->assertRedirect();
        $this->assertEquals('shipped', $order->fresh()->status);
        $this->assertEquals('TRACK123', $order->fresh()->tracking_number);
    }

    /** @test */
    public function order_can_be_cancelled_before_shipping(): void
    {
        $customer = $this->createCustomer();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'pending',
        ]);

        $this->actingAs($customer);

        $response = $this->post(route('orders.cancel', $order));

        $response->assertRedirect();
        $this->assertEquals('cancelled', $order->fresh()->status);
    }

    /** @test */
    public function order_cannot_be_cancelled_after_shipping(): void
    {
        $customer = $this->createCustomer();
        $order = Order::factory()->create([
            'user_id' => $customer->id,
            'status' => 'shipped',
        ]);

        $this->actingAs($customer);

        $response = $this->post(route('orders.cancel', $order));

        $response->assertSessionHasErrors();
        $this->assertEquals('shipped', $order->fresh()->status);
    }

    /** @test */
    public function order_status_history_is_tracked(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->pending()->create();

        $this->patch(route('admin.orders.update-status', $order), ['status' => 'processing']);
        $this->patch(route('admin.orders.update-status', $order), ['status' => 'shipped']);

        $this->assertDatabaseCount('order_status_histories', 2);
    }
}
