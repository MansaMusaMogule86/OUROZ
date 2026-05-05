-- =============================================================================
-- 006_trade_os_schema.sql
-- Trade OS tables: suppliers, RFQs, quotes, prices, alerts, shipments,
--                  compliance, deals.
-- Required by: src/lib/trade/trade-service.ts (all fetch functions)
-- Column names derived directly from the mapper functions in trade-service.ts.
-- =============================================================================

-- =============================================================================
-- Trade Suppliers
-- (Separate from operational suppliers table — these are prospective sourcing
--  partners managed inside the Trade OS.)
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_suppliers (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    company_name            TEXT NOT NULL,
    slug                    TEXT NOT NULL,
    company_type            TEXT NOT NULL DEFAULT 'manufacturer'
                                CHECK (company_type IN ('manufacturer', 'wholesaler',
                                                        'trading_company', 'cooperative', 'artisan')),
    region                  TEXT NOT NULL,
    city                    TEXT NOT NULL,
    year_established        INTEGER,
    employee_count          TEXT,
    main_categories         TEXT[] NOT NULL DEFAULT '{}',
    certifications          JSONB NOT NULL DEFAULT '[]',
    export_countries        TEXT[] NOT NULL DEFAULT '{}',
    has_export_license      BOOLEAN NOT NULL DEFAULT FALSE,
    free_zone_certified     BOOLEAN NOT NULL DEFAULT FALSE,
    verification_level      TEXT NOT NULL DEFAULT 'BASIC'
                                CHECK (verification_level IN ('BASIC', 'VERIFIED', 'GOLD', 'TRUSTED')),
    response_rate           NUMERIC(5,2) NOT NULL DEFAULT 0,
    response_time_hours     INTEGER NOT NULL DEFAULT 48,
    on_time_delivery_rate   NUMERIC(5,2) NOT NULL DEFAULT 0,
    rating_avg              NUMERIC(3,2) NOT NULL DEFAULT 0,
    rating_count            INTEGER NOT NULL DEFAULT 0,
    total_transactions      INTEGER NOT NULL DEFAULT 0,
    repeat_buyer_rate       NUMERIC(5,2) NOT NULL DEFAULT 0,
    monthly_capacity        TEXT,
    moq_min                 INTEGER NOT NULL DEFAULT 1,
    moq_currency            TEXT NOT NULL DEFAULT 'USD',
    lead_time_days_min      INTEGER NOT NULL DEFAULT 0,
    lead_time_days_max      INTEGER NOT NULL DEFAULT 30,
    sample_available        BOOLEAN NOT NULL DEFAULT FALSE,
    ai_match_score          NUMERIC(5,2),
    ai_match_reasons        TEXT[],
    compliance_score        NUMERIC(5,2) NOT NULL DEFAULT 0,
    languages               TEXT[] NOT NULL DEFAULT '{"Arabic"}',
    contact_name            TEXT NOT NULL,
    contact_title           TEXT NOT NULL DEFAULT 'Sales Manager',
    description             TEXT NOT NULL DEFAULT '',
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_suppliers_slug ON trade_suppliers(slug);

CREATE TRIGGER trg_trade_suppliers_updated_at
    BEFORE UPDATE ON trade_suppliers
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade RFQs (Requests for Quotation)
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_rfqs (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_number              TEXT NOT NULL,
    title                   TEXT NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'open'
                                CHECK (status IN ('open', 'closed', 'awarded',
                                                  'cancelled', 'expired')),
    product_name            TEXT NOT NULL,
    category                TEXT NOT NULL,
    detailed_requirements   TEXT NOT NULL DEFAULT '',
    specifications          JSONB NOT NULL DEFAULT '[]',
    quantity                INTEGER NOT NULL CHECK (quantity > 0),
    quantity_unit           TEXT NOT NULL DEFAULT 'units',
    target_price_per_unit   NUMERIC(12,2),
    target_currency         TEXT NOT NULL DEFAULT 'USD',
    destination_port        TEXT NOT NULL DEFAULT '',
    incoterm                TEXT NOT NULL DEFAULT 'FOB',
    required_by_date        DATE,
    target_categories       TEXT[] NOT NULL DEFAULT '{}',
    invited_supplier_ids    UUID[],
    ai_score                NUMERIC(5,2),
    ai_suggestions          TEXT[],
    view_count              INTEGER NOT NULL DEFAULT 0,
    quote_count             INTEGER NOT NULL DEFAULT 0,
    selected_quote_id       UUID,
    expires_at              TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days'),
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_rfqs_number ON trade_rfqs(rfq_number);
CREATE INDEX IF NOT EXISTS idx_trade_rfqs_status ON trade_rfqs(status);

CREATE TRIGGER trg_trade_rfqs_updated_at
    BEFORE UPDATE ON trade_rfqs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Quotes
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_quotes (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    rfq_id                  UUID NOT NULL REFERENCES trade_rfqs(id) ON DELETE CASCADE,
    supplier_id             UUID NOT NULL REFERENCES trade_suppliers(id) ON DELETE CASCADE,
    supplier_name           TEXT NOT NULL,
    supplier_city           TEXT NOT NULL DEFAULT '',
    supplier_verification   TEXT NOT NULL DEFAULT 'basic',
    quote_number            TEXT NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'submitted'
                                CHECK (status IN ('submitted', 'under_review', 'accepted',
                                                  'rejected', 'expired', 'negotiating')),
    submitted_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    unit_price              NUMERIC(12,2) NOT NULL,
    currency                TEXT NOT NULL DEFAULT 'USD',
    total_price             NUMERIC(14,2) NOT NULL,
    price_valid_until       DATE NOT NULL,
    moq                     INTEGER NOT NULL DEFAULT 1,
    lead_time_days          INTEGER NOT NULL,
    incoterm                TEXT NOT NULL DEFAULT 'FOB',
    shipping_cost           NUMERIC(12,2),
    payment_terms           TEXT NOT NULL DEFAULT 'T/T 30%',
    sample_available        BOOLEAN NOT NULL DEFAULT FALSE,
    sample_price            NUMERIC(12,2),
    ai_comparison_score     NUMERIC(5,2),
    ai_notes                TEXT,
    supplier_notes          TEXT,
    is_negotiable           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_trade_quotes_rfq      ON trade_quotes(rfq_id);
CREATE INDEX IF NOT EXISTS idx_trade_quotes_supplier ON trade_quotes(supplier_id);
CREATE INDEX IF NOT EXISTS idx_trade_quotes_status   ON trade_quotes(status);

CREATE TRIGGER trg_trade_quotes_updated_at
    BEFORE UPDATE ON trade_quotes
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Prices (Market price data)
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_prices (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name    TEXT NOT NULL,
    category        TEXT NOT NULL,
    current_price   NUMERIC(12,2) NOT NULL,
    previous_price  NUMERIC(12,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USD',
    unit            TEXT NOT NULL DEFAULT 'kg',
    trend           TEXT NOT NULL DEFAULT 'stable'
                        CHECK (trend IN ('up', 'down', 'stable')),
    change_percent  NUMERIC(6,2) NOT NULL DEFAULT 0,
    benchmarks      JSONB NOT NULL DEFAULT '{}',
    history         JSONB NOT NULL DEFAULT '[]',
    ai_summary      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_prices_product ON trade_prices(product_name);

CREATE TRIGGER trg_trade_prices_updated_at
    BEFORE UPDATE ON trade_prices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Price Alerts
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_price_alerts (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_name    TEXT NOT NULL,
    condition       TEXT NOT NULL
                        CHECK (condition IN ('above', 'below', 'change_pct')),
    threshold       NUMERIC(12,2) NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'USD',
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    triggered_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_price_alerts_active ON trade_price_alerts(is_active);

CREATE TRIGGER trg_price_alerts_updated_at
    BEFORE UPDATE ON trade_price_alerts
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Shipments
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_shipments (
    id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    shipment_number     TEXT NOT NULL,
    status              TEXT NOT NULL DEFAULT 'booked'
                            CHECK (status IN ('booked', 'in_transit', 'customs',
                                              'delivered', 'delayed', 'cancelled')),
    risk_level          TEXT NOT NULL DEFAULT 'low'
                            CHECK (risk_level IN ('low', 'medium', 'high')),
    supplier_name       TEXT NOT NULL,
    supplier_id         UUID REFERENCES trade_suppliers(id) ON DELETE SET NULL,
    buyer_company       TEXT NOT NULL,
    origin              JSONB NOT NULL DEFAULT '{}',       -- {country, port, city}
    destination         JSONB NOT NULL DEFAULT '{}',       -- {country, port, city}
    shipping_method     TEXT NOT NULL DEFAULT 'sea'
                            CHECK (shipping_method IN ('air', 'sea', 'road', 'rail', 'multimodal')),
    carrier_name        TEXT NOT NULL,
    tracking_number     TEXT,
    container_number    TEXT,
    booked_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estimated_departure TIMESTAMPTZ NOT NULL,
    actual_departure    TIMESTAMPTZ,
    estimated_arrival   TIMESTAMPTZ NOT NULL,
    actual_arrival      TIMESTAMPTZ,
    description         TEXT NOT NULL DEFAULT '',
    weight_kg           NUMERIC(10,2) NOT NULL DEFAULT 0,
    volume_cbm          NUMERIC(10,3) NOT NULL DEFAULT 0,
    value               NUMERIC(14,2) NOT NULL DEFAULT 0,
    currency            TEXT NOT NULL DEFAULT 'USD',
    incoterm            TEXT NOT NULL DEFAULT 'FOB',
    milestones          JSONB NOT NULL DEFAULT '[]',
    documents           JSONB NOT NULL DEFAULT '[]',
    risk_alerts         JSONB NOT NULL DEFAULT '[]',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_shipments_number ON trade_shipments(shipment_number);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_status  ON trade_shipments(status);
CREATE INDEX IF NOT EXISTS idx_trade_shipments_supplier ON trade_shipments(supplier_id);

CREATE TRIGGER trg_trade_shipments_updated_at
    BEFORE UPDATE ON trade_shipments
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Compliance
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_compliance (
    id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    supplier_id     UUID NOT NULL REFERENCES trade_suppliers(id) ON DELETE CASCADE,
    supplier_name   TEXT NOT NULL,
    overall_score   NUMERIC(5,2) NOT NULL DEFAULT 0,
    level           TEXT NOT NULL DEFAULT 'basic'
                        CHECK (level IN ('basic', 'certified', 'premium', 'excellence')),
    last_audit_date DATE,
    next_audit_due  DATE,
    categories      JSONB NOT NULL DEFAULT '[]',
    documents       JSONB NOT NULL DEFAULT '[]',
    audit_trail     JSONB NOT NULL DEFAULT '[]',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_compliance_supplier ON trade_compliance(supplier_id);

CREATE TRIGGER trg_trade_compliance_updated_at
    BEFORE UPDATE ON trade_compliance
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Trade Deals
-- =============================================================================

CREATE TABLE IF NOT EXISTS trade_deals (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    deal_number             TEXT NOT NULL,
    title                   TEXT NOT NULL,
    status                  TEXT NOT NULL DEFAULT 'negotiating'
                                CHECK (status IN ('negotiating', 'pending_approval',
                                                  'approved', 'contracted', 'completed',
                                                  'cancelled', 'on_hold')),
    supplier_id             UUID REFERENCES trade_suppliers(id) ON DELETE SET NULL,
    supplier_name           TEXT NOT NULL,
    supplier_city           TEXT NOT NULL,
    buyer_company           TEXT NOT NULL,
    product_name            TEXT NOT NULL,
    category                TEXT NOT NULL,
    quantity                INTEGER NOT NULL,
    quantity_unit           TEXT NOT NULL DEFAULT 'units',
    current_terms           JSONB NOT NULL DEFAULT '{}',
    term_history            JSONB NOT NULL DEFAULT '[]',
    messages                JSONB NOT NULL DEFAULT '[]',
    ai_strategy_notes       TEXT,
    ai_recommended_price    NUMERIC(12,2),
    ai_confidence           NUMERIC(5,2),
    milestones              JSONB NOT NULL DEFAULT '[]',
    rfq_id                  UUID REFERENCES trade_rfqs(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_trade_deals_number ON trade_deals(deal_number);
CREATE INDEX IF NOT EXISTS idx_trade_deals_status      ON trade_deals(status);
CREATE INDEX IF NOT EXISTS idx_trade_deals_supplier    ON trade_deals(supplier_id);

CREATE TRIGGER trg_trade_deals_updated_at
    BEFORE UPDATE ON trade_deals
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- =============================================================================
-- Row Level Security (Trade OS — authenticated users only)
-- =============================================================================

ALTER TABLE trade_suppliers      ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_rfqs           ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_quotes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_prices         ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_price_alerts   ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_shipments      ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_compliance     ENABLE ROW LEVEL SECURITY;
ALTER TABLE trade_deals          ENABLE ROW LEVEL SECURITY;

-- All trade tables: authenticated users can read; admins can write
CREATE POLICY "trade_suppliers_select_auth"
    ON trade_suppliers FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_rfqs_select_auth"
    ON trade_rfqs FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_quotes_select_auth"
    ON trade_quotes FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_prices_select_auth"
    ON trade_prices FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_price_alerts_select_auth"
    ON trade_price_alerts FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_shipments_select_auth"
    ON trade_shipments FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_compliance_select_auth"
    ON trade_compliance FOR SELECT
    USING (auth.uid() IS NOT NULL);

CREATE POLICY "trade_deals_select_auth"
    ON trade_deals FOR SELECT
    USING (auth.uid() IS NOT NULL);
