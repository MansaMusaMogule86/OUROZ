-- =======================================================
-- OUROZ Shop – Migration 010: Complete V2 Schema
-- Implements the exact production schema for the shop system.
-- Run AFTER 001, 002, 003 (or standalone on a fresh project).
-- For a fresh project: rename this to 001 and skip the earlier files.
-- =======================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "unaccent";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- =======================================================
-- DROP & RECREATE (idempotent rebuild helper)
-- Comment this block out if running incrementally on live data.
-- =======================================================
DROP TABLE IF EXISTS order_items       CASCADE;
DROP TABLE IF EXISTS orders            CASCADE;
DROP TABLE IF EXISTS cart_items        CASCADE;
DROP TABLE IF EXISTS carts             CASCADE;
DROP TABLE IF EXISTS search_keywords   CASCADE;
DROP TABLE IF EXISTS price_tiers       CASCADE;
DROP TABLE IF EXISTS product_variants  CASCADE;
DROP TABLE IF EXISTS products          CASCADE;
DROP TABLE IF EXISTS categories        CASCADE;
DROP TABLE IF EXISTS brands            CASCADE;
DROP TABLE IF EXISTS wholesale_applications CASCADE;
DROP TABLE IF EXISTS user_profiles     CASCADE;

DROP TYPE IF EXISTS user_role_v2   CASCADE;
DROP TYPE IF EXISTS app_status     CASCADE;
DROP TYPE IF EXISTS order_status_v2 CASCADE;

-- =======================================================
-- ENUMS
-- =======================================================

CREATE TYPE user_role_v2   AS ENUM ('customer', 'wholesale', 'admin');
CREATE TYPE app_status     AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE order_status_v2 AS ENUM ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled');

-- =======================================================
-- TABLE: user_profiles
-- One row per auth.users entry. Role drives pricing.
-- =======================================================

CREATE TABLE user_profiles (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    role       user_role_v2 NOT NULL DEFAULT 'customer',
    full_name  TEXT,
    phone      TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_user_profiles_user  ON user_profiles(user_id);
CREATE INDEX idx_user_profiles_role  ON user_profiles(role);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.create_user_profile()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, role, full_name)
    VALUES (NEW.id, 'customer', NEW.raw_user_meta_data->>'full_name')
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.create_user_profile();

-- =======================================================
-- TABLE: brands
-- =======================================================

