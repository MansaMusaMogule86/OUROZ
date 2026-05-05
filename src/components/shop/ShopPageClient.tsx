/**
 * ShopPageClient — main /shop page.
 * Renders ALL categories, ALL brands, and ALL products with client-side
 * filtering by category, brand, search, and sort.
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
  totalCount?: number;
}

type SortKey = 'newest' | 'price_asc' | 'price_desc' | 'name';

export default function ShopPageClient({ categories, brands, lang, initialProducts, totalCount }: Props) {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortKey>('newest');

  const filteredProducts = useMemo(() => {
    let list = initialProducts.slice();

    if (activeCategory) {
      list = list.filter(p => p.category_slug === activeCategory);
    }
    if (activeBrand) {
      list = list.filter(p => p.brand_slug === activeBrand);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    switch (sortBy) {
      case 'price_asc':  list.sort((a, b) => a.price - b.price); break;
      case 'price_desc': list.sort((a, b) => b.price - a.price); break;
      case 'name':       list.sort((a, b) => a.name.localeCompare(b.name)); break;
      // 'newest' = preserve server order
    }

    return list;
  }, [initialProducts, activeCategory, activeBrand, search, sortBy]);

  const t = (en: string, ar: string, fr: string) =>
    lang === 'ar' ? ar : lang === 'fr' ? fr : en;

  const placeholder = t('Search products…', 'ابحث عن منتج…', 'Rechercher un produit…');
  const allLabel = t('All', 'الكل', 'Tous');
  const resetActive = !!(activeCategory || activeBrand || search);

  return (
    <div className="space-y-20">
      {/* ── Categories grid ─────────────────────────────────── */}
      {categories.length > 0 && (
        <section>
          <SectionHeader
            eyebrow={t('— Categories', '— الفئات', '— Catégories')}
            title={t('Browse by collection', 'تصفح حسب المجموعة', 'Parcourir par collection')}
            count={categories.length}
          />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.slug} cat={cat} priority={i < 3} />
            ))}
          </div>
        </section>
      )}

      {/* ── Brands grid ─────────────────────────────────────── */}
      {brands.length > 0 && (
        <section>
          <SectionHeader
            eyebrow={t('— Brands', '— العلامات التجارية', '— Marques')}
            title={t('Trusted houses', 'بيوت موثوقة', 'Maisons de confiance')}
            count={brands.length}
          />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 lg:gap-4">
            {brands.map(brand => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>
        </section>
      )}

      {/* ── All products ────────────────────────────────────── */}
      <section>
        <SectionHeader
          eyebrow={t('— Products', '— المنتجات', '— Produits')}
          title={t('All provisions', 'كل المؤن', 'Toutes les provisions')}
          count={totalCount ?? initialProducts.length}
        />

        {/* Filter bar */}
        <div className="space-y-4 mb-8">
          {/* Search + sort row */}
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-sm">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={placeholder}
                className="w-full bg-transparent border-b pb-2 text-sm font-body focus:outline-none transition-colors"
                style={{
                  borderColor: search ? 'rgba(42,32,22,0.35)' : 'rgba(42,32,22,0.12)',
                  color: 'var(--color-charcoal)',
                }}
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch('')}
                  className="absolute right-0 bottom-2 text-xs"
                  style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}
                  aria-label="Clear search"
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              <label
                className="text-[10px] uppercase tracking-[0.18em] font-body"
                style={{ color: 'var(--color-charcoal)', opacity: 0.4 }}
              >
                {t('Sort', 'ترتيب', 'Trier')}
              </label>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortKey)}
                className="bg-transparent border-b pb-1 text-sm font-body focus:outline-none cursor-pointer"
                style={{
                  borderColor: 'rgba(42,32,22,0.18)',
                  color: 'var(--color-charcoal)',
                }}
              >
                <option value="newest">{t('Newest', 'الأحدث', 'Plus récents')}</option>
                <option value="price_asc">{t('Price ↑', 'السعر ↑', 'Prix ↑')}</option>
                <option value="price_desc">{t('Price ↓', 'السعر ↓', 'Prix ↓')}</option>
                <option value="name">{t('Name A–Z', 'الاسم أ–ي', 'Nom A–Z')}</option>
              </select>
            </div>
          </div>

          {/* Category pills */}
          {categories.length > 0 && (
            <FilterPills
              label={t('Category', 'الفئة', 'Catégorie')}
              allLabel={allLabel}
              items={categories.map(c => ({ slug: c.slug, name: c.name, icon: c.icon }))}
              active={activeCategory}
              onChange={setActiveCategory}
            />
          )}

          {/* Brand pills */}
          {brands.length > 0 && (
            <FilterPills
              label={t('Brand', 'العلامة', 'Marque')}
              allLabel={allLabel}
              items={brands.map(b => ({ slug: b.slug, name: b.name }))}
              active={activeBrand}
              onChange={setActiveBrand}
            />
          )}

          {/* Reset + result count */}
          <div className="flex items-center justify-between pt-1">
            <p
              className="text-[10px] uppercase tracking-[0.2em] font-body"
              style={{ color: 'var(--color-charcoal)', opacity: 0.4 }}
            >
              {filteredProducts.length} {t('results', 'نتائج', 'résultats')}
            </p>
            {resetActive && (
              <button
                type="button"
                onClick={() => {
                  setActiveCategory(null);
                  setActiveBrand(null);
                  setSearch('');
                }}
                className="text-[10px] uppercase tracking-[0.2em] font-body underline-offset-4 hover:underline"
                style={{ color: 'var(--color-charcoal)', opacity: 0.55 }}
              >
                {t('Clear filters', 'مسح الفلاتر', 'Réinitialiser')}
              </button>
            )}
          </div>
        </div>

        <ProductGrid products={filteredProducts} columns={4} />
      </section>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, count }: { eyebrow: string; title: string; count?: number }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <p
          className="text-[9px] uppercase tracking-[0.35em] font-body mb-2"
          style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}
        >
          {eyebrow}
        </p>
        <h2
          className="font-heading"
          style={{
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)',
            fontWeight: 300,
            letterSpacing: '0.05em',
            color: 'var(--color-charcoal)',
          }}
        >
          {title}
        </h2>
      </div>
      {typeof count === 'number' && (
        <p
          className="text-[10px] uppercase tracking-[0.2em] font-body"
          style={{ color: 'var(--color-charcoal)', opacity: 0.32 }}
        >
          {count}
        </p>
      )}
    </div>
  );
}

