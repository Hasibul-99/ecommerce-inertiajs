<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Events\OrderCreated;
use App\Models\Order;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Tests\TestCase;

class EventDispatchingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_created_event_is_dispatched_and_handled(): void
    {
        Event::fake();

        $order = Order::factory()->create();
        event(new OrderCreated($order));

        Event::assertDispatched(OrderCreated::class);
    }
}
