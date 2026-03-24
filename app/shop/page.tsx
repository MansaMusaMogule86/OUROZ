import { Suspense } from 'react';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { fetchCategories, fetchBrands } from '@/lib/api';
import ShopPageClient from '@/components/shop/ShopPageClient';
import BrandTicker from '@/components/shop/BrandTicker';

export const revalidate = 60; 

export default async function ShopPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const [categories, brands] = await Promise.all([
        fetchCategories(),
        fetchBrands(),
    ]);

    const headline = {
        en: 'Authentic Moroccan Provisions',
        ar: 'المؤن المغربية الأصيلة',
        fr: 'Provisions Marocaines Authentiques',
    }[lang];

    const subheadline = {
        en: 'Sourced directly from cooperatives and producers across the Atlas.',
        ar: 'مصدرها مباشرة من التعاونيات والمنتجين في جميع أنحاء الأطلس.',
        fr: 'Provenant directement de coopératives et de producteurs de l\'Atlas.',
    }[lang];

    return (
        <div className="space-y-16">
            {/* ── Minimalist Page Header ───────────────────────────────────── */}
            <section className="text-center pt-8 pb-4">
                <h1 className="text-5xl md:text-6xl font-serif text-[#1A1A1A] mb-4 font-normal tracking-tight">
                    {headline}
                </h1>
                <p className="text-[#1A1A1A]/40 text-lg font-sans max-w-2xl mx-auto leading-relaxed">
                    {subheadline}
                </p>
            </section>

            {/* ── Shop Client Shell (tabs + search + filters + grid + pagination) */}
            <Suspense
                fallback={
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-2 rounded-full animate-spin border-[#1A1A1A]/5 border-t-[#1A1A1A]/40" />
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
