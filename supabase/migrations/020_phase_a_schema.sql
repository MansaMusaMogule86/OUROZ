-- =============================================================================
-- OUROZ – Migration 020: Phase A – Restaurant Wholesale + Credit Terms
-- Builds on top of 010_shop_v2_schema.sql
--
-- New tables:
--   businesses, business_members,
--   credit_accounts, credit_ledger,
--   invoices, payments,
--   admin_notes
-- Alters:
--   orders (add business_id, payment_method, invoice_id)
-- =============================================================================

-- =============================================================================
-- ENUMS  (idempotent)
-- =============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_status') THEN
        CREATE TYPE business_status AS ENUM ('pending', 'approved', 'rejected');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'credit_status') THEN
        CREATE TYPE credit_status AS ENUM ('active', 'suspended');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE invoice_status AS ENUM ('issued', 'partial', 'paid', 'overdue', 'void');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_method') THEN
        CREATE TYPE payment_method AS ENUM ('card', 'cash', 'bank_transfer', 'cheque', 'invoice');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ledger_entry_type') THEN
        CREATE TYPE ledger_entry_type AS ENUM ('charge', 'payment', 'adjustment', 'credit_note');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_role') THEN
        CREATE TYPE member_role AS ENUM ('owner', 'manager', 'buyer');
    END IF;
END $$;

-- =============================================================================
-- TABLE: businesses
-- Represents a restaurant, hotel, cafe, or distributor account.
-- =============================================================================

