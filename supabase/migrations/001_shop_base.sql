-- =====================================================
-- OUROZ Shop - Migration 001: Base Schema
-- Supabase PostgreSQL Migration
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =====================================================
-- ENUMS
-- =====================================================

CREATE TYPE user_role AS ENUM ('customer', 'wholesale', 'admin');
CREATE TYPE wholesale_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
CREATE TYPE lang_code AS ENUM ('en', 'ar', 'fr');
CREATE TYPE product_status AS ENUM ('active', 'draft', 'archived');

-- =====================================================
-- TABLE: user_profiles
-- Extends Supabase auth.users
-- =====================================================

CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'customer',
    full_name VARCHAR(255),
    phone VARCHAR(50),
    preferred_lang lang_code DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger: auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.user_profiles (id, role, full_name)
    VALUES (NEW.id, 'customer', NEW.raw_user_meta_data->>'full_name');
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- =====================================================
-- TABLE: brands
-- =====================================================

CREATE TABLE brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) NOT NULL UNIQUE,
    logo_url VARCHAR(500),
    website_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brands_slug ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active) WHERE is_active = TRUE;

-- =====================================================
-- TABLE: brand_translations
-- =====================================================

CREATE TABLE brand_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID NOT NULL REFERENCES brands(id) ON DELETE CASCADE,
    lang lang_code NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(brand_id, lang)
);

CREATE INDEX idx_brand_translations_brand ON brand_translations(brand_id);
CREATE INDEX idx_brand_translations_lang ON brand_translations(lang);

-- =====================================================
-- TABLE: categories
-- Supports nesting via parent_id
-- =====================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    image_url VARCHAR(500),
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active, sort_order) WHERE is_active = TRUE;

-- =====================================================
-- TABLE: category_translations
-- =====================================================

CREATE TABLE category_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    lang lang_code NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(category_id, lang)
);

CREATE INDEX idx_category_translations_category ON category_translations(category_id);
CREATE INDEX idx_category_translations_lang ON category_translations(lang);

-- =====================================================
-- TABLE: products
-- =====================================================

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) NOT NULL UNIQUE,
    brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

    -- Pricing (base retail, overridden by variants)
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 0,
    compare_price DECIMAL(10, 2), -- for showing "was" price

    -- Flags
    status product_status NOT NULL DEFAULT 'active',
    is_retail_enabled BOOLEAN DEFAULT TRUE,
    is_wholesale_enabled BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,

    -- SEO
    meta_image_url VARCHAR(500),

    -- Full-text search vector (updated via trigger)
    search_vector TSVECTOR,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Standard indexes
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_status ON products(status) WHERE status = 'active';
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;

-- Full-text search index
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Trigram index for fuzzy search (supports Arabic/French partial matches)
CREATE INDEX idx_products_slug_trgm ON products USING GIN(slug gin_trgm_ops);

-- =====================================================
-- TABLE: product_translations
-- =====================================================

CREATE TABLE product_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    lang lang_code NOT NULL,
    name VARCHAR(500) NOT NULL,
    description TEXT,
    short_description VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(product_id, lang)
);

CREATE INDEX idx_product_translations_product ON product_translations(product_id);
CREATE INDEX idx_product_translations_lang ON product_translations(lang);

-- Full-text index on translations (covers all languages)
CREATE INDEX idx_product_translations_name_search
    ON product_translations USING GIN(to_tsvector('simple', unaccent(name)));

-- Trigram for partial/fuzzy match across languages
CREATE INDEX idx_product_translations_name_trgm
    ON product_translations USING GIN(unaccent(name) gin_trgm_ops);

-- =====================================================
-- TABLE: product_images
-- =====================================================

CREATE TABLE product_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_product_images_product ON product_images(product_id);
CREATE INDEX idx_product_images_sort ON product_images(product_id, sort_order);

-- =====================================================
-- TABLE: product_variants
-- Size / weight / SKU per product
-- =====================================================

CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) NOT NULL UNIQUE,

    -- Variant attributes
    weight_grams INTEGER, -- e.g. 500, 1000
    weight_label VARCHAR(50), -- e.g. "500g", "1kg", "250ml"
    size_label VARCHAR(50), -- e.g. "S", "M", "L", "XL"
    color VARCHAR(50),
    other_attribute VARCHAR(100), -- catch-all for other variants

    -- Pricing
    retail_price DECIMAL(10, 2) NOT NULL,
    compare_price DECIMAL(10, 2),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_variants_sku ON product_variants(sku);
CREATE INDEX idx_variants_product ON product_variants(product_id);
CREATE INDEX idx_variants_active ON product_variants(product_id, is_active) WHERE is_active = TRUE;

-- =====================================================
-- TABLE: inventory
-- Stock per variant
-- =====================================================

CREATE TABLE inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL UNIQUE REFERENCES product_variants(id) ON DELETE CASCADE,
    qty_available INTEGER NOT NULL DEFAULT 0,
    qty_reserved INTEGER NOT NULL DEFAULT 0, -- held in cart/pending orders
    low_stock_threshold INTEGER DEFAULT 10,
    track_inventory BOOLEAN DEFAULT TRUE,
    allow_backorder BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    CONSTRAINT qty_available_non_negative CHECK (qty_available >= 0),
    CONSTRAINT qty_reserved_non_negative CHECK (qty_reserved >= 0)
);

CREATE INDEX idx_inventory_variant ON inventory(variant_id);

-- =====================================================
-- TABLE: price_tiers
-- Wholesale tiered pricing per variant
-- =====================================================

CREATE TABLE price_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    min_qty INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    label VARCHAR(100), -- Optional display label e.g. "Carton of 12"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(variant_id, min_qty),
    CONSTRAINT min_qty_positive CHECK (min_qty > 0),
    CONSTRAINT price_positive CHECK (price > 0)
);

CREATE INDEX idx_price_tiers_variant ON price_tiers(variant_id);
CREATE INDEX idx_price_tiers_lookup ON price_tiers(variant_id, min_qty);

-- =====================================================
-- TABLE: wholesale_accounts
-- Business accounts for wholesale access
-- =====================================================

CREATE TABLE wholesale_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    trade_license_number VARCHAR(100),
    trade_license_url VARCHAR(500),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    business_type VARCHAR(100), -- Restaurant, Hotel, Retailer, etc.
    notes TEXT, -- Admin notes on review
    status wholesale_status NOT NULL DEFAULT 'pending',
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wholesale_accounts_user ON wholesale_accounts(user_id);
CREATE INDEX idx_wholesale_accounts_status ON wholesale_accounts(status);

-- =====================================================
-- TABLE: search_synonyms
-- Transliteration + synonym mapping for multilingual search
-- =====================================================

CREATE TABLE search_synonyms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword VARCHAR(255) NOT NULL, -- e.g. "كسكسي", "couscous", "couscos"
    canonical VARCHAR(255) NOT NULL, -- what to search → e.g. "couscous"
    lang lang_code, -- NULL = universal
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(keyword, lang)
);

CREATE INDEX idx_search_synonyms_keyword ON search_synonyms USING GIN(keyword gin_trgm_ops);

-- =====================================================
-- TABLE: carts
-- One active cart per user
-- =====================================================

CREATE TABLE carts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);

-- =====================================================
-- TABLE: cart_items
-- =====================================================

CREATE TABLE cart_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    qty INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(cart_id, variant_id),
    CONSTRAINT qty_positive CHECK (qty > 0)
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);

