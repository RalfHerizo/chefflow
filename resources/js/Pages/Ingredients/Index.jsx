import IngredientForm from '@/Components/Ingredients/IngredientForm';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import ConfirmationDialog from '@/Components/ui/confirmation-dialog';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/Components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import Pagination from '@/Components/ui/pagination';
import { formatAmountDisplay } from '@/lib/amountConversion';
import { Head, router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

const DEFAULT_FORM = {
    name: '',
    image_url: '',
    unit: 'kg',
    stock_quantity: '',
    alert_threshold: '',
};

const INGREDIENT_THUMBNAIL_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="10">ING</text></svg>';

/**
 * @param {{ ingredients: { data: Array<{id: number, name: string, image_url?: string|null, unit: string, stock_quantity: number|string, alert_threshold: number|string}>, links: Array<{url: string|null, label: string, active: boolean}> }, filters?: { search?: string }, flash?: {message?: string} }} props
 */
export default function IngredientsIndex({ ingredients, filters, flash }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const searchTimeout = useRef();

    const createForm = useForm(DEFAULT_FORM);
    const editForm = useForm(DEFAULT_FORM);

    const handleSearch = (value) => {
        setSearch(value);
        clearTimeout(searchTimeout.current);
        searchTimeout.current = setTimeout(() => {
            router.get(
                route('ingredients.index'),
                { search: value || undefined },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['ingredients', 'filters'],
                },
            );
        }, 150);
    };

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('ingredients.store'), {
            onSuccess: () => {
                toast.success('Ingrédient ajouté');
                createForm.reset();
                setIsAddOpen(false);
            },
        });
    };

    const openEditDialog = (ingredient) => {
        setEditingIngredient(ingredient);
        editForm.setData({
            name: ingredient.name ?? '',
            image_url: ingredient.image_url ?? '',
            unit: ingredient.unit ?? 'kg',
            stock_quantity: formatAmountDisplay(
                ingredient.stock_quantity,
                ingredient.unit,
            ),
            alert_threshold: formatAmountDisplay(
                ingredient.alert_threshold,
                ingredient.unit,
            ),
        });
        setIsEditOpen(true);
    };

    const submitEdit = (e) => {
        e.preventDefault();
        if (!editingIngredient) {
            return;
        }
        editForm.patch(route('ingredients.update', editingIngredient.id), {
            onSuccess: () => {
                toast.success('Ingrédient modifié');
                setIsEditOpen(false);
                setEditingIngredient(null);
            },
        });
    };

    const confirmDeleteIngredient = () => {
        if (!ingredientToDelete) {
            return;
        }

        router.delete(route('ingredients.destroy', ingredientToDelete.id), {
            onSuccess: () => toast.success('Ingrédient supprimé'),
            onFinish: () => setIngredientToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Ingrédients" />

            <div className="mx-auto max-w-7xl space-y-6">
                {flash?.message ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                        {flash.message}
                    </div>
                ) : null}

                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Gestion des ingrédients
                            </h3>
                            <p className="text-sm text-slate-500">
                                Suivez vos stocks et seuils d'alerte.
                            </p>
                        </div>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]">
                                    <Plus />
                                    Ajouter un ingrédient
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Ajouter un ingrédient</DialogTitle>
                                    <DialogDescription>
                                        Renseignez les informations de stock initial.
                                    </DialogDescription>
                                </DialogHeader>
                                <IngredientForm
                                    data={createForm.data}
                                    setData={createForm.setData}
                                    errors={createForm.errors}
                                    processing={createForm.processing}
                                    submitLabel="Ajouter"
                                    onSubmit={submitCreate}
                                />
                            </DialogContent>
                        </Dialog>
                    </div>

                    <div className="relative mb-4">
                        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <input
                            type="search"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Rechercher un ingrédient..."
                            className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#FF7E47]"
                        />
                    </div>

                    <div className="rounded-xl border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4">Nom</TableHead>
                                    <TableHead className="px-4">Unité</TableHead>
                                    <TableHead className="px-4">Stock actuel</TableHead>
                                    <TableHead className="px-4">Seuil d'alerte</TableHead>
                                    <TableHead className="px-4">Statut</TableHead>
                                    <TableHead className="px-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ingredients.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-sm text-slate-500"
                                        >
                                            {search
                                                ? 'Aucun ingrédient ne correspond à votre recherche.'
                                                : 'Aucun ingrédient. Ajoutez-en un pour commencer.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    ingredients.data.map((ingredient) => {
                                        const currentStock = Number(ingredient.stock_quantity);
                                        const threshold = Number(ingredient.alert_threshold);
                                        const isCritical = currentStock <= threshold;

                                        return (
                                            <TableRow key={ingredient.id}>
                                                <TableCell className="px-4 font-medium text-slate-700">
                                                    <div className="flex items-center gap-3">
                                                        <img
                                                            src={
                                                                ingredient.image_url ||
                                                                INGREDIENT_THUMBNAIL_PLACEHOLDER
                                                            }
                                                            alt={ingredient.name}
                                                            className="h-10 w-10 rounded-md object-cover"
                                                        />
                                                        <span>{ingredient.name}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="px-4 text-slate-600">
                                                    {ingredient.unit}
                                                </TableCell>
                                                <TableCell className="px-4 text-slate-600">
                                                    {formatAmountDisplay(
                                                        ingredient.stock_quantity,
                                                        ingredient.unit,
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4 text-slate-600">
                                                    {formatAmountDisplay(
                                                        ingredient.alert_threshold,
                                                        ingredient.unit,
                                                    )}
                                                </TableCell>
                                                <TableCell className="px-4">
                                                    <Badge
                                                        className={
                                                            isCritical
                                                                ? 'border-transparent bg-red-100 text-red-700'
                                                                : 'border-transparent bg-emerald-100 text-emerald-700'
                                                        }
                                                    >
                                                        {isCritical ? 'Critique' : 'Stable'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="px-4 text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="outline" size="icon">
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() => openEditDialog(ingredient)}
                                                            >
                                                                Modifier
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-red-600 hover:text-red-700"
                                                                onClick={() => setIngredientToDelete(ingredient)}
                                                            >
                                                                Supprimer
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    <Pagination
                        links={ingredients.links}
                        className="mt-4 border-t border-slate-100 pt-4"
                    />
                </section>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier un ingrédient</DialogTitle>
                        <DialogDescription>
                            Mettez à jour le stock et le seuil d'alerte.
                        </DialogDescription>
                    </DialogHeader>
                    <IngredientForm
                        data={editForm.data}
                        setData={editForm.setData}
                        errors={editForm.errors}
                        processing={editForm.processing}
                        submitLabel="Enregistrer"
                        onSubmit={submitEdit}
                    />
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={Boolean(ingredientToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        setIngredientToDelete(null);
                    }
                }}
                title="Supprimer cet ingrédient ?"
                description={
                    ingredientToDelete
                        ? `Cette action est irréversible pour "${ingredientToDelete.name}".`
                        : ''
                }
                confirmLabel="Supprimer"
                destructive
                onConfirm={confirmDeleteIngredient}
            />
        </AuthenticatedLayout>
    );
}
