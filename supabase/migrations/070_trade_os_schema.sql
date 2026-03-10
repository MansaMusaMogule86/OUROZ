-- ============================================================
-- Morocco Trade OS — Database Schema
-- All tables for the B2B sourcing intelligence platform
-- ============================================================

-- Trade Suppliers (extends beyond storefront suppliers with trade-specific fields)
create table if not exists trade_suppliers (
    id text primary key,
    company_name text not null,
    slug text unique not null,
    company_type text not null check (company_type in ('manufacturer','wholesaler','trading_company','cooperative','artisan')),
    region text not null,
    city text not null,
    year_established int,
    employee_count text,
    main_categories text[] not null default '{}',
    certifications jsonb not null default '[]',
    export_countries text[] not null default '{}',
    has_export_license boolean not null default false,
    free_zone_certified boolean not null default false,
    verification_level text not null default 'basic' check (verification_level in ('basic','verified','gold','trusted')),
    response_rate numeric(5,2) default 0,
    response_time_hours int default 24,
    on_time_delivery_rate numeric(5,2) default 0,
    rating_avg numeric(3,2) default 0,
    rating_count int default 0,
    total_transactions int default 0,
    repeat_buyer_rate numeric(5,2) default 0,
    monthly_capacity text,
    moq_min int default 1,
    moq_currency text default 'USD',
    lead_time_days_min int default 7,
    lead_time_days_max int default 30,
    sample_available boolean not null default false,
    ai_match_score numeric(5,2),
    ai_match_reasons text[],
    compliance_score numeric(5,2) default 0,
    languages text[] not null default '{}',
    contact_name text,
    contact_title text,
    description text,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_trade_suppliers_categories on trade_suppliers using gin(main_categories);
create index idx_trade_suppliers_verification on trade_suppliers(verification_level);

-- Trade RFQs
create table if not exists trade_rfqs (
    id text primary key,
    rfq_number text unique not null,
    title text not null,
    status text not null default 'draft' check (status in ('draft','ai_review','open','quoted','comparing','awarded','expired','cancelled')),
    product_name text not null,
    category text not null,
    detailed_requirements text,
    specifications jsonb not null default '[]',
    quantity int not null default 0,
    quantity_unit text not null default 'pieces',
    target_price_per_unit numeric(12,2),
    target_currency text not null default 'USD',
    destination_port text,
    incoterm text,
    required_by_date date,
    target_categories text[] not null default '{}',
    invited_supplier_ids text[],
    ai_score numeric(5,2),
    ai_suggestions text[],
    view_count int not null default 0,
    quote_count int not null default 0,
    selected_quote_id text,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now(),
    expires_at timestamptz not null default (now() + interval '14 days')
);

create index idx_trade_rfqs_status on trade_rfqs(status);
create index idx_trade_rfqs_owner on trade_rfqs(owner_user_id);

-- Trade Quotes (on RFQs)
create table if not exists trade_quotes (
    id text primary key,
    rfq_id text not null references trade_rfqs(id) on delete cascade,
    supplier_id text not null references trade_suppliers(id),
    supplier_name text not null,
    supplier_city text,
    supplier_verification text,
    quote_number text unique not null,
    status text not null default 'pending' check (status in ('pending','submitted','shortlisted','accepted','rejected','expired')),
    unit_price numeric(12,2) not null,
    currency text not null default 'USD',
    total_price numeric(14,2) not null,
    price_valid_until date,
    moq int,
    lead_time_days int,
    incoterm text,
    shipping_cost numeric(10,2),
    payment_terms text,
    sample_available boolean not null default false,
    sample_price numeric(10,2),
    ai_comparison_score numeric(5,2),
    ai_notes text,
    supplier_notes text,
    is_negotiable boolean not null default false,
    submitted_at timestamptz not null default now()
);

create index idx_trade_quotes_rfq on trade_quotes(rfq_id);

-- Price Intelligence
create table if not exists trade_prices (
    id text primary key,
    product_name text not null,
    category text not null,
    current_price numeric(12,2) not null,
    previous_price numeric(12,2) not null,
    currency text not null default 'USD',
    unit text not null,
    trend text not null check (trend in ('rising','stable','falling')),
    change_percent numeric(6,2) not null default 0,
    benchmarks jsonb not null default '{}',
    history jsonb not null default '[]',
    ai_summary text,
    updated_at timestamptz not null default now()
);

create table if not exists trade_price_alerts (
    id text primary key,
    product_name text not null,
    condition text not null check (condition in ('below','above')),
    threshold numeric(12,2) not null,
    currency text not null default 'USD',
    is_active boolean not null default true,
    triggered_at timestamptz,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
);

-- Shipments / Logistics
create table if not exists trade_shipments (
    id text primary key,
    shipment_number text unique not null,
    status text not null default 'booked' check (status in ('booked','picked_up','in_transit','customs','out_for_delivery','delivered','exception')),
    risk_level text not null default 'low' check (risk_level in ('low','medium','high','critical')),
    supplier_name text not null,
    supplier_id text references trade_suppliers(id),
    buyer_company text not null default 'OUROZ Dubai',
    origin jsonb not null default '{}',
    destination jsonb not null default '{}',
    shipping_method text not null check (shipping_method in ('sea','air','road')),
    carrier_name text,
    tracking_number text,
    container_number text,
    booked_at timestamptz not null default now(),
    estimated_departure timestamptz,
    actual_departure timestamptz,
    estimated_arrival timestamptz,
    actual_arrival timestamptz,
    description text,
    weight_kg numeric(10,2) default 0,
    volume_cbm numeric(8,2) default 0,
    value numeric(14,2) default 0,
    currency text not null default 'USD',
    incoterm text,
    milestones jsonb not null default '[]',
    documents jsonb not null default '[]',
    risk_alerts jsonb not null default '[]',
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
);

create index idx_trade_shipments_status on trade_shipments(status);

-- Compliance Records
create table if not exists trade_compliance (
    id text primary key,
    supplier_id text not null references trade_suppliers(id),
    supplier_name text not null,
    overall_score numeric(5,2) not null default 0,
    level text not null default 'basic' check (level in ('basic','standard','premium','sovereign')),
    last_audit_date date,
    next_audit_due date,
    categories jsonb not null default '{}',
    documents jsonb not null default '[]',
    audit_trail jsonb not null default '[]',
    updated_at timestamptz not null default now()
);

create index idx_trade_compliance_supplier on trade_compliance(supplier_id);

-- Deal Negotiation
create table if not exists trade_deals (
    id text primary key,
    deal_number text unique not null,
    title text not null,
    status text not null default 'exploring' check (status in ('exploring','negotiating','terms_agreed','contract_sent','signed','closed_won','closed_lost')),
    supplier_id text references trade_suppliers(id),
    supplier_name text not null,
    supplier_city text,
    buyer_company text not null default 'OUROZ Dubai',
    product_name text not null,
    category text,
    quantity int not null default 0,
    quantity_unit text not null default 'pieces',
    current_terms jsonb not null default '{}',
    term_history jsonb not null default '[]',
    messages jsonb not null default '[]',
    ai_strategy_notes text[],
    ai_recommended_price numeric(12,2),
    ai_confidence numeric(5,2),
    milestones jsonb not null default '[]',
    rfq_id text references trade_rfqs(id),
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create index idx_trade_deals_status on trade_deals(status);

-- Dashboard elements
create table if not exists trade_ai_insights (
    id text primary key,
    title text not null,
    content text not null,
    type text not null check (type in ('opportunity','risk','recommendation','market')),
    priority text not null default 'medium' check (priority in ('high','medium','low')),
    action_label text,
    action_href text,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
);

create table if not exists trade_activity (
    id text primary key,
    type text not null check (type in ('rfq','quote','shipment','deal','compliance','price')),
    title text not null,
    description text not null,
    href text,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
);

create table if not exists trade_alerts (
    id text primary key,
    level text not null default 'low' check (level in ('low','medium','high','critical')),
    title text not null,
    description text not null,
    module text not null check (module in ('rfq','logistics','compliance','deals','prices')),
    is_read boolean not null default false,
    href text,
    owner_user_id uuid references auth.users(id),
    created_at timestamptz not null default now()
);

-- Enable RLS on all trade tables
alter table trade_suppliers enable row level security;
alter table trade_rfqs enable row level security;
alter table trade_quotes enable row level security;
alter table trade_prices enable row level security;
alter table trade_price_alerts enable row level security;
alter table trade_shipments enable row level security;
alter table trade_compliance enable row level security;
alter table trade_deals enable row level security;
alter table trade_ai_insights enable row level security;
alter table trade_activity enable row level security;
alter table trade_alerts enable row level security;

-- RLS Policies: authenticated users can read all trade data
-- Write operations restricted to owners and admins
create policy "Authenticated users can read trade suppliers" on trade_suppliers for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade rfqs" on trade_rfqs for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade quotes" on trade_quotes for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade prices" on trade_prices for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade price alerts" on trade_price_alerts for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade shipments" on trade_shipments for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade compliance" on trade_compliance for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade deals" on trade_deals for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade ai insights" on trade_ai_insights for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade activity" on trade_activity for select using (auth.role() = 'authenticated');
create policy "Authenticated users can read trade alerts" on trade_alerts for select using (auth.role() = 'authenticated');

-- Insert/update policies for owners
create policy "Users can create rfqs" on trade_rfqs for insert with check (auth.uid() = owner_user_id);
create policy "Users can update own rfqs" on trade_rfqs for update using (auth.uid() = owner_user_id);
create policy "Users can create deals" on trade_deals for insert with check (auth.uid() = owner_user_id);
create policy "Users can update own deals" on trade_deals for update using (auth.uid() = owner_user_id);
create policy "Users can create shipments" on trade_shipments for insert with check (auth.uid() = owner_user_id);
create policy "Users can create price alerts" on trade_price_alerts for insert with check (auth.uid() = owner_user_id);
create policy "Users can update own price alerts" on trade_price_alerts for update using (auth.uid() = owner_user_id);
create policy "Users can mark own alerts read" on trade_alerts for update using (auth.uid() = owner_user_id);
