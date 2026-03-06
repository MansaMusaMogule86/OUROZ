'use client';
/**
 * ProductDetailClient – All interactive parts of the product page:
 * - Variant selector
 * - Qty stepper
 * - Add to cart
 * - Wholesale tier table
 * - Bulk quote form
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LangContext';
import PriceBlock from './PriceBlock';
import TierPricingTable from './TierPricingTable';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import type { ProductDetail, ProductVariantDetail, LangCode, WholesaleStatus } from '@/types/shop';

interface Props {
    product: ProductDetail;
    defaultVariant: ProductVariantDetail | null;
    lang: LangCode;
}

export default function ProductDetailClient({ product, defaultVariant, lang }: Props) {
    const { t, isRTL } = useLang();

    const [selectedVariant, setSelectedVariant] = useState<ProductVariantDetail | null>(defaultVariant);
    const [qty, setQty] = useState(1);
    const [isWholesale, setIsWholesale] = useState(false);
    const [wholesaleStatus, setWholesaleStatus] = useState<WholesaleStatus | null>(null);
    const [showQuoteForm, setShowQuoteForm] = useState(false);
    const [quoteSubmitting, setQuoteSubmitting] = useState(false);
    const [quoteSuccess, setQuoteSuccess] = useState(false);

    // Check wholesale access
    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return;
            const { data: profile } = await supabase
                .from('user_profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            if (profile?.role === 'wholesale') {
                setIsWholesale(true);
                setWholesaleStatus('approved');
            }
        });
    }, []);

    const variant = selectedVariant;
    const tiers = variant?.price_tiers ?? [];

    // Compute effective price from tier
    const effectiveTier = [...tiers]
        .sort((a, b) => a.min_qty - b.min_qty)
        .reverse()
        .find(t => qty >= t.min_qty);

    const displayPrice = isWholesale && effectiveTier
        ? Number(effectiveTier.price)
        : (variant ? Number(variant.retail_price) : Number(product.base_price));

    // Handle bulk quote submit
    const handleQuoteSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!variant) return;
        setQuoteSubmitting(true);

        const form = e.currentTarget;
        const data = new FormData(form);

        await supabase.from('bulk_quote_requests').insert({
            product_id: product.id,
            variant_id: variant.id,
            requested_qty: qty,
            contact_name: data.get('name') as string,
            contact_email: data.get('email') as string,
            contact_phone: data.get('phone') as string || null,
            notes: data.get('notes') as string || null,
        });

        setQuoteSubmitting(false);
        setQuoteSuccess(true);
        setShowQuoteForm(false);
    };

    return (
        <div className="flex flex-col gap-5">
            {/* Breadcrumb */}
            <nav className="text-xs text-stone-400 flex gap-1.5">
                <Link href="/shop" className="hover:text-[var(--color-imperial)]">Shop</Link>
                {product.category && (
                    <>
                        <span>/</span>
                        <Link href={`/shop/${product.category.slug}`}
                              className="hover:text-[var(--color-imperial)]">
                            {product.category.name}
                        </Link>
                    </>
                )}
            </nav>

            {/* Brand */}
            {product.brand && (
                <span className="text-xs font-bold uppercase tracking-widest text-stone-400">
                    {product.brand.name}
                </span>
            )}

            {/* Name */}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--color-charcoal)] leading-tight">
                {product.name}
            </h1>

            {/* Short description */}
            {product.short_description && (
                <p className="text-stone-500 text-sm leading-relaxed">
                    {product.short_description}
                </p>
            )}

            {/* Variant selector */}
            {product.variants.length > 1 && (
                <div>
                    <p className="text-xs font-semibold text-stone-500 mb-2 uppercase tracking-wide">
                        {t('qty')} / Size
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.map(v => (
                            <button
                                key={v.id}
                                onClick={() => { setSelectedVariant(v); setQty(1); }}
                                className={`
                                    px-4 py-2 rounded-xl text-sm font-medium border transition
                                    ${selectedVariant?.id === v.id
                                        ? 'border-[var(--color-imperial)] bg-[var(--color-imperial)]/5 text-[var(--color-imperial)]'
                                        : 'border-stone-200 text-stone-600 hover:border-stone-400'
                                    }
                                    ${!v.is_in_stock ? 'opacity-40 cursor-not-allowed' : ''}
                                `}
                                disabled={!v.is_in_stock}
                            >
                                {v.weight_label ?? v.size_label ?? v.sku}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Price */}
            <PriceBlock
                retailPrice={displayPrice}
                comparePrice={variant?.compare_price}
                weightLabel={variant?.weight_label}
                priceTiers={tiers}
                isWholesaleMode={isWholesale}
                size="lg"
            />

            {/* Qty + Add to Cart */}
            {variant && (
                <div className="flex items-center gap-3 flex-wrap">
                    <QuantitySelector
                        value={qty}
                        onChange={setQty}
                        min={1}
                        max={
                            variant.inventory?.track_inventory
                                ? (variant.inventory.qty_available - variant.inventory.qty_reserved)
                                : undefined
                        }
                    />
                    <AddToCartButton
                        variant={variant}
                        qty={qty}
                        productName={product.name}
                        productSlug={product.slug}
                        primaryImage={product.images[0]?.url ?? null}
                        className="flex-1"
                    />
                </div>
            )}

            {/* Wholesale tier table */}
            {isWholesale && tiers.length > 0 && (
                <TierPricingTable tiers={tiers} activeQty={qty} />
            )}

            {/* Wholesale CTA for non-wholesale users */}
            {!isWholesale && product.is_wholesale_enabled && (
                <div className="flex items-center gap-3 p-4 bg-[var(--color-zellige)]/8
                                rounded-xl border border-[var(--color-zellige)]/20">
                    <span className="text-2xl">🏭</span>
                    <div className="flex-1">
                        <p className="text-sm font-medium text-[var(--color-charcoal)]">
                            Need this in bulk?
                        </p>
                        <p className="text-xs text-stone-500">Apply for wholesale access to unlock tier pricing.</p>
                    </div>
                    <Link
                        href="/wholesale/apply"
                        className="text-xs font-semibold text-[var(--color-zellige)]
                                   hover:text-[var(--color-zellige)]/80 whitespace-nowrap"
                    >
                        Apply →
                    </Link>
                </div>
            )}

            {/* Bulk quote button */}
            {product.is_wholesale_enabled && (
                <div>
                    {quoteSuccess ? (
                        <div className="flex items-center gap-2 text-sm text-[var(--color-zellige)]
                                        bg-[var(--color-zellige)]/10 rounded-xl px-4 py-3">
                            ✅ Quote request submitted! We'll be in touch within 24 hours.
                        </div>
                    ) : (
                        <button
                            onClick={() => setShowQuoteForm(v => !v)}
                            className="flex items-center gap-2 text-sm font-medium text-stone-600
                                       border border-stone-200 rounded-xl px-5 py-2.5
                                       hover:bg-stone-50 transition w-full justify-center"
                        >
                            📋 {t('requestBulkQuote')}
                        </button>
                    )}

                    {/* Bulk quote form */}
                    {showQuoteForm && !quoteSuccess && (
                        <form
                            onSubmit={handleQuoteSubmit}
                            className="mt-4 space-y-3 p-4 bg-stone-50 rounded-2xl border border-stone-200"
                        >
                            <h4 className="font-semibold text-sm text-[var(--color-charcoal)]">
                                {t('requestBulkQuote')}
                            </h4>
                            <p className="text-xs text-stone-500">
                                Product: <strong>{product.name}</strong> · Qty: <strong>{qty}</strong>
                            </p>

                            <input
                                name="name"
                                type="text"
                                placeholder={t('businessName')}
                                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                required
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder={t('contactEmail')}
                                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                required
                            />
                            <input
                                name="phone"
                                type="tel"
                                placeholder={t('contactPhone')}
                                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl
                                           focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                            />
                            <textarea
                                name="notes"
                                placeholder="Additional notes (optional)"
                                rows={3}
                                className="w-full px-3 py-2.5 text-sm border border-stone-200 rounded-xl
                                           resize-none focus:outline-none focus:ring-2
                                           focus:ring-[var(--color-imperial)]/20"
                            />
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowQuoteForm(false)}
                                    className="flex-1 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-600
                                               hover:bg-stone-100 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={quoteSubmitting}
                                    className="flex-1 py-2.5 bg-[var(--color-imperial)] text-white rounded-xl
                                               text-sm font-semibold hover:bg-[var(--color-imperial)]/90
                                               disabled:opacity-60 transition"
                                >
                                    {quoteSubmitting ? 'Sending…' : t('submit')}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {/* Description */}
            {product.description && (
                <div className="pt-4 border-t border-stone-100">
                    <h3 className="text-sm font-semibold text-[var(--color-charcoal)] mb-2">
                        {t('description')}
                    </h3>
                    <p className="text-stone-600 text-sm leading-relaxed whitespace-pre-line">
                        {product.description}
                    </p>
                </div>
            )}
        </div>
    );
}
