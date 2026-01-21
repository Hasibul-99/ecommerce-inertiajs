<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\OrderItem;
use App\Services\CommissionService;
use Tests\TestCase;

class CommissionServiceTest extends TestCase
{
    private CommissionService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(CommissionService::class);
    }

    /** @test */
    public function calculates_commission_correctly(): void
    {
        $orderItem = OrderItem::factory()->make([
            'total_cents' => 10000,
        ]);

        $commission = $this->service->calculateCommission($orderItem, 15);

        $this->assertEquals(1500, $commission['platform_amount_cents']);
        $this->assertEquals(8500, $commission['vendor_amount_cents']);
    }
}
