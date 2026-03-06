'use client';
/**
 * ShopPageClient – Full client-side shop page with:
 *   - Retail / Wholesale tabs
 *   - Search (debounced FTS + keyword fallback)
 *   - Category + Brand filters
 *   - Paginated product grid
 *   - Wholesale gate (role-aware)
 *
 * Receives category + brand lists as SSR props from the Server Component.
 * Product data is fetched client-side via useProducts (allows real-time filters).
 */

import React, { useCallback, useState } from 'react';
import ShopTabs, { type ShopMode } from './ShopTabs';
import CategoryNav from './CategoryNav';
import ProductGrid from './ProductGrid';
import WholesaleGate from './WholesaleGate';
import SearchBar from './SearchBar';
import ShopFilters from './ShopFilters';
import Pagination from './Pagination';
import { useProducts } from '@/hooks/useProducts';
import { useUserRole } from '@/hooks/useUserRole';
import { useWholesaleStatus } from '@/hooks/useWholesaleStatus';
import type { V2Brand, V2Category, V2ProductCard } from '@/lib/api';
import type { ProductCardData, WholesaleStatus } from '@/types/shop';
import type { LangCode } from '@/types/shop';

interface ShopPageClientProps {
    categories: V2Category[];
    brands: V2Brand[];
    lang: LangCode;
}

// -----------------------------------------------------------------------------
// Adapter: V2ProductCard → ProductCardData (for existing ProductCard component)
// -----------------------------------------------------------------------------
function toCardData(p: V2ProductCard, lang: LangCode): ProductCardData {
    const activeVariants = p.variants?.filter(v => v.is_active) ?? [];
    const defaultVariant  = activeVariants[0] ?? p.variants?.[0];
    const totalStock = activeVariants.reduce((s, v) => s + v.stock_quantity, 0);

    const name =
        (lang === 'ar' && p.name_ar) ? p.name_ar :
        (lang === 'fr' && p.name_fr) ? p.name_fr :
        p.name;

    const tiers = defaultVariant?.price_tiers ?? [];
    const lowestTier = tiers.length > 0 ? Math.min(...tiers.map(t => t.price)) : null;

    return {
        id:                     p.id,
        slug:                   p.slug,
        name,
        short_description:      null,
        primary_image:          p.image_urls?.[0] ?? null,
        brand_name:             p.brand?.name ?? null,
        category_name:          p.category?.name ?? null,
        base_price:             defaultVariant?.retail_price ?? p.base_price,
        compare_price:          defaultVariant?.compare_price ?? p.compare_price,
        currency:               'AED',
        weight_label:           defaultVariant?.weight ?? null,
        is_wholesale_enabled:   p.is_wholesale_enabled,
        lowest_wholesale_price: lowestTier,
        stock_status:
            totalStock === 0 ? 'out_of_stock' :
            totalStock <= 10 ? 'low_stock' :
            'in_stock',
    };
}

