'use client';
/**
 * CartIconButton – header cart icon with item count badge.
 */

import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';

export default function CartIconButton() {
    const { cart, openCart } = useCart();
    const count = cart?.item_count ?? 0;

    return (
        <button
            onClick={openCart}
            aria-label={`Open cart${count > 0 ? `, ${count} items` : ''}`}
            className="relative p-2 rounded-xl hover:bg-stone-100 transition"
        >
            <ShoppingBagIcon className="w-5 h-5 text-[var(--color-charcoal)]" />
            {count > 0 && (
                <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] px-1
                                 flex items-center justify-center text-[10px] font-bold
                                 bg-[var(--color-imperial)] text-white rounded-full">
                    {count}
                </span>
            )}
        </button>
    );
}
