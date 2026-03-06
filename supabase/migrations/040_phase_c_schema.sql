-- =============================================================================
-- OUROZ – Migration 040: Phase C – Supplier Marketplace
-- Builds on 010 (products), 020 (businesses), 030 (optional)
-- =============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_status') THEN
        CREATE TYPE supplier_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'supplier_product_status') THEN
        CREATE TYPE supplier_product_status AS ENUM ('draft', 'pending', 'approved', 'rejected', 'suspended');
    END IF;
END $$;

-- =============================================================================
-- TABLE: suppliers
-- =============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id   UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE RESTRICT,
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    contact_phone   TEXT,
    contact_email   TEXT NOT NULL,
    logo_url        TEXT,
    trade_license_url TEXT,
    status          supplier_status NOT NULL DEFAULT 'pending',
    rejection_reason TEXT,
    approved_at     TIMESTAMP WITH TIME ZONE,
    approved_by     UUID REFERENCES auth.users(id),
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suppliers_owner  ON suppliers(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_slug   ON suppliers(slug);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

-- =============================================================================
-- TABLE: supplier_products
-- Links a supplier to a product. Tracks approval state.
-- A product drafted by a supplier starts as 'draft'; admin approves → 'approved'.
-- =============================================================================

CREATE TABLE IF NOT EXISTS supplier_products (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id  UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id   UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status       supplier_product_status NOT NULL DEFAULT 'draft',
    submitted_at TIMESTAMP WITH TIME ZONE,
    reviewed_at  TIMESTAMP WITH TIME ZONE,
    reviewed_by  UUID REFERENCES auth.users(id),
    rejection_reason TEXT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (supplier_id, product_id)
);

CREATE INDEX IF NOT EXISTS idx_supplier_products_supplier ON supplier_products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_product  ON supplier_products(product_id);
CREATE INDEX IF NOT EXISTS idx_supplier_products_status   ON supplier_products(status);

-- =============================================================================
-- TABLE: supplier_payout_accounts
-- Placeholder banking details for payouts.
-- =============================================================================

CREATE TABLE IF NOT EXISTS supplier_payout_accounts (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id  UUID NOT NULL UNIQUE REFERENCES suppliers(id) ON DELETE CASCADE,
    bank_name    TEXT,
    iban         TEXT,
    account_name TEXT,
    swift_code   TEXT,
    notes        TEXT,
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================================================
-- TABLE: commissions
-- One row per supplier. Rate applies to all their products.
-- =============================================================================

CREATE TABLE IF NOT EXISTS commissions (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    supplier_id  UUID NOT NULL UNIQUE REFERENCES suppliers(id) ON DELETE CASCADE,
    rate_percent NUMERIC(5,2) NOT NULL DEFAULT 15.00
                 CHECK (rate_percent >= 0 AND rate_percent <= 100),
    created_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_supplier ON commissions(supplier_id);

-- =============================================================================
-- Extend products + order_items with supplier tracking
-- =============================================================================

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES suppliers(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_products_supplier ON products(supplier_id);

ALTER TABLE order_items
    ADD COLUMN IF NOT EXISTS supplier_id        UUID REFERENCES suppliers(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS commission_amount  NUMERIC(10,2);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Approve a supplier product: set product is_active = true
CREATE OR REPLACE FUNCTION approve_supplier_product(
    p_supplier_product_id UUID,
    p_admin_user_id UUID
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_product_id UUID;
BEGIN
    UPDATE supplier_products
    SET status = 'approved',
        reviewed_at = NOW(),
        reviewed_by = p_admin_user_id,
        updated_at = NOW()
    WHERE id = p_supplier_product_id
    RETURNING product_id INTO v_product_id;

    UPDATE products
    SET is_active = TRUE, updated_at = NOW()
    WHERE id = v_product_id;
END;
$$;

-- Reject a supplier product
CREATE OR REPLACE FUNCTION reject_supplier_product(
    p_supplier_product_id UUID,
    p_admin_user_id UUID,
    p_reason TEXT
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_product_id UUID;
BEGIN
    UPDATE supplier_products
    SET status = 'rejected',
        rejection_reason = p_reason,
        reviewed_at = NOW(),
        reviewed_by = p_admin_user_id,
        updated_at = NOW()
    WHERE id = p_supplier_product_id
    RETURNING product_id INTO v_product_id;

    -- Keep product inactive
    UPDATE products
    SET is_active = FALSE, updated_at = NOW()
    WHERE id = v_product_id;
END;
$$;

-- Calculate commission for an order_item
CREATE OR REPLACE FUNCTION calculate_commission(
    p_supplier_id UUID,
    p_line_total  NUMERIC
) RETURNS NUMERIC(10,2) LANGUAGE sql STABLE AS $$
    SELECT ROUND(
        p_line_total * COALESCE(
            (SELECT rate_percent / 100 FROM commissions WHERE supplier_id = p_supplier_id),
            0.15
        ),
        2
    )::NUMERIC(10,2);
$$;

-- updated_at triggers
CREATE TRIGGER trg_suppliers_upd
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_supplier_products_upd
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_commissions_upd
    BEFORE UPDATE ON commissions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE suppliers                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_payout_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions               ENABLE ROW LEVEL SECURITY;

-- Helper: is current user the supplier owner?
CREATE OR REPLACE FUNCTION auth.is_supplier_owner(p_supplier_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM suppliers
        WHERE id = p_supplier_id AND owner_user_id = auth.uid()
    );
$$;

-- suppliers: public read approved, owner+admin full
CREATE POLICY "sup: public read approved"
    ON suppliers FOR SELECT
    USING (status = 'approved' OR owner_user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "sup: owner insert"
    ON suppliers FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND owner_user_id = auth.uid());

CREATE POLICY "sup: owner update"
    ON suppliers FOR UPDATE
    USING  (owner_user_id = auth.uid() OR auth.is_admin())
    WITH CHECK (owner_user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "sup: admin all"
    ON suppliers FOR ALL
    USING (auth.is_admin());

-- supplier_products: owner read/write own drafts, admin all, public read approved
CREATE POLICY "sp: public read approved"
    ON supplier_products FOR SELECT
    USING (status = 'approved' OR auth.is_supplier_owner(supplier_id) OR auth.is_admin());

CREATE POLICY "sp: owner manage draft"
    ON supplier_products FOR ALL
    USING  (auth.is_supplier_owner(supplier_id))
    WITH CHECK (auth.is_supplier_owner(supplier_id));

CREATE POLICY "sp: admin all"
    ON supplier_products FOR ALL
    USING (auth.is_admin());

-- payout accounts: owner + admin only
CREATE POLICY "payout: owner"
    ON supplier_payout_accounts FOR ALL
    USING (auth.is_supplier_owner(supplier_id) OR auth.is_admin());

-- commissions: owner read, admin write
CREATE POLICY "comm: owner read"
    ON commissions FOR SELECT
    USING (auth.is_supplier_owner(supplier_id) OR auth.is_admin());

CREATE POLICY "comm: admin all"
    ON commissions FOR ALL
    USING (auth.is_admin());
