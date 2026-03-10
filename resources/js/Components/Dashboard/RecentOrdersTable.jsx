import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Skeleton } from '@/Components/ui/skeleton';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/Components/ui/table';
import { RotateCcw } from 'lucide-react';

const PRODUCT_PLACEHOLDER =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="100%" height="100%" fill="%23F3F4F6"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="%239CA3AF" font-family="Arial" font-size="12">IMG</text></svg>';

function formatPrice(totalPrice) {
    const value = Number(totalPrice || 0) / 100;
    return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'EUR',
    }).format(value);
}

function getOrderStatus(order) {
    if (
        order?.is_cancelled ||
        order?.cancelled_at ||
        order?.status === 'cancelled' ||
        order?.status === 'annule'
    ) {
        return 'Annule';
    }

    return 'Termine';
}

/**
 * @param {{ orders?: Array<{
 * id: number|string,
 * total_price: number|string,
 * status?: string,
 * is_cancelled?: boolean,
 * cancelled_at?: string|null,
 * items?: Array<{
 *   quantity: number,
 *   product?: { name?: string, image_url?: string|null }
 * }>
 * }>, onCancelOrder?: (orderId: number|string) => void }} props
 */
export default function RecentOrdersTable({ orders, onCancelOrder }) {
    if (!orders) {
        return (
            <div className="space-y-3 rounded-2xl border border-slate-200/70 bg-white p-4">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <Skeleton key={idx} className="h-12 w-full" />
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                Aucune commande recente.
            </div>
        );
    }

    return (
        <div className="rounded-2xl border border-slate-200/70 bg-white p-2">
            <Table>
                
                <TableHeader>
                    <TableRow className="border-slate-200/80 hover:bg-transparent">
                        <TableHead className="px-4">Order ID</TableHead>
                        <TableHead className="px-4">Produit</TableHead>
                        <TableHead className="px-4">Quantite</TableHead>
                        <TableHead className="px-4">Total Price</TableHead>
                        <TableHead className="px-4">Status</TableHead>
                        <TableHead className="px-4 text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const status = getOrderStatus(order);
                        const isCancelled = status === 'Annule';
                        const firstItem = order.items?.[0];
                        const productName = firstItem?.product?.name || 'Panier';
                        const productImage = firstItem?.product?.image_url || PRODUCT_PLACEHOLDER;
                        const totalQuantity = (order.items || []).reduce(
                            (sum, item) => sum + Number(item.quantity || 0),
                            0,
                        );
                        const extraCount = Math.max((order.items?.length || 0) - 1, 0);
                        return (
                            <TableRow key={order.id} className="border-slate-100">
                                <TableCell className="px-4 font-semibold text-slate-700">
                                    #{order.id}
                                </TableCell>
                                <TableCell className="px-4">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src={productImage}
                                            alt={productName}
                                            className="h-9 w-9 rounded-md object-cover"
                                        />
                                        <span className="font-medium text-slate-700">
                                            {productName}
                                            {extraCount > 0 ? ` +${extraCount}` : ''}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="px-4 text-slate-600">
                                    x{totalQuantity}
                                </TableCell>
                                <TableCell className="px-4 text-slate-600">
                                    {formatPrice(order.total_price)}
                                </TableCell>
                                <TableCell className="px-4">
                                    <Badge
                                        className={
                                            isCancelled
                                                ? 'border-transparent bg-red-100 text-red-700'
                                                : 'border-transparent bg-emerald-100 text-emerald-700'
                                        }
                                    >
                                        {status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="px-4 text-right">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={isCancelled}
                                        onClick={() => onCancelOrder?.(order.id)}
                                        className="border-slate-200 text-slate-600 hover:border-[#FF7E47] hover:text-[#FF7E47]"
                                    >
                                        <RotateCcw />
                                        Annuler
                                    </Button>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
