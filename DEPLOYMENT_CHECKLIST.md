# Production Deployment Checklist

## Pre-Deployment

### Code Preparation
- [ ] All features tested and working
- [ ] Database seeders cleaned up (demo data removed)
- [ ] All tests passing
- [ ] Code reviewed and optimized
- [ ] Dependencies updated (security patches)
- [ ] Remove debug code (dd(), dump(), console.log)
- [ ] Remove commented-out code

### Environment Configuration
- [ ] Create production `.env` file
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Generate new `APP_KEY`
- [ ] Configure database credentials
- [ ] Configure Redis credentials (if using)
- [ ] Configure mail settings (SMTP)
- [ ] Set up admin credentials (ADMIN_EMAIL, ADMIN_PASSWORD)
- [ ] Configure payment gateway credentials (Stripe, PayPal)
- [ ] Set up S3 or storage credentials (if using)
- [ ] Configure session and cache drivers

### Security
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set secure session settings
- [ ] Configure rate limiting
- [ ] Set up firewall rules
- [ ] Disable directory listing
- [ ] Set proper file permissions (755 for directories, 644 for files)
- [ ] Secure storage and bootstrap/cache directories (775)
- [ ] Remove or secure phpinfo, test files
- [ ] Configure Content Security Policy headers
- [ ] Enable HSTS (HTTP Strict Transport Security)

### Server Setup
- [ ] PHP 8.1+ installed
- [ ] Required PHP extensions installed:
  - OpenSSL
  - PDO
  - Mbstring
  - Tokenizer
  - XML
  - Ctype
  - JSON
  - BCMath
  - GD or Imagick
  - Redis (if using)
- [ ] Composer installed
- [ ] Node.js and NPM installed
- [ ] MySQL/PostgreSQL database created
- [ ] Redis server running (if using)
- [ ] Web server configured (Nginx/Apache)
- [ ] Queue worker service configured (Supervisor)
- [ ] Cron jobs configured
- [ ] Log rotation configured

## Deployment

### 1. Upload Code
```bash
# Via Git
git clone https://github.com/your-repo/ecommerce.git
cd ecommerce
git checkout main

# Or via FTP/SFTP
# Upload all files except .git, node_modules, vendor
```

### 2. Install Dependencies
```bash
# Install PHP dependencies
composer install --optimize-autoloader --no-dev

# Install Node dependencies and build assets
npm install
npm run build
```

### 3. Configure Environment
```bash
# Copy environment file
cp .env.example .env
nano .env  # Edit with production values

# Generate application key
php artisan key:generate

# Create storage link
php artisan storage:link
```

### 4. Set Permissions
```bash
# Set ownership
sudo chown -R www-data:www-data /path/to/ecommerce
sudo chown -R $USER:www-data /path/to/ecommerce

# Set permissions
sudo chmod -R 755 /path/to/ecommerce
sudo chmod -R 775 /path/to/ecommerce/storage
sudo chmod -R 775 /path/to/ecommerce/bootstrap/cache
```

### 5. Database Setup
```bash
# Run migrations
php artisan migrate --force

# Seed essential data (roles, permissions, settings)
php artisan db:seed --force

# Or combined
php artisan migrate:fresh --seed --force
```

### 6. Optimize Application
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Cache events
php artisan event:cache

# Optimize autoloader
composer dump-autoload --optimize
```

### 7. Start Services
```bash
# Start queue workers (via Supervisor)
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all

