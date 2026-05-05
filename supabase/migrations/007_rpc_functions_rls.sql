-- =============================================================================
-- 007_rpc_functions_rls.sql
-- All stored procedures / functions used by the application services:
--   creditService.ts  – get_outstanding_balance, get_available_credit,
--                        has_overdue_invoices, generate_invoice_number,
--                        post_ledger_entry, mark_overdue_invoices
--   riskService.ts    – compute_business_metrics, suggest_credit_limit_increase,
--                        approve_credit_suggestion, log_admin_action,
--                        run_credit_health_check
--   supplierService.ts – approve_supplier_product, calculate_commission
--
-- Also:
--   • credit_limit_suggestions table (required by riskService)
--   • credit_ledger  VIEW alias → credit_ledger_entries (required by creditService)
--   • admin_audit_log table  (required by log_admin_action)
--   • product_variants.stock_quantity column (if missing)
-- =============================================================================

-- =============================================================================
-- credit_ledger view alias
-- creditService.ts queries from('credit_ledger') but the table is
-- named credit_ledger_entries.  A simple view resolves this.
-- =============================================================================

CREATE OR REPLACE VIEW credit_ledger AS
    SELECT * FROM credit_ledger_entries;

-- =============================================================================
-- admin_audit_log  (required by log_admin_action RPC)
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
    id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    actor_user_id UUID NOT NULL REFERENCES auth.users(id),
    action        TEXT NOT NULL,
    entity_type   TEXT NOT NULL,
    entity_id     TEXT,
    payload       JSONB DEFAULT '{}',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_log_actor  ON admin_audit_log(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON admin_audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_ts     ON admin_audit_log(created_at DESC);

ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_log_admin_select"
    ON admin_audit_log FOR SELECT
    USING ((SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin');

-- =============================================================================
-- credit_limit_suggestions  (required by riskService.ts)
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_limit_suggestions (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    business_id         UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    current_tier        TEXT NOT NULL DEFAULT 'starter'
                            CHECK (current_tier IN ('starter', 'trusted', 'pro')),
    suggested_tier      TEXT
                            CHECK (suggested_tier IN ('starter', 'trusted', 'pro')),
    current_limit       NUMERIC(12,2) NOT NULL,
    suggested_limit     NUMERIC(12,2) NOT NULL,
    completed_invoices  INTEGER NOT NULL DEFAULT 0,
    total_paid          NUMERIC(14,2) NOT NULL DEFAULT 0,
    avg_days_to_pay     NUMERIC(6,2) NOT NULL DEFAULT 0,
    on_time_payments    INTEGER NOT NULL DEFAULT 0,
    late_payments       INTEGER NOT NULL DEFAULT 0,
    overdue_last_90d    INTEGER NOT NULL DEFAULT 0,
    reasons             TEXT[] NOT NULL DEFAULT '{}',
    blocking_reasons    TEXT[] NOT NULL DEFAULT '{}',
    status              TEXT NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    reviewed_by         UUID REFERENCES auth.users(id),
    reviewed_at         TIMESTAMPTZ,
    computed_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at          TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE INDEX IF NOT EXISTS idx_cls_business_id ON credit_limit_suggestions(business_id);
CREATE INDEX IF NOT EXISTS idx_cls_status      ON credit_limit_suggestions(status);
CREATE INDEX IF NOT EXISTS idx_cls_computed_at ON credit_limit_suggestions(computed_at DESC);

ALTER TABLE credit_limit_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cls_admin_all"
    ON credit_limit_suggestions FOR ALL
    USING ((SELECT role FROM user_profiles WHERE user_id = auth.uid()) = 'admin');

CREATE POLICY "cls_business_owner_select"
    ON credit_limit_suggestions FOR SELECT
    USING (
        business_id IN (
            SELECT id FROM businesses WHERE owner_user_id = auth.uid()
        )
    );

-- =============================================================================
-- Ensure product_variants has stock_quantity
-- =============================================================================

ALTER TABLE product_variants
    ADD COLUMN IF NOT EXISTS stock_quantity INTEGER NOT NULL DEFAULT 0;

-- =============================================================================
-- get_outstanding_balance(p_business_id)
-- Returns the net outstanding balance: SUM of all charges minus all payments
-- and credit notes for a business.
-- =============================================================================

CREATE OR REPLACE FUNCTION get_outstanding_balance(p_business_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(SUM(amount), 0)
    FROM   credit_ledger_entries
    WHERE  business_id = p_business_id;
$$;

-- =============================================================================
-- get_available_credit(p_business_id)
-- Returns credit_limit minus outstanding balance.
-- =============================================================================

CREATE OR REPLACE FUNCTION get_available_credit(p_business_id UUID)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT COALESCE(ca.credit_limit, 0) - get_outstanding_balance(p_business_id)
    FROM   credit_accounts ca
    WHERE  ca.business_id = p_business_id
    LIMIT  1;
$$;

-- =============================================================================
-- has_overdue_invoices(p_business_id)
-- Returns TRUE if any invoice for the business has status = 'overdue'.
-- =============================================================================

CREATE OR REPLACE FUNCTION has_overdue_invoices(p_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM   invoices
        WHERE  business_id = p_business_id
          AND  status      = 'overdue'
    );
$$;

-- =============================================================================
-- generate_invoice_number()
-- Returns a unique invoice number in the format INV-YYYYMM-XXXXXX.
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_prefix   TEXT := 'INV-' || TO_CHAR(NOW(), 'YYYYMM') || '-';
    v_number   TEXT;
    v_exists   BOOLEAN;
BEGIN
    LOOP
        v_number := v_prefix || LPAD(FLOOR(random() * 999999 + 1)::TEXT, 6, '0');
        SELECT EXISTS (
            SELECT 1 FROM invoices WHERE invoice_number = v_number
        ) INTO v_exists;
        EXIT WHEN NOT v_exists;
    END LOOP;
    RETURN v_number;
END;
$$;

-- =============================================================================
-- post_ledger_entry(...)
-- Atomically appends a row to credit_ledger_entries and returns the new
-- running balance.  All monetary amounts should be signed:
--   positive  → charge / balance increase
--   negative  → payment / credit note / balance decrease
-- =============================================================================

CREATE OR REPLACE FUNCTION post_ledger_entry(
    p_business_id UUID,
    p_type        TEXT,
    p_amount      NUMERIC,
    p_order_id    UUID    DEFAULT NULL,
    p_invoice_id  UUID    DEFAULT NULL,
    p_note        TEXT    DEFAULT NULL,
    p_created_by  UUID    DEFAULT NULL
)
RETURNS NUMERIC
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_prev_balance NUMERIC;
    v_new_balance  NUMERIC;
BEGIN
    -- Compute current outstanding balance before this entry
    v_prev_balance := get_outstanding_balance(p_business_id);
    v_new_balance  := v_prev_balance + p_amount;

    INSERT INTO credit_ledger_entries (
        business_id,
        order_id,
        invoice_id,
        type,
        amount,
        balance_after,
        note,
        created_by
    ) VALUES (
        p_business_id,
        p_order_id,
        p_invoice_id,
        p_type,
        p_amount,
        v_new_balance,
        p_note,
        p_created_by
    );

    RETURN v_new_balance;
END;
$$;

-- Add created_by column to credit_ledger_entries if it was not in migration 003
ALTER TABLE credit_ledger_entries
    ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- =============================================================================
-- mark_overdue_invoices()
-- Marks all unpaid invoices past due_date as 'overdue'.
-- Returns the count of invoices updated.
-- =============================================================================

CREATE OR REPLACE FUNCTION mark_overdue_invoices()
RETURNS INTEGER
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE invoices
    SET    status = 'overdue'
    WHERE  status  IN ('issued', 'partial')
      AND  due_date < CURRENT_DATE;

    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$;

-- =============================================================================
-- compute_business_metrics(p_business_id)
-- Returns a JSONB snapshot of payment history metrics used by the risk engine.
-- =============================================================================

CREATE OR REPLACE FUNCTION compute_business_metrics(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
AS $$
DECLARE
    v_account        credit_accounts%ROWTYPE;
    v_completed      INTEGER;
    v_total_paid     NUMERIC;
    v_on_time        INTEGER;
    v_late           INTEGER;
    v_avg_days       NUMERIC;
    v_overdue_60d    INTEGER;
    v_overdue_90d    INTEGER;
    v_two_late_90d   BOOLEAN;
BEGIN
    SELECT * INTO v_account
    FROM   credit_accounts
    WHERE  business_id = p_business_id;

    IF NOT FOUND THEN
        RETURN NULL;
    END IF;

    -- Count completed (paid) invoices
    SELECT COUNT(*) INTO v_completed
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid';

    -- Total paid
    SELECT COALESCE(SUM(amount_paid), 0) INTO v_total_paid
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid';

    -- On-time payments: paid_at <= due_date
    SELECT COUNT(*) INTO v_on_time
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status      = 'paid'
      AND  paid_at::date <= due_date;

    -- Late payments
    v_late := v_completed - v_on_time;

    -- Average days to pay (paid_at - created_at)
    SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (paid_at - created_at)) / 86400), 0)
      INTO v_avg_days
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status      = 'paid';

    -- Overdue events in last 60 / 90 days
    SELECT COUNT(*) INTO v_overdue_60d
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status      = 'overdue'
      AND  due_date    >= CURRENT_DATE - INTERVAL '60 days';

    SELECT COUNT(*) INTO v_overdue_90d
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status      = 'overdue'
      AND  due_date    >= CURRENT_DATE - INTERVAL '90 days';

    v_two_late_90d := (v_overdue_90d >= 2);

    RETURN jsonb_build_object(
        'business_id',          p_business_id,
        'current_tier',         v_account.risk_tier,
        'current_limit',        v_account.credit_limit,
        'terms_days',           v_account.terms_days,
        'completed_invoices',   v_completed,
        'total_paid',           v_total_paid,
        'on_time_payments',     v_on_time,
        'late_payments',        v_late,
        'avg_days_to_pay',      ROUND(v_avg_days::NUMERIC, 2),
        'overdue_last_60d',     v_overdue_60d,
        'overdue_last_90d',     v_overdue_90d,
        'two_or_more_late_90d', v_two_late_90d
    );
END;
$$;

-- =============================================================================
-- suggest_credit_limit_increase(p_business_id)
-- Evaluates the business metrics and returns a JSONB recommendation.
-- Promotion criteria:
--   starter → trusted  : ≥ 5 paid invoices, 0 overdue in last 90d, avg <25d
--   trusted → pro      : ≥ 15 paid invoices, 0 overdue in last 90d, avg <20d
-- =============================================================================

CREATE OR REPLACE FUNCTION suggest_credit_limit_increase(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_metrics        JSONB;
    v_tier           TEXT;
    v_limit          NUMERIC;
    v_sug_tier       TEXT;
    v_sug_limit      NUMERIC;
    v_eligible       BOOLEAN := FALSE;
    v_reasons        TEXT[]  := '{}';
    v_blocking       TEXT[]  := '{}';
    v_completed      INTEGER;
    v_overdue_90d    INTEGER;
    v_avg_days       NUMERIC;
    v_suggestion_id  UUID;
BEGIN
    v_metrics     := compute_business_metrics(p_business_id);
    IF v_metrics IS NULL THEN RETURN NULL; END IF;

    v_tier        := v_metrics->>'current_tier';
    v_limit       := (v_metrics->>'current_limit')::NUMERIC;
    v_completed   := (v_metrics->>'completed_invoices')::INTEGER;
    v_overdue_90d := (v_metrics->>'overdue_last_90d')::INTEGER;
    v_avg_days    := (v_metrics->>'avg_days_to_pay')::NUMERIC;

    -- Determine eligibility
    IF v_tier = 'starter' THEN
        IF v_completed >= 5 AND v_overdue_90d = 0 AND v_avg_days < 25 THEN
            v_eligible  := TRUE;
            v_sug_tier  := 'trusted';
            v_sug_limit := GREATEST(v_limit * 2, 10000);
            v_reasons   := ARRAY['5+ paid invoices', 'No overdue in 90 days', 'Avg payment under 25 days'];
        ELSE
            IF v_completed < 5      THEN v_blocking := v_blocking || ARRAY['Fewer than 5 paid invoices']; END IF;
            IF v_overdue_90d > 0    THEN v_blocking := v_blocking || ARRAY['Overdue invoices in last 90 days']; END IF;
            IF v_avg_days >= 25     THEN v_blocking := v_blocking || ARRAY['Average days to pay >= 25']; END IF;
        END IF;

    ELSIF v_tier = 'trusted' THEN
        IF v_completed >= 15 AND v_overdue_90d = 0 AND v_avg_days < 20 THEN
            v_eligible  := TRUE;
            v_sug_tier  := 'pro';
            v_sug_limit := GREATEST(v_limit * 2, 50000);
            v_reasons   := ARRAY['15+ paid invoices', 'No overdue in 90 days', 'Avg payment under 20 days'];
        ELSE
            IF v_completed < 15     THEN v_blocking := v_blocking || ARRAY['Fewer than 15 paid invoices']; END IF;
            IF v_overdue_90d > 0    THEN v_blocking := v_blocking || ARRAY['Overdue invoices in last 90 days']; END IF;
            IF v_avg_days >= 20     THEN v_blocking := v_blocking || ARRAY['Average days to pay >= 20']; END IF;
        END IF;

    ELSE
        -- Already at pro, no further promotion
        v_sug_tier  := NULL;
        v_sug_limit := v_limit;
        v_blocking  := ARRAY['Already at highest tier'];
    END IF;

    -- Persist the suggestion
    IF v_eligible THEN
        INSERT INTO credit_limit_suggestions (
            business_id,
            current_tier,  suggested_tier,
            current_limit, suggested_limit,
            completed_invoices, total_paid, avg_days_to_pay,
            on_time_payments, late_payments, overdue_last_90d,
            reasons, blocking_reasons,
            status
        ) VALUES (
            p_business_id,
            v_tier,   v_sug_tier,
            v_limit,  v_sug_limit,
            v_completed,
            (v_metrics->>'total_paid')::NUMERIC,
            v_avg_days,
            (v_metrics->>'on_time_payments')::INTEGER,
            (v_metrics->>'late_payments')::INTEGER,
            v_overdue_90d,
            v_reasons,
            v_blocking,
            'pending'
        )
        RETURNING id INTO v_suggestion_id;
    END IF;

    RETURN jsonb_build_object(
        'business_id',      p_business_id,
        'current_tier',     v_tier,
        'current_limit',    v_limit,
        'suggested_tier',   v_sug_tier,
        'suggested_limit',  v_sug_limit,
        'eligible',         v_eligible,
        'reasons',          v_reasons,
        'blocking_reasons', v_blocking,
        'metrics',          v_metrics
    );
END;
$$;

-- =============================================================================
-- approve_credit_suggestion(p_suggestion_id, p_admin_user_id)
-- Atomically applies the new tier / limit and marks the suggestion approved.
-- =============================================================================

CREATE OR REPLACE FUNCTION approve_credit_suggestion(
    p_suggestion_id UUID,
    p_admin_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_row    credit_limit_suggestions%ROWTYPE;
    v_now    TIMESTAMPTZ := NOW();
BEGIN
    SELECT * INTO v_row
    FROM   credit_limit_suggestions
    WHERE  id = p_suggestion_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', FALSE, 'error', 'Suggestion not found.');
    END IF;

    IF v_row.status <> 'pending' THEN
        RETURN jsonb_build_object('ok', FALSE, 'error', 'Suggestion is not in pending state.');
    END IF;

    -- Apply the new tier and limit to the credit account
    UPDATE credit_accounts
    SET    risk_tier     = v_row.suggested_tier,
           credit_limit  = v_row.suggested_limit,
           updated_at    = v_now
    WHERE  business_id   = v_row.business_id;

    -- Mark suggestion approved
    UPDATE credit_limit_suggestions
    SET    status      = 'approved',
           reviewed_by = p_admin_user_id,
           reviewed_at = v_now
    WHERE  id          = p_suggestion_id;

    -- Audit trail
    PERFORM log_admin_action(
        p_admin_user_id,
        'approve_credit_suggestion',
        'credit_limit_suggestion',
        p_suggestion_id::TEXT,
        jsonb_build_object(
            'new_tier',  v_row.suggested_tier,
            'new_limit', v_row.suggested_limit
        )
    );

    RETURN jsonb_build_object(
        'ok',        TRUE,
        'new_tier',  v_row.suggested_tier,
        'new_limit', v_row.suggested_limit
    );
END;
$$;

-- =============================================================================
-- log_admin_action(p_actor_user_id, p_action, p_entity_type, p_entity_id, p_payload)
-- Writes a row to admin_audit_log.  Safe to call with partial params.
-- =============================================================================

CREATE OR REPLACE FUNCTION log_admin_action(
    p_actor_user_id UUID,
    p_action        TEXT,
    p_entity_type   TEXT,
    p_entity_id     TEXT  DEFAULT NULL,
    p_payload       JSONB DEFAULT '{}'
)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO admin_audit_log (actor_user_id, action, entity_type, entity_id, payload)
    VALUES (p_actor_user_id, p_action, p_entity_type, p_entity_id, p_payload);
EXCEPTION WHEN OTHERS THEN
    -- Never let audit logging crash the caller
    NULL;
END;
$$;

-- =============================================================================
-- run_credit_health_check()
-- Batch maintenance: expire old suggestions, mark overdue invoices,
-- auto-suspend businesses with overdue balances.
-- Returns a summary JSONB.
-- =============================================================================

CREATE OR REPLACE FUNCTION run_credit_health_check()
RETURNS JSONB
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
DECLARE
    v_overdue_count    INTEGER;
    v_expired_count    INTEGER;
    v_suspended_count  INTEGER;
BEGIN
    -- 1. Mark unpaid past-due invoices as overdue
    v_overdue_count := mark_overdue_invoices();

    -- 2. Expire stale pending suggestions
    UPDATE credit_limit_suggestions
    SET    status = 'expired'
    WHERE  status    = 'pending'
      AND  expires_at < NOW();
    GET DIAGNOSTICS v_expired_count = ROW_COUNT;

    -- 3. Auto-suspend credit accounts that now have overdue invoices
    UPDATE credit_accounts ca
    SET    status           = 'suspended',
           suspended_reason = 'Automated: overdue invoices detected during health check.',
           suspended_at     = NOW(),
           updated_at       = NOW()
    WHERE  ca.status = 'active'
      AND  has_overdue_invoices(ca.business_id);
    GET DIAGNOSTICS v_suspended_count = ROW_COUNT;

    RETURN jsonb_build_object(
        'ok',               TRUE,
        'overdue_marked',   v_overdue_count,
        'suggestions_expired', v_expired_count,
        'accounts_suspended',  v_suspended_count,
        'run_at',           NOW()
    );
END;
$$;

-- =============================================================================
-- approve_supplier_product(p_supplier_product_id, p_admin_user_id)
-- Marks a supplier product submission as approved.
-- =============================================================================

CREATE OR REPLACE FUNCTION approve_supplier_product(
    p_supplier_product_id UUID,
    p_admin_user_id       UUID
)
RETURNS VOID
LANGUAGE plpgsql
VOLATILE
SECURITY DEFINER
AS $$
BEGIN
    UPDATE supplier_products
    SET    status      = 'approved',
           reviewed_at = NOW(),
           reviewed_by = p_admin_user_id
    WHERE  id = p_supplier_product_id;

    PERFORM log_admin_action(
        p_admin_user_id,
        'approve_supplier_product',
        'supplier_product',
        p_supplier_product_id::TEXT,
        '{}'
    );
END;
$$;

-- =============================================================================
-- calculate_commission(p_supplier_id, p_line_total)
-- Returns the commission amount for a line total using the supplier's
-- current commission rate. Falls back to 10% if no rate is found.
-- =============================================================================

CREATE OR REPLACE FUNCTION calculate_commission(
    p_supplier_id UUID,
    p_line_total  NUMERIC
)
RETURNS NUMERIC
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
    SELECT ROUND(
        p_line_total * COALESCE(
            (SELECT rate_percent
             FROM   commissions
             WHERE  supplier_id    = p_supplier_id
               AND  effective_from <= CURRENT_DATE
             ORDER  BY effective_from DESC
             LIMIT  1),
            10  -- default 10 %
        ) / 100,
        2
    );
$$;
