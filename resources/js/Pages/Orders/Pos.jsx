import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { ScrollArea } from '@/Components/ui/scroll-area';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Minus, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const PRODUCT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="140"><rect width="100%" height="100%" fill="%23E2E8F0"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%2394A3B8" font-family="Arial" font-size="12">IMG</text></svg>';

/**
 * @param {{ products: Array<{id: number|string, name: string, price: number, image_url?: string|null, category?: string|null, is_active: boolean}> }} props
 */
export default function OrdersPos({ products }) {
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [cart, setCart] = useState([]);
    const { post, processing, setData } = useForm({ items: [] });

    const categories = useMemo(() => {
        const values = products
            .map((product) => product.category)
            .filter(Boolean);
        return ['all', ...Array.from(new Set(values))];
    }, [products]);

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();

        return products.filter((product) => {
            if (selectedCategory !== 'all' && product.category !== selectedCategory) {
                return false;
            }

            if (!query) {
                return true;
            }

            return product.name.toLowerCase().includes(query);
        });
    }, [products, search, selectedCategory]);

    const addToCart = (product) => {
        if (!product.is_active) {
            toast.error('Produit indisponible');
            return;
        }

        setCart((prev) => {
            const existing = prev.find((item) => item.id === product.id);
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
                );
            }

            return [...prev, { ...product, qty: 1 }];
        });

        toast.success(`${product.name} ajouté`);
    };

    const incrementQty = (productId) => {
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId ? { ...item, qty: item.qty + 1 } : item,
            ),
        );
    };

    const decrementQty = (productId) => {
        setCart((prev) =>
            prev
                .map((item) =>
                    item.id === productId ? { ...item, qty: item.qty - 1 } : item,
                )
                .filter((item) => item.qty > 0),
        );
    };

    const totals = useMemo(() => {
        const totalHtCents = cart.reduce(
            (sum, item) => sum + Number(item.price || 0) * item.qty,
            0,
        );
        const vatRate = 0.2;
        const totalTtcCents = Math.round(totalHtCents * (1 + vatRate));

        return { totalHtCents, totalTtcCents, vatRate };
    }, [cart]);

    const formatPrice = (cents) =>
        new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR',
        }).format(Number(cents || 0) / 100);

    const submitOrder = () => {
        const items = cart.map((item) => ({ id: item.id, qty: item.qty }));
        setData('items', items);

        post(route('products.sell'), {
            onSuccess: () => {
                toast.success('Commande validée');
                setCart([]);
            },
            onError: (formErrors) => {
                toast.error(formErrors.error || 'Stock insuffisant');
            },
        });
    };

    const hasItems = cart.length > 0;

    return (
        <AuthenticatedLayout>
            <Head title="Caisse" />

            <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
                <section className="flex-1 space-y-4">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <h2 className="text-xl font-semibold text-slate-800">Menu produits</h2>
                        <p className="text-sm text-slate-500">
                            Selectionne des produits pour composer le panier.
                        </p>

                        <div className="mt-4 grid grid-cols-7 items-center gap-3">
                            <div className=" col-span-6 flex lg:w-full items-center bg-white text-sm  sm:w-64 relative">
                                <Search className="h-4 w-4 text-slate-400 translate-x-3 absolute" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Rechercher..."
                                    className="w-full bg-transparent text-slate-700 outline-none placeholder:text-slate-400 rounded-xl pl-9 px-3 py-2 border border-slate-200 shadow-sm focus:shadow-none focus:border-0 focus:outline-[#FF7E47]"
                                />
                            </div>

                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 shadow-sm"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? 'Toutes' : category}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => addToCart(product)}
                                disabled={!product.is_active}
                                className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#FF7E47]/60 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <div className="relative h-36 w-full overflow-hidden rounded-xl bg-slate-100">
                                    <img
                                        src={product.image_url || PRODUCT_PLACEHOLDER}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <Badge
                                        className={`absolute left-3 top-3 ${
                                            product.is_active
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : 'bg-slate-200 text-slate-500'
                                        }`}
                                    >
                                        {product.is_active ? 'Disponible' : 'Indisponible'}
                                    </Badge>
                                </div>
                                <div className="mt-3 flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800">
                                            {product.name}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {product.category || 'Sans categorie'}
                                        </p>
                                    </div>
                                    <span className="text-sm font-semibold text-slate-800">
                                        {formatPrice(product.price)}
                                    </span>
                                </div>
                            </button>
                        ))}
                    </div>
                </section>

                <aside className="w-full max-w-xl space-y-4 lg:w-[380px]">
                    <div className="rounded-2xl border border-slate-200/70 bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold text-slate-800">Panier</h3>
                                <p className="text-sm text-slate-500">
                                    Resume des produits selectionnes.
                                </p>
                            </div>
                            {hasItems ? (
                                <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-[#FF7E47]">
                                    {cart.length} article(s)
                                </span>
                            ) : null}
                        </div>

                        <ScrollArea className="mt-4 h-64">
                            {cart.length === 0 ? (
                                <div className="flex h-full items-center justify-center text-sm text-slate-400">
                                    Aucun produit dans le panier.
                                </div>
                            ) : (
                                <div className="space-y-3 pr-2">
                                    {cart.map((item) => (
                                        <div
                                            key={item.id}
                                            className="flex items-center justify-between rounded-xl border border-slate-200 p-3"
                                        >
                                            <div>
                                                <p className="text-sm font-semibold text-slate-700">
                                                    {item.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {formatPrice(item.price)}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => decrementQty(item.id)}
                                                >
                                                    <Minus />
                                                </Button>
                                                <span className="min-w-[24px] text-center text-sm font-semibold text-slate-700">
                                                    {item.qty}
                                                </span>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="icon"
                                                    onClick={() => incrementQty(item.id)}
                                                >
                                                    <Plus />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>

                        <div className="mt-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
                            <div className="flex items-center justify-between text-slate-600">
                                <span>Total HT</span>
                                <span className="font-semibold text-slate-800">
                                    {formatPrice(totals.totalHtCents)}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-slate-600">
                                <span>TVA ({Math.round(totals.vatRate * 100)}%)</span>
                                <span className="font-semibold text-slate-800">
                                    {formatPrice(
                                        totals.totalTtcCents - totals.totalHtCents,
                                    )}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-base font-semibold text-slate-800">
                                <span>Total TTC</span>
                                <span>{formatPrice(totals.totalTtcCents)}</span>
                            </div>
                        </div>

                        <Button
                            type="button"
                            disabled={!hasItems || processing}
                            onClick={submitOrder}
                            className="mt-4 h-12 w-full rounded-xl bg-[#FF7E47] text-white hover:bg-[#e86f3d]"
                        >
                            {processing ? 'Validation...' : 'Valider la commande'}
                        </Button>
                    </div>
                </aside>
            </div>
        </AuthenticatedLayout>
    );
}
