-- =============================================================================
-- OUROZ – Migration 050: Risk Controls + Credit Tiering
-- Extends 020_phase_a_schema.sql with:
--   - credit_accounts: risk_tier, last_reviewed_at, status += 'inactive'
--   - orders: order_type, payment_mode
--   - admin_audit table
--   - credit_limit_suggestions table
--   - DB functions: compute_business_metrics(), suggest_credit_limit_increase()
--   - Auto-audit trigger on business status changes
-- =============================================================================

-- =============================================================================
-- ENUMS
-- =============================================================================

-- Add 'inactive' to the existing credit_status enum (idempotent via DO block)
DO $$ BEGIN
    ALTER TYPE credit_status ADD VALUE IF NOT EXISTS 'inactive';
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'risk_tier') THEN
        CREATE TYPE risk_tier AS ENUM ('starter', 'trusted', 'pro');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_type') THEN
        CREATE TYPE order_type AS ENUM ('retail', 'wholesale');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_mode') THEN
        CREATE TYPE payment_mode AS ENUM ('pay_now', 'invoice');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'suggestion_status') THEN
        CREATE TYPE suggestion_status AS ENUM ('pending', 'approved', 'rejected', 'expired');
    END IF;
END $$;

-- =============================================================================
-- ALTER credit_accounts: add risk columns
-- =============================================================================

ALTER TABLE credit_accounts
    ADD COLUMN IF NOT EXISTS risk_tier        risk_tier NOT NULL DEFAULT 'starter',
    ADD COLUMN IF NOT EXISTS last_reviewed_at TIMESTAMP WITH TIME ZONE;

-- New businesses default to 'inactive'; admin must activate
-- (Existing accounts in 'active' are unaffected — idempotent)

-- =============================================================================
-- ALTER orders: add order classification columns
-- =============================================================================

ALTER TABLE orders
    ADD COLUMN IF NOT EXISTS order_type   order_type   NOT NULL DEFAULT 'retail',
    ADD COLUMN IF NOT EXISTS payment_mode payment_mode;

-- Back-fill existing wholesale orders
UPDATE orders
SET order_type   = 'wholesale',
    payment_mode = CASE
        WHEN payment_method = 'invoice' THEN 'invoice'::payment_mode
        ELSE 'pay_now'::payment_mode
    END
WHERE is_wholesale = TRUE
  AND order_type   = 'retail';  -- only rows not yet updated

-- =============================================================================
-- TABLE: admin_audit
-- Immutable audit log. Created with SECURITY DEFINER functions only.
-- =============================================================================

