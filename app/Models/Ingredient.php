<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Product;
use Illuminate\Database\Eloquent\Casts\Attribute;

class Ingredient extends Model
{
    protected $fillable = ['name','unit','stock_quantity','alert_threshold'];
    
    public function products(){

        return $this->belongsToMany(Product::class)->withTimestamps();    
    }
    
    public function isLowStock(): Attribute{
        return Attribute::make(
            get: fn (mixed $value, array $attributes) =>
                (float)$attributes['stock_quantity'] <= (float)$attributes['alert_threshold'], //inférieure ou égale
            );

    }
        
    protected $appends = ['is_low_stock'];
}
