# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **production-grade multi-vendor e-commerce platform** built with Laravel 10+ and React/TypeScript using Inertia.js. The platform supports multiple vendors selling products with commission-based earnings, COD (Cash on Delivery) workflows, comprehensive order management, and detailed analytics for admin and vendors.

## Senior Developer Mindset

When working on this project, **think and act as a senior developer**:

### Code Quality Principles
- **SOLID Principles**: Every class should have a single responsibility, be open for extension but closed for modification
- **DRY (Don't Repeat Yourself)**: Extract reusable logic into services, traits, or utility functions
- **KISS (Keep It Simple, Stupid)**: Favor simple, readable solutions over clever but obscure code
- **YAGNI (You Aren't Gonna Need It)**: Don't build features until they're actually needed
- **Composition over Inheritance**: Use traits and interfaces instead of deep inheritance chains

### Performance First
- **Database Optimization**: Always use indexes, eager loading, and query optimization
- **Caching Strategy**: Cache expensive operations (settings, category trees, popular products)
- **N+1 Query Prevention**: Use `with()`, `load()`, or `loadMissing()` for relationships
- **Lazy Loading**: Defer loading of non-critical data on the frontend
- **Asset Optimization**: Code splitting, lazy imports, image optimization
- **Pagination**: Always paginate large datasets
- **Database Indexing**: Index foreign keys and frequently queried columns

### Security Best Practices
- **Input Validation**: Never trust user input - validate everything using Form Requests
- **SQL Injection Prevention**: Always use Eloquent or query builder with parameter binding
- **XSS Protection**: Sanitize output, use `{{ }}` in Blade, escape in React
- **CSRF Protection**: Verify CSRF tokens on all state-changing requests
- **Authorization Checks**: Use policies and gates, never trust client-side checks
- **Rate Limiting**: Implement rate limiting on authentication, API endpoints, and search
- **Secure File Uploads**: Validate file types, sizes, and sanitize filenames
- **Sensitive Data**: Never log passwords, tokens, or credit card details
- **Mass Assignment Protection**: Always define `$fillable` or `$guarded` in models
- **HTTPS Only**: Force HTTPS in production

### Maintainability
- **Self-Documenting Code**: Write code that explains itself with clear variable/method names
- **Meaningful Comments**: Explain *why*, not *what* - the code shows what it does
- **Type Safety**: Use TypeScript interfaces and PHP type hints everywhere
- **Error Handling**: Anticipate failures, provide meaningful error messages
- **Logging**: Log important actions, errors, and business events for debugging
- **Documentation**: Keep CLAUDE.md, README.md, and inline docs up to date
- **Consistent Naming**: Follow PSR standards for PHP, Airbnb guide for TypeScript
- **Small Functions**: Keep functions under 20 lines, methods should do one thing

### Testing Strategy
- **Test Coverage**: Aim for 80%+ coverage on critical business logic
- **Test Pyramid**: Many unit tests, fewer integration tests, minimal E2E tests
- **TDD (When Appropriate)**: Write tests first for complex business logic
- **Test Isolation**: Each test should be independent and repeatable
- **Mock External Services**: Don't rely on third-party APIs in tests
- **Test Edge Cases**: Test boundary conditions, null values, empty arrays
- **Meaningful Assertions**: Test behavior, not implementation details

### Code Review Checklist
Before committing code, ensure:
- [ ] Code follows PSR-12 (PHP) and Airbnb (TypeScript) style guides
- [ ] All functions have type hints and return types
- [ ] No N+1 queries (check with Telescope/Debugbar)
- [ ] Authorization checks are in place
- [ ] Error cases are handled gracefully
- [ ] Tests are written and passing
- [ ] No console.log or dd() left in code
- [ ] Migrations can be rolled back
- [ ] Documentation is updated if needed
- [ ] No hardcoded values - use config files
- [ ] Sensitive data is not exposed in responses
- [ ] Database transactions for multi-step operations

## Tech Stack

- **Backend**: Laravel 10+ (PHP 8.1+)
- **Frontend**: React 18 + TypeScript + Inertia.js
- **Styling**: Tailwind CSS (with custom `grabit-*` theme classes)
- **Database**: MySQL/PostgreSQL with Eloquent ORM
- **Search**: Laravel Scout with Meilisearch
- **Media**: Spatie Media Library
- **Payments**: Stripe (with COD support)
- **Permissions**: Spatie Laravel Permission
- **State Management**: Inertia.js page props (no Redux/Zustand)
- **Charts**: Chart.js with react-chartjs-2
- **UI Components**: Radix UI + custom components in `resources/js/Components/ui/`
- **Caching**: Redis (for sessions, cache, queues)
- **Queue**: Redis with Laravel Horizon for monitoring
- **Monitoring**: Laravel Telescope (development), Sentry (production)
- **Email**: SMTP (Mailgun, SendGrid, SES)
- **Storage**: Local/S3 for file uploads

## Development Commands

### Laravel/Backend
```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database (if needed)
php artisan db:seed

# Refresh database (CAUTION: drops all tables)
php artisan migrate:fresh --seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
php artisan optimize:clear  # Clear all caches at once

# Generate application key
php artisan key:generate

# Run tests
php artisan test
php artisan test --parallel  # Run tests in parallel
./vendor/bin/phpunit

# Run specific test
php artisan test --filter=TestName
./vendor/bin/phpunit tests/Feature/YourTest.php

# Code coverage
php artisan test --coverage
php artisan test --coverage-html coverage  # Generate HTML report

# Queue workers (for background jobs)
php artisan queue:work
php artisan queue:work --queue=high,default,low  # Priority queues
php artisan queue:listen  # Auto-reload on code changes
php artisan horizon  # For Redis queues with monitoring

# Run scheduler (for cron jobs)
php artisan schedule:work  # Development
php artisan schedule:run   # Production (add to cron)

# Generate IDE helper (if installed)
php artisan ide-helper:generate
php artisan ide-helper:models
php artisan ide-helper:meta

# Database inspection
php artisan db:show  # Show database info
php artisan db:table users  # Show table structure
php artisan db:monitor  # Monitor connections

# Performance optimization
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Development tools
php artisan telescope:install  # Install Telescope
php artisan serve  # Development server

# Storage link
php artisan storage:link

# Scout (search) commands
php artisan scout:import "App\Models\Product"
php artisan scout:flush "App\Models\Product"
```

### Frontend/Assets
```bash
# Install dependencies
npm install

# Development server (with HMR)
npm run dev

# Build for production
npm run build

# Build with SSR support
npm run build

# Type checking
npm run type-check

# Linting
npm run lint
npm run lint:fix

# Format code
npm run format
```

### Custom Artisan Commands
```bash
# COD reconciliation
php artisan cod:generate-daily-report

# Process vendor payouts (scheduled)
php artisan vendor:process-payouts

# Update shipment tracking
php artisan shipments:update-tracking

# Clean up old data
php artisan cleanup:old-carts  # Remove abandoned carts
php artisan cleanup:expired-sessions

# Generate reports
php artisan reports:generate-sales --month=2024-01

# Reindex search
php artisan scout:import "App\Models\Product"
php artisan scout:flush "App\Models\Product"

# Process notifications
php artisan notifications:process-pending

# Update product analytics
php artisan analytics:update-product-stats
```

## Architecture Overview

### Multi-Vendor System

The platform operates with **three primary user roles**:

1. **Admin/Super-Admin**: Full platform control, vendor approval, order management, settings, reports
2. **Vendor**: Product management, order fulfillment, earnings tracking, analytics
3. **Customer**: Browse products, place orders, track shipments, write reviews

**Key Architectural Decisions**:
- Each product belongs to a single vendor (`products.vendor_id`)
- Orders can contain items from multiple vendors (multi-vendor orders)
- Each vendor sees only their own products and order items
- Commission is calculated per order item, not per order
- COD orders have special workflow with reconciliation and delivery tracking
- Soft deletes are used for data retention and recovery
- Activity logging for audit trail and compliance
- All monetary values use `decimal(10,2)` for precision

### Service Layer Pattern

Business logic is **centralized in service classes** (`app/Services/`):

- **CodService**: COD availability, fees, validation
- **CodOrderWorkflow**: COD order status transitions and events
- **CodReconciliationService**: Daily COD collection reconciliation
- **VendorEarningService**: Calculate vendor earnings, available balance, withholdings
- **PayoutService**: Process vendor payouts (bank transfers, manual)
- **ShippingService**: Calculate shipping rates, zones, methods
- **ShipmentTrackingService**: Integrate with carriers for tracking
- **ProductSearchService**: Advanced search with filters using Scout
- **ReviewService**: Product reviews with images, helpful voting, vendor responses
- **VendorAnalyticsService**: Comprehensive vendor analytics and reporting
- **ReportService**: Admin reports (sales, orders, products, vendors, customers)
- **SettingService**: Dynamic settings with caching
- **EmailTemplateService**: Customizable email templates with variables
- **VendorOnboardingService**: Multi-step vendor registration
- **BrowsingHistoryService**: Track recently viewed products
- **CartService**: Shopping cart management with session/database sync
- **OrderService**: Order creation, updates, cancellations
- **InventoryService**: Stock management and movement tracking

**Service Layer Best Practices**:
- **Single Responsibility**: Each service handles one domain area
- **Dependency Injection**: Inject dependencies via constructor
- **Return Types**: Always return consistent types (DTOs, arrays, models, collections)
- **Transactions**: Wrap multi-step operations in database transactions
- **Error Handling**: Throw specific exceptions, handle in controller
- **Logging**: Log important business events and errors
- **Testing**: Services should be easily testable in isolation
- **Immutability**: Services should be stateless when possible

**Service Example**:
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Commission;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommissionService
{
    public function __construct(
        private SettingService $settingService
    ) {}

    public function calculateCommission(OrderItem $orderItem): Commission
    {
        $commissionRate = $orderItem->product->vendor->commission_rate 
            ?? $this->settingService->get('vendor.default_commission_rate', 10);

        $platformAmount = round($orderItem->total * ($commissionRate / 100), 2);
        $vendorAmount = $orderItem->total - $platformAmount;

        return Commission::create([
            'order_item_id' => $orderItem->id,
            'vendor_id' => $orderItem->product->vendor_id,
            'order_id' => $orderItem->order_id,
            'commission_rate' => $commissionRate,
            'platform_amount' => $platformAmount,
            'vendor_amount' => $vendorAmount,
            'status' => 'pending',
        ]);
    }

    public function processDeliveredOrderCommissions(Order $order): void
    {
        DB::transaction(function () use ($order) {
            $order->items()
                ->where('status', 'delivered')
                ->whereDoesntHave('commission')
                ->each(function (OrderItem $item) {
                    $this->calculateCommission($item);
                    
                    Log::info('Commission created', [
                        'order_item_id' => $item->id,
                        'vendor_id' => $item->product->vendor_id,
                    ]);
                });
        });
    }
}
```

**Always use services for business logic, not controllers.** Controllers should be thin orchestrators.

### Repository Pattern (When Needed)

For complex data access logic, use repositories:

```php
<?php

declare(strict_types=1);

namespace App\Repositories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ProductRepository
{
    public function findFeaturedProducts(int $limit = 10): Collection
    {
        return Product::query()
            ->where('is_featured', true)
            ->where('status', 'active')
            ->with(['vendor', 'media', 'category'])
            ->latest('featured_at')
            ->limit($limit)
            ->get();
    }

    public function searchProducts(array $filters, int $perPage = 20): LengthAwarePaginator
    {
        $query = Product::query()
            ->where('status', 'active')
            ->with(['vendor', 'media', 'category', 'reviews']);

        if (isset($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (isset($filters['min_price'])) {
            $query->where('price', '>=', $filters['min_price']);
        }

        if (isset($filters['max_price'])) {
            $query->where('price', '<=', $filters['max_price']);
        }

        if (isset($filters['vendor_id'])) {
            $query->where('vendor_id', $filters['vendor_id']);
        }

        if (isset($filters['in_stock']) && $filters['in_stock']) {
            $query->where('stock', '>', 0);
        }

        return $query->paginate($perPage);
    }
}
```

### Database Schema Highlights

**Core Tables**:
- `users`: Authentication with role-based permissions
- `vendors`: Vendor profiles with commission rates, status, onboarding data
- `products`: Product catalog with vendor relationship, variants, attributes, tags
- `product_variants`: Size/color variants with separate pricing/stock
- `categories`: Hierarchical category tree (nested set model)
- `tags`: Product tags for categorization and search
- `orders`: Customer orders with payment status, COD fields
- `order_items`: Line items per order with vendor-specific status
- `carts`, `cart_items`: Shopping cart (session + database)
- `wishlists`: Customer wishlists
- `reviews`: Product reviews with images, helpful votes, vendor responses
- `commissions`: Vendor earnings per order item
- `payouts`: Vendor payout requests and processing
- `order_shipments`: Shipment tracking with carrier integration

**COD-Specific Tables**:
- `cod_reconciliations`: Daily COD collection reconciliation by delivery person

**Configuration Tables**:
- `settings`: Dynamic platform settings (site, payment, shipping, vendor policies)
- `email_templates`: Customizable email templates
- `notification_settings`: User notification preferences
- `shipping_zones`, `shipping_methods`, `shipping_rates`: Shipping configuration

**Analytics Tables**:
- `product_views`: Track product page views for analytics
- `price_histories`: Track price changes over time
- `stock_movements`: Inventory movement tracking
- `activity_logs`: Audit trail for important actions

**Indexing Strategy**:
- Foreign keys are always indexed
- Frequently queried columns (status, created_at) have indexes
- Composite indexes for common query patterns: `['vendor_id', 'status']`, `['category_id', 'status']`
- Full-text indexes for search fields (title, description)
- Unique indexes for business constraints (email, slug, order_number)

### Event-Driven Architecture

Key events are dispatched for order workflow, notifications, and analytics:

**Order Events**:
- `OrderCreated`, `OrderStatusChanged`, `OrderShipped`, `OrderDelivered`, `OrderCancelled`

**COD Events**:
- `CodOrderConfirmed`, `CodOrderOutForDelivery`, `CodPaymentCollected`, `CodDeliveryFailed`

**Vendor Events**:
- `VendorApplicationSubmitted`, `VendorApplicationApproved`, `VendorApplicationRejected`
- `VendorPayoutProcessed`, `VendorPayoutRequested`

**Review Events**:
- `ReviewCreated`, `ReviewApproved`, `VendorRespondedToReview`

**Product Events**:
- `ProductCreated`, `ProductUpdated`, `ProductStockLow`, `ProductOutOfStock`

**Payment Events**:
- `PaymentProcessed`, `PaymentFailed`, `RefundProcessed`

Listeners are in `app/Listeners/` and handle notifications, emails, analytics tracking.

**Event Best Practices**:
- Events should be immutable value objects
- Listeners should be queued for long-running tasks
- Use event discovery or explicit registration in `EventServiceProvider`
- Log event dispatching for debugging
- Handle listener failures gracefully
- Use event subscribers for related listeners

**Event Example**:
```php
<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusChanged
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public readonly Order $order,
        public readonly string $oldStatus,
        public readonly string $newStatus
    ) {}
}
```

**Listener Example**:
```php
<?php

namespace App\Listeners;

use App\Events\OrderStatusChanged;
use App\Notifications\OrderStatusNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendOrderStatusNotification implements ShouldQueue
{
    public $queue = 'notifications';

    public function handle(OrderStatusChanged $event): void
    {
        $event->order->user->notify(
            new OrderStatusNotification($event->order, $event->newStatus)
        );
    }

    public function failed(OrderStatusChanged $event, \Throwable $exception): void
    {
        \Log::error('Failed to send order status notification', [
            'order_id' => $event->order->id,
            'error' => $exception->getMessage(),
        ]);
    }
}
```

### Queue Architecture

**Queue Setup**:
- Use Redis for queue backend (configured in `.env`)
- Laravel Horizon for queue monitoring and management
- Multiple queues for priority handling: `high`, `default`, `low`, `notifications`

**Jobs Structure**:
```php
<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ProcessOrderJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 120;
    public $backoff = [60, 300, 900]; // Exponential backoff: 1min, 5min, 15min
    public $maxExceptions = 3;

    public function __construct(
        public readonly int $orderId
    ) {}

    public function handle(OrderService $orderService): void
    {
        $order = Order::findOrFail($this->orderId);
        
        $orderService->processOrder($order);
        
        Log::info('Order processed successfully', ['order_id' => $this->orderId]);
    }

    public function failed(\Throwable $exception): void
    {
        Log::error('Order processing failed permanently', [
            'order_id' => $this->orderId,
            'error' => $exception->getMessage(),
            'trace' => $exception->getTraceAsString(),
        ]);
        
        // Notify admin or send alert
    }
}
```

**When to Queue**:
- Email sending
- Image processing and thumbnail generation
- Report generation
- External API calls (shipping, payment gateways)
- Analytics processing
- Bulk operations
- PDF generation
- Search indexing

**Queue Priority**:
- `high`: Payment processing, order confirmation
- `default`: General background tasks
- `low`: Analytics, cleanup tasks
- `notifications`: Email and SMS notifications

### Caching Strategy

**Cache Layers**:
1. **Application Cache**: Redis for application-level caching
2. **Query Cache**: Database query results (use with caution)
3. **Route Cache**: Cached route compilation
4. **Config Cache**: Cached configuration files
5. **View Cache**: Compiled Blade templates

**Caching Patterns**:
```php
// Cache settings with tags
Cache::tags(['settings'])->remember('site.settings', 3600, function () {
    return Setting::where('group', 'site')->get();
});

// Cache invalidation
Cache::tags(['settings'])->flush();

// Cache-aside pattern for expensive queries
$categories = Cache::remember('categories.tree', 3600, function () {
    return Category::with('children')->whereNull('parent_id')->get();
});

// Cache with database events
// In Category model:
protected static function booted()
{
    static::saved(fn() => Cache::forget('categories.tree'));
    static::deleted(fn() => Cache::forget('categories.tree'));
}

// Cache product details with eager loading
$product = Cache::remember("product.{$id}", 3600, function () use ($id) {
    return Product::with(['vendor', 'category', 'media', 'reviews'])
        ->findOrFail($id);
});

// Remember forever (until manually cleared)
$settings = Cache::rememberForever('app.settings', function () {
    return Setting::all()->pluck('value', 'key');
});
```

**What to Cache**:
- Settings and configuration
- Category trees
- Popular products
- Featured products
- User permissions
- Navigation menus
- Product details (with TTL)
- Search results (short TTL)

**What NOT to Cache**:
- User-specific data (cart, wishlist)
- Real-time data (stock levels, prices)
- Session data
- Frequently changing data

### Frontend Architecture (Inertia.js)

**Page Structure** (`resources/js/Pages/`):
- `Welcome.tsx`: Homepage with featured products
- `Products/Index.tsx`: Product listing with filters
- `Products/Show.tsx`: Single product page
- `Cart/Index.tsx`, `Cart/Checkout.tsx`: Shopping cart and checkout flow
- `Orders/Index.tsx`, `Orders/Show.tsx`: Customer order history and tracking
- `Admin/*`: Admin dashboard, users, products, orders, vendors, settings, reports
- `Vendor/*`: Vendor dashboard, products, orders, earnings, analytics
- `Customer/*`: Customer dashboard, addresses, order tracking, wishlist

**Layout Components** (`resources/js/Layouts/`):
- `AppLayout.tsx`: Main customer layout with header/footer
- `AdminLayout.tsx`: Admin dashboard layout with sidebar
- `VendorLayout.tsx`: Vendor dashboard layout
- `AuthLayout.tsx`: Authentication pages layout
- `GuestLayout.tsx`: Guest pages (no auth required)

**Reusable Components** (`resources/js/Components/`):
- `ui/*`: Radix UI-based components (Button, Dialog, Select, Tabs, etc.)
- `Core/*`: Core UI components (Input, Textarea, Dropdown, etc.)
- `Frontend/*`: Customer-facing components (ProductCard, CategoryCard, etc.)
- `Charts/*`: Chart components using Chart.js
- `Search/*`: Search bar with autocomplete
- `Reviews/*`: Review display and submission forms
- `Settings/*`: Settings form inputs
- `NotificationBell.tsx`: In-app notification dropdown
- `Pagination.tsx`: Pagination component
- `LoadingSpinner.tsx`: Loading indicators

**Inertia.js Patterns**:
- Use `router.visit()` for navigation with preserved state
- Use `router.reload()` for partial reloads (specific props only)
- Form submissions use `useForm()` hook from Inertia
- Always handle loading states during form submissions
- Server-side rendered (SSR) is configured via `ssr.tsx`
- Lazy load heavy components with `React.lazy()`
- Use `only` option to load specific props: `router.reload({ only: ['products'] })`

**TypeScript Best Practices**:
- Define interfaces in `resources/js/types/index.d.ts`
- Use strict mode (`"strict": true` in tsconfig.json)
- Avoid `any` type - use `unknown` if type is truly unknown
- Use union types for state management
- Export and reuse types across components
- Use enums for constants
- Leverage utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`

**Component Example**:
```tsx
import React, { memo, useCallback, useState } from 'react';
import { router } from '@inertiajs/react';
import { Product } from '@/types';
import { Button } from '@/Components/ui/Button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  className?: string;
}

export const ProductCard = memo<ProductCardProps>(({ 
  product, 
  onAddToCart,
  className 
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = useCallback(async () => {
    if (!product.in_stock) {
      toast.error('Product is out of stock');
      return;
    }

    setIsLoading(true);
    
    try {
      router.post(route('cart.add'), {
        product_id: product.id,
        quantity: 1,
      }, {
        preserveScroll: true,
        onSuccess: () => {
          toast.success('Added to cart');
          onAddToCart?.(product.id);
        },
        onError: () => {
          toast.error('Failed to add to cart');
        },
        onFinish: () => {
          setIsLoading(false);
        },
      });
    } catch (error) {
      toast.error('An error occurred');
      setIsLoading(false);
    }
  }, [product.id, product.in_stock, onAddToCart]);

  return (
    <div className={cn('product-card rounded-lg border p-4', className)}>
      <img 
        src={product.image_url} 
        alt={product.title}
        className="aspect-square object-cover rounded"
      />
      <h3 className="mt-2 font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-600">${product.price}</p>
      <Button 
        onClick={handleAddToCart}
        disabled={isLoading || !product.in_stock}
        className="mt-2 w-full"
      >
        {isLoading ? 'Adding...' : 'Add to Cart'}
      </Button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
```

### Permissions & Authorization

**Roles**: Managed by Spatie Laravel Permission
- `super-admin`: Full access (use sparingly)
- `admin`: Administrative access
- `vendor`: Vendor portal access
- `customer`: Basic customer access (default)
- `delivery-person`: COD delivery tracking

**Policies** (`app/Policies/`):
- `ProductPolicy`: Check vendor ownership before CRUD operations
- `OrderPolicy`: Ensure users only access their own orders
- `VendorPolicy`: Admin approval and status management
- `ReviewPolicy`: Ownership and moderation
- `PayoutPolicy`: Vendor payout requests

**Policy Best Practices**:
```php
<?php

declare(strict_types=1);

namespace App\Policies;

use App\Models\User;
use App\Models\Product;
use Illuminate\Auth\Access\HandlesAuthorization;

class ProductPolicy
{
    use HandlesAuthorization;

    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): ?bool
    {
        if ($user->hasRole('super-admin')) {
            return true;
        }

        return null; // Continue to specific policy method
    }

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Product $product): bool
    {
        if ($product->status === 'active') {
            return true;
        }

        return $user->hasRole('vendor') 
            && $user->vendor?->id === $product->vendor_id;
    }

    public function create(User $user): bool
    {
        return $user->hasRole('vendor') 
            && $user->vendor?->status === 'approved';
    }

    public function update(User $user, Product $product): bool
    {
        return $user->hasRole('vendor') 
            && $user->vendor?->id === $product->vendor_id
            && $user->vendor?->status === 'approved';
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }
}
```

**Middleware**:
- `role:admin|super-admin`: Admin area protection
- `role:vendor`: Vendor area protection
- `verified`: Email verification requirement
- `throttle:60,1`: Rate limiting (60 requests per minute)
- `throttle:api`: API rate limiting
- Check vendor status (approved) before allowing vendor operations

**Frontend Authorization**:
```tsx
import { usePage } from '@inertiajs/react';

const { auth } = usePage<PageProps>().props;

// Check role
if (auth.user.roles.includes('admin')) {
  // Show admin-only content
}

// Check permission
if (auth.permissions.includes('manage-products')) {
  // Show management UI
}

// Check multiple roles
const isStaff = auth.user.roles.some(role => 
  ['admin', 'super-admin'].includes(role)
);
```

### Payment Processing

**Supported Payment Methods**:
1. **Cash on Delivery (COD)**: Special workflow with delivery tracking and collection reconciliation
2. **Stripe**: Credit/debit card processing
3. **PayPal**: (Basic integration)
4. **Bank Transfer**: Manual verification

**COD Workflow**:
1. Customer selects COD at checkout (with phone verification)
2. Order created with `payment_status=unpaid`, `status=pending`
3. Admin confirms order → `status=confirmed`
4. Vendor processes → `status=processing`
5. Admin assigns delivery person → `status=out_for_delivery`
6. Delivery person collects cash → `status=delivered`, `payment_status=paid`
7. Daily reconciliation generated for each delivery person
8. Admin verifies collected amounts

**Payment Service Example**:
```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Events\PaymentProcessed;
use App\Exceptions\PaymentException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Stripe\PaymentIntent;
use Stripe\Stripe;

class PaymentService
{
    public function __construct(
        private CodService $codService,
        private SettingService $settingService
    ) {
        Stripe::setApiKey(config('services.stripe.secret'));
    }

    public function processPayment(Order $order, array $paymentData): array
    {
        DB::beginTransaction();
        
        try {
            $result = match($paymentData['method']) {
                'stripe' => $this->processStripePayment($order, $paymentData),
                'paypal' => $this->processPayPalPayment($order, $paymentData),
                'cod' => $this->processCodPayment($order, $paymentData),
                'bank_transfer' => $this->processBankTransferPayment($order, $paymentData),
                default => throw new PaymentException('Invalid payment method')
            };

            $order->update([
                'payment_status' => $result['status'],
                'payment_method' => $paymentData['method'],
                'transaction_id' => $result['transaction_id'] ?? null,
            ]);
            
            event(new PaymentProcessed($order, $result));
            
            DB::commit();
            
            return $result;
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Payment processing failed', [
                'order_id' => $order->id,
                'method' => $paymentData['method'],
                'error' => $e->getMessage(),
            ]);
            
            throw new PaymentException('Payment processing failed: ' . $e->getMessage());
        }
    }

    private function processStripePayment(Order $order, array $data): array
    {
        $paymentIntent = PaymentIntent::create([
            'amount' => $order->total * 100, // Convert to cents
            'currency' => 'usd',
            'payment_method' => $data['payment_method_id'],
            'confirmation_method' => 'manual',
            'confirm' => true,
            'metadata' => [
                'order_id' => $order->id,
                'order_number' => $order->order_number,
            ],
        ]);

        return [
            'status' => $paymentIntent->status === 'succeeded' ? 'paid' : 'pending',
            'transaction_id' => $paymentIntent->id,
            'payment_intent' => $paymentIntent,
        ];
    }

    private function processCodPayment(Order $order, array $data): array
    {
        $this->codService->validateCodOrder($order, $data);

        return [
            'status' => 'unpaid', // Will be paid on delivery
            'transaction_id' => null,
        ];
    }
}
```

### Commission & Payout System

**Commission Calculation**:
- Commission is calculated per `order_item` (not per order)
- Each vendor has a `commission_rate` (default from settings)
- Commission is created when order item is marked as delivered
- Stored in `commissions` table with `platform_amount` and `vendor_amount`

**Commission Formula**:
```
platform_amount = item_total * (commission_rate / 100)
vendor_amount = item_total - platform_amount
```

**Payout Flow**:
1. Vendor requests payout when balance > minimum threshold
2. Payout created with `status=pending`
3. Admin reviews and processes payout (bank transfer or manual)
4. Payout marked as `status=paid` with transaction details
5. Automatic payouts can be scheduled (weekly/monthly)

**Balance Types**:
- **Available Balance**: Delivered orders past holding period, ready for payout
- **Pending Balance**: Orders not yet delivered or in holding period
- **Withheld Balance**: Refund reserve (configurable percentage)

**Payout Service Example**:
```php
<?php

namespace App\Services;

use App\Models\Vendor;
use App\Models\Payout;
use App\Models\Commission;
use Carbon\Carbon;

class PayoutService
{
    public function __construct(
        private SettingService $settingService
    ) {}

    public function calculateAvailableBalance(Vendor $vendor): float
    {
        $holdingPeriod = $this->settingService->get('payout.holding_period_days', 7);
        
        return Commission::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', 'confirmed')
            ->whereHas('orderItem', function ($query) use ($holdingPeriod) {
                $query->where('status', 'delivered')
                    ->where('delivered_at', '<=', now()->subDays($holdingPeriod));
            })
            ->whereDoesntHave('payout')
            ->sum('vendor_amount');
    }

    public function calculatePendingBalance(Vendor $vendor): float
    {
        return Commission::query()
            ->where('vendor_id', $vendor->id)
            ->where('status', 'pending')
            ->sum('vendor_amount');
    }

    public function requestPayout(Vendor $vendor, float $amount): Payout
    {
        $available = $this->calculateAvailableBalance($vendor);
        $minimum = $this->settingService->get('payout.minimum_amount', 50);

        if ($amount > $available) {
            throw new \Exception('Insufficient balance');
        }

        if ($amount < $minimum) {
            throw new \Exception("Minimum payout amount is {$minimum}");
        }

        return Payout::create([
            'vendor_id' => $vendor->id,
            'amount' => $amount,
            'status' => 'pending',
            'requested_at' => now(),
        ]);
    }
}
```

### Search & Filtering

**Laravel Scout Configuration**:
- Driver: Meilisearch (configured in `config/scout.php`)
- Searchable model: `Product` with `toSearchableArray()` method
- Indexed fields: title, description, category, vendor, tags, attributes

**Search Model Example**:
```php
<?php

namespace App\Models;

use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;

    public function toSearchableArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => strip_tags($this->description),
            'price' => $this->price,
            'category' => $this->category->name,
            'vendor' => $this->vendor->business_name,
            'tags' => $this->tags->pluck('name')->toArray(),
            'status' => $this->status,
            'in_stock' => $this->stock > 0,
            'rating' => $this->reviews_avg_rating ?? 0,
        ];
    }

    public function shouldBeSearchable(): bool
    {
        return $this->status === 'active';
    }
}
```

**Advanced Filters**:
- Category (single/multiple)
- Price range (min/max slider)
- Rating (4+, 3+, etc.)
- Vendor
- Attributes (dynamic based on product attributes)
- In stock only
- Sort by: newest, price, popularity, rating

**Search Service Example**:
```php
public function search(string $query, array $filters = []): Collection
{
    $results = Product::search($query)
        ->when($filters['category_id'] ?? null, function ($search, $categoryId) {
            return $search->where('category_id', $categoryId);
        })
        ->when($filters['min_price'] ?? null, function ($search, $minPrice) {
            return $search->where('price', '>=', $minPrice);
        })
        ->when($filters['max_price'] ?? null, function ($search, $maxPrice) {
            return $search->where('price', '<=', $maxPrice);
        })
        ->orderBy($filters['sort_by'] ?? 'created_at', $filters['sort_direction'] ?? 'desc')
        ->paginate($filters['per_page'] ?? 20);

    return $results;
}
```

**Search Features**:
- Autocomplete suggestions
- Popular searches tracking
- Recently viewed products
- Search analytics
- Fuzzy matching for typos
- Synonyms support
- Faceted search

### Email & Notifications

**Email Templates** (`email_templates` table):
- Customizable with variables: `{{order.number}}`, `{{user.name}}`, etc.
- Templates for: order placed/confirmed/shipped/delivered, vendor notifications, password reset, welcome email, vendor approval/rejection

**Notification Channels**:
- Email (via Laravel Mail)
- Database (in-app notifications via `notifications` table)
- SMS (basic support, extensible)
- Push notifications (web push)

**Notification Preferences**:
- Per-user settings in `notification_settings` table
- Users can toggle email/SMS/in-app per notification type

**Notification Best Practices**:
```php
<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderShippedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Order $order
    ) {
        $this->queue = 'notifications';
    }

    public function via(object $notifiable): array
    {
        $preferences = $notifiable->notificationSettings()
            ->where('notification_type', 'order_shipped')
            ->first();

        $channels = ['database']; // Always store in database

        if ($preferences?->email_enabled ?? true) {
            $channels[] = 'mail';
        }

        if ($preferences?->sms_enabled ?? false) {
            $channels[] = 'sms';
        }

        return $channels;
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Your order #{$this->order->order_number} has been shipped!")
            ->greeting("Hello {$notifiable->name},")
            ->line("Great news! Your order has been shipped and is on its way to you.")
            ->line("Tracking Number: {$this->order->tracking_number}")
            ->action('Track Order', route('orders.track', $this->order->id))
            ->line('Thank you for shopping with us!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'order_id' => $this->order->id,
            'order_number' => $this->order->order_number,
            'tracking_number' => $this->order->tracking_number,
            'message' => "Your order #{$this->order->order_number} has been shipped!",
        ];
    }
}
```

## Coding Conventions

### Laravel/PHP

- Follow **PSR-12** coding standards
- Use **strict types**: Add `declare(strict_types=1);` at the top of every PHP file
- Use **type hints** for all method parameters and return types
- Keep controllers thin - delegate to services (max 20 lines per method)
- Use **resource controllers** for CRUD operations
- Form requests for validation (`app/Http/Requests/`)
- Use **Eloquent relationships** instead of manual joins
- **Eager load** relationships to avoid N+1 queries
- Use database transactions for multi-step operations
- Log important actions to `activity_logs` table
- Use DTOs (Data Transfer Objects) for complex data structures
- Dependency injection over facades (when possible)
- Use PHP 8.1+ features: enums, named arguments, readonly properties, union types

**Example Controller** (Good vs Bad):
```php
// ❌ BAD: Fat controller with business logic
public function store(Request $request)
{
    $data = $request->validate([
        'title' => 'required',
        'price' => 'required|numeric',
    ]);
    
    $product = Product::create($data);
    $product->tags()->attach($request->tags);
    
    Mail::to($product->vendor->email)->send(new ProductCreated($product));
    
    return redirect()->route('products.index');
}

// ✅ GOOD: Thin controller delegating to service
public function store(StoreProductRequest $request, ProductService $productService)
{
    $product = $productService->createProduct(
        $request->validated(),
        $request->user()->vendor
    );
    
    return redirect()
        ->route('vendor.products.index')
        ->with('success', 'Product created successfully');
}
```

**Model Best Practices**:
```php
<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Product extends Model implements HasMedia
{
    use HasFactory, SoftDeletes, InteractsWithMedia;

    protected $fillable = [
        'vendor_id',
        'category_id',
        'title',
        'slug',
        'description',
        'price',
        'stock',
        'status',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_featured' => 'boolean',
        'featured_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];

    protected $appends = [
        'image_url',
        'in_stock',
    ];

    // Relationships
    public function vendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    // Accessors
    public function getImageUrlAttribute(): ?string
    {
        return $this->getFirstMediaUrl('images');
    }

    public function getInStockAttribute(): bool
    {
        return $this->stock > 0;
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    // Boot method for events
    protected static function booted()
    {
        static::creating(function ($product) {
            if (empty($product->slug)) {
                $product->slug = \Str::slug($product->title);
            }
        });
    }
}
```

### React/TypeScript

- Use **functional components** with hooks (no class components)
- Define **TypeScript interfaces** for all props and API responses
- Use Inertia's `useForm()` for form handling
- Handle loading states explicitly during async operations
- Use `router.visit()` for navigation, not `<a>` tags for internal routes
- Reuse components from `resources/js/Components/`
- Use `React.memo()` for expensive components
- Implement error boundaries for graceful error handling
- Use custom hooks for reusable logic
- Follow the compound component pattern for complex UI
- Use `useMemo` and `useCallback` to optimize re-renders

**TypeScript Types**:
```typescript
// resources/js/types/index.d.ts
export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
  vendor?: Vendor;
}

export interface Product {
  id: number;
  vendor_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  status: 'draft' | 'active' | 'inactive';
  image_url: string;
  in_stock: boolean;
  vendor: Vendor;
  category: Category;
  reviews: Review[];
  created_at: string;
}

export interface PageProps {
  auth: {
    user: User;
  };
  flash: {
    success?: string;
    error?: string;
  };
}
```

**Custom Hooks**:
```typescript
// resources/js/hooks/useCart.ts
import { router } from '@inertiajs/react';
import { useState, useCallback } from 'react';
import { toast } from 'sonner';

export function useCart() {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = useCallback((productId: number, quantity: number = 1) => {
    setIsAdding(true);

    router.post(route('cart.add'), {
      product_id: productId,
      quantity,
    }, {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Added to cart');
      },
      onError: (errors) => {
        toast.error(errors.message || 'Failed to add to cart');
      },
      onFinish: () => {
        setIsAdding(false);
      },
    });
  }, []);

  return { addToCart, isAdding };
}
```

### Styling

- Use **Tailwind utility classes** for styling
- Custom theme colors are prefixed with `grabit-*`
- Responsive design: mobile-first approach
- Avoid inline styles - use Tailwind classes
- Use `cn()` utility for conditional classes
- Extract repeated patterns into components
- Maintain consistent spacing scale
- Use Tailwind's design tokens

**Tailwind Config Example**:
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'grabit-primary': '#3B82F6',
        'grabit-secondary': '#8B5CF6',
        'grabit-accent': '#F59E0B',
        'grabit-danger': '#EF4444',
        'grabit-success': '#10B981',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
    },
  },
};
```

### Database

- **Migrations**: Create migrations for schema changes, never modify existing ones
- Use `up()` and `down()` methods for rollback support
- Index foreign keys and frequently queried columns
- Use `softDeletes()` where appropriate
- Use factories for test data
- Add database comments for complex tables
- Use appropriate column types

**Migration Example**:
```php
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('vendor_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->foreignId('category_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->decimal('price', 10, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->enum('status', ['draft', 'active', 'inactive'])->default('draft');
            $table->boolean('is_featured')->default(false);
            $table->timestamp('featured_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['vendor_id', 'status']);
            $table->index(['category_id', 'status']);
            $table->index('created_at');
            $table->fullText(['title', 'description']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

## Testing

### Testing Philosophy
- **Unit Tests**: Test individual classes/methods in isolation
- **Feature Tests**: Test HTTP requests and complete workflows
- **Integration Tests**: Test components working together
- **E2E Tests**: Test complete user journeys

### Backend Tests

**Test Structure**:
```php
<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_vendor_can_create_product(): void
    {
        $vendor = User::factory()->vendor()->create();

        $response = $this->actingAs($vendor)->post(route('vendor.products.store'), [
            'title' => 'Test Product',
            'description' => 'Test description',
            'price' => 99.99,
            'stock' => 10,
            'category_id' => Category::factory()->create()->id,
        ]);

        $response->assertRedirect();
        
        $this->assertDatabaseHas('products', [
            'title' => 'Test Product',
            'vendor_id' => $vendor->vendor->id,
        ]);
    }

    public function test_customer_cannot_create_product(): void
    {
        $customer = User::factory()->create();

        $response = $this->actingAs($customer)->post(route('vendor.products.store'), [
            'title' => 'Test Product',
            'price' => 99.99,
        ]);

        $response->assertForbidden();
    }

    public function test_validates_required_fields(): void
    {
        $vendor = User::factory()->vendor()->create();

        $response = $this->actingAs($vendor)->post(route('vendor.products.store'), []);

        $response->assertSessionHasErrors(['title', 'price']);
    }
}
```

**Unit Test Example**:
```php
<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\CommissionService;
use App\Models\OrderItem;

class CommissionServiceTest extends TestCase
{
    public function test_calculates_commission_correctly(): void
    {
        $service = app(CommissionService::class);
        
        $orderItem = OrderItem::factory()->make([
            'total' => 100,
            'commission_rate' => 10,
        ]);

        $commission = $service->calculateCommission($orderItem);

        $this->assertEquals(10, $commission->platform_amount);
        $this->assertEquals(90, $commission->vendor_amount);
    }

    public function test_uses_vendor_specific_commission_rate(): void
    {
        $service = app(CommissionService::class);
        
        $vendor = Vendor::factory()->create(['commission_rate' => 15]);
        $product = Product::factory()->create(['vendor_id' => $vendor->id]);
        
        $orderItem = OrderItem::factory()->make([
            'product_id' => $product->id,
            'total' => 100,
        ]);

        $commission = $service->calculateCommission($orderItem);

        $this->assertEquals(15, $commission->platform_amount);
        $this->assertEquals(85, $commission->vendor_amount);
        $this->assertEquals(15, $commission->commission_rate);
    }
}
```

### Frontend Tests

**E2E Testing with Cypress**:
```javascript
// cypress/e2e/checkout.cy.js
describe('Checkout Flow', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('completes checkout successfully', () => {
    // Add product to cart
    cy.contains('Add to Cart').first().click();
    cy.contains('Added to cart').should('be.visible');

    // Go to cart
    cy.get('[data-testid="cart-icon"]').click();
    cy.url().should('include', '/cart');

    // Proceed to checkout
    cy.contains('Proceed to Checkout').click();
    cy.url().should('include', '/checkout');

    // Fill shipping information
    cy.get('input[name="address"]').type('123 Test St');
    cy.get('input[name="city"]').type('Test City');
    cy.get('input[name="zip"]').type('12345');

    // Select payment method
    cy.get('input[value="stripe"]').check();

    // Complete order
    cy.contains('Place Order').click();

    // Verify success
    cy.contains('Order placed successfully').should('be.visible');
    cy.url().should('include', '/orders');
  });
});
```

## Important Notes

### COD Implementation

The COD (Cash on Delivery) system is a core feature:
- Comprehensive order workflow with status transitions
- Delivery person assignment and tracking
- Daily reconciliation reports for cash collections
- Collection verification and discrepancy handling
- Integration with order fulfillment pipeline

**Key Files**:
- `app/Services/CodService.php`
- `app/Services/CodOrderWorkflow.php`
- `app/Services/CodReconciliationService.php`
- `app/Events/Cod*.php`
- `app/Listeners/Cod*.php`

### Multi-Vendor Order Handling

Orders containing items from multiple vendors:
- Each `order_item` has its own `vendor_id` and `status`
- Vendors only see and manage their own items
- Items can be shipped independently by each vendor
- Order status aggregates all item statuses
- Commission calculated per item, not per order
- Separate shipments per vendor

### Settings System

Dynamic platform settings:
- Stored in `settings` table, grouped by category
- Cached for performance (Redis)
- Access via `settings('key.name', $default)` helper
- Admin UI for management
- Cache invalidation on update
- Type casting supported (bool, int, array, json)

**Setting Groups**:
- `general`: Site name, logo, description
- `payment`: Payment gateway credentials
- `shipping`: Default rates, zones
- `email`: SMTP configuration
- `vendor`: Commission rates, policies
- `tax`: Tax rates, rules

### Media Handling

Using Spatie Media Library:
- Product images with automatic thumbnails
- Vendor logos and documents
- Review images
- Multiple image support per product
- Responsive images with conversions
- S3/Local storage support

**Media Collections**:
- `images`: Product images
- `logo`: Vendor logo
- `documents`: Vendor KYC documents
- `reviews`: Review images

### Activity Logging

Comprehensive audit trail:
- User actions logged to `activity_logs` table
- Tracks who did what, when
- Polymorphic relations to any model
- Additional metadata as JSON
- Used for compliance and debugging
- Retention policy configurable

**Logged Activities**:
- Product CRUD operations
- Order status changes
- Payment transactions
- Vendor approvals
- Settings changes
- User login/logout

## Common Development Patterns

### Creating a New Feature

1. **Plan the Architecture**:
   - Define models and relationships
   - Plan database schema with indexes
   - Identify business logic for services
   - Design API/routes structure
   - Plan authorization requirements

2. **Database Layer**:
   - Create migration with proper indexes
   - Define model with relationships, casts, accessors
   - Create factory for testing
   - Add seeders if needed

3. **Business Logic**:
   - Create service class for domain logic
   - Implement methods with type hints
   - Use database transactions
   - Add logging for important actions
   - Handle errors gracefully

4. **Controllers**:
   - Create thin controller methods
   - Use form requests for validation
   - Delegate to services
   - Return Inertia responses

5. **Routes & Authorization**:
   - Add routes with appropriate middleware
   - Create policy for authorization
   - Register policy in `AuthServiceProvider`

6. **Frontend**:
   - Create TypeScript interfaces
   - Build React components
   - Implement forms with Inertia
   - Add loading states
   - Handle errors

7. **Testing**:
   - Write feature tests for workflows
   - Write unit tests for services
   - Test authorization
   - Test validation rules

8. **Documentation**:
   - Update CLAUDE.md if needed
   - Add inline comments for complex logic
   - Update API documentation

### Adding a New Admin Page

1. Create controller: `app/Http/Controllers/Admin/ResourceController.php`
2. Add routes in admin group with `role:admin` middleware
3. Create Inertia page: `resources/js/Pages/Admin/Resource/Index.tsx`
4. Use `AdminLayout` as layout
5. Add navigation link in `AdminLayout.tsx`
6. Implement CRUD operations
7. Add authorization via policy
8. Write tests

### Adding a New Vendor Page

1. Create controller: `app/Http/Controllers/Vendor/ResourceController.php`
2. Add routes with `role:vendor` and vendor status middleware
3. Create page: `resources/js/Pages/Vendor/Resource/Index.tsx`
4. Use `VendorLayout`
5. Ensure vendor ownership checks in policy
6. Test with different vendor accounts

### Working with Events & Listeners

1. Create event: `php artisan make:event OrderShipped`
2. Define event properties (make them readonly)
3. Create listener: `php artisan make:listener SendShipmentEmail --event=OrderShipped`
4. Implement listener logic
5. Queue listener if long-running: `implements ShouldQueue`
6. Register in `EventServiceProvider` or use auto-discovery
7. Dispatch: `event(new OrderShipped($order))`
8. Test event dispatching and listener execution

### Implementing a New Payment Gateway

1. Create payment service: `app/Services/Payments/NewGatewayService.php`
2. Implement standard interface methods
3. Add configuration to `config/services.php`
4. Store credentials in `.env`
5. Update `PaymentService` to support new gateway
6. Add UI in checkout for selection
7. Create webhook controller for callbacks
8. Test with sandbox/test mode
9. Add logging for all transactions
10. Implement refund functionality

### Adding Background Jobs

1. Create job: `php artisan make:job ProcessSomething`
2. Implement `handle()` method with business logic
3. Set retry strategy (`$tries`, `$backoff`, `$timeout`)
4. Implement `failed()` method for error handling
5. Dispatch job: `ProcessSomething::dispatch($data)`
6. Test job execution
7. Monitor with Horizon
8. Set appropriate queue name

## Deployment & DevOps

### Environment Setup

**Required Environment Variables**:
```env
APP_NAME=GrabIt
APP_ENV=production
APP_KEY=base64:...
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=your_database
DB_USERNAME=your_username
DB_PASSWORD=your_password

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@yourdomain.com
MAIL_FROM_NAME="${APP_NAME}"

STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...

MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
AWS_USE_PATH_STYLE_ENDPOINT=false

SENTRY_LARAVEL_DSN=https://...@sentry.io/...
```

### Deployment Checklist

- [ ] Run `composer install --optimize-autoloader --no-dev`
- [ ] Run `npm run build`
- [ ] Run `php artisan migrate --force`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`
- [ ] Run `php artisan view:cache`
- [ ] Run `php artisan event:cache`
- [ ] Set up supervisor for queue workers
- [ ] Configure cron for Laravel scheduler
- [ ] Set up SSL certificate (Let's Encrypt)
- [ ] Configure firewall rules
- [ ] Set up database backups
- [ ] Configure log rotation
- [ ] Test all critical workflows
- [ ] Monitor error logs with Sentry
- [ ] Set up uptime monitoring
- [ ] Configure CDN for static assets
- [ ] Enable OPcache for PHP
- [ ] Optimize database queries
- [ ] Test payment gateway in production mode

### Supervisor Configuration

```ini
[program:grabit-queue-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=8
redirect_stderr=true
stdout_logfile=/path/to/logs/worker.log
stopwaitsecs=3600

[program:grabit-horizon]
process_name=%(program_name)s
command=php /path/to/artisan horizon
autostart=true
autorestart=true
user=www-data
redirect_stderr=true
stdout_logfile=/path/to/logs/horizon.log
stopwaitsecs=3600
```

### Cron Configuration

```bash
* * * * * cd /path/to/project && php artisan schedule:run >> /dev/null 2>&1
```

### Performance Optimization

**Laravel Optimizations**:
- Use `php artisan optimize` before deployment
- Enable OPcache in production
- Use Redis for cache and sessions
- Implement database query caching
- Use eager loading to prevent N+1 queries
- Implement route caching
- Use chunking for large datasets
- Implement pagination everywhere

**Frontend Optimizations**:
- Code splitting with React.lazy()
- Image optimization (WebP format)
- Lazy loading for images
- Minimize bundle size
- Use CDN for static assets
- Implement service workers for PWA
- Compress assets with Brotli/Gzip

**Database Optimizations**:
- Add proper indexes
- Use explain to analyze slow queries
- Implement database connection pooling
- Regular database maintenance
- Archive old data
- Optimize table structure
- Use read replicas for heavy reads

### Monitoring & Logging

**Application Monitoring**:
- **Sentry**: Error tracking and performance monitoring
- **Laravel Telescope**: Development debugging
- **Laravel Horizon**: Queue monitoring
- **New Relic/DataDog**: APM monitoring

**Log Management**:
- Use structured logging with context
- Implement log levels appropriately
- Set up log aggregation (ELK stack)
- Configure log rotation
- Monitor disk space for logs

**Metrics to Track**:
- Response times (p50, p95, p99)
- Error rates by endpoint
- Queue processing times
- Database query performance
- Memory usage
- CPU usage
- Disk I/O
- Cache hit rates
- User activity metrics
- Business metrics (orders, revenue)

### Security Best Practices

**Application Security**:
- Keep Laravel and dependencies updated
- Use strong passwords for all accounts
- Implement 2FA for admin accounts
- Regular security audits
- Sanitize all user inputs
- Implement rate limiting
- Use HTTPS everywhere
- Set security headers (CSP, HSTS)
- Regular penetration testing
- Implement CAPTCHA for forms

**Database Security**:
- Use least privilege principle
- Regular backups with encryption
- Secure database credentials
- Disable remote root access
- Regular security patches
- Monitor for suspicious activity

**Server Security**:
- Keep OS and software updated
- Configure firewall properly
- Disable unnecessary services
- Use SSH keys instead of passwords
- Regular security scans
- Implement intrusion detection
- Regular backups

## Troubleshooting Guide

### Common Issues

**N+1 Query Problem**:
```php
// ❌ Bad: N+1 queries
$products = Product::all();
foreach ($products as $product) {
    echo $product->vendor->name; // Triggers a query for each product
}

// ✅ Good: Eager loading
$products = Product::with('vendor')->get();
foreach ($products as $product) {
    echo $product->vendor->name; // No additional queries
}
```

**Memory Limit Issues**:
```php
// ❌ Bad: Loading everything into memory
$orders = Order::all();

// ✅ Good: Use chunking
Order::chunk(100, function ($orders) {
    foreach ($orders as $order) {
        // Process order
    }
});

// ✅ Better: Use lazy collections
Order::lazy()->each(function ($order) {
    // Process order
});
```

**Race Conditions**:
```php
// ❌ Bad: Race condition possible
$product = Product::find($id);
if ($product->stock > 0) {
    $product->decrement('stock');
}

// ✅ Good: Atomic operation
Product::where('id', $id)
    ->where('stock', '>', 0)
    ->decrement('stock');

// ✅ Better: Use database locks
DB::transaction(function () use ($id) {
    $product = Product::where('id', $id)->lockForUpdate()->first();
    if ($product->stock > 0) {
        $product->decrement('stock');
    }
});
```

**Slow Queries**:
- Use `DB::enableQueryLog()` to identify slow queries
- Use Laravel Telescope to monitor queries
- Add indexes to frequently queried columns
- Use `explain` to analyze query execution plans
- Consider denormalization for read-heavy tables
- Implement caching for expensive queries

**Queue Failing**:
- Check queue worker is running
- Check Redis connection
- Review job failure logs
- Implement proper error handling in jobs
- Use `failed_jobs` table to track failures
- Implement retry logic with backoff

**Memory Leaks**:
- Avoid circular references
- Unset large variables when done
- Use chunking for large datasets
- Monitor memory usage in jobs
- Use `gc_collect_cycles()` if needed

### Debugging Tips

**Enable Debug Mode** (Development Only):
```env
APP_DEBUG=true
```

**Use Laravel Telescope**:
```bash
php artisan telescope:install
php artisan migrate
```

**Use Tinker for Quick Tests**:
```bash
php artisan tinker
>>> $product = Product::find(1);
>>> $product->vendor->name;
```

**Check Logs**:
```bash
tail -f storage/logs/laravel.log
```

**Database Query Logging**:
```php
DB::enableQueryLog();
// Run your code
dd(DB::getQueryLog());
```

**Profile Performance**:
```php
$start = microtime(true);
// Your code here
$end = microtime(true);
Log::info('Execution time: ' . ($end - $start));
```

## API Documentation (If Applicable)

### API Authentication

**Token-Based Authentication**:
```bash
POST /api/login
{
  "email": "user@example.com",
  "password": "password"
}

Response:
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {...}
}

# Use token in subsequent requests
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### API Endpoints

**Products**:
- `GET /api/products` - List all products
- `GET /api/products/{id}` - Get product details
- `POST /api/products` - Create product (vendor only)
- `PUT /api/products/{id}` - Update product (vendor only)
- `DELETE /api/products/{id}` - Delete product (vendor only)

**Orders**:
- `GET /api/orders` - List user's orders
- `GET /api/orders/{id}` - Get order details
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/cancel` - Cancel order

**Cart**:
- `GET /api/cart` - Get cart contents
- `POST /api/cart/add` - Add item to cart
- `PUT /api/cart/update` - Update cart item
- `DELETE /api/cart/remove/{id}` - Remove cart item

### API Rate Limiting

- Public endpoints: 60 requests/minute
- Authenticated endpoints: 120 requests/minute
- Admin endpoints: 240 requests/minute

## Best Practices Summary

### Do's ✅

- **Always** use type hints and return types
- **Always** validate user input with Form Requests
- **Always** use database transactions for multi-step operations
- **Always** eager load relationships to avoid N+1
- **Always** implement proper error handling
- **Always** log important actions and errors
- **Always** write tests for critical functionality
- **Always** use services for business logic
- **Always** implement authorization with policies
- **Always** cache expensive operations
- **Always** use queues for long-running tasks
- **Always** sanitize user output to prevent XSS
- **Always** use prepared statements (Eloquent handles this)
- **Always** implement rate limiting on sensitive endpoints

### Don'ts ❌

- **Never** put business logic in controllers
- **Never** trust user input without validation
- **Never** modify existing migrations
- **Never** use `DB::raw()` with user input
- **Never** log sensitive information (passwords, tokens)
- **Never** expose stack traces in production
- **Never** use `SELECT *` in production code
- **Never** hardcode configuration values
- **Never** skip authorization checks
- **Never** ignore security best practices
- **Never** commit `.env` file to version control
- **Never** use `dd()` or `dump()` in production
- **Never** ignore failing tests
- **Never** deploy without testing

## Code Examples Library

### Service Pattern Example

```php
<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Events\OrderCreated;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class OrderService
{
    public function __construct(
        private CartService $cartService,
        private InventoryService $inventoryService,
        private CommissionService $commissionService
    ) {}

    public function createFromCart(User $user, array $shippingData, string $paymentMethod): Order
    {
        return DB::transaction(function () use ($user, $shippingData, $paymentMethod) {
            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'order_number' => $this->generateOrderNumber(),
                'status' => 'pending',
                'payment_method' => $paymentMethod,
                'payment_status' => 'unpaid',
                'shipping_address' => $shippingData['address'],
                'shipping_city' => $shippingData['city'],
                'shipping_zip' => $shippingData['zip'],
                'subtotal' => 0,
                'shipping_cost' => 0,
                'tax' => 0,
                'total' => 0,
            ]);

            // Get cart items
            $cartItems = $this->cartService->getCartItems($user);
            
            $subtotal = 0;

            // Create order items
            foreach ($cartItems as $cartItem) {
                $product = $cartItem->product;
                
                // Check stock
                if (!$this->inventoryService->hasStock($product, $cartItem->quantity)) {
                    throw new \Exception("Product {$product->title} is out of stock");
                }

                // Create order item
                $orderItem = OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'vendor_id' => $product->vendor_id,
                    'quantity' => $cartItem->quantity,
                    'price' => $product->price,
                    'total' => $product->price * $cartItem->quantity,
                    'status' => 'pending',
                ]);

                // Decrease stock
                $this->inventoryService->decreaseStock($product, $cartItem->quantity);

                $subtotal += $orderItem->total;
            }

            // Calculate totals
            $shippingCost = $this->calculateShippingCost($order);
            $tax = $this->calculateTax($subtotal);
            $total = $subtotal + $shippingCost + $tax;

            // Update order totals
            $order->update([
                'subtotal' => $subtotal,
                'shipping_cost' => $shippingCost,
                'tax' => $tax,
                'total' => $total,
            ]);

            // Clear cart
            $this->cartService->clearCart($user);

            // Dispatch event
            event(new OrderCreated($order));

            // Log activity
            Log::info('Order created', [
                'order_id' => $order->id,
                'user_id' => $user->id,
                'total' => $total,
            ]);

            return $order->load(['items.product', 'user']);
        });
    }

    private function generateOrderNumber(): string
    {
        return 'ORD-' . strtoupper(uniqid());
    }

    private function calculateShippingCost(Order $order): float
    {
        // Implement shipping calculation logic
        return 10.00;
    }

    private function calculateTax(float $amount): float
    {
        $taxRate = config('app.tax_rate', 0.08);
        return round($amount * $taxRate, 2);
    }
}
```

### Form Request Validation Example

```php
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->hasRole('vendor') 
            && $this->user()->vendor?->status === 'approved';
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string'],
            'price' => ['required', 'numeric', 'min:0.01', 'max:999999.99'],
            'stock' => ['required', 'integer', 'min:0'],
            'category_id' => ['required', 'exists:categories,id'],
            'images.*' => ['required', 'image', 'max:2048'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['exists:tags,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'title.required' => 'Product title is required',
            'price.min' => 'Price must be at least $0.01',
            'images.*.max' => 'Each image must not exceed 2MB',
        ];
    }
}
```

### Repository Pattern Example

```php
<?php

namespace App\Repositories;

use App\Models\Order;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class OrderRepository
{
    public function findByUser(int $userId, int $perPage = 15): LengthAwarePaginator
    {
        return Order::where('user_id', $userId)
            ->with(['items.product', 'items.vendor'])
            ->latest()
            ->paginate($perPage);
    }

    public function findByVendor(int $vendorId, array $filters = []): LengthAwarePaginator
    {
        $query = Order::query()
            ->whereHas('items', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId);
            })
            ->with([
                'items' => fn($q) => $q->where('vendor_id', $vendorId),
                'items.product',
                'user',
            ]);

        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (isset($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    public function getRevenueByVendor(int $vendorId, string $period = 'month'): float
    {
        $dateColumn = match($period) {
            'day' => now()->startOfDay(),
            'week' => now()->startOfWeek(),
            'month' => now()->startOfMonth(),
            'year' => now()->startOfYear(),
            default => now()->startOfMonth(),
        };

        return Order::query()
            ->whereHas('items', function ($q) use ($vendorId) {
                $q->where('vendor_id', $vendorId)
                  ->where('status', 'delivered');
            })
            ->where('created_at', '>=', $dateColumn)
            ->sum('total');
    }
}
```

## Final Notes

This is a comprehensive, production-ready e-commerce platform. When working on this project:

1. **Think Before Coding**: Plan your approach, consider edge cases, think about scalability
2. **Write Clean Code**: Self-documenting, properly formatted, well-organized
3. **Test Thoroughly**: Unit tests, feature tests, manual testing in different scenarios
4. **Document Changes**: Update CLAUDE.md, add comments, update README
5. **Security First**: Always validate, sanitize, authorize, and log
6. **Performance Matters**: Optimize queries, cache when appropriate, use queues
7. **User Experience**: Loading states, error messages, smooth interactions
8. **Maintainability**: Code that future you (or others) can understand and modify

**Remember**: You're building a platform that real businesses will depend on. Quality, security, and reliability are paramount.

For specific implementation guidance on major features, refer to `DEVELOPMENT_PROMPTS_GUIDE.md`.

## Additional Resources

- **Laravel Documentation**: https://laravel.com/docs
- **Inertia.js Documentation**: https://inertiajs.com
- **React Documentation**: https://react.dev
- **TypeScript Handbook**: https://www.typescriptlang.org/docs
- **Tailwind CSS**: https://tailwindcss.com
- **Spatie Packages**: https://spatie.be/docs
- **Laravel Best Practices**: https://github.com/alexeymezenin/laravel-best-practices

---

**Last Updated**: January 2026
**Version**: 2.0
**Maintainer**: Development Team