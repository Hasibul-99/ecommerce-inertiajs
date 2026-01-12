# Multi-Vendor E-commerce Application Development Prompts Guide

## 📋 Project Analysis Summary

**Tech Stack:**
- Backend: Laravel 10+ (PHP 8.x)
- Frontend: React + TypeScript + Inertia.js
- UI: Tailwind CSS with custom theming (grabit-* classes)
- Database: MySQL/PostgreSQL with Eloquent ORM
- Payment: Stripe (with COD support)
- Search: Laravel Scout
- Media: Spatie Media Library

**Existing Features:**
✅ User Authentication (Registration, Login, Email Verification)
✅ Role-based Access Control (Admin, Vendor, Customer)
✅ Product Management with Variants
✅ Category & Tag Management
✅ Shopping Cart with Session Support
✅ Wishlist
✅ Basic Checkout (Stripe, PayPal, Bank Transfer, COD)
✅ Order Management
✅ Vendor Dashboard (Basic)
✅ Admin Dashboard (Basic)
✅ Commission System
✅ Inventory Reservation System
✅ Email Notifications
✅ Activity Logging
✅ Reviews System

**Missing/Incomplete Features:**
❌ Complete Vendor Order Management
❌ Vendor Product CRUD
❌ Vendor Payout System
❌ Enhanced COD Workflow
❌ Shipping Management
❌ Reports & Analytics
❌ Customer Address Book
❌ Notifications System (In-app)
❌ Search & Filtering (Advanced)
❌ Flash Sales/Deals
❌ Multi-language Support
❌ Settings Management

---

## 🚀 PHASE 1: Core COD (Cash on Delivery) Enhancement

### Prompt 1.1: Enhance COD Payment Flow
```
I'm building a multi-vendor e-commerce application in Laravel with Inertia.js and React/TypeScript. I need to enhance the Cash on Delivery (COD) payment system.

Current implementation: Basic COD option in checkout that marks orders as 'unpaid' with status 'pending'.

Please implement:

1. Create a new migration to add COD-specific fields to the orders table:
   - `cod_verification_required` (boolean, default true)
   - `cod_amount_collected` (integer, nullable) - in cents
   - `cod_collected_at` (timestamp, nullable)
   - `cod_collected_by` (foreign key to users, nullable)
   - `delivery_person_id` (foreign key to users, nullable)

2. Update the Order model with:
   - COD attribute accessors
   - `isCod()` helper method
   - `markCodCollected()` method
   - Relationship to delivery person

3. Create COD-specific validation in CheckoutController:
   - Validate phone number is required for COD
   - Add COD availability check based on:
     - Delivery location (some areas may not support COD)
     - Order amount limits (min/max for COD)
   - Calculate COD fee if applicable

4. Create a CodService class in app/Services:
   - `isAvailableForAddress(Address $address): bool`
   - `getCodFee(int $orderAmountCents): int`
   - `getMinOrderAmount(): int`
   - `getMaxOrderAmount(): int`
   - `validateCodOrder(Order $order): array`

5. Update the Checkout/Index.tsx to:
   - Show COD availability status
   - Display COD fee if applicable
   - Show delivery time estimate for COD orders
   - Add phone validation UI for COD

Please provide the complete implementation with proper error handling and following Laravel best practices.
```

### Prompt 1.2: COD Order Status Workflow
```
Continue with the multi-vendor e-commerce COD implementation. Now I need a complete COD order status workflow.

Current context: Orders have basic statuses (pending, processing, shipped, delivered, cancelled).

Please implement:

1. Create a CodOrderWorkflow class that manages the COD order lifecycle:
   - pending → confirmed (admin/vendor confirms order)
   - confirmed → processing (order is being prepared)
   - processing → out_for_delivery (with delivery person assigned)
   - out_for_delivery → delivered (COD collected)
   - Any status → cancelled (with reason)
   - delivered → completed (after COD verification period)

2. Create events for each status transition:
   - CodOrderConfirmed
   - CodOrderOutForDelivery
   - CodPaymentCollected
   - CodDeliveryFailed

3. Create listeners for each event:
   - Send SMS/notification to customer
   - Notify vendor of status change
   - Update inventory on confirmation
   - Handle failed delivery attempts

4. Update Admin/OrderController to add:
   - `assignDeliveryPerson(Request $request, Order $order)`
   - `markOutForDelivery(Order $order)`
   - `confirmCodCollection(Request $request, Order $order)`
   - `handleDeliveryFailure(Request $request, Order $order)`

5. Create/Update Admin/Orders/Show.tsx to display:
   - Current order status with timeline
   - COD collection status
   - Delivery person info (if assigned)
   - Action buttons based on current status
   - COD amount to be collected

Ensure all status transitions are logged in the activity log with the user who made the change.
```

### Prompt 1.3: COD Verification & Reconciliation
```
Continue with COD implementation. Now implement COD verification and daily reconciliation for the multi-vendor platform.

Please implement:

1. Create a CodReconciliation model with migration:
   - id, date, delivery_person_id
   - total_orders_count, total_cod_amount_cents
   - collected_amount_cents, discrepancy_cents
   - status (pending, verified, disputed)
   - verified_by, verified_at
   - notes, metadata (JSON)

2. Create CodReconciliationService:
   - `generateDailyReport(Carbon $date, ?User $deliveryPerson)`
   - `verifyCollection(CodReconciliation $reconciliation, int $actualAmount)`
   - `handleDiscrepancy(CodReconciliation $reconciliation, string $reason)`
   - `getDeliveryPersonSummary(User $deliveryPerson, Carbon $startDate, Carbon $endDate)`

3. Create Admin/CodReconciliationController:
   - index() - List all reconciliation records
   - show(CodReconciliation $reconciliation)
   - verify(Request $request, CodReconciliation $reconciliation)
   - dispute(Request $request, CodReconciliation $reconciliation)

4. Create the admin pages:
   - Admin/CodReconciliation/Index.tsx - List with filters (date range, delivery person, status)
   - Admin/CodReconciliation/Show.tsx - Detail view with verification form

5. Create an Artisan command `cod:generate-daily-report`:
   - Runs at end of day
   - Groups orders by delivery person
   - Generates reconciliation records
   - Sends summary notifications

6. Add routes in admin group for COD reconciliation

Include proper authorization checks and ensure vendors can only see COD reports for their products.
```

