import { Link } from '@inertiajs/react';
import {
    ClipboardList,
    LayoutDashboard,
    LogOut,
    Settings,
    ShoppingBag,
} from 'lucide-react';

function resolveMenuItems() {
    const canUseRoute = typeof route === 'function';
    const hasRoute = (name) => canUseRoute && route().has(name);

    const items = [];

    if (hasRoute('dashboard')) {
        items.push({
            label: 'Dashboard',
            href: route('dashboard'),
            active: route().current('dashboard'),
            icon: LayoutDashboard,
        });
    }

    if (hasRoute('orders.index')) {
        items.push({
            label: 'Commandes',
            href: route('orders.index'),
            active: route().current('orders.*'),
            icon: ClipboardList,
        });
    }

    if (hasRoute('products.index')) {
        items.push({
            label: 'Produits',
            href: route('products.index'),
            active: route().current('products.*'),
            icon: ShoppingBag,
        });
    }

    if (hasRoute('profile.edit')) {
        items.push({
            label: 'Parametres',
            href: route('profile.edit'),
            active: route().current('profile.*'),
            icon: Settings,
        });
    }

    return items;
}

export default function Sidebar() {
    const menuItems = resolveMenuItems();

    return (
        <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-slate-200/70 bg-white">
            <div className="px-6 py-7">
                <Link href="/" className="inline-flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF7E47] text-sm font-semibold text-white">
                        CH
                    </span>
                    <div className="leading-tight">
                        <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-400">
                            Chefflow
                        </p>
                        <p className="text-base font-semibold text-slate-800">
                            Restaurant OS
                        </p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 space-y-2 px-4 py-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                                item.active
                                    ? 'bg-[#FF7E47] text-white'
                                    : 'text-slate-600 hover:bg-orange-50 hover:text-[#FF7E47]'
                            }`}
                        >
                            <Icon size={18} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4">
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="flex w-full items-center gap-3 rounded-xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition-colors hover:border-[#FF7E47] hover:text-[#FF7E47]"
                >
                    <LogOut size={18} />
                    <span>Logout</span>
                </Link>
            </div>
        </aside>
    );
}
