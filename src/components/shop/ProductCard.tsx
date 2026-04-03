/**
 * ProductCard — Light glass card matching OUROZ reference design.
 * Cream/sandy background, centered product image (object-contain),
 * dark serif name + "Handcrafted in Morocco" + price below.
 */

import Link from 'next/link';
import type { ProductCard as ProductCardType } from '@/types/shop';

interface Props {
  product: ProductCardType;
}

export default function ProductCard({ product }: Props) {
  const discount = product.compare_at_price && product.compare_at_price > product.price
    ? Math.round((1 - product.price / product.compare_at_price) * 100)
    : null;

  return (
    <Link href={`/product/${product.slug}`} className="group block">
      <div
        className="relative rounded-2xl overflow-hidden flex flex-col aspect-[3/4]"
        style={{
          background: 'rgba(253, 248, 240, 0.68)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.55)',
          boxShadow: '0 4px 20px rgba(42, 32, 22, 0.08)',
        }}
      >
        {/* Image — upper ~62% */}
        <div className="flex-1 relative flex items-center justify-center px-5 pt-5 pb-2 min-h-0">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.04]"
              style={{ filter: 'drop-shadow(0 8px 18px rgba(42,32,22,0.14))' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-7xl" style={{ opacity: 0.12 }}>🫙</span>
            </div>
          )}

          {/* Discount badge */}
          {discount !== null && (
            <span
              className="absolute top-3 right-3 text-[9px] font-bold font-body px-2.5 py-1 rounded-full text-white"
              style={{ background: 'var(--color-terracotta)' }}
            >
              −{discount}%
            </span>
          )}

          {/* Out-of-stock overlay */}
          {!product.in_stock && (
            <div
              className="absolute inset-0 flex items-center justify-center rounded-xl"
              style={{ background: 'rgba(253,248,240,0.72)' }}
            >
              <span
                className="text-[10px] uppercase tracking-[0.18em] font-body"
                style={{ color: 'rgba(42,32,22,0.38)' }}
              >
                Out of stock
              </span>
            </div>
          )}
        </div>

        {/* Info — bottom ~38% */}
        <div
          className="px-4 pb-4 pt-3 shrink-0"
          style={{
            borderTop: '1px solid rgba(255,255,255,0.65)',
            background: 'rgba(253,248,240,0.82)',
          }}
        >
          <p
            className="font-heading text-[var(--color-charcoal)] leading-snug line-clamp-1 mb-0.5"
            style={{ fontSize: 15, fontWeight: 500 }}
          >
            {product.name}
          </p>
          <p
            className="font-body mb-2"
            style={{ fontSize: 10, color: 'rgba(42,32,22,0.38)', letterSpacing: '0.02em' }}
          >
            Handcrafted in Morocco
          </p>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className="font-body font-bold"
              style={{ fontSize: 15, color: 'var(--color-charcoal)' }}
            >
              {product.price.toFixed(0)}
            </span>
            <span
              className="font-body"
              style={{ fontSize: 11, color: 'rgba(42,32,22,0.45)' }}
            >
              {product.currency ?? 'AED'}
            </span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span
                className="font-body line-through"
                style={{ fontSize: 11, color: 'rgba(42,32,22,0.28)' }}
              >
                {product.compare_at_price.toFixed(0)}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
