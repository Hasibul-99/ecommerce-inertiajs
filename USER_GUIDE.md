# GrabIt E-Commerce Platform — User Guide

A multi-vendor e-commerce platform built with Laravel + React/Inertia.js.
Three user roles: **Admin**, **Vendor**, **Customer**.

---

## Table of Contents

1. [Getting Started / Installation](#1-getting-started--installation)
2. [Admin Guide](#2-admin-guide)
3. [Vendor Guide](#3-vendor-guide)
4. [Customer Guide](#4-customer-guide)
5. [Default Login Credentials](#5-default-login-credentials)
6. [Role Summary](#6-role-summary)

---

## 1. Getting Started / Installation

### Requirements

- PHP 8.1+
- Node.js 18+
- MySQL or PostgreSQL
- Redis
- Meilisearch (for product search)
- Composer

### Setup Steps

```bash
# 1. Clone the repository
git clone <repo-url>
cd ecommerce-inertiajs

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Copy environment file and configure
cp .env.example .env
php artisan key:generate

# 5. Configure your .env file
# Set DB_*, REDIS_*, MAIL_*, STRIPE_*, MEILISEARCH_* variables

# 6. Run migrations and seed essential data
php artisan migrate
php artisan db:seed

# 7. Link storage
php artisan storage:link

# 8. Build frontend assets
npm run build

# 9. Start development server
php artisan serve
npm run dev  # (in a separate terminal for HMR)
```

### For Development/Testing (with sample data)

```bash
# Seeds roles, settings, admin account, AND sample test data
php artisan db:seed --class=CypressTestSeeder
```

### Start Background Services

```bash
# Queue worker (for emails, notifications, jobs)
php artisan queue:work

# Scheduler (for reports, payouts, cleanup)
php artisan schedule:work
```

---

## 2. Admin Guide

### 2.1 Logging In

1. Go to `http://yourdomain.com/login`
2. Enter admin credentials (see [Default Credentials](#5-default-login-credentials))
3. You will be redirected to the **Admin Dashboard** at `/admin/dashboard`

> **First login:** Change the default password immediately via Profile settings.

### 2.2 Admin Dashboard (`/admin/dashboard`)

Overview of the platform:
- Total orders, revenue, vendors, customers
- Recent orders table
- Sales chart (daily/weekly/monthly toggle)
- Low stock alerts
- Pending vendor applications widget

### 2.3 Managing Vendors

**View all vendors:** `/admin/vendors`
**Pending applications:** `/admin/vendors/applications`

#### Approving a Vendor Application

1. Go to `/admin/vendors/applications`
2. Find vendor application in the list
3. Click **View** to review their submitted details:
   - Business name & description
   - Contact information
   - Tax/license documents
   - Bank account details
4. Click **Approve** to grant vendor access, or **Reject** with a reason
5. Vendor receives email notification of the decision

#### Managing Existing Vendors

- **Edit vendor:** `/admin/vendors/{id}/edit` — update commission rate, status
- **View vendor details:** `/admin/vendors/{id}` — sales stats, product list, payout history
- **Suspend vendor:** Change status to `suspended` via Edit page

### 2.4 Managing Products

**Route:** `/admin/products`

- View all products across all vendors
- **Create product:** `/admin/products/create` (admin-created products)
- **Edit product:** `/admin/products/{id}/edit`
- **Bulk status update:** Select products → choose status → Apply
- **Upload images:** Up to multiple images per product (2MB max each)
- Manage **categories** at `/admin/categories`
- Manage **tags** at `/admin/tags`
- Manage **product variants** at `/admin/product-variants`

### 2.5 Managing Orders

**Route:** `/admin/orders`

Order statuses flow: `pending` → `confirmed` → `processing` → `shipped` → `delivered` → `completed`

#### Standard Order Workflow

1. New order arrives → status `pending`
2. Admin or vendor confirms → click **Confirm Order**
3. Vendor processes and ships
4. Tracking number added
5. Order marked **Delivered** on receipt

#### COD (Cash on Delivery) Order Workflow

COD orders have a specialized workflow:

| Step | Action | Route |
|------|--------|-------|
| 1 | Order placed with COD | Auto — status: `pending` |
| 2 | Admin confirms order | `POST /admin/orders/{id}/confirm` |
| 3 | Vendor starts processing | `POST /admin/orders/{id}/start-processing` |
| 4 | Admin assigns delivery person | `POST /admin/orders/{id}/assign-delivery-person` |
| 5 | Mark out for delivery | `POST /admin/orders/{id}/mark-out-for-delivery` |
| 6 | Delivery person collects cash | `POST /admin/orders/{id}/confirm-cod-collection` |
| 7 | Handle failed delivery | `POST /admin/orders/{id}/handle-delivery-failure` |

#### COD Reconciliation (`/admin/cod-reconciliation`)

1. Click **Generate Daily Report** to create reconciliation for a date
2. Review each delivery person's collected amounts
3. **Verify** matching collections or **Dispute** discrepancies
4. Export reconciliation reports as CSV

### 2.6 Payout Management (`/admin/payouts`)

1. Vendors request payouts from their dashboard
2. Admin reviews pending payouts at `/admin/payouts`
3. Click **Process** on a payout → enter transaction reference → confirm
4. Vendor receives email confirmation
5. **Bulk process:** Select multiple payouts → Bulk Process

### 2.7 Coupons (`/admin/coupons`)

Create discount coupons:
- **Fixed** amount or **Percentage** discount
- Set minimum order value
- Set usage limit (per coupon / per user)
- Set expiry date
- Enable/disable with toggle

### 2.8 Hero Slider (`/admin/hero-slides`)

Manage homepage banner slides:
- Upload image, set title, subtitle, CTA button text + link
- Drag to reorder
- Toggle active/inactive per slide

### 2.9 Reports & Analytics (`/admin/reports`)

| Report | URL | Description |
|--------|-----|-------------|
| Dashboard | `/admin/reports/dashboard` | Platform overview KPIs |
| Sales | `/admin/reports/sales` | Revenue by date range |
| Orders | `/admin/reports/orders` | Order counts, statuses |
| Products | `/admin/reports/products` | Top sellers, views |
| Vendors | `/admin/reports/vendors` | Per-vendor performance |
| Customers | `/admin/reports/customers` | Customer activity |

All reports support **date range filtering** and **CSV export**.

### 2.10 Platform Settings (`/admin/settings`)

| Section | URL | What to Configure |
|---------|-----|-------------------|
| General | `/admin/settings/general` | Site name, logo, description, contact info |
| Payment | `/admin/settings/payment` | Enable/disable payment methods, Stripe keys |
| Shipping | `/admin/settings/shipping` | Default shipping rates, zones |
| Email | `/admin/settings/email` | SMTP settings, from address |
| Vendor | `/admin/settings/vendor` | Commission rate, payout policy, holding period |
| Tax | `/admin/settings/tax` | Tax rates, rules by region |

### 2.11 Email Templates (`/admin/email-templates`)

Customize transactional emails:
- Order placed / confirmed / shipped / delivered / cancelled
- Vendor approval / rejection
- Password reset, welcome email

Each template supports **variables** like `{{order.number}}`, `{{user.name}}`, `{{vendor.business_name}}`.

Use **Preview** and **Send Test** before saving.

### 2.12 User Management (`/admin/users`)

- Create/edit/delete users
- Assign roles: `customer`, `vendor`, `admin`, `super-admin`
- Toggle email verification status

### 2.13 Security (`/admin/security`)

- View login attempts and security events
- Block/unblock IP addresses
- Export security logs

---

## 3. Vendor Guide

### 3.1 Registering as a Vendor

Vendors must first have a customer account, then apply for vendor status.

**Step 1 — Create Account:**
1. Go to `/register`
2. Fill in name, email, password
3. Verify email

**Step 2 — Apply as Vendor:**
1. Go to `/vendor/register`
2. Complete the 3-step registration:

| Step | Information Required |
|------|---------------------|
| Step 1 | Business name, business email, phone number, business description |
| Step 2 | Tax ID, business license, KYC documents |
| Step 3 | Bank account number, bank name, account holder name |

3. Submit application — status will be `pending`
4. Wait for admin approval (email notification sent when approved/rejected)

### 3.2 Logging In (After Approval)

1. Go to `/login`
2. Enter your registered email and password
3. Redirected to **Vendor Dashboard** at `/vendor/dashboard`

### 3.3 Vendor Dashboard (`/vendor/dashboard`)

Overview widgets:
- Total sales (today / this week / this month)
- Total orders
- Pending orders
- Available balance for payout
- Recent orders table
- Top products by sales

### 3.4 Product Management (`/vendor/products`)

#### Creating a Product

1. Go to `/vendor/products/create`
2. Fill in:
   - **Title** and **Slug** (auto-generated)
   - **Description** (rich text)
   - **Category** (select from dropdown)
   - **Tags** (optional, multi-select)
   - **Price** (in BDT)
   - **Stock** quantity
   - **Status**: `draft` (not visible) or `active` (visible to customers)
3. Upload **product images** (multiple allowed, first = thumbnail)
4. Add **variants** if product has size/color options
5. Click **Save**

#### Managing Products

- **Edit:** Click product → Edit button
- **Duplicate:** Clone product with one click
- **Toggle status:** Switch draft ↔ active without full edit
- **Delete:** Soft-deleted (recoverable by admin)
- **Bulk actions:** Select multiple → bulk activate/deactivate/delete

### 3.5 Order Management (`/vendor/orders`)

Vendors see **only their own order items** (not items from other vendors in the same order).

#### Order Item Statuses

`pending` → `confirmed` → `processing` → `shipped` → `delivered`

#### Processing an Order

1. Go to `/vendor/orders`
2. Click order to open details
3. Update item status:
   - **Confirm** — you accept the order item
   - **Mark Processing** — you are preparing the item
   - **Mark Shipped** — add tracking number + carrier name
4. Customer receives email/notification at each status change

#### Packing Slips

- Download packing slip PDF: order details page → **Download Packing Slip**
- Preview before printing

### 3.6 Earnings & Payouts (`/vendor/earnings`)

#### How Earnings Work

- Commission is calculated **per order item** when marked as delivered
- Formula: `vendor_amount = item_total - (item_total × commission_rate%)`
- Example: BDT 1,000 item with 10% commission → vendor earns BDT 900

**Balance Types:**

| Balance | Description |
|---------|-------------|
| Available | Delivered orders past holding period — can withdraw |
| Pending | Orders not yet delivered or within holding period |
| Withheld | Refund reserve (configurable percentage) |

#### Requesting a Payout

1. Go to `/vendor/earnings`
2. Check **Available Balance**
3. Click **Request Payout**
4. Enter amount (must be above minimum threshold)
5. Admin reviews and processes within configured timeframe
6. You receive email confirmation with transaction details

#### Transaction History (`/vendor/earnings/transactions`)

- Full list of all commission earnings per order item
- Filter by date range
- Export to CSV

#### Payout History (`/vendor/earnings/payouts`)

- Status: `pending` → `processing` → `paid` / `failed`
- View transaction reference for each completed payout

### 3.7 Analytics (`/vendor/analytics`)

| Report | URL | Shows |
|--------|-----|-------|
| Sales | `/vendor/analytics/sales` | Revenue over time, order trends |
| Products | `/vendor/analytics/products` | Views, sales per product |
| Customers | `/vendor/analytics/customers` | Repeat buyers, customer locations |

### 3.8 Vendor Settings (`/vendor/settings`)

- Update business name, description, logo
- Contact information
- Shipping settings at `/vendor/settings/shipping`:
  - Enable/disable vendor-specific shipping
  - Set per-product or flat-rate shipping costs

---

## 4. Customer Guide

### 4.1 Creating an Account

1. Go to `/register`
2. Enter **Name**, **Email**, **Password**
3. Verify your email (check inbox for verification link)
4. You are now logged in as a customer

### 4.2 Logging In

1. Go to `/login`
2. Enter email and password
3. Use **Forgot Password** at `/forgot-password` if needed

### 4.3 Browsing Products

**Homepage (`/`):**
- Featured products carousel
- Category quick-links
- Hero banner with promotions
- Popular/new arrivals sections

**Product Listing (`/products`):**

Filter options:
- Category
- Price range (slider)
- Minimum rating
- Vendor
- In stock only

Sort by: Newest / Price (low-high / high-low) / Popularity / Rating

**Product Detail Page (`/product/{id}`):**
- Multiple product images (gallery)
- Price, stock status
- Vendor information
- Add to cart / Add to wishlist
- Product variants (size, color)
- Customer reviews with ratings
- Related products

**Search:**
- Search bar in header — type to see autocomplete suggestions
- Full results at `/products?search=keyword`
- Supports fuzzy matching (typos handled)

**Categories (`/categories`):**
- Browse by category tree
- `/category/{slug}` shows all products in that category

### 4.4 Shopping Cart (`/cart`)

- Add products from listing page or product detail
- Update quantities in cart
- Remove individual items or clear entire cart
- See subtotal, shipping estimate, tax
- Apply **coupon code** for discounts
- Proceed to checkout

### 4.5 Checkout (`/checkout`)

1. Review cart items
2. Enter / select **shipping address**
   - Use saved address or enter new one
3. Select **shipping method**
4. Choose **payment method:**
   - Credit/Debit Card (Stripe)
   - Cash on Delivery (COD) — if available for your area
   - PayPal
   - Bank Transfer
5. Review order summary
6. Click **Place Order**
7. Payment processed → Order confirmation shown + email sent

### 4.6 Order Tracking

**From your account:**
1. Go to `/orders`
2. Click any order to see full details
3. Click **Track Order** for live shipment tracking

**Without an account (public tracking):**
1. Go to `/track-order`
2. Enter your **Order Number** + **Email** or use the tracking link from your confirmation email
3. See current status and shipment updates

**Order Statuses Explained:**

| Status | Meaning |
|--------|---------|
| Pending | Order received, awaiting confirmation |
| Confirmed | Seller confirmed the order |
| Processing | Seller is preparing your items |
| Shipped | Items dispatched — tracking number available |
| Delivered | Order received by you |
| Completed | Order fully closed |
| Cancelled | Order was cancelled |

### 4.7 Wishlist (`/wishlist`)

- Click the heart icon on any product to save it
- View all saved items at `/wishlist`
- Move items to cart directly from wishlist
- Remove items individually or clear all

### 4.8 Product Reviews

After receiving an order you can leave a review:
1. Go to the product page
2. Scroll to **Reviews** section
3. Click **Write a Review**
4. Rate 1–5 stars
5. Write your review text
6. Upload photos (optional)
7. Submit

You can **edit** or **delete** your own review later.
Mark other reviews as **Helpful** if they assisted you.

### 4.9 Customer Dashboard (`/customer/dashboard`)

Quick overview of:
- Recent orders
- Wishlist count
- Saved addresses

### 4.10 Managing Addresses (`/customer/addresses`)

- Add multiple shipping/billing addresses
- Edit or delete saved addresses
- Set one as **Default** — auto-filled at checkout

### 4.11 Notifications (`/notifications`)

In-app notifications for:
- Order status changes
- Shipment updates
- Promotions (if subscribed)

**Notification bell** (top-right header):
- Shows unread count badge
- Click to see recent notifications
- Mark individual or all as read

**Notification Preferences:**
- Go to `/notifications/preferences`
- Toggle email/in-app per notification type (order updates, promotions, etc.)

### 4.12 Profile (`/profile`)

- Update name, email
- Change password
- Upload profile photo
- Delete account

---

## 5. Default Login Credentials

> **Warning:** Change all passwords immediately after first login in production.

### Production (after `php artisan db:seed`)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | `admin@yourdomain.com` | `password123!` |

To customize, set in `.env` before seeding:
```env
ADMIN_EMAIL=youremail@example.com
ADMIN_PASSWORD=YourSecurePassword123!
ADMIN_NAME=Your Name
```

### Development / Testing (after `php artisan db:seed --class=CypressTestSeeder`)

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@example.com` | `admin123` |
| Vendor (approved) | `vendor@example.com` | `vendor123` |
| Customer | `customer@example.com` | `password123` |
| Pending Vendor 1 | `pending.vendor1@example.com` | `password123` |
| Pending Vendor 2 | `pending.vendor2@example.com` | `password123` |
| Pending Vendor 3 | `pending.vendor3@example.com` | `password123` |

---

## 6. Role Summary

| Feature | Customer | Vendor | Admin |
|---------|----------|--------|-------|
| Browse & search products | Yes | Yes | Yes |
| Add to cart & checkout | Yes | Yes | — |
| Write product reviews | Yes | — | — |
| Manage own orders | Yes | — | — |
| Manage wishlist & addresses | Yes | — | — |
| Create & manage products | — | Yes | Yes |
| Manage own order items | — | Yes | Yes |
| View earnings & request payouts | — | Yes | — |
| View vendor analytics | — | Yes | — |
| Approve/reject vendor applications | — | — | Yes |
| Manage all orders platform-wide | — | — | Yes |
| Process vendor payouts | — | — | Yes |
| COD reconciliation | — | — | Yes |
| Manage coupons | — | — | Yes |
| Manage categories & tags | — | — | Yes |
| Platform settings | — | — | Yes |
| Email templates | — | — | Yes |
| Reports & analytics | — | — | Yes |
| User & role management | — | — | Yes |
| Security logs & IP blocking | — | — | Yes |

---

## Quick URL Reference

### Public
| Page | URL |
|------|-----|
| Homepage | `/` |
| Products | `/products` |
| Product Detail | `/product/{id}` |
| Categories | `/categories` |
| Cart | `/cart` |
| Track Order | `/track-order` |
| Login | `/login` |
| Register | `/register` |

### Customer
| Page | URL |
|------|-----|
| Dashboard | `/dashboard` |
| My Orders | `/orders` |
| Checkout | `/checkout` |
| Wishlist | `/wishlist` |
| Addresses | `/customer/addresses` |
| Notifications | `/notifications` |
| Profile | `/profile` |

### Vendor
| Page | URL |
|------|-----|
| Dashboard | `/vendor/dashboard` |
| Products | `/vendor/products` |
| Create Product | `/vendor/products/create` |
| Orders | `/vendor/orders` |
| Earnings | `/vendor/earnings` |
| Payouts | `/vendor/earnings/payouts` |
| Analytics | `/vendor/analytics/sales` |
| Settings | `/vendor/settings` |
| Apply as Vendor | `/vendor/register` |

### Admin
| Page | URL |
|------|-----|
| Dashboard | `/admin/dashboard` |
| Orders | `/admin/orders` |
| Products | `/admin/products` |
| Vendors | `/admin/vendors` |
| Vendor Applications | `/admin/vendors/applications` |
| Payouts | `/admin/payouts` |
| COD Reconciliation | `/admin/cod-reconciliation` |
| Reports | `/admin/reports/dashboard` |
| Coupons | `/admin/coupons` |
| Settings | `/admin/settings` |
| Email Templates | `/admin/email-templates` |
| Users | `/admin/users` |
| Activity Logs | `/admin/activity-logs` |
| Security | `/admin/security/logs` |
