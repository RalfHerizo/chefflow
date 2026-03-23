import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    CheckCircle2,
    LineChart,
    Pizza,
    Receipt,
    ShieldCheck,
    ShoppingBag,
    Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import MarketingLayout from '@/Layouts/MarketingLayout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const mockScreens = [
    {
        id: 'pos',
        title: 'POS ChefFlow',
    },
    {
        id: 'gallery',
        title: 'Galerie Produits',
    },
    {
        id: 'stock',
        title: 'Alertes Stock',
    },
];

const features = [
    {
        title: 'Caisse POS Visuelle',
        description:
            'Des visuels clairs, un panier toujours visible, et une prise de commande ultra rapide.',
        icon: ShoppingBag,
    },
    {
        title: 'Gestion des Stocks Predictive',
        description:
            'Alertes de seuil, fiches ingredients et deduction automatique par recette.',
        icon: ShieldCheck,
    },
    {
        title: 'Tableau de bord Analytique',
        description:
            'Suivez la marge, les ventes live et les produits stars sans effort.',
        icon: LineChart,
    },
];

const faqs = [
    {
        q: 'Combien de temps pour installer ChefFlow ?',
        a: 'Moins d une heure. Vous pouvez importer vos produits et commencer a vendre.',
    },
    {
        q: 'ChefFlow fonctionne-t-il pour les pizzerias ?',
        a: 'Oui. Le mode recette est ideal pour les pates, garnitures et variantes.',
    },
    {
        q: 'Support disponible ?',
        a: 'Support humain via chat et email, avec un suivi rapide des demandes.',
    },
];

function BrowserMockup() {
    return (
        <div className="relative overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="h-2.5 w-2.5 rounded-full bg-slate-200" />
                <span className="ml-3 text-xs text-slate-400">chefflow.app</span>
            </div>
            <div className="bg-slate-50 p-4">
                <img
                    src="https://i.ibb.co/d4D7rBqD/caisse-chefflow.jpg"
                    alt="Interface POS ChefFlow"
                    className="w-full rounded-2xl border border-slate-200 object-cover shadow-xl"
                />
            </div>
        </div>
    );
}

function FeatureCard({ icon: Icon, title, description }) {
    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF7E47]/10 text-[#FF7E47]">
                <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-slate-800">{title}</h3>
            <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>
    );
}

function FadeInSection({ children, delay = 0 }) {
    return (
        <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    );
}

