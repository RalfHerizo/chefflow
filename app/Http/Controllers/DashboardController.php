<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Ingredient;

class DashboardController extends Controller
{
    public function index(){
        return Inertia::render('Dashboard',[
            'ingredients' => Ingredient::all()
        ]);
    }
}
