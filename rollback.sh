#!/bin/bash
set -e

# =============================================================================
# GrabIt E-commerce - Rollback Script
# =============================================================================
# Usage: ./rollback.sh [steps]
# Example: ./rollback.sh      (rollback 1 release)
# Example: ./rollback.sh 2    (rollback 2 releases)
# =============================================================================

STEPS="${1:-1}"
APP_DIR="/var/www/html"
RELEASES_DIR="$APP_DIR/releases"
CURRENT_LINK="$APP_DIR/current"

echo "=========================================="
echo "  GrabIt Rollback"
echo "  Steps: $STEPS"
echo "=========================================="

# Get current release
CURRENT_RELEASE=$(readlink -f "$CURRENT_LINK" 2>/dev/null | xargs basename 2>/dev/null || echo "none")
echo "Current release: $CURRENT_RELEASE"

# List available releases (newest first)
RELEASES=($(ls -1dt "$RELEASES_DIR"/*/ 2>/dev/null | xargs -I{} basename {}))
TOTAL_RELEASES=${#RELEASES[@]}

if [ "$TOTAL_RELEASES" -lt 2 ]; then
    echo "ERROR: Not enough releases to rollback. Found: $TOTAL_RELEASES"
    exit 1
fi

# Find current release index
CURRENT_INDEX=-1
for i in "${!RELEASES[@]}"; do
    if [ "${RELEASES[$i]}" = "$CURRENT_RELEASE" ]; then
        CURRENT_INDEX=$i
        break
    fi
done

if [ "$CURRENT_INDEX" -eq -1 ]; then
    echo "WARNING: Could not determine current release index. Using second newest."
    TARGET_INDEX=1
else
    TARGET_INDEX=$((CURRENT_INDEX + STEPS))
fi

if [ "$TARGET_INDEX" -ge "$TOTAL_RELEASES" ]; then
    echo "ERROR: Cannot rollback $STEPS steps. Only $((TOTAL_RELEASES - CURRENT_INDEX - 1)) older releases available."
    echo "Available releases:"
    for i in "${!RELEASES[@]}"; do
        marker=""
        [ "${RELEASES[$i]}" = "$CURRENT_RELEASE" ] && marker=" <-- current"
        echo "  ${RELEASES[$i]}$marker"
    done
    exit 1
fi

TARGET_RELEASE="${RELEASES[$TARGET_INDEX]}"
TARGET_DIR="$RELEASES_DIR/$TARGET_RELEASE"

echo "Rolling back to: $TARGET_RELEASE"
echo ""

# Confirm
read -p "Are you sure? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Rollback cancelled."
    exit 0
fi

# Swap symlink
ln -sfn "$TARGET_DIR" "${CURRENT_LINK}_tmp"
mv -Tf "${CURRENT_LINK}_tmp" "$CURRENT_LINK"

# Clear caches and restart
php "$TARGET_DIR/artisan" config:cache
php "$TARGET_DIR/artisan" route:cache
php "$TARGET_DIR/artisan" view:cache
php "$TARGET_DIR/artisan" queue:restart
sudo supervisorctl restart all 2>/dev/null || true
sudo systemctl reload php8.2-fpm 2>/dev/null || true
sudo systemctl reload nginx 2>/dev/null || true

echo ""
echo "=========================================="
echo "  Rollback complete!"
echo "  Now active: $TARGET_RELEASE"
echo "=========================================="
echo ""
echo "NOTE: If migrations were run in the failed release,"
echo "you may need to manually rollback migrations:"
echo "  php $TARGET_DIR/artisan migrate:rollback"
