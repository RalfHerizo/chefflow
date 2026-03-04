import { Search } from 'lucide-react';

export default function TopHeader({ user }) {
    return (
        <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-[#F8F4F1]/95 px-8 py-4 backdrop-blur-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="relative w-full max-w-xl">
                    <Search
                        size={18}
                        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                        type="search"
                        placeholder="Rechercher un produit, une commande, un client..."
                        className="h-11 w-full rounded-full border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-700 outline-none transition-colors placeholder:text-slate-400 focus:border-[#FF7E47]"
                    />
                </div>

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
        </header>
    );
}
