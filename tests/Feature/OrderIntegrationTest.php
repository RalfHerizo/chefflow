<?php
use App\Models\Product;
use App\Models\Ingredient;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);


it('permet de vendre un produit via une requête HTTP', function(){
    
    $ingredient = Ingredient::create([
        'name'=>'Sucre',
        'unit'=>'g',
        'stock_quantity'=>1000
    ]);

    $product = Product::create(['name'=>'Jus de Fruit', 'price'=> 500]);
    $product->ingredients()->attach($ingredient->id, ['amount' => 50]);

    $response = $this->post('/sell',[
        'product_id' => $product->id,
        'quantity' => 2
    ]);

    $response->assertStatus(302);
    $response->assertSessionHasNoErrors();

    $ingredient->refresh();
    expect((float) $ingredient->stock_quantity)->toBe(900.0);

});