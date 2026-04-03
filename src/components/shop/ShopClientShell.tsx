/**
 * ShopClientShell — client wrapper for the category product listing.
 * Handles sort and in-page search against already-fetched products.
 * Subcategory filtering is URL-driven (CategoryNav → server re-render).
 */
'use client';

import { useState, useMemo } from 'react';
import type { Category, ProductCard, LangCode } from '@/types/shop';
import ProductGrid from './ProductGrid';
import ShopTabs from './ShopTabs';

interface Props {
  categories: Category[];
  initialProducts: ProductCard[];
  lang: LangCode;
  activeCategory?: string;
}

const SORT_TABS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest',   label: 'Newest'   },
  { value: 'price_lo', label: 'Price ↑'  },
  { value: 'price_hi', label: 'Price ↓'  },
  { value: 'name',     label: 'A – Z'    },
];

export default function ShopClientShell({
  initialProducts,
  lang,
}: Props) {
  const [sort, setSort] = useState('featured');
  const [search, setSearch] = useState('');

  const products = useMemo(() => {
    let list = [...initialProducts];

    // Text filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q));
    }

    // Sort
    switch (sort) {
      case 'price_lo': list.sort((a, b) => a.price - b.price); break;
      case 'price_hi': list.sort((a, b) => b.price - a.price); break;
      case 'name':     list.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break; // featured / newest: keep server order
    }

    return list;
  }, [initialProducts, sort, search]);

  const placeholder = lang === 'ar' ? 'ابحث عن منتج…'
                    : lang === 'fr' ? 'Rechercher…'
                    : 'Search products…';

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

        {/* Sort tabs */}
        <ShopTabs tabs={SORT_TABS} active={sort} onChange={setSort} />

        {/* Search */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder={placeholder}
            className="w-full sm:w-64 bg-transparent border-b border-[var(--color-charcoal)]/15 pb-2 pr-6 text-sm font-body text-[var(--color-charcoal)] placeholder:text-[var(--color-charcoal)]/25 focus:outline-none focus:border-[var(--color-charcoal)]/40 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-0 bottom-2 text-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)]/60 text-xs"
            >
              ✕
            </button>
          )}
        </div>

      </div>

      {/* Count */}
      <p className="text-[10px] uppercase tracking-[0.15em] font-body text-[var(--color-charcoal)]/30">
        {products.length} {products.length === 1 ? 'product' : 'products'}
      </p>

      {/* Grid */}
      <ProductGrid products={products} />

    </div>
  );
}
