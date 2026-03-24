import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#F8F4F1]">
            {/* CÔTÉ GAUCHE : Formulaire (100% mobile, 50% desktop) */}
            <div className="flex w-full flex-col justify-center px-6 py-12 lg:w-[60%] lg:px-12 xl:px-24">
                <div className="mx-auto w-full max-w-md">
                    <Link href="/" className="mb-10 flex items-center gap-3 group w-fit">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1a17] text-sm font-bold text-white transition-transform group-hover:scale-105">
                            CH
                        </span>
                        <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900">
                            ChefFlow
                        </span>
                    </Link>

                    <div className="relative">
                        {children}
                    </div>
                    
                    <p className="mt-12 text-xs font-medium text-slate-400 text-center">
                        © {new Date().getFullYear()} ChefFlow — Le système d'exploitation des restaurateurs.
                    </p>
                </div>
            </div>

            {/* CÔTÉ DROIT : Visuel Immersif (Masqué sur mobile) */}
            <div className="relative hidden w-[40%] lg:block">
                {/* Image d'ambiance (On utilise un placeholder pro, tu pourras changer l'URL) */}
                <div className="absolute inset-0 h-full w-full">
                    <img 
                        src="https://img.freepik.com/photos-premium/cours-cuisine-amis_1249787-40592.jpg?ga=GA1.1.1249139299.1762579352&semt=ais_hybrid&w=740&q=80" 
                        alt="Restaurant ambiance" 
                        className="h-full w-full object-cover"
                    />
                    {/* Overlay pour donner du cachet et de la profondeur */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#1f1a17]/40 via-transparent to-[#FF7E47]/20" />
                </div>

                 
            </div>
        </div>
    );
}