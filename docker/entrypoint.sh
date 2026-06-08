#!/usr/bin/env sh
set -eu

# Default to 8080 if PORT is not provided
: "${PORT:=8080}"
: "${RUN_MIGRATIONS:=true}"
: "${SEED_DEMO:=false}"

# Ensure Laravel runtime directories exist and are writable
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
chown -R www-data:www-data storage bootstrap/cache

# Ensure the SQLite database file exists (demo deployment on ephemeral disk)
if [ "${DB_CONNECTION:-}" = "sqlite" ]; then
  DB_FILE="${DB_DATABASE:-/var/www/html/database/database.sqlite}"
  mkdir -p "$(dirname "$DB_FILE")"
  [ -f "$DB_FILE" ] || touch "$DB_FILE"
  chown -R www-data:www-data "$(dirname "$DB_FILE")"
fi

# Render nginx config with the runtime PORT
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Ensure storage symlink exists for public assets
if [ ! -e public/storage ]; then
  php artisan storage:link || true
fi

# Run migrations on container start (retry if DB not ready yet)
if [ "$RUN_MIGRATIONS" != "false" ]; then
  max_retries=10
  retry=1

  while [ $retry -le $max_retries ]; do
    if php artisan migrate --force; then
      break
    fi
    echo "Migration attempt $retry/$max_retries failed. Retrying in 3s..." >&2
    retry=$((retry + 1))
    sleep 3
  done

  if [ $retry -gt $max_retries ]; then
    echo "Migrations failed after $max_retries attempts." >&2
    exit 1
  fi
fi

# Seed / refresh the shared demo account on boot (self-resetting demo data)
if [ "$SEED_DEMO" = "true" ]; then
  php artisan db:seed --class=DemoSeeder --force || echo "Demo seeding failed (continuing)." >&2
fi

exec "$@"
