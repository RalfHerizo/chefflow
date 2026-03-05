# ChefFlow

ChefFlow is a SaaS web app for restaurant operations: sales, inventory tracking, and quick dashboard insights.

## Product Status (Current Progress)

### Done
- [x] Laravel + Inertia + React foundation with auth pages.
- [x] Modern app shell: fixed sidebar + top header + content area.
- [x] Dynamic top header title/subtitle by current Inertia page.
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

### In Progress / Next
- [ ] Replace image URL input with drag and drop upload.
- [ ] Product management pages (list/create/edit/delete).
- [ ] Orders list page with filtering and pagination.
- [ ] Better analytics and reporting blocks.
- [ ] Notifications workflow (stock alerts).

## Main Features

- Dashboard:
  - Register sales (`products.sell`).
  - Show recent orders.
  - Cancel order and restore stock.
  - Show weekly revenue chart.
- Inventory (Ingredients):
  - List all ingredients.
  - Create, update, delete ingredients.
  - Show stock health by threshold.
  - Store and display ingredient image URL.

## Tech Stack

- Backend: Laravel 12, PHP 8.2+
- Frontend: React 18 + Inertia.js
- UI: Tailwind CSS + Shadcn UI (Radix primitives)
- Charts: Recharts
- Icons: Lucide React
- Tests: Pest

## Key Routes

- `GET /dashboard` -> dashboard page
- `POST /sell` -> register sale
- `DELETE /orders/{order}` -> cancel order
- `GET /ingredients` -> ingredient index
- `POST /ingredients` -> create ingredient
- `PATCH /ingredients/{ingredient}` -> update ingredient
- `DELETE /ingredients/{ingredient}` -> delete ingredient

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

Option 1 (recommended from `chefflow/`):

```bash
composer run dev
```

Option 2 (Windows helper from repository root):

```bat
run.bat
```

## Build and Test

```bash
npm run build
php artisan test
```

## Notes

- Prices are stored as integers (cents) to avoid floating-point issues.
- Ingredient stock uses decimal precision.
- Current UX uses confirmation dialogs for destructive actions.
