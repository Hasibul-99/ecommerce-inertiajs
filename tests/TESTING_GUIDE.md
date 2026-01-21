# Testing Guide for E-Commerce Platform

## Overview

This document provides comprehensive guidance on the test suite for the multi-vendor e-commerce platform. The test suite includes Feature tests, Unit tests, and Integration tests designed to achieve 80%+ coverage of critical paths.

## Test Structure

```
tests/
├── TestCase.php                     # Base test class with helper methods
├── VendorTestCase.php              # Base class for vendor tests
├── AdminTestCase.php               # Base class for admin tests
├── Feature/
│   ├── Cod/
│   │   ├── CodCheckoutTest.php          ✅ Created
│   │   ├── CodOrderStatusTest.php       ✅ Created
│   │   └── CodReconciliationTest.php    ✅ Created
│   ├── Vendor/
│   │   ├── VendorRegistrationTest.php   ✅ Created
│   │   ├── VendorProductTest.php        ✅ Created
│   │   ├── VendorOrderTest.php          ✅ Created
│   │   └── VendorPayoutTest.php         ✅ Created
│   ├── Order/
│   │   ├── OrderCreationTest.php        📝 Template below
│   │   ├── OrderStatusFlowTest.php      📝 Template below
│   │   ├── OrderRefundTest.php          📝 Template below
│   │   └── MultiVendorOrderTest.php     📝 Template below
│   └── Cart/
│       ├── CartOperationsTest.php       📝 Template below
│       ├── CartToCheckoutTest.php       📝 Template below
│       └── InventoryReservationTest.php 📝 Template below
├── Unit/
│   ├── Services/
│   │   ├── ShippingServiceTest.php      📝 Template below
│   │   ├── CodServiceTest.php           📝 Template below
│   │   ├── CommissionServiceTest.php    📝 Template below
│   │   └── PayoutServiceTest.php        📝 Template below
│   └── Models/
│       ├── ProductTest.php              📝 Template below
│       └── OrderTest.php                📝 Template below
└── Integration/
    ├── PaymentProcessingTest.php        📝 Template below
    ├── EmailNotificationTest.php        📝 Template below
    └── EventDispatchingTest.php         📝 Template below
```

## Running Tests

### Run All Tests
```bash
php artisan test
```

### Run Specific Test Suites
```bash
# Feature tests only
php artisan test --testsuite=Feature

# Unit tests only
php artisan test --testsuite=Unit

# Specific test file
php artisan test tests/Feature/Cod/CodCheckoutTest.php

# Specific test method
php artisan test --filter=test_customer_can_place_cod_order
```

### Run with Coverage
```bash
# Generate coverage report
php artisan test --coverage

# Generate HTML coverage report
php artisan test --coverage-html coverage
```

### Run in Parallel
```bash
php artisan test --parallel
```

## Test Configuration

### Environment Setup

Create a `.env.testing` file:

```env
APP_ENV=testing
APP_KEY=base64:your-test-key-here
APP_DEBUG=true

DB_CONNECTION=sqlite
DB_DATABASE=:memory:

CACHE_DRIVER=array
SESSION_DRIVER=array
QUEUE_CONNECTION=sync

MAIL_MAILER=array

STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...
```

### PHPUnit Configuration

The `phpunit.xml` file is configured with:
- SQLite in-memory database
- Array cache and session drivers
- Sync queue connection
- Database migrations run before tests

## Helper Methods

### TestCase Base Class

```php
// Create users with roles
$customer = $this->createCustomer();
$vendor = $this->createVendor();
$admin = $this->createAdmin();
$superAdmin = $this->createSuperAdmin();

// Database assertions
$this->assertDatabaseHasRecord('table', ['conditions']);
$this->assertDatabaseMissingRecord('table', ['conditions']);
$this->assertSoftDeleted('table', ['conditions']);

// Mock services
$mock = $this->mockExternalService(ServiceClass::class, [
    'method' => 'return_value',
]);
```

### VendorTestCase

