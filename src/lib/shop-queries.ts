/**
 * OUROZ – Shop query helpers
 * Used by Next.js Server Components and API routes.
 * All functions return typed data via Supabase.
 */

import { createServerClient } from './supabase';
import type {
    LangCode,
    ProductCardData,
    ProductDetail,
    Category,
    Brand,
    SearchResult,
    DbPriceTier,
    DbProductImage,
    DbProductVariant,
    DbInventory,
} from '@/types/shop';

const DEFAULT_CURRENCY = 'AED';

// =====================================================
// CATEGORIES
// =====================================================

export async function getCategories(lang: LangCode = 'en'): Promise<Category[]> {
    const db = createServerClient();

    const { data: cats, error } = await db
        .from('categories')
        .select(`
            *,
            category_translations!inner(name, description)
        `)
        .eq('is_active', true)
        .eq('category_translations.lang', lang)
        .order('sort_order', { ascending: true });

    if (error) throw new Error(`getCategories: ${error.message}`);

    return (cats ?? []).map(c => ({
        ...c,
        name: (c.category_translations as any[])[0]?.name ?? c.slug,
        description: (c.category_translations as any[])[0]?.description ?? null,
    }));
}

export async function getCategoryBySlug(
    slug: string,
    lang: LangCode = 'en'
): Promise<Category | null> {
    const db = createServerClient();

    const { data, error } = await db
        .from('categories')
        .select(`*, category_translations!inner(name, description)`)
        .eq('slug', slug)
        .eq('is_active', true)
        .eq('category_translations.lang', lang)
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!data) return null;

    return {
        ...data,
        name: (data.category_translations as any[])[0]?.name ?? slug,
        description: (data.category_translations as any[])[0]?.description ?? null,
    };
}

// =====================================================
// PRODUCTS LIST
// =====================================================

export async function getProductCards(opts: {
    lang?: LangCode;
    categorySlug?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
}): Promise<{ products: ProductCardData[]; total: number }> {
    const {
        lang = 'en',
        categorySlug,
        featured,
        limit = 24,
        offset = 0,
    } = opts;

    const db = createServerClient();

    let query = db
        .from('products')
        .select(`
            id, slug, base_price, compare_price,
            is_wholesale_enabled, is_retail_enabled,
            product_translations!inner(name, short_description, lang),
            product_images(url, is_primary, sort_order),
            brands(id, brand_translations(name, lang)),
            categories(id, slug, category_translations(name, lang)),
            product_variants!inner(
                id, retail_price, weight_label, is_active,
                inventory(qty_available, low_stock_threshold, track_inventory)
            )
        `, { count: 'exact' })
        .eq('status', 'active')
        .eq('product_translations.lang', lang)
        .eq('product_variants.is_active', true)
        .order('is_featured', { ascending: false })
        .range(offset, offset + limit - 1);

    if (categorySlug) {
        // Join through categories to filter by slug
        query = query.eq('categories.slug', categorySlug);
    }

    if (featured === true) {
        query = query.eq('is_featured', true);
    }

    const { data, error, count } = await query;
    if (error) throw new Error(`getProductCards: ${error.message}`);

    const products: ProductCardData[] = (data ?? []).map(p => {
        const translation = (p.product_translations as any[])[0];
        const primaryImage = ((p.product_images as any[]) ?? []).find(i => i.is_primary)
            ?? ((p.product_images as any[]) ?? [])[0];
        const brandTranslation = (p.brands as any)?.brand_translations
            ? ((p.brands as any).brand_translations as any[]).find(b => b.lang === lang)
                ?? (p.brands as any).brand_translations[0]
            : null;
        const categoryTranslation = (p.categories as any)?.category_translations
            ? ((p.categories as any).category_translations as any[]).find(c => c.lang === lang)
                ?? (p.categories as any).category_translations[0]
            : null;

        // Get first active variant for default price
        const firstVariant = (p.product_variants as any[])[0];
        const inventory = firstVariant?.inventory?.[0];

        let stock: ProductCardData['stock_status'] = 'in_stock';
        if (inventory?.track_inventory) {
            const avail = inventory.qty_available;
            if (avail <= 0) stock = 'out_of_stock';
            else if (avail <= inventory.low_stock_threshold) stock = 'low_stock';
        }

        return {
            id: p.id,
            slug: p.slug,
            name: translation?.name ?? p.slug,
            short_description: translation?.short_description ?? null,
            primary_image: primaryImage?.url ?? null,
            brand_name: brandTranslation?.name ?? null,
            category_name: categoryTranslation?.name ?? null,
            base_price: Number(p.base_price),
            compare_price: p.compare_price ? Number(p.compare_price) : null,
            currency: DEFAULT_CURRENCY,
            weight_label: firstVariant?.weight_label ?? null,
            is_wholesale_enabled: p.is_wholesale_enabled,
            lowest_wholesale_price: null, // populated separately for wholesale users
            stock_status: stock,
        };
    });

    return { products, total: count ?? 0 };
}

// =====================================================
// SINGLE PRODUCT DETAIL
// =====================================================

