/**
 * /product/[productSlug] – Product Detail Page
 * Server Component + client islands for interactive parts.
 */

import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import { getProductBySlug } from '@/lib/shop-queries';
import ProductGallery from '@/components/shop/ProductGallery';
import ProductDetailClient from '@/components/shop/ProductDetailClient';

export const revalidate = 30;

interface Props {
    params: Promise<{ productSlug: string }>;
}

export async function generateMetadata({ params }: Props) {
    const { productSlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;
    const product = await getProductBySlug(productSlug, lang);

    if (!product) return { title: 'Product Not Found' };

    return {
        title: `${product.name} – OUROZ`,
        description: product.short_description ?? product.description?.slice(0, 160),
        openGraph: {
            images: product.images[0]?.url ? [{ url: product.images[0].url }] : [],
        },
    };
}

export default async function ProductDetailPage({ params }: Props) {
    const { productSlug } = await params;
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    const product = await getProductBySlug(productSlug, lang);
    if (!product) notFound();

    const defaultVariant = product.variants[0] ?? null;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery – static server render */}
            <ProductGallery images={product.images} productName={product.name} />

            {/* Product info + interactive elements */}
            <ProductDetailClient
                product={product}
                defaultVariant={defaultVariant}
                lang={lang}
            />
        </div>
    );
}
