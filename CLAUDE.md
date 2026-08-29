# CLAUDE.md — ChefFlow

SaaS Laravel + Inertia/React pour la gestion de restaurant (POS, recettes, stocks d'ingrédients, dashboard).
Pour le domaine produit, l'état d'avancement et la liste exhaustive des routes, voir `README.md`.

## Stack

- **Backend** : Laravel 12, PHP 8.2+, Inertia 2, Sanctum 4, Ziggy 2
- **Frontend** : React 18 + Inertia (JSX, **pas TypeScript**), Tailwind 3, shadcn/ui style « new-york » (Radix primitives)
- **UI utils** : `framer-motion`, `lucide-react`, `recharts`, `react-hot-toast`
- **Tests** : Pest 3 (PHP) + Vitest 4 / React Testing Library (JS)
- **Déploiement** : Railway via `Dockerfile` + `docker/entrypoint.sh`

## Commandes

- `composer run dev` — lance en parallèle `artisan serve`, `queue:listen`, `pail` (logs) et `vite`
- `composer run test` — `config:clear` puis `artisan test` (Pest)
- `npm test` — Vitest
- `npm run build` — build prod
- `composer run setup` — install complet (composer + .env + key + migrate + npm install + build)

## Organisation du code

- **Routes** : `routes/web.php` (charge `routes/auth.php` à la fin). Pas d'API REST séparée.
- **Contrôleurs** : `app/Http/Controllers/` (fins, délèguent). Sous-dossier `Auth/` = scaffolding Breeze.
- **Logique métier** : `app/Actions/<Verbe><Nom>Action.php` (ex. `SellProductAction`, `CancelOrderAction`). Toute transaction multi-modèle vit ici, **pas dans les contrôleurs**.
- **Validation** : `app/Http/Requests/` (`StoreXxxRequest`, `UpdateXxxRequest`) — messages d'erreur en français.
- **Modèles** : `app/Models/` (`Ingredient`, `Order`, `OrderItem`, `Product`, `ProductImage`, `User`).
- **Props Inertia partagées** : `app/Http/Middleware/HandleInertiaRequests.php` injecte `auth.user` et `flash.{message,error}`.
- **Pages Inertia** : `resources/js/Pages/<Resource>/<Action>.jsx` (résolution auto via `import.meta.glob` dans `app.jsx`).
- **Composants** : `resources/js/Components/` — primitives shadcn dans `Components/ui/` (kebab-case), composants métier en PascalCase (`Components/Dashboard/`, `Components/Layout/{Sidebar,TopHeader}.jsx`).
- **Layouts** : `resources/js/Layouts/{Authenticated,Guest,Marketing}Layout.jsx`.
- **Contexte global** : `resources/js/Contexts/CartContext.jsx` (panier persisté LocalStorage, monté dans `app.jsx`).
- **Utils JS** : `resources/js/lib/utils.js` (`cn()`), `resources/js/lib/amountConversion.js` (kg/g, L/ml, pcs).

## Conventions et invariants

- **Argent en cents (entier)** en BDD ; divise par 100 à l'affichage (voir `SellProductAction::execute()` pour le pattern).
- **Stocks d'ingrédients en décimal** ; les quantités saisies passent par `amountConversion.js` avant submit pour être converties en unité de base.
- **Routes en JS via Ziggy** : `route('orders.store')`, jamais d'URL en dur.
- **Flash messages** : contrôleur → `back()->with('message', '…')` ou `withErrors(...)` ; React → `usePage().props.flash`.
- **Confirmations destructives** : toujours via `Components/ui/confirmation-dialog.jsx`. **Jamais** `window.confirm` ni `alert` (cf. README).
- **Toasts** : `react-hot-toast`. Le style global est déjà surchargé dans `AuthenticatedLayout.jsx` (banner top-center, icônes Lucide). Appeler simplement `toast.success(...)` / `toast.error(...)`.
- **Alias d'import** : `@/` → `resources/js/` (`vite.config.js`, `jsconfig.json`, `components.json`).
- **JSX uniquement** : `components.json` a `"tsx": false`. Ne pas introduire TypeScript sans demander.
- **Dark mode** : Tailwind `darkMode: 'class'` ; variables HSL définies dans `resources/css/app.css`.
- **Polices** : Figtree (sans), Playfair Display (serif), chargées via Google Fonts en haut de `app.css`.
- **Langue** : les chaînes destinées à l'utilisateur sont en **français** (« Vente réussie », « Critique », « Stable »…). Le code (noms de symboles, commentaires) reste en anglais.
- **Style fichier** : 4 espaces, LF, UTF-8, final newline (`.editorconfig`).
- **Format PHP** : Laravel Pint (`vendor/bin/pint`).

## Tests

- **PHP (Pest 3)** : `tests/Feature/` avec `RefreshDatabase` (configuré dans `tests/Pest.php`). Style `test('description', function () { ... })`. Authentifier via `$this->actingAs(User::factory()->create())`. Voir `IngredientManagementTest.php` comme référence.
- **JS (Vitest 4 + RTL)** : `resources/js/tests/`, env jsdom. Setup global `resources/js/tests/setup.js` (charge `@testing-library/jest-dom`, mocke `ResizeObserver`). Config dans le bloc `test:` de `vite.config.js`.
- Suites ciblées listées dans le README (`ProductManagementTest`, `StockActionTest`, `OrderIntegrationTest`, etc.).

## Pièges & notes

- **Pas de Livewire / Filament / Jetstream** — l'auth est Breeze + Inertia React, point.
- **DB par défaut = MySQL** ; sessions / cache / queue sont sur le driver `database`.
- **Scripts ad-hoc** dans `scripts/` (ex. `verify_product_images.php`) sont des helpers ponctuels, **pas du code de prod**.
- **Déploiement Railway** : migrations rejouées au démarrage du container via `docker/entrypoint.sh` (10 retries, 3s). `RUN_MIGRATIONS=false` pour désactiver.
- **Welcome.jsx** (~42 Ko) contient la landing marketing complète — y toucher uniquement pour des changements marketing assumés.
