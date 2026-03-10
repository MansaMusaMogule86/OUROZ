'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Truck, ShieldCheck, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/shop/ProductCard';

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

export default function HomeClient({ featuredProducts }: Props) {
    return (
        <>
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

                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10 pt-16">
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
                            <Link href="/suppliers" className="px-8 py-3 border border-[#2C2B29]/20 text-[#2C2B29] text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-[#2C2B29]/5 transition-colors duration-300">
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
            {/* Featured Products — Premium desert background with upgraded cards */}
            <section className="relative py-32 sm:py-48 overflow-hidden">
                {/* Sahara Sand Dunes Image Background */}
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/images/sand-dunes.png"
                        alt="Sahara Sand"
                        fill
                        className="object-cover"
                        priority
                    />
                    {/* Cinematic overlays to integrate with page */}
                    <div className="absolute inset-0 bg-gradient-to-b from-[#EDE5D4] via-transparent to-[#EDE5D4]/20" />
                    <div className="absolute inset-x-0 bottom-0 h-96 bg-gradient-to-t from-[#EDE5D4] to-transparent" />
                </div>

                {/* Left arch decorative element — matching screenshot */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-32 h-[500px] opacity-[0.15] pointer-events-none hidden lg:block z-10">
                    <div className="w-full h-full bg-[#A88B67]/20 border-r border-[#A88B67]/20" style={{ borderTopRightRadius: '250px 150px' }} />
                </div>

                <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10 text-center">
                    <div className="mb-24">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="text-5xl md:text-6xl font-serif text-[var(--color-charcoal)] mb-6 tracking-tight font-normal"
                        >
                            Featured Products
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-[13px] text-[var(--color-charcoal)]/50 max-w-2xl mx-auto leading-relaxed uppercase tracking-[0.2em]"
                        >
                            Traditional Moroccan provisions — spices, oils, teas, and artisan goods sourced directly from cooperatives and family producers across.
                        </motion.p>
                    </div>

                    <div className="flex flex-nowrap overflow-x-auto pb-10 gap-6 sm:gap-8 justify-start lg:justify-center px-4 snap-x scrollbar-hide">
                        {featuredProducts.map((prod, i) => (
                            <motion.div
                                key={prod.id}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8, ease: "easeOut" }}
                                className="min-w-[280px] sm:min-w-[320px] h-[520px] flex-shrink-0 snap-center"
                            >
                                <ProductCard
                                    product={{
                                        id: prod.id,
                                        slug: prod.slug,
                                        name: prod.name,
                                        short_description: null,
                                        primary_image: prod.image,
                                        brand_name: 'OUROZ',
                                        category_name: null,
                                        base_price: prod.price,
                                        compare_price: null,
                                        currency: 'AED',
                                        weight_label: null,
                                        is_wholesale_enabled: false,
                                        lowest_wholesale_price: null,
                                        stock_status: 'in_stock'
                                    }}
                                    mode="retail"
                                />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Explore by Category — Seamlessly integrated with same theme */}
            <section className="relative py-24 sm:py-32 bg-[#EDE5D4]">
                <div className="max-w-7xl mx-auto px-5 sm:px-10 text-center relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-5xl md:text-6xl font-serif text-[var(--color-charcoal)] mb-6 tracking-tight font-normal"
                    >
                        Explore by Category
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="text-[13px] text-[var(--color-charcoal)]/50 max-w-xl mx-auto mb-20 leading-relaxed uppercase tracking-[0.2em]"
                    >
                        Discover authentic Moroccan spices, oils, teas, and artisan goods.
                    </motion.p>

                    <div className="flex flex-nowrap overflow-x-auto pb-10 gap-6 sm:gap-8 justify-start lg:justify-center px-4 snap-x scrollbar-hide">
                        {CATEGORIES.map((cat, i) => (
                            <motion.div
                                key={cat.label}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 snap-center"
                            >
                                <Link href={`/shop?categoryId=${cat.slug}`} className="group block">
                                    <div className="relative aspect-[3/4.5] rounded-[2.5rem] overflow-hidden border border-white/20 shadow-2xl bg-white/5 backdrop-blur-md">
                                        <Image
                                            src={cat.img}
                                            alt={cat.label}
                                            fill
                                            className="object-cover scale-110 group-hover:scale-125 transition-transform duration-1000 opacity-80 group-hover:opacity-100"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
                                        <div className="absolute bottom-8 left-0 right-0 text-center z-20 px-4">
                                            <h3 className="text-white font-serif text-2xl tracking-wide drop-shadow-lg mb-2">{cat.label}</h3>
                                            <p className="text-white/50 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-opacity duration-500">View Collection</p>
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
                        transition={{ duration: 1, delay: 0.4 }}
                        className="text-[11px] text-[var(--color-charcoal)]/40 mt-16 max-w-lg mx-auto leading-relaxed uppercase tracking-[0.2em]"
                    >
                        Directly sourced from Moroccan cooperatives. Trusted supply for Dubai homes and restaurants.
                    </motion.p>
                </div>
            </section>

            {/* ═══════════════════════════════════════════════════════════
                SECTION 5 — Brand Benefits Card Section (Shipping & Trust)
                3 Glassmorphic Cards following the editorial portrait style
            ═══════════════════════════════════════════════════════════ */}
            <section className="relative py-24 sm:py-32 bg-[#EDE5D4] overflow-hidden">
                {/* Subtle grainy texture overlay */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/paper-fibers.png")' }} />

                <div className="max-w-7xl mx-auto px-5 sm:px-10 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Express Delivery",
                                subtitle: "Across Dubai & UAE",
                                desc: "Temperature-controlled logistics ensuring your provisions arrive as fresh as they left the Atlas.",
                                icon: <Truck className="w-10 h-10 text-[#C88A58]" strokeWidth={1} />,
                                label: "Same Day Shipping"
                            },
                            {
                                title: "Direct Sourcing",
                                subtitle: "Ethical & Authentic",
                                desc: "We skip the middlemen, working directly with women-led cooperatives and family producers in Morocco.",
                                icon: <ShieldCheck className="w-10 h-10 text-[#6A7A60]" strokeWidth={1} />,
                                label: "Verified Origin"
                            },
                            {
                                title: "Wholesale Ready",
                                subtitle: "For Professional Kitchens",
                                desc: "Flexible bulk supply with dedicated account management for Dubai's leading restaurants and cafes.",
                                icon: <ShoppingBag className="w-10 h-10 text-[#913023]" strokeWidth={1} />,
                                label: "B2B Solutions"
                            }
                        ].map((benefit, i) => (
                            <motion.div
                                key={benefit.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.8 }}
                                className="group relative"
                            >
                                <div className="flex flex-col h-[480px] bg-white/10 backdrop-blur-[20px] rounded-[2.5rem] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.05)] transition-all duration-500 hover:bg-white/20 px-8 py-10">
                                    {/* Icon Area */}
                                    <div className="mb-10 w-20 h-20 rounded-3xl bg-white/30 flex items-center justify-center shadow-inner relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                                        {benefit.icon}
                                    </div>

                                    {/* Divider */}
                                    <div className="h-[1px] w-full bg-[var(--color-charcoal)]/10 mb-8" />

                                    {/* Content */}
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-serif text-[var(--color-charcoal)] mb-1 leading-tight">
                                            {benefit.title}
                                        </h3>
                                        <p className="text-[10px] text-[var(--color-charcoal)]/40 uppercase tracking-[0.2em] font-medium mb-6">
                                            {benefit.subtitle}
                                        </p>
                                        <p className="text-sm text-[var(--color-charcoal)]/60 leading-relaxed font-light">
                                            {benefit.desc}
                                        </p>
                                    </div>

                                    {/* Bottom Detail */}
                                    <div className="mt-8 flex items-center justify-between">
                                        <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-charcoal)]/30">
                                            {benefit.label}
                                        </span>
                                        <div className="flex items-center justify-center h-8 px-4 bg-white/20 rounded-full border border-white/30 text-[10px] font-serif text-[var(--color-charcoal)]/40">
                                            ⵣ OUROZ
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
