<?php

namespace Database\Factories;

use App\Models\Coupon;
use Illuminate\Database\Eloquent\Factories\Factory;

class CouponFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Coupon::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $discountType = fake()->randomElement(['percentage', 'fixed']);
        $value = $discountType === 'percentage' 
            ? fake()->numberBetween(5, 50) 
            : fake()->numberBetween(500, 5000);
        
        return [
            'coupon_code' => strtoupper(fake()->bothify('???###')),
            'description' => fake()->sentence(),
            'discount_type' => $discountType,
            'discount_value' => $value,
            'minimum_spend_cents' => fake()->boolean(50) ? fake()->numberBetween(1000, 10000) : null,
            'maximum_discount_cents' => $discountType === 'percentage' ? fake()->boolean(70) ? fake()->numberBetween(5000, 20000) : null : null,
            'starts_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'expires_at' => fake()->dateTimeBetween('now', '+3 months'),
            'usage_limit' => fake()->boolean(60) ? fake()->numberBetween(1, 100) : null,
            'usage_count' => 0,
            'is_active' => true,
        ];
    }

    /**
     * Indicate that the coupon is active.
     *
     * @return $this
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => true,
            'starts_at' => fake()->dateTimeBetween('-1 month', 'now'),
            'expires_at' => fake()->dateTimeBetween('now', '+3 months'),
        ]);
    }

    /**
     * Indicate that the coupon is inactive.
     *
     * @return $this
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the coupon is expired.
     *
     * @return $this
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => fake()->dateTimeBetween('-3 months', '-2 months'),
            'expires_at' => fake()->dateTimeBetween('-1 month', 'now'),
        ]);
    }

    /**
     * Indicate that the coupon is a percentage discount.
     *
     * @param int $percentage
     * @return $this
     */
    public function percentage(int $percentage = null): static
    {
        return $this->state(fn (array $attributes) => [
            'discount_type' => 'percentage',
            'discount_value' => $percentage ?? fake()->numberBetween(5, 50),
        ]);
    }

    /**
     * Indicate that the coupon is a fixed discount.
     *
     * @param int $amountCents
     * @return $this
     */
    public function fixed(int $amountCents = null): static
    {
        return $this->state(fn (array $attributes) => [
            'discount_type' => 'fixed',
            'discount_value' => $amountCents ?? fake()->numberBetween(500, 5000),
            'maximum_discount_cents' => null,
        ]);
    }
}