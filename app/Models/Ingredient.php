<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;

class Ingredient extends Model
{
    protected $fillable = ['name','unit','stock_quantity','alert_threshold'];
    
    public function products(){

        return $this->belongsToMany(Product::class)->withTimestamps();    
    }
}