CREATE TABLE IF NOT EXISTS businesses (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    name              TEXT NOT NULL,
    legal_name        TEXT,
    trade_license_url TEXT,
    business_type     TEXT,  -- 'restaurant', 'hotel', 'cafe', 'distributor', 'other'
    contact_email     TEXT NOT NULL,
    contact_phone     TEXT,
    address           TEXT,
    status            business_status NOT NULL DEFAULT 'pending',
    rejection_reason  TEXT,
    approved_at       TIMESTAMP WITH TIME ZONE,
    approved_by       UUID REFERENCES auth.users(id),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_businesses_owner  ON businesses(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_businesses_status ON businesses(status);

-- =============================================================================
-- TABLE: business_members
-- Users who belong to a business account. Owner is always a member.
-- =============================================================================

CREATE TABLE IF NOT EXISTS business_members (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role        member_role NOT NULL DEFAULT 'buyer',
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (business_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_biz_members_business ON business_members(business_id);
CREATE INDEX IF NOT EXISTS idx_biz_members_user     ON business_members(user_id);

-- Auto-add owner as member on business creation
CREATE OR REPLACE FUNCTION add_owner_as_member()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    INSERT INTO business_members (business_id, user_id, role)
    VALUES (NEW.id, NEW.owner_user_id, 'owner')
    ON CONFLICT (business_id, user_id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_businesses_add_owner ON businesses;
CREATE TRIGGER trg_businesses_add_owner
    AFTER INSERT ON businesses
    FOR EACH ROW EXECUTE FUNCTION add_owner_as_member();

-- =============================================================================
-- TABLE: credit_accounts
-- One per business. Admins set limit + terms.
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_accounts (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id   UUID NOT NULL UNIQUE REFERENCES businesses(id) ON DELETE CASCADE,
    credit_limit  NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (credit_limit >= 0),
    terms_days    INTEGER NOT NULL DEFAULT 30,  -- Net 7, 14, 30, 60, 90
    status        credit_status NOT NULL DEFAULT 'active',
    suspended_at  TIMESTAMP WITH TIME ZONE,
    suspended_reason TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_credit_accounts_business ON credit_accounts(business_id);
CREATE INDEX IF NOT EXISTS idx_credit_accounts_status   ON credit_accounts(status);

-- =============================================================================
-- TABLE: invoices
-- Created at checkout when payment_method = 'invoice'.
-- Due date = order date + credit_account.terms_days.
-- =============================================================================

CREATE TABLE IF NOT EXISTS invoices (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id    UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    order_id       UUID,  -- FK added after orders table check
    invoice_number TEXT NOT NULL UNIQUE,
    subtotal       NUMERIC(12,2) NOT NULL CHECK (subtotal >= 0),
    tax_amount     NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (tax_amount >= 0),
    total          NUMERIC(12,2) NOT NULL CHECK (total >= 0),
    amount_paid    NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (amount_paid >= 0),
    currency       CHAR(3) NOT NULL DEFAULT 'AED',
    due_date       DATE NOT NULL,
    status         invoice_status NOT NULL DEFAULT 'issued',
    paid_at        TIMESTAMP WITH TIME ZONE,
    notes          TEXT,
    created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invoices_business  ON invoices(business_id);
CREATE INDEX IF NOT EXISTS idx_invoices_order     ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status    ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date  ON invoices(due_date);
CREATE INDEX IF NOT EXISTS idx_invoices_number    ON invoices(invoice_number);

-- =============================================================================
-- TABLE: credit_ledger
-- Double-entry style running log for each business's credit balance.
-- charge  → positive amount (business owes more)
-- payment → negative amount (business pays down balance)
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_ledger (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id   UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    order_id      UUID,
    invoice_id    UUID REFERENCES invoices(id) ON DELETE SET NULL,
    type          ledger_entry_type NOT NULL,
    amount        NUMERIC(12,2) NOT NULL,  -- signed: + = debit, - = credit
    balance_after NUMERIC(12,2) NOT NULL,  -- running balance after this entry
    note          TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by    UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_ledger_business ON credit_ledger(business_id);
CREATE INDEX IF NOT EXISTS idx_ledger_invoice  ON credit_ledger(invoice_id);
CREATE INDEX IF NOT EXISTS idx_ledger_order    ON credit_ledger(order_id);

-- =============================================================================
-- TABLE: payments
-- Records of actual money received against an invoice or order.
-- =============================================================================

CREATE TABLE IF NOT EXISTS payments (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE RESTRICT,
    invoice_id  UUID REFERENCES invoices(id) ON DELETE SET NULL,
    order_id    UUID,
    amount      NUMERIC(12,2) NOT NULL CHECK (amount > 0),
    method      payment_method NOT NULL DEFAULT 'bank_transfer',
    reference   TEXT,   -- bank ref, cheque number, etc.
    notes       TEXT,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    recorded_by UUID REFERENCES auth.users(id),
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_business ON payments(business_id);
CREATE INDEX IF NOT EXISTS idx_payments_invoice  ON payments(invoice_id);

-- =============================================================================
-- TABLE: admin_notes
-- Free-form notes admins attach to any entity.
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_notes (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_type TEXT NOT NULL,  -- 'business' | 'invoice' | 'order' | 'supplier'
    entity_id   UUID NOT NULL,
    note        TEXT NOT NULL,
    created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by  UUID NOT NULL REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_admin_notes_entity ON admin_notes(entity_type, entity_id);

-- =============================================================================
-- ALTER orders: add business-order linking columns
-- =============================================================================

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS business_id    UUID REFERENCES businesses(id),
    ADD COLUMN IF NOT EXISTS payment_method payment_method DEFAULT 'card',
    ADD COLUMN IF NOT EXISTS invoice_id     UUID REFERENCES invoices(id);

CREATE INDEX IF NOT EXISTS idx_orders_business ON orders(business_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Get total outstanding balance for a business (sum of charges minus payments)
CREATE OR REPLACE FUNCTION get_outstanding_balance(p_business_id UUID)
RETURNS NUMERIC(12,2) LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT COALESCE(SUM(amount), 0)::NUMERIC(12,2)
    FROM credit_ledger
    WHERE business_id = p_business_id;
$$;

-- Get available credit for a business
CREATE OR REPLACE FUNCTION get_available_credit(p_business_id UUID)
RETURNS NUMERIC(12,2) LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT GREATEST(
        0,
        (SELECT credit_limit FROM credit_accounts WHERE business_id = p_business_id AND status = 'active')
        - get_outstanding_balance(p_business_id)
    )::NUMERIC(12,2);
$$;

-- Check if sufficient credit is available for an amount
CREATE OR REPLACE FUNCTION has_sufficient_credit(p_business_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT get_available_credit(p_business_id) >= p_amount
       AND EXISTS (
           SELECT 1 FROM credit_accounts
           WHERE business_id = p_business_id AND status = 'active'
       );
$$;

-- Check if business has any overdue invoices (blocks invoice checkout)
CREATE OR REPLACE FUNCTION has_overdue_invoices(p_business_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM invoices
        WHERE business_id = p_business_id
          AND status = 'overdue'
    );
$$;

-- Generate invoice number: INV-YYYYMMDD-NNNNN
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT LANGUAGE plpgsql AS $$
DECLARE v TEXT; exists BOOLEAN;
BEGIN
    LOOP
        v := 'INV-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' ||
             LPAD(FLOOR(RANDOM() * 100000)::TEXT, 5, '0');
        SELECT EXISTS (SELECT 1 FROM invoices WHERE invoice_number = v) INTO exists;
        EXIT WHEN NOT exists;
    END LOOP;
    RETURN v;
END;
$$;

-- Append a ledger entry and return running balance
CREATE OR REPLACE FUNCTION post_ledger_entry(
    p_business_id UUID,
    p_type        ledger_entry_type,
    p_amount      NUMERIC,
    p_order_id    UUID DEFAULT NULL,
    p_invoice_id  UUID DEFAULT NULL,
    p_note        TEXT DEFAULT NULL,
    p_created_by  UUID DEFAULT NULL
) RETURNS NUMERIC(12,2) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_balance NUMERIC(12,2);
BEGIN
    SELECT COALESCE(SUM(amount), 0) INTO v_balance
    FROM credit_ledger WHERE business_id = p_business_id;

    v_balance := v_balance + p_amount;

    INSERT INTO credit_ledger
        (business_id, order_id, invoice_id, type, amount, balance_after, note, created_by)
    VALUES
        (p_business_id, p_order_id, p_invoice_id, p_type, p_amount, v_balance, p_note, p_created_by);

    RETURN v_balance;
END;
$$;

-- Mark invoices as overdue (run via pg_cron or called from app daily)
CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_count INTEGER;
BEGIN
    UPDATE invoices
    SET status = 'overdue', updated_at = NOW()
    WHERE status IN ('issued', 'partial')
      AND due_date < CURRENT_DATE;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- Auto-suspend credit when overdue invoice exists
CREATE OR REPLACE FUNCTION auto_suspend_credit_on_overdue()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.status = 'overdue' AND OLD.status != 'overdue' THEN
        UPDATE credit_accounts
        SET status = 'suspended',
            suspended_at = NOW(),
            suspended_reason = 'Auto-suspended: invoice ' || NEW.invoice_number || ' is overdue',
            updated_at = NOW()
        WHERE business_id = NEW.business_id
          AND status = 'active';
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_auto_suspend ON invoices;
CREATE TRIGGER trg_invoices_auto_suspend
    AFTER UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION auto_suspend_credit_on_overdue();

-- Update invoice status when payment brings it to full/partial
CREATE OR REPLACE FUNCTION update_invoice_on_payment()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_total NUMERIC(12,2);
BEGIN
    IF NEW.invoice_id IS NULL THEN RETURN NEW; END IF;

    SELECT total INTO v_total FROM invoices WHERE id = NEW.invoice_id;

    UPDATE invoices
    SET amount_paid = amount_paid + NEW.amount,
        status = CASE
            WHEN amount_paid + NEW.amount >= v_total THEN 'paid'::invoice_status
            WHEN amount_paid + NEW.amount > 0        THEN 'partial'::invoice_status
            ELSE status
        END,
        paid_at = CASE
            WHEN amount_paid + NEW.amount >= v_total THEN NOW()
            ELSE paid_at
        END,
        updated_at = NOW()
    WHERE id = NEW.invoice_id;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_payments_update_invoice ON payments;
CREATE TRIGGER trg_payments_update_invoice
    AFTER INSERT ON payments
    FOR EACH ROW EXECUTE FUNCTION update_invoice_on_payment();

-- Auto-lift suspension when all overdue invoices are cleared
CREATE OR REPLACE FUNCTION auto_lift_suspension()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF NEW.status = 'paid' AND OLD.status = 'overdue' THEN
        -- Only lift if no other overdue invoices remain
        IF NOT has_overdue_invoices(NEW.business_id) THEN
            UPDATE credit_accounts
            SET status = 'active',
                suspended_at = NULL,
                suspended_reason = NULL,
                updated_at = NOW()
            WHERE business_id = NEW.business_id
              AND status = 'suspended'
              AND suspended_reason LIKE 'Auto-suspended%';
        END IF;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_invoices_lift_suspension ON invoices;
CREATE TRIGGER trg_invoices_lift_suspension
    AFTER UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION auto_lift_suspension();

-- updated_at triggers
DROP TRIGGER IF EXISTS trg_businesses_upd       ON businesses;
DROP TRIGGER IF EXISTS trg_credit_accounts_upd  ON credit_accounts;
DROP TRIGGER IF EXISTS trg_invoices_upd         ON invoices;

CREATE TRIGGER trg_businesses_upd      BEFORE UPDATE ON businesses      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_credit_accounts_upd BEFORE UPDATE ON credit_accounts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_invoices_upd        BEFORE UPDATE ON invoices        FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE businesses       ENABLE ROW LEVEL SECURITY;
ALTER TABLE business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_accounts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE credit_ledger    ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments         ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes      ENABLE ROW LEVEL SECURITY;

-- Helper: is the current user a member of a business?
CREATE OR REPLACE FUNCTION auth.is_business_member(p_business_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM business_members
        WHERE business_id = p_business_id AND user_id = auth.uid()
    );
$$;

-- Helper: is the current user an owner or manager of a business?
CREATE OR REPLACE FUNCTION auth.is_business_manager(p_business_id UUID)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT EXISTS (
        SELECT 1 FROM business_members
        WHERE business_id = p_business_id
          AND user_id = auth.uid()
          AND role IN ('owner', 'manager')
    );
$$;

-- businesses
CREATE POLICY "biz: own read"
    ON businesses FOR SELECT
    USING (auth.is_business_member(id) OR auth.is_admin());

CREATE POLICY "biz: own insert"
    ON businesses FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL AND owner_user_id = auth.uid());

CREATE POLICY "biz: owner update"
    ON businesses FOR UPDATE
    USING (owner_user_id = auth.uid() OR auth.is_admin())
    WITH CHECK (owner_user_id = auth.uid() OR auth.is_admin());

CREATE POLICY "biz: admin all"
    ON businesses FOR ALL
    USING (auth.is_admin());

-- business_members
CREATE POLICY "biz_members: own read"
    ON business_members FOR SELECT
    USING (user_id = auth.uid() OR auth.is_business_manager(business_id) OR auth.is_admin());

CREATE POLICY "biz_members: manager insert"
    ON business_members FOR INSERT
    WITH CHECK (auth.is_business_manager(business_id) OR auth.is_admin());

CREATE POLICY "biz_members: admin all"
    ON business_members FOR ALL
    USING (auth.is_admin());

-- credit_accounts: business members read, admin write
CREATE POLICY "credit: member read"
    ON credit_accounts FOR SELECT
    USING (auth.is_business_member(business_id) OR auth.is_admin());

CREATE POLICY "credit: admin all"
    ON credit_accounts FOR ALL
    USING (auth.is_admin());

-- credit_ledger: business members read, admin insert
CREATE POLICY "ledger: member read"
    ON credit_ledger FOR SELECT
    USING (auth.is_business_member(business_id) OR auth.is_admin());

CREATE POLICY "ledger: admin all"
    ON credit_ledger FOR ALL
    USING (auth.is_admin());

-- invoices: business members read, system+admin write
CREATE POLICY "inv: member read"
    ON invoices FOR SELECT
    USING (auth.is_business_member(business_id) OR auth.is_admin());

CREATE POLICY "inv: member insert"
    ON invoices FOR INSERT
    WITH CHECK (auth.is_business_member(business_id));

CREATE POLICY "inv: admin all"
    ON invoices FOR ALL
    USING (auth.is_admin());

-- payments: business members + admin
CREATE POLICY "pay: member read"
    ON payments FOR SELECT
    USING (auth.is_business_member(business_id) OR auth.is_admin());

CREATE POLICY "pay: admin all"
    ON payments FOR ALL
    USING (auth.is_admin());

-- admin_notes: admins only
CREATE POLICY "admin_notes: admin only"
    ON admin_notes FOR ALL
    USING (auth.is_admin());
