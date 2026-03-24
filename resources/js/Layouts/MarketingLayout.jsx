import { Link } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Github, Menu, X, ArrowRight } from 'lucide-react';

export default function MarketingLayout({ children }) {
    const [scrolled, setScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            setScrolled(window.scrollY > 8);
        };

        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const navLinks = [
        { href: "#about", label: "À propos" },
        { href: "#features", label: "Fonctionnalités" },
        { href: "#roadmap", label: "Roadmap" },
    ];

    return (
        <div className="min-h-screen bg-[#F8F4F1] text-slate-900">
            <header
                className={`fixed inset-x-0 top-0 z-[100] transition-all duration-300 ${
                    scrolled || isMenuOpen
                        ? 'bg-white/90 shadow-sm backdrop-blur-md'
                        : 'bg-transparent'
                }`}
            >
                <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
                    {/* LOGO */}
                    <Link href="/" className="z-50 flex items-center gap-2">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1a17] text-sm font-bold text-white shadow-lg shadow-black/10 transition-transform hover:scale-105">
                            CH
                        </span>
                        <div className="leading-tight">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7E47]">
                                Chefflow
                            </p>
                            <p className="text-sm font-bold text-slate-900">
                                Restaurant OS
                            </p>
                        </div>
                    </Link>

                    {/* NAVIGATION DESKTOP */}
                    <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 lg:flex">
                        {navLinks.map((link) => (
                            <a 
                                key={link.href}
                                href={link.href} 
                                className="transition-colors hover:text-[#FF7E47]"
                            >
                                {link.label}
                            </a>
                        ))}
                    </nav>

                    {/* ACTIONS DESKTOP */}
                    <div className="hidden items-center gap-4 lg:flex">
                        <a
                            href="https://github.com/RalfHerizo/chefflow"
                            target="_blank"
                            className="rounded-xl p-2.5 text-slate-400 transition-all hover:bg-orange-50 hover:text-[#FF7E47]"
                        >
                            <Github className="h-5 w-5" />
                        </a>
                        <Link
                            href={route('login')}
                            className="text-sm font-bold text-slate-600 hover:text-slate-900"
                        >
                            Se connecter
                        </Link>
                        <Link
                            href={route('register')}
                            className="rounded-xl bg-[#FF7E47] px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-[#e86f3d] hover:shadow-orange-300"
                        >
                            Essai gratuit
                        </Link>
                    </div>

                    {/* BOUTON MENU MOBILE */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-900 shadow-sm lg:hidden"
                    >
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                    </button>
                </div>

                {/* OVERLAY MENU MOBILE */}
                <div className={`fixed h-full  inset-0 z-[100] flex flex-col bg-[#F8F4F1] transition-all duration-500 lg:hidden ${
                    isMenuOpen 
                        ? 'opacity-100 translate-y-0 visible' 
                        : 'opacity-0 -translate-y-10 invisible'
                }`}>
                    {/* Header interne pour garder le logo et la croix alignés dans l'overlay */}
                    <div className="flex items-center justify-between pt-8 px-8">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#1f1a17] text-sm font-bold text-white">
                                CH
                            </span>
                            <div className="leading-tight">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF7E47]">Chefflow</p>
                                <p className="text-sm font-bold text-slate-900">Restaurant OS</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMenuOpen(false)}
                            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-slate-900 shadow-sm"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-8 bg-[#F8F4F1] p-8">
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</p>
                        <nav className="flex flex-col gap-2 ">
                            {navLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setIsMenuOpen(false)}
                                    className="text-lg font-bold tracking-tight text-slate-900 active:text-[#FF7E47]"
                                >
                                    {link.label}
                                </a>
                            ))}
                        </nav>

                        <div className="h-px w-full bg-slate-200/50" />

                        <div className="flex flex-col gap-4">
                            <Link
                                href={route('login')}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-4 font-bold text-slate-900 shadow-sm"
                            >
                                Se connecter
                            </Link>
                            <Link
                                href={route('register')}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF7E47] py-4 font-bold text-white shadow-lg shadow-orange-200"
                            >
                                Commencer gratuitement
                                <ArrowRight className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="pt-20">{children}</main>
        </div>
    );
}