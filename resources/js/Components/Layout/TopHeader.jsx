import { ShoppingCart } from 'lucide-react';
import { Link, usePage } from '@inertiajs/react';
import { useCart } from '@/Contexts/CartContext';
import GlobalSearch from '@/Components/Layout/GlobalSearch';
import { useEffect, useRef, useState } from 'react';

const PAGE_CONTENT = {
    Dashboard: {
        title: 'Tableau de bord',
        subtitle: 'Pilotez votre activité en temps réel.',
    },
    'Analytics/Index': {
        title: 'Analytics',
        subtitle: 'Vos performances de vente d’un coup d’œil.',
    },
    'Profile/Edit': {
        title: 'Profil',
        subtitle: 'Gérez vos informations et vos paramètres de sécurité.',
    },
    'Ingredients/Index': {
        title: 'Ingrédients',
        subtitle: 'Suivez les stocks et les seuils d’alerte.',
    },
    'Products/Index': {
        title: 'Produits',
        subtitle: 'Consultez tous les produits et leurs recettes.',
    },
    'Products/Create': {
        title: 'Nouveau Produit',
        subtitle: 'Construisez le produit et sa recette ingredient par ingredient.',
    },
    'Products/Edit': {
        title: 'Modifier Produit',
        subtitle: 'Mettez a jour les informations et la recette du produit.',
    },
    'Orders/Index': {
        title: 'Commandes',
        subtitle: 'Consultez l’historique de toutes les commandes.',
    },
    'Orders/Pos': {
        title: 'Caisse',
        subtitle: 'Prenez une commande rapidement et suivez le panier en temps réel.',
    },
};

function resolveHeaderContent(component, userName) {
    const content = PAGE_CONTENT[component];

    if (content) {
        return content;
    }

    return {
        title: component?.split('/').slice(-1)[0] || 'ChefFlow',
        subtitle: `Bonjour ${userName || 'Utilisateur'}, ravi de vous revoir !`,
    };
}

function TopHeader({ user }) {
    const { component } = usePage();
    const headerContent = resolveHeaderContent(component, user?.name);
    const { cart } = useCart();
    const totalItems = cart.reduce(
        (sum, item) => sum + Number(item.quantity || 0),
        0,
    );
    const previousTotal = useRef(totalItems);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        let timer;
        if (totalItems > previousTotal.current) {
            setPulse(true);
            timer = setTimeout(() => setPulse(false), 400);
        }

        previousTotal.current = totalItems;

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [totalItems]);

    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#F8F4F1] px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold leading-tight text-slate-800">
                        {headerContent.title}
                    </h2>
                    <p className="text-sm text-slate-500">{headerContent.subtitle}</p>
                </div>
                <GlobalSearch />

                <div className="flex items-center gap-4">
                    <Link
                        href={route('orders.pos')}
                        className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow-sm transition-transform duration-200 hover:bg-orange-50 active:scale-95 cursor-pointer"
                    >
                        {pulse && totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-[#FF7E47]/40 animate-ping" />
                        )}
                        {totalItems > 0 && (
                            <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#FF7E47] px-1 text-[10px] font-semibold text-white shadow-sm">
                                {totalItems}
                            </span>
                        )}
                        <ShoppingCart className="h-5 w-5 text-slate-500" />
                    </Link>
                    <div className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-sm">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-sm font-semibold text-[#FF7E47]">
                            {user?.name?.slice(0, 2).toUpperCase() ?? 'US'}
                        </div>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-800">
                                {user?.name ?? 'Utilisateur'}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                                {user?.email ?? 'user@email.com'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default TopHeader;
