<?php

declare(strict_types=1);

namespace Database\Factories;

use App\Models\Payout;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;

class PayoutFactory extends Factory
{
    protected $model = Payout::class;

    public function definition(): array
    {
        return [
            'vendor_id' => Vendor::factory(),
            'amount_cents' => fake()->numberBetween(5000, 50000),
            'status' => 'pending',
            'payment_method' => fake()->randomElement(['bank_transfer', 'paypal', 'stripe']),
            'requested_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Pending payout.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'processed_at' => null,
            'transaction_id' => null,
        ]);
    }

    /**
     * Approved payout.
     */
    public function approved(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'approved',
            'processed_at' => now(),
            'transaction_id' => 'TXN-' . fake()->bothify('##########'),
        ]);
    }

    /**
     * Rejected payout.
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'rejection_reason' => fake()->sentence(),
            'processed_at' => now(),
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
     * With specific amount.
     */
    public function withAmount(int $amountCents): static
    {
        return $this->state(fn (array $attributes) => [
            'amount_cents' => $amountCents,
        ]);
    }
}
