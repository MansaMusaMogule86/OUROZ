'use client';
/**
 * ProductGrid – responsive grid of ProductCards.
 * Includes skeleton loading state.
 */

import React from 'react';
import ProductCard from './ProductCard';
import type { ProductCardData } from '@/types/shop';
import type { ShopMode } from './ShopTabs';
import { useLang } from '@/contexts/LangContext';

interface ProductGridProps {
    products: ProductCardData[];
    mode: ShopMode;
    loading?: boolean;
    skeletonCount?: number;
}

function ProductCardSkeleton() {
    return (
        <div className="rounded-2xl border border-stone-100 overflow-hidden animate-pulse">
            <div className="aspect-square bg-stone-200" />
            <div className="p-3 space-y-2">
                <div className="h-2 bg-stone-200 rounded w-1/3" />
                <div className="h-3 bg-stone-200 rounded w-4/5" />
                <div className="h-3 bg-stone-200 rounded w-2/5 mt-2" />
                <div className="h-4 bg-stone-300 rounded w-1/2 mt-1" />
            </div>
        </div>
    );
}

export default function ProductGrid({
    products,
    mode,
    loading = false,
    skeletonCount = 8,
}: ProductGridProps) {
    const { t } = useLang();

    const gridClass = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4';

    if (loading) {
        return (
            <div className={gridClass}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <ProductCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-stone-400">
                <span className="text-4xl mb-3">🏪</span>
                <p className="text-base font-medium">{t('noResults')}</p>
            </div>
        );
    }

    return (
        <div className={gridClass}>
            {products.map(p => (
                <ProductCard key={p.id} product={p} mode={mode} />
            ))}
        </div>
    );
}
