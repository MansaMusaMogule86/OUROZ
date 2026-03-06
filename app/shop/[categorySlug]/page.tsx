/**
 * /shop/[categorySlug] – Category product listing
 * Server Component with ISR.
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { getCategories, getCategoryBySlug, getProductCards } from '@/lib/shop-queries';
import CategoryNav from '@/components/shop/CategoryNav';
import ProductGrid from '@/components/shop/ProductGrid';
import ShopTabs from '@/components/shop/ShopTabs';
import ShopClientShell from '@/components/shop/ShopClientShell';

export const revalidate = 60;

interface Props {
    params: Promise<{ categorySlug: string }>;
    searchParams: Promise<{ q?: string; page?: string }>;
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

export default async function CategoryPage({ params }: Props) {
    const { categorySlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    // Parallel fetch
    const [category, categories, { products, total }] = await Promise.all([
        getCategoryBySlug(categorySlug, lang),
        getCategories(lang),
        getProductCards({ lang, categorySlug, limit: 24 }),
    ]);

    if (!category) notFound();

    return (
        <div className="space-y-6">
            {/* Breadcrumb */}
            <nav className="text-sm text-stone-500">
                <a href="/shop" className="hover:text-[var(--color-imperial)]">
                    {lang === 'ar' ? 'المتجر' : lang === 'fr' ? 'Boutique' : 'Shop'}
                </a>
                <span className="mx-2">/</span>
                <span className="font-medium text-[var(--color-charcoal)]">{category.name}</span>
            </nav>

            {/* Category heading */}
            <div className="flex items-center gap-3">
                {category.icon && (
                    <span className="text-3xl">{category.icon}</span>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">
                        {category.name}
                    </h1>
                    {category.description && (
                        <p className="text-stone-500 text-sm mt-0.5">{category.description}</p>
                    )}
                </div>
                <span className="ms-auto text-sm text-stone-400">{total} products</span>
            </div>

            {/* Category nav */}
            <CategoryNav categories={categories} activeSlug={categorySlug} />

            {/* Products + tabs */}
            <ShopClientShell
                categories={categories}
                initialProducts={products}
                lang={lang}
                activeCategory={categorySlug}
            />
        </div>
    );
}
