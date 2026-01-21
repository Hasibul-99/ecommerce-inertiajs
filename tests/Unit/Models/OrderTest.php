<?php

declare(strict_types=1);

namespace Tests\Unit\Models;

use App\Models\Order;
use Tests\TestCase;

class OrderTest extends TestCase
{
    /** @test */
    public function order_has_user_relationship(): void
    {
        $order = Order::factory()->create();

        $this->assertInstanceOf(\App\Models\User::class, $order->user);
    }

    /** @test */
    public function order_has_items_relationship(): void
    {
        $order = Order::factory()->create();
        \App\Models\OrderItem::factory()->create(['order_id' => $order->id]);

        $this->assertCount(1, $order->items);
    }

    /** @test */
    public function order_checks_if_cod(): void
    {
        $codOrder = Order::factory()->create(['payment_method' => 'cod']);
        $stripeOrder = Order::factory()->create(['payment_method' => 'stripe']);

        $this->assertTrue($codOrder->isCod());
        $this->assertFalse($stripeOrder->isCod());
    }
}
