# Architecture Overview

## System Design

GrabIt follows a **monolithic architecture** with clear domain boundaries, using Laravel as the backend framework and React via Inertia.js for the frontend. This provides the development speed of a monolith with the interactive feel of an SPA.

```
Browser (React/TypeScript)
    |
    | Inertia.js (XHR requests)
    |
Laravel Router
    |
    +-- Middleware (Auth, Roles, XSS, Rate Limit)
    |
    +-- Controllers (thin orchestrators)
    |       |
    |       +-- Form Requests (validation)
    |       +-- Policies (authorization)
    |
    +-- Services (business logic)
    |       |
    |       +-- Eloquent Models (data access)
    |       +-- Events (domain events)
    |
    +-- Jobs/Queue (async processing)
    |
    +-- Cache (Redis)
```

## Service Layer

All business logic lives in `app/Services/`. Controllers are thin - they validate, authorize, call a service, and return a response.

### Core Services

| Service | Responsibility |
|---------|---------------|
| `CodService` | COD availability, fee calculation, order validation |
| `CodOrderWorkflow` | COD order status transitions and event dispatching |
| `CodReconciliationService` | Daily COD cash reconciliation |
| `VendorEarningService` | Commission calculation, balance tracking |
| `PayoutService` | Vendor payout processing |
| `ShippingService` | Shipping rates, zones, method availability |
| `ShipmentTrackingService` | Carrier tracking integration |
| `ProductSearchService` | Full-text search with filters via Scout |
| `ReviewService` | Review creation, moderation, spam detection |
| `SettingService` | Dynamic platform settings with caching |
| `EmailTemplateService` | Email template rendering with variables |
| `BrowsingHistoryService` | Product view tracking and recommendations |
| `SecurityService` | Login tracking, IP blocking, event logging |
| `VendorOnboardingService` | Multi-step vendor registration |
| `ReportService` | Admin analytics and report generation |
| `VendorAnalyticsService` | Vendor-specific analytics |

## Event-Driven Architecture

Domain events decouple business logic from side effects (notifications, logging, analytics).

### Event Flow

```
Action (e.g., Order Delivered)
    |
    +-- Dispatch Event (CodPaymentCollected)
          |
          +-- Listener: Send customer notification (queued)
          +-- Listener: Update vendor earnings (queued)
          +-- Listener: Log activity (sync)
```

### Key Event Groups

- **COD Events**: `CodOrderConfirmed`, `CodOrderOutForDelivery`, `CodPaymentCollected`, `CodDeliveryFailed`
- **Shipment Events**: `ShipmentCreated`, `ShipmentInTransit`, `ShipmentOutForDelivery`, `ShipmentDelivered`
- **Security Events**: `SuspiciousActivityDetected`, `AccountLocked`, `NewDeviceLogin`
- **Order Events**: `OrderItemStatusUpdated`

## Multi-Vendor Order Model

Orders can contain items from multiple vendors. Each `order_item` has its own vendor and status, enabling independent fulfillment.

```
Order (belongs to Customer)
  |
  +-- OrderItem (vendor_id: Vendor A, status: shipped)
  +-- OrderItem (vendor_id: Vendor B, status: processing)
  +-- OrderItem (vendor_id: Vendor A, status: delivered)
```

Commission is calculated per item, not per order. Each vendor sees only their own items.

## Caching Strategy

- **Settings**: Cached forever, invalidated on update
- **Categories**: Cached forever, invalidated on CRUD
- **Shipping rates**: 30-minute TTL
- **Report data**: 15-30 minute TTL depending on volatility
- **Search results**: Short TTL (5 minutes)

Cache driver: Redis (configured via `CACHE_DRIVER=redis`).

## Queue Architecture

- **Driver**: Redis
- **Queues**: `high`, `default`, `low`, `notifications`
- **Workers**: Managed by Supervisor in production

Queued tasks: email sending, tracking updates, report generation, search indexing, payout processing.

## Frontend Architecture

Inertia.js bridges Laravel and React - no separate API layer needed. Pages receive props from controllers and render as React components.

### Layout Hierarchy

- `AppLayout` - Customer-facing pages (header, footer, navigation)
- `AdminLayout` - Admin dashboard (sidebar navigation)
- `VendorLayout` - Vendor portal (vendor-specific sidebar)
- `AuthLayout` / `GuestLayout` - Authentication pages

### State Management

- **Server state**: Inertia page props (single source of truth)
- **Form state**: Inertia `useForm()` hook
- **UI state**: React `useState` / `useReducer` (local only)
- No Redux/Zustand - Inertia handles server-state synchronization

## Security Layers

1. **Middleware**: XSS sanitization, rate limiting, vendor access control, security headers
2. **Form Requests**: Input validation on all mutations
3. **Policies**: Authorization checks on all resource access
4. **CSRF**: Automatic via Laravel
5. **Monitoring**: Security event logging, IP blocking, login attempt tracking
