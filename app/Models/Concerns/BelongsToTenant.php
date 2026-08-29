<?php

namespace App\Models\Concerns;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Scopes a model to the currently authenticated account (one account = one
 * restaurant). When a user is logged in, every query is automatically filtered
 * by `user_id` and new records inherit that owner. Outside an authenticated
 * context (console, jobs, direct Action calls in tests) no scoping is applied.
 */
trait BelongsToTenant
{
    protected static function bootBelongsToTenant(): void
    {
        static::addGlobalScope('tenant', function (Builder $builder) {
            if (auth()->check()) {
                $table = $builder->getModel()->getTable();
                $builder->where($table.'.user_id', auth()->id());
            }
        });

        static::creating(function ($model) {
            if (auth()->check() && empty($model->user_id)) {
                $model->user_id = auth()->id();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
