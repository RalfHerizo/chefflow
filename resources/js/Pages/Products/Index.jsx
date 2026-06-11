import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import ConfirmationDialog from '@/Components/ui/confirmation-dialog';
import Pagination from '@/Components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/Components/ui/select';
import { formatIngredientAmountForPreview } from '@/lib/amountConversion';
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
import { ArrowDown, ArrowUp, MoreHorizontal, Plus, Search } from 'lucide-react';
import { useRef, useState } from 'react';
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
 * @param {{ products: { data: Array<{id: number|string, name: string, category?: string|null, image_url?: string|null, price: number|string, is_active: boolean, is_makeable: boolean, ingredients_count: number, ingredients?: Array<{id: number|string, name: string, unit: string, amount: number|string}>}>, links: Array<{url: string|null, label: string, active: boolean}> }, categories?: Array<string>, filters?: { search?: string, status?: string, category?: string, sort?: string, direction?: string } }} props
 */
export default function ProductsIndex({ products, categories = [], filters }) {
    const [previewProduct, setPreviewProduct] = useState(null);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
    const [productToDelete, setProductToDelete] = useState(null);
    const [statusLoadingId, setStatusLoadingId] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [status, setStatus] = useState(filters?.status ?? 'all');
    const [category, setCategory] = useState(filters?.category ?? 'all');
    const [sort, setSort] = useState(filters?.sort ?? 'recent');
    const [direction, setDirection] = useState(filters?.direction ?? 'desc');
    const searchTimeout = useRef();

    const reload = (overrides = {}, { debounce = false } = {}) => {
        const next = { search, status, category, sort, direction, ...overrides };
        const visit = () =>
            router.get(
                route('products.index'),
                {
                    search: next.search || undefined,
                    status:
                        next.status && next.status !== 'all'
                            ? next.status
                            : undefined,
                    category:
                        next.category && next.category !== 'all'
                            ? next.category
                            : undefined,
                    sort: next.sort !== 'recent' ? next.sort : undefined,
                    direction: next.direction !== 'desc' ? next.direction : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['products', 'filters'],
                },
            );

        clearTimeout(searchTimeout.current);
        if (debounce) {
            searchTimeout.current = setTimeout(visit, 150);
        } else {
            visit();
        }
    };

    const handleSearch = (value) => {
        setSearch(value);
        reload({ search: value }, { debounce: true });
    };

    const handleStatus = (value) => {
        setStatus(value);
        reload({ status: value });
    };

    const handleCategory = (value) => {
        setCategory(value);
        reload({ category: value });
    };

    const handleSort = (value) => {
        setSort(value);
        reload({ sort: value });
    };

    const toggleDirection = () => {
        const next = direction === 'asc' ? 'desc' : 'asc';
        setDirection(next);
        reload({ direction: next });
    };

    const handleDeleteProduct = () => {
        if (!productToDelete) {
            return;
        }

        router.delete(route('products.destroy', productToDelete.id), {
            onSuccess: () => toast.success('Produit supprimé avec succès.'),
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

    const openPreview = (product) => {
        setPreviewProduct(product);
        setCurrentPhotoIndex(0);
    };

    const closePreview = () => {
        setPreviewProduct(null);
    };

    const previewImages = previewProduct?.images?.length
        ? previewProduct.images
        : [];

    const mainPreviewImage =
        previewImages[currentPhotoIndex]?.url ||
        previewProduct?.image_url ||
        PRODUCT_THUMBNAIL_PLACEHOLDER;

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

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Rechercher un produit..."
                                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#FF7E47]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            {categories.length > 0 && (
                                <Select
                                    value={category}
                                    onValueChange={handleCategory}
                                >
                                    <SelectTrigger className="h-10 w-full rounded-xl sm:w-[200px]">
                                        <SelectValue placeholder="Catégorie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Toutes les catégories
                                        </SelectItem>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat} value={cat}>
                                                {cat}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                            <Select value={status} onValueChange={handleStatus}>
                                <SelectTrigger className="h-10 w-full rounded-xl sm:w-[160px]">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Tous les statuts
                                    </SelectItem>
                                    <SelectItem value="active">Actif</SelectItem>
                                    <SelectItem value="inactive">Inactif</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sort} onValueChange={handleSort}>
                                <SelectTrigger className="h-10 w-full rounded-xl sm:w-[180px]">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Plus récent</SelectItem>
                                    <SelectItem value="name">Nom</SelectItem>
                                    <SelectItem value="category">Catégorie</SelectItem>
                                    <SelectItem value="price">Prix</SelectItem>
                                    <SelectItem value="recipe">Recette</SelectItem>
                                    <SelectItem value="status">Statut</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={toggleDirection}
                                title={
                                    direction === 'asc' ? 'Croissant' : 'Décroissant'
                                }
                                className="h-10 w-10 shrink-0 rounded-xl"
                            >
                                {direction === 'asc' ? (
                                    <ArrowUp className="h-4 w-4" />
                                ) : (
                                    <ArrowDown className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="px-4">Produit</TableHead>
                                    <TableHead className="px-4">Catégorie</TableHead>
                                    <TableHead className="px-4">Prix</TableHead>
                                    <TableHead className="px-4">Recette</TableHead>
                                    <TableHead className="px-4">Statut</TableHead>
                                    <TableHead className="px-4">Stock</TableHead>
                                    <TableHead className="px-4 text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-sm text-slate-500"
                                        >
                                            {search || status !== 'all' || category !== 'all'
                                                ? 'Aucun produit ne correspond aux filtres.'
                                                : 'Aucun produit. Créez votre premier produit.'}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.data.map((product) => (
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
                                                {product.ingredients_count} ingrédient(s)
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
                                            <TableCell className="px-4">
                                                <Badge
                                                    className={
                                                        product.is_makeable
                                                            ? 'border-transparent bg-emerald-100 text-emerald-700'
                                                            : 'border-transparent bg-red-100 text-red-700'
                                                    }
                                                >
                                                    {product.is_makeable ? 'OK' : 'Rupture'}
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
                                                            onClick={() => openPreview(product)}
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

                    <Pagination
                        links={products.links}
                        className="mt-4 border-t border-slate-100 pt-4"
                    />
                </section>
            </div>

            <Dialog open={Boolean(previewProduct)} onOpenChange={(open) => !open && closePreview()}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{previewProduct?.name || 'Aperçu produit'}</DialogTitle>
                        <DialogDescription>
                            Détails du produit et de sa recette.
                        </DialogDescription>
                    </DialogHeader>

                    {previewProduct ? (
                        <div className="space-y-4 mt-5">
                            <div className="flex items-center gap-4">
                                <img
                                    src={mainPreviewImage}
                                    alt={previewProduct.name}
                                    className="h-24 w-24 rounded-md object-cover"
                                />
                                <div className="space-y-1">
                                    <p className="text-sm text-slate-500">
                                        Catégorie: {previewProduct.category || '-'}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Prix: {formatPrice(previewProduct.price)}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Statut: {previewProduct.is_active ? 'Actif' : 'Inactif'}
                                    </p>
                                </div>
                            </div>

                            {previewImages.length ? (
                                <div className="flex justify-between gap-2">
                                    {previewImages.map((image, index) => (
                                        <button
                                            type="button"
                                            key={image.id ?? image.url}
                                            onClick={() => setCurrentPhotoIndex(index)}
                                            className={`h-lg w-lg overflow-hidden rounded-md border transition ${
                                                index === currentPhotoIndex
                                                    ? 'border-[#FF7E47]'
                                                    : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <img
                                                src={image.url}
                                                alt={`Miniature ${index + 1}`}
                                                className="h-full w-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            ) : null}

                            <div className="rounded-xl border border-slate-200 p-3">
                                <p className="mb-2 text-sm font-medium text-slate-700">Recette</p>
                                {previewProduct.ingredients?.length ? (
                                    <ul className="space-y-1 text-sm text-slate-600">
                                        {previewProduct.ingredients.map((ingredient) => {
                                            const previewAmount = formatIngredientAmountForPreview(
                                                ingredient.amount,
                                                ingredient.unit,
                                            );

                                            return (
                                                <li key={ingredient.id}>
                                                    {ingredient.name} - {previewAmount.value}{' '}
                                                    {previewAmount.unit}
                                                </li>
                                            );
                                        })}
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
