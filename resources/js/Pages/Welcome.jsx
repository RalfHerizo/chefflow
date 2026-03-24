import { Head, Link } from '@inertiajs/react';
import { motion } from 'framer-motion';
import {
    Activity,
    ArrowRight,
    CheckCircle2,
    ClipboardList,
    LockKeyhole,
    PackageCheck,
    ShieldCheck,
    Receipt,
    Sparkles,
    TriangleAlert,
    Utensils,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import MarketingLayout from '@/Layouts/MarketingLayout';

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

const whoWeAreStats = [
    { value: '100%', label: 'Contrôle quotidien' },
    { value: '24/7', label: 'Commandes de cuisine' },
    { value: '95%', label: "Coordination de l'équipe" },
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

function WhoWeAreSection() {
    return (
        <section className="bg-[#faf8f5] px-6 py-24 lg:px-16">
            <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                >
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />
                    </div>

                    <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-gradient-to-br from-orange-50 via-white to-amber-50 p-10 shadow-[0_20px_80px_rgba(0,0,0,0.08)] backdrop-blur-sm">
                        <motion.img
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 4 }}
                            src="https://i.ibb.co/67MN450T/modal-card.jpg"
                            alt="App Preview"
                            className="mx-auto w-[80em] rounded-[16px] drop-shadow-2xl"
                        />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-sm font-medium uppercase tracking-wide text-orange-500">
                        A propos de nous
                    </span>

                    <h2 className="mt-4 text-4xl font-extrabold leading-tight text-gray-900">
                        Quand les opérations en cuisine deviennent{' '}
                        <span className="text-[#FF7E47]">claires</span>,{' '}
                        <span className="text-[#FF7E47]">rapides</span> et{' '}
                        <span className="text-[#FF7E47]">fiables</span>
                    </h2>

                    <p className="mt-6 text-lg leading-relaxed text-gray-600">
                        Conçu pour les equipes de restauration qui ont besoin
                        d'une organisation claire, d'une responsabilisation et
                        d'un déroulement sans heurts à chaque service.
                    </p>

                    <Link
                        href={route('login')}
                        className="group mt-6 inline-flex items-center gap-2 rounded-lg bg-[#FF7E47] px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e86f3d]"
                    >
                        Découvrez comment ça marche
                        <span className="inline-flex items-center opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                            <ArrowRight className="h-4 w-4" />
                        </span>
                    </Link>

                    <div className="mt-14 grid grid-cols-3 gap-8">
                        {whoWeAreStats.map((stat) => (
                            <div key={stat.label}>
                                <h3 className="text-3xl font-extrabold">
                                    {stat.value}
                                </h3>
                                <p className="text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

function PremiumFeatureCard({
    icon: Icon,
    title,
    description,
    className = '',
    children,
}) {
    return (
        <motion.article
            whileHover={{ y: -6 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`group relative overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,242,238,0.86))] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
        >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-white/80 text-[#FF7E47] shadow-sm">
                <Icon className="h-5 w-5" />
            </div>
            <div className="mt-6 max-w-sm">
                <h3 className="text-xl font-semibold tracking-[-0.02em] text-slate-900">
                    {title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                    {description}
                </p>
            </div>
            <div className="mt-8">{children}</div>
        </motion.article>
    );
}

function PremiumFeaturesSection() {
    const premiumFeatures = [
        {
            icon: Receipt,
            title: 'Un système de caisse ultra-rapide',
            description:
                'Prenez les commandes rapidement grâce à une interface épurée, conçue pour un service rapide.',
            className: 'md:col-span-2 md:min-h-[320px]',
            visual: (
                <div className="grid gap-4"> 
                {/* //lg:grid-cols-[1.2fr_0.8fr] */}
                    <div className="rounded-[28px] border border-black/5 bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-[#FF7E47]">
                                    Service mode
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    Votre panier
                                </p>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                valider la commande
                            </span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {[
                                ['Smash Burger', '18.40€'],
                                ['Frites à la truffe', '7.80€'],
                                ['Limonade maison', '4.20€'],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3"
                                >
                                    <div>
                                        <p className="text-sm font-medium text-slate-900">
                                            {label}
                                        </p>
                                        <p className="mt-1 text-xs text-slate-400">
                                            Ajouter au panier
                                        </p>
                                    </div>
                                    <p className="text-sm font-semibold text-slate-700">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col justify-between rounded-[28px] border border-black/5 bg-[#1f1a17] p-5 text-white shadow-[0_18px_40px_rgba(15,23,42,0.16)]">
                        <div>
                            <p className="text-xs uppercase tracking-[0.3em] text-[#FF7E47]">
                                Current ticket
                            </p>
                            <p className="mt-3 text-4xl font-semibold tracking-[-0.03em]">
                                30.40&euro;
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-white/70">
                                <span>3 articles</span>
                                <span>Panier</span>
                            </div>
                            <button
                                type="button"
                                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10"
                            >
                                Valider la commande
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: TriangleAlert,
            title: 'Alertes de stock en temps réel',
            description:
                'Soyez prévenu dès qu\'un ingrédient vient à manquer, avant même que cela n\'impacte votre service.',
            className: 'md:row-span-1 md:min-h-[320px]',
            visual: (
                <div className="space-y-3">
                    {[
                        {
                            label: 'Stock faible',
                            tone: 'border-amber-200 bg-amber-50 text-amber-800',
                        },
                        {
                            label: 'Fromage critique',
                            tone: 'border-rose-200 bg-rose-50 text-rose-800',
                        },
                    ].map((alert) => (
                        <div
                            key={alert.label}
                            className="rounded-[24px] border border-black/5 bg-white/85 p-4 shadow-sm"
                        >
                            <div
                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${alert.tone}`}
                            >
                                {alert.label}
                            </div>
                            <div className="mt-4 h-2 rounded-full bg-slate-100">
                                <div
                                    className={`h-2 rounded-full ${
                                        alert.label.includes('critique')
                                            ? 'w-1/4 bg-rose-300'
                                            : 'w-2/5 bg-amber-300'
                                    }`}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            icon: ClipboardList,
            title: 'Fiches techniques conçues pour la précision en cuisine',
            description:
                'Harmonisez les recettes, les quantités et les méthodes de préparation au sein de votre équipe.',
            className: 'md:min-h-[320px]',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-[#FF7E47]">
                            Fiche Recette
                            </p>
                            <h4 className="mt-2 text-base font-semibold text-slate-900">
                                Signature burger
                            </h4>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            4 étapes
                        </span>
                    </div>
                    <div className="mt-5 space-y-3">
                        {[
                            'Petit pain brioché · 1 pièce ',
                            'Cheddar · 2 tranches',
                            'Sauce maison · 18 g',
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                                <span className="h-2 w-2 rounded-full bg-[#FF7E47]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            icon: Activity,
            title: 'Pilotage de votre activité',
            description:
                'Suivez les performances, surveillez les ventes et optimisez vos décisions quotidiennes.',
            className: 'md:col-span-2 md:min-h-[320px]',
            visual: (
                <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            ['Ventes', '12.4k(€)'],
                            ['Commandes', '184'],
                        ].map(([label, value]) => (
                            <div key={label} className="rounded-2xl border border-black/5 bg-white/80 p-4 shadow-sm">
                                <p className="text-[10px] uppercase tracking-wider text-[#FF7E47]">{label}</p>
                                <p className="mt-1 text-xl font-bold text-slate-900">{value}</p>
                                <p className="mt-1 text-[10px] text-emerald-600">+12%</p>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-3xl border border-black/5 bg-[#fcfaf8] p-4 shadow-inner">
                        <div className="flex items-end justify-between gap-1 h-20">
                            {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                                <div key={i} className="w-full bg-gradient-to-t from-[#FF7E47] to-[#e6d5c9] rounded-t-md" style={{ height: `${h}%` }} />
                            ))}
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                            {['Pic +18%', 'Coût des denrées alimentaires stable'].map(tag => (
                                <span key={tag} className="text-[10px] bg-white px-2 py-1 rounded-full border border-slate-100 text-slate-500">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: LockKeyhole,
            title: 'Sécurité et rôles d\'accès',
            description:
                'Gérez les permissions de votre équipe selon les postes.',
            className: 'md:min-h-[280px]',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                        <ShieldCheck className="h-5 w-5 text-[#FF7E47]" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Accès basé sur les rôles
                            </p>
                            <p className="text-xs text-slate-500">
                                Manager · Caissier · Cuisine
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {['Rapports ', 'Règles de tarification', 'Annulations'].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                                <span>{item}</span>
                                <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs text-slate-500">
                                    Accès restreint
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            icon: PackageCheck,
            title: 'Prêt en moins d\'une heure',
            description:
                'Importez votre menu, configurez vos accès et lancez votre premier service immédiatement.',
            className: 'md:min-h-[280px]',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="space-y-3">
                        {[
                            'Import du menu',
                            'Rôles d\'équipe',
                            'Premier service',
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7E47]/25 text-sm font-semibold text-[#8d6a57]">
                                    {index + 1}
                                </span>
                                <span className="text-sm font-medium text-slate-700">
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
    ];

    return (
        <section id="features" className="px-6 pb-24">
            <div className="mx-auto max-w-7xl">
                <FadeInSection>
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-lg border border-[#FF7E47] bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#FF7E47] shadow-sm backdrop-blur">
                            Produit & Fonctionnalités
                        </div>
                        <h2 className="mt-6 text-4xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-5xl">
                            Tout pour gérer votre <span className='text-[#FF7E47]' >restaurant sereinement</span>.
                        </h2>
                    </div>
                </FadeInSection>

                {/* Masonry Layout avec espacement cohérent */}
                <div className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
                    {premiumFeatures.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.3 }}
                            variants={{
                                hidden: { opacity: 0, y: 30 },
                                visible: { 
                                    opacity: 1, 
                                    y: 0,
                                    transition: { duration: 0.6, delay: idx * 0.1 } 
                                }
                            }}
                            className="break-inside-avoid"
                        >
                            <PremiumFeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                className="w-full"
                            >
                                {/* Correction spécifique pour le visuel Operational Insights */}
                                <div className="relative">
                                    {feature.visual}
                                </div>
                            </PremiumFeatureCard>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
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

            <section className="pb-16">
                <WhoWeAreSection />
            </section>

            <PremiumFeaturesSection />

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
