<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreIngredientRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'stock_quantity' => ['required', 'numeric', 'min:0'],
            'unit' => ['required', 'string', 'max:50'],
            'alert_threshold' => ['required', 'numeric', 'min:0'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit etre une chaine de caractères.',
            'name.max' => 'Le nom ne doit pas dépasser 255 caractères.',
            'stock_quantity.required' => 'Le stock est obligatoire.',
            'stock_quantity.numeric' => 'Le stock doit etre un nombre.',
            'stock_quantity.min' => 'Le stock ne peut pas etre négatif.',
            'unit.required' => "L'unite est obligatoire.",
            'unit.string' => "L'unite doit etre une chaine de caractères.",
            'unit.max' => "L'unite ne doit pas dépasser 50 caractères.",
            'alert_threshold.required' => "Le seuil d'alerte est obligatoire.",
            'alert_threshold.numeric' => "Le seuil d'alerte doit etre un nombre.",
            'alert_threshold.min' => "Le seuil d'alerte ne peut pas etre négatif.",
        ];
    }
}
