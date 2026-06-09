<?php

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('the dashboard renders with stats, top products and recent orders', function () {
    $this->actingAs(User::factory()->create());

    $ingredient = Ingredient::create([
        'name' => 'Tomate',
        'unit' => 'kg',
        'stock_quantity' => 10,
        'alert_threshold' => 2,
    ]);
    $product = Product::create(['name' => 'Pizza', 'price' => 1200]);
    $product->ingredients()->attach($ingredient->id, ['amount' => 0.1]);

    $this->post(route('orders.store'), [
        'items' => [['id' => $product->id, 'quantity' => 2]],
    ])->assertSessionHasNoErrors();

    $this->get(route('dashboard'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Dashboard')
            ->has('stats.revenue.value')
            ->has('stats.lowStock.value')
            ->has('topProducts', 1)
            ->where('topProducts.0.name', 'Pizza')
            ->has('weeklyRevenue')
        );
});
