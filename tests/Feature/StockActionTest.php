<?php

use App\Models\Product;
use App\Models\Ingredient;
use App\Actions\SellProductAction;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('déduit les stocks d\'ingrédients lors d\'une vente', function () {
    
    $viande = Ingredient::create([
        'name'=>'Viande hachée',
        'unit'=>'g',
        'stock_quantity'=>1000,
        'alert_threshold' => 0,
    ]);

    $burger = Product::create([
        'name'=>'Classic Burger',
        'price'=>1200,
        'is_active'=>true,
        
    ]);

    $burger->ingredients()->attach($viande->id, ['amount'=>150]);

    $burger->load('ingredients');

    $action = new SellProductAction();
    $action->execute($burger, 2);

    $viande->refresh();

    expect((float)$viande->stock_quantity)->toBe(700.0);
});

it('annule toute la transaction si un ingrédient manque', function () {

    $sel = Ingredient::create(['name'=>'sel','unit'=>'g', 'stock_quantity' => 2]);
    
    $burger = Product::create(['name'=>'Burger Salé', 'price'=>1000]);
    $burger->ingredients()->attach($sel->id, ['amount'=>5]);

    $action = new SellProductAction();
    expect( fn() => $action->execute($burger, 1) )->toThrow(Exception::class);

    $sel->fresh();
    expect($sel->stock_quantity)->toEqual(2);

});