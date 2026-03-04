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
import { Head, router, useForm } from '@inertiajs/react';
import { MoreHorizontal, Plus } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const DEFAULT_FORM = {
    name: '',
    unit: 'kg',
    stock_quantity: '',
    alert_threshold: '',
};

/**
 * @param {{ ingredients: Array<{id: number, name: string, unit: string, stock_quantity: number|string, alert_threshold: number|string}> , flash?: {message?: string} }} props
 */
export default function IngredientsIndex({ ingredients, flash }) {
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingIngredient, setEditingIngredient] = useState(null);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [ingredientToDelete, setIngredientToDelete] = useState(null);

    const createForm = useForm(DEFAULT_FORM);
    const editForm = useForm(DEFAULT_FORM);

    const submitCreate = (e) => {
        e.preventDefault();
        createForm.post(route('ingredients.store'), {
            onSuccess: () => {
                toast.success('Ingredient ajoute');
                createForm.reset();
                setIsAddOpen(false);
            },
        });
    };

    const openEditDialog = (ingredient) => {
        setEditingIngredient(ingredient);
        editForm.setData({
            name: ingredient.name ?? '',
            unit: ingredient.unit ?? 'kg',
            stock_quantity: ingredient.stock_quantity ?? '',
            alert_threshold: ingredient.alert_threshold ?? '',
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
                toast.success('Ingredient modifie');
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
            onSuccess: () => toast.success('Ingredient supprime'),
            onFinish: () => setIngredientToDelete(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Ingredients" />

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
                                Gestion des ingredients
                            </h3>
                            <p className="text-sm text-slate-500">
                                Suivez vos stocks et seuils d'alerte.
                            </p>
                        </div>

                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]">
                                    <Plus />
                                    Ajouter un ingredient
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Ajouter un ingredient</DialogTitle>
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

                    <div className="rounded-xl border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4">Nom</TableHead>
                                    <TableHead className="px-4">Unite</TableHead>
                                    <TableHead className="px-4">Stock actuel</TableHead>
                                    <TableHead className="px-4">Seuil d'alerte</TableHead>
                                    <TableHead className="px-4">Statut</TableHead>
                                    <TableHead className="px-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {ingredients.map((ingredient) => {
                                    const currentStock = Number(ingredient.stock_quantity);
                                    const threshold = Number(ingredient.alert_threshold);
                                    const isCritical = currentStock <= threshold;

                                    return (
                                        <TableRow key={ingredient.id}>
                                            <TableCell className="px-4 font-medium text-slate-700">
                                                {ingredient.name}
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {ingredient.unit}
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {currentStock}
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {threshold}
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
                                })}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>

            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Modifier un ingredient</DialogTitle>
                        <DialogDescription>
                            Mettez a jour le stock et le seuil d'alerte.
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
                title="Supprimer cet ingredient ?"
                description={
                    ingredientToDelete
                        ? `Cette action est irreversible pour "${ingredientToDelete.name}".`
                        : ''
                }
                confirmLabel="Supprimer"
                destructive
                onConfirm={confirmDeleteIngredient}
            />
        </AuthenticatedLayout>
    );
}
