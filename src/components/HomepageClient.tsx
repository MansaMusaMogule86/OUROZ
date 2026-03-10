'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FeaturedProduct {
    id: string;
    name: string;
    slug: string;
    price: number;
    image: string;
}

interface Props {
    featuredProducts: FeaturedProduct[];
}

/* ── Shared animation variants ──────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i: number) => ({
        opacity: 1,
        y: 0,
        transition: { delay: i * 0.1, duration: 0.6, ease: 'easeOut' as const },
    }),
};

const HERO_PRODUCTS = [
    { name: 'Mixed Moroccan Spice', img: 'https://placehold.co/200x200/C88A58/ffffff?text=Pottery', price: 149 },
    { name: 'Traditional Silver Teapot', img: 'https://placehold.co/200x200/6A7A60/ffffff?text=Teapot', price: 149 },
];

const CATEGORIES = [
    { label: 'Spices', img: '/images/categories/spices.jpg', slug: 'spices-herbs' },
    { label: 'Oils', img: '/images/categories/olive-oils.jpg', slug: 'oils-condiments' },
    { label: 'Tea', img: '/images/categories/tea-coffee.jpg', slug: 'tea-drinks' },
    { label: 'Olives', img: '/images/categories/grocery.jpg', slug: 'preserved-foods' },
    { label: 'Ceramics', img: '/images/categories/ceramics.jpg', slug: 'moroccan-ceramics' },
    { label: 'Pantry Goods', img: '/images/categories/patisserie.jpg', slug: 'flour-baking' },
];

export default function HomepageClient({ featuredProducts }: Props) {
    return (
        <>
            {/* ═══════════════════════════════════════════════════════════
                SECTION 1 — Brand Entry Screen
                Centered OUROZ title, ⵣ symbol in glass circle, two CTAs
                Faded Amazigh watermark on right side
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative min-h-screen flex items-center justify-center px-5 sm:px-10 overflow-hidden pt-12">
                {/* Faded Amazigh ⵣ watermark — right side */}
                <div className="absolute top-1/2 -translate-y-1/2 -right-[15%] pointer-events-none select-none opacity-[0.4] mix-blend-multiply">
                    <span className="text-[60vw] font-serif leading-none block" style={{
                        background: 'linear-gradient(135deg, rgba(160,110,80,0.15) 0%, rgba(130,150,110,0.15) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        ⵣ
                    </span>
                </div>

                <motion.div
                    initial="hidden"
                    animate="visible"
                    className="relative z-10 text-center max-w-4xl mx-auto flex flex-col items-center mt-8"
                >
                    {/* Soft glowing circle around symbol */}
                    <div className="absolute top-[20%] left-1/2 -translate-x-1/2 -translate-y-[45%] w-[320px] h-[320px] rounded-full bg-white/40 blur-2xl pointer-events-none z-0" />

                    {/* Symbol */}
                    <motion.div
                        variants={fadeUp}
                        custom={0}
                        className="mb-8 relative z-10 flex items-center justify-center"
                    >
                        <span className="text-[160px] font-serif font-light leading-none" style={{
                            background: 'linear-gradient(180deg, #b07050 0%, #70855c 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            transform: 'scaleY(0.9)',
                        }}>
                            ⵣ
                        </span>
                    </motion.div>

                    {/* Large OUROZ title */}
                    <motion.h1
                        variants={fadeUp}
                        custom={1}
                        className="text-7xl md:text-[6.5rem] font-serif font-medium text-[#1A1A1A] tracking-tight leading-none mb-6 relative z-10"
                        style={{ letterSpacing: '-0.03em' }}
                    >
                        OUROZ
                    </motion.h1>

                    {/* Tagline */}
                    <motion.p
                        variants={fadeUp}
                        custom={2}
                        className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#B08D5B] mb-12 relative z-10"
                    >
                        MOROCCAN PROVISIONS FROM <span className="text-[9px]">THE</span> ATLAS
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        variants={fadeUp}
                        custom={3}
                        className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full relative z-10"
                    >
                        <Link href="/shop" className="w-[200px] flex justify-center py-[18px] bg-[#222222] text-[#f4f0EA] text-[13px] font-medium rounded-[30px] hover:bg-black transition-colors duration-300">
                            Explore Products
                        </Link>
                        <Link href="/supplier/register" className="w-[200px] flex justify-center py-[17px] border border-[#B08D5B] text-[#222222] text-[13px] font-medium rounded-[30px] hover:bg-[#B08D5B]/10 transition-colors duration-300">
                            Supplier Login
                        </Link>
                    </motion.div>
                </motion.div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 2 — Homepage Hero
                Left: Moroccan arch with lantern
                Center: "From the Atlas, to your table." headline + CTAs
                Right: Floating product cards
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 sm:py-32 px-5 sm:px-10 overflow-hidden bg-[#E8DED1]" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
            }}>
                {/* Sand dune gradient at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-[#D5C4B4]/40 to-transparent pointer-events-none" />

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
                    {/* Left: Moroccan arch with lantern */}
                    <motion.div
                        initial={{ opacity: 0, x: -40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="w-full lg:w-1/3 flex justify-center lg:justify-start relative"
                    >
                        <div className="absolute -bottom-10 -left-20 w-[150%] h-[150%] bg-[#D5C4B4]/20 blur-3xl rounded-[100%] z-0 pointer-events-none" />
                        <div
                            className="relative z-10 w-64 h-96 bg-[#F2EBDF] shadow-2xl overflow-hidden border border-white/40"
                            style={{ borderTopLeftRadius: '50% 30%', borderTopRightRadius: '50% 30%' }}
                        >
                            {/* Lantern hanging from top */}
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                                <div className="w-px h-8 bg-[#2A2A2A]/30" />
                                <div className="w-8 h-16 relative">
                                    <svg viewBox="0 0 40 80" fill="none" className="w-full h-full">
                                        <path d="M20 0 L20 10" stroke="#2A2A2A" strokeWidth="1.5" />
                                        <path d="M12 10 Q12 8 20 8 Q28 8 28 10 L28 14 Q28 16 20 16 Q12 16 12 14 Z" fill="#DAA520" opacity="0.8" />
                                        <path d="M10 16 Q10 14 20 14 Q30 14 30 16 L28 55 Q28 60 20 60 Q12 60 12 55 Z" fill="#B8860B" opacity="0.4" />
                                        <path d="M14 20 Q14 18 20 18 Q26 18 26 20 L25 50 Q25 54 20 54 Q15 54 15 50 Z" fill="#FFD700" opacity="0.15" />
                                        <circle cx="20" cy="35" r="3" fill="#DAA520" opacity="0.6" />
                                        <path d="M16 60 Q16 62 20 64 Q24 62 24 60" stroke="#B8860B" strokeWidth="1" fill="none" opacity="0.6" />
                                    </svg>
                                </div>
                            </div>
                            {/* Inner arch shadow for depth */}
                            <div className="absolute inset-0 shadow-[inset_0_20px_40px_rgba(0,0,0,0.05)] border-t border-white/60" />
                            {/* Light glow effect from lantern */}
                            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-32 h-48 bg-[#DAA520]/5 blur-2xl rounded-full pointer-events-none" />
                        </div>
                    </motion.div>

                    {/* Center: Headline & CTAs */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-100px' }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="w-full lg:w-1/3 text-center relative z-20"
                    >
                        <h2 className="text-4xl md:text-5xl lg:text-[3.5rem] font-serif text-[var(--color-charcoal)] leading-[1.1] tracking-tight mb-6" style={{ fontWeight: 400 }}>
                            From the Atlas,<br />to your table.
                        </h2>
                        <p className="text-sm text-[var(--color-charcoal)]/60 leading-[1.8] mb-10 max-w-sm mx-auto">
                            Curated Moroccan provisions — spices, oils, teas, and artisan
                            goods sourced directly from cooperatives and family
                            producers across Morocco.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="/shop" className="px-8 py-3 bg-[#2C2B29] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-colors duration-300">
                                Explore Products
                            </Link>
                            <Link href="/supplier/register" className="px-8 py-3 border border-[#2C2B29]/20 text-[#2C2B29] text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-white/30 transition-colors duration-300">
                                Supplier Login
                            </Link>
                        </div>
                    </motion.div>

                    {/* Right: Floating product cards */}
                    <div className="w-full lg:w-1/3 flex justify-center lg:justify-end gap-4 relative z-20">
                        {HERO_PRODUCTS.map((prod, i) => (
                            <motion.div
                                key={prod.name}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-100px' }}
                                transition={{ delay: 0.3 + i * 0.15, duration: 0.7 }}
                                className={`w-40 sm:w-48 ${i === 0 ? 'translate-y-8' : ''}`}
                                style={{ animation: `cardFloat${i + 1} ${6 + i}s ease-in-out infinite` }}
                            >
                                <div className="bg-white/40 backdrop-blur-md rounded-3xl p-4 border border-white/60 shadow-[0_10px_30px_rgba(168,139,103,0.15)] flex flex-col items-center">
                                    <img src={prod.img} alt={prod.name} className="w-24 h-24 object-contain drop-shadow-xl mb-4 rounded-xl" />
                                    <div className="text-center w-full">
                                        <h3 className="text-[10px] font-serif uppercase tracking-widest text-[#5C554F] mb-1">{prod.name}</h3>
                                        <p className="text-[8px] text-[#A88B67] mb-2">Handcrafted in Morocco</p>
                                        <div className="flex items-center justify-center gap-2">
                                            <span className="text-sm font-serif text-[#2C2B29]">{prod.price} <span className="text-[9px] uppercase">AED</span></span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 3 — Featured Products
                "Featured Products" title, horizontal row of product cards
                on sand dune background. Each card: image, name,
                "Handcrafted in Morocco", price in AED
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 sm:py-32 overflow-hidden bg-[#E8DED1]">
                {/* Sand dune gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#DBCBB7] to-transparent opacity-80 pointer-events-none" />
                {/* Left arch decorative element — matching screenshot */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-20 h-64 opacity-[0.08] pointer-events-none hidden lg:block">
                    <div className="w-full h-full bg-[#A88B67]/20 border-r border-[#A88B67]/10" style={{ borderTopRightRadius: '50% 30%' }} />
                </div>
                {/* Right lantern decorative — matching screenshot */}
                <div className="absolute right-8 top-8 opacity-[0.06] pointer-events-none hidden lg:block">
                    <svg viewBox="0 0 40 80" fill="none" className="w-6 h-12">
                        <path d="M20 0 L20 10" stroke="#2A2A2A" strokeWidth="1.5" />
                        <path d="M10 16 Q10 14 20 14 Q30 14 30 16 L28 55 Q28 60 20 60 Q12 60 12 55 Z" fill="#B8860B" opacity="0.5" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-[var(--color-charcoal)] mb-4 tracking-tight"
                        style={{ fontWeight: 400 }}
                    >
                        Featured Products
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-sm text-[var(--color-charcoal)]/50 max-w-xl mx-auto mb-16 leading-relaxed"
                    >
                        Traditional Moroccan provisions — spices, oils, teas, and artisan goods
                        sourced directly from cooperatives and family producers across.
                    </motion.p>

                    <div className="flex flex-nowrap overflow-x-auto pb-10 gap-4 sm:gap-6 justify-start lg:justify-center px-4 snap-x scrollbar-hide">
                        {featuredProducts.map((prod, i) => (
                            <motion.div
                                key={prod.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="min-w-[170px] sm:min-w-[190px] flex-shrink-0 snap-center"
                            >
                                <Link href={`/shop/${prod.slug}`} className="group block bg-white/30 backdrop-blur-xl border border-white/50 rounded-2xl p-4 shadow-[0_8px_24px_rgba(168,139,103,0.12)] hover:-translate-y-2 transition-transform duration-500 h-full">
                                    <div className="aspect-square flex items-center justify-center mb-5 overflow-hidden rounded-xl">
                                        <img
                                            src={prod.image}
                                            alt={prod.name}
                                            className="w-28 h-28 object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="text-left w-full">
                                        <h3 className="text-xs font-serif text-[var(--color-charcoal)] mb-1 truncate">{prod.name}</h3>
                                        <p className="text-[9px] text-[var(--color-charcoal)]/40 mb-3">Handcrafted in Morocco</p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-base font-serif text-[var(--color-charcoal)]">
                                                {prod.price} <span className="text-[9px] tracking-wider text-[var(--color-charcoal)]/60">AED</span>
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 4 — Explore by Category
                "Explore by Category" title, 6 category cards with images:
                Spices, Oils, Tea, Olives, Ceramics, Pantry Goods
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 sm:py-32 overflow-hidden bg-[#DFCBB7]">
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-sahara)] to-transparent opacity-50 pointer-events-none" />
                {/* Left arch decorative */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-16 h-52 opacity-[0.06] pointer-events-none hidden lg:block">
                    <div className="w-full h-full bg-[#A88B67]/20 border-r border-[#A88B67]/10" style={{ borderTopRightRadius: '50% 30%' }} />
                </div>
                {/* Hanging lantern decoration top-right */}
                <div className="absolute right-12 top-6 opacity-[0.08] pointer-events-none hidden lg:block">
                    <svg viewBox="0 0 40 80" fill="none" className="w-5 h-10">
                        <path d="M20 0 L20 10" stroke="#2A2A2A" strokeWidth="1.5" />
                        <path d="M10 16 Q10 14 20 14 Q30 14 30 16 L28 55 Q28 60 20 60 Q12 60 12 55 Z" fill="#B8860B" opacity="0.5" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10 text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-5xl font-serif text-[var(--color-charcoal)] mb-4 tracking-tight"
                        style={{ fontWeight: 400 }}
                    >
                        Explore by Category
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-sm text-[var(--color-charcoal)]/50 max-w-xl mx-auto mb-16 leading-relaxed"
                    >
                        Discover authentic Moroccan spices, oils, teas, and artisan goods.
                    </motion.p>

                    <div className="flex flex-nowrap overflow-x-auto pb-10 gap-4 sm:gap-6 justify-start lg:justify-center px-4 snap-x scrollbar-hide">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.08, duration: 0.5 }}
                                className="min-w-[150px] sm:min-w-[170px] flex-shrink-0 snap-center"
                            >
                                <Link href={`/shop/${cat.slug}`} className="group block">
                                    <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-white/30 shadow-lg bg-white/20 backdrop-blur-sm">
                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40 z-10" />
                                        <Image
                                            src={cat.img}
                                            alt={cat.label}
                                            fill
                                            sizes="(max-width: 640px) 150px, 170px"
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute bottom-4 left-0 right-0 text-center z-20">
                                            <h3 className="text-white font-serif text-lg tracking-wide drop-shadow-md">{cat.label}</h3>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>

                    {/* Trust line — matches screenshot */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-xs text-[var(--color-charcoal)]/40 mt-6 max-w-lg mx-auto leading-relaxed"
                    >
                        Directly sourced from Moroccan cooperatives. Trusted supply for Dubai homes and restaurants.
                    </motion.p>
                </div>
            </section>
        </>
    );
}
