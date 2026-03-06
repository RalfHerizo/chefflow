<?php

use App\Models\Ingredient;
use App\Models\User;

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
    $ingredient = Ingredient::create([
        'name' => 'Lait',
        'image_url' => null,
        'unit' => 'L',
        'stock_quantity' => 12,
        'alert_threshold' => 3,
    ]);

    $response = $this
        ->actingAs($user)
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
    $ingredient = Ingredient::create([
        'name' => 'Sel',
        'unit' => 'g',
        'stock_quantity' => 1000,
        'alert_threshold' => 100,
    ]);

    $response = $this
        ->actingAs($user)
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

