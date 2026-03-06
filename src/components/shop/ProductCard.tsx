'use client';
/**
 * ProductCard – used in ProductGrid listings.
 * Adapts display based on retail/wholesale mode.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import PriceBlock from './PriceBlock';
import { useLang } from '@/contexts/LangContext';
import type { ProductCardData } from '@/types/shop';
import type { ShopMode } from './ShopTabs';

interface ProductCardProps {
    product: ProductCardData;
    mode: ShopMode;
}

const STOCK_BADGE: Record<ProductCardData['stock_status'], { bg: string; label: string }> = {
    in_stock: { bg: 'bg-emerald-100 text-emerald-700', label: '' },
    low_stock: { bg: 'bg-amber-100 text-amber-700', label: 'lowStock' },
    out_of_stock: { bg: 'bg-red-100 text-red-700', label: 'outOfStock' },
};

export default function ProductCard({ product, mode }: ProductCardProps) {
    const { t } = useLang();
    const badge = STOCK_BADGE[product.stock_status];

    const fallbackImage = `https://placehold.co/600x600/F5E6D3/1A1A1A?text=${encodeURIComponent(product.name.slice(0, 10))}`;

    return (
        <Link
            href={`/product/${product.slug}`}
            className="group flex flex-col bg-white rounded-2xl border border-stone-100
                       hover:border-[var(--color-imperial)]/30 hover:shadow-lg
                       transition-all duration-200 overflow-hidden"
        >
            {/* Image */}
            <div className="relative aspect-square bg-[var(--color-sahara)] overflow-hidden">
                <Image
                    src={product.primary_image ?? fallbackImage}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />

                {/* Stock badge */}
                {badge.label && (
                    <span className={`absolute top-2 start-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg}`}>
                        {t(badge.label)}
                    </span>
                )}

                {/* Wholesale badge */}
                {mode === 'wholesale' && product.is_wholesale_enabled && (
                    <span className="absolute top-2 end-2 text-xs font-bold px-2 py-0.5 rounded-full
                                     bg-[var(--color-zellige)] text-white">
                        B2B
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex flex-col flex-1 p-3 gap-1">
                {/* Brand */}
                {product.brand_name && (
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-stone-400">
                        {product.brand_name}
                    </span>
                )}

                {/* Name */}
                <h3 className="text-sm font-semibold text-[var(--color-charcoal)] leading-snug line-clamp-2
                               group-hover:text-[var(--color-imperial)] transition-colors">
                    {product.name}
                </h3>

                {/* Weight */}
                {product.weight_label && (
                    <span className="text-xs text-stone-400">{product.weight_label}</span>
                )}

                {/* Price */}
                <div className="mt-auto pt-2">
                    <PriceBlock
                        retailPrice={product.base_price}
                        comparePrice={product.compare_price}
                        weightLabel={null}
                        isWholesaleMode={mode === 'wholesale' && product.is_wholesale_enabled}
                        size="sm"
                    />
                </div>
            </div>
        </Link>
    );
}
