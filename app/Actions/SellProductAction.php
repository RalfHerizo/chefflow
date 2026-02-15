<?php

namespace App\Actions;

use App\Models\Product;
use Illuminate\Support\Facades\DB;
use Exception;

class SellProductAction
{
    /**
     * Exécute la vente d'un produit et déduit les stocks.
     * @throws Exception
     */

     public function execute(Product $product, int $quantity): void
     {
        $product->load('ingredients');
        
        DB::transaction(function() use ($product, $quantity){
            
            if (!$product->is_active) {
                throw new Exception("Disabled product");
            }

            foreach($product->ingredients as $ingredient){

                $amountToSubstract = $ingredient->pivot->amount * $quantity;

                if($ingredient->stock_quantity < $amountToSubstract){
                    throw new Exception("Insufficient stock for the ingredient: {$ingredient->name}");
                }
                
                $ingredient->decrement('stock_quantity', $amountToSubstract);
            }

        });
     }
}