---

## 🏪 PHASE 2: Vendor Management Enhancement

### Prompt 2.1: Vendor Registration & Onboarding
```
I need to implement a complete vendor registration and onboarding flow for my multi-vendor e-commerce platform.

Current state: Basic vendor model exists with user relationship.

Please implement:

1. Create a VendorRegistrationController with:
   - showRegistrationForm() - Display multi-step registration form
   - storeStep1(Request $request) - Business information
   - storeStep2(Request $request) - Documents upload (business license, ID)
   - storeStep3(Request $request) - Bank/payout information
   - complete() - Final submission

2. Create migrations for vendor enhancements:
   - Add to vendors table: description, logo, banner, address fields, tax_id, bank details
   - Create vendor_documents table (id, vendor_id, type, file_path, status, reviewed_by, reviewed_at)
   - Create vendor_settings table (id, vendor_id, key, value)

3. Create VendorOnboardingService:
   - `validateBusinessInfo(array $data)`
   - `processDocuments(Vendor $vendor, array $files)`
   - `validateBankDetails(array $data)`
   - `calculateApprovalScore(Vendor $vendor)` - Basic approval criteria check
   - `submitForReview(Vendor $vendor)`

4. Create frontend pages:
   - Pages/Vendor/Register/Step1.tsx - Business info form
   - Pages/Vendor/Register/Step2.tsx - Document upload with preview
   - Pages/Vendor/Register/Step3.tsx - Bank details
   - Pages/Vendor/Register/Complete.tsx - Review & submit

5. Create admin vendor approval workflow:
   - Admin/Vendors/Applications.tsx - List pending applications
   - Enhanced Admin/Vendors/Show.tsx with:
     - Document review section
     - Approval/rejection with comments
     - Status history

6. Add email notifications:
   - VendorApplicationReceived (to admin)
   - VendorApplicationSubmitted (to vendor)
   - VendorApplicationApproved (to vendor)
   - VendorApplicationRejected (to vendor with reason)

Add proper validation, file handling with Spatie Media Library, and security checks.
```

### Prompt 2.2: Vendor Product Management
```
Implement complete vendor product management for the multi-vendor e-commerce platform.

Current context: Products model exists with vendor relationship. Admin has product CRUD.

Please implement:

1. Create Vendor/ProductController with:
   - index() - List vendor's products with filters
   - create() - Product creation form
   - store(ProductStoreRequest $request)
   - edit(Product $product)
   - update(ProductUpdateRequest $request, Product $product)
   - destroy(Product $product)
   - duplicate(Product $product)
   - toggleStatus(Product $product)
   - bulkAction(Request $request) - bulk delete, publish, unpublish

2. Create/Update form request classes:
   - VendorProductStoreRequest
   - VendorProductUpdateRequest
   - Both should validate vendor ownership

3. Create vendor product pages:
   - Pages/Vendor/Products/Index.tsx - DataTable with:
     - Search, filter by status/category
     - Bulk actions
     - Quick status toggle
     - Sales stats preview
   
   - Pages/Vendor/Products/Create.tsx - Multi-section form:
     - Basic info (title, description, category)
     - Pricing (base price, compare price, cost)
     - Inventory (SKU, stock, track inventory)
     - Media (images with drag-drop, videos)
     - Variants (size, color, etc.)
     - SEO (meta title, description, slug)
   
   - Pages/Vendor/Products/Edit.tsx - Same as create with pre-filled data

4. Create ProductVariant management within product form:
   - Add/remove variant options (size: S, M, L)
   - Auto-generate variant combinations
   - Set price/stock per variant
   - Variant images

5. Update ProductPolicy to check:
   - Vendor ownership
   - Vendor status (must be approved)
   - Product limits per vendor tier

6. Add vendor-specific routes in the vendor route group

Ensure all vendor product operations are logged in activity log.
```

### Prompt 2.3: Vendor Order Management
```
Implement vendor order management for the multi-vendor e-commerce platform.

Context: Orders can contain items from multiple vendors. Each vendor should only see their items.

Please implement:

1. Create Vendor/OrderController with:
   - index() - List orders containing vendor's products
   - show(Order $order) - Show order with only vendor's items
   - updateItemStatus(Request $request, OrderItem $orderItem)
   - addShipmentTracking(Request $request, Order $order)
   - exportOrders(Request $request) - CSV/Excel export

2. Create VendorOrderService:
   - `getVendorOrderItems(Vendor $vendor, Order $order): Collection`
   - `calculateVendorOrderTotal(Vendor $vendor, Order $order): int`
   - `updateVendorItemStatus(Vendor $vendor, OrderItem $item, string $status)`
   - `canVendorShip(Vendor $vendor, Order $order): bool`

3. Create vendor order pages:
   - Pages/Vendor/Orders/Index.tsx:
     - Order list with vendor-specific totals
     - Filter by status, date range, payment status
     - Search by order number, customer name
     - Quick actions (mark as processing, add tracking)
   
   - Pages/Vendor/Orders/Show.tsx:
     - Order details with ONLY vendor's items
     - Customer info (shipping address, phone)
     - Payment status indicator
     - Status update dropdown for each item
     - Shipping section with:
       - Carrier selection
       - Tracking number input
       - Estimated delivery date
     - Order notes/communication

4. Create order item status flow for vendors:
   - pending → confirmed → processing → ready_to_ship → shipped
   - Add shipped_at, tracking_number, carrier to order_items table

5. Create OrderItemStatus events and notifications:
   - Notify customer when vendor ships their items
   - Notify admin of status changes
   - Update overall order status when all items shipped

6. Add order packing slip generation:
   - Vendor-specific packing slip with their items only
   - PDF generation using TCPDF or similar

Add proper authorization to ensure vendors only access their orders.
```

