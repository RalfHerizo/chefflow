#!/usr/bin/env sh
set -eu

# Default to 8080 if PORT is not provided
: "${PORT:=8080}"

# Ensure Laravel runtime directories exist and are writable
mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs
chown -R www-data:www-data storage bootstrap/cache

# Render nginx config with the runtime PORT
envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

# Run migrations on container start (retry if DB not ready yet)
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

exec "$@"