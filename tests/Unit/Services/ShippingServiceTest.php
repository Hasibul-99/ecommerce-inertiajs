<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Models\Order;
use App\Services\ShippingService;
use Tests\TestCase;

class ShippingServiceTest extends TestCase
{
    private ShippingService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(ShippingService::class);
    }

    /** @test */
    public function calculates_shipping_cost_based_on_weight(): void
    {
        $order = Order::factory()->make(['weight_grams' => 1000]);
        $cost = $this->service->calculateShippingCost($order);

        $this->assertGreaterThan(0, $cost);
    }

    /** @test */
    public function calculates_shipping_cost_based_on_distance(): void
    {
        $address = Address::factory()->make(['postal_code' => '90001']);
        $cost = $this->service->calculateShippingCostToAddress($address, 1000);

        $this->assertGreaterThan(0, $cost);
    }
}
