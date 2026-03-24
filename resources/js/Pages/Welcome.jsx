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
    Linkedin,
    Github,
    Globe,
    Users,
    FileDown,
} from 'lucide-react';
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
        <section id='about' className="bg-[#faf8f5] px-6 py-24 lg:px-16">
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

                    <h2 className="mt-4 text-2xl lg:text-4xl font-extrabold leading-tight text-gray-900">
                        Quand les opérations en cuisine deviennent{' '}
                        <span className="text-[#FF7E47]">claires</span>,{' '}
                        <span className="text-[#FF7E47]">rapides</span> et{' '}
                        <span className="text-[#FF7E47]">fiables</span>
                    </h2>

                    <p className="mt-6 text-sm lg:text-lg leading-relaxed text-gray-600">
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
                                <h3 className=" text-xl lg:text-3xl font-extrabold">
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
                    <div className="rounded-[28px] border border-black/5 bg-white/85 p-4 shadow-[0_12px_32px_rgba(15,23,42,0.08)]">
                        <div className="lg:flex items-center justify-between border-b border-slate-100 pb-3">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-[#FF7E47]">
                                Vente Directe
                                </p>
                                <p className="mt-1 text-sm font-semibold text-slate-900">
                                    Votre panier
                                </p>
                            </div>
                            <div className='mt-3 lg:mt-0' >
                                <span className=" rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                                    Valider la commande
                                </span>
                            </div>
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
                                Net à payer
                            </p>
                            <p className="mt-3 text-2xl lg:text-4xl font-semibold tracking-[-0.03em]">
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
        <section id="features" className="lg:px-6 px-3 pb-24">
            <div className="mx-auto max-w-7xl">
                <FadeInSection>
                    <div className="mx-auto max-w-3xl text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/50 bg-orange-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8d6a57] mb-4">
                            Produit & Fonctionnalités
                        </div>
                        <h2 className="mt-6 text-2xl lg:text-4xl font-extrabold tracking-[-0.04em] text-slate-900 md:text-5xl">
                            Tout pour gérer votre <span className='text-[#FF7E47]' >restaurant sereinement</span>.
                        </h2>
                    </div>
                </FadeInSection>

                <div className="columns-1 gap-8 space-y-8 md:columns-2 lg:columns-3">
                    {premiumFeatures.map((feature, idx) => (
                        <motion.div
                            key={feature.title}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: false, amount: 0.3 }}
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

const roadmapItems = [
    {
        quarter: 'Q2 2026',
        title: 'Historique des commandes',
        status: 'En cours',
        description: 'Consultez toutes vos ventes passées, filtrez par date et par statut, et naviguez par pages.',
        icon: ClipboardList,
    },
    {
        quarter: 'Q2 2026',
        title: 'Alertes stock automatiques',
        status: 'En cours',
        description: 'Notifications en temps réel dès qu\'un ingrédient passe sous son seuil critique.',
        icon: Activity,
    },
    {
        quarter: 'Q3 2026',
        title: 'Multi-établissements',
        status: 'Planifié',
        description: 'Un seul compte pour gérer plusieurs restaurants. Idéal pour les gérants de chaînes et franchises.',
        icon: LockKeyhole,
    },
    {
        quarter: 'Q3 2026',
        title: 'Gestion d\'équipe',
        status: 'Planifié',
        description: 'Attribuez des rôles à vos collaborateurs : Admin, Manager, Caissier, Cuisinier.',
        icon: Users,
    },
    {
        quarter: 'Q4 2026',
        title: 'Export & intégrations',
        status: 'Vision',
        description: 'Export PDF des fiches techniques, CSV des commandes, impression tickets et connexion comptabilité.',
        icon: FileDown,
    },
    {
        quarter: '2027',
        title: 'Intelligence prédictive',
        status: 'Vision',
        description: 'Prévisions de stocks, suggestions de réapprovisionnement et analyse de rentabilité par plat.',
        icon: Sparkles,
    },
];

function RoadmapSection() {
    return (
        <section id="roadmap" className="relative px-6 py-24 overflow-hidden bg-[#faf8f5]">
            {/* Éléments de décoration en arrière-plan */}
            <div className="absolute top-0 left-1/4 h-96 w-96 rounded-full bg-orange-100/50 blur-3xl opacity-50" />
            <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-amber-50/50 blur-3xl opacity-50" />

            <div className="relative mx-auto max-w-7xl">
                <FadeInSection>
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200/50 bg-orange-50 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-[#8d6a57] mb-4">
                            Prochainement
                        </div>
                        <h2 className="text-2xl lg:text-4xl font-extrabold tracking-tight text-slate-900 md:text-5xl">
                            Notre <span className='text-[#FF7E47]' >vision</span>  pour le <span className='text-[#FF7E47]' >futur</span>
                        </h2>
                        <p className="mt-4 text-sm lg:text-lg text-slate-600 max-w-2xl mx-auto">
                            Nous construisons l'outil que vous méritez. Voici les prochaines étapes de l'aventure ChefFlow.
                        </p>
                    </div>
                </FadeInSection>

                <div className="relative mt-20 px-4 lg:px-0">
                    {/* Ligne verticale : décalée à gauche sur mobile, centrée sur Desktop */}
                    <div className="absolute left-4 lg:left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-orange-200 via-slate-200 to-transparent z-0" />

                    <div className="space-y-12 lg:space-y-24">
                        {roadmapItems.map((item, idx) => (
                            <motion.div
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: false, amount: 0.3 }}
                                transition={{ duration: 0.7, delay: idx * 0.1 }}
                                className={`relative flex flex-col lg:flex-row items-center ${
                                    idx % 2 === 0 ? 'lg:flex-row-reverse' : ''
                                }`}
                            >
                                {/* Point lumineux : suit la ligne */}
                                <div className="absolute left-4 lg:left-1/2 h-5 w-5 -translate-x-1/2 rounded-full border-4 border-[#faf8f5] bg-[#FF7E47] shadow-[0_0_15px_rgba(255,126,71,0.5)] z-20" />

                                {/* Conteneur de la carte avec espacement correct */}
                                <div className={`w-full lg:w-1/2 z-10 
                                    ${idx % 2 === 0 
                                        ? 'pl-12 lg:pl-8 lg:pr-16' // Si à gauche : padding droit sur desktop
                                        : 'pl-12 lg:pr-8'         // Si à droite : padding gauche partout
                                    }`}
                                >
                                    <div className="group relative rounded-[32px] border border-white bg-white/60 p-6 sm:p-8 shadow-sm backdrop-blur-sm transition-all hover:shadow-xl hover:bg-white/80">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-xs font-black text-[#8d6a57] uppercase tracking-tighter opacity-60">
                                                {item.quarter}
                                            </span>
                                            <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                                item.status === 'En cours' 
                                                ? 'bg-orange-50 text-orange-600 border border-orange-100' 
                                                : 'bg-slate-50 text-slate-400 border border-slate-100'
                                            }`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 sm:gap-5">
                                            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF7E47] text-white shadow-lg shadow-orange-200 transition-transform group-hover:scale-110">
                                                <item.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                            </div>
                                            <h3 className="text-lg sm:text-lg lg:text-2xl font-bold text-slate-900 tracking-tight">
                                                {item.title}
                                            </h3>
                                        </div>
                                        
                                        <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-slate-500 font-medium">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                                
                                {/* Espace vide pour maintenir l'équilibre desktop */}
                                <div className="hidden lg:block lg:w-1/2" />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FinalCTASection() {
    return (
        <section className="px-4 py-16 sm:px-6 lg:py-24">
            <div className="mx-auto max-w-5xl">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-[32px] sm:rounded-[40px] bg-[#1f1a17] px-6 py-12 text-center shadow-2xl md:px-16 md:py-20"
                >
                    {/* Décorations lumineuses ajustées pour mobile */}
                    <div className="absolute -right-20 -top-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg- opacity-20 blur-[60px] sm:blur-[80px]" />
                    <div className="absolute -left-20 -bottom-20 h-48 w-48 sm:h-64 sm:w-64 rounded-full bg-[#8d6a57] opacity-20 blur-[60px] sm:blur-[80px]" />

                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-5xl">
                            Prêt à piloter votre restaurant <br className="hidden sm:block" />
                            <span className="text-[#FF7E47]">autrement ?</span>
                        </h2>
                        
                        <p className="mx-auto mt-6 max-w-xl text-base text-white/70 md:text-lg">
                            Créez votre compte en 30 secondes. Aucune carte bancaire requise. Testez la puissance de ChefFlow dès aujourd'hui.
                        </p>
                        
                        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
                            <Link
                                href={route('register')}
                                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7E47] px-8 py-4 text-lg font-bold text-white transition-all hover:scale-105 hover:bg-[#e86f3d] active:scale-95 shadow-lg shadow-orange-900/20"
                            >
                                Commencer gratuitement
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>

                        {/* Badges de réassurance : stack vertical sur très petits écrans */}
                        <div className="mt-10 flex flex-wrap items-center justify-center gap-y-4 gap-x-8 text-sm text-white/40">
                            <div className="flex items-center gap-2 text-white/90">
                                <CheckCircle2 className="h-4 w-4 text-[#FF7E47]" />
                                Installation 0€
                            </div>
                            <div className="flex items-center gap-2 text-white/90">
                                <CheckCircle2 className="h-4 w-4 text-[#FF7E47]" />
                                Support 7j/7
                            </div>
                        </div>
                    </div>
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
                            <h1 className="mt-10 text-2xl lg:text-4xl font-extrabold leading-tight text-slate-900  text-center">
                                Gérez votre restaurant <span className='text-[#FF7E47]' >comme un pro !</span>
                            </h1>
                            <p className="mt-4 text-md text-slate-600  md:text-lg sm:text-sm text-center">
                                ChefFlow centralise vos ventes, vos stocks et vos recettes en un seul endroit. Simple, rapide, fait pour les restaurateurs.
                            </p>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center items-center gap-4">
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                                <Link
                                    href={route('register')}
                                    className="w-full sm:w-auto group inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7E47] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-200 transition-all hover:bg-[#e86f3d]"
                                >
                                    Créer mon compte gratuitement
                                    <ArrowRight className="hidden sm:inline-flex h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                                <Link
                                    href={route('login')}
                                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
                                >
                                    Se connecter
                                </Link>
                            </div>
                            
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

            <section className="pb-16">
                <PremiumFeaturesSection />
            </section>

            <section className="pb-16">
                <RoadmapSection />
            </section>

            <section className="pb-16">
                <FinalCTASection />
            </section>

            <footer className="border-t border-slate-200 bg-white px-6 py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="flex flex-col items-start justify-between gap-10 md:flex-row">
                        <div className="space-y-4">
                            <Link href="/" className="flex items-center gap-2">
                                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1f1a17] text-xs font-bold text-white shadow-lg shadow-black/10">
                                    CH
                                </span>
                                <span className="text-sm font-bold uppercase tracking-widest text-slate-900">
                                    ChefFlow
                                </span>
                            </Link>
                            <p className="max-w-xs text-sm leading-relaxed text-slate-500">
                                Une solution moderne conçue pour simplifier la gestion opérationnelle des restaurants. 
                                <span className="block mt-2 font-medium text-slate-400 italic">
                                    By Ralf Lionel - Fullstack Developer
                                </span>
                            </p>
                            
                            <div className="flex items-center gap-5 pt-2">
                                <a href="https://www.ralf-lionel.com/" target="_blank" title="Mon Portfolio" className="text-slate-400 hover:text-[#FF7E47] transition-all hover:scale-110">
                                    <Globe className="h-5 w-5" />
                                </a>
                                <a href="https://github.com/RalfHerizo" target="_blank" title="GitHub" className="text-slate-400 hover:text-slate-900 transition-all hover:scale-110">
                                    <Github className="h-5 w-5" />
                                </a>
                                <a href="https://www.linkedin.com/in/ralf-lionel-066b20227/" target="_blank" title="LinkedIn" className="text-slate-400 hover:text-[#0077b5] transition-all hover:scale-110">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-12 sm:gap-24">
                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Navigation</p>
                                <nav className="flex flex-col gap-3 text-sm font-medium text-slate-500">
                                    <a href="#features" className="transition hover:text-[#FF7E47]">Fonctionnalités</a>
                                    <a href="#about" className="transition hover:text-[#FF7E47]">À propos</a>
                                    <a href="#roadmap" className="transition hover:text-[#FF7E47]">Roadmap</a>
                                </nav>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Contact</p>
                                <nav className="flex flex-col gap-3 text-sm font-medium text-slate-500">
                                    <a href="mailto:ralflionel120@gmail.cpm" className="transition hover:text-[#FF7E47]">Me contacter</a>
                                    <span className="text-slate-300">© {new Date().getFullYear()}</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </MarketingLayout>
    );
}
