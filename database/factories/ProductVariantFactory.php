<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = ProductVariant::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'product_id' => Product::factory(),
            'sku' => strtoupper(fake()->bothify('??###-??')),
            'attributes' => json_encode([
                'color' => fake()->randomElement(['Red', 'Blue', 'Green', 'Black', 'White']),
                'size' => fake()->randomElement(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
            ]),
            'price_cents' => fake()->numberBetween(500, 50000),
            'stock_quantity' => fake()->numberBetween(0, 100),
            'is_default' => false,
        ];
    }

    // No status field in the database schema

    /**
     * Indicate that the variant is the default variant.
     *
     * @return $this
     */
    public function default(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_default' => true,
        ]);
    }

    /**
     * Indicate that the variant is in stock.
     *
     * @param int $min
     * @param int $max
     * @return $this
     */
    public function inStock(int $min = 5, int $max = 100): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween($min, $max),
        ]);
    }

    /**
     * Indicate that the variant is out of stock.
     *
     * @return $this
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => 0,
        ]);
    }

    /**
     * Indicate that the variant is low on stock.
     *
     * @param int $max
     * @return $this
     */
    public function lowStock(int $max = 5): static
    {
        return $this->state(fn (array $attributes) => [
            'stock_quantity' => fake()->numberBetween(1, $max),
        ]);
    }
}