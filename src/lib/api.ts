/**
 * OUROZ – Centralized Supabase API layer (V2 schema)
 * Targets tables defined in supabase/migrations/010_shop_v2_schema.sql
 *
 * Import from here instead of writing inline supabase queries in hooks/components.
 */

import { supabase } from '@/lib/supabase';

// =============================================================================
// V2 Row Types  (mirror 010_shop_v2_schema.sql exactly)
// =============================================================================

export interface V2UserProfile {
    id: string;
    user_id: string;
    role: 'customer' | 'wholesale' | 'admin';
    full_name: string | null;
    phone: string | null;
    created_at: string;
    updated_at: string;
}

export interface V2Brand {
    id: string;
    slug: string;
    name: string;
    name_ar: string | null;
    name_fr: string | null;
    logo_url: string | null;
    is_active: boolean;
    created_at: string;
}

export interface V2Category {
    id: string;
    slug: string;
    parent_id: string | null;
    name: string;
    name_ar: string | null;
    name_fr: string | null;
    icon: string | null;
    image_url: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
}

export interface V2PriceTier {
    id?: string;
    variant_id?: string;
    min_quantity: number;
    price: number;
    label: string | null;
}

export interface V2Variant {
    id: string;
    product_id: string;
    sku: string;
    weight: string | null;
    weight_grams: number | null;
    size_label: string | null;
    retail_price: number;
    compare_price: number | null;
    stock_quantity: number;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface V2Product {
    id: string;
    slug: string;
    brand_id: string | null;
    category_id: string | null;
    name: string;
    name_ar: string | null;
    name_fr: string | null;
    description: string | null;
    description_ar: string | null;
    description_fr: string | null;
    base_price: number;
    compare_price: number | null;
    image_urls: string[];
    is_active: boolean;
    is_featured: boolean;
    is_wholesale_enabled: boolean;
    created_at: string;
    updated_at: string;
}

/** Product enriched with brand, category, variants, and tiers — for listings */
export interface V2ProductCard extends V2Product {
    brand: Pick<V2Brand, 'id' | 'slug' | 'name' | 'name_ar' | 'name_fr' | 'logo_url'> | null;
    category: Pick<V2Category, 'id' | 'slug' | 'name' | 'name_ar' | 'name_fr'> | null;
    variants: Array<
        Pick<V2Variant, 'id' | 'sku' | 'weight' | 'retail_price' | 'compare_price' | 'stock_quantity' | 'is_active' | 'sort_order'> & {
            price_tiers: Pick<V2PriceTier, 'min_quantity' | 'price' | 'label'>[];
        }
    >;
}

export interface V2WholesaleApplication {
    id: string;
    user_id: string;
    business_name: string;
    license_url: string | null;
    business_type: string | null;
    contact_email: string;
    contact_phone: string | null;
    admin_notes: string | null;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface V2CartItem {
    id: string;
    cart_id: string;
    variant_id: string;
    quantity: number;
    created_at: string;
    updated_at: string;
}

/** Cart item joined with its variant and parent product */
export interface V2CartItemEnriched extends V2CartItem {
    variant: V2Variant & {
        product: Pick<V2Product, 'id' | 'slug' | 'name' | 'name_ar' | 'name_fr' | 'image_urls'>;
        price_tiers: Pick<V2PriceTier, 'min_quantity' | 'price' | 'label'>[];
    };
}

export interface V2Order {
    id: string;
    user_id: string;
    order_number: string;
    subtotal: number;
    shipping_cost: number;
    vat_amount: number;
    total: number;
    currency: string;
    is_wholesale: boolean;
    status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shipping_name: string | null;
    shipping_phone: string | null;
    shipping_address: string | null;
    shipping_emirate: string | null;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface V2OrderItem {
    id: string;
    order_id: string;
    variant_id: string;
    product_name: string;
    variant_sku: string;
    variant_label: string | null;
    product_image_url: string | null;
    price_at_purchase: number;
    quantity: number;
    line_total: number;
    created_at: string;
}

// =============================================================================
// Filters
// =============================================================================

export interface ProductFilters {
    category_id?: string | null;
    brand_id?: string | null;
    search?: string | null;
    is_featured?: boolean;
    is_wholesale_enabled?: boolean;
    page?: number;
    limit?: number;
}

// =============================================================================
// Shared join selector strings
// =============================================================================

const PRODUCT_CARD_SELECT = `
    *,
    brand:brand_id ( id, slug, name, name_ar, name_fr, logo_url ),
    category:category_id ( id, slug, name, name_ar, name_fr ),
    variants:product_variants (
        id, sku, weight, retail_price, compare_price,
        stock_quantity, is_active, sort_order,
        price_tiers ( min_quantity, price, label )
    )
` as const;

// =============================================================================
// User Profile
// =============================================================================

export async function fetchUserProfile(userId: string): Promise<V2UserProfile | null> {
    const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error || !data) return null;
    return data as V2UserProfile;
}

// =============================================================================
// Wholesale Applications
// =============================================================================

export async function fetchWholesaleApplication(
    userId: string
): Promise<V2WholesaleApplication | null> {
    const { data, error } = await supabase
        .from('wholesale_applications')
        .select('*')
        .eq('user_id', userId)
        .single();
    if (error || !data) return null;
    return data as V2WholesaleApplication;
}

export async function submitWholesaleApplication(
    payload: Pick<
        V2WholesaleApplication,
        'user_id' | 'business_name' | 'contact_email' | 'contact_phone' | 'business_type' | 'license_url'
    >
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
        .from('wholesale_applications')
        .insert(payload);
    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

// =============================================================================
// Categories & Brands
// =============================================================================

export async function fetchCategories(): Promise<V2Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
    if (error || !data) return [];
    return data as V2Category[];
}

export async function fetchBrands(): Promise<V2Brand[]> {
    const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true });
    if (error || !data) return [];
    return data as V2Brand[];
}

