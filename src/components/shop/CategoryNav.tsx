/**
 * CategoryNav — horizontal scrollable top-level category pills.
 * When a category is active, shows its subcategory pills below.
 * Subcategory clicks update URL searchParams → triggers server re-render.
 */
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { Category } from '@/types/shop';

interface Props {
  categories: Category[];
  activeSlug?: string;
}

export default function CategoryNav({ categories, activeSlug }: Props) {
  const searchParams = useSearchParams();
  const activeSub = searchParams.get('sub');

  const activeCategory = categories.find(c => c.slug === activeSlug);
  const subcategories = activeCategory?.subcategories ?? [];

  const pillBase = 'shrink-0 px-4 py-2 rounded-full text-[10px] font-body font-semibold uppercase tracking-[0.15em] transition-all duration-200';
  const pillActive = 'bg-[var(--color-charcoal)] text-[var(--color-sahara)]';
  const pillIdle = 'text-[var(--color-charcoal)]/45 hover:text-[var(--color-charcoal)]/75 border border-[var(--color-charcoal)]/10 hover:border-[var(--color-charcoal)]/25';

  const subPillBase = 'shrink-0 px-3 py-1.5 rounded-full text-[10px] font-body font-medium uppercase tracking-[0.12em] transition-all duration-200 border';
  const subActive = 'bg-[var(--color-gold)]/15 text-[var(--color-gold-muted)] border-[var(--color-gold)]/30';
  const subIdle = 'text-[var(--color-charcoal)]/38 border-[var(--color-charcoal)]/10 hover:text-[var(--color-charcoal)]/60 hover:border-[var(--color-charcoal)]/22';

  return (
    <div className="space-y-3">

      {/* Top-level pills */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
        <Link href="/shop" className={`${pillBase} ${!activeSlug ? pillActive : pillIdle}`}>
          All
        </Link>
        {categories.map(cat => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className={`${pillBase} ${activeSlug === cat.slug ? pillActive : pillIdle}`}
          >
            {cat.icon && <span className="mr-1.5 text-[11px]">{cat.icon}</span>}
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Subcategory pills — only shown when a category is active */}
      {subcategories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5 pl-0.5">
          <Link
            href={`/shop/${activeSlug}`}
            className={`${subPillBase} ${!activeSub ? subActive : subIdle}`}
          >
            All {activeCategory?.name}
          </Link>
          {subcategories.map(sub => (
            <Link
              key={sub.slug}
              href={`/shop/${activeSlug}?sub=${sub.slug}`}
              className={`${subPillBase} ${activeSub === sub.slug ? subActive : subIdle}`}
            >
              {sub.icon && <span className="mr-1">{sub.icon}</span>}
              {sub.name}
            </Link>
          ))}
        </div>
      )}

    </div>
  );
}