CREATE TABLE IF NOT EXISTS admin_audit (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action        TEXT    NOT NULL,  -- 'approve_business', 'suspend_credit', 'record_payment', etc.
    entity_type   TEXT    NOT NULL,  -- 'business', 'invoice', 'credit_account', etc.
    entity_id     UUID    NOT NULL,
    payload       JSONB   NOT NULL DEFAULT '{}',
    ip_address    TEXT,
    created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_actor  ON admin_audit(actor_user_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON admin_audit(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit(action);
CREATE INDEX IF NOT EXISTS idx_audit_ts     ON admin_audit(created_at);

ALTER TABLE admin_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit: admin read"
    ON admin_audit FOR SELECT
    USING (auth.is_admin());

CREATE POLICY "audit: insert all authenticated"
    ON admin_audit FOR INSERT
    WITH CHECK (auth.uid() IS NOT NULL);

-- =============================================================================
-- TABLE: credit_limit_suggestions
-- Computed suggestions for credit limit increases.
-- =============================================================================

CREATE TABLE IF NOT EXISTS credit_limit_suggestions (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id          UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    current_tier         risk_tier NOT NULL,
    suggested_tier       risk_tier NOT NULL,
    current_limit        NUMERIC(12,2) NOT NULL,
    suggested_limit      NUMERIC(12,2) NOT NULL,

    -- Metrics snapshot at time of computation
    completed_invoices   INTEGER NOT NULL DEFAULT 0,
    total_paid           NUMERIC(12,2) NOT NULL DEFAULT 0,
    avg_days_to_pay      NUMERIC(6,2) NOT NULL DEFAULT 0,
    on_time_payments     INTEGER NOT NULL DEFAULT 0,
    late_payments        INTEGER NOT NULL DEFAULT 0,
    overdue_last_90d     INTEGER NOT NULL DEFAULT 0,

    reasons              TEXT[] NOT NULL DEFAULT '{}',
    blocking_reasons     TEXT[] NOT NULL DEFAULT '{}',
    status               suggestion_status NOT NULL DEFAULT 'pending',
    reviewed_by          UUID REFERENCES auth.users(id),
    reviewed_at          TIMESTAMP WITH TIME ZONE,
    computed_at          TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    expires_at           TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '30 days',
    created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_suggestions_business ON credit_limit_suggestions(business_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_status   ON credit_limit_suggestions(status);

ALTER TABLE credit_limit_suggestions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "suggestions: admin all"
    ON credit_limit_suggestions FOR ALL
    USING (auth.is_admin());

-- =============================================================================
-- FUNCTION: compute_business_metrics(p_business_id)
-- Returns a JSONB object with all risk-scoring metrics.
-- =============================================================================

CREATE OR REPLACE FUNCTION compute_business_metrics(p_business_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
    v_result                  JSONB;
    v_completed_invoices      INTEGER;
    v_total_paid              NUMERIC(12,2);
    v_on_time                 INTEGER;
    v_late                    INTEGER;
    v_avg_days                NUMERIC(6,2);
    v_overdue_last_60d        INTEGER;
    v_overdue_last_90d        INTEGER;
    v_two_late_last_90d       BOOLEAN;
    v_current_tier            risk_tier;
    v_current_limit           NUMERIC(12,2);
    v_terms_days              INTEGER;
BEGIN
    -- Get credit account info
    SELECT risk_tier, credit_limit, terms_days
    INTO   v_current_tier, v_current_limit, v_terms_days
    FROM   credit_accounts
    WHERE  business_id = p_business_id;

    -- Count completed (paid) invoices
    SELECT COUNT(*)
    INTO   v_completed_invoices
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid';

    -- Total amount paid across all paid invoices
    SELECT COALESCE(SUM(total), 0)
    INTO   v_total_paid
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid';

    -- On-time: paid on or before due_date
    SELECT COUNT(*)
    INTO   v_on_time
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid'
      AND  DATE(paid_at) <= due_date;

    -- Late: paid after due_date
    SELECT COUNT(*)
    INTO   v_late
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid'
      AND  DATE(paid_at) > due_date;

    -- Average days to pay (from created_at to paid_at)
    SELECT COALESCE(AVG(EXTRACT(EPOCH FROM (paid_at - created_at)) / 86400), 0)
    INTO   v_avg_days
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid'
      AND  paid_at IS NOT NULL;

    -- Overdue invoices in last 60 days (any invoice that went overdue in last 60d)
    SELECT COUNT(*)
    INTO   v_overdue_last_60d
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status IN ('overdue', 'paid')
      AND  due_date >= CURRENT_DATE - INTERVAL '60 days'
      AND  (status = 'overdue' OR DATE(paid_at) > due_date);

    -- Overdue invoices in last 90 days
    SELECT COUNT(*)
    INTO   v_overdue_last_90d
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  due_date >= CURRENT_DATE - INTERVAL '90 days'
      AND  (status = 'overdue' OR (status = 'paid' AND DATE(paid_at) > due_date));

    -- More than 2 late payments in last 90 days
    SELECT COUNT(*) > 2
    INTO   v_two_late_last_90d
    FROM   invoices
    WHERE  business_id = p_business_id
      AND  status = 'paid'
      AND  DATE(paid_at) > due_date
      AND  paid_at >= NOW() - INTERVAL '90 days';

    -- Build result
    v_result := jsonb_build_object(
        'business_id',             p_business_id,
        'current_tier',            v_current_tier,
        'current_limit',           v_current_limit,
        'terms_days',              v_terms_days,
        'completed_invoices',      v_completed_invoices,
        'total_paid',              v_total_paid,
        'on_time_payments',        v_on_time,
        'late_payments',           v_late,
        'avg_days_to_pay',         ROUND(v_avg_days, 1),
        'overdue_last_60d',        v_overdue_last_60d,
        'overdue_last_90d',        v_overdue_last_90d,
        'two_or_more_late_90d',    v_two_late_last_90d
    );

    RETURN v_result;
END;
$$;

-- =============================================================================
-- FUNCTION: suggest_credit_limit_increase(p_business_id)
-- Evaluates tier upgrade rules and returns a suggestion object.
-- =============================================================================

CREATE OR REPLACE FUNCTION suggest_credit_limit_increase(p_business_id UUID)
RETURNS JSONB LANGUAGE plpgsql STABLE SECURITY DEFINER AS $$
DECLARE
    v_metrics          JSONB;
    v_current_tier     risk_tier;
    v_current_limit    NUMERIC(12,2);
    v_terms_days       INTEGER;
    v_suggested_tier   risk_tier;
    v_suggested_limit  NUMERIC(12,2);
    v_eligible         BOOLEAN := FALSE;
    v_reasons          TEXT[]  := '{}';
    v_blocking         TEXT[]  := '{}';
BEGIN
    v_metrics := compute_business_metrics(p_business_id);

    v_current_tier  := (v_metrics->>'current_tier')::risk_tier;
    v_current_limit := (v_metrics->>'current_limit')::NUMERIC;
    v_terms_days    := (v_metrics->>'terms_days')::INTEGER;

    -- -----------------------------------------------------------------------
    -- Check for blocking conditions first (apply to all tiers)
    -- -----------------------------------------------------------------------

    -- Any currently-overdue invoices → hard block
    IF (SELECT EXISTS (
            SELECT 1 FROM invoices
            WHERE business_id = p_business_id AND status = 'overdue'
        )) THEN
        v_blocking := array_append(v_blocking, 'Has currently overdue invoices');
    END IF;

    -- More than 2 late payments in last 90 days
    IF (v_metrics->>'two_or_more_late_90d')::BOOLEAN THEN
        v_blocking := array_append(v_blocking, 'More than 2 late payments in the last 90 days');
    END IF;

    -- -----------------------------------------------------------------------
    -- Tier upgrade rules
    -- -----------------------------------------------------------------------

    IF v_current_tier = 'starter' THEN
        -- Rule: starter → trusted
        -- Need: ≥3 paid invoices, 0 overdue 60d, avg_days ≤ terms_days, total_paid ≥ 3000
        IF (v_metrics->>'completed_invoices')::INTEGER < 3 THEN
            v_blocking := array_append(v_blocking,
                'Needs at least 3 paid invoices (currently ' ||
                (v_metrics->>'completed_invoices') || ')');
        END IF;

        IF (v_metrics->>'overdue_last_60d')::INTEGER > 0 THEN
            v_blocking := array_append(v_blocking, 'Had overdue invoices in last 60 days');
        END IF;

        IF (v_metrics->>'avg_days_to_pay')::NUMERIC > v_terms_days THEN
            v_blocking := array_append(v_blocking,
                'Average days to pay (' || (v_metrics->>'avg_days_to_pay') ||
                'd) exceeds Net ' || v_terms_days || ' terms');
        END IF;

        IF (v_metrics->>'total_paid')::NUMERIC < 3000 THEN
            v_blocking := array_append(v_blocking,
                'Total paid (AED ' || (v_metrics->>'total_paid') ||
                ') must reach AED 3,000');
        END IF;

        IF array_length(v_blocking, 1) IS NULL THEN
            v_eligible        := TRUE;
            v_suggested_tier  := 'trusted';
            v_suggested_limit := LEAST(v_current_limit * 2, 10000);
            v_reasons := ARRAY[
                'Minimum 3 paid invoices achieved',
                'No overdue invoices in last 60 days',
                'Average payment time within Net ' || v_terms_days || ' terms',
                'Total paid ≥ AED 3,000'
            ];
        END IF;

    ELSIF v_current_tier = 'trusted' THEN
        -- Rule: trusted → pro
        -- Need: ≥10 paid invoices, 0 overdue 90d, avg ≤ terms-2, total ≥ 20000
        IF (v_metrics->>'completed_invoices')::INTEGER < 10 THEN
            v_blocking := array_append(v_blocking,
                'Needs at least 10 paid invoices (currently ' ||
                (v_metrics->>'completed_invoices') || ')');
        END IF;

        IF (v_metrics->>'overdue_last_90d')::INTEGER > 0 THEN
            v_blocking := array_append(v_blocking, 'Had overdue invoices in last 90 days');
        END IF;

        IF (v_metrics->>'avg_days_to_pay')::NUMERIC > (v_terms_days - 2) THEN
            v_blocking := array_append(v_blocking,
                'Average days to pay (' || (v_metrics->>'avg_days_to_pay') ||
                'd) must be ≤ Net ' || (v_terms_days - 2) || ' days (2d buffer required for Pro)');
        END IF;

        IF (v_metrics->>'total_paid')::NUMERIC < 20000 THEN
            v_blocking := array_append(v_blocking,
                'Total paid (AED ' || (v_metrics->>'total_paid') ||
                ') must reach AED 20,000');
        END IF;

        IF array_length(v_blocking, 1) IS NULL THEN
            v_eligible        := TRUE;
            v_suggested_tier  := 'pro';
            v_suggested_limit := LEAST(v_current_limit * 1.5, 25000);
            v_reasons := ARRAY[
                'Minimum 10 paid invoices achieved',
                'No overdue invoices in last 90 days',
                'Average payment time within Net ' || (v_terms_days - 2) || ' days',
                'Total paid ≥ AED 20,000'
            ];
        END IF;

    ELSE
        -- Already 'pro' tier
        v_reasons := ARRAY['Account is already at Pro tier'];
        v_eligible := FALSE;
    END IF;

    RETURN jsonb_build_object(
        'business_id',    p_business_id,
        'current_tier',   v_current_tier,
        'current_limit',  v_current_limit,
        'suggested_tier',  v_suggested_tier,
        'suggested_limit', v_suggested_limit,
        'eligible',        v_eligible,
        'reasons',         to_json(v_reasons),
        'blocking_reasons', to_json(v_blocking),
        'metrics',         v_metrics
    );
END;
$$;

-- =============================================================================
-- FUNCTION: run_credit_health_check()
-- Batch job: marks overdue, suspends accounts, upserts suggestions.
-- Returns a summary JSON.
-- =============================================================================

CREATE OR REPLACE FUNCTION run_credit_health_check()
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_overdue_count     INTEGER;
    v_suspended_count   INTEGER := 0;
    v_suggestions_count INTEGER := 0;
    v_biz               RECORD;
    v_suggestion        JSONB;
BEGIN
    -- 1. Mark overdue invoices
    UPDATE invoices
    SET status = 'overdue', updated_at = NOW()
    WHERE status IN ('issued', 'partial') AND due_date < CURRENT_DATE;
    GET DIAGNOSTICS v_overdue_count = ROW_COUNT;

    -- 2. Suspend credit for businesses with overdue invoices
    FOR v_biz IN
        SELECT DISTINCT b.id AS business_id
        FROM invoices i
        JOIN businesses b ON b.id = i.business_id
        WHERE i.status = 'overdue'
    LOOP
        UPDATE credit_accounts
        SET status = 'suspended',
            suspended_at = NOW(),
            suspended_reason = 'Auto-suspended: overdue invoice detected by credit health check',
            updated_at = NOW()
        WHERE business_id = v_biz.business_id
          AND status = 'active';

        IF FOUND THEN
            v_suspended_count := v_suspended_count + 1;
        END IF;
    END LOOP;

    -- 3. Compute suggestions for all active+trusted businesses
    FOR v_biz IN
        SELECT b.id AS business_id
        FROM businesses b
        JOIN credit_accounts ca ON ca.business_id = b.id
        WHERE b.status = 'approved'
          AND ca.status IN ('active', 'inactive')
          AND ca.risk_tier IN ('starter', 'trusted')
    LOOP
        v_suggestion := suggest_credit_limit_increase(v_biz.business_id);

        IF (v_suggestion->>'eligible')::BOOLEAN THEN
            INSERT INTO credit_limit_suggestions (
                business_id, current_tier, suggested_tier,
                current_limit, suggested_limit,
                completed_invoices, total_paid, avg_days_to_pay,
                on_time_payments, late_payments, overdue_last_90d,
                reasons, blocking_reasons, status
            ) VALUES (
                v_biz.business_id,
                (v_suggestion->>'current_tier')::risk_tier,
                (v_suggestion->>'suggested_tier')::risk_tier,
                (v_suggestion->>'current_limit')::NUMERIC,
                (v_suggestion->>'suggested_limit')::NUMERIC,
                ((v_suggestion->'metrics')->>'completed_invoices')::INTEGER,
                ((v_suggestion->'metrics')->>'total_paid')::NUMERIC,
                ((v_suggestion->'metrics')->>'avg_days_to_pay')::NUMERIC,
                ((v_suggestion->'metrics')->>'on_time_payments')::INTEGER,
                ((v_suggestion->'metrics')->>'late_payments')::INTEGER,
                ((v_suggestion->'metrics')->>'overdue_last_90d')::INTEGER,
                ARRAY(SELECT jsonb_array_elements_text(v_suggestion->'reasons')),
                '{}',
                'pending'
            )
            ON CONFLICT DO NOTHING;

            v_suggestions_count := v_suggestions_count + 1;
        END IF;
    END LOOP;

    RETURN jsonb_build_object(
        'invoices_marked_overdue', v_overdue_count,
        'accounts_suspended',      v_suspended_count,
        'suggestions_created',     v_suggestions_count,
        'ran_at',                  NOW()
    );
END;
$$;

-- =============================================================================
-- FUNCTION: approve_credit_suggestion(p_suggestion_id, p_admin_user_id)
-- Applies the suggested tier + limit to the credit account.
-- =============================================================================

CREATE OR REPLACE FUNCTION approve_credit_suggestion(
    p_suggestion_id UUID,
    p_admin_user_id UUID
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_sug      RECORD;
    v_old_tier risk_tier;
    v_old_limit NUMERIC(12,2);
BEGIN
    SELECT * INTO v_sug FROM credit_limit_suggestions WHERE id = p_suggestion_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('ok', false, 'error', 'Suggestion not found');
    END IF;
    IF v_sug.status != 'pending' THEN
        RETURN jsonb_build_object('ok', false, 'error', 'Suggestion is already ' || v_sug.status);
    END IF;

    -- Capture before values for audit
    SELECT risk_tier, credit_limit INTO v_old_tier, v_old_limit
    FROM credit_accounts WHERE business_id = v_sug.business_id;

    -- Update credit account
    UPDATE credit_accounts
    SET risk_tier        = v_sug.suggested_tier,
        credit_limit     = v_sug.suggested_limit,
        last_reviewed_at = NOW(),
        updated_at       = NOW()
    WHERE business_id = v_sug.business_id;

    -- Mark suggestion approved
    UPDATE credit_limit_suggestions
    SET status      = 'approved',
        reviewed_by = p_admin_user_id,
        reviewed_at = NOW()
    WHERE id = p_suggestion_id;

    -- Write audit log
    INSERT INTO admin_audit (actor_user_id, action, entity_type, entity_id, payload)
    VALUES (
        p_admin_user_id, 'approve_credit_suggestion', 'credit_account', v_sug.business_id,
        jsonb_build_object(
            'suggestion_id', p_suggestion_id,
            'old_tier',      v_old_tier,
            'new_tier',      v_sug.suggested_tier,
            'old_limit',     v_old_limit,
            'new_limit',     v_sug.suggested_limit
        )
    );

    RETURN jsonb_build_object('ok', true, 'new_tier', v_sug.suggested_tier, 'new_limit', v_sug.suggested_limit);
END;
$$;

-- =============================================================================
-- FUNCTION: log_admin_action(...)
-- Convenience wrapper to write to admin_audit from application code.
-- =============================================================================

CREATE OR REPLACE FUNCTION log_admin_action(
    p_actor_user_id UUID,
    p_action        TEXT,
    p_entity_type   TEXT,
    p_entity_id     UUID,
    p_payload       JSONB DEFAULT '{}'
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE v_id UUID;
BEGIN
    INSERT INTO admin_audit (actor_user_id, action, entity_type, entity_id, payload)
    VALUES (p_actor_user_id, p_action, p_entity_type, p_entity_id, p_payload)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$;

-- =============================================================================
-- TRIGGER: audit business status changes automatically
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_business_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO admin_audit (actor_user_id, action, entity_type, entity_id, payload)
        VALUES (
            NEW.approved_by,
            CASE
                WHEN NEW.status = 'approved' THEN 'approve_business'
                WHEN NEW.status = 'rejected' THEN 'reject_business'
                ELSE 'update_business_status'
            END,
            'business',
            NEW.id,
            jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status,
                'rejection_reason', NEW.rejection_reason
            )
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_business_status ON businesses;
CREATE TRIGGER trg_audit_business_status
    AFTER UPDATE ON businesses
    FOR EACH ROW EXECUTE FUNCTION audit_business_status_change();

-- =============================================================================
-- TRIGGER: audit credit account status changes
-- =============================================================================

CREATE OR REPLACE FUNCTION audit_credit_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
        INSERT INTO admin_audit (actor_user_id, action, entity_type, entity_id, payload)
        VALUES (
            NULL,
            CASE
                WHEN NEW.status = 'suspended' THEN 'suspend_credit'
                WHEN NEW.status = 'active'    THEN 'activate_credit'
                WHEN NEW.status = 'inactive'  THEN 'deactivate_credit'
                ELSE 'update_credit_status'
            END,
            'credit_account',
            NEW.business_id,
            jsonb_build_object(
                'old_status',        OLD.status,
                'new_status',        NEW.status,
                'suspended_reason',  NEW.suspended_reason,
                'credit_limit',      NEW.credit_limit,
                'risk_tier',         NEW.risk_tier
            )
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_audit_credit_status ON credit_accounts;
CREATE TRIGGER trg_audit_credit_status
    AFTER UPDATE ON credit_accounts
    FOR EACH ROW EXECUTE FUNCTION audit_credit_status_change();

-- =============================================================================
-- Update getCreditStatus helper to include inactive
-- =============================================================================

-- Re-create has_sufficient_credit to include inactive status check
CREATE OR REPLACE FUNCTION has_sufficient_credit(p_business_id UUID, p_amount NUMERIC)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER AS $$
    SELECT get_available_credit(p_business_id) >= p_amount
       AND EXISTS (
           SELECT 1 FROM credit_accounts
           WHERE business_id = p_business_id AND status = 'active'
       );
$$;

-- =============================================================================
-- Seed: update Al Noor to have risk_tier and ensure correct starting state
-- =============================================================================

UPDATE credit_accounts
SET risk_tier        = 'starter',
    last_reviewed_at = NULL
WHERE business_id = 'biz00000-0000-0000-0000-000000000001'
  AND risk_tier IS NULL;
