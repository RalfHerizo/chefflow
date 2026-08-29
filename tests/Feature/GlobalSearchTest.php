<?php

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;

test('global search returns grouped results across products and ingredients', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Product::create(['name' => 'Pizza Reine', 'price' => 1400, 'is_active' => true]);
    Product::create(['name' => 'Burger Classic', 'price' => 1000, 'is_active' => true]);
    Ingredient::create(['name' => 'Pizza dough', 'unit' => 'kg', 'stock_quantity' => 10, 'alert_threshold' => 2]);
    Ingredient::create(['name' => 'Beef', 'unit' => 'kg', 'stock_quantity' => 10, 'alert_threshold' => 2]);

    $this->getJson(route('search', ['q' => 'piz']))
        ->assertOk()
        ->assertJsonCount(1, 'products')
        ->assertJsonPath('products.0.name', 'Pizza Reine')
        ->assertJsonCount(1, 'ingredients')
        ->assertJsonPath('ingredients.0.name', 'Pizza dough')
        ->assertJsonCount(0, 'orders');
});

test('global search ignores queries shorter than two characters', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Product::create(['name' => 'Pizza', 'price' => 1000, 'is_active' => true]);

    $this->getJson(route('search', ['q' => 'p']))
        ->assertOk()
        ->assertExactJson(['products' => [], 'ingredients' => [], 'orders' => []]);
});

test('global search only returns data of the current tenant', function () {
    $other = User::factory()->create();
    $this->actingAs($other);
    Product::create(['name' => 'Secret Pizza', 'price' => 1000, 'is_active' => true]);

    $owner = User::factory()->create();
    $this->actingAs($owner);

    $this->getJson(route('search', ['q' => 'pizza']))
        ->assertOk()
        ->assertJsonCount(0, 'products');
});

test('global search finds an order through its product name', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 5]);
    $product = Product::create(['name' => 'Pizza Margherita', 'price' => 1200, 'is_active' => true]);
    $product->ingredients()->attach($flour->id, ['amount' => 0.25]);

    $this->post(route('orders.store'), [
        'items' => [['id' => $product->id, 'quantity' => 1]],
    ])->assertSessionHasNoErrors();

    $orderId = Order::query()->latest('id')->firstOrFail()->id;

    $this->getJson(route('search', ['q' => 'margherita']))
        ->assertOk()
        ->assertJsonCount(1, 'orders')
        ->assertJsonPath('orders.0.id', $orderId);
});