export async function getProductBySlug(
    slug: string,
    lang: LangCode = 'en'
): Promise<ProductDetail | null> {
    const db = createServerClient();

    const { data: p, error } = await db
        .from('products')
        .select(`
            *,
            product_translations(id, lang, name, description, short_description),
            product_images(id, url, alt_text, sort_order, is_primary),
            brands(*, brand_translations(name, lang)),
            categories(*, category_translations(name, description, lang)),
            product_variants(
                *,
                inventory(*),
                price_tiers(*)
            )
        `)
        .eq('slug', slug)
        .eq('status', 'active')
        .single();

    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!p) return null;

    const translation = (p.product_translations as any[]).find(t => t.lang === lang)
        ?? (p.product_translations as any[])[0];

    const brandTranslation = p.brands
        ? ((p.brands as any).brand_translations as any[]).find((b: any) => b.lang === lang)
            ?? (p.brands as any).brand_translations[0]
        : null;

    const brand: Brand | null = p.brands ? {
        ...(p.brands as any),
        name: brandTranslation?.name ?? (p.brands as any).slug,
    } : null;

    const categoryTranslation = p.categories
        ? ((p.categories as any).category_translations as any[]).find((c: any) => c.lang === lang)
            ?? (p.categories as any).category_translations[0]
        : null;

    const category: Category | null = p.categories ? {
        ...(p.categories as any),
        name: categoryTranslation?.name ?? (p.categories as any).slug,
        description: categoryTranslation?.description ?? null,
    } : null;

    const images: DbProductImage[] = ((p.product_images as any[]) ?? [])
        .sort((a, b) => a.sort_order - b.sort_order);

    const variants = ((p.product_variants as any[]) ?? [])
        .filter(v => v.is_active)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map(v => {
            const inv: DbInventory | null = (v.inventory as any[])?.[0] ?? null;
            const tiers: DbPriceTier[] = (v.price_tiers as any[]) ?? [];

            const isInStock = !inv?.track_inventory
                ? true
                : (inv.qty_available > 0 || inv.allow_backorder);

            return {
                ...v,
                retail_price: Number(v.retail_price),
                compare_price: v.compare_price ? Number(v.compare_price) : null,
                inventory: inv,
                price_tiers: tiers.sort((a, b) => a.min_qty - b.min_qty).map(t => ({
                    ...t,
                    price: Number(t.price),
                })),
                is_in_stock: isInStock,
                effective_price: Number(v.retail_price),
            };
        });

    return {
        id: p.id,
        slug: p.slug,
        brand,
        category,
        name: translation?.name ?? p.slug,
        description: translation?.description ?? null,
        short_description: translation?.short_description ?? null,
        images,
        variants,
        is_retail_enabled: p.is_retail_enabled,
        is_wholesale_enabled: p.is_wholesale_enabled,
        base_price: Number(p.base_price),
        compare_price: p.compare_price ? Number(p.compare_price) : null,
    };
}

// =====================================================
// SEARCH
// =====================================================

export async function searchProducts(
    rawQuery: string,
    lang: LangCode = 'en',
    limit = 20
): Promise<SearchResult> {
    const db = createServerClient();

    // Step 1: Resolve synonyms
    const { data: synonymRow } = await db
        .from('search_synonyms')
        .select('canonical')
        .ilike('keyword', rawQuery.trim())
        .or(`lang.eq.${lang},lang.is.null`)
        .limit(1)
        .single();

    const resolvedQuery = synonymRow?.canonical ?? rawQuery.trim();

    // Step 2: Full-text search on product search_vector
    const { data, error } = await db
        .from('products')
        .select(`
            id, slug, base_price, compare_price, is_wholesale_enabled,
            product_translations!inner(name, short_description, lang),
            product_images(url, is_primary),
            product_variants(weight_label, retail_price, is_active)
        `)
        .eq('status', 'active')
        .eq('product_translations.lang', lang)
        .textSearch('search_vector', resolvedQuery, {
            type: 'websearch',
            config: 'simple',
        })
        .limit(limit);

    if (error) {
        // Graceful fallback: ILIKE on translation name
        const { data: fallbackData } = await db
            .from('product_translations')
            .select(`
                product_id,
                name,
                products!inner(id, slug, base_price, is_wholesale_enabled, product_images(url, is_primary))
            `)
            .eq('lang', lang)
            .ilike('name', `%${resolvedQuery}%`)
            .limit(limit);

        const products: ProductCardData[] = (fallbackData ?? []).map(t => ({
            id: (t.products as any).id,
            slug: (t.products as any).slug,
            name: t.name,
            short_description: null,
            primary_image: ((t.products as any).product_images as any[])?.find((i: any) => i.is_primary)?.url ?? null,
            brand_name: null,
            category_name: null,
            base_price: Number((t.products as any).base_price),
            compare_price: null,
            currency: DEFAULT_CURRENCY,
            weight_label: null,
            is_wholesale_enabled: (t.products as any).is_wholesale_enabled,
            lowest_wholesale_price: null,
            stock_status: 'in_stock',
        }));

        return { products, total: products.length, query: rawQuery, resolved_query: resolvedQuery };
    }

    const products: ProductCardData[] = (data ?? []).map(p => {
        const translation = (p.product_translations as any[])[0];
        const primaryImage = ((p.product_images as any[]) ?? []).find(i => i.is_primary)
            ?? ((p.product_images as any[]) ?? [])[0];
        const firstActiveVariant = ((p.product_variants as any[]) ?? []).find(v => v.is_active);
        return {
            id: p.id,
            slug: p.slug,
            name: translation?.name ?? p.slug,
            short_description: translation?.short_description ?? null,
            primary_image: primaryImage?.url ?? null,
            brand_name: null,
            category_name: null,
            base_price: Number(p.base_price),
            compare_price: p.compare_price ? Number(p.compare_price) : null,
            currency: DEFAULT_CURRENCY,
            weight_label: firstActiveVariant?.weight_label ?? null,
            is_wholesale_enabled: p.is_wholesale_enabled,
            lowest_wholesale_price: null,
            stock_status: 'in_stock',
        };
    });

    return { products, total: products.length, query: rawQuery, resolved_query: resolvedQuery };
}
