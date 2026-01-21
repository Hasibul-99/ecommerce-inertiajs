<?php

declare(strict_types=1);

namespace Tests\Feature\Vendor;

use App\Models\User;
use App\Models\Vendor;
use App\Services\VendorOnboardingService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class VendorRegistrationTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function user_can_apply_to_become_vendor(): void
    {
        Storage::fake('public');

        $user = $this->createCustomer();
        $this->actingAs($user);

        $response = $this->post(route('vendor.register'), [
            'business_name' => 'Test Business',
            'business_email' => 'business@example.com',
            'business_phone' => '+1234567890',
            'business_address' => '123 Business St',
            'business_city' => 'Business City',
            'business_state' => 'CA',
            'business_postal_code' => '90001',
            'business_description' => 'A test business description',
            'tax_id' => '123456789',
            'bank_account_name' => 'Test Account',
            'bank_account_number' => '1234567890',
            'bank_routing_number' => '987654321',
            'documents' => [
                'business_license' => UploadedFile::fake()->create('license.pdf', 100),
                'tax_certificate' => UploadedFile::fake()->create('tax_cert.pdf', 100),
            ],
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('vendors', [
            'user_id' => $user->id,
            'business_name' => 'Test Business',
            'status' => 'pending',
        ]);

        // Assert documents were uploaded
        Storage::disk('public')->assertExists('vendor-documents/license.pdf');
        Storage::disk('public')->assertExists('vendor-documents/tax_cert.pdf');
    }

    /** @test */
    public function vendor_registration_requires_all_mandatory_fields(): void
    {
        $user = $this->createCustomer();
        $this->actingAs($user);

        $response = $this->post(route('vendor.register'), []);

        $response->assertSessionHasErrors([
            'business_name',
            'business_email',
            'business_phone',
            'business_address',
            'tax_id',
        ]);
    }

    /** @test */
    public function vendor_registration_validates_business_email_format(): void
    {
        $user = $this->createCustomer();
        $this->actingAs($user);

        $response = $this->post(route('vendor.register'), [
            'business_name' => 'Test Business',
            'business_email' => 'invalid-email',
            'business_phone' => '+1234567890',
            'business_address' => '123 Business St',
            'tax_id' => '123456789',
        ]);

        $response->assertSessionHasErrors(['business_email']);
    }

    /** @test */
    public function vendor_slug_is_automatically_generated_from_business_name(): void
    {
        $user = $this->createCustomer();
        $this->actingAs($user);

        $this->post(route('vendor.register'), [
            'business_name' => 'My Awesome Business',
            'business_email' => 'business@example.com',
            'business_phone' => '+1234567890',
            'business_address' => '123 Business St',
            'tax_id' => '123456789',
        ]);

        $this->assertDatabaseHas('vendors', [
            'business_name' => 'My Awesome Business',
            'slug' => 'my-awesome-business',
        ]);
    }

    /** @test */
    public function duplicate_vendor_slug_is_handled_with_unique_suffix(): void
    {
        // Create first vendor
        $vendor1 = Vendor::factory()->create([
            'business_name' => 'Test Business',
            'slug' => 'test-business',
        ]);

        // Try to create second vendor with same name
        $user = $this->createCustomer();
        $this->actingAs($user);

        $this->post(route('vendor.register'), [
            'business_name' => 'Test Business',
            'business_email' => 'business2@example.com',
            'business_phone' => '+1234567890',
            'business_address' => '123 Business St',
            'tax_id' => '987654321',
        ]);

        // Should have different slug
        $vendor2 = Vendor::where('user_id', $user->id)->first();
        $this->assertNotEquals($vendor1->slug, $vendor2->slug);
        $this->assertStringStartsWith('test-business', $vendor2->slug);
    }

    /** @test */
    public function user_cannot_apply_as_vendor_twice(): void
    {
        $user = $this->createCustomer();
        Vendor::factory()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->post(route('vendor.register'), [
            'business_name' => 'Another Business',
            'business_email' => 'another@example.com',
            'business_phone' => '+1234567890',
            'business_address' => '123 Business St',
            'tax_id' => '123456789',
        ]);

        $response->assertSessionHasErrors();
        $this->assertDatabaseCount('vendors', 1);
    }

    /** @test */
    public function admin_can_approve_vendor_application(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->pending()->create();

        $response = $this->post(route('admin.vendors.approve', $vendor), [
            'commission_percent' => 15,
            'notes' => 'Application approved',
        ]);

        $response->assertRedirect();
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'approved',
            'commission_percent' => 15,
        ]);

        // Vendor user should have vendor role
        $this->assertTrue($vendor->user->hasRole('vendor'));
    }

    /** @test */
    public function admin_can_reject_vendor_application(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->pending()->create();

        $response = $this->post(route('admin.vendors.reject', $vendor), [
            'rejection_reason' => 'Incomplete documentation',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'rejected',
            'rejection_reason' => 'Incomplete documentation',
        ]);
    }

    /** @test */
    public function vendor_receives_notification_when_approved(): void
    {
        Event::fake();

        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->pending()->create();

        $this->post(route('admin.vendors.approve', $vendor), [
            'commission_percent' => 15,
        ]);

        // Assert notification was sent
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $vendor->user_id,
            'notifiable_type' => User::class,
        ]);
    }

    /** @test */
    public function vendor_receives_notification_when_rejected(): void
    {
        Event::fake();

        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->pending()->create();

        $this->post(route('admin.vendors.reject', $vendor), [
            'rejection_reason' => 'Test rejection',
        ]);

        // Assert notification was sent
        $this->assertDatabaseHas('notifications', [
            'notifiable_id' => $vendor->user_id,
            'notifiable_type' => User::class,
        ]);
    }

    /** @test */
    public function approved_vendor_can_access_vendor_dashboard(): void
    {
        $vendor = $this->createVendor();
        $this->actingAs($vendor);

        $response = $this->get(route('vendor.dashboard'));

        $response->assertOk();
        $response->assertInertia(fn ($page) => $page->component('Vendor/Dashboard'));
    }

    /** @test */
    public function pending_vendor_cannot_access_vendor_dashboard(): void
    {
        $user = $this->createCustomer();
        Vendor::factory()->pending()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->get(route('vendor.dashboard'));

        $response->assertForbidden();
    }

    /** @test */
    public function suspended_vendor_cannot_access_vendor_dashboard(): void
    {
        $user = $this->createCustomer();
        Vendor::factory()->suspended()->create(['user_id' => $user->id]);

        $this->actingAs($user);

        $response = $this->get(route('vendor.dashboard'));

        $response->assertForbidden();
    }

    /** @test */
    public function admin_can_suspend_active_vendor(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->create(['status' => 'approved']);

        $response = $this->post(route('admin.vendors.suspend', $vendor), [
            'suspension_reason' => 'Policy violation',
        ]);

        $response->assertRedirect();

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'suspended',
            'suspension_reason' => 'Policy violation',
        ]);
    }

    /** @test */
    public function admin_can_reactivate_suspended_vendor(): void
    {
        $admin = $this->createAdmin();
        $this->actingAs($admin);

        $vendor = Vendor::factory()->suspended()->create();

        $response = $this->post(route('admin.vendors.reactivate', $vendor));

        $response->assertRedirect();

        $this->assertDatabaseHas('vendors', [
            'id' => $vendor->id,
            'status' => 'approved',
        ]);
    }

    /** @test */
    public function vendor_onboarding_is_tracked_in_steps(): void
    {
        $user = $this->createCustomer();
        $this->actingAs($user);

        $onboardingService = app(VendorOnboardingService::class);

        // Step 1: Basic info
        $onboardingService->updateStep($user, 'basic_info', [
            'business_name' => 'Test Business',
            'business_email' => 'test@example.com',
        ]);

        // Step 2: Documents
        $onboardingService->updateStep($user, 'documents', [
            'business_license' => 'path/to/license',
        ]);

        // Check progress
        $progress = $onboardingService->getProgress($user);

        $this->assertTrue($progress['basic_info']['completed']);
        $this->assertTrue($progress['documents']['completed']);
        $this->assertFalse($progress['completed']);
    }
}