// ── Filter pills ───────────────────────────────────────────────────────────────

interface PillItem { slug: string; name: string; icon?: string }

function FilterPills({
  label,
  allLabel,
  items,
  active,
  onChange,
}: {
  label: string;
  allLabel: string;
  items: PillItem[];
  active: string | null;
  onChange: (v: string | null) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <span
        className="shrink-0 mt-1.5 text-[10px] uppercase tracking-[0.18em] font-body"
        style={{ color: 'var(--color-charcoal)', opacity: 0.4 }}
      >
        {label}
      </span>
      <div className="flex flex-wrap gap-2">
        <Pill active={active === null} onClick={() => onChange(null)}>
          {allLabel}
        </Pill>
        {items.map(it => (
          <Pill
            key={it.slug}
            active={active === it.slug}
            onClick={() => onChange(active === it.slug ? null : it.slug)}
          >
            {it.icon && <span className="mr-1">{it.icon}</span>}
            {it.name}
          </Pill>
        ))}
      </div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-[11px] font-body transition-all"
      style={{
        background: active ? 'var(--color-charcoal)' : 'rgba(42,32,22,0.04)',
        color: active ? 'rgba(253,248,240,0.96)' : 'var(--color-charcoal)',
        border: active ? '1px solid var(--color-charcoal)' : '1px solid rgba(42,32,22,0.1)',
        letterSpacing: '0.04em',
      }}
    >
      {children}
    </button>
  );
}

// ── Category card ──────────────────────────────────────────────────────────────

function CategoryCard({ cat, priority }: { cat: Category; priority: boolean }) {
  void priority;
  const subCount = cat.subcategories?.length ?? 0;

  return (
    <Link
      href={`/shop/${cat.slug}`}
      className="group relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4] block"
    >
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

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(255,255,255,0.1) 0%, transparent 55%)' }}
      />

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

// ── Brand card ─────────────────────────────────────────────────────────────────

function BrandCard({ brand }: { brand: Brand }) {
  return (
    <div
      className="group relative rounded-2xl overflow-hidden aspect-square flex items-center justify-center px-4"
      style={{
        background: 'rgba(253, 248, 240, 0.68)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.55)',
        boxShadow: '0 4px 16px rgba(42, 32, 22, 0.06)',
      }}
    >
      {brand.logo_url ? (
        <img
          src={brand.logo_url}
          alt={brand.name}
          className="max-w-[70%] max-h-[60%] object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ filter: 'drop-shadow(0 4px 10px rgba(42,32,22,0.1))' }}
        />
      ) : (
        <p
          className="font-heading text-center leading-tight"
          style={{
            fontSize: 14,
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: 'var(--color-charcoal)',
          }}
        >
          {brand.name}
        </p>
      )}

      <div
        className="absolute inset-x-0 bottom-0 px-3 py-2 text-center"
        style={{
          background: 'linear-gradient(to top, rgba(253,248,240,0.96) 50%, rgba(253,248,240,0) 100%)',
        }}
      >
        <p
          className="font-body text-[10px] uppercase tracking-[0.18em]"
          style={{ color: 'var(--color-charcoal)', opacity: 0.55 }}
        >
          {brand.name}
        </p>
      </div>
    </div>
  );
}
