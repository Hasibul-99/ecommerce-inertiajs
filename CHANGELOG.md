# Changelog

All notable changes to the GrabIt Multi-Vendor E-commerce Platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-04-08

### Added

#### Core Platform
- Multi-vendor e-commerce platform with Laravel 10 + React/TypeScript + Inertia.js
- Role-based access control (Admin, Super-Admin, Vendor, Customer, Delivery Person)
- User authentication with registration, login, email verification (Laravel Breeze)

#### Cash on Delivery (COD) System
- COD availability checking based on address, order amount limits, phone validation
- COD fee calculation (fixed + percentage-based)
- Complete COD order workflow: pending -> confirmed -> processing -> out_for_delivery -> delivered -> completed
- Delivery person assignment and tracking
- Daily COD reconciliation reports with verification and discrepancy handling
- `cod:generate-daily-report` artisan command

#### Vendor Management
- Multi-step vendor registration and onboarding (business info, documents, bank details)
- Vendor application approval/rejection workflow with scoring
- Vendor product CRUD with variants, media, categories, and tags
- Vendor order management with per-item status tracking
- Vendor earnings dashboard with available/pending/withheld balances
- Payout system (manual request + automatic processing via `vendor:process-payouts`)
- Commission calculation per order item with configurable rates

#### Customer Experience
- Customer dashboard with order statistics, recent orders, wishlist, recommendations
- Browsing history tracking with product recommendations
- Customer address book with default address support
- Advanced product search with multi-filter support (category, price, rating, vendor, tags)
- Search suggestions, popular searches, and search analytics
- Product reviews with images, pros/cons, helpful voting, spam detection
- Vendor response to reviews

#### Shopping & Orders
- Shopping cart with session + database sync
- Multi-vendor order support (items from different vendors in one order)
- Checkout flow with Stripe, PayPal, bank transfer, and COD payment methods
- Inventory reservation system
- Order tracking with per-item status for multi-vendor orders
- Wishlist functionality

#### Shipping & Delivery
- Shipping zones, methods, and rates management
- Carrier integrations (DHL, FedEx, UPS, USPS, Local courier interfaces)
- Shipment tracking with timeline events
- `shipments:update-tracking` artisan command for batch tracking updates
- Vendor-specific shipping settings with custom handling times

#### Reports & Analytics
- Admin reports: sales, orders, products, vendors, customers with date range filtering
- Vendor analytics: sales summary, product performance, revenue trends, customer insights
- Chart components (line, bar, doughnut) using Chart.js
- Excel/CSV export via Maatwebsite package
- Period-over-period comparison with percentage changes

#### Settings & Configuration
- Dynamic settings system with groups (general, payment, shipping, email, vendor, tax)
- Settings facade for easy access with caching
- Customizable email templates with variable substitution and preview
- In-app notification system with NotificationBell component
- User notification preferences

#### Security
- XSS protection middleware with input sanitization
- Rate limiting per user middleware
- Vendor access middleware with status validation
- Security event logging and IP blocking
- Login attempt tracking with account lockout
- Security audit artisan command
- Performance monitoring middleware
- Security headers middleware (CSP, HSTS, X-Frame-Options)

#### Performance
- Redis caching for settings, categories, products
- Cache warm/clear artisan commands
- Cleanup commands for expired sessions and old activity logs
- Database indexing strategy for common query patterns
- Eager loading throughout to prevent N+1 queries

#### Testing
- 41 PHPUnit tests (Feature + Unit) covering COD, vendor, orders, cart, auth
- 18 Cypress E2E tests covering customer, vendor, and admin flows
- Test base classes (VendorTestCase, AdminTestCase)
- GitHub Actions CI/CD pipeline
- `.env.testing` configuration

#### Deployment
- Docker multi-stage build (Dockerfile)
- docker-compose for development (app, nginx, mysql, redis, meilisearch, mailpit)
- docker-compose.prod.yml for production with health checks and resource limits
- Nginx configuration with gzip, caching, security headers
- Supervisor configuration for queue workers and scheduler
- Zero-downtime deploy.sh and rollback.sh scripts

#### Documentation
- Comprehensive CLAUDE.md project guide
- Development prompts guide (DEVELOPMENT_PROMPTS_GUIDE.md)
- docs/ directory with installation, architecture, database, API, and deployment guides
