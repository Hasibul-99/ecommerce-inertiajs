# API Reference

## Authentication

The platform primarily uses session-based authentication via Inertia.js. API endpoints use Laravel Sanctum token-based authentication.

```bash
# Obtain API token
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password"
}

# Response
{
  "token": "1|abc123...",
  "user": { ... }
}

# Use token in subsequent requests
Authorization: Bearer 1|abc123...
```

## Rate Limiting

| Scope | Limit |
|-------|-------|
| Public endpoints | 60 requests/minute |
| Authenticated endpoints | 120 requests/minute |
| Admin endpoints | 240 requests/minute |

## Public Endpoints

### Products

```
GET    /products                    # Product listing with filters
GET    /products/{slug}             # Product detail page
```

**Query Parameters for /products:**
- `search` - Full-text search query
- `category` - Category slug
- `min_price` / `max_price` - Price range filter
- `rating` - Minimum rating (e.g., `4`)
- `vendor` - Vendor slug
- `in_stock` - Boolean, only in-stock products
- `sort` - Sort field: `newest`, `price_asc`, `price_desc`, `popular`, `rating`
- `per_page` - Items per page (default: 20)

### Search

```
GET    /api/search/suggestions?q={query}    # Autocomplete suggestions
GET    /api/search/popular                   # Popular search terms
GET    /api/products/filter-options          # Available filter values
```

### Tracking

```
GET    /tracking                    # Public tracking page
GET    /tracking/{number}           # Track by shipment number
```

## Authenticated Endpoints

### Cart

```
GET    /cart                        # View cart
POST   /cart/add                    # Add item to cart
PUT    /cart/update                 # Update cart item quantity
DELETE /cart/remove/{id}            # Remove cart item
```

### Orders

```
GET    /orders                      # Customer order history
GET    /orders/{id}                 # Order detail
POST   /checkout                    # Place order
```

### Wishlist

```
GET    /wishlist                    # View wishlist
POST   /wishlist/toggle             # Add/remove product
```

### Reviews

```
POST   /products/{slug}/reviews     # Submit review
POST   /reviews/{id}/helpful        # Mark as helpful
POST   /reviews/{id}/report         # Report review
```

### Addresses

```
GET    /customer/addresses          # List addresses
POST   /customer/addresses          # Create address
PUT    /customer/addresses/{id}     # Update address
DELETE /customer/addresses/{id}     # Delete address
PATCH  /customer/addresses/{id}/default  # Set as default
```

### Notifications

```
GET    /notifications               # List notifications
POST   /notifications/mark-read     # Mark as read
POST   /notifications/mark-all-read # Mark all as read
```

## Vendor Endpoints

All vendor routes are prefixed with `/vendor` and require the `vendor` role.

### Products

```
GET    /vendor/products             # List vendor's products
GET    /vendor/products/create      # Create form
POST   /vendor/products             # Store product
GET    /vendor/products/{id}/edit   # Edit form
PUT    /vendor/products/{id}        # Update product
DELETE /vendor/products/{id}        # Delete product
```

### Orders

```
GET    /vendor/orders               # Vendor's orders (their items only)
GET    /vendor/orders/{id}          # Order detail (vendor's items only)
PUT    /vendor/orders/items/{id}/status  # Update item status
```

### Earnings

```
GET    /vendor/earnings             # Earnings dashboard
GET    /vendor/earnings/transactions # Transaction history
GET    /vendor/earnings/payouts     # Payout history
POST   /vendor/earnings/payouts     # Request payout
```

### Reviews

```
GET    /vendor/reviews              # Reviews on vendor's products
POST   /vendor/reviews/{id}/respond # Respond to review
```

## Admin Endpoints

All admin routes are prefixed with `/admin` and require the `admin` or `super-admin` role.

### Dashboard & Reports

```
GET    /admin/dashboard             # Admin dashboard
GET    /admin/reports/dashboard     # Analytics dashboard
GET    /admin/reports/sales         # Sales report
GET    /admin/reports/orders        # Orders report
GET    /admin/reports/products      # Products report
GET    /admin/reports/vendors       # Vendors report
GET    /admin/reports/customers     # Customers report
GET    /admin/reports/export        # Export report (CSV/Excel)
```

### Resource Management

```
# Users, Vendors, Products, Orders, Categories, Tags, Coupons
# All follow standard CRUD pattern:
GET    /admin/{resource}            # List
GET    /admin/{resource}/create     # Create form
POST   /admin/{resource}            # Store
GET    /admin/{resource}/{id}       # Show
GET    /admin/{resource}/{id}/edit  # Edit form
PUT    /admin/{resource}/{id}       # Update
DELETE /admin/{resource}/{id}       # Delete
```

### COD Reconciliation

```
GET    /admin/cod-reconciliation           # List reconciliations
GET    /admin/cod-reconciliation/{id}      # Show detail
POST   /admin/cod-reconciliation/{id}/verify   # Verify collection
POST   /admin/cod-reconciliation/{id}/dispute  # Dispute
```

### Settings

```
GET    /admin/settings              # Settings index
GET    /admin/settings/general      # General settings
GET    /admin/settings/payment      # Payment settings
GET    /admin/settings/shipping     # Shipping settings
GET    /admin/settings/email        # Email settings
GET    /admin/settings/vendor       # Vendor settings
GET    /admin/settings/tax          # Tax settings
PUT    /admin/settings/{group}      # Update settings group
```

### Security

```
GET    /admin/security/logs             # Security event logs
GET    /admin/security/blocked-ips      # Blocked IPs list
GET    /admin/security/login-attempts   # Login attempts
POST   /admin/security/block-ip         # Block an IP
DELETE /admin/security/unblock-ip/{ip}  # Unblock an IP
GET    /admin/security/export-logs      # Export security logs
```

## Webhook Endpoints

```
POST   /webhooks/stripe             # Stripe payment webhooks
```
