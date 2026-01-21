<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Commission;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Payout;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class CommissionFactory extends Factory
{
    protected $model = Commission::class;

    public function definition(): array
    {
        $orderItem = OrderItem::factory()->create();
        $totalCents = $orderItem->total_cents;
        $commissionRate = fake()->numberBetween(10, 20); // 10-20%
        $platformAmountCents = (int) ($totalCents * ($commissionRate / 100));
        $vendorAmountCents = $totalCents - $platformAmountCents;

        return [
            'order_item_id' => $orderItem->id,
            'vendor_id' => $orderItem->vendor_id,
            'order_id' => $orderItem->order_id,
            'commission_rate' => $commissionRate,
            'platform_amount_cents' => $platformAmountCents,
            'vendor_amount_cents' => $vendorAmountCents,
            'status' => 'pending',
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Confirmed commission.
     */
    public function confirmed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'confirmed',
        ]);
    }

    /**
     * Paid commission.
     */
    public function paid(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'paid',
            'payout_id' => Payout::factory(),
        ]);
    }

    /**
     * For a specific vendor.
     */
    public function forVendor(Vendor $vendor): static
    {
        return $this->state(fn (array $attributes) => [
            'vendor_id' => $vendor->id,
        ]);
    }

    /**
     * With specific amounts.
     */
    public function withAmounts(int $vendorAmountCents, int $platformAmountCents): static
    {
        return $this->state(fn (array $attributes) => [
            'vendor_amount_cents' => $vendorAmountCents,
            'platform_amount_cents' => $platformAmountCents,
        ]);
    }
}
