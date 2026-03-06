'use client';
/**
 * TierPricingTable – wholesale tier pricing grid.
 * Only rendered when user is approved wholesale.
 */

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import type { DbPriceTier } from '@/types/shop';

interface TierPricingTableProps {
    tiers: DbPriceTier[];
    currency?: string;
    activeQty?: number;
}

export default function TierPricingTable({
    tiers,
    currency = 'AED',
    activeQty = 1,
}: TierPricingTableProps) {
    const { t, isRTL } = useLang();

    if (tiers.length === 0) return null;

    const sorted = [...tiers].sort((a, b) => a.min_qty - b.min_qty);

    const fmt = (n: number) =>
        new Intl.NumberFormat(isRTL ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2,
        }).format(n);

    // Determine which tier applies at current qty
    const activeTier = sorted.reduce<DbPriceTier | null>((best, tier) => {
        if (activeQty >= tier.min_qty) return tier;
        return best;
    }, null);

    return (
        <div className="rounded-xl border border-[var(--color-zellige)]/30 overflow-hidden">
            <div className="bg-[var(--color-zellige)] px-4 py-2.5">
                <h4 className="text-sm font-semibold text-white">{t('tierPricing')}</h4>
            </div>
            <table className="w-full text-sm">
                <thead>
                    <tr className="bg-[var(--color-zellige)]/5 text-[var(--color-charcoal)]">
                        <th className="text-left rtl:text-right px-4 py-2 font-medium">{t('moq')}</th>
                        <th className="text-left rtl:text-right px-4 py-2 font-medium">{t('price')}</th>
                        <th className="text-left rtl:text-right px-4 py-2 font-medium hidden sm:table-cell"></th>
                    </tr>
                </thead>
                <tbody>
                    {sorted.map((tier, i) => {
                        const isActive = tier.id === activeTier?.id;
                        const nextTier = sorted[i + 1];
                        const rangeLabel = nextTier
                            ? `${tier.min_qty}–${nextTier.min_qty - 1} ${t('units')}`
                            : `${tier.min_qty}+ ${t('units')}`;

                        return (
                            <tr
                                key={tier.id}
                                className={`
                                    border-t border-stone-100 transition-colors
                                    ${isActive ? 'bg-[var(--color-zellige)]/10 font-semibold' : 'hover:bg-stone-50'}
                                `}
                            >
                                <td className="px-4 py-3">
                                    <span className="font-medium">{tier.label ?? rangeLabel}</span>
                                </td>
                                <td className="px-4 py-3 text-[var(--color-zellige)] font-semibold">
                                    {fmt(Number(tier.price))}
                                    <span className="text-stone-400 font-normal text-xs ms-1">
                                        /{t('units').slice(0, -1)}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    {isActive && (
                                        <span className="inline-flex items-center gap-1 text-xs bg-[var(--color-zellige)] text-white px-2 py-0.5 rounded-full">
                                            ✓ Your price
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