// -----------------------------------------------------------------------------
export default function ShopPageClient({
    categories,
    brands,
    lang,
}: ShopPageClientProps) {
    const [mode, setMode] = useState<ShopMode>('retail');
    const [searchInput, setSearchInput] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const [selectedBrandId,    setSelectedBrandId   ] = useState<string | null>(null);

    const { isWholesale } = useUserRole();
    const { status: wholesaleStatus, loading: wsLoading } = useWholesaleStatus();

    const { products, total, page, totalPages, loading, setPage, setFilters } =
        useProducts({
            categoryId: selectedCategoryId,
            brandId:    selectedBrandId,
            search:     searchInput || undefined,
            isWholesaleEnabled: mode === 'wholesale' ? true : undefined,
        });

    const cardData: ProductCardData[] = products.map(p => toCardData(p, lang));

    // ------------------------------------------------------------------
    // Filter change handlers — sync useProducts filters
    // ------------------------------------------------------------------
    const handleSearch = useCallback((val: string) => {
        setSearchInput(val);
        setFilters({
            search:     val || undefined,
            categoryId: selectedCategoryId,
            brandId:    selectedBrandId,
            isWholesaleEnabled: mode === 'wholesale' ? true : undefined,
        });
    }, [selectedCategoryId, selectedBrandId, mode, setFilters]);

    const handleCategoryChange = useCallback((catId: string | null) => {
        setSelectedCategoryId(catId);
        setFilters({
            search:     searchInput || undefined,
            categoryId: catId,
            brandId:    selectedBrandId,
            isWholesaleEnabled: mode === 'wholesale' ? true : undefined,
        });
    }, [searchInput, selectedBrandId, mode, setFilters]);

    const handleBrandChange = useCallback((brandId: string | null) => {
        setSelectedBrandId(brandId);
        setFilters({
            search:     searchInput || undefined,
            categoryId: selectedCategoryId,
            brandId,
            isWholesaleEnabled: mode === 'wholesale' ? true : undefined,
        });
    }, [searchInput, selectedCategoryId, mode, setFilters]);

    const handleModeChange = useCallback((newMode: ShopMode) => {
        setMode(newMode);
        setFilters({
            search:     searchInput || undefined,
            categoryId: selectedCategoryId,
            brandId:    selectedBrandId,
            isWholesaleEnabled: newMode === 'wholesale' ? true : undefined,
        });
    }, [searchInput, selectedCategoryId, selectedBrandId, setFilters]);

    // ------------------------------------------------------------------
    // Wholesale gate status mapping (V2 → V1 compatible type)
    // ------------------------------------------------------------------
    const gateStatus: WholesaleStatus | null =
        wsLoading ? null :
        wholesaleStatus === 'not_applied' ? null :
        wholesaleStatus as WholesaleStatus;

    // ------------------------------------------------------------------
    return (
        <div className="space-y-6">
            {/* Mode Tabs */}
            <ShopTabs mode={mode} onChange={handleModeChange} className="max-w-sm" />

            {/* Wholesale Gate */}
            {mode === 'wholesale' && !wsLoading && gateStatus !== 'approved' && (
                <WholesaleGate applicationStatus={gateStatus} />
            )}

            {/* Main content only shown in retail OR when wholesale is approved */}
            {(mode === 'retail' || (mode === 'wholesale' && (wsLoading || gateStatus === 'approved'))) && (
                <>
                    {/* Approved wholesale banner */}
                    {mode === 'wholesale' && gateStatus === 'approved' && (
                        <div className="flex items-center gap-2 bg-[var(--color-zellige)]/10
                                        border border-[var(--color-zellige)]/30 rounded-xl px-4 py-3">
                            <span>✅</span>
                            <p className="text-sm text-[var(--color-zellige)] font-medium">
                                You're viewing wholesale pricing. Tier discounts apply at checkout.
                            </p>
                        </div>
                    )}

                    {/* Search bar */}
                    <SearchBar
                        onSearch={handleSearch}
                        value={searchInput}
                        placeholder={
                            lang === 'ar' ? 'ابحث عن المنتجات…' :
                            lang === 'fr' ? 'Rechercher des produits…' :
                            'Search products…'
                        }
                        className="w-full max-w-xl"
                    />

                    {/* Category nav (mobile-style horizontal scroll) */}
                    <CategoryNav
                        categories={categories.map(c => ({
                            id: c.id,
                            slug: c.slug,
                            name: (lang === 'ar' && c.name_ar) ? c.name_ar :
                                  (lang === 'fr' && c.name_fr) ? c.name_fr : c.name,
                            is_active: c.is_active,
                            sort_order: c.sort_order,
                            icon: c.icon,
                            image_url: c.image_url,
                            parent_id: c.parent_id,
                            created_at: c.created_at,
                            updated_at: c.created_at,
                        }))}
                        activeSlug={undefined}
                    />

                    {/* Two-column layout: filters (md+) + grid */}
                    <div className="flex gap-8 items-start">
                        {/* Filter sidebar (hidden on mobile — pills used instead) */}
                        <aside className="hidden md:block w-52 flex-shrink-0">
                            <ShopFilters
                                categories={categories}
                                brands={brands}
                                selectedCategoryId={selectedCategoryId}
                                selectedBrandId={selectedBrandId}
                                onCategoryChange={handleCategoryChange}
                                onBrandChange={handleBrandChange}
                                lang={lang}
                            />
                        </aside>

                        {/* Product grid */}
                        <div className="flex-1 min-w-0 space-y-6">
                            {/* Mobile filter pills */}
                            <div className="md:hidden">
                                <ShopFilters
                                    categories={categories}
                                    brands={brands}
                                    selectedCategoryId={selectedCategoryId}
                                    selectedBrandId={selectedBrandId}
                                    onCategoryChange={handleCategoryChange}
                                    onBrandChange={handleBrandChange}
                                    lang={lang}
                                />
                            </div>

                            {/* Results count */}
                            {!loading && (
                                <p className="text-xs text-stone-400">
                                    {total} {total === 1 ? 'product' : 'products'} found
                                </p>
                            )}

                            <ProductGrid
                                products={cardData}
                                mode={mode}
                                loading={loading}
                                skeletonCount={8}
                            />

                            {/* Pagination */}
                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                                className="pt-2"
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
