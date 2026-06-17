<?php

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('the analytics page renders kpis, trend, category revenue and top products', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 100, 'alert_threshold' => 5]);

    $pizza = Product::create(['name' => 'Pizza', 'price' => 1200, 'category' => 'Plat', 'is_active' => true]);
    $pizza->ingredients()->attach($flour->id, ['amount' => 0.1]);
    $coffee = Product::create(['name' => 'Café', 'price' => 300, 'category' => 'Boisson', 'is_active' => true]);
    $coffee->ingredients()->attach($flour->id, ['amount' => 0.01]);

    // Pizza ×2 (24 €) and coffee ×1 (3 €) → revenue 27 €, 2 orders, 3 items.
    $this->post(route('orders.store'), ['items' => [['id' => $pizza->id, 'quantity' => 2]]])->assertSessionHasNoErrors();
    $this->post(route('orders.store'), ['items' => [['id' => $coffee->id, 'quantity' => 1]]])->assertSessionHasNoErrors();

    $this->get(route('analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Analytics/Index')
            ->where('period', 30)
            ->where('kpis.orders.value', 2)
            ->where('kpis.itemsSold.value', 3)
            ->where('kpis.revenue.value', fn ($value) => round((float) $value, 2) === 27.0)
            ->has('revenueTrend', 30)
            ->has('categoryRevenue', 2)
            ->where('categoryRevenue.0.category', 'Plat') // 24 € > 3 € → sorted first
            ->has('topProducts', 2)
            ->where('topProducts.0.name', 'Pizza') // highest revenue first
            ->where('topProducts.0.quantity', 2)
        );
});

test('the analytics window can be switched to 7 days', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('analytics', ['period' => 7]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Analytics/Index')
            ->where('period', 7)
            ->has('revenueTrend', 7)
        );
});

test('an invalid analytics period falls back to 30 days', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->get(route('analytics', ['period' => 999]))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('period', 30)
            ->has('revenueTrend', 30)
        );
});

test('analytics only aggregates the current tenant orders', function () {
    $other = User::factory()->create();
    $this->actingAs($other);
    $ingredient = Ingredient::create(['name' => 'X', 'unit' => 'kg', 'stock_quantity' => 100, 'alert_threshold' => 5]);
    $product = Product::create(['name' => 'Other Pizza', 'price' => 1000, 'category' => 'Plat', 'is_active' => true]);
    $product->ingredients()->attach($ingredient->id, ['amount' => 0.1]);
    $this->post(route('orders.store'), ['items' => [['id' => $product->id, 'quantity' => 1]]])->assertSessionHasNoErrors();

    $owner = User::factory()->create();
    $this->actingAs($owner);

    $this->get(route('analytics'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('kpis.orders.value', 0)
            ->has('categoryRevenue', 0)
            ->has('topProducts', 0)
        );
});
