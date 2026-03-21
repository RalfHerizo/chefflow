# syntax=docker/dockerfile:1.7

FROM composer:2.7 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader --no-scripts

FROM node:20-bookworm AS frontend
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY resources/ ./resources/
COPY public/ ./public/
COPY vite.config.js tailwind.config.js postcss.config.js jsconfig.json ./
RUN npm run build

FROM php:8.2-fpm-bookworm AS app
WORKDIR /var/www/html

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        nginx \
        supervisor \
        git \
        unzip \
        libzip-dev \
        libonig-dev \
        libpng-dev \
        libjpeg-dev \
        libxml2-dev \
        libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install \
        bcmath \
        gd \
        pdo_mysql \
        zip \
        mbstring \
        xml \
        ctype \
        fileinfo \
    && rm -rf /var/lib/apt/lists/*

COPY . ./
COPY --from=vendor /app/vendor ./vendor
COPY --from=frontend /app/public/build ./public/build
COPY docker/entrypoint.sh /usr/local/bin/entrypoint

RUN php artisan package:discover --ansi --no-interaction

RUN rm -f /etc/nginx/sites-enabled/default \
    && printf '%s\n' \
        'server {' \
        '    listen 9000;' \
        '    server_name _;' \
        '    root /var/www/html/public;' \
        '    index index.php index.html;' \
        '    location / {' \
        '        try_files \$uri \$uri/ /index.php?\$query_string;' \
        '    }' \
        '    location ~ \\.php$ {' \
        '        include fastcgi_params;' \
        '        fastcgi_param SCRIPT_FILENAME \$document_root\$fastcgi_script_name;' \
        '        fastcgi_pass 127.0.0.1:9000;' \
        '    }' \
        '    location ~ /\\.(?!well-known).* {' \
        '        deny all;' \
        '    }' \
        '}' \
        > /etc/nginx/conf.d/default.conf \
    && printf '%s\n' \
        '[supervisord]' \
        'nodaemon=true' \
        '' \
        '[program:php-fpm]' \
        'command=/usr/local/sbin/php-fpm -F' \
        'autostart=true' \
        'autorestart=true' \
        'stdout_logfile=/dev/stdout' \
        'stderr_logfile=/dev/stderr' \
        '' \
        '[program:nginx]' \
        'command=/usr/sbin/nginx -g "daemon off;"' \
        'autostart=true' \
        'autorestart=true' \
        'stdout_logfile=/dev/stdout' \
        'stderr_logfile=/dev/stderr' \
        > /etc/supervisor/supervisord.conf \
    && chmod +x /usr/local/bin/entrypoint \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_DEBUG=false \
    PHP_OPCACHE_VALIDATE_TIMESTAMPS=0

EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/supervisord.conf"]
