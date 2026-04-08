<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use App\Models\Address;
use App\Services\CodService;
use Tests\TestCase;

class CodServiceTest extends TestCase
{
    private CodService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(CodService::class);
    }

    /** @test */
    public function cod_fee_increases_with_order_amount(): void
    {
        $fee1 = $this->service->getCodFee(10000);
        $fee2 = $this->service->getCodFee(50000);

        $this->assertGreaterThanOrEqual($fee1, $fee2);
    }

    /** @test */
    public function cod_is_available_for_unrestricted_areas(): void
    {
        $address = Address::factory()->make();
        $this->assertTrue($this->service->isAvailableForAddress($address));
    }
}
