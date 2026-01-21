<?php

declare(strict_types=1);

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Artisan;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;
    use RefreshDatabase;

    /**
     * Setup the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Seed roles and permissions
        $this->seed(\Database\Seeders\RolesAndPermissionsSeeder::class);
    }

    /**
     * Create a customer user.
     */
    protected function createCustomer(array $attributes = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create($attributes);
        $user->assignRole('customer');
        return $user;
    }

    /**
     * Create a vendor user with vendor profile.
     */
    protected function createVendor(array $userAttributes = [], array $vendorAttributes = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create($userAttributes);
        $user->assignRole('vendor');

        \App\Models\Vendor::factory()->create(array_merge([
            'user_id' => $user->id,
            'status' => 'approved',
        ], $vendorAttributes));

        return $user->fresh(['vendor']);
    }

    /**
     * Create an admin user.
     */
    protected function createAdmin(array $attributes = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create($attributes);
        $user->assignRole('admin');
        return $user;
    }

    /**
     * Create a super admin user.
     */
    protected function createSuperAdmin(array $attributes = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create($attributes);
        $user->assignRole('super-admin');
        return $user;
    }

    /**
     * Assert that a database table has a record matching the given conditions.
     */
    protected function assertDatabaseHasRecord(string $table, array $conditions): void
    {
        $this->assertDatabaseHas($table, $conditions);
    }

    /**
     * Assert that a database table does not have a record matching the given conditions.
     */
    protected function assertDatabaseMissingRecord(string $table, array $conditions): void
    {
        $this->assertDatabaseMissing($table, $conditions);
    }

    /**
     * Mock an external service.
     */
    protected function mockExternalService(string $service, array $methods = []): \Mockery\MockInterface
    {
        $mock = \Mockery::mock($service);

        foreach ($methods as $method => $return) {
            $mock->shouldReceive($method)->andReturn($return);
        }

        $this->app->instance($service, $mock);

        return $mock;
    }
}
