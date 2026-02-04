/**
 * OUROZ Landing Page Component
 * Page 1 of the Moroccan B2B Marketplace
 * 
 * PAGE OBJECTIVE:
 * First impression point that establishes OUROZ as a premium Moroccan B2B marketplace.
 * Must capture both international buyers seeking Moroccan products AND Moroccan suppliers
 * looking to export globally.
 * 
 * USER ACTIONS:
 * - Choose buyer or supplier path
 * - Search products/suppliers
 * - Browse categories
 * - Change language (EN/AR/FR)
 * - Register/Login
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search, Globe, Shield, TrendingUp, Users, Package,
    ChevronRight, Star, CheckCircle, ArrowRight, Play,
    Building2, Factory, Truck, CreditCard, MessageCircle
} from 'lucide-react';

// Types
interface LandingPageProps {
    onNavigate: (path: string) => void;
    language: 'en' | 'ar' | 'fr';
    onLanguageChange: (lang: 'en' | 'ar' | 'fr') => void;
}

interface CategoryItem {
    id: string;
    name: { en: string; ar: string; fr: string };
    icon: string;
    productCount: number;
    supplierCount: number;
    image: string;
}

interface StatItem {
    value: string;
    label: { en: string; ar: string; fr: string };
    icon: React.ReactNode;
}

// Constants
const CATEGORIES: CategoryItem[] = [
    {
        id: 'agriculture',
        name: { en: 'Agriculture', ar: 'الفلاحة', fr: 'Agriculture' },
        icon: '🌿',
        productCount: 12500,
        supplierCount: 850,
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400'
    },
    {
        id: 'textiles',
        name: { en: 'Textiles', ar: 'النسيج', fr: 'Textiles' },
        icon: '🧵',
        productCount: 8200,
        supplierCount: 620,
        image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400'
    },
    {
        id: 'handicrafts',
        name: { en: 'Handicrafts', ar: 'الصناعة التقليدية', fr: 'Artisanat' },
        icon: '🏺',
        productCount: 15800,
        supplierCount: 1200,
        image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?w=400'
    },
    {
        id: 'cosmetics',
        name: { en: 'Cosmetics', ar: 'مستحضرات التجميل', fr: 'Cosmétiques' },
        icon: '✨',
        productCount: 5400,
        supplierCount: 380,
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400'
    },
    {
        id: 'food-export',
        name: { en: 'Food & Beverages', ar: 'الأغذية والمشروبات', fr: 'Alimentation' },
        icon: '🫒',
        productCount: 9600,
        supplierCount: 540,
        image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400'
    },
    {
        id: 'construction',
        name: { en: 'Construction', ar: 'البناء', fr: 'Construction' },
        icon: '🏗️',
        productCount: 7200,
        supplierCount: 290,
        image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400'
    },
];

const STATS: StatItem[] = [
    { value: '15,000+', label: { en: 'Verified Suppliers', ar: 'موردين معتمدين', fr: 'Fournisseurs Vérifiés' }, icon: <CheckCircle className="w-6 h-6" /> },
    { value: '120,000+', label: { en: 'Products Listed', ar: 'منتج مدرج', fr: 'Produits Listés' }, icon: <Package className="w-6 h-6" /> },
    { value: '85+', label: { en: 'Countries Served', ar: 'دولة مخدومة', fr: 'Pays Desservis' }, icon: <Globe className="w-6 h-6" /> },
    { value: '$2.5B+', label: { en: 'Trade Volume', ar: 'حجم التجارة', fr: 'Volume Commercial' }, icon: <TrendingUp className="w-6 h-6" /> },
];

const TRUST_BADGES = [
    { icon: <Shield className="w-5 h-5" />, text: { en: 'Trade Assurance', ar: 'ضمان التجارة', fr: 'Assurance Commerce' } },
    { icon: <CreditCard className="w-5 h-5" />, text: { en: 'Secure Payments', ar: 'دفع آمن', fr: 'Paiements Sécurisés' } },
    { icon: <Truck className="w-5 h-5" />, text: { en: 'Global Logistics', ar: 'لوجستيات عالمية', fr: 'Logistique Mondiale' } },
    { icon: <MessageCircle className="w-5 h-5" />, text: { en: '24/7 Support', ar: 'دعم متواصل', fr: 'Support 24/7' } },
];

// Translations
const translations = {
    en: {
        heroTitle: 'The Gateway to',
        heroHighlight: 'Moroccan Excellence',
        heroSubtitle: 'Connect with verified Moroccan manufacturers, wholesalers, and artisans. Source authentic products with trade assurance and seamless global logistics.',
        searchPlaceholder: 'Search products, suppliers, or categories...',
        forBuyers: 'For Buyers',
        forSuppliers: 'For Suppliers',
        buyerCta: 'Start Sourcing',
        supplierCta: 'Start Selling',
        buyerDesc: 'Access 15,000+ verified Moroccan suppliers with trade assurance',
        supplierDesc: 'Reach global buyers and grow your export business',
        exploreCategories: 'Explore Categories',
        viewAll: 'View All',
        trustedBy: 'Trusted by leading companies worldwide',
        whyOuroz: 'Why OUROZ?',
        getStarted: 'Get Started Free',
        watchDemo: 'Watch Demo',
        products: 'products',
        suppliers: 'suppliers',
    },
    ar: {
        heroTitle: 'بوابتك إلى',
        heroHighlight: 'التميز المغربي',
        heroSubtitle: 'تواصل مع المصنعين وتجار الجملة والحرفيين المغاربة المعتمدين. احصل على منتجات أصيلة مع ضمان التجارة والخدمات اللوجستية العالمية.',
        searchPlaceholder: 'ابحث عن المنتجات أو الموردين أو الفئات...',
        forBuyers: 'للمشترين',
        forSuppliers: 'للموردين',
        buyerCta: 'ابدأ التوريد',
        supplierCta: 'ابدأ البيع',
        buyerDesc: 'الوصول إلى أكثر من 15,000 مورد مغربي معتمد مع ضمان التجارة',
        supplierDesc: 'الوصول إلى المشترين العالميين وتنمية أعمال التصدير الخاصة بك',
        exploreCategories: 'استكشف الفئات',
        viewAll: 'عرض الكل',
        trustedBy: 'موثوق به من قبل الشركات الرائدة في جميع أنحاء العالم',
        whyOuroz: 'لماذا أوروز؟',
        getStarted: 'ابدأ مجاناً',
        watchDemo: 'شاهد العرض',
        products: 'منتج',
        suppliers: 'مورد',
    },
    fr: {
        heroTitle: 'La Porte vers',
        heroHighlight: "l'Excellence Marocaine",
        heroSubtitle: 'Connectez-vous avec des fabricants, grossistes et artisans marocains vérifiés. Approvisionnez-vous en produits authentiques avec assurance commerce et logistique mondiale.',
        searchPlaceholder: 'Rechercher produits, fournisseurs ou catégories...',
        forBuyers: 'Pour Acheteurs',
        forSuppliers: 'Pour Fournisseurs',
        buyerCta: 'Commencer à Sourcer',
        supplierCta: 'Commencer à Vendre',
        buyerDesc: 'Accédez à plus de 15 000 fournisseurs marocains vérifiés avec assurance commerce',
        supplierDesc: 'Atteignez des acheteurs mondiaux et développez votre activité export',
        exploreCategories: 'Explorer les Catégories',
        viewAll: 'Voir Tout',
        trustedBy: 'Fait confiance par les entreprises leaders du monde entier',
        whyOuroz: 'Pourquoi OUROZ?',
        getStarted: 'Commencer Gratuitement',
        watchDemo: 'Voir la Démo',
        products: 'produits',
        suppliers: 'fournisseurs',
    },
};

// Main Component
const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, language, onLanguageChange }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);
    const t = translations[language];
    const isRTL = language === 'ar';

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onNavigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className={`min-h-screen bg-sahara ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
            {/* Navigation Header */}
            <Header
                isScrolled={isScrolled}
                language={language}
                onLanguageChange={onLanguageChange}
                onNavigate={onNavigate}
            />

            {/* Hero Section */}
            <HeroSection
                t={t}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                onNavigate={onNavigate}
            />

            {/* Trust Badges */}
            <TrustBadges badges={TRUST_BADGES} language={language} />

            {/* Stats Section */}
            <StatsSection stats={STATS} language={language} />

            {/* Categories Section */}
            <CategoriesSection
                categories={CATEGORIES}
                language={language}
                t={t}
                onNavigate={onNavigate}
            />

            {/* Buyer/Supplier CTA */}
            <DualCTASection t={t} onNavigate={onNavigate} />

            {/* Footer */}
            <Footer language={language} onNavigate={onNavigate} />
        </div>
    );
};

