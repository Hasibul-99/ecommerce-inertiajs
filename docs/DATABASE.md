# Database Schema

## Overview

The platform uses MySQL 8.0 with Eloquent ORM. All monetary values use `decimal(10,2)`. Soft deletes are used on key tables for data retention.

## Core Tables

### Users & Authentication

| Table | Description |
|-------|-------------|
| `users` | All platform users (customers, vendors, admins, delivery persons) |
| `password_reset_tokens` | Password reset flow |
| `personal_access_tokens` | API token authentication (Sanctum) |
| `roles` | Role definitions (Spatie Permission) |
| `permissions` | Permission definitions |
| `model_has_roles` | User-role assignments |
| `model_has_permissions` | User-permission assignments |

### Vendors

| Table | Description |
|-------|-------------|
| `vendors` | Vendor profiles: business info, bank details, commission rate, onboarding status |
| `vendor_documents` | KYC documents (business license, ID, tax certificate) |
| `vendor_settings` | Per-vendor configuration key-value pairs |

### Products & Catalog

| Table | Description |
|-------|-------------|
| `products` | Product catalog: title, slug, price, stock, status, vendor_id, category_id |
| `product_variants` | Size/color variants with separate pricing and stock |
| `product_attributes` | Dynamic product attributes |
| `product_images` | Product image references |
| `categories` | Hierarchical category tree (parent_id) |
| `tags` | Product tags |
| `product_tag` | Product-tag pivot table |
| `product_views` | Page view tracking for analytics |
| `price_histories` | Price change tracking over time |
| `stock_movements` | Inventory movement audit trail |

### Shopping

| Table | Description |
|-------|-------------|
| `carts` | Shopping carts (session + user linked) |
| `cart_items` | Cart line items |
| `wishlists` | User wishlists |
| `wishlist_items` | Wishlist products |
| `addresses` | Customer address book |
| `coupons` | Discount coupons |

### Orders & Payments

| Table | Description |
|-------|-------------|
| `orders` | Customer orders: totals, payment status, COD fields, shipping address |
| `order_items` | Line items per order: vendor_id, status, tracking, shipped_at |
| `order_statuses` | Order status history |
| `order_shipments` | Shipment tracking: carrier, tracking number, events JSON |
| `order_refunds` | Refund records |
| `payments` | Payment transaction records |
| `refunds` / `refund_statuses` | Refund tracking |
| `inventory_reservations` | Stock reservations during checkout |

### COD System

| Table | Description |
|-------|-------------|
| `cod_reconciliations` | Daily COD cash reconciliation per delivery person |

Key COD fields on `orders`: `cod_verification_required`, `cod_amount_collected`, `cod_collected_at`, `cod_collected_by`, `delivery_person_id`, `cod_fee_cents`

### Financial

| Table | Description |
|-------|-------------|
| `commissions` | Commission records per order item (platform_amount, vendor_amount) |
| `vendor_earnings` | Vendor earning records |
| `payouts` | Vendor payout requests and processing history |

### Reviews

| Table | Description |
|-------|-------------|
| `reviews` | Product reviews: rating, title, content, pros, cons, vendor response |
| `review_images` | Review image attachments |
| `review_helpful_votes` | Helpful vote tracking |
| `review_reports` | Review abuse reports |

### Shipping

| Table | Description |
|-------|-------------|
| `shipping_zones` | Geographic shipping zones (countries, states) |
| `shipping_methods` | Shipping methods (standard, express, carrier-specific) |
| `shipping_rates` | Rate table: zone + method + weight/order range |
| `vendor_shipping_methods` | Vendor-specific method settings and custom rates |

### Tracking

| Table | Description |
|-------|-------------|
| `tracking_subscriptions` | Email/SMS tracking alert subscriptions |
| `tracking_tokens` | Public tracking page access tokens |
| `tracking_views` | Tracking page view analytics |

### Configuration

| Table | Description |
|-------|-------------|
| `settings` | Dynamic platform settings (group, key, value, type) |
| `email_templates` | Customizable email templates with variable placeholders |
| `notification_settings` | Per-user notification channel preferences |
| `hero_slides` | Homepage hero carousel slides |

### Security & Monitoring

| Table | Description |
|-------|-------------|
| `security_events` | Security event log (login attempts, suspicious activity) |
| `blocked_ips` | IP blocklist with expiry |
| `login_attempts` | Login attempt tracking |
| `activity_logs` | General audit trail (polymorphic) |
| `notifications` | In-app notification storage |

### Search

| Table | Description |
|-------|-------------|
| `search_logs` | Search query analytics |
| `browsing_histories` | Recently viewed products per user |

## Key Relationships

```
User --has-one--> Vendor
Vendor --has-many--> Products
Vendor --has-many--> VendorDocuments
Product --belongs-to--> Category
Product --has-many--> ProductVariants
Product --has-many--> Reviews
Order --belongs-to--> User
Order --has-many--> OrderItems
OrderItem --belongs-to--> Product
OrderItem --belongs-to--> Vendor
OrderItem --has-one--> Commission
Order --has-many--> OrderShipments
Vendor --has-many--> Payouts
```

## Indexing Strategy

- All foreign keys are indexed
- Composite indexes on frequently queried pairs: `[vendor_id, status]`, `[category_id, status]`
- Full-text indexes on `products.title` and `products.description`
- Unique indexes on business constraints: `users.email`, `products.slug`, `orders.order_number`
- Timestamp indexes on `created_at` for time-range queries
- Performance indexes added via `2026_01_21_022235_add_performance_indexes_to_tables.php`
