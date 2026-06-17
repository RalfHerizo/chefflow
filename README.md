# 🍳 ChefFlow

**Restaurant operations in one place** — point of sale, recipes, ingredient stock and live sales analytics, built as a modern multi-tenant SaaS.

[![CI](https://github.com/RalfHerizo/chefflow/actions/workflows/ci.yml/badge.svg)](https://github.com/RalfHerizo/chefflow/actions/workflows/ci.yml)
![Laravel](https://img.shields.io/badge/Laravel-12-FF2D20?logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-8.2-777BB4?logo=php&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![License: MIT](https://img.shields.io/badge/license-MIT-green)

> **▶ Live demo — no sign-up: [chefflow.onrender.com](https://chefflow.onrender.com)**
> Click **“Démo en direct”** (or open `/demo`) to land straight in a fully seeded restaurant.

ChefFlow lets a restaurant take orders at the till, manage its menu and recipes, track
ingredient stock in real time, and read its sales performance at a glance. Every account is
fully isolated — **one account, one restaurant**.

---

## ✨ Highlights

- 🧾 **Stock-aware point of sale** — visual product grid, cart with HT/VAT/TTC totals; products whose recipe can no longer be made are flagged **`Rupture`** and can't be sold.
- 📦 **Recipe-driven inventory** — each sale deducts the recipe's ingredients; a low-stock panel and a sidebar badge surface what to reorder first.
- 📊 **Sales analytics** — revenue trend, revenue by category, best sellers and KPIs with period-over-period deltas, over a switchable 7 / 30 / 90-day window.
- 🔎 **Global search** — instant header typeahead across products, ingredients and orders.
- 🏢 **Multi-tenant by design** — strict per-account isolation through a global scope, enforced down to validation.
- ✅ **Tested & CI-checked** — Pest + Vitest suites and a GitHub Actions pipeline (Pint, tests, build) on every push.
- 🎭 **One-click demo** — a no-login shared account, resettable in one click, made for reviewers.

## 🚀 Features

**Point of sale**
- Visual product grid with search, category filter and a price-range slider.
- Product detail modal with ingredient badges and image gallery.
- Cart with quantity controls, HT / VAT / TTC totals and a clear-cart confirmation.
- Live header cart badge; toast feedback on every action.
- Out-of-stock products are flagged `Rupture` and blocked from the cart.

**Inventory (ingredients)**
- Full CRUD with search, status filter and sorting.
- Stock health badge (`Critique` / `Stable`) against a per-ingredient threshold.
- “À réapprovisionner” panel (top 3 + overflow) on the dashboard and the ingredients page.

**Products & recipes**
- Product CRUD with a recipe builder (ingredient + amount per line).
- Smart input units (`kg/g`, `L/ml`, `pcs`) converted to a base unit before submit.
- Multi-image gallery (up to 4), category filter and an active/inactive toggle.

**Analytics**
- KPIs: revenue, orders, average basket, items sold — each with a delta vs. the previous window.
- Daily revenue trend, revenue by product category and best sellers by revenue.

**Sales & orders**
- Cart checkout (`order_items`) supporting multiple products per sale with transactional stock deduction.
- Orders history with search, period filter, sorting and pagination; cancel-and-restore-stock.

**Platform**
- No-login demo account (`/demo`) with one-click reset; account settings hidden for the demo.
- Per-account data isolation via the `BelongsToTenant` trait.

<details>
<summary>Full feature checklist</summary>

- [x] Laravel + Inertia + React foundation with auth pages (Breeze).
- [x] App shell: fixed sidebar + dynamic top header + content area.
- [x] Dashboard: register sales, recent orders, cancel + restore stock, weekly revenue chart, inventory grid.
- [x] Ingredient CRUD, status badges, image URL + thumbnail, search/sort/filter.
- [x] Product CRUD, preview modal, active toggle, recipe builder with unit conversion and human-readable preview.
- [x] Product image upload + multi-image gallery (up to 4) with add/remove/replace.
- [x] Cart (`order_items`) with multi-product orders and per-recipe stock deduction.
- [x] POS page: search, categories, price slider, cart, detail modal, quick add.
- [x] Cart persistence (React Context + LocalStorage), header cart badge, toast redesign.
- [x] Form Requests for orders, ingredients and products (French messages).
- [x] Multi-tenancy: per-account isolation via `BelongsToTenant`, with tenant-scoped validation.
- [x] No-login demo account (`/demo`) with one-click reset; settings hidden for the demo.
- [x] Low-stock alerts: dashboard + ingredients panel (top 3 + overflow) and a sidebar badge.
- [x] Derived product availability (`Rupture`) — blocked in the POS when stock can't cover one unit.
- [x] Category filter on the products list.
- [x] Real global search in the header (products, ingredients, orders).
- [x] Orders history page with search, period filter, sorting and pagination.
- [x] Analytics page: KPIs with deltas, revenue trend, revenue by category, best sellers, 7/30/90-day window.
- [x] Pest + Vitest test suites; CI (GitHub Actions) running Pint, tests and the build on every push.
- [x] Containerized deploy (Docker) on Render + SQLite (free tier, self-seeding demo).

**Next**
- [ ] Drag-and-drop image upload (replace the URL input).
- [ ] Ingredient cost field → stock valuation (€) and per-product margins.
- [ ] CSV / PDF export of sales.

</details>

## 🖥️ Live demo (no sign-up)

Reviewers can try the full app without creating an account:

- Open **[chefflow.onrender.com](https://chefflow.onrender.com)** and click **“Démo en direct”**, or visit `/demo` directly.
- You're logged into a shared, pre-seeded account (ingredients, products, recipes and a week of orders) and land on the dashboard.
- A demo banner offers a **“Réinitialiser”** button to restore the sample data anytime. The demo account can't change its password or be deleted.

> ⏱️ The free Render tier spins the service down after ~15 min idle, so the **first request can take ~1 min** to wake. Data created during a session resets to the seed on the next restart.

## 🧱 Tech stack

| Layer | Choices |
| --- | --- |
| Backend | Laravel 12, PHP 8.2, Inertia 2, Sanctum 4, Ziggy 2 |
| Frontend | React 18 + Inertia (JSX), Tailwind CSS 3, shadcn/ui (Radix) |
| Data viz / UI | Recharts, Lucide, Framer Motion, react-hot-toast |
| Tests | Pest 3 (PHP) · Vitest 4 + React Testing Library (JS) |
| Tooling | Laravel Pint, Vite |
| CI / Deploy | GitHub Actions · Docker on Render (SQLite) |

## 🏗️ Architecture & conventions

- **Multi-tenancy** — `BelongsToTenant` adds a global scope so every query is filtered by `user_id`, and new records inherit the owner. One account = one restaurant.
- **Business logic in Actions** — multi-model transactions live in `app/Actions/*Action.php` (e.g. `SellProductAction`), keeping controllers thin.
- **Validation in Form Requests** — `app/Http/Requests` with French error messages; `exists` rules are tenant-scoped.
- **Money as integer cents** — prices are stored as integers to avoid floating-point drift; ingredient stock uses decimals.
- **No browser dialogs** — destructive actions go through a styled confirmation dialog.
- **Quality gates** — Pest + Vitest + Pint, all enforced in CI on every push.

## ⚙️ Getting started

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
npm install
```

Run everything (server, queue, logs, Vite) in one command:

```bash
composer run dev
```

## 🧪 Testing & code quality

```bash
php artisan test        # Pest (PHP)
npm test                # Vitest (JS)
npm run build           # production build
vendor/bin/pint         # format (use --test to check only)
```

All of the above run automatically in **CI** on every push — see the badge at the top.

## ☁️ Deployment (Render + SQLite, free tier)

The demo runs on Render using the repo's `Dockerfile` and **SQLite**, so no database service is required.

1. Generate an app key locally: `php artisan key:generate --show`.
2. On Render: **New + → Blueprint**, pick this repo (`render.yaml` is the blueprint). Set `APP_KEY` and `APP_URL` in the dashboard.
3. Deploy. On boot, `docker/entrypoint.sh` runs migrations and re-seeds the demo (`SEED_DEMO=true`), so the SQLite file is always provisioned.

Run locally on SQLite:

```bash
DB_CONNECTION=sqlite DB_DATABASE=$(pwd)/database/database.sqlite \
  php artisan migrate:fresh --force
php artisan db:seed --class=DemoSeeder --force
```

## 📄 License

Released under the **MIT** License.