// Sub-components
const Header: React.FC<{
    isScrolled: boolean;
    language: 'en' | 'ar' | 'fr';
    onLanguageChange: (lang: 'en' | 'ar' | 'fr') => void;
    onNavigate: (path: string) => void;
}> = ({ isScrolled, language, onLanguageChange, onNavigate }) => (
    <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
            }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('/')}>
                <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl font-serif">ⵣ</span>
                </div>
                <span className="text-2xl font-serif font-bold text-henna">OUROZ</span>
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-8">
                <button onClick={() => onNavigate('/marketplace')} className="text-henna/70 hover:text-henna transition">
                    Marketplace
                </button>
                <button onClick={() => onNavigate('/suppliers')} className="text-henna/70 hover:text-henna transition">
                    Suppliers
                </button>
                <button onClick={() => onNavigate('/categories')} className="text-henna/70 hover:text-henna transition">
                    Categories
                </button>
                <button onClick={() => onNavigate('/rfq')} className="text-henna/70 hover:text-henna transition">
                    RFQ
                </button>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
                {/* Language Selector */}
                <select
                    value={language}
                    onChange={(e) => onLanguageChange(e.target.value as 'en' | 'ar' | 'fr')}
                    title="Select language"
                    aria-label="Select language"
                    className="bg-transparent border border-henna/20 rounded-lg px-3 py-1.5 text-sm text-henna cursor-pointer"
                >
                    <option value="en">🇺🇸 EN</option>
                    <option value="ar">🇲🇦 AR</option>
                    <option value="fr">🇫🇷 FR</option>
                </select>

                <button
                    onClick={() => onNavigate('/login')}
                    className="text-henna hover:text-gold transition font-medium"
                >
                    Sign In
                </button>
                <button
                    onClick={() => onNavigate('/register')}
                    className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg transition"
                >
                    Get Started
                </button>
            </div>
        </div>
    </motion.header>
);

