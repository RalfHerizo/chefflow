<?php

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Database\Seeders\DemoSeeder;

test('the demo seeder builds a coherent catalog without exhausting stock', function () {
    // Runs the full seed: ingredients, products with recipes, and a week of
    // orders. SellProductAction throws if any recipe references a missing
    // ingredient or if stock is insufficient, so a clean run validates the
    // whole dataset end to end.
    $this->seed(DemoSeeder::class);

    $demo = User::where('email', config('demo.email'))->firstOrFail();
    $this->actingAs($demo);

    expect(Ingredient::count())->toBe(17);
    expect(Product::count())->toBe(27);
    expect(Order::count())->toBeGreaterThan(0);

    // The demo intentionally leaves several perishables below threshold so the
    // stock alerts are visible (sidebar badge + dashboard block + overflow link).
    expect(Ingredient::whereColumn('stock_quantity', '<=', 'alert_threshold')->count())->toBe(7);

    $allowedCategories = ['Entrée', 'Plat', 'Accompagnement', 'Dessert', 'Boisson', 'Menu'];

    Product::with('ingredients')->get()->each(function (Product $product) use ($allowedCategories) {
        expect($product->ingredients)->not->toBeEmpty("Le produit {$product->name} n'a aucune recette.");
        expect($allowedCategories)->toContain($product->category);
    });
});

test('the demo seeder leaves at least one product not makeable while keeping the low-stock count', function () {
    $this->seed(DemoSeeder::class);

    $demo = User::where('email', config('demo.email'))->firstOrFail();
    $this->actingAs($demo);

    // Champignons forced to 0 → Pizza Reine + Pizza Végétarienne become unmakeable.
    $notMakeable = Product::with('ingredients')->get()
        ->filter(fn (Product $product) => ! $product->is_makeable);

    expect($notMakeable)->not->toBeEmpty();
    expect($notMakeable->pluck('name'))->toContain('Pizza Reine');

    // Champignons at 0 plus the other flagged perishables → 7 under threshold.
    expect(Ingredient::whereColumn('stock_quantity', '<=', 'alert_threshold')->count())->toBe(7);
});