CREATE TABLE brands (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug       TEXT NOT NULL UNIQUE,
    name       TEXT NOT NULL,
    name_ar    TEXT,               -- Arabic brand name
    name_fr    TEXT,               -- French brand name
    logo_url   TEXT,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_brands_slug   ON brands(slug);
CREATE INDEX idx_brands_active ON brands(is_active);

-- =======================================================
-- TABLE: categories
-- Nested via parent_id.
-- =======================================================

CREATE TABLE categories (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug       TEXT NOT NULL UNIQUE,
    parent_id  UUID REFERENCES categories(id) ON DELETE SET NULL,
    name       TEXT NOT NULL,
    name_ar    TEXT,
    name_fr    TEXT,
    icon       TEXT,
    image_url  TEXT,
    sort_order INTEGER NOT NULL DEFAULT 0,
    is_active  BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_categories_slug   ON categories(slug);
CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_active ON categories(is_active, sort_order);

-- =======================================================
-- TABLE: products
-- =======================================================

CREATE TABLE products (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug                 TEXT NOT NULL UNIQUE,
    brand_id             UUID REFERENCES brands(id) ON DELETE SET NULL,
    category_id          UUID REFERENCES categories(id) ON DELETE SET NULL,
    name                 TEXT NOT NULL,
    name_ar              TEXT,
    name_fr              TEXT,
    description          TEXT,
    description_ar       TEXT,
    description_fr       TEXT,
    base_price           NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    compare_price        NUMERIC(10,2),
    image_urls           TEXT[] DEFAULT '{}',  -- ordered array of image URLs
    is_active            BOOLEAN NOT NULL DEFAULT TRUE,
    is_featured          BOOLEAN NOT NULL DEFAULT FALSE,
    is_wholesale_enabled BOOLEAN NOT NULL DEFAULT TRUE,

    -- Full-text search vector – refreshed by trigger
    search_vector        TSVECTOR,

    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_products_slug     ON products(slug);
CREATE INDEX idx_products_brand    ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_active   ON products(is_active, created_at DESC);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_search   ON products USING GIN(search_vector);
CREATE INDEX idx_products_name_trgm ON products USING GIN(unaccent(name) gin_trgm_ops);

-- =======================================================
-- TABLE: product_variants
-- Each variant is a buyable SKU (weight / size / colour).
-- Stock is tracked directly on the variant.
-- =======================================================

CREATE TABLE product_variants (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    sku            TEXT NOT NULL UNIQUE,
    weight         TEXT,              -- display label: "500g", "1kg", "500ml"
    weight_grams   INTEGER,           -- numeric for sorting
    size_label     TEXT,              -- "S", "M", "L"
    retail_price   NUMERIC(10,2) NOT NULL CHECK (retail_price >= 0),
    compare_price  NUMERIC(10,2),
    stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    is_active      BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order     INTEGER NOT NULL DEFAULT 0,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_variants_sku     ON product_variants(sku);
CREATE INDEX idx_variants_product        ON product_variants(product_id);
CREATE INDEX idx_variants_active         ON product_variants(product_id, is_active)
                                            WHERE is_active = TRUE;
CREATE INDEX idx_variants_stock          ON product_variants(stock_quantity);

-- =======================================================
-- TABLE: price_tiers
-- Wholesale tiered pricing. One row per quantity threshold.
-- To find the correct price: SELECT WHERE min_quantity <= :qty
-- ORDER BY min_quantity DESC LIMIT 1.
-- =======================================================

CREATE TABLE price_tiers (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    variant_id   UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    min_quantity INTEGER NOT NULL CHECK (min_quantity >= 1),
    price        NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    label        TEXT,                -- optional: "Case of 10", "Pallet"
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(variant_id, min_quantity)
);

CREATE INDEX idx_price_tiers_variant ON price_tiers(variant_id);
-- This index makes the "find best tier" query O(log n)
CREATE INDEX idx_price_tiers_lookup  ON price_tiers(variant_id, min_quantity DESC);

-- =======================================================
-- TABLE: wholesale_applications
-- Submitted by users, approved/rejected by admin.
-- =======================================================

CREATE TABLE wholesale_applications (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id       UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    license_url   TEXT,
    business_type TEXT,
    contact_email TEXT NOT NULL,
    contact_phone TEXT,
    admin_notes   TEXT,
    status        app_status NOT NULL DEFAULT 'pending',
    reviewed_by   UUID REFERENCES auth.users(id),
    reviewed_at   TIMESTAMP WITH TIME ZONE,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_wholesale_user   ON wholesale_applications(user_id);
CREATE INDEX idx_wholesale_status ON wholesale_applications(status);

-- =======================================================
-- TABLE: search_keywords
-- Maps a keyword (any language) to a product.
-- Enables: search "كسكسي" → match Couscous products.
-- Also used for synonyms: "couscos" → couscous products.
-- =======================================================

CREATE TABLE search_keywords (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    keyword    TEXT NOT NULL,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    lang       TEXT,                  -- 'en', 'ar', 'fr', NULL = any
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(keyword, product_id)
);

CREATE INDEX idx_search_keywords_keyword ON search_keywords USING GIN(keyword gin_trgm_ops);
CREATE INDEX idx_search_keywords_exact   ON search_keywords(keyword);
CREATE INDEX idx_search_keywords_product ON search_keywords(product_id);

-- =======================================================
-- TABLE: carts
-- One active cart per authenticated user.
-- =======================================================

CREATE TABLE carts (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_carts_user ON carts(user_id);

-- =======================================================
-- TABLE: cart_items
-- Stores variant + qty. Price is computed at render time
-- from the variant + user role (not stored here – avoids
-- stale pricing issues before checkout).
-- =======================================================

CREATE TABLE cart_items (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cart_id    UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES product_variants(id) ON DELETE CASCADE,
    quantity   INTEGER NOT NULL DEFAULT 1 CHECK (quantity >= 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE(cart_id, variant_id)
);

CREATE INDEX idx_cart_items_cart    ON cart_items(cart_id);
CREATE INDEX idx_cart_items_variant ON cart_items(variant_id);

-- =======================================================
-- TABLE: orders
-- Created at checkout. Status tracks fulfilment.
-- =======================================================

CREATE TABLE orders (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id              UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    order_number         TEXT NOT NULL UNIQUE,
    subtotal             NUMERIC(10,2) NOT NULL,
    shipping_cost        NUMERIC(10,2) NOT NULL DEFAULT 0,
    vat_amount           NUMERIC(10,2) NOT NULL DEFAULT 0,
    total                NUMERIC(10,2) NOT NULL,
    currency             CHAR(3) NOT NULL DEFAULT 'AED',
    is_wholesale         BOOLEAN NOT NULL DEFAULT FALSE,
    status               order_status_v2 NOT NULL DEFAULT 'pending',
    -- Shipping snapshot
    shipping_name        TEXT,
    shipping_phone       TEXT,
    shipping_address     TEXT,
    shipping_emirate     TEXT,
    notes                TEXT,
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_orders_user       ON orders(user_id);
CREATE INDEX idx_orders_number     ON orders(order_number);
CREATE INDEX idx_orders_status     ON orders(status);
CREATE INDEX idx_orders_created    ON orders(created_at DESC);

-- =======================================================
-- TABLE: order_items
-- Snapshot of price at time of purchase (immutable audit trail).
-- =======================================================

CREATE TABLE order_items (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id          UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id        UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    product_name      TEXT NOT NULL,   -- snapshot
    variant_sku       TEXT NOT NULL,   -- snapshot
    variant_label     TEXT,            -- snapshot: "500g"
    product_image_url TEXT,            -- snapshot
    price_at_purchase NUMERIC(10,2) NOT NULL,  -- the ACTUAL price paid (tier or retail)
    quantity          INTEGER NOT NULL CHECK (quantity >= 1),
    line_total        NUMERIC(10,2) NOT NULL,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order   ON order_items(order_id);
CREATE INDEX idx_order_items_variant ON order_items(variant_id);

-- =======================================================
-- FUNCTION: auto-update updated_at
-- =======================================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_user_profiles_upd  BEFORE UPDATE ON user_profiles         FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_products_upd       BEFORE UPDATE ON products               FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_variants_upd       BEFORE UPDATE ON product_variants       FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_wholesale_upd      BEFORE UPDATE ON wholesale_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_carts_upd          BEFORE UPDATE ON carts                  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_cart_items_upd     BEFORE UPDATE ON cart_items             FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_orders_upd         BEFORE UPDATE ON orders                 FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =======================================================
-- FUNCTION: Refresh product search vector
-- Aggregates name + description across all stored languages.
-- Called by trigger on product UPDATE.
-- =======================================================

CREATE OR REPLACE FUNCTION refresh_product_fts()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.search_vector :=
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.name,         ''))), 'A') ||
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.name_ar,      ''))), 'A') ||
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.name_fr,      ''))), 'A') ||
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.description,  ''))), 'C') ||
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.description_ar,''))), 'C') ||
        setweight(to_tsvector('simple', unaccent(COALESCE(NEW.description_fr,''))), 'C');
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_products_fts
    BEFORE INSERT OR UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION refresh_product_fts();