-- =====================================================
-- TABLE: orders
-- =====================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    order_number VARCHAR(30) NOT NULL UNIQUE,

    -- Address snapshot (captured at time of order)
    shipping_name VARCHAR(255),
    shipping_address_line1 VARCHAR(255),
    shipping_address_line2 VARCHAR(255),
    shipping_city VARCHAR(100),
    shipping_emirate VARCHAR(100),
    shipping_country VARCHAR(100) DEFAULT 'UAE',
    shipping_phone VARCHAR(50),

    -- Pricing snapshot
    subtotal DECIMAL(10, 2) NOT NULL,
    shipping_cost DECIMAL(10, 2) DEFAULT 0,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    vat_amount DECIMAL(10, 2) DEFAULT 0,
    total DECIMAL(10, 2) NOT NULL,
    currency CHAR(3) DEFAULT 'AED',

    -- Mode
    is_wholesale BOOLEAN DEFAULT FALSE,

    -- Status
    status order_status NOT NULL DEFAULT 'pending',
    payment_status payment_status NOT NULL DEFAULT 'pending',
    notes TEXT,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- =====================================================
-- TABLE: order_items
-- Snapshot of product/variant at purchase time
-- =====================================================

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,

    -- Snapshot at purchase time
    product_name VARCHAR(500) NOT NULL, -- captured from translation
    variant_sku VARCHAR(100) NOT NULL,
    variant_label VARCHAR(100), -- e.g. "500g"
    unit_price DECIMAL(10, 2) NOT NULL,
    qty INTEGER NOT NULL,
    line_total DECIMAL(10, 2) NOT NULL,

    -- Reference
    product_image_url VARCHAR(500),

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- =====================================================
-- TABLE: bulk_quote_requests
-- "Request bulk quote" records from product page
-- =====================================================

CREATE TABLE bulk_quote_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    requested_qty INTEGER NOT NULL,
    contact_name VARCHAR(255),
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50),
    notes TEXT,
    status VARCHAR(30) DEFAULT 'open', -- open, responded, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_bulk_quotes_product ON bulk_quote_requests(product_id);
CREATE INDEX idx_bulk_quotes_user ON bulk_quote_requests(user_id);
CREATE INDEX idx_bulk_quotes_status ON bulk_quote_requests(status);

-- =====================================================
-- FUNCTION: update_updated_at trigger
-- =====================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

CREATE TRIGGER trg_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_brands_updated_at BEFORE UPDATE ON brands FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_variants_updated_at BEFORE UPDATE ON product_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_carts_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_wholesale_updated_at BEFORE UPDATE ON wholesale_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_bulk_quotes_updated_at BEFORE UPDATE ON bulk_quote_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: refresh product search vector
-- Aggregates all translation names + descriptions
-- =====================================================

CREATE OR REPLACE FUNCTION refresh_product_search_vector(p_product_id UUID)
RETURNS VOID AS $$
DECLARE
    v_vector TSVECTOR;
BEGIN
    SELECT
        setweight(to_tsvector('simple', unaccent(string_agg(COALESCE(pt.name, ''), ' '))), 'A') ||
        setweight(to_tsvector('simple', unaccent(string_agg(COALESCE(pt.short_description, ''), ' '))), 'B') ||
        setweight(to_tsvector('simple', unaccent(string_agg(COALESCE(pt.description, ''), ' '))), 'C')
    INTO v_vector
    FROM product_translations pt
    WHERE pt.product_id = p_product_id;

    UPDATE products SET search_vector = v_vector WHERE id = p_product_id;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-refresh search vector on translation change
CREATE OR REPLACE FUNCTION trg_refresh_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM refresh_product_search_vector(COALESCE(NEW.product_id, OLD.product_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_product_translation_change
    AFTER INSERT OR UPDATE OR DELETE ON product_translations
    FOR EACH ROW EXECUTE FUNCTION trg_refresh_search_vector();

-- =====================================================
-- FUNCTION: generate order number
-- =====================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
    v_number TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_number := 'ORZ-' ||
            TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
            LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
        SELECT EXISTS (SELECT 1 FROM orders WHERE order_number = v_number) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_number;
END;
$$ LANGUAGE plpgsql;
