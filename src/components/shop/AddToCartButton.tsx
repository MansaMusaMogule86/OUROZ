'use client';
/**
 * AddToCartButton – with loading + success states.
 */

import React, { useState } from 'react';
import { ShoppingCartIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LangContext';
import type { ProductVariantDetail } from '@/types/shop';

interface AddToCartButtonProps {
    variant: ProductVariantDetail;
    qty: number;
    productName: string;
    productSlug: string;
    primaryImage: string | null;
    disabled?: boolean;
    className?: string;
}

export default function AddToCartButton({
    variant,
    qty,
    productName,
    productSlug,
    primaryImage,
    disabled = false,
    className = '',
}: AddToCartButtonProps) {
    const { addItem, openCart } = useCart();
    const { t } = useLang();
    const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

    const isOutOfStock = !variant.is_in_stock;

    const handleClick = async () => {
        if (state !== 'idle' || isOutOfStock || disabled) return;

        setState('loading');
        try {
            await addItem({
                variantId: variant.id,
                qty,
                name: productName,
                image: primaryImage,
                sku: variant.sku,
                label: variant.weight_label,
                price: variant.retail_price,
                productId: variant.product_id,
                productSlug,
            });
            setState('done');
            openCart();
            setTimeout(() => setState('idle'), 2500);
        } catch {
            setState('idle');
        }
    };

    const labels = {
        idle: (
            <>
                <ShoppingCartIcon className="w-5 h-5" />
                {t('addToCart')}
            </>
        ),
        loading: (
            <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                {t('addingToCart')}
            </>
        ),
        done: (
            <>
                <CheckIcon className="w-5 h-5" />
                {t('addedToCart')}
            </>
        ),
    };

    if (isOutOfStock) {
        return (
            <button
                disabled
                className={`
                    flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                    bg-stone-200 text-stone-400 text-sm font-semibold cursor-not-allowed
                    ${className}
                `}
            >
                {t('outOfStock')}
            </button>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={state !== 'idle' || disabled}
            className={`
                flex items-center justify-center gap-2 px-6 py-3 rounded-xl
                text-sm font-semibold transition-all duration-200 select-none
                ${state === 'done'
                    ? 'bg-[var(--color-zellige)] text-white'
                    : 'bg-[var(--color-imperial)] text-white hover:bg-[var(--color-imperial)]/90 active:scale-[0.98]'
                }
                disabled:opacity-70 disabled:cursor-not-allowed
                ${className}
            `}
        >
            {labels[state]}
        </button>
    );
}
