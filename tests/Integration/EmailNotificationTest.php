<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Models\Order;
use App\Notifications\OrderCreatedNotification;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Mail;
use Tests\TestCase;

class EmailNotificationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function order_confirmation_email_is_sent(): void
    {
        Mail::fake();

        $customer = $this->createCustomer();
        $order = Order::factory()->create(['user_id' => $customer->id]);

        $customer->notify(new OrderCreatedNotification($order));

        Mail::assertSent(\Illuminate\Notifications\Messages\MailMessage::class);
    }
}
