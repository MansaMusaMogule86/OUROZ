/**
 * OUROZ – Homepage
 * Section order matching reference screenshots:
 *   1. Brand Entry  — centered ⵣ + OUROZ + tagline + CTAs
 *   2. Atlas Hero   — "From the Atlas, to your table." + floating product cards
 *   3. Categories   — horizontal scroll of portrait cards
 *   4. Featured     — horizontal scroll of light product cards
 *   5. Footer
 */

import Link from 'next/link';
import OurozHeader from '@/components/shared/OurozHeader';
import OurozBackground from '@/components/shared/OurozBackground';
import CategoryShowcase from '@/components/shop/CategoryShowcase';

const ATLAS_CARDS = [
  { id: '1', name: 'Royal Moroccan Tea', subtitle: 'Handcrafted in Morocco', price: 149, compare: 399, image: '/images/products/moroccan-tea.jpg' },
  { id: '2', name: 'Traditional Silver Teapot', subtitle: 'Handcrafted in Morocco', price: 149, compare: 349, image: '/images/products/silver-teapot.jpg' },
];

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Moroccan Argan',         price: 159, compare: 349, image: '/images/products/argan-tagine.jpg' },
  { id: '2', name: 'Moroccan Argan Oil',      price: 149, compare: 349, image: '/images/products/argan-oil.jpg' },
  { id: '3', name: 'Premium Saffron',         price: 199, compare: 349, image: '/images/products/saffron.jpg' },
  { id: '4', name: 'Handmade Argan Oil',      price: 299, compare: 349, image: '/images/products/argan-craft.jpg' },
  { id: '5', name: 'Handmade Saffron',        price: 225, compare: 349, image: '/images/products/saffron-craft.jpg' },
  { id: '6', name: 'Moroccan Spice Jute',     price: 149, compare: 349, image: '/images/products/spice-jute.jpg' },
];

