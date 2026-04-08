<?php

declare(strict_types=1);

namespace Tests\Feature\Api;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApiAuthenticationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function authenticated_user_can_access_api(): void
    {
        $user = $this->createCustomer();
        Sanctum::actingAs($user);

        $response = $this->getJson('/api/user');

        $response->assertOk();
        $response->assertJson([
            'id' => $user->id,
            'email' => $user->email,
        ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_protected_api(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertUnauthorized();
    }

    /** @test */
    public function api_returns_json_responses(): void
    {
        $response = $this->getJson('/api/user');

        $response->assertHeader('Content-Type', 'application/json');
    }
}
