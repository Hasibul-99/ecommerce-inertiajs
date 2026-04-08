#!/bin/bash
set -e

# =============================================================================
# GrabIt E-commerce - Zero-Downtime Deployment Script
# =============================================================================
# Usage: ./deploy.sh [branch]
# Example: ./deploy.sh main
# =============================================================================

BRANCH="${1:-main}"
APP_DIR="/var/www/html"
RELEASES_DIR="$APP_DIR/releases"
SHARED_DIR="$APP_DIR/shared"
CURRENT_LINK="$APP_DIR/current"
RELEASE_NAME=$(date +%Y%m%d%H%M%S)
RELEASE_DIR="$RELEASES_DIR/$RELEASE_NAME"
KEEP_RELEASES=5

echo "=========================================="
echo "  GrabIt Deployment - $RELEASE_NAME"
echo "  Branch: $BRANCH"
echo "=========================================="

# ---- Step 1: Pre-deployment checks ----
echo "[1/9] Running pre-deployment checks..."

if [ ! -d "$SHARED_DIR" ]; then
    echo "Creating shared directory structure..."
    mkdir -p "$SHARED_DIR/storage/app/public"
    mkdir -p "$SHARED_DIR/storage/framework/cache"
    mkdir -p "$SHARED_DIR/storage/framework/sessions"
    mkdir -p "$SHARED_DIR/storage/framework/views"
    mkdir -p "$SHARED_DIR/storage/logs"
fi

if [ ! -f "$SHARED_DIR/.env" ]; then
    echo "ERROR: $SHARED_DIR/.env not found. Please create it before deploying."
    exit 1
fi

# ---- Step 2: Clone/Pull latest code ----
echo "[2/9] Fetching latest code..."
mkdir -p "$RELEASES_DIR"

if [ -d "$CURRENT_LINK" ] && [ -L "$CURRENT_LINK" ]; then
    cp -r "$(readlink -f $CURRENT_LINK)" "$RELEASE_DIR"
    cd "$RELEASE_DIR"
    git fetch origin
    git reset --hard "origin/$BRANCH"
else
    git clone --depth 1 --branch "$BRANCH" . "$RELEASE_DIR"
    cd "$RELEASE_DIR"
fi

# ---- Step 3: Install PHP dependencies ----
echo "[3/9] Installing Composer dependencies..."
composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# ---- Step 4: Install & build frontend ----
echo "[4/9] Building frontend assets..."
npm ci --production=false
npm run build
rm -rf node_modules

# ---- Step 5: Link shared resources ----
echo "[5/9] Linking shared resources..."
rm -rf "$RELEASE_DIR/storage"
ln -s "$SHARED_DIR/storage" "$RELEASE_DIR/storage"
ln -s "$SHARED_DIR/.env" "$RELEASE_DIR/.env"

# ---- Step 6: Run migrations ----
echo "[6/9] Running database migrations..."
php "$RELEASE_DIR/artisan" migrate --force

# ---- Step 7: Optimize application ----
echo "[7/9] Optimizing application..."
php "$RELEASE_DIR/artisan" config:cache
php "$RELEASE_DIR/artisan" route:cache
php "$RELEASE_DIR/artisan" view:cache
php "$RELEASE_DIR/artisan" event:cache
php "$RELEASE_DIR/artisan" storage:link 2>/dev/null || true

# ---- Step 8: Swap symlink (atomic) ----
echo "[8/9] Activating new release..."
ln -sfn "$RELEASE_DIR" "${CURRENT_LINK}_tmp"
mv -Tf "${CURRENT_LINK}_tmp" "$CURRENT_LINK"

# Restart services
php "$RELEASE_DIR/artisan" queue:restart
sudo supervisorctl restart all 2>/dev/null || true
sudo systemctl reload php8.2-fpm 2>/dev/null || true
sudo systemctl reload nginx 2>/dev/null || true

# ---- Step 9: Cleanup old releases ----
echo "[9/9] Cleaning up old releases..."
cd "$RELEASES_DIR"
ls -1dt */ | tail -n +$((KEEP_RELEASES + 1)) | xargs -r rm -rf

echo ""
echo "=========================================="
echo "  Deployment complete!"
echo "  Release: $RELEASE_NAME"
echo "  Path: $RELEASE_DIR"
echo "=========================================="
