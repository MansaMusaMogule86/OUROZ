/**
 * ProductGrid — responsive grid with skeleton loading and empty state.
 * Server component — receives products as props, no client state needed.
 */

import type { ProductCard } from '@/types/shop';
import ProductCardItem from './ProductCard';

interface Props {
  products: ProductCard[];
  loading?: boolean;
  columns?: 3 | 4;
}

function Skeleton() {
  return (
    <div className="rounded-2xl overflow-hidden aspect-[4/5] relative">
      <div className="absolute inset-0 bg-[var(--color-sahara-dark)]/60 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 p-3">
        <div className="rounded-xl h-16 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false, columns = 4 }: Props) {
  const gridClass = columns === 3
    ? 'grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-5'
    : 'grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 lg:gap-5';

  if (loading) {
    return (
      <div className={gridClass}>
        {Array.from({ length: columns === 3 ? 6 : 8 }).map((_, i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-24 text-center">
        <p
          className="font-heading text-3xl mb-2"
          style={{ color: 'var(--color-charcoal)', opacity: 0.18, fontWeight: 300 }}
        >
          No products found
        </p>
        <p className="text-sm font-body" style={{ color: 'var(--color-charcoal)', opacity: 0.28 }}>
          Try a different category or search term
        </p>
      </div>
    );
  }

  return (
    <div className={gridClass}>
      {products.map(product => (
        <ProductCardItem key={product.id} product={product} />
      ))}
    </div>
  );
}
