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

    $action = new SellProductAction();
    $action->execute([
        ['id' => $burger->id, 'qty' => 2],
    ]);

    $viande->refresh();

    expect((float)$viande->stock_quantity)->toBe(700.0);
});

it('deducts stocks and computes total price for a multi-product cart', function () {
    $pain = Ingredient::create([
        'name' => 'Pain',
        'unit' => 'pcs',
        'stock_quantity' => 20,
        'alert_threshold' => 0,
    ]);
    $boeuf = Ingredient::create([
        'name' => 'Boeuf',
        'unit' => 'g',
        'stock_quantity' => 2000,
        'alert_threshold' => 0,
    ]);
    $fromage = Ingredient::create([
        'name' => 'Fromage',
        'unit' => 'g',
        'stock_quantity' => 1500,
        'alert_threshold' => 0,
    ]);

    $burger = Product::create([
        'name' => 'Burger Classic',
        'price' => 1200,
        'is_active' => true,
    ]);
    $frites = Product::create([
        'name' => 'Frites',
        'price' => 400,
        'is_active' => true,
    ]);

    $burger->ingredients()->attach([
        $pain->id => ['amount' => 1],
        $boeuf->id => ['amount' => 150],
        $fromage->id => ['amount' => 30],
    ]);
    $frites->ingredients()->attach([
        $pain->id => ['amount' => 1],
    ]);

    $action = new SellProductAction();
    $order = $action->execute([
        ['id' => $burger->id, 'qty' => 2],
        ['id' => $frites->id, 'qty' => 3],
    ]);

    $pain->refresh();
    $boeuf->refresh();
    $fromage->refresh();

    expect($order->total_price)->toBe(3600);
    expect((float) $pain->stock_quantity)->toBe(15.0);
    expect((float) $boeuf->stock_quantity)->toBe(1700.0);
    expect((float) $fromage->stock_quantity)->toBe(1440.0);
});

it('annule toute la transaction si un ingrédient manque', function () {

    $sel = Ingredient::create(['name'=>'sel','unit'=>'g', 'stock_quantity' => 2]);
    
    $burger = Product::create(['name'=>'Burger Salé', 'price'=>1000]);
    $burger->ingredients()->attach($sel->id, ['amount'=>5]);

    $action = new SellProductAction();
    expect(fn() => $action->execute([
        ['id' => $burger->id, 'qty' => 1],
    ]))->toThrow(Exception::class);

    $sel->fresh();
    expect($sel->stock_quantity)->toEqual(2);

});
