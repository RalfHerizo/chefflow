import InputError from '@/Components/InputError';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Button } from '@/Components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CATEGORY_OPTIONS = ['Entree', 'Plat', 'Dessert', 'Boisson'];

const EMPTY_LINE = { id: '', amount: '' };

/**
 * @param {{ ingredients: Array<{id: number|string, name: string, unit: string}> }} props
 */
export default function CreateProduct({ ingredients }) {
    const [photoPreview, setPhotoPreview] = useState(null);
    const [clientErrors, setClientErrors] = useState({});

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        price: '',
        category: '',
        photo: null,
        ingredients: [{ ...EMPTY_LINE }],
    });

    const selectedIngredientsCount = useMemo(
        () => data.ingredients.filter((line) => Boolean(line.id)).length,
        [data.ingredients],
    );
    const hasIngredients = ingredients.length > 0;

    const addIngredient = () => {
        setData('ingredients', [...data.ingredients, { ...EMPTY_LINE }]);
    };

    const removeIngredient = (index) => {
        const next = data.ingredients.filter((_, i) => i !== index);
        setData('ingredients', next.length ? next : [{ ...EMPTY_LINE }]);
    };

    const updateIngredientLine = (index, key, value) => {
        const next = [...data.ingredients];
        next[index] = { ...next[index], [key]: value };
        setData('ingredients', next);
    };

    const onPhotoChange = (event) => {
        const file = event.target.files?.[0] || null;
        setData('photo', file);

        if (!file) {
            setPhotoPreview(null);
            return;
        }

        setPhotoPreview(URL.createObjectURL(file));
    };

    const validateClientSide = () => {
        const nextErrors = {};

        if (!data.price || Number(data.price) <= 0) {
            nextErrors.price = 'Le prix doit etre positif.';
        }

        const hasIngredient = data.ingredients.some((line) => line.id && Number(line.amount) > 0);
        if (!hasIngredient) {
            nextErrors.ingredients = 'Selectionne au moins un ingredient avec une quantite.';
        }

        setClientErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validateClientSide()) {
            return;
        }

        post(route('products.store'), {
            forceFormData: true,
            onSuccess: () => {
                toast.success('Produit cree avec succes.');
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Nouveau Produit" />

            <div className="mx-auto max-w-7xl space-y-6">
                <div className="flex items-center justify-between">
                    <div />
                    <Button variant="outline" asChild>
                        <Link href={route('products.index')}>
                            <ArrowLeft />
                            Retour
                        </Link>
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Infos Produit</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Nom</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                        placeholder="Ex: Burger Maison"
                                    />
                                    <InputError message={errors.name} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">Prix</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                        placeholder="Ex: 12.90"
                                    />
                                    <InputError message={clientErrors.price || errors.price} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Categorie
                                    </label>
                                    <Select
                                        value={data.category}
                                        onValueChange={(value) => setData('category', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Choisir une categorie" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {CATEGORY_OPTIONS.map((category) => (
                                                <SelectItem key={category} value={category}>
                                                    {category}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <InputError message={errors.category} />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700">
                                        Upload Photo
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={onPhotoChange}
                                        className="block h-11 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-orange-100 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-[#FF7E47]"
                                    />
                                    <InputError message={errors.photo} />
                                </div>
                            </div>

                            {photoPreview ? (
                                <div className="pt-2">
                                    <img
                                        src={photoPreview}
                                        alt="Preview"
                                        className="h-28 w-28 rounded-lg object-cover"
                                    />
                                </div>
                            ) : null}
                        </CardContent>
                    </Card>

                    <Card className="border-slate-200/70 bg-white shadow-sm">
                        <CardHeader>
                            <CardTitle>Recette</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {!hasIngredients ? (
                                <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    Il n'y a pas encore d'ingredient disponible. Ajoute d'abord des
                                    ingredients dans la page Inventaire.
                                </div>
                            ) : null}

                            <div className="space-y-3">
                                {data.ingredients.map((line, index) => (
                                    <div
                                        key={index}
                                        className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200/80 p-3 md:grid-cols-[1fr_180px_auto]"
                                    >
                                        <Select
                                            value={line.id ? String(line.id) : ''}
                                            disabled={!hasIngredients}
                                            onValueChange={(value) =>
                                                updateIngredientLine(index, 'id', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Choisir un ingredient" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {hasIngredients ? (
                                                    ingredients.map((ingredient) => (
                                                        <SelectItem
                                                            key={ingredient.id}
                                                            value={String(ingredient.id)}
                                                        >
                                                            {ingredient.name} ({ingredient.unit})
                                                        </SelectItem>
                                                    ))
                                                ) : (
                                                    <div className="px-2 py-1.5 text-sm text-slate-500">
                                                        Aucun ingredient disponible.
                                                    </div>
                                                )}
                                            </SelectContent>
                                        </Select>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.0001"
                                            disabled={!hasIngredients}
                                            value={line.amount}
                                            onChange={(e) =>
                                                updateIngredientLine(index, 'amount', e.target.value)
                                            }
                                            className="h-11 rounded-xl border border-slate-200 px-3 text-sm outline-none focus:border-[#FF7E47]"
                                            placeholder="Quantite"
                                        />

                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => removeIngredient(index)}
                                            className="h-11"
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
                                <p className="text-sm text-slate-600">
                                    Total ingredients utilises: {selectedIngredientsCount}
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={addIngredient}
                                    disabled={!hasIngredients}
                                    className="border-[#FF7E47] text-[#FF7E47] hover:bg-orange-50"
                                >
                                    <Plus />
                                    Ajouter ingredient
                                </Button>
                            </div>
                            <InputError message={clientErrors.ingredients || errors.ingredients} />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                            className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]"
                        >
                            {processing ? 'Traitement...' : 'Creer le produit'}
                        </Button>
                    </div>
                </form>
            </div>
        </AuthenticatedLayout>
    );
}