# Restart web server
sudo systemctl restart nginx
# OR
sudo systemctl restart apache2
```

## Post-Deployment

### Verification
- [ ] Website loads correctly
- [ ] Admin login works
- [ ] Database connection works
- [ ] Email sending works (test email)
- [ ] File uploads work
- [ ] Queue workers running
- [ ] Cron jobs running
- [ ] SSL certificate valid
- [ ] Payment gateway working
- [ ] Product images loading
- [ ] Search functionality working
- [ ] All pages load without errors

### Initial Setup
- [ ] Login as super admin
- [ ] Change admin password immediately
- [ ] Update admin profile
- [ ] Configure all settings:
  - [ ] General settings (site name, logo, contact)
  - [ ] Payment settings (enable gateways, configure)
  - [ ] Shipping settings (zones, methods, rates)
  - [ ] Email settings (SMTP configuration)
  - [ ] Vendor settings (commission, payout)
  - [ ] Tax settings (enable, rates)
- [ ] Create initial categories
- [ ] Create initial tags
- [ ] Upload hero slides (if using)
- [ ] Test customer registration
- [ ] Test vendor registration
- [ ] Place a test order (entire flow)

### Monitoring Setup
- [ ] Configure error tracking (Sentry, Bugsnag)
- [ ] Set up uptime monitoring (Pingdom, UptimeRobot)
- [ ] Configure log monitoring
- [ ] Set up database backups (automated)
- [ ] Configure file backups (automated)
- [ ] Set up performance monitoring
- [ ] Configure alerts for critical errors
- [ ] Set up server monitoring (CPU, memory, disk)

### Security Hardening
- [ ] Install SSL certificate (Let's Encrypt or commercial)
- [ ] Force HTTPS redirect
- [ ] Configure security headers
- [ ] Set up Web Application Firewall (WAF)
- [ ] Enable fail2ban for SSH
- [ ] Configure database firewall rules
- [ ] Disable unused services
- [ ] Set up intrusion detection
- [ ] Regular security scans scheduled
- [ ] Security patch update schedule

## Ongoing Maintenance

### Daily
- [ ] Check error logs
- [ ] Monitor queue status
- [ ] Check system resources (CPU, memory, disk)

### Weekly
- [ ] Review activity logs
- [ ] Check backup success
- [ ] Review security logs
- [ ] Monitor site performance
- [ ] Check for pending vendor approvals
- [ ] Review COD reconciliations

### Monthly
- [ ] Update dependencies (security patches)
- [ ] Review and archive old logs
- [ ] Database optimization
- [ ] Review and clean old data
- [ ] Performance audit
- [ ] Security audit
- [ ] Backup verification (restore test)

## Supervisor Configuration

Create `/etc/supervisor/conf.d/ecommerce-worker.conf`:

```ini
[program:ecommerce-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/ecommerce/artisan queue:work redis --sleep=3 --tries=3 --max-time=3600
autostart=true
autorestart=true
stopasgroup=true
killasgroup=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/path/to/ecommerce/storage/logs/worker.log
stopwaitsecs=3600
```

## Cron Configuration

Add to crontab (`crontab -e`):

```bash
* * * * * cd /path/to/ecommerce && php artisan schedule:run >> /dev/null 2>&1
```

## Nginx Configuration Example

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com;
    root /path/to/ecommerce/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.1-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }

    ssl_certificate /path/to/ssl/fullchain.pem;
    ssl_certificate_key /path/to/ssl/privkey.pem;
}
```

## Rollback Procedure

If deployment fails:

1. **Keep current code accessible:**
   ```bash
   cp -r /path/to/ecommerce /path/to/ecommerce-backup-$(date +%Y%m%d)
   ```

2. **Restore previous version:**
   ```bash
   git checkout previous-stable-tag
   composer install --no-dev
   npm run build
   ```

3. **Rollback database if needed:**
   ```bash
   # Restore from backup
   mysql -u username -p database_name < backup.sql
   ```

4. **Clear caches:**
   ```bash
   php artisan optimize:clear
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

## Support Contacts

- **Hosting Provider:** [Contact info]
- **Domain Registrar:** [Contact info]
- **SSL Certificate Provider:** [Contact info]
- **Payment Gateway Support:** [Contact info]
- **Development Team:** [Contact info]

## Emergency Procedures

### Site Down
1. Check web server status: `sudo systemctl status nginx`
2. Check PHP-FPM status: `sudo systemctl status php8.1-fpm`
3. Check error logs: `tail -f storage/logs/laravel.log`
4. Check Nginx logs: `tail -f /var/log/nginx/error.log`

### Database Issues
1. Check connection: `php artisan tinker --execute="DB::connection()->getPdo();"`
2. Check MySQL status: `sudo systemctl status mysql`
3. Check disk space: `df -h`

### Queue Not Processing
1. Check supervisor: `sudo supervisorctl status`
2. Restart workers: `sudo supervisorctl restart all`
3. Check queue connection: `php artisan queue:work --once`

---

**Last Updated:** January 22, 2026
**Version:** 1.0
**Environment:** Production Deployment Guide
