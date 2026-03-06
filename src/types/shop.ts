/**
 * OUROZ Shop – TypeScript types
 * Mirrors the Supabase database schema exactly.
 */

// =====================================================
// ENUMS
// =====================================================

export type UserRole = 'customer' | 'wholesale' | 'admin';
export type WholesaleStatus = 'pending' | 'approved' | 'rejected';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type LangCode = 'en' | 'ar' | 'fr';
export type ProductStatus = 'active' | 'draft' | 'archived';

// =====================================================
// DATABASE ROW TYPES (direct table rows)
// =====================================================

export interface DbUserProfile {
    id: string;
    role: UserRole;
    full_name: string | null;
    phone: string | null;
    preferred_lang: LangCode;
    created_at: string;
    updated_at: string;
}

export interface DbBrand {
    id: string;
    slug: string;
    logo_url: string | null;
    website_url: string | null;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbBrandTranslation {
    id: string;
    brand_id: string;
    lang: LangCode;
    name: string;
}

export interface DbCategory {
    id: string;
    parent_id: string | null;
    slug: string;
    image_url: string | null;
    icon: string | null;
    sort_order: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface DbCategoryTranslation {
    id: string;
    category_id: string;
    lang: LangCode;
    name: string;
    description: string | null;
}

export interface DbProduct {
    id: string;
    slug: string;
    brand_id: string | null;
    category_id: string | null;
    base_price: number;
    compare_price: number | null;
    status: ProductStatus;
    is_retail_enabled: boolean;
    is_wholesale_enabled: boolean;
    is_featured: boolean;
    meta_image_url: string | null;
    search_vector: unknown; // TSVECTOR - not used in client
    created_at: string;
    updated_at: string;
}

export interface DbProductTranslation {
    id: string;
    product_id: string;
    lang: LangCode;
    name: string;
    description: string | null;
    short_description: string | null;
}

export interface DbProductImage {
    id: string;
    product_id: string;
    url: string;
    alt_text: string | null;
    sort_order: number;
    is_primary: boolean;
}

export interface DbProductVariant {
    id: string;
    product_id: string;
    sku: string;
    weight_grams: number | null;
    weight_label: string | null;
    size_label: string | null;
    color: string | null;
    other_attribute: string | null;
    retail_price: number;
    compare_price: number | null;
    is_active: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface DbInventory {
    id: string;
    variant_id: string;
    qty_available: number;
    qty_reserved: number;
    low_stock_threshold: number;
    track_inventory: boolean;
    allow_backorder: boolean;
    updated_at: string;
}

export interface DbPriceTier {
    id: string;
    variant_id: string;
    min_qty: number;
    price: number;
    label: string | null;
    created_at: string;
}

export interface DbWholesaleAccount {
    id: string;
    user_id: string;
    business_name: string;
    trade_license_number: string | null;
    trade_license_url: string | null;
    contact_email: string;
    contact_phone: string | null;
    business_type: string | null;
    notes: string | null;
    status: WholesaleStatus;
    reviewed_by: string | null;
    reviewed_at: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbCart {
    id: string;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface DbCartItem {
    id: string;
    cart_id: string;
    variant_id: string;
    qty: number;
    created_at: string;
    updated_at: string;
}

export interface DbOrder {
    id: string;
    user_id: string;
    order_number: string;
    shipping_name: string | null;
    shipping_address_line1: string | null;
    shipping_address_line2: string | null;
    shipping_city: string | null;
    shipping_emirate: string | null;
    shipping_country: string;
    shipping_phone: string | null;
    subtotal: number;
    shipping_cost: number;
    discount_amount: number;
    vat_amount: number;
    total: number;
    currency: string;
    is_wholesale: boolean;
    status: OrderStatus;
    payment_status: PaymentStatus;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface DbOrderItem {
    id: string;
    order_id: string;
    variant_id: string;
    product_name: string;
    variant_sku: string;
    variant_label: string | null;
    unit_price: number;
    qty: number;
    line_total: number;
    product_image_url: string | null;
    created_at: string;
}

// =====================================================
// COMPOSITE / ENRICHED TYPES (used in UI)
// =====================================================

/** Full category with current-language translation */
export interface Category extends DbCategory {
    name: string; // resolved for current lang
    description?: string;
    children?: Category[];
}

/** Full brand with current-language translation */
export interface Brand extends DbBrand {
    name: string; // resolved for current lang
}

/** Full product card – minimal fields for listing */
export interface ProductCardData {
    id: string;
    slug: string;
    name: string;
    short_description: string | null;
    primary_image: string | null;
    brand_name: string | null;
    category_name: string | null;
    base_price: number;
    compare_price: number | null;
    currency: string;
    weight_label: string | null; // from first/default variant
    is_wholesale_enabled: boolean;
    lowest_wholesale_price: number | null; // min(price_tiers.price) if wholesale
    stock_status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

/** Full product with all variants + images – for detail page */
export interface ProductDetail {
    id: string;
    slug: string;
    brand: Brand | null;
    category: Category | null;
    name: string;
    description: string | null;
    short_description: string | null;
    images: DbProductImage[];
    variants: ProductVariantDetail[];
    is_retail_enabled: boolean;
    is_wholesale_enabled: boolean;
    base_price: number;
    compare_price: number | null;
}

export interface ProductVariantDetail extends DbProductVariant {
    inventory: DbInventory | null;
    price_tiers: DbPriceTier[];
    is_in_stock: boolean;
    effective_price: number; // retail_price or computed from tier
}

/** Cart item with enriched product info */
export interface CartItemEnriched {
    cart_item_id: string;
    variant_id: string;
    qty: number;
    product_id: string;
    product_name: string;
    product_slug: string;
    variant_sku: string;
    variant_label: string | null;
    image_url: string | null;
    unit_price: number;
    line_total: number;
}

/** Cart with enriched items */
export interface CartData {
    cart_id: string;
    items: CartItemEnriched[];
    subtotal: number;
    item_count: number;
}

// =====================================================
// UI STATE TYPES
// =====================================================

export interface ShopTab {
    id: 'retail' | 'wholesale';
    labelKey: string;
}

export interface SearchResult {
    products: ProductCardData[];
    total: number;
    query: string;
    resolved_query: string; // after synonym mapping
}

export interface WholesaleApplyFormData {
    business_name: string;
    trade_license_number: string;
    trade_license_url: string;
    contact_email: string;
    contact_phone: string;
    business_type: string;
}

export interface BulkQuoteFormData {
    product_id: string;
    variant_id: string;
    requested_qty: number;
    contact_name: string;
    contact_email: string;
    contact_phone: string;
    notes: string;
}

// =====================================================
// SUPABASE DATABASE GENERIC TYPE
// =====================================================

export type Database = {
    public: {
        Tables: {
            user_profiles: { Row: DbUserProfile };
            brands: { Row: DbBrand };
            brand_translations: { Row: DbBrandTranslation };
            categories: { Row: DbCategory };
            category_translations: { Row: DbCategoryTranslation };
            products: { Row: DbProduct };
            product_translations: { Row: DbProductTranslation };
            product_images: { Row: DbProductImage };
            product_variants: { Row: DbProductVariant };
            inventory: { Row: DbInventory };
            price_tiers: { Row: DbPriceTier };
            wholesale_accounts: { Row: DbWholesaleAccount };
            carts: { Row: DbCart };
            cart_items: { Row: DbCartItem };
            orders: { Row: DbOrder };
            order_items: { Row: DbOrderItem };
        };
    };
};
