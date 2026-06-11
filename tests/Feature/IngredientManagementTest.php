<?php

use App\Models\Ingredient;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('an authenticated user can create an ingredient with image url', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->post(route('ingredients.store'), [
            'name' => 'Tomate',
            'image_url' => 'https://images.example.com/tomate.jpg',
            'unit' => 'kg',
            'stock_quantity' => 30,
            'alert_threshold' => 5,
        ]);

    $response->assertRedirect(route('ingredients.index'));

    $this->assertDatabaseHas('ingredients', [
        'name' => 'Tomate',
        'image_url' => 'https://images.example.com/tomate.jpg',
        'unit' => 'kg',
        'stock_quantity' => 30,
        'alert_threshold' => 5,
    ]);
});

test('an authenticated user can update an ingredient', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $ingredient = Ingredient::create([
        'name' => 'Lait',
        'image_url' => null,
        'unit' => 'L',
        'stock_quantity' => 12,
        'alert_threshold' => 3,
    ]);

    $response = $this
        ->patch(route('ingredients.update', $ingredient), [
            'name' => 'Lait entier',
            'image_url' => 'https://images.example.com/lait-entier.png',
            'unit' => 'L',
            'stock_quantity' => 9,
            'alert_threshold' => 2,
        ]);

    $response->assertRedirect(route('ingredients.index'));

    $this->assertDatabaseHas('ingredients', [
        'id' => $ingredient->id,
        'name' => 'Lait entier',
        'image_url' => 'https://images.example.com/lait-entier.png',
        'stock_quantity' => 9,
        'alert_threshold' => 2,
    ]);
});

test('an authenticated user can delete an ingredient', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    $ingredient = Ingredient::create([
        'name' => 'Sel',
        'unit' => 'g',
        'stock_quantity' => 1000,
        'alert_threshold' => 100,
    ]);

    $response = $this
        ->delete(route('ingredients.destroy', $ingredient));

    $response->assertRedirect(route('ingredients.index'));
    $this->assertDatabaseMissing('ingredients', [
        'id' => $ingredient->id,
    ]);
});

test('ingredient creation validates image url format', function () {
    $user = User::factory()->create();

    $response = $this
        ->actingAs($user)
        ->from(route('ingredients.index'))
        ->post(route('ingredients.store'), [
            'name' => 'Poivre',
            'image_url' => 'not-a-valid-url',
            'unit' => 'g',
            'stock_quantity' => 400,
            'alert_threshold' => 50,
        ]);

    $response
        ->assertRedirect(route('ingredients.index'))
        ->assertSessionHasErrors(['image_url']);
});

test('the ingredients index caps the low-stock panel at the three most urgent items', function () {
    $user = User::factory()->create();
    $this->actingAs($user);

    // Five ingredients under threshold (varying urgency) + one healthy.
    Ingredient::create(['name' => 'Urgent 1', 'unit' => 'kg', 'stock_quantity' => 0, 'alert_threshold' => 10]);
    Ingredient::create(['name' => 'Urgent 2', 'unit' => 'kg', 'stock_quantity' => 1, 'alert_threshold' => 10]);
    Ingredient::create(['name' => 'Urgent 3', 'unit' => 'kg', 'stock_quantity' => 2, 'alert_threshold' => 10]);
    Ingredient::create(['name' => 'Low 4', 'unit' => 'kg', 'stock_quantity' => 3, 'alert_threshold' => 10]);
    Ingredient::create(['name' => 'Low 5', 'unit' => 'kg', 'stock_quantity' => 4, 'alert_threshold' => 10]);
    Ingredient::create(['name' => 'Healthy', 'unit' => 'kg', 'stock_quantity' => 50, 'alert_threshold' => 10]);

    // The panel shows the 3 most urgent, while lowStockCount (shared prop)
    // keeps the true total so the header and "+N autres" link stay honest.
    $this->get(route('ingredients.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('Ingredients/Index')
            ->has('lowStockIngredients', 3)
            ->where('lowStockIngredients.0.name', 'Urgent 1')
            ->where('lowStockCount', 5)
        );
});
