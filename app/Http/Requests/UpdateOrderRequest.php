<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Validation Gate — enforces input contracts before reaching the controller.
 */
class UpdateOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Keeps authorization centralized for updates before business logic runs.
        return false;
    }

    public function rules(): array
    {
        // Placeholder for update rules; intentionally empty at this stage.
        return [];
    }
}