### Prompt 2.4: Vendor Earnings & Payouts
```
Implement the vendor earnings and payout system for the multi-vendor e-commerce platform.

Current state: Commission model exists but payout system is incomplete.

Please implement:

1. Enhance the Payout model and create migration:
   - Add fields: period_start, period_end, items_count
   - Add payout_method (bank_transfer, manual, etc.)
   - Add payout_details (JSON - bank info, reference, etc.)
   - Add processing_fee_cents, net_amount_cents

2. Create VendorEarningService:
   - `calculateEarnings(Vendor $vendor, Carbon $from, Carbon $to): array`
   - `getAvailableBalance(Vendor $vendor): int`
   - `getPendingBalance(Vendor $vendor): int` - Orders not yet delivered
   - `getWithheldBalance(Vendor $vendor): int` - Refund reserve
   - `createPayoutRequest(Vendor $vendor, int $amountCents): Payout`
   - `processAutomaticPayout(Vendor $vendor)` - Weekly/monthly automatic

3. Create PayoutService:
   - `initiatePayout(Payout $payout)`
   - `processBankTransfer(Payout $payout)`
   - `markAsPaid(Payout $payout, array $transactionDetails)`
   - `cancelPayout(Payout $payout, string $reason)`

4. Create Vendor/EarningsController:
   - dashboard() - Earnings overview with charts
   - transactions() - List all earnings transactions
   - payouts() - List payout history
   - requestPayout(Request $request) - Manual payout request
   - payoutDetails(Payout $payout) - Single payout details

5. Create Admin/PayoutController:
   - index() - List all pending/completed payouts
   - show(Payout $payout)
   - process(Request $request, Payout $payout)
   - bulkProcess(Request $request) - Process multiple payouts

6. Create frontend pages:
   - Pages/Vendor/Earnings/Index.tsx:
     - Balance cards (available, pending, total)
     - Earnings chart (last 30 days, by month)
     - Recent transactions list
     - Request payout button (if balance > minimum)
   
   - Pages/Vendor/Earnings/Transactions.tsx:
     - Full transaction history with filters
     - Export functionality
   
   - Pages/Vendor/Earnings/Payouts.tsx:
     - Payout history
     - Payout status tracking

   - Pages/Admin/Payouts/Index.tsx:
     - Pending payouts queue
     - Bulk action processing
     - Payout statistics

7. Create scheduled command for automatic payouts:
   - `vendor:process-payouts` - Runs weekly/monthly
   - Generates payouts for eligible vendors
   - Sends notifications

Add proper accounting logic and ensure commission calculations are accurate.
```

---

## 🛒 PHASE 3: Customer Experience Enhancement

### Prompt 3.1: Customer Dashboard & Order Tracking
```
Enhance the customer dashboard and order tracking for the multi-vendor e-commerce platform.

Please implement:

1. Create Customer/DashboardController:
   - index() - Dashboard overview
   - orders() - Order history
   - addresses() - Address book
   - wishlist() - Full wishlist view
   - recentlyViewed() - Recently viewed products

2. Create BrowsingHistoryService:
   - `recordView(User $user, Product $product)`
   - `getRecentlyViewed(User $user, int $limit = 10): Collection`
   - `clearHistory(User $user)`

3. Create/Enhance customer pages:
   - Pages/Customer/Dashboard.tsx (enhance existing):
     - Welcome message with user stats
     - Recent orders summary (last 5)
     - Active orders with quick status
     - Wishlist preview
     - Recently viewed products
     - Recommended products based on history

   - Pages/Customer/Orders/Index.tsx (enhance existing):
     - Better filtering (status, date range, vendor)
     - Order search
     - Reorder button
     - Download invoice

   - Pages/Customer/Orders/Track.tsx (enhance existing):
     - Visual order timeline
     - Map tracking (if shipping API available)
     - Per-item status (for multi-vendor orders)
     - Estimated delivery countdown
     - Contact vendor option

4. Create Pages/Customer/Addresses/Index.tsx:
   - List all addresses
   - Add new address modal
   - Edit address modal
   - Set default address
   - Delete address (with confirmation)

5. Create AddressController:
   - index()
   - store(Request $request)
   - update(Request $request, Address $address)
   - destroy(Address $address)
   - setDefault(Address $address)

6. Enhance order tracking with real-time updates:
   - Create OrderTrackingChannel broadcast channel
   - Push status updates to customer
   - Show notification toast on status change

Include mobile-responsive design with the existing Tailwind classes.
```

### Prompt 3.2: Advanced Product Search & Filtering
```
Implement advanced product search and filtering for the multi-vendor e-commerce platform.

Current state: Basic Laravel Scout search exists.

Please implement:

1. Create ProductSearchService:
   - `search(string $query, array $filters = []): LengthAwarePaginator`
   - `getFilterOptions(): array` - Get available filter options
   - `getSuggestions(string $query): array` - Search suggestions
   - `getPopularSearches(): array`

2. Define searchable filters:
   - Category (single/multiple)
   - Price range (min/max)
   - Vendor
   - Rating (4+, 3+, etc.)
   - Availability (in stock only)
   - Attributes (dynamic based on product attributes)
   - Tags
   - Sort by (newest, price low-high, price high-low, popularity, rating)

3. Update ProductController@index to handle advanced filtering

4. Create search-related endpoints:
   - GET /api/search/suggestions?q={query}
   - GET /api/search/popular
   - GET /api/products/filter-options?category={slug}

5. Create/Update frontend:
   - Pages/Products/Index.tsx (major enhancement):
     - Sidebar filter panel (collapsible on mobile)
     - Category tree navigation
     - Price range slider
     - Rating stars filter
     - Dynamic attribute filters
     - Active filters display with remove option
     - URL query parameters for shareable filter URLs
     - Infinite scroll OR pagination option
     - Grid/List view toggle

   - Components/Search/SearchBar.tsx:
     - Autocomplete dropdown
     - Recent searches
     - Popular searches
     - Category suggestions in results

   - Components/Search/FilterSidebar.tsx:
     - Reusable filter component
     - Mobile-friendly drawer version

6. Implement filter persistence:
   - Save filter preferences to session/localStorage
   - URL-based filtering for SEO and sharing

7. Add Algolia/Meilisearch configuration (optional but recommended):
   - Update scout.php config
   - Create searchable traits for faceted search

Ensure filter changes update URL without page reload using Inertia partial reloads.
```

