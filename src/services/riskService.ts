/**
 * OUROZ – riskService
 * Business risk scoring, credit-limit suggestion workflow, and automated
 * suspension logic. All functions return data / null / empty arrays on
 * error – they never throw.
 */

import { supabase } from '@/lib/supabase';

// =============================================================================
// Public types
// =============================================================================

export interface BusinessMetrics {
    business_id:          string;
    current_tier:         'starter' | 'trusted' | 'pro';
    current_limit:        number;
    terms_days:           number;
    completed_invoices:   number;
    total_paid:           number;
    on_time_payments:     number;
    late_payments:        number;
    avg_days_to_pay:      number;
    overdue_last_60d:     number;
    overdue_last_90d:     number;
    two_or_more_late_90d: boolean;
}

export interface LimitSuggestion {
    business_id:      string;
    current_tier:     'starter' | 'trusted' | 'pro';
    current_limit:    number;
    suggested_tier:   'starter' | 'trusted' | 'pro' | null;
    suggested_limit:  number | null;
    eligible:         boolean;
    reasons:          string[];
    blocking_reasons: string[];
    metrics:          BusinessMetrics;
}

export interface CreditSuggestionRow {
    id:                  string;
    business_id:         string;
    current_tier:        string;
    suggested_tier:      string;
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
    status:              'pending' | 'approved' | 'rejected' | 'expired';
    reviewed_by:         string | null;
    reviewed_at:         string | null;
    computed_at:         string;
    expires_at:          string;
    business?:           { id: string; name: string; contact_email: string };
}

// =============================================================================
// Internal helpers
// =============================================================================

/**
 * Safely parse a value that may be a JSON string or already an object.
 * Returns null if the input is falsy or unparseable.
 */
function safeParseJson<T>(raw: unknown): T | null {
    if (raw === null || raw === undefined) return null;
    if (typeof raw === 'object') return raw as T;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw) as T;
        } catch {
            return null;
        }
    }
    return null;
}

// =============================================================================
// computeMetrics
// =============================================================================

/**
 * Calls the `compute_business_metrics` DB function and returns typed metrics
 * for the given business. Returns null on any error.
 */
export async function computeMetrics(
    businessId: string
): Promise<BusinessMetrics | null> {
    const { data, error } = await supabase.rpc('compute_business_metrics', {
        p_business_id: businessId,
    });

    if (error || data === null || data === undefined) return null;

    const parsed = safeParseJson<BusinessMetrics>(data);
    if (!parsed || !parsed.business_id) return null;

    return {
        business_id:          String(parsed.business_id),
        current_tier:         parsed.current_tier         ?? 'starter',
        current_limit:        Number(parsed.current_limit  ?? 0),
        terms_days:           Number(parsed.terms_days     ?? 30),
        completed_invoices:   Number(parsed.completed_invoices ?? 0),
        total_paid:           Number(parsed.total_paid     ?? 0),
        on_time_payments:     Number(parsed.on_time_payments ?? 0),
        late_payments:        Number(parsed.late_payments  ?? 0),
        avg_days_to_pay:      Number(parsed.avg_days_to_pay ?? 0),
        overdue_last_60d:     Number(parsed.overdue_last_60d ?? 0),
        overdue_last_90d:     Number(parsed.overdue_last_90d ?? 0),
        two_or_more_late_90d: Boolean(parsed.two_or_more_late_90d ?? false),
    };
}

// =============================================================================
// suggestLimitIncrease
// =============================================================================

/**
 * Calls the `suggest_credit_limit_increase` DB function and returns a typed
 * suggestion structure. Returns null on any error.
 */
export async function suggestLimitIncrease(
    businessId: string
): Promise<LimitSuggestion | null> {
    const { data, error } = await supabase.rpc('suggest_credit_limit_increase', {
        p_business_id: businessId,
    });

    if (error || data === null || data === undefined) return null;

    const parsed = safeParseJson<LimitSuggestion>(data);
    if (!parsed || !parsed.business_id) return null;

    const metrics = parsed.metrics
        ? {
              business_id:          String(parsed.metrics.business_id          ?? businessId),
              current_tier:         parsed.metrics.current_tier                ?? 'starter',
              current_limit:        Number(parsed.metrics.current_limit         ?? 0),
              terms_days:           Number(parsed.metrics.terms_days            ?? 30),
              completed_invoices:   Number(parsed.metrics.completed_invoices    ?? 0),
              total_paid:           Number(parsed.metrics.total_paid            ?? 0),
              on_time_payments:     Number(parsed.metrics.on_time_payments      ?? 0),
              late_payments:        Number(parsed.metrics.late_payments         ?? 0),
              avg_days_to_pay:      Number(parsed.metrics.avg_days_to_pay       ?? 0),
              overdue_last_60d:     Number(parsed.metrics.overdue_last_60d      ?? 0),
              overdue_last_90d:     Number(parsed.metrics.overdue_last_90d      ?? 0),
              two_or_more_late_90d: Boolean(parsed.metrics.two_or_more_late_90d ?? false),
          }
        : await computeMetrics(businessId);

    if (!metrics) return null;

    return {
        business_id:      String(parsed.business_id),
        current_tier:     parsed.current_tier     ?? 'starter',
        current_limit:    Number(parsed.current_limit ?? 0),
        suggested_tier:   parsed.suggested_tier   ?? null,
        suggested_limit:  parsed.suggested_limit  != null ? Number(parsed.suggested_limit) : null,
        eligible:         Boolean(parsed.eligible  ?? false),
        reasons:          Array.isArray(parsed.reasons)          ? parsed.reasons          : [],
        blocking_reasons: Array.isArray(parsed.blocking_reasons) ? parsed.blocking_reasons : [],
        metrics,
    };
}

