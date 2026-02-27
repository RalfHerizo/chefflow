<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Order;
use App\Models\Ingredient;
use App\Models\Product;

class DashboardController extends Controller
{
    public function index(){
        return Inertia::render('Dashboard',[
            'ingredients' => Ingredient::all(),
            'products' => Product::all(),
            'orders' => Order::with('product')->latest()->take(10)->get(),
        ]);
    }
}
