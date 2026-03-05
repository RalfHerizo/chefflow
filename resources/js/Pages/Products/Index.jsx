import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import ConfirmationDialog from '@/Components/ui/confirmation-dialog';
import { formatAmountDisplay } from '@/lib/amountConversion';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
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
import { Head, Link, router } from '@inertiajs/react';
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

const PRODUCT_THUMBNAIL_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="56" height="56"><rect width="100%" height="100%" fill="%23F1F5F9"/><text x="50%" y="53%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="10">PRD</text></svg>';

function formatPrice(cents) {
    const value = Number(cents || 0) / 100;
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

/**
 * @param {{ products: Array<{id: number|string, name: string, category?: string|null, image_url?: string|null, price: number|string, is_active: boolean, ingredients_count: number, ingredients?: Array<{id: number|string, name: string, unit: string, amount: number|string}>}> }} props
 */
export default function ProductsIndex({ products }) {
    const [previewProduct, setPreviewProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    const [statusLoadingId, setStatusLoadingId] = useState(null);

    const handleDeleteProduct = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(route('products.destroy', productToDelete.id), {
            onSuccess: () => toast.success('Produit supprime avec succès.'),
            onFinish: () => setProductToDelete(null),
        });
    };

    const toggleStatus = (product) => {
        setStatusLoadingId(product.id);
        router.patch(route('products.toggle-status', product.id), undefined, {
            preserveScroll: true,
            onFinish: () => setStatusLoadingId(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Produits" />

            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="mb-6 flex items-center justify-between gap-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Liste des produits
                            </h3>
                            <p className="text-sm text-slate-500">
                                Consulte les produits et leur recette associée.
                            </p>
                        </div>

                        <Button asChild className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]">
                            <Link href={route('products.create')}>
                                <Plus />
                                Créer un nouveau produit
                            </Link>
                        </Button>
                    </div>

                    <div className="rounded-xl border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4">Produit</TableHead>
                                    <TableHead className="px-4">Categorie</TableHead>
                                    <TableHead className="px-4">Prix</TableHead>
                                    <TableHead className="px-4">Recette</TableHead>
                                    <TableHead className="px-4">Statut</TableHead>
                                    <TableHead className="px-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={6}
                                            className="px-4 py-8 text-center text-sm text-slate-500"
                                        >
                                            Aucun produit disponible. Cree ton premier produit.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="px-4 font-medium text-slate-700">
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={
                                                            product.image_url ||
                                                            PRODUCT_THUMBNAIL_PLACEHOLDER
                                                        }
                                                        alt={product.name}
                                                        className="h-10 w-10 rounded-md object-cover"
                                                    />
                                                    <span>{product.name}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {product.category || '-'}
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {formatPrice(product.price)}
                                            </TableCell>
                                            <TableCell className="px-4 text-slate-600">
                                                {product.ingredients_count} ingredient(s)
                                            </TableCell>
                                            <TableCell className="px-4">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    disabled={statusLoadingId === product.id}
                                                    onClick={() => toggleStatus(product)}
                                                    className={
                                                        product.is_active
                                                            ? 'h-8 border-emerald-200 bg-emerald-50 px-3 text-emerald-700 hover:bg-emerald-100'
                                                            : 'h-8 border-slate-300 bg-slate-100 px-3 text-slate-700 hover:bg-slate-200'
                                                    }
                                                >
                                                    {product.is_active ? 'Actif' : 'Inactif'}
                                                </Button>
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
                                                            onClick={() => setPreviewProduct(product)}
                                                        >
                                                            Voir
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem asChild>
                                                            <Link
                                                                href={route('products.edit', product.id)}
                                                            >
                                                                Modifier
                                                            </Link>
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            className="text-red-600 hover:text-red-700"
                                                            onClick={() => setProductToDelete(product)}
                                                        >
                                                            Supprimer
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>

            <Dialog open={Boolean(previewProduct)} onOpenChange={(open) => !open && setPreviewProduct(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{previewProduct?.name || 'Apercu produit'}</DialogTitle>
                        <DialogDescription>
                            Details du produit et de sa recette.
                        </DialogDescription>
                    </DialogHeader>

                    {previewProduct ? (
                        <div className="space-y-4 mt-5">
                            <div className="flex items-center gap-4">
                                <img
                                    src={
                                        previewProduct.image_url ||
                                        PRODUCT_THUMBNAIL_PLACEHOLDER
                                    }
                                    alt={previewProduct.name}
                                    className="h-20 w-20 rounded-md object-cover"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">
                                        Categorie: {previewProduct.category || '-'}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Prix: {formatPrice(previewProduct.price)}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Statut: {previewProduct.is_active ? 'Actif' : 'Inactif'}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-slate-200 p-3">
                                <p className="mb-2 text-sm font-medium text-slate-700">Recette</p>
                                {previewProduct.ingredients?.length ? (
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        {previewProduct.ingredients.map((ingredient) => (
                                            <li key={ingredient.id}>
                                                {ingredient.name} -{' '}
                                                {formatAmountDisplay(
                                                    ingredient.amount,
                                                    ingredient.unit,
                                                )}{' '}
                                                {ingredient.unit}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-500">
                                        Aucune recette associee.
                                    </p>
                                )}
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>

            <ConfirmationDialog
                open={Boolean(productToDelete)}
                onOpenChange={(open) => {
                    if (!open) {
                        setProductToDelete(null);
                    }
                }}
                title="Supprimer ce produit ?"
                description={
                    productToDelete
                        ? `Cette action supprimera "${productToDelete.name}" et sa recette associee.`
                        : ''
                }
                confirmLabel="Supprimer"
                destructive
                onConfirm={handleDeleteProduct}
            />
        </AuthenticatedLayout>
    );
}
