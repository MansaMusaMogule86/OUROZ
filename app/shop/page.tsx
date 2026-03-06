/**
 * /shop – Main shop homepage (Server Component)
 *
 * SSR-fetches categories + brands for the filter sidebar and CategoryNav.
 * All product fetching is delegated to ShopPageClient (client-side) so filters,
 * search, and pagination work without full-page reloads.
 */

import { Suspense } from 'react';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { fetchCategories, fetchBrands } from '@/lib/api';
import ShopPageClient from '@/components/shop/ShopPageClient';
import BrandTicker from '@/components/shop/BrandTicker';

export const revalidate = 60; // ISR – revalidate every 60 seconds

export default async function ShopPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    // Parallel SSR fetch — categories + brands populate the filter sidebar
    const [categories, brands] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
    ]);

    const headline = {
        en: 'Authentic Moroccan Products',
        ar: 'منتجات مغربية أصيلة',
        fr: 'Produits Marocains Authentiques',
    }[lang];

    const subheadline = {
        en: 'Delivered fresh to your door in Dubai',
        ar: 'توصيل إلى بابك في دبي',
        fr: 'Livraison fraîche à votre porte à Dubaï',
    }[lang];

    return (
        <div className="space-y-8">
            {/* ── Hero Banner ──────────────────────────────────────────────── */}
            <section
                className="
                    relative rounded-3xl overflow-hidden
                    bg-gradient-to-br from-[var(--color-imperial)]/90 to-[var(--color-charcoal)]
                    text-white py-12 px-6 md:px-12
                "
            >
                <div className="relative z-10 text-center md:text-start">
                    <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-gold)] mb-2">
                        OUROZ – دبي
                    </p>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
                        {headline}
                    </h1>
                    <p className="text-white/70 max-w-md">{subheadline}</p>
                </div>

                {/* Zellige decorative pattern */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'url(/patterns/zellige.svg)',
                        backgroundSize: '80px',
                    }}
                />
            </section>

            {/* ── Shop Client Shell (tabs + search + filters + grid + pagination) */}
            <Suspense
                fallback={
                    <div className="flex justify-center py-20">
                        <div
                            className="
                                w-8 h-8 border-4 rounded-full animate-spin
                                border-[var(--color-imperial)]/20
                                border-t-[var(--color-imperial)]
                            "
                        />
                    </div>
                }
            >
                <ShopPageClient
                    categories={categories}
                    brands={brands}
                    lang={lang}
                />
            </Suspense>

            <BrandTicker brands={brands} />
        </div>
    );
}
