<?php

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the pos marks a product unmakeable when an ingredient stock is below the recipe amount', function () {
    // actingAs first so BelongsToTenant stamps the demo data with this user.
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 5]);
    $mushroom = Ingredient::create(['name' => 'Champignons', 'unit' => 'kg', 'stock_quantity' => 0, 'alert_threshold' => 2]);

    $makeable = Product::create(['name' => 'A Pizza Simple', 'price' => 1000, 'is_active' => true]);
    $makeable->ingredients()->attach($flour->id, ['amount' => 0.25]);

    $blocked = Product::create(['name' => 'B Pizza Champi', 'price' => 1200, 'is_active' => true]);
    $blocked->ingredients()->attach([
        $flour->id => ['amount' => 0.25],
        $mushroom->id => ['amount' => 0.05],
    ]);

    // pos() orders by name → index 0 = "A Pizza Simple", index 1 = "B Pizza Champi".
    $this->get(route('orders.pos'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Orders/Pos')
            ->where('products.0.name', 'A Pizza Simple')
            ->where('products.0.is_makeable', true)
            ->where('products.1.name', 'B Pizza Champi')
            ->where('products.1.is_makeable', false)
        );
});

test('the pos treats a product with no recipe as makeable', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Product::create(['name' => 'Sans Recette', 'price' => 500, 'is_active' => true]);

    $this->get(route('orders.pos'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Orders/Pos')
            ->where('products.0.is_makeable', true)
        );
});
