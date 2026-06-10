<?php

namespace Database\Seeders;

use App\Actions\SellProductAction;
use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * Seeds (or resets) the shared portfolio demo account with a realistic
 * restaurant dataset: ingredients, products with recipes, and a week of
 * orders. Idempotent — safe to run on every boot and from the /demo/reset
 * endpoint.
 */
class DemoSeeder extends Seeder
{
    public function run(): void
    {
        $demo = User::firstOrCreate(
            ['email' => config('demo.email')],
            [
                'name' => 'Démo ChefFlow',
                'password' => Hash::make(Str::random(40)),
            ],
        );

        // Seed inside the demo tenant context so BelongsToTenant stamps
        // ownership automatically (the trait hook is auth-context only).
        // Restore the previous auth state afterwards so the web reset flow
        // keeps the visitor logged in as the demo user.
        $previous = Auth::user();
        Auth::login($demo);

        try {
            $this->purge();
            $ingredients = $this->createIngredients();
            $products = $this->createProducts($ingredients);
            $this->createOrders($products);
        } finally {
            $previous ? Auth::login($previous) : Auth::logout();
        }
    }

    private function purge(): void
    {
        // Tenant-scoped: only the demo account's data is removed.
        Order::query()->delete(); // order_items cascade via FK

        Product::query()->get()->each(function (Product $product) {
            $product->images()->delete();
            $product->ingredients()->detach();
            $product->delete();
        });

        Ingredient::query()->delete();
    }

    /**
     * @return array<string, Ingredient>
     */
    private function createIngredients(): array
    {
        $rows = [
            'farine' => ['name' => 'Farine T55', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 10],
            'tomate' => ['name' => 'Sauce tomate', 'unit' => 'kg', 'stock_quantity' => 30, 'alert_threshold' => 5],
            'mozzarella' => ['name' => 'Mozzarella', 'unit' => 'kg', 'stock_quantity' => 20, 'alert_threshold' => 4],
            'basilic' => ['name' => 'Basilic frais', 'unit' => 'g', 'stock_quantity' => 200, 'alert_threshold' => 50],
            'jambon' => ['name' => 'Jambon', 'unit' => 'kg', 'stock_quantity' => 15, 'alert_threshold' => 3],
            'champignons' => ['name' => 'Champignons', 'unit' => 'kg', 'stock_quantity' => 10, 'alert_threshold' => 2],
            'boeuf' => ['name' => 'Boeuf haché', 'unit' => 'kg', 'stock_quantity' => 25, 'alert_threshold' => 5],
            'pain' => ['name' => 'Pain burger', 'unit' => 'pcs', 'stock_quantity' => 100, 'alert_threshold' => 20],
            'cheddar' => ['name' => 'Cheddar', 'unit' => 'kg', 'stock_quantity' => 12, 'alert_threshold' => 3],
            'frites' => ['name' => 'Frites', 'unit' => 'kg', 'stock_quantity' => 40, 'alert_threshold' => 8],
            'salade' => ['name' => 'Salade', 'unit' => 'kg', 'stock_quantity' => 15, 'alert_threshold' => 3],
            'poulet' => ['name' => 'Poulet', 'unit' => 'kg', 'stock_quantity' => 20, 'alert_threshold' => 4],
            'riz' => ['name' => 'Riz', 'unit' => 'kg', 'stock_quantity' => 30, 'alert_threshold' => 6],
            'lait' => ['name' => 'Lait', 'unit' => 'L', 'stock_quantity' => 40, 'alert_threshold' => 8],
            'sucre' => ['name' => 'Sucre', 'unit' => 'kg', 'stock_quantity' => 25, 'alert_threshold' => 5],
            'oeuf' => ['name' => 'Oeufs', 'unit' => 'pcs', 'stock_quantity' => 300, 'alert_threshold' => 60],
            'cafe' => ['name' => 'Café', 'unit' => 'kg', 'stock_quantity' => 10, 'alert_threshold' => 2],
        ];

        // TheMealDB ingredient names → real cut-out photos (transparent PNG).
        $photos = [
            'farine' => 'Flour',
            'tomate' => 'Tomatoes',
            'mozzarella' => 'Mozzarella',
            'basilic' => 'Basil',
            'jambon' => 'Ham',
            'champignons' => 'Mushrooms',
            'boeuf' => 'Minced Beef',
            'pain' => 'Bread',
            'cheddar' => 'Cheddar Cheese',
            'frites' => 'Potatoes',
            'salade' => 'Lettuce',
            'poulet' => 'Chicken',
            'riz' => 'Rice',
            'lait' => 'Milk',
            'sucre' => 'Sugar',
            'oeuf' => 'Eggs',
            'cafe' => 'Coffee',
        ];

        $ingredients = [];
        foreach ($rows as $key => $row) {
            $ingredients[$key] = Ingredient::create($row + [
                'image_url' => 'https://www.themealdb.com/images/ingredients/'.rawurlencode($photos[$key]).'-Small.png',
            ]);
        }

        return $ingredients;
    }

