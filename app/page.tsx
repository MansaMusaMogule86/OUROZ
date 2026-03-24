/**
 * OUROZ – Homepage
 * 4 sections matching reference screenshots:
 *   1. Hero – centered ⵣ, "MOROCCAN PROVISIONS FROM THE ATLAS"
 *   2. Explore by Category – 6 glassmorphism cards, 3×2 grid
 *   3. Atlas hero – "From the Atlas, to your table." with floating product cards
 *   4. Featured Products – horizontal scrolling strip
 *   5. Footer
 * Decorative background: arch, watermark, grain, dunes via OurozBackground
 */

import Link from 'next/link';
import OurozHeader from '@/components/shared/OurozHeader';
import OurozBackground from '@/components/shared/OurozBackground';
import CategoryShowcase from '@/components/shop/CategoryShowcase';

const FEATURED_PRODUCTS = [
  { id: '1', name: 'Premium Saffron', origin: 'Taliouine', price: 199, image: '/images/products/saffron.jpg' },
  { id: '2', name: 'Argan Oil', origin: 'Essaouira', price: 149, image: '/images/products/argan-oil.jpg' },
  { id: '3', name: 'Ras el Hanout', origin: 'Fez', price: 89, image: '/images/products/spice-mix.jpg' },
  { id: '4', name: 'Tagine Pot', origin: 'Safi', price: 159, image: '/images/products/tagine.jpg' },
  { id: '5', name: 'Handcrafted Saffron', origin: 'Atlas', price: 225, image: '/images/products/saffron-craft.jpg' },
  { id: '6', name: 'Olive Oil', origin: 'Meknes', price: 119, image: '/images/products/olive-oil.jpg' },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
      {/* Decorative background layers */}
      <OurozBackground showArch showWatermark showDunes />

      {/* Header */}
      <OurozHeader />

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 1 — Hero: centered ⵣ + brand name + tagline
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-[85vh] px-6 pt-8">
        {/* ⵣ symbol in circle */}
        <div className="relative mb-6">
          {/* Subtle glow ring */}
          <div
            className="absolute -inset-6 rounded-full opacity-15 blur-xl pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, transparent, #D4AF37, transparent 30%, transparent 100%)',
              animation: 'spin-slow 10s linear infinite',
            }}
          />
          <div
            className="relative w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-b from-white/80 to-white/40 flex items-center justify-center border border-[var(--color-gold)]/[0.08]"
            style={{ boxShadow: '0 20px 60px -12px rgba(0,0,0,0.06)' }}
          >
            <span
              className="text-[5rem] md:text-[6rem] leading-none select-none font-heading"
              style={{
                background: 'linear-gradient(180deg, #C85A5A 0%, #A63D3D 40%, #8B1A4A 100%)',
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
          className="text-6xl md:text-[10rem] font-heading text-[var(--color-charcoal)] leading-[0.85] tracking-[-0.03em] text-center mb-3"
          style={{ fontWeight: 300 }}
        >
          OUROZ
        </h1>

        {/* Subtitle */}
        <p
          className="text-sm md:text-base font-heading italic tracking-[0.25em] uppercase text-center mb-8"
          style={{ color: 'rgba(212, 175, 55, 0.5)', fontWeight: 300 }}
        >
          The Amazigh Source
        </p>

        {/* Main tagline */}
        <h2
          className="text-lg md:text-2xl font-heading text-[var(--color-charcoal)]/60 leading-relaxed tracking-wide text-center max-w-xl mb-4"
          style={{ fontWeight: 300 }}
        >
          MOROCCAN PROVISIONS FROM THE ATLAS
        </h2>
        <p
          className="text-xs md:text-sm text-[var(--color-charcoal)]/30 text-center max-w-md leading-relaxed mb-10"
          style={{ fontWeight: 400 }}
        >
          Premium spices, oils, teas, and artisan goods sourced directly from cooperatives and family producers across Morocco.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-12">
          <Link
            href="/shop"
            className="flex-1 py-3.5 px-8 border-2 border-[var(--color-charcoal)]/12 text-[var(--color-charcoal)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] hover:border-[var(--color-charcoal)] transition-all duration-500"
          >
            Shop Now
          </Link>
          <Link
            href="/wholesale/apply"
            className="flex-1 py-3.5 px-8 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full text-center font-body font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--color-charcoal)]/85 transition-all duration-500"
          >
            Wholesale Pricing
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex gap-8 md:gap-12 justify-center flex-wrap">
          {['Verified Lineage', 'Direct Logistics', 'Sourcing Branding'].map((badge) => (
            <span
              key={badge}
              className="text-[8px] md:text-[9px] font-bold uppercase tracking-[0.3em] pb-1 border-b border-[var(--color-gold)]/12"
              style={{ color: 'rgba(212, 175, 55, 0.35)' }}
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 2 — Explore by Category (6 cards, 3×2 grid)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative z-10">
        <CategoryShowcase />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 3 — "From the Atlas, to your table."
          Split layout: left text, right floating product cards
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-20 lg:py-32">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left: text */}
            <div>
              <p
                className="text-[10px] font-body font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                OUR STORY
              </p>
              <h2
                className="text-4xl lg:text-6xl font-heading text-[var(--color-charcoal)] leading-[1.1] mb-6"
                style={{ fontWeight: 300, letterSpacing: '0.02em' }}
              >
                From the Atlas,
                <br />
                to your table.
              </h2>
              <p
                className="text-sm lg:text-base text-[var(--color-charcoal)]/40 leading-relaxed max-w-md mb-8"
                style={{ fontWeight: 400, lineHeight: 1.8 }}
              >
                Every product in our collection is sourced directly from Moroccan cooperatives and family producers. We preserve authentic methods while ensuring the highest quality reaches your kitchen.
              </p>
              <Link
                href="/about"
                className="inline-block py-3 px-8 border-2 border-[var(--color-charcoal)]/12 text-[var(--color-charcoal)] rounded-full font-body font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--color-charcoal)] hover:text-[var(--color-sahara)] hover:border-[var(--color-charcoal)] transition-all duration-500"
              >
                Learn More
              </Link>
            </div>

            {/* Right: floating product cards in stacked layout */}
            <div className="relative h-[420px] lg:h-[520px]">
              {/* Card 1 — top left */}
              <div
                className="absolute left-0 top-0 w-[200px] lg:w-[240px] rounded-2xl overflow-hidden shadow-xl"
                style={{ animation: 'float 6s ease-in-out infinite' }}
              >
                <div className="aspect-[3/4] bg-[var(--color-sahara-dark)] relative">
                  <img
                    src="/images/products/saffron.jpg"
                    alt="Premium Saffron"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                    <p className="text-white text-sm font-heading" style={{ fontWeight: 500 }}>
                      Premium Saffron
                    </p>
                    <p className="text-white/50 text-xs">Taliouine</p>
                  </div>
                </div>
              </div>

              {/* Card 2 — center right */}
              <div
                className="absolute right-0 top-[60px] lg:top-[40px] w-[200px] lg:w-[240px] rounded-2xl overflow-hidden shadow-xl"
                style={{ animation: 'float 6s ease-in-out infinite 1s' }}
              >
                <div className="aspect-[3/4] bg-[var(--color-sahara-dark)] relative">
                  <img
                    src="/images/products/argan-oil.jpg"
                    alt="Argan Oil"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                    <p className="text-white text-sm font-heading" style={{ fontWeight: 500 }}>
                      Argan Oil
                    </p>
                    <p className="text-white/50 text-xs">Essaouira</p>
                  </div>
                </div>
              </div>

              {/* Card 3 — bottom center */}
              <div
                className="absolute left-[60px] lg:left-[80px] bottom-0 w-[200px] lg:w-[240px] rounded-2xl overflow-hidden shadow-xl"
                style={{ animation: 'float 6s ease-in-out infinite 2s' }}
              >
                <div className="aspect-[3/4] bg-[var(--color-sahara-dark)] relative">
                  <img
                    src="/images/products/tagine.jpg"
                    alt="Tagine Pot"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/40 to-transparent p-4">
                    <p className="text-white text-sm font-heading" style={{ fontWeight: 500 }}>
                      Tagine Pot
                    </p>
                    <p className="text-white/50 text-xs">Safi</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          SECTION 4 — Featured Products – horizontal scroll strip
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 py-16 lg:py-24">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-14 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <p
                className="text-[10px] font-body font-bold uppercase tracking-[0.3em] mb-3"
                style={{ color: 'rgba(212, 175, 55, 0.5)' }}
              >
                HANDPICKED
              </p>
              <h2
                className="text-3xl lg:text-4xl font-heading text-[var(--color-charcoal)]"
                style={{ fontWeight: 300, letterSpacing: '0.04em' }}
              >
                Featured Products
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden sm:block text-[10px] font-body font-bold uppercase tracking-[0.25em] text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)] transition-colors pb-1 border-b border-[var(--color-charcoal)]/10"
            >
              View All
            </Link>
          </div>
        </div>

        {/* Horizontal scroll */}
        <div className="overflow-x-auto scrollbar-hide pb-4">
          <div className="flex gap-5 px-6 lg:px-14 w-max">
            {FEATURED_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="group flex-shrink-0 w-[220px] lg:w-[260px]"
              >
                {/* Image */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--color-sahara-dark)] mb-3 relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                </div>

                {/* Info */}
                <p
                  className="text-sm font-heading text-[var(--color-charcoal)] mb-0.5"
                  style={{ fontWeight: 500 }}
                >
                  {product.name}
                </p>
                <p className="text-[11px] text-[var(--color-charcoal)]/30 font-body mb-1">
                  {product.origin}
                </p>
                <p className="text-sm font-body font-semibold text-[var(--color-charcoal)]">
                  AED {product.price}
                </p>
              </Link>
            ))}
          </div>
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
                <span
                  className="text-sm font-heading tracking-[0.3em] uppercase text-white/60"
                  style={{ fontWeight: 400 }}
                >
                  OUROZ
                </span>
              </div>
              <p className="text-xs leading-relaxed text-white/25" style={{ lineHeight: 1.8 }}>
                Authentic Moroccan products, delivered to your door in the UAE.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
                Shop
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/shop" className="hover:text-white/70 transition-colors">
                    All Products
                  </Link>
                </li>
                <li>
                  <Link href="/wholesale/apply" className="hover:text-white/70 transition-colors">
                    Wholesale
                  </Link>
                </li>
              </ul>
            </div>

            {/* Sell */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
                Sell
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/supplier/register" className="hover:text-white/70 transition-colors">
                    Become a Supplier
                  </Link>
                </li>
                <li>
                  <Link href="/suppliers" className="hover:text-white/70 transition-colors">
                    Supplier Directory
                  </Link>
                </li>
              </ul>
            </div>

            {/* Account */}
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/50 mb-4">
                Account
              </h4>
              <ul className="space-y-2.5 text-xs">
                <li>
                  <Link href="/auth/login" className="hover:text-white/70 transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-white/70 transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/journal" className="hover:text-white/70 transition-colors">
                    Journal
                  </Link>
                </li>
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
