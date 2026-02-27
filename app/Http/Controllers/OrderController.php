<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use App\Actions\SellProductAction;
use App\Actions\CancelOrderAction;
use Exception;

class OrderController extends Controller
{
    public function store(Request $request, SellProductAction $sellProductAction){
        
        $validate_data = $request->validate([
            'product_id'=>'required|exists:products,id',
            'quantity'=>'required|integer|min:1'
        ]);

        try{

            $product = Product::findOrFail($validate_data['product_id']);
            $sellProductAction->execute($product,$validate_data['quantity']);
            
            return back()->with('message','vente réussie! Stock mis à jour');

        }catch(Exception $error){
            return back()->withErrors([ 'error'=> $error->getMessage() ]);
        }
    }

    public function destroy(Order $order, CancelOrderAction $cancelAction){
        $cancelAction->execute($order);

        return back()->with('message', 'Commande annulée et stocks restaurés.');
    }
}
