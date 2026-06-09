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
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

/**
 * @param {{ orders: { data: Array<object>, links: Array<{url: string|null, label: string, active: boolean}> }, filters?: { sort?: string, direction?: string } }} props
 */
export default function OrdersIndex({ orders, filters }) {
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [sort, setSort] = useState(filters?.sort ?? 'recent');
    const [direction, setDirection] = useState(filters?.direction ?? 'desc');

    const reload = (overrides = {}) => {
        const next = { sort, direction, ...overrides };
        router.get(
            route('orders.index'),
            {
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
                    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800">
                                Historique des commandes
                            </h3>
                            <p className="text-sm text-slate-500">
                                Toutes les ventes enregistrées.
                            </p>
                        </div>

                        <div className="flex items-center gap-2">
                            <Select value={sort} onValueChange={handleSort}>
                                <SelectTrigger className="h-10 w-full rounded-xl sm:w-[180px]">
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
