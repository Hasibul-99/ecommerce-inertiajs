# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **multi-vendor e-commerce platform** built with Laravel 10+ and React/TypeScript using Inertia.js. The platform supports multiple vendors selling products with commission-based earnings, COD (Cash on Delivery) workflows, comprehensive order management, and detailed analytics for admin and vendors.

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

## Development Commands

### Laravel/Backend
```bash
# Install dependencies
composer install

# Run migrations
php artisan migrate

# Seed database (if needed)
php artisan db:seed

# Clear caches
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Generate application key
php artisan key:generate

# Run tests
php artisan test
./vendor/bin/phpunit

# Run specific test
php artisan test --filter=TestName
./vendor/bin/phpunit tests/Feature/YourTest.php

# Queue workers (for background jobs)
php artisan queue:work
php artisan queue:listen

# Run scheduler (for cron jobs)
php artisan schedule:work

# Generate IDE helper (if installed)
php artisan ide-helper:generate
php artisan ide-helper:models
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
```

### Custom Artisan Commands
```bash
# COD reconciliation
php artisan cod:generate-daily-report

# Process vendor payouts (scheduled)
php artisan vendor:process-payouts

# Update shipment tracking
php artisan shipments:update-tracking
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

### Service Layer Pattern

Business logic is centralized in service classes (`app/Services/`):

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

**Always use services for business logic, not controllers.**

### Database Schema Highlights

**Core Tables**:
- `users`: Authentication with role-based permissions
- `vendors`: Vendor profiles with commission rates, status, onboarding data
- `products`: Product catalog with vendor relationship, variants, attributes, tags
- `product_variants`: Size/color variants with separate pricing/stock
- `categories`: Hierarchical category tree
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

### Event-Driven Architecture

Key events are dispatched for order workflow, notifications, and analytics:

**Order Events**:
- `OrderCreated`, `OrderStatusChanged`, `OrderShipped`, `OrderDelivered`, `OrderCancelled`

**COD Events**:
- `CodOrderConfirmed`, `CodOrderOutForDelivery`, `CodPaymentCollected`, `CodDeliveryFailed`

**Vendor Events**:
- `VendorApplicationSubmitted`, `VendorApplicationApproved`, `VendorApplicationRejected`
- `VendorPayoutProcessed`

**Review Events**:
- `ReviewCreated`, `ReviewApproved`, `VendorRespondedToReview`

Listeners are in `app/Listeners/` and handle notifications, emails, analytics tracking.

### Frontend Architecture (Inertia.js)

**Page Structure** (`resources/js/Pages/`):
- `Welcome.tsx`: Homepage with featured products
- `Products.tsx`: Product listing with filters
- `Product/Detail.tsx`: Single product page
- `Cart/`, `Checkout/`: Shopping cart and checkout flow
- `Orders/`: Customer order history and tracking
- `Admin/*`: Admin dashboard, users, products, orders, vendors, settings, reports
- `Vendor/*`: Vendor dashboard, products, orders, earnings, analytics
- `Customer/*`: Customer dashboard, addresses, order tracking

**Layout Components** (`resources/js/Layouts/`):
- `AppLayout.tsx`: Main customer layout with header/footer
- `AdminLayout.tsx`: Admin dashboard layout with sidebar
- `VendorLayout.tsx`: Vendor dashboard layout
- `AuthLayout.tsx`: Authentication pages layout

**Reusable Components** (`resources/js/Components/`):
- `ui/*`: Radix UI-based components (Button, Dialog, Select, etc.)
- `Core/*`: Core UI components (Input, Textarea, Dropdown, etc.)
- `Frontend/*`: Customer-facing components (ProductCard, CategoryCard, etc.)
- `Charts/*`: Chart components using Chart.js
- `Search/*`: Search bar with autocomplete
- `Reviews/*`: Review display and submission forms
- `Settings/*`: Settings form inputs
- `NotificationBell.tsx`: In-app notification dropdown

**Inertia.js Patterns**:
- Use `router.visit()` for navigation with preserved state
- Use `router.reload()` for partial reloads (specific props only)
- Form submissions use `useForm()` hook from Inertia
- Always handle loading states during form submissions
- Server-side rendered (SSR) is configured via `ssr.tsx`

### Permissions & Authorization

**Roles**: Managed by Spatie Laravel Permission
- `super-admin`: Full access
- `admin`: Administrative access
- `vendor`: Vendor portal access
- `customer`: Basic customer access (default)

**Policies** (`app/Policies/`):
- `ProductPolicy`: Check vendor ownership before CRUD operations
- `OrderPolicy`: Ensure users only access their own orders
- `VendorPolicy`: Admin approval and status management
- Additional policies for other resources

**Middleware**:
- `role:admin|super-admin`: Admin area protection
- `role:vendor`: Vendor area protection
- Check vendor status (approved) before allowing vendor operations

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

### Commission & Payout System

**Commission Calculation**:
- Commission is calculated per `order_item` (not per order)
- Each vendor has a `commission_rate` (default from settings)
- Commission is created when order item is marked as delivered
- Stored in `commissions` table with `platform_amount` and `vendor_amount`

**Payout Flow**:
1. Vendor requests payout when balance > minimum threshold
2. Payout created with `status=pending`
3. Admin processes payout (bank transfer or manual)
4. Payout marked as `status=paid` with transaction details
5. Automatic payouts can be scheduled (weekly/monthly)

**Balance Types**:
- **Available Balance**: Delivered orders, ready for payout
- **Pending Balance**: Orders not yet delivered
- **Withheld Balance**: Refund reserve (configurable percentage)

### Search & Filtering

**Laravel Scout Configuration**:
- Driver: Meilisearch (configured in `config/scout.php`)
- Searchable model: `Product` with `toSearchableArray()` method
- Indexed fields: title, description, category, vendor, tags, attributes

**Advanced Filters**:
- Category (single/multiple)
- Price range (min/max slider)
- Rating (4+, 3+, etc.)
- Vendor
- Attributes (dynamic based on product attributes)
- In stock only
- Sort by: newest, price, popularity, rating

**Search Features**:
- Autocomplete suggestions
- Popular searches tracking
- Recently viewed products
- Search analytics

### Email & Notifications

**Email Templates** (`email_templates` table):
- Customizable with variables: `{{order.number}}`, `{{user.name}}`, etc.
- Templates for: order placed/confirmed/shipped/delivered, vendor notifications, password reset, welcome email, vendor approval/rejection

**Notification Channels**:
- Email (via Laravel Mail)
- Database (in-app notifications via `notifications` table)
- SMS (basic support, extensible)

**Notification Preferences**:
- Per-user settings in `notification_settings` table
- Users can toggle email/SMS/in-app per notification type

## Coding Conventions

### Laravel/PHP

- Follow **PSR-12** coding standards
- Use **type hints** for all method parameters and return types
- Keep controllers thin - delegate to services
- Use **resource controllers** for CRUD operations
- Form requests for validation (`app/Http/Requests/`)
- Use **Eloquent relationships** instead of manual joins
- **Eager load** relationships to avoid N+1 queries
- Use database transactions for multi-step operations
- Log important actions to `activity_logs` table

### React/TypeScript

- Use **functional components** with hooks (no class components)
- Define **TypeScript interfaces** for all props and API responses (`resources/js/types/`)
- Use Inertia's `useForm()` for form handling
- Handle loading states explicitly during async operations
- Use `router.visit()` for navigation, not `<a>` tags for internal routes
- Reuse components from `resources/js/Components/`
- Follow existing component structure and naming conventions

### Styling

- Use **Tailwind utility classes** for styling
- Custom theme colors are prefixed with `grabit-*` (e.g., `grabit-primary`, `grabit-secondary`)
- Responsive design: mobile-first approach with `sm:`, `md:`, `lg:` breakpoints
- Avoid inline styles - use Tailwind classes
- For complex components, use `clsx` or `cn()` utility for conditional classes

### Database

- **Migrations**: Always create migrations for schema changes, never modify existing migrations
- Use `up()` and `down()` methods properly for rollback support
- Add indexes for foreign keys and frequently queried columns
- Use `softDeletes()` for soft deletion where appropriate
- Seeders for development data in `database/seeders/`

## Testing

### Backend Tests

- **Feature Tests**: Test complete workflows (checkout, order creation, vendor registration)
- **Unit Tests**: Test services and models in isolation
- Use factories for test data (`database/factories/`)
- Mock external services (Stripe, shipping APIs)
- Run tests with `php artisan test` or `./vendor/bin/phpunit`

### Frontend Tests

- E2E tests with Cypress in `cypress/e2e/`
- Basic test exists at `cypress/e2e/checkout.cy.js`
- Run with `npx cypress open` (interactive) or `npx cypress run` (headless)

## Important Notes

### COD Implementation

The COD (Cash on Delivery) system is a major feature with:
- Order workflow with status transitions
- Delivery person assignment
- Daily reconciliation reports
- Collection verification
- See `CodService`, `CodOrderWorkflow`, `CodReconciliationService` for implementation details

### Multi-Vendor Order Handling

When an order contains items from multiple vendors:
- Each `order_item` has a `vendor_id`
- Each vendor sees only their items in the order
- Vendors can ship their items independently
- Order status is aggregate of all items' statuses
- Commission is calculated per item, not per order

### Settings System

Dynamic settings are stored in `settings` table and cached for performance:
- Access via `settings('key.name', $default)` helper function
- Groups: general, payment, shipping, email, vendor, tax
- Admin can update via Settings UI
- Cache is automatically cleared on update

### Media Handling

Using Spatie Media Library for file uploads:
- Product images, vendor logos, review images
- Automatic thumbnail generation
- Media is associated with models via `media` relationship
- Use `addMedia()` and `getMedia()` methods

### Activity Logging

Important actions are logged to `activity_logs` table:
- User who performed action
- Action type (created, updated, deleted, etc.)
- Related model (polymorphic)
- Additional metadata as JSON
- Used for audit trail and analytics

## Common Development Patterns

### Creating a New Feature

1. **Migration**: Create database schema changes
2. **Model**: Define model with relationships
3. **Service**: Implement business logic in service class
4. **Controller**: Create thin controller that calls service
5. **Routes**: Add routes to `routes/web.php`
6. **Policy**: Create authorization policy if needed
7. **Frontend**: Create React page/components
8. **Tests**: Write feature and unit tests

### Adding a New Admin Page

1. Create controller in `app/Http/Controllers/Admin/`
2. Add routes in admin group in `routes/web.php`
3. Create page in `resources/js/Pages/Admin/`
4. Use `AdminLayout` as parent layout
5. Add navigation link in `AdminLayout.tsx` sidebar

### Adding a New Vendor Page

1. Create controller in `app/Http/Controllers/Vendor/`
2. Add routes in vendor group with `role:vendor` middleware
3. Create page in `resources/js/Pages/Vendor/`
4. Use `VendorLayout` as parent layout
5. Ensure vendor ownership checks in controller/policy

### Working with Events

1. Create event in `app/Events/`
2. Create listener in `app/Listeners/`
3. Register in `EventServiceProvider` or use auto-discovery
4. Dispatch event in service/controller: `event(new YourEvent($data))`
5. Queue listeners for long-running tasks using `ShouldQueue`

## Reference Documentation

For more detailed development guidance, see:
- [DEVELOPMENT_PROMPTS_GUIDE.md](DEVELOPMENT_PROMPTS_GUIDE.md): Comprehensive prompts for implementing major features
- Laravel Documentation: https://laravel.com/docs
- Inertia.js Documentation: https://inertiajs.com
- React Documentation: https://react.dev
- Tailwind CSS: https://tailwindcss.com