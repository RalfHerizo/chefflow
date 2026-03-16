<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Auth is enforced by middleware; this request focuses on validation only.
        return true;
    }

    public function rules(): array
    {
        return [
            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
        ];
    }

    public function messages(): array
    {
        return [
            'items.required' => 'Le panier ne peut pas être vide.',
            'items.array' => 'Le format du panier est invalide.',
            'items.min' => 'Le panier doit contenir au moins un article.',
            'items.*.id.required' => 'Chaque article doit avoir un identifiant.',
            'items.*.id.exists' => 'Le produit sélectionné n\'existe plus en catalogue.',
            'items.*.quantity.required' => 'La quantité est obligatoire.',
            'items.*.quantity.integer' => 'La quantité doit être un entier.',
            'items.*.quantity.min' => 'La quantité minimum est de 1 article.',
        ];
    }
}
