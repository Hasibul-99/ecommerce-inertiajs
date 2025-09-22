<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class AddressFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Address::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'first_name' => fake()->firstName(),
            'last_name' => fake()->lastName(),
            'address_line_1' => fake()->streetAddress(),
            'address_line_2' => fake()->boolean(30) ? fake()->secondaryAddress() : null,
            'city' => fake()->city(),
            'state' => fake()->state(),
            'postal_code' => fake()->postcode(),
            'country' => fake()->country(),
            'phone' => fake()->phoneNumber(),
            'is_default' => false,
            'type' => fake()->randomElement(['shipping', 'billing', 'both']),
        ];
    }

    /**
     * Indicate that the address is the default address.
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
     * Indicate that the address is a shipping address.
     *
     * @return $this
     */
    public function shipping(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'shipping',
        ]);
    }

    /**
     * Indicate that the address is a billing address.
     *
     * @return $this
     */
    public function billing(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'billing',
        ]);
    }

    /**
     * Indicate that the address is both shipping and billing.
     *
     * @return $this
     */
    public function both(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'both',
        ]);
    }
}