// =============================================================================
// autoSuspendIfOverdue
// =============================================================================

/**
 * Checks whether the business has overdue invoices via the
 * `has_overdue_invoices` RPC. If true, marks the credit account suspended
 * and returns `{ suspended: true, reason }`. Otherwise returns
 * `{ suspended: false }`. Never throws.
 */
export async function autoSuspendIfOverdue(
    businessId: string
): Promise<{ suspended: boolean; reason?: string }> {
    const { data: hasOverdue, error: checkError } = await supabase.rpc(
        'has_overdue_invoices',
        { p_business_id: businessId }
    );

    if (checkError) return { suspended: false };
    if (!hasOverdue)  return { suspended: false };

    const reason = 'Account automatically suspended: one or more invoices are overdue.';

    const { error: updateError } = await supabase
        .from('credit_accounts')
        .update({
            status:           'suspended',
            suspended_reason: reason,
            suspended_at:     new Date().toISOString(),
        })
        .eq('business_id', businessId);

    if (updateError) return { suspended: false };

    return { suspended: true, reason };
}

// =============================================================================
// fetchPendingSuggestions
// =============================================================================

/**
 * Returns all credit-limit suggestions with status = 'pending', most-recent
 * first, with a joined business record.
 */
export async function fetchPendingSuggestions(): Promise<CreditSuggestionRow[]> {
    const { data, error } = await supabase
        .from('credit_limit_suggestions')
        .select(`
            *,
            business:business_id (id, name, contact_email)
        `)
        .eq('status', 'pending')
        .order('computed_at', { ascending: false });

    if (error || !data) return [];
    return data as CreditSuggestionRow[];
}

// =============================================================================
// fetchAllSuggestions
// =============================================================================

/**
 * Returns the 100 most-recent credit-limit suggestions across all statuses,
 * with a joined business record.
 */
export async function fetchAllSuggestions(): Promise<CreditSuggestionRow[]> {
    const { data, error } = await supabase
        .from('credit_limit_suggestions')
        .select(`
            *,
            business:business_id (id, name, contact_email)
        `)
        .order('computed_at', { ascending: false })
        .limit(100);

    if (error || !data) return [];
    return data as CreditSuggestionRow[];
}

// =============================================================================
// approveSuggestion
// =============================================================================

/**
 * Calls the `approve_credit_suggestion` DB function which atomically applies
 * the new tier / limit and marks the suggestion approved. Returns the DB
 * function's result shape.
 */
export async function approveSuggestion(
    suggestionId: string,
    adminUserId:  string
): Promise<{ ok: boolean; error?: string; new_tier?: string; new_limit?: number }> {
    const { data, error } = await supabase.rpc('approve_credit_suggestion', {
        p_suggestion_id:  suggestionId,
        p_admin_user_id:  adminUserId,
    });

    if (error) return { ok: false, error: error.message };

    const result = safeParseJson<{
        ok:        boolean;
        error?:    string;
        new_tier?: string;
        new_limit?: number;
    }>(data);

    if (!result) return { ok: false, error: 'Unexpected response from server.' };

    return {
        ok:        Boolean(result.ok),
        error:     result.error,
        new_tier:  result.new_tier,
        new_limit: result.new_limit != null ? Number(result.new_limit) : undefined,
    };
}

// =============================================================================
// rejectSuggestion
// =============================================================================

/**
 * Marks a credit-limit suggestion as 'rejected' and logs the admin action.
 * Returns `{ ok: true }` on success, `{ ok: false, error }` otherwise.
 */
export async function rejectSuggestion(
    suggestionId: string,
    adminUserId:  string
): Promise<{ ok: boolean; error?: string }> {
    const now = new Date().toISOString();

    const { error: updateError } = await supabase
        .from('credit_limit_suggestions')
        .update({
            status:      'rejected',
            reviewed_by: adminUserId,
            reviewed_at: now,
        })
        .eq('id', suggestionId);

    if (updateError) return { ok: false, error: updateError.message };

    // Log the admin action – fire-and-forget; a failure here is non-fatal
    await supabase.rpc('log_admin_action', {
        p_actor_user_id: adminUserId,
        p_action:        'reject_credit_suggestion',
        p_entity_type:   'credit_limit_suggestion',
        p_entity_id:     suggestionId,
        p_payload:       { reviewed_at: now },
    });

    return { ok: true };
}

// =============================================================================
// runHealthCheck
// =============================================================================

/**
 * Calls the `run_credit_health_check` DB function and returns its result.
 * Useful for scheduled jobs or an admin dashboard health panel.
 */
export async function runHealthCheck(): Promise<{
    ok:      boolean;
    result?: Record<string, unknown>;
    error?:  string;
}> {
    const { data, error } = await supabase.rpc('run_credit_health_check');

    if (error) return { ok: false, error: error.message };

    const result = safeParseJson<Record<string, unknown>>(data);
    return { ok: true, result: result ?? {} };
}