export default function Welcome() {
    const [activeTab, setActiveTab] = useState('cuisine');

    const tabContent = useMemo(
        () =>
            activeTab === 'cuisine'
                ? {
                      title: 'Cote Cuisine',
                      text: 'Centralisez vos fiches techniques, allergènes et couts de revient.',
                      icon: Utensils,
                  }
                : {
                      title: 'Cote Comptoir',
                      text: 'Prise de commande fluide, tickets clairs, et encaissement rapide.',
                      icon: Receipt,
                  },
        [activeTab],
    );

    return (
        <MarketingLayout>
            <Head>
                <title>ChefFlow - POS restaurant</title>
                <meta
                    name="description"
                    content="Logiciel de caisse pour pizzeria et restauration. Ventes, stocks et recettes en un seul endroit."
                />
            </Head>

            <section className="relative overflow-hidden px-6 pb-20 pt-20 md:pt-28">
                <div className="mx-auto   max-w-7xl items-center gap-12 ">
                    <FadeInSection>
                        <div className="flex justify-center">
                            <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200 bg-orange-100 px-4 py-2 text-xs font-semibold  text-slate-500 shadow-sm">
                                <span className="relative flex h-2.5 w-2.5">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF7E47]/40" />
                                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF7E47]" />
                                </span>
                                Maintenant disponible en accès libre
                            </div>
                        </div>
                        <div>
                            <h1 className="mt-10 text-4xl font-extrabold leading-tight text-slate-900 md:text-5xl text-center">
                                Gérez votre restaurant <span className='text-[#FF7E47]' >comme un pro !</span>
                            </h1>
                            <p className="mt-4 text-base text-slate-600 md:text-lg text-center">
                                ChefFlow centralise vos ventes, vos stocks et vos recettes en un seul endroit. Simple, rapide, fait pour les restaurateurs.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                            <Link
                                href={route('register')}
                                className="group inline-flex items-center gap-2 rounded-lg bg-[#FF7E47] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e86f3d] text-center"
                            >
                                Créer mon compte gratuitement
                                <span className="  items-center opacity-0 hidden translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:inline-flex">
                                    <ArrowRight className="h-4 w-4" />
                                </span>
                            </Link>
                            <Link
                                href={route('login')}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-orange-300 hover:bg-orange-50"
                            >
                                Se connecter
                                
                            </Link>
                        </div> 
                        <div className="my-8 flex items-center  gap-6 text-sm text-slate-500">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#FF7E47]" />
                                Sans engagement
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-[#FF7E47]" />
                                Zéro installation
                            </div>
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={0.1}>
                        <BrowserMockup />
                    </FadeInSection>
                </div>

                <div className="pointer-events-none absolute -right-24 top-10 hidden h-64 w-64 rounded-full bg-[#FF7E47]/10 blur-3xl lg:block" />
            </section>

            <section className="px-6 pb-16">
                <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white px-6 py-4 text-center text-sm text-slate-500 shadow-sm">
                    Déja adopte par +500 restaurateurs et pizzerias.
                </div>
            </section>

            <section id="features" className="px-6 pb-20">
                <div className="mx-auto max-w-7xl">
                    <FadeInSection>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold text-[#FF7E47]">
                                    Les 3 forces ChefFlow
                                </p>
                                <h2 className="mt-2 text-3xl font-semibold text-slate-900">
                                    Tout votre restaurant dans un seul cockpit
                                </h2>
                            </div>
                            <Pizza className="hidden h-10 w-10 text-slate-300 md:block" />
                        </div>
                    </FadeInSection>
                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <FadeInSection key={feature.title} delay={idx * 0.1}>
                                <FeatureCard {...feature} />
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <section id="experience" className="px-6 pb-20">
                <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                    <FadeInSection>
                        <div className="flex flex-wrap items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-semibold text-[#FF7E47]">
                                    Backstage vs Spotlight
                                </p>
                                <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                                    Une experience fluide pour chaque equipe
                                </h2>
                            </div>
                            <div className="flex rounded-full bg-slate-100 p-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('cuisine')}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activeTab === 'cuisine'
                                            ? 'bg-white text-slate-900 shadow'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    Cuisine
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('comptoir')}
                                    className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                                        activeTab === 'comptoir'
                                            ? 'bg-white text-slate-900 shadow'
                                            : 'text-slate-500'
                                    }`}
                                >
                                    Comptoir
                                </button>
                            </div>
                        </div>
                    </FadeInSection>

                    <FadeInSection delay={0.1}>
                        <div className="mt-8 grid gap-6 lg:grid-cols-[0.6fr_0.4fr]">
                            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                                    {tabContent.title}
                                </p>
                                <h3 className="mt-3 text-lg font-semibold text-slate-900">
                                    {tabContent.text}
                                </h3>
                                <div className="mt-6 flex items-center gap-3 text-sm text-slate-500">
                                    <tabContent.icon className="h-5 w-5 text-[#FF7E47]" />
                                    Planning recette et cout en temps reel.
                                </div>
                            </div>
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between text-sm text-slate-500">
                                    <span>Tickets</span>
                                    <span className="rounded-full bg-[#FF7E47]/10 px-2 py-0.5 text-xs text-[#FF7E47]">
                                        Live
                                    </span>
                                </div>
                                <div className="mt-4 space-y-2">
                                    <div className="h-3 w-full rounded-full bg-slate-100" />
                                    <div className="h-3 w-5/6 rounded-full bg-slate-100" />
                                    <div className="h-3 w-2/3 rounded-full bg-slate-100" />
                                </div>
                                <p className="mt-6 text-xs text-slate-500">
                                    Temps moyen par commande : 45s
                                </p>
                            </div>
                        </div>
                    </FadeInSection>
                </div>
            </section>

            <section id="faq" className="px-6 pb-20">
                <div className="mx-auto max-w-6xl">
                    <FadeInSection>
                        <h2 className="text-3xl font-semibold text-slate-900">
                            Questions fréquentes
                        </h2>
                    </FadeInSection>
                    <div className="mt-8 grid gap-6 md:grid-cols-3">
                        {faqs.map((item, idx) => (
                            <FadeInSection key={item.q} delay={idx * 0.05}>
                                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                    <h3 className="text-base font-semibold text-slate-900">
                                        {item.q}
                                    </h3>
                                    <p className="mt-3 text-sm text-slate-500">{item.a}</p>
                                </div>
                            </FadeInSection>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="border-t border-slate-200 bg-white/70 px-6 py-10">
                <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row">
                    <div>
                        <p className="text-sm font-semibold text-slate-900">ChefFlow</p>
                        <p className="mt-2 text-sm text-slate-500">
                            Ventes, stocks et recettes en un seul endroit.
                        </p>
                    </div>
                    <div className="grid gap-4 text-sm text-slate-500 md:grid-cols-3">
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-700">Produit</p>
                            <a href="#features" className="block hover:text-slate-900">
                                Fonctionnalités
                            </a>
                            <a href="#experience" className="block hover:text-slate-900">
                                Expérience
                            </a>
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-700">Ressources</p>
                            <a href="#faq" className="block hover:text-slate-900">
                                FAQ
                            </a>
                            <Link href={route('login')} className="block hover:text-slate-900">
                                Connexion
                            </Link>
                        </div>
                        <div className="space-y-2">
                            <p className="font-semibold text-slate-700">Social</p>
                            <a href="https://www.linkedin.com" className="block hover:text-slate-900">
                                LinkedIn
                            </a>
                            <a href="https://www.instagram.com" className="block hover:text-slate-900">
                                Instagram
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </MarketingLayout>
    );
}

