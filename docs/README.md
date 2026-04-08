# GrabIt - Multi-Vendor E-commerce Platform Documentation

## Quick Links

| Document | Description |
|----------|-------------|
| [Installation Guide](INSTALLATION.md) | Local setup, Docker setup, environment configuration |
| [Architecture Overview](ARCHITECTURE.md) | System design, service layer, event-driven patterns |
| [Database Schema](DATABASE.md) | Tables, relationships, indexing strategy |
| [API Reference](API.md) | Public and internal API endpoints |
| [Deployment Guide](DEPLOYMENT.md) | Production deployment, Docker, CI/CD |
| [Email Notifications](EMAIL_NOTIFICATIONS.md) | Email template system and notification channels |

## Tech Stack

- **Backend**: Laravel 10+ (PHP 8.1+)
- **Frontend**: React 18 + TypeScript + Inertia.js
- **Styling**: Tailwind CSS with `grabit-*` theme
- **Database**: MySQL 8.0 with Eloquent ORM
- **Search**: Laravel Scout + Meilisearch
- **Cache/Queue**: Redis
- **Payments**: Stripe, PayPal, Bank Transfer, COD
- **Media**: Spatie Media Library
- **Permissions**: Spatie Laravel Permission

## Key Features

- Multi-vendor marketplace with commission system
- Cash on Delivery (COD) with reconciliation
- Vendor onboarding and approval workflow
- Advanced product search with filters
- Shipment tracking with carrier integrations
- Admin/Vendor analytics dashboards
- Dynamic settings and email template management
- Security monitoring and IP blocking

## Project Structure

```
app/
  Console/Commands/    # Artisan commands (COD reports, payouts, cache, security)
  Events/              # Domain events (Order, COD, Shipment, Security)
  Exports/             # Excel exports (Reports, Vendor reports)
  Http/
    Controllers/
      Admin/           # Admin panel controllers
      Customer/        # Customer dashboard controllers
      Vendor/          # Vendor portal controllers
    Middleware/         # Security, rate limiting, XSS protection
    Requests/          # Form request validation
  Models/              # Eloquent models
  Policies/            # Authorization policies
  Services/            # Business logic (COD, Shipping, Payouts, Search, etc.)
resources/
  js/
    Components/        # Reusable React components (ui/, Charts/, Search/)
    Layouts/           # Page layouts (App, Admin, Vendor, Auth)
    Pages/             # Inertia page components
      Admin/           # Admin dashboard pages
      Customer/        # Customer pages
      Vendor/          # Vendor portal pages
      Products/        # Product catalog pages
tests/
  Feature/             # HTTP/integration tests
  Unit/                # Unit tests for services/models
cypress/
  e2e/                 # End-to-end browser tests
```
