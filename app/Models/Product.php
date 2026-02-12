<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;

class Product extends Model
{
    protected $fillable = ['name','price','is_active'];
    
    public function ingredients(){

        return $this->belongsToMany(Ingredient::class)->withPivot('amount')->withTimestamps();

    } 

    protected function casts(): array{
        return [
            'price'=>'integer',
            'is_active'=>'boolean',
        ];
    }

    protected function priceInEuro(): Attribute{
        return Attribute::make(
            get: fn()=> $this->value * 100,
            set: fn($value)=> $value / 100,
        );
    }
}