### Prompt 3.3: Product Reviews & Ratings Enhancement
```
Enhance the product reviews and ratings system for the multi-vendor e-commerce platform.

Current state: Basic Review model exists.

Please implement:

1. Enhance Review model and create migration:
   - Add: title, pros, cons, verified_purchase, helpful_count, reported_count
   - Add: images (relationship)
   - Add: vendor_response, vendor_response_at

2. Create ReviewService:
   - `createReview(User $user, Product $product, array $data): Review`
   - `canUserReview(User $user, Product $product): array` - Check if purchased
   - `markAsHelpful(User $user, Review $review): bool`
   - `reportReview(User $user, Review $review, string $reason)`
   - `getProductReviewStats(Product $product): array`

3. Create ReviewImage model and migration

4. Enhance ReviewController:
   - Add image upload handling
   - Add helpful voting endpoint
   - Add report endpoint
   - Add vendor response endpoint

5. Create Vendor/ReviewController:
   - index() - List reviews for vendor's products
   - respond(Request $request, Review $review) - Add vendor response

6. Create Admin/ReviewController:
   - index() - List all reviews with moderation queue
   - approve(Review $review)
   - reject(Review $review)
   - bulkAction(Request $request)

7. Create/Update frontend:
   - Components/Reviews/ReviewForm.tsx:
     - Star rating input
     - Title and content
     - Pros/cons separate fields
     - Image upload (up to 5)
     - Submit with loading state

   - Components/Reviews/ReviewList.tsx:
     - Review cards with user info
     - Star display
     - Images gallery
     - Helpful voting
     - Report option
     - Vendor response display
     - Pagination/load more

   - Components/Reviews/ReviewStats.tsx:
     - Overall rating display
     - Rating breakdown (5 star: 70%, etc.)
     - Total reviews count
     - Review highlights

   - Pages/Vendor/Reviews/Index.tsx:
     - Reviews list for vendor
     - Filter by product, rating, response status
     - Quick respond modal

   - Pages/Admin/Reviews/Index.tsx:
     - Moderation queue
     - Filter by status, rating, flagged
     - Bulk approve/reject

8. Add review notification events:
   - NewReviewNotification (to vendor)
   - ReviewResponseNotification (to customer)
   - ReviewApprovedNotification (to customer)

Include spam detection for review content.
```

---

## 📦 PHASE 4: Shipping & Delivery

### Prompt 4.1: Shipping Methods & Rates
```
Implement shipping methods and rates calculation for the multi-vendor e-commerce platform.

Please implement:

1. Create models and migrations:
   - ShippingZone (id, name, countries JSON, states JSON, status)
   - ShippingMethod (id, name, description, carrier, type, estimated_days_min, estimated_days_max)
   - ShippingRate (id, shipping_zone_id, shipping_method_id, min_weight, max_weight, min_order_cents, max_order_cents, rate_cents, free_shipping_threshold_cents)
   - VendorShippingMethod (vendor_id, shipping_method_id, custom_rate_cents, handling_time_days)

2. Create ShippingService:
   - `getAvailableMethodsForAddress(Address $address): Collection`
   - `calculateShippingRate(Cart $cart, Address $address, ShippingMethod $method): int`
   - `getEstimatedDeliveryDate(ShippingMethod $method, Vendor $vendor): array`
   - `isFreeShippingEligible(Cart $cart, ShippingMethod $method): bool`
   - `getShippingZoneForAddress(Address $address): ?ShippingZone`

3. Create ShippingController:
   - getMethodsForCart(Request $request) - API for checkout
   - calculateRate(Request $request) - Calculate specific method rate

4. Create Admin/ShippingController:
   - Zones CRUD
   - Methods CRUD
   - Rates CRUD
   - Table rates import (CSV)

5. Create Vendor/ShippingController:
   - index() - List available shipping methods
   - update(Request $request) - Set vendor-specific rates/handling

6. Create admin pages:
   - Pages/Admin/Shipping/Zones.tsx
   - Pages/Admin/Shipping/Methods.tsx
   - Pages/Admin/Shipping/Rates.tsx

7. Create vendor pages:
   - Pages/Vendor/Settings/Shipping.tsx:
     - Enable/disable methods
     - Custom handling time
     - Custom rates (if allowed)

8. Update Checkout:
   - Add shipping method selection step
   - Show rates per vendor (for split shipments)
   - Update order total with shipping
   - Handle free shipping promotions

9. Create events:
   - ShippingRateCalculated (for logging/analytics)

Handle multi-vendor shipping where each vendor ships separately.
```

### Prompt 4.2: Order Shipment Tracking
```
Implement order shipment tracking for the multi-vendor e-commerce platform.

Current state: OrderShipment model exists with basic fields.

Please implement:

1. Enhance OrderShipment migration:
   - Add: label_url, label_created_at
   - Add: weight, dimensions JSON
   - Add: shipping_cost_cents, insurance_cents
   - Add: pickup_scheduled_at, picked_up_at
   - Add: last_tracking_update, tracking_events JSON

2. Create ShipmentTrackingService:
   - `createShipment(Order $order, array $data): OrderShipment`
   - `updateTrackingFromCarrier(OrderShipment $shipment)`
   - `parseTrackingEvents(string $carrier, array $response): array`
   - `getTrackingUrl(OrderShipment $shipment): string`

3. Create tracking integration for carriers:
   - Create ShippingCarrier interface
   - Implement for: DHL, FedEx, UPS, Local couriers
   - app/Services/Carriers/DhlCarrier.php
   - app/Services/Carriers/FedexCarrier.php
   - (Use stub/mock implementations if no API access)

4. Create ShipmentController:
   - track(string $trackingNumber) - Public tracking page
   - getUpdates(OrderShipment $shipment) - API for polling

5. Create Vendor/ShipmentController:
   - create(Order $order) - Create shipment for order
   - printLabel(OrderShipment $shipment)
   - markAsShipped(OrderShipment $shipment)

6. Create frontend pages:
   - Pages/Tracking/Index.tsx:
     - Public tracking page
     - Enter tracking number
     - Display tracking timeline
     - Map visualization (optional)

   - Components/Orders/ShipmentTracker.tsx:
     - Embedded tracking component
     - Timeline with events
     - Current status highlight
     - Estimated delivery

   - Pages/Vendor/Orders/CreateShipment.tsx:
     - Select items to ship
     - Enter package details
     - Choose carrier
     - Print label option

7. Create scheduled command `shipments:update-tracking`:
   - Runs every 2 hours
   - Updates tracking for in-transit shipments
   - Triggers notifications on status change

8. Add tracking events and notifications:
   - ShipmentCreated
   - ShipmentInTransit
   - ShipmentOutForDelivery
   - ShipmentDelivered

Include webhook handlers for carrier tracking updates.
```

