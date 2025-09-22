<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Product::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $title = fake()->words(rand(2, 5), true);
        $slug = Str::slug($title) . '-' . uniqid();
        
        return [
            'vendor_id' => Vendor::factory(),
            'category_id' => Category::factory(),
            'title' => $title,
            'slug' => $slug,
            'description' => fake()->paragraphs(3, true),
            'base_price_cents' => fake()->numberBetween(500, 50000),
            'currency' => 'USD',
            'status' => fake()->randomElement(['draft', 'pending', 'published', 'rejected']),
            'published_at' => fake()->boolean(70) ? fake()->dateTimeBetween('-1 year', 'now') : null,

        ];
    }

    /**
     * Indicate that the product is published.
     *
     * @return $this
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-1 year', 'now'),
        ]);
    }

    /**
     * Indicate that the product is a draft.
     *
     * @return $this
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the product is rejected.
     *
     * @return $this
     */
    public function rejected(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'rejected',
            'published_at' => null,
        ]);
    }

    /**
     * Indicate that the product is featured.
     *
     * @return $this
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
        ]);
    }

    /**
     * Indicate that the product is digital.
     *
     * @return $this
     */
    public function digital(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_digital' => true,
            'is_virtual' => true,
            'requires_shipping' => false,
        ]);
    }

    /**
     * Indicate that the product is physical.
     *
     * @return $this
     */
    public function physical(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_digital' => false,
            'is_virtual' => false,
            'requires_shipping' => true,
        ]);
    }
}