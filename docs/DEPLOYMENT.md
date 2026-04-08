# Deployment Guide

## Server Requirements

- **OS**: Ubuntu 22.04+ / Debian 12+ (or any Linux with Docker support)
- **PHP**: 8.1+ with extensions: BCMath, Ctype, Fileinfo, GD, Intl, JSON, Mbstring, OpenSSL, PDO, PDO_MySQL, Redis, Tokenizer, XML, Zip
- **Node.js**: 18+ (build only, not needed at runtime)
- **MySQL**: 8.0+
- **Redis**: 7+
- **Meilisearch**: 1.6+
- **Nginx**: 1.25+
- **Supervisor**: 4+ (for queue workers)

**Minimum Specs**: 2 CPU cores, 4GB RAM, 40GB SSD

## Docker Deployment (Recommended)

### 1. Prepare Environment

```bash
# Clone repository
git clone <repo-url> /opt/grabit
cd /opt/grabit

# Create production .env
cp .env.example .env
# Edit .env with production values (see Environment Variables below)
```

### 2. Build and Start

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 3. Initialize Application

```bash
docker-compose -f docker-compose.prod.yml exec app php artisan migrate --force
docker-compose -f docker-compose.prod.yml exec app php artisan db:seed --class=SettingsSeeder --force
docker-compose -f docker-compose.prod.yml exec app php artisan storage:link
docker-compose -f docker-compose.prod.yml exec app php artisan scout:import "App\Models\Product"
```

## Traditional Deployment

### 1. Install System Packages

```bash
sudo apt update
sudo apt install -y php8.2-fpm php8.2-cli php8.2-common php8.2-mysql \
    php8.2-zip php8.2-gd php8.2-mbstring php8.2-curl php8.2-xml \
    php8.2-bcmath php8.2-intl php8.2-redis \
    nginx supervisor redis-server mysql-server
```

### 2. Configure Nginx

Copy `nginx/default.conf` to `/etc/nginx/sites-available/grabit` and update:
- `server_name` to your domain
- Add SSL configuration (see below)

```bash
sudo ln -s /etc/nginx/sites-available/grabit /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 3. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

### 4. Configure Supervisor

Copy `docker/supervisord.conf` to `/etc/supervisor/conf.d/grabit.conf`, adjusting paths and removing the `php-fpm` section (systemd handles that).

```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

### 5. Configure Cron

```bash
# Add to crontab
* * * * * cd /var/www/html/current && php artisan schedule:run >> /dev/null 2>&1
```

## Zero-Downtime Deployment

Use the provided `deploy.sh` script:

```bash
# First deployment - set up shared directory
mkdir -p /var/www/html/shared
cp .env /var/www/html/shared/.env
mkdir -p /var/www/html/shared/storage/{app/public,framework/{cache,sessions,views},logs}

# Deploy
chmod +x deploy.sh
./deploy.sh main
```

The script:
1. Clones the latest code into a timestamped release directory
2. Installs Composer and npm dependencies, builds frontend
3. Links shared storage and .env
4. Runs migrations
5. Caches config, routes, views, events
6. Atomically swaps the `current` symlink
7. Restarts queue workers
8. Cleans up old releases (keeps last 5)

### Rollback

```bash
chmod +x rollback.sh
./rollback.sh      # Rollback 1 release
./rollback.sh 2    # Rollback 2 releases
```

## Environment Variables

### Required

| Variable | Description |
|----------|-------------|
| `APP_KEY` | Application encryption key (`php artisan key:generate`) |
| `APP_URL` | Full application URL (https://yourdomain.com) |
| `DB_DATABASE` | MySQL database name |
| `DB_USERNAME` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `REDIS_HOST` | Redis server host |
| `MEILISEARCH_HOST` | Meilisearch URL |
| `MEILISEARCH_KEY` | Meilisearch master key |
| `MAIL_HOST` | SMTP server |
| `MAIL_USERNAME` | SMTP username |
| `MAIL_PASSWORD` | SMTP password |

### Production Settings

```env
APP_ENV=production
APP_DEBUG=false
LOG_LEVEL=warning

CACHE_DRIVER=redis
SESSION_DRIVER=redis
QUEUE_CONNECTION=redis

# Stripe
STRIPE_KEY=pk_live_...
STRIPE_SECRET=sk_live_...
```

## Performance Optimization

```bash
# Cache everything
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan event:cache

# Pre-warm application cache
php artisan cache:warm

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=256
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0
```

## Monitoring

### Health Check

```
GET /health  -> 200 OK (when app is running)
```

### Log Locations

| Log | Location |
|-----|----------|
| Application | `storage/logs/laravel.log` |
| Queue workers | `storage/logs/queue-worker.log` |
| Notifications queue | `storage/logs/queue-notifications.log` |
| Scheduler | `storage/logs/scheduler.log` |
| Nginx access | `/var/log/nginx/access.log` |
| Nginx errors | `/var/log/nginx/error.log` |

### Security Audit

```bash
php artisan security:audit              # Console output
php artisan security:audit --format=json # JSON output
php artisan security:audit --format=html # HTML report
```

## Backup Strategy

### Database

```bash
# Daily MySQL backup
mysqldump -u $DB_USERNAME -p$DB_PASSWORD $DB_DATABASE | gzip > backup_$(date +%Y%m%d).sql.gz
```

### Media Files

```bash
# Sync storage to backup location
rsync -avz storage/app/public/ /backups/media/
```

Automate both with cron and store backups off-server (S3, separate backup server).

## CI/CD

GitHub Actions is configured in `.github/workflows/tests.yml`:
- Runs PHPUnit tests on PHP 8.1 and 8.2
- Installs Composer and npm dependencies
- Builds frontend assets
- Triggers on push and pull request to main

For automated deployments, add a deploy workflow that SSH-es into your server and runs `deploy.sh` after tests pass.
