import RecentOrdersTable from '@/Components/Dashboard/RecentOrdersTable';
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
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Search } from 'lucide-react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';

/**
 * @param {{ orders: { data: Array<object>, links: Array<{url: string|null, label: string, active: boolean}> }, filters?: { search?: string, period?: string, sort?: string, direction?: string } }} props
 */
export default function OrdersIndex({ orders, filters }) {
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [search, setSearch] = useState(filters?.search ?? '');
    const [period, setPeriod] = useState(filters?.period ?? 'all');
    const [sort, setSort] = useState(filters?.sort ?? 'recent');
    const [direction, setDirection] = useState(filters?.direction ?? 'desc');
    const searchTimeout = useRef();

    const reload = (overrides = {}, { debounce = false } = {}) => {
        const next = { search, period, sort, direction, ...overrides };
        const visit = () =>
            router.get(
                route('orders.index'),
                {
                    search: next.search || undefined,
                    period:
                        next.period && next.period !== 'all' ? next.period : undefined,
                    sort: next.sort !== 'recent' ? next.sort : undefined,
                    direction: next.direction !== 'desc' ? next.direction : undefined,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                    replace: true,
                    only: ['orders', 'filters'],
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

    const handlePeriod = (value) => {
        setPeriod(value);
        reload({ period: value });
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

    const confirmCancel = () => {
        if (!orderToCancel) {
            return;
        }

        router.delete(route('orders.destroy', orderToCancel), {
            preserveScroll: true,
            onSuccess: () => toast.success('Commande annulée'),
            onFinish: () => setOrderToCancel(null),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Commandes" />

            <div className="mx-auto max-w-7xl space-y-6">
                <section className="rounded-2xl border border-slate-200/70 bg-white p-6 shadow-sm">
                    <div className="mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                            Historique des commandes
                        </h3>
                        <p className="text-sm text-slate-500">
                            Toutes les commandes enregistrées.
                        </p>
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="relative flex-1">
                            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                            <input
                                type="search"
                                value={search}
                                onChange={(e) => handleSearch(e.target.value)}
                                placeholder="Rechercher (n° ou produit)..."
                                className="h-10 w-full rounded-xl border border-slate-200 pl-9 pr-3 text-sm outline-none focus:border-[#FF7E47]"
                            />
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <Select value={period} onValueChange={handlePeriod}>
                                <SelectTrigger className="h-10 w-full rounded-xl sm:w-[150px]">
                                    <SelectValue placeholder="Période" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Toutes dates</SelectItem>
                                    <SelectItem value="today">Aujourd'hui</SelectItem>
                                    <SelectItem value="7d">7 derniers jours</SelectItem>
                                    <SelectItem value="30d">30 derniers jours</SelectItem>
                                </SelectContent>
                            </Select>
                            <Select value={sort} onValueChange={handleSort}>
                                <SelectTrigger className="h-10 w-full rounded-xl sm:w-[150px]">
                                    <SelectValue placeholder="Trier par" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="recent">Plus récent</SelectItem>
                                    <SelectItem value="total">Total</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={toggleDirection}
                                title={direction === 'asc' ? 'Croissant' : 'Décroissant'}
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

                    <RecentOrdersTable
                        orders={orders.data}
                        onCancelOrder={setOrderToCancel}
                    />

                    <Pagination
                        links={orders.links}
                        className="mt-4 border-t border-slate-100 pt-4"
                    />
                </section>
            </div>

            <ConfirmationDialog
                open={Boolean(orderToCancel)}
                onOpenChange={(open) => {
                    if (!open) {
                        setOrderToCancel(null);
                    }
                }}
                title="Annuler cette commande ?"
                description="Le stock associé sera restauré automatiquement."
                confirmLabel="Annuler la commande"
                destructive
                onConfirm={confirmCancel}
            />
        </AuthenticatedLayout>
    );
}