```php
// Pre-authenticated as vendor
$this->vendor; // Current vendor user
$this->vendorProfile; // Vendor profile model

// Helper methods
$product = $this->createVendorProduct(['price' => 10000]);
$products = $this->createVendorProducts(5);
$order = $this->createVendorOrder([], 3); // Order with 3 items

// Assertions
$this->assertVendorCanAccess('vendor.products.index');
$this->assertVendorCannotAccess('admin.dashboard');

// Switch vendors
$this->switchToVendor($anotherVendor);
```

### AdminTestCase

```php
// Pre-authenticated as admin
$this->admin; // Current admin user

// Helper methods
$this->approveVendor($vendor);
$this->rejectVendor($vendor, 'reason');
$this->suspendVendor($vendor, 'reason');

// Create complete orders
$order = $this->createCompleteOrder(3); // With 3 items

// Assertions
$this->assertAdminCanAccess('admin.dashboard');
$this->assertAdminCanPerformAction('post', 'admin.vendors.approve', [$vendor]);
```

## Test Templates

### Feature Test Template

```php
<?php

declare(strict_types=1);

namespace Tests\Feature\YourFeature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class YourFeatureTest extends TestCase
{
    use RefreshDatabase;

    /** @test */
    public function it_does_something(): void
    {
        // Arrange
        $user = $this->createCustomer();
        $this->actingAs($user);

        // Act
        $response = $this->post(route('your.route'), [
            'data' => 'value',
        ]);

        // Assert
        $response->assertOk();
        $this->assertDatabaseHas('table', ['data' => 'value']);
    }
}
```

### Unit Test Template

```php
<?php

declare(strict_types=1);

namespace Tests\Unit\Services;

use Tests\TestCase;
use App\Services\YourService;

class YourServiceTest extends TestCase
{
    private YourService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(YourService::class);
    }

    /** @test */
    public function it_calculates_something_correctly(): void
    {
        // Arrange
        $input = 100;

        // Act
        $result = $this->service->calculate($input);

        // Assert
        $this->assertEquals(150, $result);
    }
}
```

## Critical Test Scenarios

### 1. COD Workflow (✅ Completed)
- [x] Customer can place COD order with valid address
- [x] COD fee is calculated and added
- [x] Order amount validation (min/max)
- [x] Order status transitions
- [x] Payment collection tracking
- [x] Daily reconciliation reports

### 2. Vendor Management (✅ Completed)
- [x] Vendor registration and approval
- [x] Product CRUD operations
- [x] Order management
- [x] Payout requests and processing
- [x] Authorization checks

### 3. Order Processing (To Create)
- [ ] Multi-vendor order splitting
- [ ] Stock management and reservation
- [ ] Order status workflows
- [ ] Refunds and cancellations

### 4. Cart Operations (To Create)
- [ ] Add/update/remove items
- [ ] Cart to checkout flow
- [ ] Stock validation
- [ ] Price calculation

### 5. Commission & Payouts (Partially Created)
- [x] Commission calculation per order item
- [x] Available balance calculation
- [x] Payout request and approval
- [ ] Commission reconciliation

## Common Test Patterns

### Testing Authorization

```php
/** @test */
public function vendor_cannot_access_other_vendor_resources(): void
{
    $otherVendor = $this->createVendor();
    $otherProduct = Product::factory()->create([
        'vendor_id' => $otherVendor->vendor->id,
    ]);

    $response = $this->get(route('vendor.products.edit', $otherProduct));

    $response->assertForbidden();
}
```

### Testing Events

```php
/** @test */
public function event_is_dispatched_on_action(): void
{
    Event::fake();

    // Perform action that should dispatch event
    $this->post(route('your.action'));

    Event::assertDispatched(YourEvent::class, function ($event) {
        return $event->model->id === 1;
    });
}
```

### Testing Notifications

```php
/** @test */
public function user_receives_notification(): void
{
    $user = $this->createCustomer();

    // Trigger notification
    $this->post(route('trigger.notification'));

    $this->assertDatabaseHas('notifications', [
        'notifiable_id' => $user->id,
        'notifiable_type' => User::class,
    ]);
}
```

