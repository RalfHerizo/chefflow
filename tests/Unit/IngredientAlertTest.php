<?php

use App\Models\Ingredient;

it("returns true when stock quantity is lower than alert threshold",function(){
    $ingredient = new Ingredient([
        'stock_quantity' => 5,
        'alert_threshold' => 10,
    ]);
    expect($ingredient->is_low_stock)->toBeTrue();
});

it('returns true when stock quantity is equal to alert threshold', function(){
    $ingredient = new Ingredient([
        'stock_quantity' => 10,
        'alert_threshold' => 10,
    ]);

    expect($ingredient->is_low_stock)->toBeTrue();
});

it('returns false when stock quantity is greater than alert threshold', function () {
    $ingredient = new Ingredient([
        'stock_quantity' => 20,
        'alert_threshold' => 10,
    ]);

    expect($ingredient->is_low_stock)->toBeFalse();
});