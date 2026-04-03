/**
 * ShopPageClient — main /shop page.
 * Shows category hero grid + featured products section.
 * Receives data from server (no fetching here).
 */
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import type { Category, Brand, ProductCard } from '@/types/shop';
import ProductGrid from './ProductGrid';

interface Props {
  categories: Category[];
  brands: Brand[];
  lang: string;
  initialProducts: ProductCard[];
}

export default function ShopPageClient({ categories, lang, initialProducts }: Props) {
  const [search, setSearch] = useState('');

  const featuredProducts = useMemo(() => {
    if (!search.trim()) return initialProducts;
    const q = search.toLowerCase();
    return initialProducts.filter(p => p.name.toLowerCase().includes(q));
  }, [initialProducts, search]);

  const placeholder = lang === 'ar' ? 'ابحث عن منتج…'
                    : lang === 'fr' ? 'Rechercher un produit…'
                    : 'Search products…';

  return (
    <div className="space-y-20">

      {/* ── Category grid ───────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.slug} cat={cat} priority={i < 3} />
          ))}
        </div>
      </section>

      {/* ── Featured products ────────────────────────────────── */}
      {initialProducts.length > 0 && (
        <section>

          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p
                className="text-[9px] uppercase tracking-[0.35em] font-body mb-2"
                style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}
              >
                — Featured
              </p>
              <h2
                className="font-heading"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 300, letterSpacing: '0.05em', color: 'var(--color-charcoal)' }}
              >
                New Arrivals
              </h2>
            </div>
            <Link
              href="/shop/spices-herbs"
              className="text-[10px] uppercase tracking-[0.2em] font-body transition-opacity hover:opacity-60"
              style={{ color: 'var(--color-charcoal)', opacity: 0.32 }}
            >
              Browse all →
            </Link>
          </div>

          {/* Search bar */}
          <div className="relative mb-8">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={placeholder}
              className="w-full max-w-sm bg-transparent border-b pb-2 text-sm font-body focus:outline-none transition-colors"
              style={{
                borderColor: search ? 'rgba(42,32,22,0.35)' : 'rgba(42,32,22,0.12)',
                color: 'var(--color-charcoal)',
              }}
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-0 bottom-2 text-xs"
                style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}
              >
                ✕
              </button>
            )}
          </div>

          <ProductGrid products={featuredProducts} columns={4} />

        </section>
      )}

      {/* Empty state when no products yet */}
      {initialProducts.length === 0 && (
        <section className="py-20 text-center">
          <p className="font-heading text-2xl mb-3" style={{ color: 'var(--color-charcoal)', opacity: 0.2, fontWeight: 300 }}>
            Products coming soon
          </p>
          <p className="text-sm font-body" style={{ color: 'var(--color-charcoal)', opacity: 0.28 }}>
            Browse our categories above to explore what&apos;s available
          </p>
        </section>
      )}

    </div>
  );
}

// ── Category card ──────────────────────────────────────────────────────────────

function CategoryCard({ cat, priority }: { cat: Category; priority: boolean }) {
  const subCount = cat.subcategories?.length ?? 0;

  return (
    <Link
      href={`/shop/${cat.slug}`}
      className="group relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] block"
    >
      {/* Background image / fallback gradient */}
      <div className="absolute inset-0" style={{ background: 'var(--color-sahara-dark)' }}>
        {cat.image_url ? (
          <img
            src={cat.image_url}
            alt={cat.name}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-92 group-hover:scale-105 transition-all duration-700"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, var(--color-sahara-dark) 0%, var(--color-sahara) 100%)' }}
          >
            {cat.icon && <span className="text-7xl opacity-20">{cat.icon}</span>}
          </div>
        )}
      </div>

      {/* Gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      {/* Halo on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 55%)' }}
      />

      {/* Glass info card */}
      <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
        <div
          className="rounded-xl lg:rounded-2xl px-4 py-3.5 lg:px-5 lg:py-4"
          style={{
            background: 'rgba(255,255,255,0.18)',
            backdropFilter: 'blur(15px)',
            WebkitBackdropFilter: 'blur(15px)',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-0.5">
            {cat.icon && <span className="text-sm">{cat.icon}</span>}
            <p
              className="font-heading text-white"
              style={{ fontSize: '15px', fontWeight: 500, letterSpacing: '0.02em' }}
            >
              {cat.name}
            </p>
          </div>
          {subCount > 0 && (
            <p className="font-body text-white/40 text-[10px] uppercase tracking-[0.12em]">
              {subCount} collections
            </p>
          )}
          {cat.description && subCount === 0 && (
            <p className="font-body text-white/35 text-[10px] leading-snug mt-0.5 line-clamp-1">
              {cat.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
