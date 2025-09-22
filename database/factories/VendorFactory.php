<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Vendor;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class VendorFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Vendor::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $businessName = fake()->company();
        return [
            'user_id' => User::factory(),
            'business_name' => $businessName,
            'slug' => Str::slug($businessName),
            'phone' => fake()->phoneNumber(),
            'status' => fake()->randomElement(['pending', 'approved', 'rejected', 'blocked']),
            'commission_percent' => fake()->randomFloat(2, 5, 20),
            'stripe_account_id' => fake()->optional()->uuid(),
            'kyc' => json_encode([
                'verified' => fake()->boolean(),
                'documents' => [
                    'id_proof' => fake()->optional()->uuid(),
                    'address_proof' => fake()->optional()->uuid(),
                ]
            ]),
        ];
    }

    /**
     * Indicate that the vendor is active.
     *
     * @return $this
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the vendor is pending.
     *
     * @return $this
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
        ]);
    }

    /**
     * Indicate that the vendor is suspended.
     *
     * @return $this
     */
    public function suspended(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'suspended',
        ]);
    }
}