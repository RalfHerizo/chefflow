<?php

namespace App\Actions;

use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Exception;

Class CancelOrderAction
{
    public function execute(Order $order): void
    {
        DB::transaction(function () use ($order){
            $product = $order->product;
            $quantity = $order->quantity;

            foreach($product->ingredients as $ingredient){
                $toRestore = $ingredient->pivot->amount * $quantity;
                $ingredient->increment('stock_quantity', $toRestore);
            }

            $order->delete();
        });
    }
}