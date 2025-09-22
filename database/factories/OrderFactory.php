<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Coupon;
use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Order::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(1000, 100000);
        $taxRate = fake()->randomFloat(2, 0.05, 0.15);
        $taxCents = (int)($subtotal * $taxRate);
        $shippingCents = fake()->numberBetween(500, 2000);
        $discountCents = fake()->boolean(30) ? (int)($subtotal * fake()->randomFloat(2, 0.05, 0.25)) : 0;
        $totalCents = $subtotal + $taxCents + $shippingCents - $discountCents;
        
        return [
            'user_id' => User::factory(),
            'order_number' => 'ORD-' . strtoupper(fake()->bothify('######')),
            'status' => fake()->randomElement(['pending', 'processing', 'completed', 'cancelled', 'refunded']),
            'subtotal_cents' => $subtotal,
            'tax_cents' => $taxCents,
            'shipping_cents' => $shippingCents,
            'discount_cents' => $discountCents,
            'total_cents' => $totalCents,
            'shipping_address_id' => Address::factory(),
            'billing_address_id' => function (array $attributes) {
                // 70% chance billing address is same as shipping
                return fake()->boolean(70) ? $attributes['shipping_address_id'] : Address::factory();
            },
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
            'coupon_code' => fake()->boolean(20) ? Coupon::factory()->create()->coupon_code : null,
        ];
    }

    /**
     * Indicate that the order is pending.
     *
     * @return $this
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
            'fulfillment_status' => 'unfulfilled',
        ]);
    }

    /**
     * Indicate that the order is processing.
     *
     * @return $this
     */
    public function processing(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'processing',
            'payment_status' => 'paid',
            'fulfillment_status' => 'unfulfilled',
        ]);
    }

    /**
     * Indicate that the order is completed.
     *
     * @return $this
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'paid',
            'fulfillment_status' => 'delivered',
            'tracking_number' => fake()->bothify('TRK-#########'),
            'shipping_carrier' => fake()->randomElement(['UPS', 'FedEx', 'USPS', 'DHL']),
        ]);
    }

    /**
     * Indicate that the order is cancelled.
     *
     * @return $this
     */
    public function cancelled(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'cancelled',
            'payment_status' => fake()->randomElement(['pending', 'refunded']),
            'fulfillment_status' => 'unfulfilled',
        ]);
    }

    /**
     * Indicate that the order is refunded.
     *
     * @return $this
     */
    public function refunded(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'refunded',
            'payment_status' => 'refunded',
            'fulfillment_status' => fake()->randomElement(['unfulfilled', 'returned']),
        ]);
    }
}