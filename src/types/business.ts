/**
 * OUROZ – Phase A / B / C database types
 * Mirrors 020_phase_a_schema.sql, 030_phase_b_schema.sql, 040_phase_c_schema.sql
 */

// =============================================================================
// ENUMS
// =============================================================================

export type BusinessStatus    = 'pending' | 'approved' | 'rejected';
export type CreditStatus      = 'active' | 'suspended' | 'inactive';
export type InvoiceStatus     = 'issued' | 'partial' | 'paid' | 'overdue' | 'void';
export type PaymentMethod     = 'card' | 'cash' | 'bank_transfer' | 'cheque' | 'invoice';
export type LedgerEntryType   = 'charge' | 'payment' | 'adjustment' | 'credit_note';
export type MemberRole        = 'owner' | 'manager' | 'buyer';
export type RiskTier          = 'starter' | 'trusted' | 'pro';
export type OrderType         = 'retail' | 'wholesale';
export type PaymentMode       = 'pay_now' | 'invoice';
export type SuggestionStatus  = 'pending' | 'approved' | 'rejected' | 'expired';

export type SubscriptionStatus = 'active' | 'paused' | 'cancelled';
export type Cadence            = 'weekly' | 'biweekly' | 'monthly';
export type RunStatus          = 'scheduled' | 'running' | 'created_order' | 'partial' | 'failed' | 'skipped';
export type PartialPolicy      = 'partial' | 'fail' | 'skip';

export type SupplierStatus        = 'pending' | 'approved' | 'rejected' | 'suspended';
export type SupplierProductStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'suspended';

// =============================================================================
// PHASE A – Business / Credit / Invoice
// =============================================================================

export interface Business {
    id:                 string;
    owner_user_id:      string;
    name:               string;
    legal_name:         string | null;
    trade_license_url:  string | null;
    business_type:      string | null;
    contact_email:      string;
    contact_phone:      string | null;
    address:            string | null;
    status:             BusinessStatus;
    rejection_reason:   string | null;
    approved_at:        string | null;
    approved_by:        string | null;
    created_at:         string;
    updated_at:         string;
}

export interface BusinessMember {
    id:          string;
    business_id: string;
    user_id:     string;
    role:        MemberRole;
    created_at:  string;
}

export interface CreditAccount {
    id:               string;
    business_id:      string;
    credit_limit:     number;
    terms_days:       number;
    status:           CreditStatus;
    risk_tier:        RiskTier;
    suspended_at:     string | null;
    suspended_reason: string | null;
    last_reviewed_at: string | null;
    created_at:       string;
    updated_at:       string;
}

export interface CreditLedgerEntry {
    id:            string;
    business_id:   string;
    order_id:      string | null;
    invoice_id:    string | null;
    type:          LedgerEntryType;
    amount:        number;   // positive = debit, negative = credit
    balance_after: number;
    note:          string | null;
    created_at:    string;
    created_by:    string | null;
}

export interface Invoice {
    id:             string;
    business_id:    string;
    order_id:       string | null;
    invoice_number: string;
    subtotal:       number;
    tax_amount:     number;
    total:          number;
    amount_paid:    number;
    currency:       string;
    due_date:       string;   // ISO date
    status:         InvoiceStatus;
    paid_at:        string | null;
    notes:          string | null;
    created_at:     string;
    updated_at:     string;
}

export interface Payment {
    id:          string;
    business_id: string;
    invoice_id:  string | null;
    order_id:    string | null;
    amount:      number;
    method:      PaymentMethod;
    reference:   string | null;
    notes:       string | null;
    received_at: string;
    recorded_by: string | null;
    created_at:  string;
}

export interface AdminNote {
    id:          string;
    entity_type: string;
    entity_id:   string;
    note:        string;
    created_at:  string;
    created_by:  string;
}

// Enriched types for UI
export interface BusinessWithCredit extends Business {
    credit_account:   CreditAccount | null;
    outstanding_balance: number;
    available_credit: number;
    has_overdue:      boolean;
}

export interface InvoiceWithBusiness extends Invoice {
    business: Pick<Business, 'id' | 'name' | 'contact_email'>;
}

// =============================================================================
// PHASE B – Subscriptions
// =============================================================================

export interface Subscription {
    id:               string;
    business_id:      string;
    name:             string;
    status:           SubscriptionStatus;
    cadence:          Cadence;
    next_run_at:      string;
    payment_method:   Exclude<PaymentMethod, 'cash' | 'cheque'>;
    on_partial:       PartialPolicy;
    shipping_name:    string | null;
    shipping_phone:   string | null;
    shipping_address: string | null;
    shipping_emirate: string | null;
    notes:            string | null;
    created_at:       string;
    updated_at:       string;
}

export interface SubscriptionItem {
    id:               string;
    subscription_id:  string;
    variant_id:       string;
    qty:              number;
    agreed_price:     number | null;
    created_at:       string;
    updated_at:       string;
}

export interface SubscriptionRun {
    id:               string;
    subscription_id:  string;
    scheduled_for:    string;
    run_at:           string | null;
    status:           RunStatus;
    order_id:         string | null;
    items_snapshot:   Record<string, unknown>[] | null;
    notes:            string | null;
    created_at:       string;
}

// Enriched
export interface SubscriptionWithItems extends Subscription {
    items: Array<SubscriptionItem & {
        variant: {
            id:            string;
            sku:           string;
            weight:        string | null;
            retail_price:  number;
            stock_quantity: number;
            product: { id: string; name: string; image_urls: string[] };
            price_tiers: { min_quantity: number; price: number }[];
        };
    }>;
    last_run: SubscriptionRun | null;
    next_run: SubscriptionRun | null;
}

// =============================================================================
// PHASE C – Suppliers
// =============================================================================

export interface Supplier {
    id:                string;
    owner_user_id:     string;
    name:              string;
    slug:              string;
    description:       string | null;
    contact_phone:     string | null;
    contact_email:     string;
    logo_url:          string | null;
    trade_license_url: string | null;
    status:            SupplierStatus;
    rejection_reason:  string | null;
    approved_at:       string | null;
    approved_by:       string | null;
    created_at:        string;
    updated_at:        string;
}

export interface SupplierProduct {
    id:               string;
    supplier_id:      string;
    product_id:       string;
    status:           SupplierProductStatus;
    submitted_at:     string | null;
    reviewed_at:      string | null;
    reviewed_by:      string | null;
    rejection_reason: string | null;
    created_at:       string;
    updated_at:       string;
}

export interface SupplierPayoutAccount {
    id:           string;
    supplier_id:  string;
    bank_name:    string | null;
    iban:         string | null;
    account_name: string | null;
    swift_code:   string | null;
    notes:        string | null;
    created_at:   string;
    updated_at:   string;
}

export interface Commission {
    id:           string;
    supplier_id:  string;
    rate_percent: number;
    created_at:   string;
    updated_at:   string;
}

// =============================================================================
// CHECKOUT
// =============================================================================

export interface CheckoutPayload {
    business_id:      string;
    cart_id:          string;
    payment_method:   PaymentMethod;
    shipping_name:    string;
    shipping_phone:   string;
    shipping_address: string;
    shipping_emirate: string;
    notes?:           string;
}

export interface CheckoutResult {
    ok:            boolean;
    order_id?:     string;
    invoice_id?:   string;
    order_number?: string;
    error?:        string;
}

// =============================================================================
// CREDIT CHECKOUT ELIGIBILITY
// =============================================================================

export interface CreditCheckResult {
    can_use_invoice:  boolean;
    reason:           string | null;
    available_credit: number;
    outstanding:      number;
    credit_limit:     number;
}

// =============================================================================
// RISK / ADMIN AUDIT (Migration 050)
// =============================================================================

export interface AdminAudit {
    id:            string;
    actor_user_id: string | null;
    action:        string;
    entity_type:   string;
    entity_id:     string;
    payload:       Record<string, unknown>;
    ip_address:    string | null;
    created_at:    string;
}

export interface CreditLimitSuggestion {
    id:                  string;
    business_id:         string;
    current_tier:        RiskTier;
    suggested_tier:      RiskTier;
    current_limit:       number;
    suggested_limit:     number;
    completed_invoices:  number;
    total_paid:          number;
    avg_days_to_pay:     number;
    on_time_payments:    number;
    late_payments:       number;
    overdue_last_90d:    number;
    reasons:             string[];
    blocking_reasons:    string[];
    status:              SuggestionStatus;
    reviewed_by:         string | null;
    reviewed_at:         string | null;
    computed_at:         string;
    expires_at:          string;
    created_at:          string;
}

export interface CreditStatusResult {
    status:           CreditStatus | 'none';
    credit_limit:     number;
    outstanding:      number;
    available:        number;
    has_overdue:      boolean;
    terms_days:       number;
    risk_tier:        RiskTier;
    suspended_reason: string | null;
    last_reviewed_at: string | null;
}
