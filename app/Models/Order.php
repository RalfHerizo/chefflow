<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use App\Models\Concerns\BelongsToTenant;
use App\Models\OrderItem;

class Order extends Model
{
    use BelongsToTenant;

    protected $fillable = [
        'quantity',
        'total_price',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}