-- =======================================================
-- FUNCTION: Decrement stock on order placement
-- Called manually from application code (not a DB trigger)
-- to avoid partial updates. Provided as a stored procedure
-- for use in server-side transactions.
-- =======================================================

CREATE OR REPLACE FUNCTION decrement_variant_stock(p_variant_id UUID, p_qty INTEGER)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
    UPDATE product_variants
    SET stock_quantity = stock_quantity - p_qty
    WHERE id = p_variant_id
      AND stock_quantity >= p_qty;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Insufficient stock for variant %', p_variant_id;
    END IF;
END;
$$;

-- =======================================================
-- FUNCTION: Generate order number
-- =======================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE v TEXT; exists BOOLEAN;
BEGIN
    LOOP
        v := 'ORZ-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
             LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
        SELECT EXISTS (SELECT 1 FROM orders WHERE order_number = v) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN v;
END;
$$;

-- =======================================================
-- RLS – enable on all tables
-- =======================================================

ALTER TABLE user_profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories             ENABLE ROW LEVEL SECURITY;
ALTER TABLE products               ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants       ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers            ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_keywords        ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items             ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items            ENABLE ROW LEVEL SECURITY;

-- Helper: admin check (avoids N+1 role lookups)
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND role = 'admin'
    );
$$;

