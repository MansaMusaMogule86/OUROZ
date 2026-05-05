-- =============================================================================
-- 003_businesses_credit_invoices.sql
-- Business accounts, credit system, invoice system.
-- Required by: app/business/*, app/checkout/page.tsx, creditService.ts
-- =============================================================================

-- =============================================================================
-- Businesses
-- =============================================================================

CREATE TABLE IF NOT EXISTS businesses (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    owner_user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    name                TEXT NOT NULL,
    legal_name          TEXT,
    trade_license_url   TEXT,
    business_type       TEXT,
    contact_email       TEXT NOT NULL,
    contact_phone       TEXT,
    address             TEXT,
    status              TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected')),
    rejection_reason    TEXT,
    approved_at         TIMESTAMPTZ,
    approved_by         UUID REFERENCES auth.users(id),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_owner ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

CREATE TRIGGER trg_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Business Members
-- =============================================================================

CREATE TABLE IF NOT EXISTS business_members (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role        TEXT NOT NULL DEFAULT 'buyer'
                    CHECK (role IN ('owner', 'manager', 'buyer')),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_business_members_unique
    ON business_members(business_id, user_id);
CREATE INDEX IF NOT EXISTS idx_business_members_user ON business_members(user_id);

-- =============================================================================
-- Credit Accounts
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_accounts (
    id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id       UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    credit_limit      NUMERIC(12,2) NOT NULL DEFAULT 0,
    terms_days        INTEGER NOT NULL DEFAULT 30,
    status            TEXT NOT NULL DEFAULT 'inactive'
                          CHECK (status IN ('active', 'suspended', 'inactive')),
    risk_tier         TEXT NOT NULL DEFAULT 'starter'
                          CHECK (risk_tier IN ('starter', 'trusted', 'pro')),
    suspended_at      TIMESTAMPTZ,
    suspended_reason  TEXT,
    last_reviewed_at  TIMESTAMPTZ,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_credit_accounts_business
    ON credit_accounts(business_id);

CREATE TRIGGER trg_credit_accounts_updated_at
    BEFORE UPDATE ON credit_accounts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Credit Ledger Entries
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_ledger_entries (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    order_id      UUID,   -- FK added after orders table created (migration 004)
    invoice_id    UUID,   -- FK added after invoices table created below
    type          TEXT NOT NULL
                      CHECK (type IN ('charge', 'payment', 'adjustment', 'credit_note')),
    amount        NUMERIC(12,2) NOT NULL,  -- positive = debit, negative = credit
    balance_after NUMERIC(12,2) NOT NULL,
    note          TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by    UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_business ON credit_ledger_entries(business_id);
CREATE INDEX IF NOT EXISTS idx_ledger_order    ON credit_ledger_entries(order_id);

-- =============================================================================
-- Invoices
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoices (
    id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    order_id       UUID,   -- FK added after orders table created (migration 004)
    invoice_number TEXT NOT NULL,
    subtotal       NUMERIC(12,2) NOT NULL DEFAULT 0,
    tax_amount     NUMERIC(12,2) NOT NULL DEFAULT 0,
    total          NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_paid    NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency       TEXT NOT NULL DEFAULT 'AED',
    due_date       DATE NOT NULL,
    status         TEXT NOT NULL DEFAULT 'issued'
                       CHECK (status IN ('issued', 'partial', 'paid', 'overdue', 'void')),
    paid_at        TIMESTAMPTZ,
    notes          TEXT,
    pdf_url        TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_business ON invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status   ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE TRIGGER trg_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Invoice Items
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoice_items (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    invoice_id  UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    product_id  UUID,
    variant_id  UUID,
    description TEXT NOT NULL,
    quantity    NUMERIC(10,3) NOT NULL DEFAULT 1,
    unit_price  NUMERIC(12,2) NOT NULL,
    subtotal    NUMERIC(12,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice ON invoice_items(invoice_id);

-- Back-fill FK on credit_ledger_entries now that invoices table exists
ALTER TABLE credit_ledger_entries
    ADD CONSTRAINT fk_ledger_invoice
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
    NOT VALID;

-- =============================================================================
-- Payments
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    invoice_id  UUID REFERENCES invoices(id) ON DELETE SET NULL,
    order_id    UUID,   -- FK to orders added in migration 004
    amount      NUMERIC(12,2) NOT NULL,
    method      TEXT NOT NULL
                    CHECK (method IN ('card', 'cash', 'bank_transfer', 'cheque', 'invoice')),
    reference   TEXT,
    notes       TEXT,
    received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    recorded_by UUID REFERENCES auth.users(id),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_business ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice  ON payments(invoice_id);

-- =============================================================================
-- Admin Notes (shared utility table)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_notes (
    id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    entity_type TEXT NOT NULL,
    entity_id   UUID NOT NULL,
    note        TEXT NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by  UUID NOT NULL REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE businesses           ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members     ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_accounts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices             ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items        ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments             ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes          ENABLE ROW LEVEL SECURITY;

-- Businesses: owner + members can read; admins can read all
CREATE POLICY "businesses_select_member"
    ON businesses FOR SELECT
    USING (
        owner_user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM business_members bm
            WHERE bm.business_id = id AND bm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "businesses_insert_own"
    ON businesses FOR INSERT
    WITH CHECK (owner_user_id = auth.uid());

CREATE POLICY "businesses_update_admin"
    ON businesses FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Business members: member or owner or admin can read
CREATE POLICY "business_members_select"
    ON business_members FOR SELECT
    USING (
        user_id = auth.uid()
        OR EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = business_id AND b.owner_user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "business_members_insert_owner"
    ON business_members FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM businesses b
            WHERE b.id = business_id AND b.owner_user_id = auth.uid()
        )
    );

-- Credit accounts: business members can read; admins can read/write
CREATE POLICY "credit_accounts_select"
    ON credit_accounts FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_members bm
            WHERE bm.business_id = credit_accounts.business_id
              AND bm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Ledger entries: business members read-only; admins full access
CREATE POLICY "credit_ledger_select"
    ON credit_ledger_entries FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_members bm
            WHERE bm.business_id = credit_ledger_entries.business_id
              AND bm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Invoices: business members read; admins full access
CREATE POLICY "invoices_select"
    ON invoices FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM business_members bm
            WHERE bm.business_id = invoices.business_id
              AND bm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

CREATE POLICY "invoice_items_select"
    ON invoice_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM invoices i
            JOIN business_members bm ON bm.business_id = i.business_id
            WHERE i.id = invoice_items.invoice_id
              AND bm.user_id = auth.uid()
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Admin notes: admins only
CREATE POLICY "admin_notes_admin_only"
    ON admin_notes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );
