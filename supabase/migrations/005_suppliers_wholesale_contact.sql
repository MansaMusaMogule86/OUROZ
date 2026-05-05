-- =============================================================================
-- 005_suppliers_wholesale_contact.sql
-- Supplier profiles, wholesale accounts, contact submissions.
-- Required by: app/supplier/*, app/wholesale/*, app/contact/*,
--              src/services/supplierService.ts, src/types/business.ts (Supplier)
-- =============================================================================

-- =============================================================================
-- Suppliers
-- =============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    name                TEXT NOT NULL,
    slug                TEXT NOT NULL,
    description         TEXT,
    contact_phone       TEXT,
    contact_email       TEXT NOT NULL,
    logo_url            TEXT,
    trade_license_url   TEXT,
    status              TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    rejection_reason    TEXT,
    approved_at         TIMESTAMPTZ,
    approved_by         UUID REFERENCES auth.users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_slug  ON suppliers(slug);
CREATE UNIQUE INDEX IF NOT EXISTS idx_suppliers_owner ON suppliers(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);

CREATE TRIGGER trg_suppliers_updated_at
    BEFORE UPDATE ON suppliers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Supplier Products (association between supplier and product catalog)
-- =============================================================================

CREATE TABLE IF NOT EXISTS supplier_products (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id       UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    status            TEXT NOT NULL DEFAULT 'pending'
                          CHECK (status IN ('draft', 'pending', 'approved', 'rejected', 'suspended')),
    submitted_at      TIMESTAMPTZ,
    reviewed_at       TIMESTAMPTZ,
    reviewed_by       UUID REFERENCES auth.users(id),
    rejection_reason  TEXT,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_supplier_products_unique
    ON supplier_products(supplier_id, product_id);

CREATE TRIGGER trg_supplier_products_updated_at
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Supplier Payout Accounts
-- =============================================================================

CREATE TABLE IF NOT EXISTS supplier_payout_accounts (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id   UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    bank_name     TEXT,
    iban          TEXT,
    account_name  TEXT,
    swift_code    TEXT,
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_payout_accounts_supplier
    ON supplier_payout_accounts(supplier_id);

CREATE TRIGGER trg_supplier_payout_updated_at
    BEFORE UPDATE ON supplier_payout_accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Commissions
-- =============================================================================

CREATE TABLE IF NOT EXISTS commissions (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id   UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    rate_percent  NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
    notes         TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_commissions_supplier ON commissions(supplier_id);

-- =============================================================================
-- Wholesale Accounts
-- =============================================================================

CREATE TABLE IF NOT EXISTS wholesale_accounts (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id             UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    company_name        TEXT NOT NULL,
    trade_license_url   TEXT,
    contact_email       TEXT NOT NULL,
    contact_phone       TEXT,
    address             TEXT,
    status              TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
    rejection_reason    TEXT,
    approved_at         TIMESTAMPTZ,
    approved_by         UUID REFERENCES auth.users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_wholesale_user ON wholesale_accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_wholesale_status ON wholesale_accounts(status);

CREATE TRIGGER trg_wholesale_updated_at
    BEFORE UPDATE ON wholesale_accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Contact Submissions
-- =============================================================================

CREATE TABLE IF NOT EXISTS contact_submissions (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name            TEXT NOT NULL,
    email           TEXT NOT NULL,
    subject         TEXT,
    message         TEXT NOT NULL,
    honeypot_filled BOOLEAN NOT NULL DEFAULT FALSE,
    ip_address      INET,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_email      ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at DESC);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE suppliers                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_products          ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_payout_accounts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE commissions                ENABLE ROW LEVEL SECURITY;
ALTER TABLE wholesale_accounts         ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions        ENABLE ROW LEVEL SECURITY;

-- Suppliers: public can see approved; owner can see own; admins see all
CREATE POLICY "suppliers_select_public"
    ON suppliers FOR SELECT
    USING (
        status = 'approved'
        OR owner_user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "suppliers_insert_own"
    ON suppliers FOR INSERT
    WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "suppliers_update_own_or_admin"
    ON suppliers FOR UPDATE
    USING (
        owner_user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Supplier products: public read for approved; supplier owner + admins for others
CREATE POLICY "supplier_products_select"
    ON supplier_products FOR SELECT
    USING (
        status = 'approved'
        OR EXISTS (
            SELECT 1 FROM suppliers s
            WHERE s.id = supplier_products.supplier_id
              AND s.owner_user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Supplier payout accounts: owner read/write; admins full access
CREATE POLICY "supplier_payout_select"
    ON supplier_payout_accounts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM suppliers s
            WHERE s.id = supplier_payout_accounts.supplier_id
              AND s.owner_user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Wholesale accounts: owner read/write; admins full access
CREATE POLICY "wholesale_select_own"
    ON wholesale_accounts FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "wholesale_insert_own"
    ON wholesale_accounts FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Contact submissions: anyone can insert; only admins can read
CREATE POLICY "contact_insert_public"
    ON contact_submissions FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "contact_select_admin"
    ON contact_submissions FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );
