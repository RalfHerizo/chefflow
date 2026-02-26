<?php

use App\Models\Product;
use App\Models\Order;
use App\Models\Ingredient;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('records an order after a successful sale', function(){
    
    $product = Product::factory()->create(['name'=>'Cheese Burger','price' => 1000]); // 10.00€
    
    $ingredient = Ingredient::create([
        'name'=>'Cheese',
        'unit'=>'g',
        'stock_quantity'=>1900
    ]);

    $product->ingredients()->attach($ingredient->id, ['amount' => 80]);

    $action = new \App\Actions\SellProductAction();
    $order = $action->execute($product, 2);

    expect(Order::count())->toBe(1);
    expect($order->total_price)->toBe(2000);
});