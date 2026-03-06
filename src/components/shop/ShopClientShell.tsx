'use client';
/**
 * ShopClientShell – Client wrapper for tab + wholesale gate state.
 * Manages the "Shop for Home" / "For Businesses" tabs.
 * Checks wholesale approval status from Supabase.
 */

import React, { useState, useEffect } from 'react';
import ShopTabs, { type ShopMode } from './ShopTabs';
import CategoryNav from './CategoryNav';
import ProductGrid from './ProductGrid';
import WholesaleGate from './WholesaleGate';
import { supabase } from '@/lib/supabase';
import type { Category, ProductCardData, WholesaleStatus } from '@/types/shop';
import type { LangCode } from '@/types/shop';

interface ShopClientShellProps {
    categories: Category[];
    initialProducts: ProductCardData[];
    lang: LangCode;
    activeCategory?: string;
}

export default function ShopClientShell({
    categories,
    initialProducts,
    lang,
    activeCategory,
}: ShopClientShellProps) {
    const [mode, setMode] = useState<ShopMode>('retail');
    const [wholesaleStatus, setWholesaleStatus] = useState<WholesaleStatus | null>(null);
    const [loadingWholesale, setLoadingWholesale] = useState(false);

    // Check wholesale status when switching to wholesale tab
    useEffect(() => {
        if (mode !== 'wholesale') return;

        let cancelled = false;
        setLoadingWholesale(true);

        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || cancelled) { setLoadingWholesale(false); return; }

            const { data } = await supabase
                .from('wholesale_accounts')
                .select('status')
                .eq('user_id', user.id)
                .single();

            if (!cancelled) {
                setWholesaleStatus((data?.status as WholesaleStatus) ?? null);
                setLoadingWholesale(false);
            }
        })();

        return () => { cancelled = true; };
    }, [mode]);

    return (
        <div className="space-y-6">
            {/* Mode Tabs */}
            <ShopTabs
                mode={mode}
                onChange={setMode}
                className="max-w-sm"
            />

            {/* Retail Mode */}
            {mode === 'retail' && (
                <div className="space-y-6">
                    <CategoryNav categories={categories} activeSlug={activeCategory} />
                    <ProductGrid products={initialProducts} mode="retail" />
                </div>
            )}

            {/* Wholesale Mode */}
            {mode === 'wholesale' && (
                <div>
                    {loadingWholesale ? (
                        <div className="flex justify-center py-12">
                            <div className="w-8 h-8 border-4 border-[var(--color-imperial)]/20
                                            border-t-[var(--color-imperial)] rounded-full animate-spin" />
                        </div>
                    ) : (
                        <WholesaleGate applicationStatus={wholesaleStatus}>
                            {/* Wholesale-approved content */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 bg-[var(--color-zellige)]/10
                                                border border-[var(--color-zellige)]/30 rounded-xl
                                                px-4 py-3">
                                    <span>✅</span>
                                    <p className="text-sm text-[var(--color-zellige)] font-medium">
                                        You're viewing wholesale pricing. Tier discounts apply at checkout.
                                    </p>
                                </div>
                                <CategoryNav categories={categories} activeSlug={activeCategory} />
                                <ProductGrid products={initialProducts} mode="wholesale" />
                            </div>
                        </WholesaleGate>
                    )}
                </div>
            )}
        </div>
    );
}
