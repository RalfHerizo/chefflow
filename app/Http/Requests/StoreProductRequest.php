<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'price' => ['required', 'integer', 'min:0'],
            'category_id' => ['nullable', 'exists:categories,id'],
            'images' => ['nullable', 'array', 'max:4'],
            'images.*' => ['image', 'mimes:jpg,jpeg,png,webp', 'max:2048'],
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Le nom est obligatoire.',
            'name.string' => 'Le nom doit etre une chaine de caractères.',
            'name.max' => 'Le nom ne doit pas depasser 255 caractères.',
            'price.required' => 'Le prix est obligatoire.',
            'price.integer' => 'Le prix doit etre un entier.',
            'price.min' => 'Le prix ne peut pas etre négatif.',
            'category_id.exists' => 'La categorie selectionnée est invalide.',
            'images.array' => 'Le format des images est invalide.',
            'images.max' => 'Vous pouvez ajouter au maximum 4 images.',
            'images.*.image' => 'Chaque fichier doit être une image.',
            'images.*.mimes' => 'Formats acceptés: jpg, jpeg, png, webp.',
            'images.*.max' => 'Chaque image ne doit pas depasser 2 Mo.',
        ];
    }
}
