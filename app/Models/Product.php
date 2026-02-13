<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;
// IMPORTANT : Ajoute ces deux imports !
use Illuminate\Database\Eloquent\Casts\Attribute; 
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Product extends Model
{
    protected $fillable = ['name','price','is_active', 'price_in_euro'];
    
    public function ingredients(): BelongsToMany{

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
            
            get: fn(mixed $value, array $attributes) => ($attributes['price'] ?? 0) / 100, // affichage en euro
            
            set: fn(mixed $value) =>[
                'price' => (int) ($value*100), //Enregistrement du prix en centime
            ]
            
        );
    }
}
