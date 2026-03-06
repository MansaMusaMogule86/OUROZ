'use client';
/**
 * CartDrawer – slide-in cart panel.
 */

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { XMarkIcon, TrashIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/contexts/CartContext';
import { useLang } from '@/contexts/LangContext';
import QuantitySelector from './QuantitySelector';

export default function CartDrawer() {
    const { cart, isOpen, closeCart, updateQty, removeItem } = useCart();
    const { t, isRTL } = useLang();

    const fmt = (n: number) =>
        new Intl.NumberFormat(isRTL ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency: 'AED',
            minimumFractionDigits: 2,
        }).format(n);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 z-40 transition-opacity"
                    onClick={closeCart}
                    aria-hidden="true"
                />
            )}

            {/* Drawer */}
            <aside
                role="dialog"
                aria-modal="true"
                aria-label={t('cart')}
                className={`
                    fixed top-0 ${isRTL ? 'left-0' : 'right-0'} h-full w-full max-w-md z-50
                    bg-white shadow-2xl flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : isRTL ? '-translate-x-full' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingBagIcon className="w-5 h-5 text-[var(--color-imperial)]" />
                        <h2 className="font-semibold text-[var(--color-charcoal)]">
                            {t('cart')}
                            {cart && cart.item_count > 0 && (
                                <span className="ms-2 bg-[var(--color-imperial)] text-white text-xs
                                                 px-1.5 py-0.5 rounded-full">
                                    {cart.item_count}
                                </span>
                            )}
                        </h2>
                    </div>
                    <button
                        onClick={closeCart}
                        aria-label="Close cart"
                        className="p-1.5 rounded-lg hover:bg-stone-100 transition"
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
                    {!cart || cart.items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-3">
                            <ShoppingBagIcon className="w-12 h-12" />
                            <p>{t('cartEmpty')}</p>
                            <button
                                onClick={closeCart}
                                className="text-sm text-[var(--color-imperial)] font-medium hover:underline"
                            >
                                {t('continueShopping')}
                            </button>
                        </div>
                    ) : (
                        cart.items.map(item => (
                            <div key={item.cart_item_id} className="flex gap-3">
                                {/* Image */}
                                <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[var(--color-sahara)]">
                                    {item.image_url && (
                                        <Image
                                            src={item.image_url}
                                            alt={item.product_name}
                                            fill
                                            className="object-cover"
                                            sizes="64px"
                                        />
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <Link
                                        href={`/product/${item.product_slug}`}
                                        onClick={closeCart}
                                        className="text-sm font-medium text-[var(--color-charcoal)]
                                                   hover:text-[var(--color-imperial)] line-clamp-2"
                                    >
                                        {item.product_name}
                                    </Link>
                                    {item.variant_label && (
                                        <span className="text-xs text-stone-400">{item.variant_label}</span>
                                    )}
                                    <div className="flex items-center justify-between mt-2">
                                        <QuantitySelector
                                            value={item.qty}
                                            onChange={(q) => updateQty(item.variant_id, q)}
                                            min={1}
                                        />
                                        <span className="text-sm font-semibold text-[var(--color-charcoal)]">
                                            {fmt(item.line_total)}
                                        </span>
                                    </div>
                                </div>

                                {/* Remove */}
                                <button
                                    onClick={() => removeItem(item.variant_id)}
                                    aria-label="Remove item"
                                    className="p-1.5 text-stone-400 hover:text-red-500 transition self-start"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart && cart.items.length > 0 && (
                    <div className="border-t px-5 py-4 space-y-3">
                        <div className="flex justify-between text-sm font-semibold">
                            <span>Subtotal</span>
                            <span>{fmt(cart.subtotal)}</span>
                        </div>
                        <Link
                            href="/checkout"
                            onClick={closeCart}
                            className="flex items-center justify-center w-full py-3 rounded-xl
                                       bg-[var(--color-imperial)] text-white font-semibold text-sm
                                       hover:bg-[var(--color-imperial)]/90 transition"
                        >
                            {t('checkout')}
                        </Link>
                        <Link
                            href="/cart"
                            onClick={closeCart}
                            className="flex items-center justify-center w-full py-2.5 rounded-xl
                                       border border-stone-200 text-stone-600 text-sm
                                       hover:bg-stone-50 transition"
                        >
                            View Cart
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}
