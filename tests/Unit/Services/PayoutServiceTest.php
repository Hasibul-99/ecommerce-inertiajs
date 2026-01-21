<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Services\PayoutService;
use Tests\TestCase;

class PayoutServiceTest extends TestCase
{
    private PayoutService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(PayoutService::class);
    }

    /** @test */
    public function calculates_available_balance_correctly(): void
    {
        $vendor = $this->createVendor();
        $balance = $this->service->calculateAvailableBalance($vendor->vendor);

        $this->assertIsInt($balance);
        $this->assertGreaterThanOrEqual(0, $balance);
    }
}
