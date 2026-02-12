<?php

use App\Models\Product;
use App\Models\Ingredient;
use Illuminate\Foundation\Testing\RefreshDatabase;

// On utilise RefreshDatabase pour vider la base de données après chaque test
uses(RefreshDatabase::class);

test('un produit peut être lié à des ingrédients avec une quantité spécifique', function () {
    // 1. Arrange (Préparation)
    $ingredient = Ingredient::create([
        'name' => 'Farine',
        'unit' => 'g',
        'stock_quantity' => 1000,
    ]);

    $product = Product::create([
        'name' => 'Pain Maison',
        'price' => 200, // 2.00€
    ]);

    // 2. Act (Action)
    $product->ingredients()->attach($ingredient->id, ['amount' => 500]);

    // 3. Assert (Vérification)
    // On recharge le produit pour être sûr d'avoir les données fraîches de la DB
    $product->refresh();

    expect($product->ingredients)->toHaveCount(1);
    expect($product->ingredients->first()->name)->toBe('Farine');
    
    // Vérification de la valeur dans la table pivot (on force le type float pour la comparaison)
    expect((float) $product->ingredients->first()->pivot->amount)->toBe(500.0);
});