'use client';
/**
 * PriceBlock – shows retail or wholesale price depending on context.
 * Retail: regular price + optional compare price.
 * Wholesale: "From AED X" badge.
 */

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import type { DbPriceTier } from '@/types/shop';

interface PriceBlockProps {
    retailPrice: number;
    comparePrice?: number | null;
    currency?: string;
    weightLabel?: string | null;
    /** Wholesale mode: show "From X" using the lowest tier */
    priceTiers?: DbPriceTier[];
    isWholesaleMode?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

export default function PriceBlock({
    retailPrice,
    comparePrice,
    currency = 'AED',
    weightLabel,
    priceTiers = [],
    isWholesaleMode = false,
    size = 'md',
}: PriceBlockProps) {
    const { t, isRTL } = useLang();

    const textSizes = { sm: 'text-sm', md: 'text-base', lg: 'text-2xl' };
    const subSizes = { sm: 'text-xs', md: 'text-sm', lg: 'text-base' };

    // Wholesale: find lowest price from tiers
    const lowestTierPrice = priceTiers.length > 0
        ? Math.min(...priceTiers.map(t => Number(t.price)))
        : null;

    const fmt = (n: number) =>
        new Intl.NumberFormat(isRTL ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(n);

    if (isWholesaleMode && lowestTierPrice !== null) {
        return (
            <div className="flex flex-col gap-0.5">
                <div className="flex items-baseline gap-1">
                    <span className={`${subSizes[size]} text-stone-500`}>{t('fromPrice')}</span>
                    <span className={`${textSizes[size]} font-bold text-[var(--color-zellige)]`}>
                        {fmt(lowestTierPrice)}
                    </span>
                </div>
                {weightLabel && (
                    <span className={`${subSizes[size]} text-stone-400`}>{weightLabel}</span>
                )}
                <span className={`${subSizes[size]} text-[var(--color-zellige)]/80 font-medium`}>
                    {t('tierPricing')}
                </span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-0.5">
            <div className="flex items-baseline gap-2">
                <span className={`${textSizes[size]} font-bold text-[var(--color-charcoal)]`}>
                    {fmt(retailPrice)}
                </span>
                {comparePrice && comparePrice > retailPrice && (
                    <span className={`${subSizes[size]} text-stone-400 line-through`}>
                        {fmt(comparePrice)}
                    </span>
                )}
            </div>
            {weightLabel && (
                <span className={`${subSizes[size]} text-stone-400`}>{weightLabel}</span>
            )}
        </div>
    );
}
