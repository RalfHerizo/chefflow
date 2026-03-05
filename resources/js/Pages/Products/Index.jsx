import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { Head, Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';

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
 * @param {{ products: Array<{id: number|string, name: string, category?: string|null, image_url?: string|null, price: number|string, is_active: boolean, ingredients_count: number}> }} props
 */
export default function ProductsIndex({ products }) {
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
                                Consulte les produits et leur recette associee.
                            </p>
                        </div>

                        <Button asChild className="rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]">
                            <Link href={route('products.create')}>
                                <Plus />
                                Creer un nouveau produit
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
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {products.length === 0 ? (
                                    <TableRow>
                                        <TableCell
                                            colSpan={5}
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
                                                <Badge
                                                    className={
                                                        product.is_active
                                                            ? 'border-transparent bg-emerald-100 text-emerald-700'
                                                            : 'border-transparent bg-slate-200 text-slate-700'
                                                    }
                                                >
                                                    {product.is_active ? 'Actif' : 'Inactif'}
                                                </Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}
