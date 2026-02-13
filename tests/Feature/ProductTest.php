<?php

use App\Models\Product;
use App\Models\Ingredient;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('un produit peut être lié à des ingrédients avec une quantité spécifique', function () {
    $ingredient = Ingredient::create([
        'name' => 'Farine',
        'unit' => 'g',
        'stock_quantity' => 1000,
    ]);

    $product = Product::create([
        'name' => 'Pain Maison',
        'price' => 200, // 2.00€
    ]);

    $product->ingredients()->attach($ingredient->id, ['amount' => 500]);

    $product->refresh();

    expect($product->ingredients)->toHaveCount(1);
    expect($product->ingredients->first()->name)->toBe('Farine');
    
    expect((float) $product->ingredients->first()->pivot->amount)->toBe(500.0);
});