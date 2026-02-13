<?php

use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

it('convertit les euros en centimes lors de l\'enregistrement',function(){
    $product = Product::create([
        'name'=>'Pain au chocolat',
        'price_in_euro'=>1.50,
        'is_active'=>true
    ]);

    expect($product->price)->toBe(150);
});

it('convertit les centimes en euros lors de la lecture', function(){
    $product = new Product();

    $product->price = 199;

    expect($product->price_in_euro)->toBe(1.99);
});

it('gère correctement les nombres avec beaucoup de décimales', function(){
    $product = new Product();
    $product->price_in_euro = 10.555;

    expect($product->price)->toBe(1055);
});