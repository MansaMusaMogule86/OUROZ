/**
 * /shop/[categorySlug] — Category product listing.
 * Supports subcategory filtering via ?sub= search param.
 * Server component with ISR; client shell handles sort/search.
 */

import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { getCategories, getCategoryBySlug, getProductCards } from '@/lib/shop-queries';
import CategoryNav from '@/components/shop/CategoryNav';
import ShopClientShell from '@/components/shop/ShopClientShell';

export const revalidate = 60;

interface Props {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<{ sub?: string; q?: string; page?: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { categorySlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;
    const category = await getCategoryBySlug(categorySlug, lang);
    if (!category) return { title: 'Category Not Found' };
    return {
        title: `${category.name} – OUROZ Shop`,
        description: category.description ?? `Shop ${category.name} at OUROZ`,
    };
}

export default async function CategoryPage({ params, searchParams }: Props) {
    const { categorySlug } = await params;
    const { sub: subcategorySlug } = await searchParams;

    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const [category, categories, { products, total }] = await Promise.all([
        getCategoryBySlug(categorySlug, lang),
        getCategories(lang),
        getProductCards({ lang, categorySlug, subcategorySlug, limit: 48 }),
    ]);

    if (!category) notFound();

    const activeSubcategory = subcategorySlug
        ? category.subcategories?.find(s => s.slug === subcategorySlug)
        : null;

    return (
        <div className="space-y-6">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-sm font-body" style={{ color: 'var(--color-charcoal)', opacity: 0.4 }}>
                <a href="/shop" className="hover:opacity-70 transition-opacity">
                    {lang === 'ar' ? 'المتجر' : lang === 'fr' ? 'Boutique' : 'Shop'}
                </a>
                <span>/</span>
                <span style={{ opacity: 0.7, color: 'var(--color-charcoal)' }}>{category.name}</span>
                {activeSubcategory && (
                    <>
                        <span>/</span>
                        <span style={{ opacity: 1, color: 'var(--color-charcoal)' }}>{activeSubcategory.name}</span>
                    </>
                )}
            </nav>

            {/* Category heading */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                    {category.icon && (
                        <span className="text-3xl">{category.icon}</span>
                    )}
                    <div>
                        <h1
                            className="font-heading"
                            style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 400, letterSpacing: '0.03em', color: 'var(--color-charcoal)' }}
                        >
                            {activeSubcategory ? activeSubcategory.name : category.name}
                        </h1>
                        {category.description && !activeSubcategory && (
                            <p className="text-sm font-body mt-0.5 max-w-xl" style={{ color: 'var(--color-charcoal)', opacity: 0.4 }}>
                                {category.description}
                            </p>
                        )}
                    </div>
                </div>
                <span className="text-xs font-body shrink-0 mt-1" style={{ color: 'var(--color-charcoal)', opacity: 0.3 }}>
                    {total} {total === 1 ? 'product' : 'products'}
                </span>
            </div>

            {/* Category + subcategory nav */}
            <Suspense fallback={null}>
                <CategoryNav categories={categories} activeSlug={categorySlug} />
            </Suspense>

            {/* Products with sort/search */}
            <ShopClientShell
                categories={categories}
                initialProducts={products}
                lang={lang}
                activeCategory={categorySlug}
            />

        </div>
    );
}
