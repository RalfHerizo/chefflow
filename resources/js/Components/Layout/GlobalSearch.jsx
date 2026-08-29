import { Link } from '@inertiajs/react';
import { CookingPot, Loader2, ReceiptText, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const EMPTY = { products: [], ingredients: [], orders: [] };

function formatPrice(cents) {
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(Number(cents || 0) / 100);
}

/**
 * Header typeahead: searches products / ingredients / orders (tenant-scoped)
 * via the JSON `search` route and shows grouped results in a dropdown.
 * Each result links to its resource list pre-filtered by the term.
 */
export default function GlobalSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(EMPTY);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);
    const debounceRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const runSearch = (value) => {
        const term = value.trim();

        if (term.length < 2) {
            setResults(EMPTY);
            setLoading(false);
            setOpen(false);
            return;
        }

        setLoading(true);
        setOpen(true);
        window.axios
            .get(route('search'), { params: { q: term } })
            .then(({ data }) => setResults(data))
            .catch(() => setResults(EMPTY))
            .finally(() => setLoading(false));
    };

    const handleChange = (event) => {
        const value = event.target.value;
        setQuery(value);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => runSearch(value), 200);
    };

    const term = query.trim();
    const groups = [
        {
            key: 'products',
            label: 'Produits',
            icon: ShoppingBag,
            items: results.products,
            href: (item) => route('products.index', { search: item.name }),
            primary: (item) => item.name,
            secondary: (item) => item.category || 'Produit',
        },
        {
            key: 'ingredients',
            label: 'Ingrédients',
            icon: CookingPot,
            items: results.ingredients,
            href: (item) => route('ingredients.index', { search: item.name }),
            primary: (item) => item.name,
            secondary: (item) => (item.unit ? `Unité : ${item.unit}` : 'Ingrédient'),
        },
        {
            key: 'orders',
            label: 'Commandes',
            icon: ReceiptText,
            items: results.orders,
            href: (item) => route('orders.index', { search: String(item.id) }),
            primary: (item) => `Commande #${item.id}`,
            secondary: (item) => formatPrice(item.total_price),
        },
    ];

    const hasResults = groups.some((group) => group.items.length > 0);

    return (
        <div ref={containerRef} className="relative w-full max-w-xl">
            <Search
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
                type="search"
                value={query}
                onChange={handleChange}
                onFocus={() => {
                    if (term.length >= 2) {
                        setOpen(true);
                    }
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        setOpen(false);
                        event.currentTarget.blur();
                    }
                }}
                placeholder="Rechercher un produit, un ingrédient, une commande..."
                className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-10 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#FF7E47]"
            />
            {loading ? (
                <Loader2 className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-slate-400" />
            ) : null}

            {open ? (
                <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
                    {loading ? (
                        <div className="px-4 py-6 text-center text-sm text-slate-400">
                            Recherche…
                        </div>
                    ) : !hasResults ? (
                        <div className="px-4 py-6 text-center text-sm text-slate-400">
                            Aucun résultat pour «&nbsp;{term}&nbsp;».
                        </div>
                    ) : (
                        <div className="max-h-96 overflow-y-auto py-2">
                            {groups
                                .filter((group) => group.items.length > 0)
                                .map((group) => {
                                    const Icon = group.icon;
                                    return (
                                        <div key={group.key} className="px-2">
                                            <p className="px-3 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                {group.label}
                                            </p>
                                            {group.items.map((item) => (
                                                <Link
                                                    key={`${group.key}-${item.id}`}
                                                    href={group.href(item)}
                                                    onClick={() => setOpen(false)}
                                                    className="flex items-center gap-3 rounded-xl px-3 py-2 transition-colors hover:bg-orange-50"
                                                >
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                                                        <Icon className="h-4 w-4" />
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="block truncate text-sm font-medium text-slate-700">
                                                            {group.primary(item)}
                                                        </span>
                                                        <span className="block truncate text-xs text-slate-400">
                                                            {group.secondary(item)}
                                                        </span>
                                                    </span>
                                                </Link>
                                            ))}
                                        </div>
                                    );
                                })}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
}
