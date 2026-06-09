<?php

use App\Models\Ingredient;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

uses(\Illuminate\Foundation\Testing\RefreshDatabase::class);

test('a user only sees their own ingredients in the index', function () {
    $alice = User::factory()->create();
    $bob = User::factory()->create();

    $this->actingAs($alice);
    Ingredient::create(['name' => 'Tomate Alice', 'unit' => 'kg', 'stock_quantity' => 5]);

    $this->actingAs($bob);
    Ingredient::create(['name' => 'Tomate Bob', 'unit' => 'kg', 'stock_quantity' => 5]);

    $this->get(route('ingredients.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Ingredients/Index')
            ->has('ingredients.data', 1)
            ->where('ingredients.data.0.name', 'Tomate Bob')
        );
});

test('a user cannot update another account ingredient', function () {
    $alice = User::factory()->create();
    $this->actingAs($alice);
    $ingredient = Ingredient::create(['name' => 'Sel Alice', 'unit' => 'g', 'stock_quantity' => 100]);

    $this->actingAs(User::factory()->create());

    $this->patch(route('ingredients.update', $ingredient), [
        'name' => 'Pirate',
        'unit' => 'g',
        'stock_quantity' => 0,
        'alert_threshold' => 0,
    ])->assertNotFound();

    $this->assertDatabaseHas('ingredients', [
        'id' => $ingredient->id,
        'name' => 'Sel Alice',
    ]);
});

test('a user cannot delete another account ingredient', function () {
    $alice = User::factory()->create();
    $this->actingAs($alice);
    $ingredient = Ingredient::create(['name' => 'Poivre Alice', 'unit' => 'g', 'stock_quantity' => 100]);

    $this->actingAs(User::factory()->create());

    $this->delete(route('ingredients.destroy', $ingredient))->assertNotFound();

    $this->assertDatabaseHas('ingredients', ['id' => $ingredient->id]);
});

test('a user cannot cancel another account order', function () {
    $alice = User::factory()->create();
    $this->actingAs($alice);

    $ingredient = Ingredient::create(['name' => 'Cafe Alice', 'unit' => 'g', 'stock_quantity' => 1000]);
    $product = Product::create(['name' => 'Espresso Alice', 'price' => 200]);
    $product->ingredients()->attach($ingredient->id, ['amount' => 10]);

    $this->post(route('orders.store'), [
        'items' => [['id' => $product->id, 'quantity' => 1]],
    ])->assertSessionHasNoErrors();

    $order = Order::sole();

    $this->actingAs(User::factory()->create());

    $this->delete(route('orders.destroy', $order))->assertNotFound();

    $this->assertDatabaseHas('orders', ['id' => $order->id]);
});

test('a user only sees their own orders in the history', function () {
    $alice = User::factory()->create();
    $this->actingAs($alice);

    $ingredient = Ingredient::create(['name' => 'Café Alice', 'unit' => 'g', 'stock_quantity' => 1000]);
    $product = Product::create(['name' => 'Espresso Alice', 'price' => 200]);
    $product->ingredients()->attach($ingredient->id, ['amount' => 10]);
    $this->post(route('orders.store'), [
        'items' => [['id' => $product->id, 'quantity' => 1]],
    ]);

    $this->actingAs(User::factory()->create());

    $this->get(route('orders.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Orders/Index')
            ->has('orders.data', 0)
        );
});

test('new records are stamped with the authenticated owner', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $ingredient = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 10]);

    expect($ingredient->user_id)->toBe($user->id);
});
