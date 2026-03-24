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
            className={`group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(246,242,238,0.86))] p-7 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur-xl ${className}`}
        >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent" />
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-white/80 text-[#7c5a47] shadow-sm">
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
            title: 'Fast POS for real service environments',
            description:
                'Take orders quickly with a clean interface designed for fast-moving service.',
            className: 'lg:col-span-4 lg:row-span-2',
            visual: (
                <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[28px] border border-black/5 bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                    Service mode
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    Main counter
                                </p>
                            </div>
                            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                Ready to close
                            </span>
                        </div>
                        <div className="mt-4 space-y-3">
                            {[
                                ['Smash Burger', '$18.40'],
                                ['Truffle Fries', '$7.80'],
                                ['House Lemonade', '$4.20'],
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
                                            Quick-add preset
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
                            <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                Current ticket
                            </p>
                            <p className="mt-3 text-4xl font-semibold tracking-[-0.03em]">
                                $30.40
                            </p>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm text-white/70">
                                <span>3 items</span>
                                <span>Card</span>
                            </div>
                            <button
                                type="button"
                                className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10"
                            >
                                Checkout instantly
                            </button>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: TriangleAlert,
            title: 'Real-time stock alerts',
            description:
                'Know exactly when ingredients are running low before service is impacted.',
            className: 'lg:col-span-2 lg:row-span-2',
            visual: (
                <div className="space-y-3">
                    {[
                        {
                            label: 'Tomatoes low',
                            tone: 'border-amber-200 bg-amber-50 text-amber-800',
                        },
                        {
                            label: 'Cheese critical',
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
                                        alert.label.includes('critical')
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
            title: 'Technical sheets built for kitchen precision',
            description:
                'Standardize recipes, quantities, and preparation across your team.',
            className: 'lg:col-span-2 lg:row-span-2',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                                Recipe sheet
                            </p>
                            <h4 className="mt-2 text-base font-semibold text-slate-900">
                                Signature burger
                            </h4>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                            4 steps
                        </span>
                    </div>
                    <div className="mt-5 space-y-3">
                        {[
                            'Brioche bun · 1 unit',
                            'Aged cheddar · 2 slices',
                            'House sauce · 18 g',
                        ].map((item) => (
                            <div
                                key={item}
                                className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                                <span className="h-2 w-2 rounded-full bg-[#c39274]" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            icon: Activity,
            title: 'Operational insights in one dashboard',
            description:
                'Track performance, monitor sales, and improve daily decisions.',
            className: 'lg:col-span-4 lg:row-span-2',
            visual: (
                <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                    <div className="grid gap-4 sm:grid-cols-2">
                        {[
                            ['Net sales', '$12.4k'],
                            ['Orders today', '184'],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="rounded-[24px] border border-black/5 bg-white/85 p-5 shadow-sm"
                            >
                                <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                                    {label}
                                </p>
                                <p className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-900">
                                    {value}
                                </p>
                                <p className="mt-2 text-xs text-emerald-600">
                                    +12% vs yesterday
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-[28px] border border-black/5 bg-[#f8f6f3] p-5 shadow-sm">
                        <div className="flex items-end gap-3">
                            {[48, 66, 58, 84, 74, 96, 88].map((height, index) => (
                                <div key={height} className="flex-1">
                                    <div
                                        className="rounded-t-[18px] bg-gradient-to-b from-[#d9c5b7] to-[#9a765f]"
                                        style={{ height: `${height}px` }}
                                    />
                                    <p className="mt-2 text-center text-[10px] uppercase tracking-[0.2em] text-slate-400">
                                        {`D${index + 1}`}
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {[
                                'Peak lunch +18%',
                                'Food cost stable',
                                'Conversion 7.2%',
                            ].map((item) => (
                                <div
                                    key={item}
                                    className="rounded-2xl border border-white/70 bg-white/80 px-4 py-3 text-sm text-slate-600"
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ),
        },
        {
            icon: LockKeyhole,
            title: 'Secure by design',
            description:
                'Permissions and access built for team environments.',
            className: 'lg:col-span-2 lg:col-start-3 lg:row-span-1',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 px-4 py-3">
                        <ShieldCheck className="h-5 w-5 text-[#8d6a57]" />
                        <div>
                            <p className="text-sm font-semibold text-slate-900">
                                Role-based access
                            </p>
                            <p className="text-xs text-slate-500">
                                Manager · Cashier · Kitchen
                            </p>
                        </div>
                    </div>
                    <div className="mt-4 space-y-2">
                        {['Reports', 'Pricing rules', 'Refund actions'].map((item) => (
                            <div
                                key={item}
                                className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600"
                            >
                                <span>{item}</span>
                                <span className="rounded-full bg-white px-2.5 py-1 text-xs text-slate-500">
                                    Restricted
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            icon: PackageCheck,
            title: 'Quick onboarding',
            description:
                'Start using Chefflow without operational friction.',
            className: 'lg:col-span-2 lg:col-start-5 lg:row-span-1',
            visual: (
                <div className="rounded-[28px] border border-black/5 bg-white/85 p-5 shadow-sm">
                    <div className="space-y-3">
                        {[
                            'Import your menu',
                            'Set user roles',
                            'Start your first service',
                        ].map((step, index) => (
                            <div
                                key={step}
                                className="flex items-center gap-4 rounded-2xl bg-slate-50 px-4 py-3"
                            >
                                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f3ebe5] text-sm font-semibold text-[#8d6a57]">
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
                    <div className="mx-auto max-w-3xl text-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-black/5 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#8d6a57] shadow-sm backdrop-blur">
                            <Sparkles className="h-3.5 w-3.5" />
                            Core Product Features
                        </div>
                        <h2 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-slate-900 md:text-5xl">
                            Everything your restaurant needs to operate smoothly.
                        </h2>
                        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                            From order management to inventory control,
                            Chefflow helps food businesses run faster, smarter,
                            and with full operational visibility.
                        </p>
                    </div>
                </FadeInSection>

                <motion.div
                    variants={{
                        hidden: {},
                        visible: {
                            transition: {
                                staggerChildren: 0.08,
                            },
                        },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.15 }}
                    className="mt-14 grid gap-6 lg:auto-rows-[182px] lg:grid-cols-6"
                >
                    {premiumFeatures.map((feature) => (
                        <motion.div
                            key={feature.title}
                            variants={fadeUp}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                        >
                            <PremiumFeatureCard
                                icon={feature.icon}
                                title={feature.title}
                                description={feature.description}
                                className={feature.className}
                            >
                                {feature.visual}
                            </PremiumFeatureCard>
                        </motion.div>
                    ))}
                </motion.div>
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
                {/* DEBUT SECTION WHO WE ARE */}
                <WhoWeAreSection />
                {/* FIN SECTION WHO WE ARE */}
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
