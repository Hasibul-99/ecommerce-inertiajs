<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Category::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(2, true);
        $slug = Str::slug($name) . '-' . Str::random(5);
        
        return [
            'name' => $name,
            'slug' => $slug,
            'parent_id' => null,
        ];
    }

    /**
     * Indicate that the category is a child of another category.
     *
     * @param int $parentId
     * @return $this
     */
    public function child(int $parentId): static
    {
        return $this->state(fn (array $attributes) => [
            'parent_id' => $parentId,
        ]);
    }

    // No additional state methods needed
}