---

## 📊 PHASE 5: Reporting & Analytics

### Prompt 5.1: Admin Reports & Analytics
```
Implement comprehensive admin reports and analytics for the multi-vendor e-commerce platform.

Please implement:

1. Create ReportService:
   - `getSalesReport(Carbon $from, Carbon $to, array $filters): array`
   - `getOrdersReport(Carbon $from, Carbon $to, array $filters): array`
   - `getProductsReport(Carbon $from, Carbon $to, array $filters): array`
   - `getVendorsReport(Carbon $from, Carbon $to, array $filters): array`
   - `getCustomersReport(Carbon $from, Carbon $to, array $filters): array`
   - `getCodReport(Carbon $from, Carbon $to): array`

2. Create Admin/ReportController:
   - dashboard() - Main analytics dashboard
   - sales() - Detailed sales reports
   - orders() - Order analytics
   - products() - Product performance
   - vendors() - Vendor performance
   - customers() - Customer analytics
   - export(Request $request) - Export reports to CSV/Excel

3. Create admin report pages:
   - Pages/Admin/Reports/Dashboard.tsx:
     - Key metrics cards (revenue, orders, customers, vendors)
     - Revenue chart (daily/weekly/monthly)
     - Orders chart with status breakdown
     - Top products table
     - Top vendors table
     - Recent orders

   - Pages/Admin/Reports/Sales.tsx:
     - Date range picker
     - Revenue breakdown by:
       - Payment method
       - Vendor
       - Category
       - Region/country
     - Sales trend chart
     - Average order value chart
     - Export button

   - Pages/Admin/Reports/Orders.tsx:
     - Order status funnel
     - Orders by payment method
     - COD vs prepaid comparison
     - Failed/cancelled orders analysis
     - Average fulfillment time

   - Pages/Admin/Reports/Vendors.tsx:
     - Vendor performance rankings
     - Commission earnings
     - Product count per vendor
     - Order fulfillment rate
     - Customer ratings average

   - Pages/Admin/Reports/Customers.tsx:
     - New vs returning customers
     - Customer lifetime value
     - Top customers by spend
     - Customer acquisition trend
     - Geographic distribution

4. Create chart components using Recharts:
   - Components/Charts/RevenueChart.tsx
   - Components/Charts/OrdersChart.tsx
   - Components/Charts/CategoryPieChart.tsx
   - Components/Charts/TrendLineChart.tsx

5. Create export functionality:
   - Use Laravel Excel for exports
   - Support CSV and Excel formats
   - Include all visible columns

6. Add caching for expensive report queries

Use the existing chart components in Components/Charts as reference.
```

### Prompt 5.2: Vendor Analytics Dashboard
```
Enhance the vendor analytics dashboard for the multi-vendor e-commerce platform.

Current state: Basic vendor dashboard exists with limited stats.

Please implement:

1. Create VendorAnalyticsService:
   - `getSalesSummary(Vendor $vendor, Carbon $from, Carbon $to): array`
   - `getProductPerformance(Vendor $vendor, int $limit = 10): Collection`
   - `getOrdersBreakdown(Vendor $vendor, Carbon $from, Carbon $to): array`
   - `getRevenueByDay(Vendor $vendor, Carbon $from, Carbon $to): array`
   - `getCustomerInsights(Vendor $vendor): array`
   - `getConversionStats(Vendor $vendor): array`

2. Enhance Vendor/DashboardController:
   - Add more comprehensive analytics data
   - Add date range filtering
   - Add comparison with previous period

3. Enhance vendor analytics pages:
   - Pages/Vendor/Dashboard.tsx (major enhancement):
     - Date range selector
     - Key metrics with comparison:
       - Total revenue (vs last period)
       - Orders count (vs last period)
       - Average order value
       - Conversion rate
     - Revenue chart (line/bar)
     - Orders by status (doughnut)
     - Top selling products
     - Recent orders quick view
     - Low stock alerts
     - Pending actions (orders to ship, reviews to respond)

   - Pages/Vendor/Analytics/Sales.tsx:
     - Detailed sales breakdown
     - Revenue by product
     - Revenue by time (hour of day, day of week)
     - Payment method breakdown

   - Pages/Vendor/Analytics/Products.tsx:
     - Product performance table
     - Views vs sales conversion
     - Stock movement history
     - Price change impact

   - Pages/Vendor/Analytics/Customers.tsx:
     - Repeat customer rate
     - Customer geographic distribution
     - Average customer lifetime value

4. Create comparison features:
   - Compare current period with previous
   - Show percentage change indicators
   - Trend arrows (up/down)

5. Create real-time updates:
   - New order notification
   - Daily summary notification
   - Low stock alerts

6. Add export functionality for vendor reports

Include proper data scoping to ensure vendors only see their own data.
```

---

## ⚙️ PHASE 6: Settings & Configuration

