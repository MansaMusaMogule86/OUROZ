-- =====================================================
-- OUROZ Shop - Migration 002: Row Level Security Policies
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE brand_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_quote_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_synonyms ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- HELPER: check if current user is admin
-- =====================================================

CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- HELPER: check if current user is approved wholesale
-- =====================================================

CREATE OR REPLACE FUNCTION auth.is_wholesale()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid() AND role = 'wholesale'
    );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- =====================================================
-- POLICIES: user_profiles
-- =====================================================

-- Users can view their own profile
CREATE POLICY "user_profiles: own read"
    ON user_profiles FOR SELECT
    USING (id = auth.uid() OR auth.is_admin());

-- Users can update their own profile
CREATE POLICY "user_profiles: own update"
    ON user_profiles FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admin can update any profile (e.g. grant wholesale role)
CREATE POLICY "user_profiles: admin update"
    ON user_profiles FOR UPDATE
    USING (auth.is_admin());

-- =====================================================
-- POLICIES: brands + brand_translations
-- =====================================================

-- Public can read active brands
CREATE POLICY "brands: public read"
    ON brands FOR SELECT
    USING (is_active = TRUE OR auth.is_admin());

CREATE POLICY "brand_translations: public read"
    ON brand_translations FOR SELECT
    USING (TRUE);

-- Admin full access
CREATE POLICY "brands: admin all"
    ON brands FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

CREATE POLICY "brand_translations: admin all"
    ON brand_translations FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: categories + category_translations
-- =====================================================

CREATE POLICY "categories: public read"
    ON categories FOR SELECT
    USING (is_active = TRUE OR auth.is_admin());

CREATE POLICY "category_translations: public read"
    ON category_translations FOR SELECT
    USING (TRUE);

CREATE POLICY "categories: admin all"
    ON categories FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

CREATE POLICY "category_translations: admin all"
    ON category_translations FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: products + product_translations + product_images
-- =====================================================

-- Public can read active products
CREATE POLICY "products: public read"
    ON products FOR SELECT
    USING (status = 'active' OR auth.is_admin());

CREATE POLICY "product_translations: public read"
    ON product_translations FOR SELECT
    USING (TRUE);

CREATE POLICY "product_images: public read"
    ON product_images FOR SELECT
    USING (TRUE);

-- Admin manages products
CREATE POLICY "products: admin all"
    ON products FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

CREATE POLICY "product_translations: admin all"
    ON product_translations FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

CREATE POLICY "product_images: admin all"
    ON product_images FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: product_variants
-- =====================================================

CREATE POLICY "variants: public read active"
    ON product_variants FOR SELECT
    USING (is_active = TRUE OR auth.is_admin());

CREATE POLICY "variants: admin all"
    ON product_variants FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: inventory
-- Public can see stock levels (not internal counts)
-- =====================================================

CREATE POLICY "inventory: public read"
    ON inventory FOR SELECT
    USING (TRUE);

CREATE POLICY "inventory: admin all"
    ON inventory FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: price_tiers
-- CRITICAL: Wholesale pricing only visible to approved wholesale users + admin
-- =====================================================

CREATE POLICY "price_tiers: wholesale and admin read"
    ON price_tiers FOR SELECT
    USING (auth.is_wholesale() OR auth.is_admin());

-- NOTE: Retail customers cannot see wholesale price tiers.
-- This means: if NOT wholesale and NOT admin → no rows returned.

CREATE POLICY "price_tiers: admin all"
    ON price_tiers FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: wholesale_accounts
-- =====================================================

-- User can see their own wholesale application
CREATE POLICY "wholesale_accounts: own read"
    ON wholesale_accounts FOR SELECT
    USING (user_id = auth.uid() OR auth.is_admin());

-- Any authenticated user can submit a wholesale application
CREATE POLICY "wholesale_accounts: authenticated insert"
    ON wholesale_accounts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- User can update their pending application only
CREATE POLICY "wholesale_accounts: own update pending"
    ON wholesale_accounts FOR UPDATE
    USING (user_id = auth.uid() AND status = 'pending')
    WITH CHECK (user_id = auth.uid());

-- Admin can approve/reject applications
CREATE POLICY "wholesale_accounts: admin all"
    ON wholesale_accounts FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: search_synonyms
-- =====================================================

CREATE POLICY "search_synonyms: public read"
    ON search_synonyms FOR SELECT
    USING (TRUE);

CREATE POLICY "search_synonyms: admin all"
    ON search_synonyms FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: carts
-- Users can only see/manage their own cart
-- =====================================================

CREATE POLICY "carts: own read"
    ON carts FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "carts: own insert"
    ON carts FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "carts: own update"
    ON carts FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "carts: own delete"
    ON carts FOR DELETE
    USING (user_id = auth.uid());

-- =====================================================
-- POLICIES: cart_items
-- =====================================================

CREATE POLICY "cart_items: own read"
    ON cart_items FOR SELECT
    USING (
        cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
    );

CREATE POLICY "cart_items: own insert"
    ON cart_items FOR INSERT
    WITH CHECK (
        cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
    );

CREATE POLICY "cart_items: own update"
    ON cart_items FOR UPDATE
    USING (
        cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
    );

CREATE POLICY "cart_items: own delete"
    ON cart_items FOR DELETE
    USING (
        cart_id IN (SELECT id FROM carts WHERE user_id = auth.uid())
    );

-- =====================================================
-- POLICIES: orders + order_items
-- =====================================================

CREATE POLICY "orders: own and admin read"
    ON orders FOR SELECT
    USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "orders: authenticated insert"
    ON orders FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());

CREATE POLICY "orders: admin all"
    ON orders FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- Order items: readable if their order is readable
CREATE POLICY "order_items: own and admin read"
    ON order_items FOR SELECT
    USING (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
        OR auth.is_admin()
    );

CREATE POLICY "order_items: authenticated insert"
    ON order_items FOR INSERT
    WITH CHECK (
        order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
    );

CREATE POLICY "order_items: admin all"
    ON order_items FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());

-- =====================================================
-- POLICIES: bulk_quote_requests
-- =====================================================

CREATE POLICY "bulk_quotes: own and admin read"
    ON bulk_quote_requests FOR SELECT
    USING (user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "bulk_quotes: anyone insert"
    ON bulk_quote_requests FOR INSERT
    WITH CHECK (TRUE); -- Allow even anonymous users to submit quotes

CREATE POLICY "bulk_quotes: admin all"
    ON bulk_quote_requests FOR ALL
    USING (auth.is_admin())
    WITH CHECK (auth.is_admin());
