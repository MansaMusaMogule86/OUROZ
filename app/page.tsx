/**
 * OUROZ – Homepage / Landing Page
 * Redesigned with minimalist luxury aesthetic – centered editorial layout,
 * Amazigh ⵣ symbol, serif typography, and premium spacing.
 */

import Link from 'next/link';
import { cookies } from 'next/headers';
import { fetchCategories, fetchBrands } from '@/lib/api';
import type { LangCode } from '@/types/shop';
import CategoryShowcase from '@/components/shop/CategoryShowcase';

export const revalidate = 60;

export default async function HomePage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const [categories, brands] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
    ]);

    const topCategories = categories.slice(0, 6);
    const topBrands = brands.filter(b => b.logo_url).slice(0, 8);

    const t = {
        hero: {
            en: 'Authentic Moroccan Products, Delivered in Dubai',
            ar: 'منتجات مغربية أصيلة، توصيل في دبي',
            fr: 'Produits Marocains Authentiques, Livrés à Dubaï',
        },
        sub: {
            en: 'From the souks of Morocco to your doorstep. Fresh spices, artisan goods, and traditional delicacies.',
            ar: 'من أسواق المغرب إلى بابك. توابل طازجة وحرف يدوية وأطباق تقليدية.',
            fr: 'Des souks du Maroc à votre porte. Épices fraîches, artisanat et délices traditionnels.',
        },
        shopNow: { en: 'Shop Now', ar: 'تسوق الآن', fr: 'Acheter' },
        supplier: { en: 'Become a Supplier', ar: 'كن مورداً', fr: 'Devenir Fournisseur' },
        wholesale: { en: 'Wholesale Pricing', ar: 'أسعار الجملة', fr: 'Prix de Gros' },
        categories: { en: 'Shop by Category', ar: 'تسوق حسب الفئة', fr: 'Par Catégorie' },
        brands: { en: 'Our Brands', ar: 'علاماتنا التجارية', fr: 'Nos Marques' },
        why: { en: 'Why OUROZ?', ar: 'لماذا أوروز؟', fr: 'Pourquoi OUROZ ?' },
    };

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            {/* ── Navbar ─────────────────────────────────────────────── */}
            <header className="sticky top-0 z-30 bg-[var(--color-sahara)]/90 backdrop-blur-xl border-b border-[var(--color-charcoal)]/[0.04]">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 h-[72px] flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-[var(--color-gold)]/10 flex items-center justify-center transition-shadow group-hover:shadow-md">
                            <span className="text-xl font-serif" style={{
                                background: 'linear-gradient(180deg, #C85A5A 0%, #8B1A4A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>ⵣ</span>
                        </div>
                        <span className="text-lg font-serif tracking-[0.15em] uppercase text-[var(--color-charcoal)] hidden sm:block" style={{ fontWeight: 300 }}>OUROZ</span>
                    </Link>

                    {/* Center Nav Links */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/shop" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/70 hover:text-[var(--color-charcoal)] transition-colors">
                            Shop Now
                        </Link>
                        <Link href="/business/apply" className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)]/70 transition-colors">
                            Wholesale Pricing
                        </Link>

                        <div className="h-5 w-px bg-[var(--color-charcoal)]/[0.06]"></div>

                        {/* Sign In */}
                        <Link href="/auth/login" className="px-6 py-2 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] bg-[var(--color-charcoal)] text-[var(--color-sahara)] shadow-sm hover:bg-[var(--color-charcoal)]/90 transition-all">
                            Sign In
                        </Link>
                    </nav>

                    {/* Right - User area */}
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-[10px] font-bold text-[var(--color-charcoal)] uppercase tracking-[0.2em] leading-none">Artisan Curator</p>
                            <p className="text-[8px] font-medium uppercase tracking-[0.25em] mt-1 text-[var(--color-gold)]/50">Guest</p>
                        </div>
                        <Link href="/auth/login" className="w-10 h-10 rounded-full bg-white border border-[var(--color-charcoal)]/[0.06] flex items-center justify-center text-xs font-serif text-[var(--color-charcoal)]/50 shadow-sm hover:shadow-md hover:border-[var(--color-gold)]/30 transition-all">
                            A
                        </Link>
                    </div>
                </div>
            </header>

            {/* ── Hero ────────────────────────────────────────────────── */}
            <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-6">
                {/* Centered Amazigh Logo */}
                <div className="flex justify-center mb-8">
                    <div className="relative group">
                        {/* Shimmer ring */}
                        <div className="absolute -inset-8 rounded-full opacity-20 blur-xl pointer-events-none" style={{
                            background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent 30%, transparent 100%)',
                            animation: 'spin 8s linear infinite',
                        }}></div>

                        {/* Logo Circle */}
                        <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-full bg-gradient-to-b from-white/90 to-white/50 flex items-center justify-center border border-[var(--color-gold)]/[0.08]" style={{
                            boxShadow: '0 25px 80px -15px rgba(0,0,0,0.06)',
                        }}>
                            <span className="text-[5.5rem] md:text-[6.5rem] leading-none select-none font-serif" style={{
                                background: 'linear-gradient(180deg, #C85A5A 0%, #A63D3D 40%, #8B1A4A 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}>ⵣ</span>
                        </div>
                    </div>
                </div>

                {/* Brand Title */}
                <h1 className="text-7xl md:text-[11rem] font-serif text-[var(--color-charcoal)] leading-[0.8] tracking-[-0.04em] text-center mb-4" style={{ fontWeight: 300 }}>
                    OUROZ
                </h1>
                <p className="text-base md:text-lg font-serif italic tracking-[0.25em] uppercase text-center mb-10" style={{ color: 'rgba(212, 175, 55, 0.55)', fontWeight: 300 }}>
                    The Amazigh Source
                </p>

                {/* Tagline from original */}
                <div className="max-w-2xl text-center mb-10">
                    <h2 className="text-xl md:text-3xl font-serif text-[var(--color-charcoal)]/70 leading-snug tracking-wide mb-4" style={{ fontWeight: 300 }}>
                        {t.hero[lang]}
                    </h2>
                    <p className="text-sm md:text-base text-[var(--color-charcoal)]/35 leading-relaxed" style={{ fontWeight: 300 }}>
                        {t.sub[lang]}
                    </p>
                </div>

                {/* CTA Buttons - editorial style */}
                <div className="flex flex-col sm:flex-row gap-5 justify-center w-full max-w-lg mb-14">
                    <Link href="/shop"
                        className="flex-1 py-4 px-8 border-2 border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)] rounded-full text-center font-sans font-bold text-[10px] uppercase tracking-[0.35em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] hover:border-[var(--color-charcoal)] transition-all duration-500">
                        {t.shopNow[lang]}
                    </Link>
                    <Link href="/wholesale/apply"
                        className="flex-1 py-4 px-8 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full text-center font-sans font-bold text-[10px] uppercase tracking-[0.35em] hover:bg-[var(--color-charcoal)]/90 hover:shadow-xl transition-all duration-500">
                        {t.wholesale[lang]}
                    </Link>
                </div>

                {/* Bottom Labels */}
                <div className="flex gap-8 md:gap-14 justify-center flex-wrap">
                    <span className="text-[9px] font-bold uppercase tracking-[0.35em] pb-1.5 border-b border-[var(--color-gold)]/15" style={{ color: 'rgba(212, 175, 55, 0.35)' }}>Verified Lineage</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.35em] pb-1.5 border-b border-[var(--color-gold)]/15" style={{ color: 'rgba(212, 175, 55, 0.35)' }}>Direct Logistics</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.35em] pb-1.5 border-b border-[var(--color-gold)]/15" style={{ color: 'rgba(212, 175, 55, 0.35)' }}>Sourcing Branding</span>
                </div>
            </section>

            {/* ── Categories — Premium Editorial Showcase ─────────── */}
            <CategoryShowcase title={t.categories[lang]} />

            {/* ── Why OUROZ ───────────────────────────────────────────── */}
            <section className="py-20">
                <div className="max-w-6xl mx-auto px-6 sm:px-10">
                    <h2 className="text-2xl md:text-4xl font-serif text-[var(--color-charcoal)] mb-3 text-center" style={{ fontWeight: 300, letterSpacing: '0.08em' }}>
                        {t.why[lang]}
                    </h2>
                    <div className="w-12 h-px bg-[var(--color-gold)]/25 mx-auto mb-14"></div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {[
                            { icon: '🌿', title: 'Direct from Morocco', desc: 'Sourced directly from Moroccan artisans and cooperatives, ensuring authenticity and fair trade.' },
                            { icon: '🚚', title: 'Fast Dubai Delivery', desc: 'Same-day and next-day delivery across all Emirates. Fresh products guaranteed.' },
                            { icon: '💎', title: 'Wholesale & Retail', desc: 'Competitive pricing for businesses. Tiered wholesale rates with credit terms for approved accounts.' },
                        ].map(card => (
                            <div key={card.title} className="group text-center p-10 rounded-[2rem] bg-white/30 border border-[var(--color-charcoal)]/[0.04] hover:border-[var(--color-gold)]/20 transition-all duration-700 hover:-translate-y-2 hover:shadow-lg">
                                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[var(--color-sahara)] border border-[var(--color-gold)]/10 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-500">
                                    {card.icon}
                                </div>
                                <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-[var(--color-charcoal)] mb-3">{card.title}</h3>
                                <p className="text-sm text-[var(--color-charcoal)]/35 leading-relaxed" style={{ fontWeight: 300 }}>{card.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Brands ──────────────────────────────────────────────── */}
            {topBrands.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 sm:px-10 py-16">
                    <h2 className="text-2xl md:text-4xl font-serif text-[var(--color-charcoal)] mb-3 text-center" style={{ fontWeight: 300, letterSpacing: '0.08em' }}>
                        {t.brands[lang]}
                    </h2>
                    <div className="w-12 h-px bg-[var(--color-gold)]/25 mx-auto mb-10"></div>
                    <div className="flex flex-wrap justify-center gap-10 items-center">
                        {topBrands.map(brand => (
                            <div key={brand.id} className="w-24 h-16 flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-500">
                                {brand.logo_url ? (
                                    <img src={brand.logo_url} alt={brand.name} className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-charcoal)]/30">{brand.name}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* ── CTA Banner ──────────────────────────────────────────── */}
            <section className="py-20">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-5xl font-serif text-[var(--color-charcoal)] mb-5" style={{ fontWeight: 300, letterSpacing: '0.05em' }}>
                        Ready to explore?
                    </h2>
                    <p className="text-sm text-[var(--color-charcoal)]/35 mb-10 max-w-lg mx-auto" style={{ fontWeight: 300, lineHeight: 1.8 }}>
                        Browse hundreds of authentic Moroccan products, from spices to skincare.
                    </p>
                    <Link href="/shop"
                        className="inline-block px-12 py-4 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full font-bold text-[10px] uppercase tracking-[0.35em] hover:bg-[var(--color-charcoal)]/90 hover:shadow-xl transition-all duration-500">
                        {t.shopNow[lang]}
                    </Link>
                </div>
            </section>

            {/* ── Footer ──────────────────────────────────────────────── */}
            <footer className="bg-[var(--color-charcoal)] text-white/40 py-16">
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
                        <div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                                    <span className="text-lg font-serif text-[var(--color-gold)]/60">ⵣ</span>
                                </div>
                                <span className="text-base font-serif tracking-[0.15em] uppercase text-white/70" style={{ fontWeight: 300 }}>OUROZ</span>
                            </div>
                            <p className="text-xs leading-relaxed text-white/30">Authentic Moroccan products, delivered to your door in the UAE.</p>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">Shop</h4>
                            <ul className="space-y-2.5 text-xs">
                                <li><Link href="/shop" className="hover:text-white/70 transition-colors">All Products</Link></li>
                                <li><Link href="/wholesale/apply" className="hover:text-white/70 transition-colors">Wholesale</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">Sell</h4>
                            <ul className="space-y-2.5 text-xs">
                                <li><Link href="/supplier/register" className="hover:text-white/70 transition-colors">Become a Supplier</Link></li>
                                <li><Link href="/supplier/dashboard" className="hover:text-white/70 transition-colors">Supplier Portal</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60 mb-4">Account</h4>
                            <ul className="space-y-2.5 text-xs">
                                <li><Link href="/auth/login" className="hover:text-white/70 transition-colors">Sign In</Link></li>
                                <li><Link href="/auth/signup" className="hover:text-white/70 transition-colors">Create Account</Link></li>
                                <li><Link href="/account" className="hover:text-white/70 transition-colors">My Account</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-white/[0.06] pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/20">
                        <p>&copy; {new Date().getFullYear()} OUROZ. All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {/* ── Floating AMUD Vault ──────────────────────────────────── */}
            <div className="fixed bottom-10 right-10 z-50 flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-white/60 backdrop-blur-xl border border-[var(--color-gold)]/15 flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-500 cursor-pointer" style={{
                    boxShadow: '0 20px 50px -10px rgba(0,0,0,0.08)',
                }}>
                    <span className="text-2xl font-serif" style={{
                        background: 'linear-gradient(135deg, #D4AF37, #3B49AD, #D4AF37)',
                        backgroundSize: '300% 300%',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        animation: 'shimmer 3s infinite linear',
                    }}>ⵣ</span>
                </div>
                <span className="text-[8px] font-bold uppercase tracking-[0.35em]" style={{ color: 'rgba(212, 175, 55, 0.4)' }}>Amud Vault</span>
            </div>
        </div>
    );
}