### Prompt 6.1: Admin Settings Management
```
Implement a comprehensive admin settings management system for the multi-vendor e-commerce platform.

Please implement:

1. Create Setting model and migration:
   - id, group, key, value, type (string, integer, boolean, json, file)
   - description, is_public

2. Create SettingService:
   - `get(string $key, $default = null)`
   - `set(string $key, $value)`
   - `getGroup(string $group): array`
   - `updateGroup(string $group, array $settings)`
   - Cache settings for performance

3. Create a settings facade for easy access:
   - `settings('site.name')` or `Settings::get('site.name')`

4. Create Admin/SettingController:
   - index() - Show all setting groups
   - general() - General settings
   - payment() - Payment settings
   - shipping() - Shipping settings
   - email() - Email/SMTP settings
   - vendor() - Vendor settings
   - tax() - Tax settings
   - update(Request $request, string $group)

5. Define setting groups:
   - General: site_name, site_logo, favicon, contact_email, contact_phone, address
   - Payment: enabled_methods, cod_enabled, cod_fee, min_cod_amount, max_cod_amount
   - Shipping: default_carrier, free_shipping_threshold, handling_time
   - Email: from_name, from_email, smtp settings
   - Vendor: commission_rate, min_payout, payout_schedule, auto_approve
   - Tax: tax_enabled, tax_rate, tax_included_in_price

6. Create admin settings pages:
   - Pages/Admin/Settings/Index.tsx - Settings navigation
   - Pages/Admin/Settings/General.tsx - Site settings with logo upload
   - Pages/Admin/Settings/Payment.tsx - Payment configuration
   - Pages/Admin/Settings/Shipping.tsx - Default shipping settings
   - Pages/Admin/Settings/Email.tsx - Email configuration with test
   - Pages/Admin/Settings/Vendor.tsx - Vendor policies
   - Pages/Admin/Settings/Tax.tsx - Tax configuration

7. Create settings form components:
   - Components/Settings/TextInput.tsx
   - Components/Settings/ToggleInput.tsx
   - Components/Settings/SelectInput.tsx
   - Components/Settings/FileInput.tsx
   - Components/Settings/RichTextInput.tsx

8. Create seeder for default settings

9. Update application to use settings:
   - Email configuration
   - Payment availability
   - Commission calculations

Ensure settings are properly cached and cache is cleared on update.
```

### Prompt 6.2: Email Templates & Notifications
```
Implement customizable email templates and in-app notifications for the multi-vendor e-commerce platform.

Please implement:

1. Create EmailTemplate model and migration:
   - id, name, slug, subject, body_html, body_text
   - variables (JSON - list of available variables)
   - is_active, last_modified_by

2. Create NotificationSetting model (per user):
   - id, user_id, notification_type
   - email_enabled, sms_enabled, push_enabled

3. Create EmailTemplateService:
   - `getTemplate(string $slug): EmailTemplate`
   - `render(string $slug, array $data): array` - Returns subject and body
   - `getAvailableVariables(string $slug): array`
   - `preview(string $slug, array $sampleData): string`

4. Create Admin/EmailTemplateController:
   - index() - List all templates
   - edit(EmailTemplate $template)
   - update(Request $request, EmailTemplate $template)
   - preview(Request $request, EmailTemplate $template)
   - sendTest(Request $request, EmailTemplate $template)

5. Create Admin/NotificationController:
   - index() - List notification types
   - updateSettings(Request $request)
   - sendBroadcast(Request $request) - Send to all users

6. Define email templates:
   - order_placed (customer)
   - order_confirmed (customer)
   - order_shipped (customer)
   - order_delivered (customer)
   - order_cancelled (customer)
   - vendor_new_order
   - vendor_order_cancelled
   - vendor_payout_processed
   - password_reset
   - welcome_email
   - vendor_application_submitted
   - vendor_application_approved

7. Create admin pages:
   - Pages/Admin/EmailTemplates/Index.tsx - Template list
   - Pages/Admin/EmailTemplates/Edit.tsx:
     - Subject editor
     - Rich text editor for HTML body
     - Plain text editor
     - Variable insertion helper
     - Live preview
     - Test send

8. Create in-app notification system:
   - Create notifications table for database notifications
   - Create Notification model
   - Create notification bell component for header
   - Mark as read functionality

9. Create user notification preferences:
   - Pages/Profile/Notifications.tsx
   - Toggle per notification type

10. Update existing Mailable classes to use templates

Include a simple template syntax for variables: {{order.number}}, {{user.name}}, etc.
```

---
--- done --- 
## 🔐 PHASE 7: Security & Performance

### Prompt 7.1: Security Enhancements
```
Implement security enhancements for the multi-vendor e-commerce platform.

Please implement:

1. Create middleware for additional security:
   - XssProtection middleware - Sanitize inputs
   - RateLimitByUser middleware - Rate limit per authenticated user
   - VendorAccessMiddleware - Check vendor status before access

2. Create SecurityService:
   - `logSecurityEvent(string $type, array $data)`
   - `detectSuspiciousActivity(User $user): bool`
   - `blockIp(string $ip, string $reason, int $hours)`
   - `isIpBlocked(string $ip): bool`

3. Create security tables:
   - security_events (id, user_id, ip, type, data, created_at)
   - blocked_ips (id, ip, reason, blocked_until, created_by)
   - login_attempts (id, email, ip, success, created_at)

4. Implement login security:
   - Track failed login attempts
   - Lock account after 5 failed attempts
   - Send email on suspicious login (new IP/device)
   - Two-factor authentication (optional)

5. Create Admin/SecurityController:
   - logs() - Security event logs
   - blockedIps() - Manage blocked IPs
   - loginAttempts() - View login attempts
   - blockIp(Request $request)
   - unblockIp(string $ip)

6. Create security admin pages:
   - Pages/Admin/Security/Logs.tsx
   - Pages/Admin/Security/BlockedIps.tsx
   - Pages/Admin/Security/LoginAttempts.tsx

7. Add content security:
   - Validate uploaded file types
   - Scan uploads for malware (ClamAV integration)
   - Sanitize product descriptions (prevent XSS)

8. Add API security:
   - API rate limiting per user
   - Request signing for webhooks
   - API key management for integrations

9. Create security-related events:
   - SuspiciousActivityDetected
   - AccountLocked
   - NewDeviceLogin

10. Add security headers:
   - CSP headers
   - HSTS headers
   - XSS protection headers

Create an Artisan command to run security audit.
```

