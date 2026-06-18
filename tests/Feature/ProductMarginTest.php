<?php

use App\Models\Ingredient;
use App\Models\Product;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('creating an ingredient with a cost price persists it and computes stock value', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('ingredients.store'), [
        'name' => 'Mozzarella',
        'unit' => 'kg',
        'stock_quantity' => 10,
        'alert_threshold' => 2,
        'cost_price' => 8,
    ])->assertSessionHasNoErrors();

    $ingredient = Ingredient::where('name', 'Mozzarella')->firstOrFail();

    expect((float) $ingredient->cost_price)->toBe(8.0);
    expect($ingredient->stock_value)->toBe(80.0); // 8 € * 10 kg in stock
});

test('a negative cost price is rejected', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $this->post(route('ingredients.store'), [
        'name' => 'Sel',
        'unit' => 'kg',
        'stock_quantity' => 5,
        'alert_threshold' => 1,
        'cost_price' => -2,
    ])->assertSessionHasErrors('cost_price');
});

test('the products index exposes recipe cost, margin and margin ratio', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $flour = Ingredient::create(['name' => 'Farine', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 5, 'cost_price' => 1.20]);
    $cheese = Ingredient::create(['name' => 'Mozza', 'unit' => 'kg', 'stock_quantity' => 20, 'alert_threshold' => 4, 'cost_price' => 8.00]);

    // Price 12 €. Recipe cost = 0.25*1.20 + 0.10*8.00 = 0.30 + 0.80 = 1.10 €.
    $pizza = Product::create(['name' => 'Pizza', 'price' => 1200, 'is_active' => true]);
    $pizza->ingredients()->attach([
        $flour->id => ['amount' => 0.25],
        $cheese->id => ['amount' => 0.10],
    ]);

    $this->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('Products/Index')
            ->where('products.data.0.recipe_cost', fn ($value) => round((float) $value, 2) === 1.1)
            ->where('products.data.0.margin', fn ($value) => round((float) $value, 2) === 10.9)
            ->where('products.data.0.margin_ratio', 91) // 10.90 / 12 = 90.8 % → 91
        );
});

test('a product without a recipe reports null cost and margin', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    Product::create(['name' => 'Sans recette', 'price' => 500, 'is_active' => true]);

    $this->get(route('products.index'))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->where('products.data.0.recipe_cost', null)
            ->where('products.data.0.margin', null)
            ->where('products.data.0.margin_ratio', null)
        );
});
