<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderItemFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = OrderItem::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $quantity = fake()->numberBetween(1, 5);
        $priceCents = fake()->numberBetween(500, 20000);
        $subtotalCents = $priceCents * $quantity;
        $taxRate = fake()->randomFloat(2, 0.05, 0.15);
        $taxCents = (int)($subtotalCents * $taxRate);
        $discountCents = fake()->boolean(20) ? (int)($subtotalCents * fake()->randomFloat(2, 0.05, 0.2)) : 0;
        $totalCents = $subtotalCents + $taxCents - $discountCents;
        
        return [
            'order_id' => Order::factory(),
            'product_id' => Product::factory(),
            'product_variant_id' => function (array $attributes) {
                return ProductVariant::factory()->create(['product_id' => $attributes['product_id']]);
            },
            'vendor_id' => function (array $attributes) {
                return Product::find($attributes['product_id'])->vendor_id;
            },
            'product_name' => fake()->words(3, true),
            'variant_name' => fake()->words(2, true),
            'quantity' => $quantity,
            'unit_price_cents' => $priceCents,
            'subtotal_cents' => $subtotalCents,
            'tax_cents' => $taxCents,
            'total_cents' => $totalCents,
            'product_snapshot' => json_encode([
                'color' => fake()->randomElement(['Red', 'Blue', 'Green', 'Black', 'White']),
                'size' => fake()->randomElement(['S', 'M', 'L', 'XL', 'XXL']),
            ]),
        ];
    }

    /**
     * Configure the model factory.
     *
     * @return $this
     */
    public function configure(): static
    {
        return $this->afterMaking(function (OrderItem $orderItem) {
            // Ensure product_name matches product if not explicitly set
            if (!isset($orderItem->product_name) && isset($orderItem->product_id)) {
                $product = Product::find($orderItem->product_id);
                if ($product) {
                    $orderItem->product_name = $product->title;
                }
            }
        });
    }

    /**
     * Indicate that the order item has a specific quantity.
     *
     * @param int $quantity
     * @return $this
     */
    public function quantity(int $quantity): static
    {
        return $this->state(function (array $attributes) use ($quantity) {
            $subtotalCents = $attributes['unit_price_cents'] * $quantity;
            $taxRate = $attributes['tax_cents'] / $attributes['subtotal_cents'];
            $taxCents = (int)($subtotalCents * $taxRate);
            $totalCents = $subtotalCents + $taxCents;
            
            return [
                'quantity' => $quantity,
                'subtotal_cents' => $subtotalCents,
                'tax_cents' => $taxCents,
                'total_cents' => $totalCents,
            ];
        });
    }


}