### Prompt 7.2: Performance Optimization
```
Implement performance optimizations for the multi-vendor e-commerce platform.

Please implement:

1. Implement caching strategy:
   - Cache frequently accessed data:
     - Categories (forever, invalidate on change)
     - Product counts per category
     - Homepage data (featured products, deals)
     - Settings
   - Create CacheService for centralized cache management

2. Create database optimization:
   - Add missing indexes (analyze slow queries)
   - Create composite indexes for common queries
   - Optimize N+1 queries with eager loading

3. Implement query optimization:
   - Review and optimize ProductSearchService
   - Add query caching for repeated queries
   - Use database views for complex reports

4. Create image optimization:
   - Resize images on upload
   - Create responsive image sets
   - Implement lazy loading
   - Add WebP conversion

5. Implement frontend optimization:
   - Code splitting for React components
   - Lazy load non-critical components
   - Optimize Inertia partial reloads
   - Add service worker for caching

6. Create caching commands:
   - `cache:warm` - Pre-cache frequently accessed data
   - `cache:clear-product {id}` - Clear specific product cache
   - `cache:clear-category {id}` - Clear category cache

7. Add monitoring:
   - Create middleware to log slow requests
   - Add database query logging for debugging
   - Implement simple APM metrics

8. Optimize vendor dashboard:
   - Cache vendor stats with short TTL
   - Use background jobs for heavy calculations
   - Implement pagination for large datasets

9. Create scheduled optimization jobs:
   - Clear expired sessions
   - Clean up old activity logs
   - Optimize search indexes
   - Generate cached reports

10. Add CDN configuration:
    - Configure asset CDN
    - Add cache headers for static assets
    - Implement image CDN (optional)

Include documentation for deployment optimization (PHP-FPM, OPcache, etc.)
```

---

## 🧪 PHASE 8: Testing

### Prompt 8.1: Backend Testing
```
Implement comprehensive backend tests for the multi-vendor e-commerce platform.

Please implement:

1. Create test base classes:
   - tests/TestCase.php - Base with common helpers
   - tests/VendorTestCase.php - Base for vendor tests
   - tests/AdminTestCase.php - Base for admin tests

2. Create Feature tests for COD workflow:
   - tests/Feature/Cod/CodCheckoutTest.php
   - tests/Feature/Cod/CodOrderStatusTest.php
   - tests/Feature/Cod/CodReconciliationTest.php

3. Create Feature tests for Vendor:
   - tests/Feature/Vendor/VendorRegistrationTest.php
   - tests/Feature/Vendor/VendorProductTest.php
   - tests/Feature/Vendor/VendorOrderTest.php
   - tests/Feature/Vendor/VendorPayoutTest.php

4. Create Feature tests for Orders:
   - tests/Feature/Order/OrderCreationTest.php
   - tests/Feature/Order/OrderStatusFlowTest.php
   - tests/Feature/Order/OrderRefundTest.php
   - tests/Feature/Order/MultiVendorOrderTest.php

5. Create Feature tests for Cart:
   - tests/Feature/Cart/CartOperationsTest.php
   - tests/Feature/Cart/CartToCheckoutTest.php
   - tests/Feature/Cart/InventoryReservationTest.php

6. Create Unit tests:
   - tests/Unit/Services/ShippingServiceTest.php
   - tests/Unit/Services/CodServiceTest.php
   - tests/Unit/Services/CommissionServiceTest.php
   - tests/Unit/Services/PayoutServiceTest.php
   - tests/Unit/Models/ProductTest.php
   - tests/Unit/Models/OrderTest.php

7. Create test factories:
   - Update existing factories
   - Add states for different scenarios
   - Create factory helpers for complex objects

8. Create integration tests for:
   - Payment processing (mock Stripe)
   - Email sending (using Mail fake)
   - Event dispatching
   - Job processing

9. Create API tests (if API exists):
   - tests/Feature/Api/ProductApiTest.php
   - tests/Feature/Api/CartApiTest.php

10. Setup test configuration:
    - Create testing .env
    - Configure test database
    - Setup GitHub Actions for CI

Include at least 80% coverage for critical paths (checkout, order, payment).
```

### Prompt 8.2: Frontend Testing
```
Implement frontend tests for the multi-vendor e-commerce platform using Cypress.

Current state: Basic Cypress e2e test exists.

Please implement:

1. Setup Cypress configuration:
   - cypress.config.ts
   - Custom commands
   - Fixtures for test data

2. Create E2E tests for Customer flows:
   - cypress/e2e/customer/browse_products.cy.js
   - cypress/e2e/customer/search_filter.cy.js
   - cypress/e2e/customer/add_to_cart.cy.js
   - cypress/e2e/customer/checkout_cod.cy.js (update existing)
   - cypress/e2e/customer/order_tracking.cy.js
   - cypress/e2e/customer/reviews.cy.js

3. Create E2E tests for Vendor flows:
   - cypress/e2e/vendor/vendor_registration.cy.js
   - cypress/e2e/vendor/product_management.cy.js
   - cypress/e2e/vendor/order_management.cy.js
   - cypress/e2e/vendor/earnings_payout.cy.js

4. Create E2E tests for Admin flows:
   - cypress/e2e/admin/dashboard.cy.js
   - cypress/e2e/admin/vendor_management.cy.js
   - cypress/e2e/admin/order_management.cy.js
   - cypress/e2e/admin/cod_reconciliation.cy.js
   - cypress/e2e/admin/settings.cy.js

5. Create custom Cypress commands:
   - cy.login(email, password)
   - cy.loginAsVendor()
   - cy.loginAsAdmin()
   - cy.addToCart(productId, quantity)
   - cy.checkout(paymentMethod)
   - cy.createOrder()

6. Create test data fixtures:
   - cypress/fixtures/users.json
   - cypress/fixtures/products.json
   - cypress/fixtures/orders.json

7. Setup database seeding for tests:
   - Create TestDatabaseSeeder
   - Reset database before test suites

8. Create visual regression tests (optional):
   - Key pages screenshot comparison
   - Component visual testing

9. Create performance tests:
   - Page load times
   - Time to interactive

10. Setup CI integration:
    - Add Cypress to GitHub Actions
    - Generate test reports
    - Record test runs (optional)

Include tests for mobile responsive views.
```

