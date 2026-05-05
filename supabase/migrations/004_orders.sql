-- =============================================================================
-- 004_orders.sql
-- Orders and order items tables.
-- Required by: app/checkout/page.tsx, paymentService.ts, stripe webhook.
-- =============================================================================

CREATE TABLE IF NOT EXISTS orders (
    id                        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id                   UUID NOT NULL REFERENCES auth.users(id) ON DELETE RESTRICT,
    business_id               UUID REFERENCES businesses(id) ON DELETE SET NULL,
    order_number              TEXT NOT NULL,
    status                    TEXT NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'confirmed', 'processing',
                                                    'shipped', 'delivered', 'cancelled', 'failed')),
    payment_method            TEXT NOT NULL DEFAULT 'card'
                                  CHECK (payment_method IN ('card', 'cash', 'bank_transfer',
                                                             'cheque', 'invoice')),
    payment_mode              TEXT NOT NULL DEFAULT 'pay_now'
                                  CHECK (payment_mode IN ('pay_now', 'invoice')),
    stripe_payment_intent_id  TEXT,
    is_wholesale              BOOLEAN NOT NULL DEFAULT FALSE,
    order_type                TEXT NOT NULL DEFAULT 'retail'
                                  CHECK (order_type IN ('retail', 'wholesale')),
    shipping_name             TEXT NOT NULL,
    shipping_phone            TEXT NOT NULL,
    shipping_address          TEXT NOT NULL,
    shipping_emirate          TEXT NOT NULL,
    subtotal                  NUMERIC(12,2) NOT NULL DEFAULT 0,
    shipping_cost             NUMERIC(12,2) NOT NULL DEFAULT 0,
    vat_amount                NUMERIC(12,2) NOT NULL DEFAULT 0,
    total                     NUMERIC(12,2) NOT NULL DEFAULT 0,
    currency                  TEXT NOT NULL DEFAULT 'AED',
    notes                     TEXT,
    created_at                TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at                TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_number       ON orders(order_number);
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_stripe_pi    ON orders(stripe_payment_intent_id)
    WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_orders_user                ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_business            ON orders(business_id);
CREATE INDEX IF NOT EXISTS idx_orders_status              ON orders(status);

CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Order Items
-- =============================================================================

CREATE TABLE IF NOT EXISTS order_items (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    variant_id          UUID,
    product_name        TEXT NOT NULL,
    variant_sku         TEXT,
    variant_label       TEXT,
    product_image_url   TEXT,
    price_at_purchase   NUMERIC(12,2) NOT NULL,
    quantity            INTEGER NOT NULL CHECK (quantity > 0),
    line_total          NUMERIC(12,2) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_items_order   ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_variant ON order_items(variant_id);

-- =============================================================================
-- Back-fill deferred FKs from migration 003
-- =============================================================================

ALTER TABLE invoices
    ADD CONSTRAINT fk_invoices_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    NOT VALID;

ALTER TABLE credit_ledger_entries
    ADD CONSTRAINT fk_ledger_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    NOT VALID;

ALTER TABLE payments
    ADD CONSTRAINT fk_payments_order
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE SET NULL
    NOT VALID;

-- =============================================================================
-- generate_order_number RPC
-- Used by app/checkout/page.tsx: supabase.rpc('generate_order_number')
-- =============================================================================

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    v_number TEXT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        -- Format: ORZ-YYYYMM-XXXXXX (6 random alphanumeric chars)
        v_number := 'ORZ-' ||
                    TO_CHAR(NOW(), 'YYYYMM') || '-' ||
                    UPPER(SUBSTRING(MD5(RANDOM()::TEXT), 1, 6));

        SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = v_number)
        INTO v_exists;

        EXIT WHEN NOT v_exists;
    END LOOP;

    RETURN v_number;
END;
$$;

-- =============================================================================
-- Row Level Security
-- =============================================================================

ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Users can see their own orders; admins see all
CREATE POLICY "orders_select_own"
    ON orders FOR SELECT
    USING (
        user_id = auth.uid()
        OR (
            business_id IS NOT NULL AND
            EXISTS (
                SELECT 1 FROM business_members bm
                WHERE bm.business_id = orders.business_id
                  AND bm.user_id = auth.uid()
            )
        )
        OR EXISTS (
            SELECT 1 FROM user_profiles up
            WHERE up.user_id = auth.uid() AND up.role = 'admin'
        )
    );

-- Users can insert their own orders (service role used for updates after payment)
CREATE POLICY "orders_insert_own"
    ON orders FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- Order items: readable if the parent order is readable
CREATE POLICY "order_items_select"
    ON order_items FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id
              AND (
                  o.user_id = auth.uid()
                  OR EXISTS (
                      SELECT 1 FROM user_profiles up
                      WHERE up.user_id = auth.uid() AND up.role = 'admin'
                  )
              )
        )
    );

CREATE POLICY "order_items_insert_own"
    ON order_items FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM orders o
            WHERE o.id = order_items.order_id
              AND o.user_id = auth.uid()
        )
    );
