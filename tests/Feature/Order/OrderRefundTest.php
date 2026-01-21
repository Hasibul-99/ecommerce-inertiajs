<?php

declare(strict_types=1);

namespace Tests\Feature\Order;

use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class OrderRefundTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function admin_can_refund_completed_order(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->completed()->create([
            'payment_status' => 'paid',
            'total_cents' => 10000,
        ]);

        $response = $this->post(route('admin.orders.refund', $order), [
            'amount' => 100.00,
            'reason' => 'Customer request',
        ]);

        $response->assertRedirect();

        $this->assertEquals('refunded', $order->fresh()->payment_status);
        $this->assertDatabaseHas('refunds', [
            'order_id' => $order->id,
            'amount_cents' => 10000,
            'reason' => 'Customer request',
        ]);
    }

    /** @test */
    public function partial_refund_can_be_issued(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $order = Order::factory()->completed()->create([
            'payment_status' => 'paid',
            'total_cents' => 10000,
        ]);

        $this->post(route('admin.orders.refund', $order), [
            'amount' => 50.00,
            'reason' => 'Partial refund',
        ]);

        $this->assertEquals('partially_refunded', $order->fresh()->payment_status);
    }

    /** @test */
    public function refund_restores_product_stock(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $product = \App\Models\Product::factory()->create(['stock' => 5]);
        $order = Order::factory()->completed()->create();

        \App\Models\OrderItem::factory()->create([
            'order_id' => $order->id,
            'product_id' => $product->id,
            'quantity' => 2,
        ]);

        $this->post(route('admin.orders.refund', $order), [
            'amount' => $order->total_cents / 100,
            'reason' => 'Test refund',
            'restore_stock' => true,
        ]);

        $this->assertEquals(7, $product->fresh()->stock);
    }
}