-- Helper: wholesale check
CREATE OR REPLACE FUNCTION auth.is_wholesale()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE user_id = auth.uid() AND role = 'wholesale'
    );
$$;

-- user_profiles
CREATE POLICY "profiles: own read"   ON user_profiles FOR SELECT USING (user_id = auth.uid() OR auth.is_admin());
CREATE POLICY "profiles: own update" ON user_profiles FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "profiles: admin all"  ON user_profiles FOR ALL    USING (auth.is_admin());

-- brands / categories – public read, admin write
CREATE POLICY "brands: public read"      ON brands      FOR SELECT USING (is_active = TRUE OR auth.is_admin());
CREATE POLICY "brands: admin all"        ON brands      FOR ALL    USING (auth.is_admin());
CREATE POLICY "categories: public read"  ON categories  FOR SELECT USING (is_active = TRUE OR auth.is_admin());
CREATE POLICY "categories: admin all"    ON categories  FOR ALL    USING (auth.is_admin());

-- products – public read active, admin full
CREATE POLICY "products: public read"    ON products     FOR SELECT USING (is_active = TRUE OR auth.is_admin());
CREATE POLICY "products: admin all"      ON products     FOR ALL    USING (auth.is_admin());

-- variants – public read active
CREATE POLICY "variants: public read"    ON product_variants FOR SELECT USING (is_active = TRUE OR auth.is_admin());
CREATE POLICY "variants: admin all"      ON product_variants FOR ALL    USING (auth.is_admin());

-- price_tiers – ONLY wholesale + admin
CREATE POLICY "tiers: wholesale read"    ON price_tiers FOR SELECT USING (auth.is_wholesale() OR auth.is_admin());
CREATE POLICY "tiers: admin all"         ON price_tiers FOR ALL    USING (auth.is_admin());

-- wholesale_applications
CREATE POLICY "wa: own read"     ON wholesale_applications FOR SELECT USING (user_id = auth.uid() OR auth.is_admin());
CREATE POLICY "wa: own insert"   ON wholesale_applications FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "wa: own update pending"
    ON wholesale_applications FOR UPDATE
    USING  (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (user_id = auth.uid());
CREATE POLICY "wa: admin all"    ON wholesale_applications FOR ALL    USING (auth.is_admin());

-- search_keywords – public read
CREATE POLICY "sk: public read"  ON search_keywords FOR SELECT USING (TRUE);
CREATE POLICY "sk: admin all"    ON search_keywords FOR ALL    USING (auth.is_admin());

-- carts – own only
CREATE POLICY "carts: own"            ON carts      FOR ALL USING (user_id = auth.uid());
CREATE POLICY "cart_items: own read"  ON cart_items FOR SELECT USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));
CREATE POLICY "cart_items: own write" ON cart_items FOR ALL    USING (cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid()));

-- orders – own + admin
CREATE POLICY "orders: own read"    ON orders      FOR SELECT USING (user_id = auth.uid() OR auth.is_admin());
CREATE POLICY "orders: own insert"  ON orders      FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
CREATE POLICY "orders: admin all"   ON orders      FOR ALL    USING (auth.is_admin());
CREATE POLICY "order_items: own"    ON order_items FOR SELECT USING (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()) OR auth.is_admin());
CREATE POLICY "order_items: insert" ON order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM orders WHERE user_id = auth.uid()));