### Testing File Uploads

```php
/** @test */
public function file_is_uploaded_correctly(): void
{
    Storage::fake('public');

    $file = UploadedFile::fake()->image('test.jpg');

    $this->post(route('upload'), ['file' => $file]);

    Storage::disk('public')->assertExists('uploads/test.jpg');
}
```

### Testing Validation

```php
/** @test */
public function validation_fails_with_invalid_data(): void
{
    $response = $this->post(route('your.route'), [
        'email' => 'invalid-email',
        'price' => -10,
    ]);

    $response->assertSessionHasErrors(['email', 'price']);
}
```

### Testing Database Transactions

```php
/** @test */
public function transaction_rolls_back_on_error(): void
{
    $this->expectException(\Exception::class);

    // This should roll back
    try {
        DB::transaction(function () {
            Model::create(['data' => 'value']);
            throw new \Exception('Error');
        });
    } catch (\Exception $e) {
        // Assert nothing was created
        $this->assertDatabaseCount('models', 0);
        throw $e;
    }
}
```

## Best Practices

### 1. AAA Pattern
Always use Arrange-Act-Assert pattern:
```php
// Arrange
$user = $this->createCustomer();

// Act
$result = $service->doSomething($user);

// Assert
$this->assertTrue($result);
```

### 2. Test Isolation
Each test should be independent:
- Don't rely on test execution order
- Don't share state between tests
- Use `RefreshDatabase` trait

### 3. Clear Test Names
Use descriptive test names:
```php
/** @test */
public function vendor_can_update_their_product_price(): void
{
    // Test implementation
}
```

### 4. One Assertion per Concept
Focus each test on one behavior:
```php
// Good
public function test_price_is_required(): void
{
    $response = $this->post(route('products.store'), ['title' => 'Test']);
    $response->assertSessionHasErrors('price');
}

// Avoid
public function test_validation(): void
{
    // Testing multiple validations
}
```

### 5. Use Factories
Always use factories for test data:
```php
$product = Product::factory()->create();
$products = Product::factory()->count(5)->create();
$order = Order::factory()->pending()->create();
```

## Coverage Goals

- **Critical Paths**: 100% coverage
  - Checkout flow
  - Payment processing
  - Order creation
  - COD workflow

- **Business Logic**: 90%+ coverage
  - Services
  - Commands
  - Jobs
  - Policies

- **Controllers**: 80%+ coverage
  - Request handling
  - Validation
  - Authorization

- **Models**: 70%+ coverage
  - Relationships
  - Accessors/Mutators
  - Scopes

## Continuous Integration

### GitHub Actions Workflow

Create `.github/workflows/tests.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  tests:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.1'
          extensions: mbstring, pdo, pdo_sqlite

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Copy .env
        run: cp .env.example .env.testing

      - name: Generate key
        run: php artisan key:generate --env=testing

      - name: Run tests
        run: php artisan test --coverage --min=80
```

## Troubleshooting

### Common Issues

**1. Database not reset between tests**
- Ensure `RefreshDatabase` trait is used
- Check `phpunit.xml` database configuration

**2. Events not being faked**
- Call `Event::fake()` before the action
- Check listener registration

**3. Test hangs on file upload**
- Use `Storage::fake()` before tests
- Clear fake storage after tests

**4. Authorization failures**
- Ensure roles and permissions are seeded
- Check middleware configuration

**5. Failed assertions on async operations**
- Use sync queue connection in tests
- Avoid background jobs in tests

## Additional Resources

- Laravel Testing Documentation: https://laravel.com/docs/testing
- PHPUnit Documentation: https://phpunit.de/documentation.html
- Test Database: https://laravel.com/docs/database-testing
- Mocking: https://laravel.com/docs/mocking

## Next Steps

1. Create remaining Feature tests for Orders and Cart
2. Create Unit tests for Services and Models
3. Create Integration tests for external services
4. Run full test suite and check coverage
5. Add tests to CI/CD pipeline
6. Document any custom test helpers
