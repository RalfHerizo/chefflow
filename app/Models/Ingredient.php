<?php

namespace App\Models;

use App\Models\Product;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;

class Ingredient extends Model
{
    protected $fillable = ['name', 'image_url', 'unit', 'stock_quantity', 'alert_threshold'];

    public function products()
    {
        return $this->belongsToMany(Product::class)->withTimestamps();
    }

    public function isLowStock(): Attribute
    {
        return Attribute::make(
            get: function (mixed $value, array $attributes) {
                if (
                    !array_key_exists('stock_quantity', $attributes) ||
                    !array_key_exists('alert_threshold', $attributes)
                ) {
                    return false;
                }

                return (float) $attributes['stock_quantity'] <= (float) $attributes['alert_threshold'];
            },
        );
    }

    protected $appends = ['is_low_stock'];
}