const HeroSection: React.FC<{
    t: typeof translations.en;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    handleSearch: (e: React.FormEvent) => void;
    onNavigate: (path: string) => void;
}> = ({ t, searchQuery, setSearchQuery, handleSearch, onNavigate }) => (
    <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-moroccan-pattern" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium mb-8"
                >
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Morocco's #1 B2B Trade Platform
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-serif font-bold text-henna mb-6"
                >
                    {t.heroTitle}{' '}
                    <span className="bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                        {t.heroHighlight}
                    </span>
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl text-henna/60 mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                    {t.heroSubtitle}
                </motion.p>

                {/* Search Bar */}
                <motion.form
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    onSubmit={handleSearch}
                    className="max-w-2xl mx-auto mb-10"
                >
                    <div className="relative flex items-center bg-white rounded-2xl shadow-xl border border-amber-100 p-2">
                        <Search className="w-6 h-6 text-gray-400 ml-4" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={t.searchPlaceholder}
                            className="flex-1 px-4 py-3 text-lg text-henna placeholder-gray-400 bg-transparent border-none outline-none"
                        />
                        <button
                            type="submit"
                            className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition"
                        >
                            Search
                        </button>
                    </div>
                </motion.form>

                {/* CTA Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center"
                >
                    <button
                        onClick={() => onNavigate('/register?type=buyer')}
                        className="inline-flex items-center gap-2 bg-henna text-white px-8 py-4 rounded-xl font-semibold hover:bg-henna/90 transition shadow-lg"
                    >
                        <Users className="w-5 h-5" />
                        {t.buyerCta}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => onNavigate('/register?type=supplier')}
                        className="inline-flex items-center gap-2 bg-white text-henna border-2 border-henna px-8 py-4 rounded-xl font-semibold hover:bg-henna hover:text-white transition"
                    >
                        <Factory className="w-5 h-5" />
                        {t.supplierCta}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </motion.div>
            </div>
        </div>
    </section>
);

const TrustBadges: React.FC<{ badges: typeof TRUST_BADGES; language: 'en' | 'ar' | 'fr' }> = ({ badges, language }) => (
    <section className="py-6 border-y border-henna/10 bg-white/50">
        <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                {badges.map((badge, i) => (
                    <div key={i} className="flex items-center gap-2 text-henna/70">
                        <span className="text-amber-600">{badge.icon}</span>
                        <span className="text-sm font-medium">{badge.text[language]}</span>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const StatsSection: React.FC<{ stats: StatItem[]; language: 'en' | 'ar' | 'fr' }> = ({ stats, language }) => (
    <section className="py-16 bg-gradient-to-br from-henna to-henna/90">
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                        className="text-center"
                    >
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-500/20 rounded-full text-amber-400 mb-4">
                            {stat.icon}
                        </div>
                        <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                        <p className="text-white/60 text-sm">{stat.label[language]}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const CategoriesSection: React.FC<{
    categories: CategoryItem[];
    language: 'en' | 'ar' | 'fr';
    t: typeof translations.en;
    onNavigate: (path: string) => void;
}> = ({ categories, language, t, onNavigate }) => (
    <section className="py-20">
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-12">
                <div>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-henna mb-2">
                        {t.exploreCategories}
                    </h2>
                    <p className="text-henna/60">Discover Morocco's finest across all industries</p>
                </div>
                <button
                    onClick={() => onNavigate('/categories')}
                    className="hidden md:flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium"
                >
                    {t.viewAll}
                    <ChevronRight className="w-5 h-5" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {categories.map((cat, i) => (
                    <motion.div
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                        onClick={() => onNavigate(`/category/${cat.id}`)}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                            <img
                                src={cat.image}
                                alt={cat.name[language]}
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <span className="text-4xl mb-2 block">{cat.icon}</span>
                                <h3 className="text-white font-semibold">{cat.name[language]}</h3>
                            </div>
                        </div>
                        <div className="text-sm text-henna/60">
                            <span>{cat.productCount.toLocaleString()} {t.products}</span>
                            <span className="mx-2">•</span>
                            <span>{cat.supplierCount} {t.suppliers}</span>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
);

const DualCTASection: React.FC<{ t: typeof translations.en; onNavigate: (path: string) => void }> = ({ t, onNavigate }) => (
    <section className="py-20 bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Buyer Card */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition"
                >
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                        <Users className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-henna mb-4">{t.forBuyers}</h3>
                    <p className="text-henna/60 mb-6">{t.buyerDesc}</p>
                    <ul className="space-y-3 mb-8">
                        {['Verified Moroccan suppliers', 'Trade assurance protection', 'RFQ system', 'Secure escrow payments'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-henna/80">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => onNavigate('/register?type=buyer')}
                        className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition"
                    >
                        {t.buyerCta}
                    </button>
                </motion.div>

                {/* Supplier Card */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-gradient-to-br from-henna to-henna/90 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition"
                >
                    <div className="w-16 h-16 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400 mb-6">
                        <Factory className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{t.forSuppliers}</h3>
                    <p className="text-white/60 mb-6">{t.supplierDesc}</p>
                    <ul className="space-y-3 mb-8">
                        {['Global buyer network', 'Export documentation support', 'Logistics integration', 'Arabic/French/English support'].map((item, i) => (
                            <li key={i} className="flex items-center gap-3 text-white/80">
                                <CheckCircle className="w-5 h-5 text-amber-400" />
                                {item}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => onNavigate('/register?type=supplier')}
                        className="w-full bg-amber-500 text-henna py-4 rounded-xl font-semibold hover:bg-amber-400 transition"
                    >
                        {t.supplierCta}
                    </button>
                </motion.div>
            </div>
        </div>
    </section>
);

const Footer: React.FC<{ language: 'en' | 'ar' | 'fr'; onNavigate: (path: string) => void }> = ({ language, onNavigate }) => (
    <footer className="bg-henna text-white py-16">
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-12 mb-12">
                {/* Brand */}
                <div>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xl font-serif">ⵣ</span>
                        </div>
                        <span className="text-2xl font-serif font-bold">OUROZ</span>
                    </div>
                    <p className="text-white/60 mb-4">
                        Morocco's premier B2B marketplace connecting verified suppliers with global buyers.
                    </p>
                </div>

                {/* Links */}
                <div>
                    <h4 className="font-semibold mb-4">Marketplace</h4>
                    <ul className="space-y-2 text-white/60">
                        <li><button onClick={() => onNavigate('/products')} className="hover:text-white transition">All Products</button></li>
                        <li><button onClick={() => onNavigate('/suppliers')} className="hover:text-white transition">Suppliers</button></li>
                        <li><button onClick={() => onNavigate('/categories')} className="hover:text-white transition">Categories</button></li>
                        <li><button onClick={() => onNavigate('/rfq')} className="hover:text-white transition">Request Quote</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">For Business</h4>
                    <ul className="space-y-2 text-white/60">
                        <li><button onClick={() => onNavigate('/register?type=supplier')} className="hover:text-white transition">Become a Supplier</button></li>
                        <li><button onClick={() => onNavigate('/verification')} className="hover:text-white transition">Verification</button></li>
                        <li><button onClick={() => onNavigate('/logistics')} className="hover:text-white transition">Logistics</button></li>
                        <li><button onClick={() => onNavigate('/trade-assurance')} className="hover:text-white transition">Trade Assurance</button></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-semibold mb-4">Support</h4>
                    <ul className="space-y-2 text-white/60">
                        <li><button onClick={() => onNavigate('/help')} className="hover:text-white transition">Help Center</button></li>
                        <li><button onClick={() => onNavigate('/contact')} className="hover:text-white transition">Contact Us</button></li>
                        <li><button onClick={() => onNavigate('/disputes')} className="hover:text-white transition">Dispute Resolution</button></li>
                        <li><button onClick={() => onNavigate('/safety')} className="hover:text-white transition">Safety & Trust</button></li>
                    </ul>
                </div>
            </div>

            <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-white/40 text-sm">© 2026 OUROZ. All rights reserved. Made in Morocco 🇲🇦</p>
                <div className="flex gap-6 text-white/40 text-sm">
                    <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition">Privacy</button>
                    <button onClick={() => onNavigate('/terms')} className="hover:text-white transition">Terms</button>
                    <button onClick={() => onNavigate('/cookies')} className="hover:text-white transition">Cookies</button>
                </div>
            </div>
        </div>
    </footer>
);

export default LandingPage;
