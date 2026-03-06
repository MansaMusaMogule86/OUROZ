/**
 * OUROZ – /shop layout
 * Shared nav header for all shop pages.
 * Server component – reads lang from cookie.
 */

import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { ShoppingBagIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import type { LangCode } from '@/types/shop';
import LanguageSwitcher from '@/components/shop/LanguageSwitcher';
import CartIconButton from '@/components/shop/CartIconButton';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const logoText = lang === 'ar' ? 'أوروز' : 'OUROZ';
    const shopText = lang === 'ar' ? 'المتجر' : lang === 'fr' ? 'Boutique' : 'Shop';

    return (
        <div className="min-h-screen">
            {/* Top Nav */}
            <header className="sticky top-0 z-30 bg-[var(--color-sahara)]/95 backdrop-blur border-b border-stone-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
                    {/* Logo */}
                    <Link href="/" className="text-xl font-bold tracking-tight text-[var(--color-charcoal)]">
                        {logoText}
                        <span className="text-[var(--color-imperial)] ms-1.5 text-sm font-normal">
                            {shopText}
                        </span>
                    </Link>

                    {/* Search bar (desktop) */}
                    <Link
                        href="/shop/search"
                        className="hidden md:flex items-center gap-2 flex-1 max-w-md px-3.5 py-2
                                   bg-stone-100 rounded-xl text-stone-400 text-sm
                                   hover:bg-stone-200 transition"
                    >
                        <MagnifyingGlassIcon className="w-4 h-4" />
                        <span>
                            {lang === 'ar' ? '…ابحث عن منتجات' : lang === 'fr' ? 'Rechercher…' : 'Search products…'}
                        </span>
                    </Link>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <CartIconButton />
                    </div>
                </div>
            </header>

            {/* Page content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
                {children}
            </main>
        </div>
    );
}