    /**
     * @param  array<string, Ingredient>  $ing
     * @return array<string, Product>
     */
    private function createProducts(array $ing): array
    {
        $pizzaPhoto = 'https://www.themealdb.com/images/media/meals/x0lk931587671540.jpg';
        $pizzaPhoto2 = 'https://www.themealdb.com/images/media/meals/wf49qs1763075222.jpg';
        $burgerPhoto = 'https://www.themealdb.com/images/media/meals/44bzep1761848278.jpg';
        $friesPhoto = 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg';
        $menuPhoto = 'https://www.themealdb.com/images/media/meals/lgmnff1763789847.jpg';

        $catalog = [
            // — Pizzas (Plat) —
            'margherita' => [
                'name' => 'Pizza Margherita', 'price' => 1200, 'category' => 'Plat', 'photo' => $pizzaPhoto,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'basilic' => 5],
            ],
            'reine' => [
                'name' => 'Pizza Reine', 'price' => 1400, 'category' => 'Plat', 'photo' => $pizzaPhoto2,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'jambon' => 0.08, 'champignons' => 0.05],
            ],
            'quatrefromages' => [
                'name' => 'Pizza 4 Fromages', 'price' => 1500, 'category' => 'Plat', 'photo' => $pizzaPhoto,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.12, 'mozzarella' => 0.15, 'cheddar' => 0.05],
            ],
            'vegetarienne' => [
                'name' => 'Pizza Végétarienne', 'price' => 1350, 'category' => 'Plat', 'photo' => $pizzaPhoto2,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'champignons' => 0.06, 'basilic' => 5],
            ],
            'pizzapoulet' => [
                'name' => 'Pizza Poulet', 'price' => 1450, 'category' => 'Plat', 'photo' => $pizzaPhoto,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'poulet' => 0.1],
            ],
            'calzone' => [
                'name' => 'Calzone Jambon', 'price' => 1400, 'category' => 'Plat', 'photo' => $pizzaPhoto2,
                'recipe' => ['farine' => 0.3, 'tomate' => 0.12, 'mozzarella' => 0.12, 'jambon' => 0.1],
            ],
            // — Burgers (Plat) —
            'burger' => [
                'name' => 'Burger Classic', 'price' => 1100, 'category' => 'Plat', 'photo' => $burgerPhoto,
                'recipe' => ['pain' => 1, 'boeuf' => 0.15, 'cheddar' => 0.03, 'tomate' => 0.03],
            ],
            'cheeseburger' => [
                'name' => 'Cheeseburger', 'price' => 1250, 'category' => 'Plat', 'photo' => $burgerPhoto,
                'recipe' => ['pain' => 1, 'boeuf' => 0.15, 'cheddar' => 0.05, 'tomate' => 0.03, 'salade' => 0.02],
            ],
            'doubleburger' => [
                'name' => 'Double Burger', 'price' => 1600, 'category' => 'Plat', 'photo' => $burgerPhoto,
                'recipe' => ['pain' => 1, 'boeuf' => 0.3, 'cheddar' => 0.06],
            ],
            'chickenburger' => [
                'name' => 'Chicken Burger', 'price' => 1300, 'category' => 'Plat', 'photo' => $burgerPhoto,
                'recipe' => ['pain' => 1, 'poulet' => 0.13, 'cheddar' => 0.03, 'salade' => 0.02],
            ],
            // — Autres plats —
            'pouletriz' => [
                'name' => 'Poulet Riz', 'price' => 1350, 'category' => 'Plat', 'photo' => $menuPhoto,
                'recipe' => ['poulet' => 0.18, 'riz' => 0.15],
            ],
            'lasagnes' => [
                'name' => 'Lasagnes Bolognaise', 'price' => 1250, 'category' => 'Plat', 'photo' => $menuPhoto,
                'recipe' => ['farine' => 0.12, 'boeuf' => 0.15, 'tomate' => 0.15, 'mozzarella' => 0.08],
            ],
            // — Entrées —
            'caprese' => [
                'name' => 'Salade Caprese', 'price' => 850, 'category' => 'Entrée', 'photo' => null,
                'recipe' => ['tomate' => 0.1, 'mozzarella' => 0.1, 'basilic' => 4],
            ],
            'cesar' => [
                'name' => 'Salade César', 'price' => 950, 'category' => 'Entrée', 'photo' => null,
                'recipe' => ['salade' => 0.12, 'poulet' => 0.08, 'cheddar' => 0.02],
            ],
            'bruschetta' => [
                'name' => 'Bruschetta', 'price' => 700, 'category' => 'Entrée', 'photo' => null,
                'recipe' => ['pain' => 1, 'tomate' => 0.06, 'basilic' => 4],
            ],
            // — Accompagnements —
            'frites' => [
                'name' => 'Frites Maison', 'price' => 400, 'category' => 'Accompagnement', 'photo' => $friesPhoto,
                'recipe' => ['frites' => 0.2],
            ],
            'grandefrites' => [
                'name' => 'Grande Frites', 'price' => 550, 'category' => 'Accompagnement', 'photo' => $friesPhoto,
                'recipe' => ['frites' => 0.3],
            ],
            'riznature' => [
                'name' => 'Riz Nature', 'price' => 450, 'category' => 'Accompagnement', 'photo' => $friesPhoto,
                'recipe' => ['riz' => 0.15],
            ],
            'saladeverte' => [
                'name' => 'Salade Verte', 'price' => 500, 'category' => 'Accompagnement', 'photo' => null,
                'recipe' => ['salade' => 0.1, 'tomate' => 0.04],
            ],
            // — Desserts —
            'rizaulait' => [
                'name' => 'Riz au Lait', 'price' => 550, 'category' => 'Dessert', 'photo' => null,
                'recipe' => ['riz' => 0.08, 'lait' => 0.2, 'sucre' => 0.03],
            ],
            'cremevanille' => [
                'name' => 'Crème Vanille', 'price' => 600, 'category' => 'Dessert', 'photo' => null,
                'recipe' => ['lait' => 0.15, 'oeuf' => 2, 'sucre' => 0.04],
            ],
            'glacevanille' => [
                'name' => 'Glace Vanille', 'price' => 500, 'category' => 'Dessert', 'photo' => null,
                'recipe' => ['lait' => 0.1, 'oeuf' => 1, 'sucre' => 0.05],
            ],
            // — Boissons —
            'espresso' => [
                'name' => 'Café Espresso', 'price' => 250, 'category' => 'Boisson', 'photo' => null,
                'recipe' => ['cafe' => 0.01],
            ],
            'cappuccino' => [
                'name' => 'Cappuccino', 'price' => 350, 'category' => 'Boisson', 'photo' => null,
                'recipe' => ['cafe' => 0.01, 'lait' => 0.08],
            ],
            // — Menus —
            'menu' => [
                'name' => 'Menu Burger + Frites', 'price' => 1400, 'category' => 'Menu', 'photo' => $menuPhoto,
                'recipe' => ['pain' => 1, 'boeuf' => 0.15, 'cheddar' => 0.03, 'frites' => 0.2],
            ],
            'menupizza' => [
                'name' => 'Menu Pizza', 'price' => 1700, 'category' => 'Menu', 'photo' => $menuPhoto,
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'frites' => 0.2],
            ],
            'menuenfant' => [
                'name' => 'Menu Enfant', 'price' => 1000, 'category' => 'Menu', 'photo' => $menuPhoto,
                'recipe' => ['pain' => 1, 'boeuf' => 0.1, 'frites' => 0.15],
            ],
        ];

        $products = [];
        foreach ($catalog as $key => $row) {
            $product = Product::create([
                'name' => $row['name'],
                'price' => $row['price'],
                'category' => $row['category'],
                'is_active' => true,
                'image_url' => $row['photo'],
            ]);

            $pivot = [];
            foreach ($row['recipe'] as $ingKey => $amount) {
                $pivot[$ing[$ingKey]->id] = ['amount' => $amount];
            }
            $product->ingredients()->attach($pivot);

            $products[$key] = $product;
        }

        return $products;
    }

    /**
     * @param  array<string, Product>  $products
     */
    private function createOrders(array $products): void
    {
        $action = new SellProductAction;

        // [days ago, [[product key, qty], ...]] — spread across the last week
        // so the dashboard revenue chart is populated.
        $script = [
            [6, [['margherita', 2], ['frites', 1], ['espresso', 2]]],
            [6, [['cheeseburger', 1], ['cappuccino', 1]]],
            [5, [['burger', 1], ['grandefrites', 1]]],
            [5, [['pizzapoulet', 1], ['caprese', 1]]],
            [4, [['reine', 1], ['menu', 1]]],
            [4, [['doubleburger', 1], ['glacevanille', 2]]],
            [3, [['margherita', 1], ['burger', 2], ['cesar', 1]]],
            [3, [['menupizza', 1]]],
            [2, [['menu', 2], ['rizaulait', 1]]],
            [2, [['chickenburger', 1], ['espresso', 1]]],
            [1, [['frites', 3], ['reine', 1], ['cappuccino', 2]]],
            [1, [['quatrefromages', 1], ['saladeverte', 1]]],
            [0, [['margherita', 1], ['burger', 1], ['frites', 1]]],
            [0, [['menu', 1], ['pouletriz', 1], ['espresso', 1]]],
        ];

        foreach ($script as [$daysAgo, $lines]) {
            $items = array_map(
                fn (array $line) => ['id' => $products[$line[0]]->id, 'quantity' => $line[1]],
                $lines,
            );

            $order = $action->execute($items);

            $order->created_at = now()->subDays($daysAgo)->setTime(12, 0);
            $order->save();
        }
    }
}
