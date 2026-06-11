<?php

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('an authenticated user can create a product with recipe lines', function () {
    $user = User::factory()->create();
    $tomato = Ingredient::create([
        'name' => 'Tomate',
        'unit' => 'kg',
        'stock_quantity' => 15,
        'alert_threshold' => 2,
    ]);
    $cheese = Ingredient::create([
        'name' => 'Fromage',
        'unit' => 'kg',
        'stock_quantity' => 8,
        'alert_threshold' => 1,
    ]);

    $response = $this
        ->actingAs($user)
        ->post(route('products.store'), [
            'name' => 'Pizza Margherita',
            'price' => 12.5,
            'category' => 'Pizza',
            'ingredients' => [
                ['id' => $tomato->id, 'amount' => 0.15],
                ['id' => $cheese->id, 'amount' => 0.08],
            ],
        ]);

    $response->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', [
        'name' => 'Pizza Margherita',
        'price' => 1250,
        'category' => 'Pizza',
        'is_active' => true,
    ]);

    $product = Product::where('name', 'Pizza Margherita')->firstOrFail();

    $this->assertDatabaseHas('ingredient_product', [
        'product_id' => $product->id,
        'ingredient_id' => $tomato->id,
        'amount' => 0.15,
    ]);
    $this->assertDatabaseHas('ingredient_product', [
        'product_id' => $product->id,
        'ingredient_id' => $cheese->id,
        'amount' => 0.08,
    ]);
});

test('an authenticated user can update a product and sync recipe lines', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $tomato = Ingredient::create([
        'name' => 'Tomate Roma',
        'unit' => 'kg',
        'stock_quantity' => 10,
        'alert_threshold' => 1,
    ]);
    $onion = Ingredient::create([
        'name' => 'Oignon',
        'unit' => 'kg',
        'stock_quantity' => 10,
        'alert_threshold' => 1,
    ]);
    $steak = Ingredient::create([
        'name' => 'Steak',
        'unit' => 'kg',
        'stock_quantity' => 20,
        'alert_threshold' => 2,
    ]);

    $product = Product::create([
        'name' => 'Burger Maison',
        'price' => 990,
        'category' => 'Burger',
        'is_active' => true,
    ]);
    $product->ingredients()->attach([
        $tomato->id => ['amount' => 0.03],
        $onion->id => ['amount' => 0.01],
    ]);

    $response = $this
        ->patch(route('products.update', $product), [
            'name' => 'Double Burger',
            'price' => 14.2,
            'category' => 'Premium',
            'ingredients' => [
                ['id' => $steak->id, 'amount' => 0.2],
                ['id' => $tomato->id, 'amount' => 0.04],
            ],
        ]);

    $response->assertRedirect(route('products.index'));

    $this->assertDatabaseHas('products', [
        'id' => $product->id,
        'name' => 'Double Burger',
        'price' => 1420,
        'category' => 'Premium',
    ]);

    $this->assertDatabaseHas('ingredient_product', [
        'product_id' => $product->id,
        'ingredient_id' => $steak->id,
        'amount' => 0.2,
    ]);
    $this->assertDatabaseHas('ingredient_product', [
        'product_id' => $product->id,
        'ingredient_id' => $tomato->id,
        'amount' => 0.04,
    ]);
    $this->assertDatabaseMissing('ingredient_product', [
        'product_id' => $product->id,
        'ingredient_id' => $onion->id,
    ]);
});

test('an authenticated user can toggle a product status', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $product = Product::create([
        'name' => 'Salade Cesar',
        'price' => 750,
        'is_active' => true,
    ]);

    $response = $this
        ->patch(route('products.toggle-status', $product));

    $response->assertRedirect();
    expect($product->fresh()->is_active)->toBeFalse();
});

test('an authenticated user can filter products by category', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Product::create(['name' => 'Pizza Margherita', 'price' => 1200, 'category' => 'Pizza', 'is_active' => true]);
    Product::create(['name' => 'Pizza Reine', 'price' => 1400, 'category' => 'Pizza', 'is_active' => true]);
    Product::create(['name' => 'Burger Classic', 'price' => 1100, 'category' => 'Burger', 'is_active' => true]);

    $this->get(route('products.index', ['category' => 'Pizza']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Products/Index')
            ->has('products.data', 2)
            ->where('filters.category', 'Pizza')
            ->where('categories', ['Burger', 'Pizza'])
        );
});

test('the products index exposes is_makeable derived from stock', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 5]);
    $truffle = Ingredient::create(['name' => 'Truffe', 'unit' => 'kg', 'stock_quantity' => 0.01, 'alert_threshold' => 1]);

    $ok = Product::create(['name' => 'AAA Stocked', 'price' => 1000, 'is_active' => true]);
    $ok->ingredients()->attach($flour->id, ['amount' => 0.25]);

    $ko = Product::create(['name' => 'BBB OutOfStock', 'price' => 1200, 'is_active' => true]);
    $ko->ingredients()->attach($truffle->id, ['amount' => 0.05]); // 0.01 < 0.05

    $this->get(route('products.index', ['sort' => 'name', 'direction' => 'asc']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Products/Index')
            ->where('products.data.0.name', 'AAA Stocked')
            ->where('products.data.0.is_makeable', true)
            ->where('products.data.1.name', 'BBB OutOfStock')
            ->where('products.data.1.is_makeable', false)
        );
});
