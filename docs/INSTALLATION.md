# Installation Guide

## Prerequisites

- PHP 8.1+ with extensions: BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML, GD, Zip, Intl
- Composer 2.x
- Node.js 18+ and npm
- MySQL 8.0+ or PostgreSQL
- Redis 7+
- Meilisearch 1.6+ (for full-text search)

## Local Setup

### 1. Clone and Install Dependencies

```bash
git clone <repository-url> grabit
cd grabit

composer install
npm install
```

### 2. Environment Configuration

```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env` with your local settings:

```env
APP_NAME=GrabIt
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=grabit
DB_USERNAME=root
DB_PASSWORD=

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

REDIS_HOST=127.0.0.1

MEILISEARCH_HOST=http://127.0.0.1:7700
MEILISEARCH_KEY=masterKey

MAIL_MAILER=smtp
MAIL_HOST=127.0.0.1
MAIL_PORT=1025
```

### 3. Database Setup

```bash
php artisan migrate
php artisan db:seed          # Optional: seed sample data
php artisan storage:link
```

### 4. Search Index

```bash
php artisan scout:import "App\Models\Product"
```

### 5. Start Development Servers

```bash
# Terminal 1: Laravel
php artisan serve

# Terminal 2: Vite (frontend HMR)
npm run dev

# Terminal 3: Queue worker
php artisan queue:work

# Terminal 4: Scheduler (optional)
php artisan schedule:work
```

The application is now available at `http://localhost:8000`.

## Docker Setup

### Development

```bash
# Start all services
docker-compose up -d

# Run migrations inside container
docker-compose exec app php artisan migrate --seed

# Create storage link
docker-compose exec app php artisan storage:link

# Import search index
docker-compose exec app php artisan scout:import "App\Models\Product"
```

Services available:
- **App**: http://localhost:8000
- **Mailpit**: http://localhost:8025 (email testing UI)
- **Meilisearch**: http://localhost:7700
- **MySQL**: localhost:3306
- **Redis**: localhost:6379

### Production

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

See [Deployment Guide](DEPLOYMENT.md) for full production setup.

## Running Tests

### PHP Tests

```bash
php artisan test                      # Run all tests
php artisan test --parallel           # Parallel execution
php artisan test --filter=CodService  # Specific test
php artisan test --coverage           # With coverage report
```

### Cypress E2E Tests

```bash
npm run cypress:open     # Interactive mode
npm run cypress:run      # Headless mode
npm run test:e2e         # Full E2E (starts server + runs Cypress)
```

## Default Accounts

After seeding, these accounts are available:

| Role | Email | Password |
|------|-------|----------|
| Super Admin | admin@grabit.com | password |
| Vendor | vendor@grabit.com | password |
| Customer | customer@grabit.com | password |

> Note: Change these credentials in production. The seeder should only be used in development.
