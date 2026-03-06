(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/riskService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "approveSuggestion",
    ()=>approveSuggestion,
    "autoSuspendIfOverdue",
    ()=>autoSuspendIfOverdue,
    "computeMetrics",
    ()=>computeMetrics,
    "fetchAllSuggestions",
    ()=>fetchAllSuggestions,
    "fetchPendingSuggestions",
    ()=>fetchPendingSuggestions,
    "rejectSuggestion",
    ()=>rejectSuggestion,
    "runHealthCheck",
    ()=>runHealthCheck,
    "suggestLimitIncrease",
    ()=>suggestLimitIncrease
]);
/**
 * OUROZ – riskService
 * Business risk scoring, credit-limit suggestion workflow, and automated
 * suspension logic. All functions return data / null / empty arrays on
 * error – they never throw.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
// =============================================================================
// Internal helpers
// =============================================================================
/**
 * Safely parse a value that may be a JSON string or already an object.
 * Returns null if the input is falsy or unparseable.
 */ function safeParseJson(raw) {
    if (raw === null || raw === undefined) return null;
    if (typeof raw === 'object') return raw;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch  {
            return null;
        }
    }
    return null;
}
async function computeMetrics(businessId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('compute_business_metrics', {
        p_business_id: businessId
    });
    if (error || data === null || data === undefined) return null;
    const parsed = safeParseJson(data);
    if (!parsed || !parsed.business_id) return null;
    return {
        business_id: String(parsed.business_id),
        current_tier: parsed.current_tier ?? 'starter',
        current_limit: Number(parsed.current_limit ?? 0),
        terms_days: Number(parsed.terms_days ?? 30),
        completed_invoices: Number(parsed.completed_invoices ?? 0),
        total_paid: Number(parsed.total_paid ?? 0),
        on_time_payments: Number(parsed.on_time_payments ?? 0),
        late_payments: Number(parsed.late_payments ?? 0),
        avg_days_to_pay: Number(parsed.avg_days_to_pay ?? 0),
        overdue_last_60d: Number(parsed.overdue_last_60d ?? 0),
        overdue_last_90d: Number(parsed.overdue_last_90d ?? 0),
        two_or_more_late_90d: Boolean(parsed.two_or_more_late_90d ?? false)
    };
}
async function suggestLimitIncrease(businessId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('suggest_credit_limit_increase', {
        p_business_id: businessId
    });
    if (error || data === null || data === undefined) return null;
    const parsed = safeParseJson(data);
    if (!parsed || !parsed.business_id) return null;
    const metrics = parsed.metrics ? {
        business_id: String(parsed.metrics.business_id ?? businessId),
        current_tier: parsed.metrics.current_tier ?? 'starter',
        current_limit: Number(parsed.metrics.current_limit ?? 0),
        terms_days: Number(parsed.metrics.terms_days ?? 30),
        completed_invoices: Number(parsed.metrics.completed_invoices ?? 0),
        total_paid: Number(parsed.metrics.total_paid ?? 0),
        on_time_payments: Number(parsed.metrics.on_time_payments ?? 0),
        late_payments: Number(parsed.metrics.late_payments ?? 0),
        avg_days_to_pay: Number(parsed.metrics.avg_days_to_pay ?? 0),
        overdue_last_60d: Number(parsed.metrics.overdue_last_60d ?? 0),
        overdue_last_90d: Number(parsed.metrics.overdue_last_90d ?? 0),
        two_or_more_late_90d: Boolean(parsed.metrics.two_or_more_late_90d ?? false)
    } : await computeMetrics(businessId);
    if (!metrics) return null;
    return {
        business_id: String(parsed.business_id),
        current_tier: parsed.current_tier ?? 'starter',
        current_limit: Number(parsed.current_limit ?? 0),
        suggested_tier: parsed.suggested_tier ?? null,
        suggested_limit: parsed.suggested_limit != null ? Number(parsed.suggested_limit) : null,
        eligible: Boolean(parsed.eligible ?? false),
        reasons: Array.isArray(parsed.reasons) ? parsed.reasons : [],
        blocking_reasons: Array.isArray(parsed.blocking_reasons) ? parsed.blocking_reasons : [],
        metrics
    };
}
async function autoSuspendIfOverdue(businessId) {
    const { data: hasOverdue, error: checkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('has_overdue_invoices', {
        p_business_id: businessId
    });
    if (checkError) return {
        suspended: false
    };
    if (!hasOverdue) return {
        suspended: false
    };
    const reason = 'Account automatically suspended: one or more invoices are overdue.';
    const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').update({
        status: 'suspended',
        suspended_reason: reason,
        suspended_at: new Date().toISOString()
    }).eq('business_id', businessId);
    if (updateError) return {
        suspended: false
    };
    return {
        suspended: true,
        reason
    };
}
async function fetchPendingSuggestions() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_limit_suggestions').select(`
            *,
            business:business_id (id, name, contact_email)
        `).eq('status', 'pending').order('computed_at', {
        ascending: false
    });
    if (error || !data) return [];
    return data;
}
async function fetchAllSuggestions() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_limit_suggestions').select(`
            *,
            business:business_id (id, name, contact_email)
        `).order('computed_at', {
        ascending: false
    }).limit(100);
    if (error || !data) return [];
    return data;
}
async function approveSuggestion(suggestionId, adminUserId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('approve_credit_suggestion', {
        p_suggestion_id: suggestionId,
        p_admin_user_id: adminUserId
    });
    if (error) return {
        ok: false,
        error: error.message
    };
    const result = safeParseJson(data);
    if (!result) return {
        ok: false,
        error: 'Unexpected response from server.'
    };
    return {
        ok: Boolean(result.ok),
        error: result.error,
        new_tier: result.new_tier,
        new_limit: result.new_limit != null ? Number(result.new_limit) : undefined
    };
}
async function rejectSuggestion(suggestionId, adminUserId) {
    const now = new Date().toISOString();
    const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_limit_suggestions').update({
        status: 'rejected',
        reviewed_by: adminUserId,
        reviewed_at: now
    }).eq('id', suggestionId);
    if (updateError) return {
        ok: false,
        error: updateError.message
    };
    // Log the admin action – fire-and-forget; a failure here is non-fatal
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('log_admin_action', {
        p_actor_user_id: adminUserId,
        p_action: 'reject_credit_suggestion',
        p_entity_type: 'credit_limit_suggestion',
        p_entity_id: suggestionId,
        p_payload: {
            reviewed_at: now
        }
    });
    return {
        ok: true
    };
}
async function runHealthCheck() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('run_credit_health_check');
    if (error) return {
        ok: false,
        error: error.message
    };
    const result = safeParseJson(data);
    return {
        ok: true,
        result: result ?? {}
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/admin/risk/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>RiskPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * /admin/risk — Credit Risk & Limit Suggestions dashboard
 * Two tabs:
 *   1. Pending Suggestions – review AI-generated tier / limit upgrade suggestions
 *   2. All Businesses      – browse every approved business, run health-check,
 *                            compute live metrics per row
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/riskService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
// =============================================================================
// Utility helpers
// =============================================================================
function fmtAED(n) {
    return `AED ${n.toLocaleString('en-AE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}
function pct(n) {
    return `${n.toFixed(1)}%`;
}
function normCreditAccount(raw) {
    if (!raw) return null;
    if (Array.isArray(raw)) return raw[0] ?? null;
    return raw;
}
function TierBadge({ tier }) {
    if (!tier) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-500 border border-stone-200",
            children: "—"
        }, void 0, false, {
            fileName: "[project]/app/admin/risk/page.tsx",
            lineNumber: 78,
            columnNumber: 7
        }, this);
    }
    const classes = {
        starter: 'bg-amber-50 border border-amber-200 text-amber-700',
        trusted: 'bg-blue-50 border border-blue-200 text-blue-700',
        pro: 'bg-emerald-50 border border-emerald-200 text-emerald-700'
    };
    const cls = classes[tier.toLowerCase()] ?? 'bg-stone-100 border border-stone-200 text-stone-500';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`,
        children: tier.charAt(0).toUpperCase() + tier.slice(1)
    }, void 0, false, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 98,
        columnNumber: 5
    }, this);
}
_c = TierBadge;
function StatusPill({ status }) {
    const map = {
        active: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
        approved: 'bg-emerald-50 border border-emerald-200 text-emerald-700',
        suspended: 'bg-red-50 border border-red-200 text-red-700',
        rejected: 'bg-red-50 border border-red-200 text-red-700',
        pending: 'bg-amber-50 border border-amber-200 text-amber-700'
    };
    const cls = map[status] ?? 'bg-stone-100 border border-stone-200 text-stone-500';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`,
        children: status
    }, void 0, false, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 127,
        columnNumber: 5
    }, this);
}
_c1 = StatusPill;
function Spinner({ size = 6 }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `w-${size} h-${size} rounded-full border-2 border-stone-200 border-t-stone-700 motion-safe:animate-spin`
    }, void 0, false, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 137,
        columnNumber: 5
    }, this);
}
_c2 = Spinner;
function Toast({ message, type, onDismiss }) {
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Toast.useEffect": ()=>{
            const t = setTimeout(onDismiss, 5000);
            return ({
                "Toast.useEffect": ()=>clearTimeout(t)
            })["Toast.useEffect"];
        }
    }["Toast.useEffect"], [
        onDismiss
    ]);
    const bg = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-stone-800';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white motion-safe:animate-in motion-safe:slide-in-from-bottom-4 ${bg}`,
        children: message
    }, void 0, false, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 165,
        columnNumber: 5
    }, this);
}
_s(Toast, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c3 = Toast;
// =============================================================================
// Inline metrics panel shown per-row on demand
// =============================================================================
function MetricsPanel({ metrics }) {
    const onTimePct = metrics.completed_invoices > 0 ? metrics.on_time_payments / metrics.completed_invoices * 100 : 0;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "mt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricItem, {
                label: "Paid invoices",
                value: String(metrics.completed_invoices)
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 185,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricItem, {
                label: "Total paid",
                value: fmtAED(metrics.total_paid)
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 186,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricItem, {
                label: "Avg days to pay",
                value: `${metrics.avg_days_to_pay.toFixed(1)}d`
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 187,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricItem, {
                label: "On-time",
                value: pct(onTimePct),
                highlight: "green"
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 191,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricItem, {
                label: "Overdue last 90d",
                value: String(metrics.overdue_last_90d),
                highlight: metrics.overdue_last_90d > 0 ? 'red' : undefined
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 184,
        columnNumber: 5
    }, this);
}
_c4 = MetricsPanel;
function MetricItem({ label, value, highlight }) {
    const valCls = highlight === 'green' ? 'text-emerald-600' : highlight === 'red' ? 'text-red-600' : 'text-stone-800';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "text-xs text-stone-400 mb-0.5",
                children: label
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 218,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: `text-sm font-semibold ${valCls}`,
                children: value
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 219,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 217,
        columnNumber: 5
    }, this);
}
_c5 = MetricItem;
function RiskPage() {
    _s1();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const [adminId, setAdminId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [authLoading, setAuthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pending');
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const showToast = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RiskPage.useCallback[showToast]": (message, type = 'info')=>{
            setToast({
                message,
                type
            });
        }
    }["RiskPage.useCallback[showToast]"], []);
    // ── Pending suggestions state ─────────────────────────────────────────────
    const [pendingRows, setPendingRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [pendingLoading, setPendingLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [actioningId, setActioningId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // ── All businesses state ──────────────────────────────────────────────────
    const [bizRows, setBizRows] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [bizLoading, setBizLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [healthRunning, setHealthRunning] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [metricsMap, setMetricsMap] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])({});
    // ── Auth guard ────────────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RiskPage.useEffect": ()=>{
            ({
                "RiskPage.useEffect": async ()=>{
                    const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                    if (!user) {
                        router.replace('/');
                        return;
                    }
                    const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('role').eq('user_id', user.id).single();
                    const profileRole = profile?.role;
                    if (profileRole !== 'admin') {
                        router.replace('/');
                        return;
                    }
                    setAdminId(user.id);
                    setAuthLoading(false);
                }
            })["RiskPage.useEffect"]();
        }
    }["RiskPage.useEffect"], [
        router
    ]);
    // ── Load tab data ─────────────────────────────────────────────────────────
    const loadPending = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RiskPage.useCallback[loadPending]": async ()=>{
            setPendingLoading(true);
            const rows = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchPendingSuggestions"])();
            setPendingRows(rows);
            setPendingLoading(false);
        }
    }["RiskPage.useCallback[loadPending]"], []);
    const loadBusinesses = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "RiskPage.useCallback[loadBusinesses]": async ()=>{
            setBizLoading(true);
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('businesses').select(`
        id, name, contact_email, status,
        credit_account:credit_accounts (
          status, credit_limit, terms_days, risk_tier, suspended_reason, last_reviewed_at
        )
      `).eq('status', 'approved');
            if (!error && data) {
                setBizRows(data);
            }
            setBizLoading(false);
        }
    }["RiskPage.useCallback[loadBusinesses]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "RiskPage.useEffect": ()=>{
            if (authLoading) return;
            if (activeTab === 'pending') loadPending();
            else loadBusinesses();
        }
    }["RiskPage.useEffect"], [
        authLoading,
        activeTab,
        loadPending,
        loadBusinesses
    ]);
    // ── Approve / Reject ──────────────────────────────────────────────────────
    async function handleApprove(id) {
        setActioningId(id);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["approveSuggestion"])(id, adminId);
        if (result.ok) {
            showToast(`Approved — tier updated to ${result.new_tier ?? '?'}, limit ${result.new_limit != null ? fmtAED(result.new_limit) : '?'}`, 'success');
            await loadPending();
        } else {
            showToast(result.error ?? 'Approval failed.', 'error');
        }
        setActioningId(null);
    }
    async function handleReject(id) {
        setActioningId(id);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["rejectSuggestion"])(id, adminId);
        if (result.ok) {
            showToast('Suggestion rejected.', 'info');
            await loadPending();
        } else {
            showToast(result.error ?? 'Rejection failed.', 'error');
        }
        setActioningId(null);
    }
    // ── Health check ──────────────────────────────────────────────────────────
    async function handleRunHealthCheck() {
        setHealthRunning(true);
        const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["runHealthCheck"])();
        if (result.ok && result.result) {
            const r = result.result;
            showToast(`Health check complete — overdue: ${r.invoices_marked_overdue ?? 0}, suspended: ${r.accounts_suspended ?? 0}, suggestions: ${r.suggestions_created ?? 0}`, 'success');
            // Reload both tabs to reflect any changes
            await Promise.all([
                loadPending(),
                loadBusinesses()
            ]);
        } else {
            showToast(result.error ?? 'Health check failed.', 'error');
        }
        setHealthRunning(false);
    }
    // ── Compute metrics on demand ─────────────────────────────────────────────
    async function handleComputeMetrics(businessId) {
        setMetricsMap((prev)=>({
                ...prev,
                [businessId]: {
                    loading: true,
                    data: prev[businessId]?.data ?? null
                }
            }));
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$riskService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["computeMetrics"])(businessId);
        setMetricsMap((prev)=>({
                ...prev,
                [businessId]: {
                    loading: false,
                    data
                }
            }));
    }
    // ── Loading guard ─────────────────────────────────────────────────────────
    if (authLoading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex items-center justify-center py-20",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {
                size: 8
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 395,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/app/admin/risk/page.tsx",
            lineNumber: 394,
            columnNumber: 7
        }, this);
    }
    const pendingCount = pendingRows.length;
    // ── Render ────────────────────────────────────────────────────────────────
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: [
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Toast, {
                message: toast.message,
                type: toast.type,
                onDismiss: ()=>setToast(null)
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 407,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-semibold text-stone-800",
                        children: "Risk & Credit Limits"
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 416,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-sm text-stone-500 mt-0.5",
                        children: "Review automated credit suggestions and run periodic health checks."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 417,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 415,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-1 border-b border-stone-200 mb-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                        label: "Pending Suggestions",
                        active: activeTab === 'pending',
                        badge: pendingCount > 0 ? pendingCount : undefined,
                        onClick: ()=>setActiveTab('pending')
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 424,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TabButton, {
                        label: "All Businesses",
                        active: activeTab === 'businesses',
                        onClick: ()=>setActiveTab('businesses')
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 423,
                columnNumber: 7
            }, this),
            activeTab === 'pending' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: pendingLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center py-16",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {}, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 442,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/risk/page.tsx",
                    lineNumber: 441,
                    columnNumber: 13
                }, this) : pendingRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex flex-col items-center justify-center py-20 text-center",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                className: "w-6 h-6 text-stone-400",
                                fill: "none",
                                stroke: "currentColor",
                                viewBox: "0 0 24 24",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                    strokeLinecap: "round",
                                    strokeLinejoin: "round",
                                    strokeWidth: 1.5,
                                    d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                }, void 0, false, {
                                    fileName: "[project]/app/admin/risk/page.tsx",
                                    lineNumber: 453,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 447,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/app/admin/risk/page.tsx",
                            lineNumber: 446,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-sm font-medium text-stone-600",
                            children: "No pending suggestions"
                        }, void 0, false, {
                            fileName: "[project]/app/admin/risk/page.tsx",
                            lineNumber: 461,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: "text-xs text-stone-400 mt-1",
                            children: "All suggestions have been reviewed, or none have been generated yet."
                        }, void 0, false, {
                            fileName: "[project]/app/admin/risk/page.tsx",
                            lineNumber: 462,
                            columnNumber: 15
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/admin/risk/page.tsx",
                    lineNumber: 445,
                    columnNumber: 13
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg border border-stone-200 overflow-x-auto",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("table", {
                        className: "min-w-full text-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("thead", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                    className: "border-b border-stone-100 bg-stone-50 text-stone-600 text-xs font-medium",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-left px-4 py-3",
                                            children: "Business"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 471,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-center px-4 py-3",
                                            children: "Current Tier"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 472,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-center px-4 py-3",
                                            children: "Suggested Tier"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 473,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right px-4 py-3",
                                            children: "Current Limit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 474,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right px-4 py-3",
                                            children: "Suggested Limit"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 475,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-center px-4 py-3",
                                            children: "Metrics Summary"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 476,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("th", {
                                            className: "text-right px-4 py-3",
                                            children: "Actions"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 477,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/app/admin/risk/page.tsx",
                                    lineNumber: 470,
                                    columnNumber: 19
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 469,
                                columnNumber: 17
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tbody", {
                                children: pendingRows.map((row)=>{
                                    const biz = row.business ?? {
                                        name: '—',
                                        contact_email: ''
                                    };
                                    const onTimePct = row.completed_invoices > 0 ? row.on_time_payments / row.completed_invoices * 100 : 0;
                                    const isActioning = actioningId === row.id;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("tr", {
                                        className: "border-b border-stone-100 last:border-0 motion-safe:transition-colors hover:bg-stone-50/50",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-stone-800",
                                                        children: biz.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 496,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-stone-400",
                                                        children: biz.contact_email
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 27
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 495,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TierBadge, {
                                                    tier: row.current_tier
                                                }, void 0, false, {
                                                    fileName: "[project]/app/admin/risk/page.tsx",
                                                    lineNumber: 502,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 501,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TierBadge, {
                                                            tier: row.suggested_tier
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 508,
                                                            columnNumber: 29
                                                        }, this),
                                                        row.suggested_tier !== row.current_tier && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] text-stone-400",
                                                            children: "↑"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 510,
                                                            columnNumber: 31
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/risk/page.tsx",
                                                    lineNumber: 507,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 506,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3 text-right font-medium text-stone-600",
                                                children: fmtAED(row.current_limit)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 518,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3 text-right font-semibold text-stone-800",
                                                children: row.suggested_limit != null ? fmtAED(row.suggested_limit) : '—'
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 523,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3 text-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "inline-flex flex-col items-start gap-0.5 text-xs text-stone-500",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                row.completed_invoices,
                                                                " paid"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 532,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                row.avg_days_to_pay.toFixed(1),
                                                                "d avg"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 533,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: onTimePct >= 90 ? 'text-emerald-600 font-medium' : onTimePct >= 70 ? 'text-amber-600 font-medium' : 'text-red-600 font-medium',
                                                            children: [
                                                                pct(onTimePct),
                                                                " on-time"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 534,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/risk/page.tsx",
                                                    lineNumber: 531,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 530,
                                                columnNumber: 25
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("td", {
                                                className: "px-4 py-3",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-end gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleApprove(row.id),
                                                            disabled: isActioning,
                                                            className: "text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                            children: isActioning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "inline-flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "w-3 h-3 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                                        lineNumber: 558,
                                                                        columnNumber: 35
                                                                    }, this),
                                                                    "…"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 557,
                                                                columnNumber: 33
                                                            }, this) : 'Approve'
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 551,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>handleReject(row.id),
                                                            disabled: isActioning,
                                                            className: "text-xs px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                            children: "Reject"
                                                        }, void 0, false, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 565,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/app/admin/risk/page.tsx",
                                                    lineNumber: 550,
                                                    columnNumber: 27
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 549,
                                                columnNumber: 25
                                            }, this)
                                        ]
                                    }, row.id, true, {
                                        fileName: "[project]/app/admin/risk/page.tsx",
                                        lineNumber: 490,
                                        columnNumber: 23
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 480,
                                columnNumber: 17
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 468,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/admin/risk/page.tsx",
                    lineNumber: 467,
                    columnNumber: 13
                }, this)
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 439,
                columnNumber: 9
            }, this),
            activeTab === 'businesses' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-stone-500",
                                children: bizLoading ? 'Loading…' : `${bizRows.length} approved business${bizRows.length !== 1 ? 'es' : ''}`
                            }, void 0, false, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 589,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleRunHealthCheck,
                                disabled: healthRunning,
                                className: "inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-900 motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                                children: healthRunning ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin"
                                        }, void 0, false, {
                                            fileName: "[project]/app/admin/risk/page.tsx",
                                            lineNumber: 599,
                                            columnNumber: 19
                                        }, this),
                                        "Running…"
                                    ]
                                }, void 0, true) : 'Run Health Check'
                            }, void 0, false, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 592,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 588,
                        columnNumber: 11
                    }, this),
                    bizLoading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-center py-16",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Spinner, {}, void 0, false, {
                            fileName: "[project]/app/admin/risk/page.tsx",
                            lineNumber: 610,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 609,
                        columnNumber: 13
                    }, this) : bizRows.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "text-center py-16 text-stone-400 text-sm",
                        children: "No approved businesses found."
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 613,
                        columnNumber: 13
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-2",
                        children: bizRows.map((biz)=>{
                            const ca = normCreditAccount(biz.credit_account);
                            const metrics = metricsMap[biz.id];
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-white rounded-lg border border-stone-200 px-4 py-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-start gap-x-4 gap-y-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 min-w-0",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "font-medium text-stone-800 truncate",
                                                        children: biz.name
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 631,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-stone-400 truncate",
                                                        children: biz.contact_email
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 632,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 630,
                                                columnNumber: 23
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3 flex-wrap",
                                                children: [
                                                    ca ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StatusPill, {
                                                                status: ca.status
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 639,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TierBadge, {
                                                                tier: ca.risk_tier
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 640,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-stone-500",
                                                                children: [
                                                                    "Limit:",
                                                                    ' ',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-semibold text-stone-700",
                                                                        children: fmtAED(ca.credit_limit)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                                        lineNumber: 643,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 641,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-stone-400",
                                                                children: [
                                                                    "Net ",
                                                                    ca.terms_days,
                                                                    "d"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 647,
                                                                columnNumber: 29
                                                            }, this),
                                                            ca.last_reviewed_at && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-xs text-stone-400",
                                                                children: [
                                                                    "Reviewed",
                                                                    ' ',
                                                                    new Date(ca.last_reviewed_at).toLocaleDateString('en-AE', {
                                                                        day: '2-digit',
                                                                        month: 'short'
                                                                    })
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                                lineNumber: 651,
                                                                columnNumber: 31
                                                            }, this)
                                                        ]
                                                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-stone-400 italic",
                                                        children: "No credit account"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 661,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleComputeMetrics(biz.id),
                                                        disabled: metrics?.loading,
                                                        className: "text-xs px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                                                        children: metrics?.loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "inline-flex items-center gap-1",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "w-3 h-3 rounded-full border-2 border-stone-200 border-t-stone-600 motion-safe:animate-spin"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/app/admin/risk/page.tsx",
                                                                    lineNumber: 672,
                                                                    columnNumber: 31
                                                                }, this),
                                                                "Computing…"
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/app/admin/risk/page.tsx",
                                                            lineNumber: 671,
                                                            columnNumber: 29
                                                        }, this) : metrics?.data ? 'Refresh Metrics' : 'Compute Metrics'
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/admin/risk/page.tsx",
                                                        lineNumber: 665,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/admin/risk/page.tsx",
                                                lineNumber: 636,
                                                columnNumber: 23
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/admin/risk/page.tsx",
                                        lineNumber: 628,
                                        columnNumber: 21
                                    }, this),
                                    ca?.status === 'suspended' && ca.suspended_reason && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-1.5",
                                        children: ca.suspended_reason
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/risk/page.tsx",
                                        lineNumber: 686,
                                        columnNumber: 23
                                    }, this),
                                    metrics?.data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(MetricsPanel, {
                                        metrics: metrics.data
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/risk/page.tsx",
                                        lineNumber: 692,
                                        columnNumber: 39
                                    }, this),
                                    metrics && !metrics.loading && !metrics.data && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mt-2 text-xs text-stone-400",
                                        children: "No metric data available for this business."
                                    }, void 0, false, {
                                        fileName: "[project]/app/admin/risk/page.tsx",
                                        lineNumber: 694,
                                        columnNumber: 23
                                    }, this)
                                ]
                            }, biz.id, true, {
                                fileName: "[project]/app/admin/risk/page.tsx",
                                lineNumber: 623,
                                columnNumber: 19
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/app/admin/risk/page.tsx",
                        lineNumber: 617,
                        columnNumber: 13
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 586,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 405,
        columnNumber: 5
    }, this);
}
_s1(RiskPage, "DYtNQs2JyR0aQFoMbqRj310FcIo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c6 = RiskPage;
// =============================================================================
// TabButton
// =============================================================================
function TabButton({ label, active, badge, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: [
            'relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 motion-safe:transition-colors',
            active ? 'border-stone-800 text-stone-800' : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300'
        ].join(' '),
        children: [
            label,
            badge !== undefined && badge > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold",
                children: badge > 99 ? '99+' : badge
            }, void 0, false, {
                fileName: "[project]/app/admin/risk/page.tsx",
                lineNumber: 736,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/admin/risk/page.tsx",
        lineNumber: 725,
        columnNumber: 5
    }, this);
}
_c7 = TabButton;
var _c, _c1, _c2, _c3, _c4, _c5, _c6, _c7;
__turbopack_context__.k.register(_c, "TierBadge");
__turbopack_context__.k.register(_c1, "StatusPill");
__turbopack_context__.k.register(_c2, "Spinner");
__turbopack_context__.k.register(_c3, "Toast");
__turbopack_context__.k.register(_c4, "MetricsPanel");
__turbopack_context__.k.register(_c5, "MetricItem");
__turbopack_context__.k.register(_c6, "RiskPage");
__turbopack_context__.k.register(_c7, "TabButton");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=_cd007572._.js.map