/* ── Reusable light glass card used in both hero and featured strip ── */
function LightCard({
  image, name, subtitle, price, compare, href,
}: {
  image: string; name: string; subtitle?: string;
  price: number; compare?: number; href: string;
}) {
  return (
    <Link href={href} className="group block flex-shrink-0">
      <div
        className="rounded-2xl overflow-hidden flex flex-col aspect-[3/4]"
        style={{
          background: 'rgba(253,248,240,0.68)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 4px 24px rgba(42,32,22,0.09)',
        }}
      >
        {/* Image — flex-1 so it takes remaining space above the info panel */}
        <div className="flex-1 flex items-center justify-center px-5 pt-5 pb-2 min-h-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
            style={{ filter: 'drop-shadow(0 8px 18px rgba(42,32,22,0.13))' }}
            onError={(e) => { (e.target as HTMLImageElement).style.opacity = '0'; }}
          />
        </div>
        {/* Info */}
        <div
          className="px-4 pb-4 pt-3 shrink-0"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(253,248,240,0.82)',
          }}
        >
          <p
            className="font-heading text-[var(--color-charcoal)] leading-snug line-clamp-1 mb-0.5"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            {name}
          </p>
          {subtitle && (
            <p
              className="font-body mb-1.5"
              style={{ fontSize: 10, color: 'rgba(42,32,22,0.38)', letterSpacing: '0.02em' }}
            >
              {subtitle}
            </p>
          )}
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="font-body font-bold" style={{ fontSize: 14, color: 'var(--color-charcoal)' }}>
              {price}
            </span>
            <span className="font-body" style={{ fontSize: 10, color: 'rgba(42,32,22,0.45)' }}>
              AED
            </span>
            {compare && compare > price && (
              <span className="font-body line-through" style={{ fontSize: 10, color: 'rgba(42,32,22,0.28)' }}>
                {compare}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">

      {/* Decorative background layers */}
      <OurozBackground showArch showWatermark showDunes />

      {/* Header */}
      <OurozHeader />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — Brand Entry
          Centered ⵣ symbol, OUROZ wordmark, tagline, CTAs
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[88vh] px-6 pt-8">

        {/* ⵣ symbol in glowing circle */}
        <div className="relative mb-6">
          <div
            className="absolute -inset-6 rounded-full opacity-15 blur-xl pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent 30%, transparent 100%)',
              animation: 'spin-slow 10s linear infinite',
            }}
          />
          <div
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(160deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.45) 100%)',
              boxShadow: '0 20px 60px -12px rgba(42,32,22,0.10)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <span
              className="text-[5rem] md:text-[6rem] leading-none select-none font-heading"
              style={{
                background: 'linear-gradient(160deg, #C85A5A 0%, #A63D3D 40%, #C9A84C 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              &#11581;
            </span>
          </div>
        </div>

        {/* OUROZ wordmark */}
        <h1
          className="font-heading text-[var(--color-charcoal)] text-center leading-none tracking-[-0.02em] mb-4"
          style={{ fontSize: 'clamp(4rem, 12vw, 9rem)', fontWeight: 700 }}
        >
          OUROZ
        </h1>

        {/* Tagline */}
        <p
          className="font-body text-center uppercase tracking-[0.28em] mb-10"
          style={{ fontSize: '0.7rem', color: 'rgba(201,168,76,0.75)', fontWeight: 600 }}
        >
          Moroccan Provisions from{' '}
          <span style={{ fontSize: '0.6rem', textTransform: 'lowercase', letterSpacing: '0.1em' }}>
            the
          </span>{' '}
          Atlas
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center w-full max-w-xs">
          <Link
            href="/shop"
            className="flex-1 py-3.5 px-7 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)]/85 transition-all duration-400"
          >
            Explore Products
          </Link>
          <Link
            href="/auth/login"
            className="flex-1 py-3.5 px-7 border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] hover:border-[var(--color-charcoal)] transition-all duration-400"
          >
            Supplier Login
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — "From the Atlas, to your table."
          Left: text + CTAs | Right: 2 floating product cards
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — text */}
            <div>
              <h2
                className="font-heading text-[var(--color-charcoal)] leading-[1.08] mb-6"
                style={{ fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 400, letterSpacing: '0.01em' }}
              >
                From the Atlas,
                <br />
                to your table.
              </h2>
              <p
                className="font-body text-sm lg:text-base mb-8 max-w-md"
                style={{ color: 'rgba(42,32,22,0.44)', lineHeight: 1.85, fontWeight: 400 }}
              >
                Curated Moroccan provisions—spices, oils, teas, and artisan goods sourced directly from cooperatives and family producers across Morocco.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full max-w-xs">
                <Link
                  href="/shop"
                  className="flex-1 py-3 px-7 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)]/85 transition-all duration-400"
                >
                  Explore Products
                </Link>
                <Link
                  href="/auth/login"
                  className="flex-1 py-3 px-7 border border-[var(--color-charcoal)]/20 text-[var(--color-charcoal)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] transition-all duration-400"
                >
                  Supplier Login
                </Link>
              </div>
            </div>

            {/* Right — 2 floating product cards */}
            <div className="flex gap-4 justify-center lg:justify-end items-start pt-6 lg:pt-0">
              <div className="w-[150px] lg:w-[175px] animate-float mt-8">
                <LightCard
                  href="/shop"
                  image={ATLAS_CARDS[0].image}
                  name={ATLAS_CARDS[0].name}
                  subtitle={ATLAS_CARDS[0].subtitle}
                  price={ATLAS_CARDS[0].price}
                  compare={ATLAS_CARDS[0].compare}
                />
              </div>
              <div className="w-[150px] lg:w-[175px]" style={{ animation: 'float 6s ease-in-out infinite 1.2s' }}>
                <LightCard
                  href="/shop"
                  image={ATLAS_CARDS[1].image}
                  name={ATLAS_CARDS[1].name}
                  subtitle={ATLAS_CARDS[1].subtitle}
                  price={ATLAS_CARDS[1].price}
                  compare={ATLAS_CARDS[1].compare}
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — Explore by Category
          Horizontal scroll of light portrait category cards
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <CategoryShowcase />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — Featured Products
          Horizontal scroll of light glass product cards
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 lg:py-24">

        {/* Heading */}
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 mb-10">
          <div className="text-center">
            <h2
              className="font-heading text-[var(--color-charcoal)] mb-3"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)', fontWeight: 300 }}
            >
              Featured Products
            </h2>
            <p
              className="font-body text-sm max-w-md mx-auto"
              style={{ color: 'rgba(42,32,22,0.42)', lineHeight: 1.75 }}
            >
              Handpicked Moroccan provisions—spices, oils, teas, and artisan goods sourced
              directly from cooperatives and family producers across Morocco.
            </p>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide">
          <div className="flex gap-4 px-6 lg:px-14 pb-2" style={{ width: 'max-content' }}>
            {FEATURED_PRODUCTS.map((p) => (
              <div key={p.id} className="w-[180px] lg:w-[210px]">
                <LightCard
                  href={`/product/${p.id}`}
                  image={p.image}
                  name={p.name}
                  subtitle="Handcrafted in Morocco"
                  price={p.price}
                  compare={p.compare}
                />
              </div>
            ))}
          </div>
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link
            href="/shop"
            className="inline-block py-3 px-8 border border-[var(--color-charcoal)]/18 text-[var(--color-charcoal)] rounded-full font-body font-bold text-[10px] uppercase tracking-[0.25em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] transition-all duration-400"
          >
            View All Products
          </Link>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 bg-[var(--color-charcoal)] text-white/40 py-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center">
                  <span className="text-sm font-heading text-[var(--color-gold)]/50">&#11581;</span>
                </div>
                <span className="text-sm font-heading tracking-[0.3em] uppercase text-white/60" style={{ fontWeight: 400 }}>
                  OUROZ
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/25" style={{ lineHeight: 1.8 }}>
                Authentic Moroccan products, delivered to your door in the UAE.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Shop</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/shop" className="hover:text-white/70 transition-colors">All Products</Link></li>
                <li><Link href="/wholesale/apply" className="hover:text-white/70 transition-colors">Wholesale</Link></li>
              </ul>
            </div>

            {/* Sell */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Sell</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/supplier/register" className="hover:text-white/70 transition-colors">Become a Supplier</Link></li>
                <li><Link href="/suppliers" className="hover:text-white/70 transition-colors">Supplier Directory</Link></li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">Account</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link href="/auth/login" className="hover:text-white/70 transition-colors">Sign In</Link></li>
                <li><Link href="/about" className="hover:text-white/70 transition-colors">About</Link></li>
                <li><Link href="/journal" className="hover:text-white/70 transition-colors">Journal</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/[0.06] pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/15">
            <p>&copy; {new Date().getFullYear()} OUROZ. All rights reserved.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
