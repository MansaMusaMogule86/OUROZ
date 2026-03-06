-- =============================================================================
-- OUROZ – Migration 030: Phase B – Subscription Restocking
-- Builds on 010 (products/variants) and 020 (businesses, credit)
-- =============================================================================

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
        CREATE TYPE subscription_status AS ENUM ('active', 'paused', 'cancelled');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'cadence') THEN
        CREATE TYPE cadence AS ENUM ('weekly', 'biweekly', 'monthly');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'run_status') THEN
        CREATE TYPE run_status AS ENUM ('scheduled', 'running', 'created_order', 'partial', 'failed', 'skipped');
    END IF;
END $$;

DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partial_policy') THEN
        CREATE TYPE partial_policy AS ENUM ('partial', 'fail', 'skip');
    END IF;
END $$;

-- =============================================================================
-- TABLE: subscriptions
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscriptions (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_id     UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    name            TEXT NOT NULL,
    status          subscription_status NOT NULL DEFAULT 'active',
    cadence         cadence NOT NULL DEFAULT 'monthly',
    next_run_at     TIMESTAMP WITH TIME ZONE NOT NULL,
    -- Payment method used when creating orders from this subscription
    payment_method  TEXT NOT NULL DEFAULT 'invoice'
                    CHECK (payment_method IN ('card', 'bank_transfer', 'invoice')),
    -- What to do if a line item has insufficient stock
    on_partial      partial_policy NOT NULL DEFAULT 'partial',
    -- Shipping address snapshot (optional override from business address)
    shipping_name    TEXT,
    shipping_phone   TEXT,
    shipping_address TEXT,
    shipping_emirate TEXT,
    notes           TEXT,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_business  ON subscriptions(business_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status    ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_run  ON subscriptions(next_run_at)
    WHERE status = 'active';

-- =============================================================================
-- TABLE: subscription_items
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscription_items (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id  UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    variant_id       UUID NOT NULL REFERENCES product_variants(id) ON DELETE RESTRICT,
    qty              INTEGER NOT NULL CHECK (qty >= 1),
    -- Optional locked price. NULL = use tier pricing at time of run.
    agreed_price     NUMERIC(10,2),
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    UNIQUE (subscription_id, variant_id)
);

CREATE INDEX IF NOT EXISTS idx_sub_items_subscription ON subscription_items(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_items_variant      ON subscription_items(variant_id);

-- =============================================================================
-- TABLE: subscription_runs
-- Each row records one execution attempt of a subscription.
-- =============================================================================

CREATE TABLE IF NOT EXISTS subscription_runs (
    id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subscription_id  UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    scheduled_for    TIMESTAMP WITH TIME ZONE NOT NULL,
    run_at           TIMESTAMP WITH TIME ZONE,
    status           run_status NOT NULL DEFAULT 'scheduled',
    order_id         UUID REFERENCES orders(id) ON DELETE SET NULL,
    -- JSON snapshot of line items at run time (for audit)
    items_snapshot   JSONB,
    notes            TEXT,
    created_at       TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sub_runs_subscription ON subscription_runs(subscription_id);
CREATE INDEX IF NOT EXISTS idx_sub_runs_scheduled    ON subscription_runs(scheduled_for)
    WHERE status = 'scheduled';
CREATE INDEX IF NOT EXISTS idx_sub_runs_order        ON subscription_runs(order_id);

-- =============================================================================
-- FUNCTIONS
-- =============================================================================

-- Advance next_run_at after a successful run
CREATE OR REPLACE FUNCTION advance_subscription_schedule(p_subscription_id UUID)
RETURNS VOID LANGUAGE plpgsql AS $$
DECLARE
    v_cadence cadence;
    v_next    TIMESTAMP WITH TIME ZONE;
BEGIN
    SELECT cadence, next_run_at INTO v_cadence, v_next
    FROM subscriptions WHERE id = p_subscription_id;

    v_next := CASE v_cadence
        WHEN 'weekly'    THEN v_next + INTERVAL '7 days'
        WHEN 'biweekly'  THEN v_next + INTERVAL '14 days'
        WHEN 'monthly'   THEN v_next + INTERVAL '1 month'
    END;

    UPDATE subscriptions
    SET next_run_at = v_next, updated_at = NOW()
    WHERE id = p_subscription_id;
END;
$$;

-- updated_at triggers
CREATE TRIGGER trg_subscriptions_upd
    BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trg_sub_items_upd
    BEFORE UPDATE ON subscription_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================================================
-- RLS
-- =============================================================================

ALTER TABLE subscriptions      ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_runs  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subs: member read"
    ON subscriptions FOR SELECT
    USING (auth.is_business_member(business_id) OR auth.is_admin());

CREATE POLICY "subs: manager write"
    ON subscriptions FOR INSERT
    WITH CHECK (auth.is_business_manager(business_id));

CREATE POLICY "subs: manager update"
    ON subscriptions FOR UPDATE
    USING  (auth.is_business_manager(business_id) OR auth.is_admin())
    WITH CHECK (auth.is_business_manager(business_id) OR auth.is_admin());

CREATE POLICY "subs: admin all"
    ON subscriptions FOR ALL
    USING (auth.is_admin());

CREATE POLICY "sub_items: member read"
    ON subscription_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_id
              AND (auth.is_business_member(s.business_id) OR auth.is_admin())
        )
    );

CREATE POLICY "sub_items: manager write"
    ON subscription_items FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_id
              AND (auth.is_business_manager(s.business_id) OR auth.is_admin())
        )
    );

CREATE POLICY "sub_runs: member read"
    ON subscription_runs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM subscriptions s
            WHERE s.id = subscription_id
              AND (auth.is_business_member(s.business_id) OR auth.is_admin())
        )
    );

CREATE POLICY "sub_runs: system insert"
    ON subscription_runs FOR INSERT
    WITH CHECK (auth.is_admin());
