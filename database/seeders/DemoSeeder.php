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
        ];

        $ingredients = [];
        foreach ($rows as $key => $row) {
            $ingredients[$key] = Ingredient::create($row + [
                'image_url' => 'https://placehold.co/100x100/FF7E47/FFFFFF?text='.rawurlencode($row['name']),
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
        $catalog = [
            'margherita' => [
                'name' => 'Pizza Margherita', 'price' => 1200, 'category' => 'Pizza',
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'basilic' => 5],
            ],
            'reine' => [
                'name' => 'Pizza Reine', 'price' => 1400, 'category' => 'Pizza',
                'recipe' => ['farine' => 0.25, 'tomate' => 0.15, 'mozzarella' => 0.12, 'jambon' => 0.08, 'champignons' => 0.05],
            ],
            'burger' => [
                'name' => 'Burger Classic', 'price' => 1100, 'category' => 'Burger',
                'recipe' => ['pain' => 1, 'boeuf' => 0.15, 'cheddar' => 0.03, 'tomate' => 0.03],
            ],
            'frites' => [
                'name' => 'Frites Maison', 'price' => 400, 'category' => 'Accompagnement',
                'recipe' => ['frites' => 0.2],
            ],
            'menu' => [
                'name' => 'Menu Burger + Frites', 'price' => 1400, 'category' => 'Menu',
                'recipe' => ['pain' => 1, 'boeuf' => 0.15, 'cheddar' => 0.03, 'frites' => 0.2],
            ],
        ];

        $products = [];
        foreach ($catalog as $key => $row) {
            $product = Product::create([
                'name' => $row['name'],
                'price' => $row['price'],
                'category' => $row['category'],
                'is_active' => true,
                'image_url' => 'https://placehold.co/600x400/FF7E47/FFFFFF?text='.rawurlencode($row['name']),
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
            [6, [['margherita', 2], ['frites', 1]]],
            [5, [['burger', 1]]],
            [4, [['reine', 1], ['menu', 1]]],
            [3, [['margherita', 1], ['burger', 2]]],
            [2, [['menu', 2]]],
            [1, [['frites', 3], ['reine', 1]]],
            [0, [['margherita', 1], ['burger', 1], ['frites', 1]]],
            [0, [['menu', 1]]],
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