---

## 🚀 PHASE 9: Deployment & Documentation

### Prompt 9.1: Deployment Configuration
```
Create deployment configuration for the multi-vendor e-commerce platform.

Please implement:

1. Create Docker configuration:
   - Dockerfile for PHP/Laravel
   - docker-compose.yml for local development
   - docker-compose.prod.yml for production
   - Services: app, nginx, mysql, redis, meilisearch

2. Create deployment scripts:
   - deploy.sh - Production deployment script
   - rollback.sh - Rollback to previous version
   - maintenance.sh - Enable/disable maintenance mode

3. Create CI/CD pipeline (GitHub Actions):
   - .github/workflows/test.yml - Run tests on PR
   - .github/workflows/deploy.yml - Deploy to staging/production
   - Include: PHPUnit tests, Cypress tests, code style checks

4. Create environment configuration:
   - .env.example with all required variables
   - Environment-specific configs (staging, production)
   - Secrets management guide

5. Create nginx configuration:
   - nginx.conf for Laravel
   - SSL configuration
   - Caching rules for static assets

6. Create supervisor configuration:
   - Queue worker process
   - Schedule runner
   - Horizon configuration (if using)

7. Create backup configuration:
   - Database backup script
   - Media backup script
   - Automated backup schedule

8. Create monitoring setup:
   - Health check endpoint
   - Error tracking (Sentry integration)
   - Uptime monitoring configuration

9. Create scaling configuration:
   - Horizontal scaling guide
   - Load balancer configuration
   - Session/cache with Redis

10. Document server requirements:
    - PHP extensions
    - System packages
    - Recommended specs

Include zero-downtime deployment strategy.
```

### Prompt 9.2: Documentation
```
Create comprehensive documentation for the multi-vendor e-commerce platform.

Please implement:

1. Create API documentation:
   - Use Laravel OpenAPI/Swagger
   - Document all public endpoints
   - Include authentication
   - Add request/response examples

2. Create developer documentation:
   - docs/README.md - Overview
   - docs/INSTALLATION.md - Setup guide
   - docs/ARCHITECTURE.md - System architecture
   - docs/DATABASE.md - Database schema
   - docs/API.md - API reference
   - docs/TESTING.md - Testing guide
   - docs/DEPLOYMENT.md - Deployment guide
   - docs/CONTRIBUTING.md - Contribution guide

3. Create user guides:
   - docs/guides/ADMIN_GUIDE.md - Admin panel usage
   - docs/guides/VENDOR_GUIDE.md - Vendor onboarding and usage
   - docs/guides/CUSTOMER_GUIDE.md - Customer features

4. Create code documentation:
   - Add PHPDoc comments to all services
   - Add TypeScript JSDoc to components
   - Document complex business logic

5. Create architecture diagrams:
   - System architecture diagram
   - Database ERD
   - Order flow diagram
   - Payment flow diagram
   - COD workflow diagram

6. Create changelog:
   - CHANGELOG.md with semantic versioning
   - Breaking changes documentation

7. Create troubleshooting guide:
   - Common issues and solutions
   - Debug tips
   - Log locations

8. Create environment variables guide:
   - List all env variables
   - Explain each variable
   - Provide example values

9. Create postman collection:
   - All API endpoints
   - Environment variables
   - Example requests

10. Create inline help system:
    - Tooltips for complex features
    - Contextual help in admin

Keep documentation in sync with code changes.
```

---

## 📝 Usage Instructions

### How to Use These Prompts

1. **Start with Phase 1** - COD Enhancement is your stated priority
2. **Copy the prompt** - Each prompt is self-contained with context
3. **Paste to Claude Sonnet** - Start a new conversation for each major feature
4. **Review the output** - Check the generated code against your existing codebase
5. **Test incrementally** - Test each feature before moving to the next
6. **Customize as needed** - Modify prompts if your requirements differ

### Tips for Best Results

1. **Provide existing code** when asking for updates - helps Claude understand your patterns
2. **Break large prompts** into smaller pieces if output is truncated
3. **Ask for clarification** if the response doesn't match your needs
4. **Request tests** separately if the prompt is already complex
5. **Iterate** - Ask for improvements or alternatives

### Prompt Modification Template

```
I'm implementing [FEATURE] for my multi-vendor e-commerce platform.

Tech Stack:
- Laravel 10+ with Inertia.js
- React + TypeScript frontend
- Tailwind CSS
- MySQL database

Existing Context:
[Paste relevant existing code or describe current state]

Requirements:
[List specific requirements]

Please implement:
1. [Specific task 1]
2. [Specific task 2]
...

Ensure the code:
- Follows Laravel best practices
- Uses TypeScript for frontend
- Is properly typed
- Includes error handling
- Matches the existing code style
```

---

## 📊 Estimated Timeline

| Phase | Features | Estimated Time |
|-------|----------|----------------|
| Phase 1 | COD Enhancement | 2-3 days |
| Phase 2 | Vendor Management | 4-5 days |
| Phase 3 | Customer Experience | 3-4 days |
| Phase 4 | Shipping & Delivery | 2-3 days |
| Phase 5 | Reports & Analytics | 2-3 days |
| Phase 6 | Settings & Configuration | 2 days |
| Phase 7 | Security & Performance | 2-3 days |
| Phase 8 | Testing | 3-4 days |
| Phase 9 | Deployment & Docs | 2 days |

**Total Estimated Time: 22-29 days** (assuming full-time development)

---

## 🔄 Next Steps After Completion

1. **User Acceptance Testing** - Have real users test the platform
2. **Load Testing** - Test with simulated high traffic
3. **Security Audit** - Professional security review
4. **SEO Optimization** - Implement SEO best practices
5. **Mobile App** - Consider React Native app
6. **Advanced Features** - Flash sales, subscriptions, B2B features

---

*Generated for Multi-Vendor E-commerce Platform Development*
*Last Updated: January 2026*
