# ChefFlow

[![CI](https://github.com/RalfHerizo/chefflow/actions/workflows/ci.yml/badge.svg)](https://github.com/RalfHerizo/chefflow/actions/workflows/ci.yml)

ChefFlow is a SaaS web app for restaurant operations: sales, inventory tracking, and quick dashboard insights.

## Live Demo

**[chefflow.onrender.com](https://chefflow.onrender.com)** — **no sign-up required**: click
**"Démo en direct"** on the landing page (or visit `/demo`) to enter a shared, pre-seeded demo
account. Hosted on Render via Docker + SQLite (free tier, so the first request after a period of
inactivity can take ~1 min to wake). See the Deployment section below for details.

## Product Status (Current Progress)

### Done
- [x] Laravel + Inertia + React foundation with auth pages.
- [x] Modern app shell: fixed sidebar + top header + content area.
- [x] Dynamic top header title/subtitle by current Inertia page.
- [x] Containerized deploy (Docker), now hosted on Render + SQLite (free tier, self-seeding demo).
- [x] Dashboard sales form to register product sales.
- [x] Recent orders table with action to cancel an order.
- [x] Confirmation modal for order cancellation (no browser alert).
- [x] Weekly revenue chart (last 7 days) with Recharts.
- [x] Ingredient inventory page with Shadcn table.
- [x] Ingredient create/edit forms in Shadcn dialog.
- [x] Confirmation modal for ingredient deletion (no browser alert).
- [x] Ingredient status badge: `Critique` if stock <= threshold, else `Stable`.
- [x] Ingredient image URL field in form.
- [x] Ingredient thumbnail displayed next to ingredient name.
- [x] Products module completed: list/create/edit/delete.
- [x] Product preview modal with recipe details.
- [x] Product status toggle (`Actif` / `Inactif`) from list view.
- [x] Product Builder with dynamic recipe lines (ingredient + amount).
- [x] Smart input units in recipe builder (`kg/g`, `L/ml`, `pcs`) with conversion to backend base unit.
- [x] Human-readable amount preview (`0.004 kg` shown as `4 g`).
- [x] Product image upload support in create/edit forms.
- [x] Multi-image product gallery (up to 4 images) with previews; first image is the main image.
- [x] Edit product gallery: remove existing images and append new ones without wiping.
- [x] Product gallery previews in products list and POS modal.
- [x] Feature tests for recent product and ingredient workflows.
- [x] Cart system (order_items) with multi-product orders and stock deduction per recipe.
- [x] POS page for visual ordering with search, categories, price range slider, and cart.
- [x] Cart persistence via React Context + LocalStorage.
- [x] Header cart badge with live count and ping feedback.
- [x] Toast redesign (top-center banner with status icons).
- [x] POS product detail modal with ingredient badges, gallery previews, and quick add button.
- [x] Multi-product order tests (cart stock + total price).
- [x] StoreOrderRequest validation layer for cart payload.
- [x] Form Requests extended to ingredients and products for controller validation.
- [x] Frontend tests (Vitest + RTL) for cart and POS flows.
- [x] Multi-tenancy: per-account data isolation via the `BelongsToTenant` trait, with tenant-scoped validation.
- [x] No-login demo account (`/demo`) with one-click reset; account settings hidden for the demo.
- [x] Low-stock alerts: dashboard + ingredients panel (top 3 + overflow link) and a sidebar badge.
- [x] Derived product availability (`Rupture`) when an ingredient can no longer cover one unit; blocked in the POS.
- [x] Category filter on the products list.
- [x] Real global search in the header (products, ingredients, orders).
- [x] Orders history page with search, period filter, sorting and pagination.
- [x] Analytics page: KPIs with deltas, revenue trend, revenue by category, best sellers, 7/30/90-day window.
- [x] Continuous integration (GitHub Actions): Pint, Pest, Vitest and the production build on every push.

### In Progress / Next
- [ ] Replace the image URL input with drag-and-drop upload.
- [ ] Ingredient cost field → stock valuation (€) and per-product margins.
- [ ] CSV / PDF export of sales.

## Main Features

- Dashboard:
  - Register sales (`orders.store`).
  - Show recent orders.
  - Cancel order and restore stock.
  - Show weekly revenue chart.
  - Inventory status grid (ingredients).
- Inventory (Ingredients):
  - List all ingredients.
  - Create, update, delete ingredients.
  - Show stock health by threshold.
  - Store and display ingredient image URL.
- Products:
  - List products with actions: preview, edit, delete.
  - Toggle product active status directly from table.
  - Build and edit recipe lines with per-ingredient quantity.
  - Convert entered quantities to backend base units before submit.
  - Upload product gallery (up to 4 images) with previews and main image.
  - Remove/replace product images without losing existing ones.
- POS / Sales:
  - Visual product grid with search, category filter, and price range slider.
  - Product detail modal with ingredient badges and gallery previews.
  - Cart with quantity controls, totals HT/TVA/TTC, and clear confirmation.
  - Cart badge in header with live updates.
  - Toast feedback for add/remove/submit actions.
  - Products whose recipe can no longer be made are flagged `Rupture` and cannot be added.
- Analytics:
  - KPIs (revenue, orders, average basket, items sold) with period-over-period deltas.
  - Daily revenue trend, revenue by product category, and best sellers by revenue.
  - Switchable 7 / 30 / 90-day window.
- Global search:
  - Header typeahead across products, ingredients and orders (tenant-scoped).
- Demo & multi-tenancy:
  - Per-account data isolation (`BelongsToTenant`) — each account is one restaurant.
  - No-login demo account at `/demo` with one-click reset.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: React 18 + Inertia.js
- UI: Tailwind CSS + Shadcn UI (Radix primitives)
- Charts: Recharts
- Icons: Lucide React
- Tests: Pest + Vitest (React Testing Library)
- CI: GitHub Actions (Pint, Pest, Vitest, build) — see badge above
- Deployment: Docker on Render (SQLite, free tier)

## Key Routes

- `GET /dashboard` -> dashboard page
- `POST /orders` -> register sale
- `DELETE /orders/{order}` -> cancel order
- `GET /ingredients` -> ingredient index
- `POST /ingredients` -> create ingredient
- `PATCH /ingredients/{ingredient}` -> update ingredient
- `DELETE /ingredients/{ingredient}` -> delete ingredient
- `GET /products` -> products index
- `GET /products/create` -> product create page
- `POST /products` -> store product with recipe
- `GET /products/{product}/edit` -> product edit page
- `PATCH /products/{product}` -> update product
- `PATCH /products/{product}/toggle-status` -> toggle status
- `DELETE /products/{product}` -> delete product
- `GET /orders/pos` -> POS ordering page
- `GET /orders` -> orders history (search, filter, pagination)
- `GET /analytics` -> sales analytics page
- `GET /search` -> global search (JSON, header typeahead)
- `GET /demo` -> no-login demo (logs into the shared demo account)

## Setup

From `chefflow/`:

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

## Run (Development)

From `chefflow/`:

```bash
composer run dev
```

## Build and Test

```bash
npm run build
npm test
php artisan test
```

Code style (Laravel Pint):

```bash
vendor/bin/pint        # fix
vendor/bin/pint --test # check only (used in CI)
```

Everything above (Pint, Pest, Vitest, build) also runs in CI on every push — see the badge at the top.

Targeted suites added for latest features:

```bash
php artisan test tests/Feature/ProductManagementTest.php
php artisan test tests/Feature/IngredientManagementTest.php
php artisan test tests/Feature/StockActionTest.php
php artisan test tests/Feature/OrderHistoryTest.php
php artisan test tests/Feature/OrderIntegrationTest.php
```

## Notes

- Prices are stored as integers (cents) to avoid floating-point issues.
- Ingredient stock uses decimal precision.
- Current UX uses confirmation dialogs for destructive actions.
- Form Requests now cover orders, ingredients, and products; remaining controllers are future work.
- Orders now use an order_items cart model to support multiple products per sale.
- Data is isolated per account (one account = one restaurant) via the `BelongsToTenant` trait.

## Live Demo (no sign-up)

Recruiters can try the app without creating an account:

- Click **"Démo en direct"** on the landing page, or visit `/demo` directly.
- This logs into a shared, pre-seeded demo account (ingredients, products,
  recipes and a week of orders) and lands on the dashboard.
- A demo banner offers a **"Réinitialiser"** button to restore the sample
  data at any time. The demo account cannot change its password or be
  deleted.

The demo dataset lives in `database/seeders/DemoSeeder.php`. The demo
account email is configurable via `DEMO_EMAIL` (`config/demo.php`).

## Deployment (Render + SQLite, free tier)

The demo runs on Render using the existing `Dockerfile` and **SQLite**, so
no database service is required.

1. Generate an app key locally: `php artisan key:generate --show`.
2. On Render: **New + → Blueprint**, pick this repo (`render.yaml` is the
   blueprint). Set the `APP_KEY` and `APP_URL` env vars in the dashboard.
3. Deploy. On boot, `docker/entrypoint.sh` runs migrations and re-seeds the
   demo (`SEED_DEMO=true`), so the SQLite file is always provisioned.

Free-tier caveats (acceptable for a portfolio): the service spins down after
~15 min idle (first request takes ~1 min), and the SQLite file is ephemeral —
any data created during a session is reset to the seed on the next restart.

Run locally on SQLite:

```bash
DB_CONNECTION=sqlite DB_DATABASE=$(pwd)/database/database.sqlite \
  php artisan migrate:fresh --force
php artisan db:seed --class=DemoSeeder --force
```