// =============================================================================
// Products
// =============================================================================

export async function fetchProducts(
    filters: ProductFilters = {}
): Promise<{ products: V2ProductCard[]; total: number }> {
    const {
        page = 1,
        limit = 24,
        category_id,
        brand_id,
        search,
        is_featured,
        is_wholesale_enabled,
    } = filters;

    const from = (page - 1) * limit;
    const to   = from + limit - 1;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query: any = supabase
        .from('products')
        .select(PRODUCT_CARD_SELECT, { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(from, to);

    if (category_id)                 query = query.eq('category_id', category_id);
    if (brand_id)                     query = query.eq('brand_id', brand_id);
    if (is_featured)                  query = query.eq('is_featured', true);
    if (is_wholesale_enabled != null) query = query.eq('is_wholesale_enabled', is_wholesale_enabled);

    if (search?.trim()) {
        // Full-text search via the search_vector tsvector column
        query = query.textSearch('search_vector', search.trim(), {
            type: 'websearch',
            config: 'simple',
        });
    }

    const { data, error, count } = await query;
    if (error || !data) return { products: [], total: 0 };
    return { products: data as V2ProductCard[], total: count ?? 0 };
}

/**
 * Keyword search: consults search_keywords table first (multilingual synonyms),
 * then falls back to direct ILIKE on product name.
 */
export async function fetchProductsByKeyword(
    keyword: string,
    limit = 24
): Promise<V2ProductCard[]> {
    // Step 1: resolve keyword → product_id via search_keywords
    const { data: kwRows } = await supabase
        .from('search_keywords')
        .select('product_id')
        .ilike('keyword', `%${keyword}%`);

    const resolvedIds = (kwRows ?? []).map((r: { product_id: string }) => r.product_id);

    if (resolvedIds.length > 0) {
        const { data } = await supabase
            .from('products')
            .select(PRODUCT_CARD_SELECT)
            .in('id', resolvedIds)
            .eq('is_active', true)
            .limit(limit);
        if (data?.length) return data as V2ProductCard[];
    }

    // Step 2: ILIKE fallback against name / name_ar / name_fr
    const { data } = await supabase
        .from('products')
        .select(PRODUCT_CARD_SELECT)
        .or(`name.ilike.%${keyword}%,name_ar.ilike.%${keyword}%,name_fr.ilike.%${keyword}%`)
        .eq('is_active', true)
        .limit(limit);

    return (data as V2ProductCard[]) ?? [];
}

export async function fetchProductBySlug(slug: string): Promise<V2ProductCard | null> {
    const { data, error } = await supabase
        .from('products')
        .select(PRODUCT_CARD_SELECT)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
    if (error || !data) return null;
    return data as V2ProductCard;
}

// =============================================================================
// Cart
// =============================================================================

/** Get or create the authenticated user's cart. Returns the cart UUID. */
export async function getOrCreateCart(userId: string): Promise<string | null> {
    const { data: existing } = await supabase
        .from('carts')
        .select('id')
        .eq('user_id', userId)
        .single();

    if (existing) return (existing as { id: string }).id;

    const { data: newCart, error } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select('id')
        .single();

    if (error || !newCart) return null;
    return (newCart as { id: string }).id;
}

export async function fetchCartItems(cartId: string): Promise<V2CartItemEnriched[]> {
    const { data, error } = await supabase
        .from('cart_items')
        .select(
            `*,
             variant:variant_id (
                 *,
                 product:product_id ( id, slug, name, name_ar, name_fr, image_urls ),
                 price_tiers ( min_quantity, price, label )
             )`
        )
        .eq('cart_id', cartId);

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any as V2CartItemEnriched[];
}

/** Add or update a cart item. Quantity must already be stock-validated by the caller. */
export async function upsertCartItem(
    cartId: string,
    variantId: string,
    quantity: number
): Promise<boolean> {
    const { error } = await supabase
        .from('cart_items')
        .upsert(
            { cart_id: cartId, variant_id: variantId, quantity },
            { onConflict: 'cart_id,variant_id' }
        );
    return !error;
}

export async function removeCartItem(cartId: string, variantId: string): Promise<boolean> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)
        .eq('variant_id', variantId);
    return !error;
}

export async function clearCartItems(cartId: string): Promise<boolean> {
    const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId);
    return !error;
}

/** Fetch current stock for a variant (for pre-add validation). */
export async function fetchVariantStock(variantId: string): Promise<number> {
    const { data } = await supabase
        .from('product_variants')
        .select('stock_quantity')
        .eq('id', variantId)
        .single();
    return (data as { stock_quantity: number } | null)?.stock_quantity ?? 0;
}

// =============================================================================
// Orders
// =============================================================================

export async function fetchUserOrders(
    userId: string
): Promise<Array<V2Order & { order_items: V2OrderItem[] }>> {
    const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data as any;
}
