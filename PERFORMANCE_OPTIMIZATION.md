# Performance Optimization Guide

This document outlines all performance optimizations implemented in the multi-vendor e-commerce platform and deployment best practices.

## Table of Contents

1. [Caching Strategy](#caching-strategy)
2. [Database Optimization](#database-optimization)
3. [Image Optimization](#image-optimization)
4. [Frontend Optimization](#frontend-optimization)
5. [Monitoring](#monitoring)
6. [Scheduled Jobs](#scheduled-jobs)
7. [Deployment Optimization](#deployment-optimization)
8. [Performance Commands](#performance-commands)

---

## Caching Strategy

### CacheService

Centralized cache management service located at `app/Services/CacheService.php`.

**Features:**
- Predefined cache key prefixes (category, product, vendor, settings, homepage, stats)
- TTL constants (forever, long, medium, short, very short)
- Automatic cache invalidation via model observers
- Tag-based cache management

**Usage:**
```php
use App\Services\CacheService;

$cacheService = app(CacheService::class);

// Cache categories forever
$categories = $cacheService->cacheCategories(function() {
    return Category::with('children')->get();
});

// Cache product with 24-hour TTL
$product = $cacheService->cacheProduct($productId, function() use ($productId) {
    return Product::with(['vendor', 'media'])->find($productId);
});

// Cache homepage featured products for 1 hour
$featured = $cacheService->cacheHomepage('featured_products', function() {
    return Product::featured()->limit(8)->get();
}, CacheService::TTL_MEDIUM);
```

### Automatic Cache Invalidation

Model observers automatically clear cache when data changes:

**CategoryObserver:**
- Clears categories cache on save/delete

**ProductObserver:**
- Clears product cache on save/delete
- Clears homepage cache if product is featured

### Cached Data

| Data Type | TTL | Invalidation |
|-----------|-----|--------------|
| Categories | Forever | On category save/delete |
| Product Details | 24 hours | On product save/delete |
| Homepage Featured | 1 hour | On featured product change |
| Vendor Stats | 5 minutes | Manual or on order change |
| Settings | Forever | On setting update |

---

## Database Optimization

### Performance Indexes

Migration: `database/migrations/2026_01_21_022235_add_performance_indexes_to_tables.php`

**Indexes Added:**

**Products:**
- `(vendor_id, status)` - Vendor product queries
- `(category_id, status)` - Category browsing
- `(status, is_featured)` - Homepage featured products
- `(status, created_at)` - New products listing
- `price` - Price filtering
- `stock` - Stock availability

**Orders:**
- `(user_id, status)` - User order history
- `(status, created_at)` - Order management
- `payment_status` - Payment filtering
- `created_at` - Date-based queries

**Order Items:**
- `(vendor_id, status)` - Vendor order items
- `(order_id, vendor_id)` - Multi-vendor order breakdown
- `status` - Status filtering

**Reviews:**
- `(product_id, status)` - Product reviews
- `(user_id, created_at)` - User review history
- `rating` - Rating filters

**Categories:**
- `parent_id` - Tree queries
- `(parent_id, status)` - Active categories
- `order` - Sorting

**Vendors:**
- `(status, created_at)` - Vendor listing
- `user_id` - User-vendor link

### Query Optimization Best Practices

**1. Always Eager Load Relationships:**
```php
// ❌ Bad - N+1 Query
$products = Product::all();
foreach ($products as $product) {
    echo $product->vendor->name; // Extra query per product
}

// ✅ Good - Single Query
$products = Product::with('vendor')->get();
```

**2. Use Select to Limit Columns:**
```php
// ✅ Only select needed columns
$products = Product::select(['id', 'title', 'price', 'vendor_id'])
    ->with('vendor:id,business_name')
    ->get();
```

**3. Use Chunking for Large Datasets:**
```php
Product::chunk(100, function ($products) {
    foreach ($products as $product) {
        // Process each product
    }
});
```

**4. Use Exists Instead of Count:**
```php
// ❌ Slow
if (Product::where('vendor_id', $id)->count() > 0) {}

// ✅ Fast
if (Product::where('vendor_id', $id)->exists()) {}
```

---

## Image Optimization

### ImageOptimizationService

Service located at `app/Services/ImageOptimizationService.php`.

**Features:**
- Automatic image resizing (thumbnail, small, medium, large)
- WebP conversion for modern browsers
- Quality optimization (85% quality)
- Aspect ratio preservation
- Automatic cleanup on failure

**Image Sizes:**
| Size | Dimensions | Use Case |
|------|------------|----------|
| Thumbnail | 150x150 | Admin listings, cart |
| Small | 300x300 | Product cards |
| Medium | 600x600 | Product page thumbnails |
| Large | 1200x1200 | Product page main image |

**Usage:**
```php
use App\Services\ImageOptimizationService;

$imageService = app(ImageOptimizationService::class);

// Upload and optimize
$paths = $imageService->optimizeAndStore($uploadedFile, 'products');
// Returns: ['original' => '...', 'thumbnail' => '...', 'small' => '...', 'webp' => '...']

// Get responsive URLs
$urls = $imageService->getResponsiveUrls($paths['original']);

// Delete all versions
$imageService->deleteImage($paths);
```

**Frontend Usage (Picture Element):**
```html
<picture>
    <source srcset="{{ $urls['webp'] }}" type="image/webp">
    <source srcset="{{ $urls['medium'] }}" type="image/jpeg">
    <img src="{{ $urls['small'] }}" alt="Product" loading="lazy">
</picture>
```

---

## Frontend Optimization

### Code Splitting

Use React.lazy() for non-critical components:

```tsx
import { lazy, Suspense } from 'react';

const ProductReviews = lazy(() => import('@/Components/ProductReviews'));

function ProductPage() {
    return (
        <div>
            {/* Critical content loads immediately */}
            <ProductInfo />

            {/* Reviews load on-demand */}
            <Suspense fallback={<LoadingSpinner />}>
                <ProductReviews />
            </Suspense>
        </div>
    );
}
```

### Inertia Partial Reloads

Optimize data loading by requesting only needed props:

```tsx
import { router } from '@inertiajs/react';

// Only reload products, not entire page
router.reload({ only: ['products'] });

// Reload with preserved scroll position
router.reload({
    only: ['products'],
    preserveScroll: true
});
```

### Image Lazy Loading

```tsx
<img
    src={product.image}
    alt={product.title}
    loading="lazy"
/>
```

---

## Monitoring

### Performance Monitor Middleware

Middleware located at `app/Http/Middleware/PerformanceMonitor.php`.

**Features:**
- Tracks execution time and memory usage
- Logs slow requests (> 1 second)
- Adds performance headers in development mode

**Headers in Development:**
- `X-Execution-Time`: Request execution time in milliseconds
- `X-Memory-Used`: Memory used by request in MB
- `X-Memory-Peak`: Peak memory usage in MB

**Enable Middleware:**

Add to `app/Http/Kernel.php`:
```php
protected $middleware = [
    // ...
    \App\Http\Middleware\PerformanceMonitor::class,
];
```

**Slow Query Logs:**
```
[WARNING] Slow request detected
- Method: GET
- URL: /admin/products
- Execution Time: 1523.45ms
- Memory Used: 12.34MB
```

---

## Scheduled Jobs

### Cleanup Commands

**1. Cleanup Expired Sessions:**
```bash
php artisan cleanup:expired-sessions
```
- Removes sessions older than 7 days
- Schedule: Daily at 2:00 AM

**2. Cleanup Old Activity Logs:**
```bash
php artisan cleanup:old-activity-logs --days=90
```
- Removes activity logs older than specified days
- Schedule: Weekly

**3. Optimize Search Indexes (Laravel Scout):**
```bash
php artisan scout:import "App\Models\Product"
```
- Reindexes all products for search
- Schedule: Weekly

### Schedule Configuration

Add to `app/Console/Kernel.php`:

```php
protected function schedule(Schedule $schedule)
{
    // Clear expired sessions daily
    $schedule->command('cleanup:expired-sessions')
        ->daily()
        ->at('02:00');

    // Cleanup old activity logs weekly
    $schedule->command('cleanup:old-activity-logs --days=90')
        ->weekly()
        ->sundays()
        ->at('03:00');

    // Warm cache daily
    $schedule->command('cache:warm')
        ->daily()
        ->at('01:00');

    // Optimize search indexes weekly
    $schedule->command('scout:import "App\Models\Product"')
        ->weekly()
        ->saturdays()
        ->at('04:00');
}
```

---

## Performance Commands

### Cache Management

**1. Warm Cache:**
```bash
php artisan cache:warm
```
Pre-caches frequently accessed data (categories, homepage, settings).

**2. Clear Product Cache:**
```bash
php artisan cache:clear-product {id}
```
Clears cache for a specific product.

**3. Clear Category Cache:**
```bash
php artisan cache:clear-category {id}
```
Clears cache for a specific category.

**4. Clear All Cache:**
```bash
php artisan cache:clear
```
Clears all application cache.

**5. Optimize Application:**
```bash
php artisan optimize
```
Caches config, routes, and views for production.

**6. Clear Optimization:**
```bash
php artisan optimize:clear
```
Clears all optimization caches.

---

## Deployment Optimization

### PHP Configuration

**php.ini Settings:**
```ini
# Memory
memory_limit = 512M

# Execution
max_execution_time = 300

# OPcache (Critical for Performance)
opcache.enable=1
opcache.enable_cli=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=10000
opcache.revalidate_freq=0
opcache.validate_timestamps=0  # Production only
opcache.fast_shutdown=1
opcache.preload=/path/to/laravel/storage/framework/cache/opcache/preload.php
```

### PHP-FPM Configuration

**pool.conf Settings:**
```ini
pm = dynamic
pm.max_children = 50
pm.start_servers = 10
pm.min_spare_servers = 5
pm.max_spare_servers = 20
pm.max_requests = 1000

# Slow log for debugging
request_slowlog_timeout = 5s
slowlog = /var/log/php-fpm/slow.log
```

### Nginx Configuration

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/laravel/public;

    index index.php;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/javascript application/json application/xml+rss;

    # Browser caching
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;

        # FastCGI cache
        fastcgi_cache_valid 200 60m;
        fastcgi_cache_bypass $http_cache_control;
    }
}
```

### Redis Configuration

**redis.conf:**
```conf
# Memory management
maxmemory 256mb
maxmemory-policy allkeys-lru

# Persistence (optional, not needed for cache-only)
save ""
appendonly no

# Performance
tcp-backlog 511
timeout 0
tcp-keepalive 300
```

### Database Optimization (MySQL)

**my.cnf:**
```ini
[mysqld]
# InnoDB settings
innodb_buffer_pool_size = 2G  # 70-80% of available RAM
innodb_log_file_size = 512M
innodb_flush_method = O_DIRECT
innodb_flush_log_at_trx_commit = 2

# Query cache (MySQL 5.7 and earlier)
query_cache_type = 1
query_cache_size = 128M

# Connection pool
max_connections = 200
thread_cache_size = 50

# Slow query log
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

### Laravel Deployment Checklist

**Before Deployment:**
```bash
# Install dependencies
composer install --optimize-autoloader --no-dev

# Build frontend assets
npm run build

# Run migrations
php artisan migrate --force

# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Warm application cache
php artisan cache:warm

# Link storage
php artisan storage:link

# Set permissions
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

**Environment Variables (.env):**
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

# Use Redis for cache, session, queue
CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Database connection pooling
DB_CONNECTION=mysql
DB_POOL_MIN=2
DB_POOL_MAX=10

# Asset URL (CDN)
ASSET_URL=https://cdn.yourdomain.com
```

### Supervisor Configuration for Queues

**/etc/supervisor/conf.d/laravel-worker.conf:**
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600 --max-jobs=1000
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/path/to/storage/logs/worker.log
stopwaitsecs=3600
```

**Reload supervisor:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start laravel-worker:*
```

### CDN Configuration

**1. Asset CDN (CloudFlare, AWS CloudFront):**

Set in `.env`:
```env
ASSET_URL=https://cdn.yourdomain.com
```

**2. Image CDN:**

Update ImageOptimizationService to use CDN URLs:
```php
public function getResponsiveUrls(string $originalPath): array
{
    $cdnUrl = config('app.cdn_url', config('app.url'));
    // Return CDN URLs instead of local storage URLs
}
```

---

## Performance Metrics to Monitor

### Application Performance
- Average response time: < 200ms
- 95th percentile: < 500ms
- 99th percentile: < 1000ms
- Cache hit rate: > 80%

### Database Performance
- Query execution time: < 100ms average
- Slow queries: < 1% of total queries
- Connection pool usage: < 70%

### Server Resources
- CPU usage: < 70% average
- Memory usage: < 80%
- Disk I/O: Monitor for bottlenecks
- Network bandwidth: Monitor for traffic spikes

---

## Troubleshooting Performance Issues

### Slow Page Load

1. Check Laravel Telescope for slow queries
2. Review performance monitor logs for slow requests
3. Check cache hit rates
4. Verify indexes are being used (EXPLAIN queries)

### High Memory Usage

1. Check for memory leaks in jobs
2. Review chunking in large dataset queries
3. Monitor queue worker memory usage
4. Check image processing queue

### Cache Issues

1. Verify Redis is running: `redis-cli ping`
2. Check Redis memory: `redis-cli info memory`
3. Monitor cache eviction rate
4. Review cache TTL settings

---

## Additional Resources

- [Laravel Performance Best Practices](https://laravel.com/docs/optimization)
- [PHP-FPM Optimization Guide](https://www.php.net/manual/en/install.fpm.configuration.php)
- [Redis Performance Guide](https://redis.io/docs/manual/performance/)
- [MySQL Performance Tuning](https://dev.mysql.com/doc/refman/8.0/en/optimization.html)

---

**Last Updated:** January 2026
**Version:** 1.0
