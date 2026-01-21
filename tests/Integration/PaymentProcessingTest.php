<?php

declare(strict_types=1);

namespace Tests\Integration;

use App\Services\StripePaymentService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class PaymentProcessingTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function stripe_payment_can_be_processed(): void
    {
        Http::fake([
            'https://api.stripe.com/*' => Http::response([
                'id' => 'pi_test_123',
                'status' => 'succeeded',
            ], 200),
        ]);

        $service = app(StripePaymentService::class);
        $order = \App\Models\Order::factory()->create();

        $result = $service->processPayment($order, [
            'payment_method_id' => 'pm_test_123',
        ]);

        $this->assertTrue($result['success']);
    }
}
