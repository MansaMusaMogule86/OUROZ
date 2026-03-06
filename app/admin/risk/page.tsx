'use client';

/**
 * /admin/risk — Credit Risk & Limit Suggestions dashboard
 * Two tabs:
 *   1. Pending Suggestions – review AI-generated tier / limit upgrade suggestions
 *   2. All Businesses      – browse every approved business, run health-check,
 *                            compute live metrics per row
 */

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
  computeMetrics,
  fetchPendingSuggestions,
  fetchAllSuggestions,
  approveSuggestion,
  rejectSuggestion,
  runHealthCheck,
  type BusinessMetrics,
  type CreditSuggestionRow,
} from '@/services/riskService';

// =============================================================================
// Types for the "All Businesses" tab
// =============================================================================

interface CreditAccountSnapshot {
  status: 'active' | 'suspended';
  credit_limit: number;
  terms_days: number;
  risk_tier: string | null;
  suspended_reason: string | null;
  last_reviewed_at: string | null;
}

interface BusinessRow {
  id: string;
  name: string;
  contact_email: string;
  status: string;
  credit_account: CreditAccountSnapshot | CreditAccountSnapshot[] | null;
}

// =============================================================================
// Utility helpers
// =============================================================================

function fmtAED(n: number): string {
  return `AED ${n.toLocaleString('en-AE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function pct(n: number): string {
  return `${n.toFixed(1)}%`;
}

function normCreditAccount(
  raw: CreditAccountSnapshot | CreditAccountSnapshot[] | null
): CreditAccountSnapshot | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw[0] ?? null;
  return raw;
}

// =============================================================================
// Sub-components
// =============================================================================

type RiskTier = 'starter' | 'trusted' | 'pro';

function TierBadge({ tier }: { tier: string | null }) {
  if (!tier) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-500 border border-stone-200">
        —
      </span>
    );
  }

  const classes: Record<string, string> = {
    starter:
      'bg-amber-50 border border-amber-200 text-amber-700',
    trusted:
      'bg-blue-50 border border-blue-200 text-blue-700',
    pro:
      'bg-emerald-50 border border-emerald-200 text-emerald-700',
  };

  const cls =
    classes[tier.toLowerCase()] ??
    'bg-stone-100 border border-stone-200 text-stone-500';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${cls}`}
    >
      {tier.charAt(0).toUpperCase() + tier.slice(1)}
    </span>
  );
}

function StatusPill({
  status,
}: {
  status: 'active' | 'suspended' | 'pending' | 'approved' | 'rejected' | string;
}) {
  const map: Record<string, string> = {
    active:
      'bg-emerald-50 border border-emerald-200 text-emerald-700',
    approved:
      'bg-emerald-50 border border-emerald-200 text-emerald-700',
    suspended:
      'bg-red-50 border border-red-200 text-red-700',
    rejected:
      'bg-red-50 border border-red-200 text-red-700',
    pending:
      'bg-amber-50 border border-amber-200 text-amber-700',
  };
  const cls =
    map[status] ?? 'bg-stone-100 border border-stone-200 text-stone-500';

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${cls}`}
    >
      {status}
    </span>
  );
}

function Spinner({ size = 6 }: { size?: number }) {
  return (
    <div
      className={`w-${size} h-${size} rounded-full border-2 border-stone-200 border-t-stone-700 motion-safe:animate-spin`}
    />
  );
}

function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: 'success' | 'error' | 'info';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const bg =
    type === 'success'
      ? 'bg-emerald-600'
      : type === 'error'
      ? 'bg-red-600'
      : 'bg-stone-800';

  return (
    <div
      className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium text-white motion-safe:animate-in motion-safe:slide-in-from-bottom-4 ${bg}`}
    >
      {message}
    </div>
  );
}

// =============================================================================
// Inline metrics panel shown per-row on demand
// =============================================================================

function MetricsPanel({ metrics }: { metrics: BusinessMetrics }) {
  const onTimePct =
    metrics.completed_invoices > 0
      ? (metrics.on_time_payments / metrics.completed_invoices) * 100
      : 0;

  return (
    <div className="mt-2 grid grid-cols-2 sm:grid-cols-5 gap-3 bg-stone-50 border border-stone-100 rounded-lg px-4 py-3">
      <MetricItem label="Paid invoices" value={String(metrics.completed_invoices)} />
      <MetricItem label="Total paid" value={fmtAED(metrics.total_paid)} />
      <MetricItem
        label="Avg days to pay"
        value={`${metrics.avg_days_to_pay.toFixed(1)}d`}
      />
      <MetricItem label="On-time" value={pct(onTimePct)} highlight="green" />
      <MetricItem
        label="Overdue last 90d"
        value={String(metrics.overdue_last_90d)}
        highlight={metrics.overdue_last_90d > 0 ? 'red' : undefined}
      />
    </div>
  );
}

function MetricItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: 'green' | 'red';
}) {
  const valCls =
    highlight === 'green'
      ? 'text-emerald-600'
      : highlight === 'red'
      ? 'text-red-600'
      : 'text-stone-800';
  return (
    <div>
      <p className="text-xs text-stone-400 mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${valCls}`}>{value}</p>
    </div>
  );
}

// =============================================================================
// Main page
// =============================================================================

type Tab = 'pending' | 'businesses';

export default function RiskPage() {
  const router = useRouter();

  const [adminId, setAdminId] = useState('');
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('pending');

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      setToast({ message, type });
    },
    []
  );

  // ── Pending suggestions state ─────────────────────────────────────────────
  const [pendingRows, setPendingRows] = useState<CreditSuggestionRow[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [actioningId, setActioningId] = useState<string | null>(null);

  // ── All businesses state ──────────────────────────────────────────────────
  const [bizRows, setBizRows] = useState<BusinessRow[]>([]);
  const [bizLoading, setBizLoading] = useState(false);
  const [healthRunning, setHealthRunning] = useState(false);
  const [metricsMap, setMetricsMap] = useState<
    Record<string, { loading: boolean; data: BusinessMetrics | null }>
  >({});

  // ── Auth guard ────────────────────────────────────────────────────────────

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.replace('/');
        return;
      }
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();
      const profileRole = (profile as { role?: string } | null)?.role;

      if (profileRole !== 'admin') {
        router.replace('/');
        return;
      }
      setAdminId(user.id);
      setAuthLoading(false);
    })();
  }, [router]);

  // ── Load tab data ─────────────────────────────────────────────────────────

  const loadPending = useCallback(async () => {
    setPendingLoading(true);
    const rows = await fetchPendingSuggestions();
    setPendingRows(rows);
    setPendingLoading(false);
  }, []);

  const loadBusinesses = useCallback(async () => {
    setBizLoading(true);
    const { data, error } = await supabase
      .from('businesses')
      .select(
        `
        id, name, contact_email, status,
        credit_account:credit_accounts (
          status, credit_limit, terms_days, risk_tier, suspended_reason, last_reviewed_at
        )
      `
      )
      .eq('status', 'approved');
    if (!error && data) {
      setBizRows(data as unknown as BusinessRow[]);
    }
    setBizLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (activeTab === 'pending') loadPending();
    else loadBusinesses();
  }, [authLoading, activeTab, loadPending, loadBusinesses]);

  // ── Approve / Reject ──────────────────────────────────────────────────────

  async function handleApprove(id: string) {
    setActioningId(id);
    const result = await approveSuggestion(id, adminId);
    if (result.ok) {
      showToast(
        `Approved — tier updated to ${result.new_tier ?? '?'}, limit ${
          result.new_limit != null ? fmtAED(result.new_limit) : '?'
        }`,
        'success'
      );
      await loadPending();
    } else {
      showToast(result.error ?? 'Approval failed.', 'error');
    }
    setActioningId(null);
  }

  async function handleReject(id: string) {
    setActioningId(id);
    const result = await rejectSuggestion(id, adminId);
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
    const result = await runHealthCheck();
    if (result.ok && result.result) {
      const r = result.result as {
        invoices_marked_overdue?: number;
        accounts_suspended?: number;
        suggestions_created?: number;
      };
      showToast(
        `Health check complete — overdue: ${r.invoices_marked_overdue ?? 0}, suspended: ${
          r.accounts_suspended ?? 0
        }, suggestions: ${r.suggestions_created ?? 0}`,
        'success'
      );
      // Reload both tabs to reflect any changes
      await Promise.all([loadPending(), loadBusinesses()]);
    } else {
      showToast(result.error ?? 'Health check failed.', 'error');
    }
    setHealthRunning(false);
  }

  // ── Compute metrics on demand ─────────────────────────────────────────────

  async function handleComputeMetrics(businessId: string) {
    setMetricsMap((prev) => ({
      ...prev,
      [businessId]: { loading: true, data: prev[businessId]?.data ?? null },
    }));
    const data = await computeMetrics(businessId);
    setMetricsMap((prev) => ({ ...prev, [businessId]: { loading: false, data } }));
  }

  // ── Loading guard ─────────────────────────────────────────────────────────

  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size={8} />
      </div>
    );
  }

  const pendingCount = pendingRows.length;

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      {/* Page header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-800">Risk &amp; Credit Limits</h2>
        <p className="text-sm text-stone-500 mt-0.5">
          Review automated credit suggestions and run periodic health checks.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 mb-6">
        <TabButton
          label="Pending Suggestions"
          active={activeTab === 'pending'}
          badge={pendingCount > 0 ? pendingCount : undefined}
          onClick={() => setActiveTab('pending')}
        />
        <TabButton
          label="All Businesses"
          active={activeTab === 'businesses'}
          onClick={() => setActiveTab('businesses')}
        />
      </div>

      {/* ── Tab: Pending suggestions ─────────────────────────────────────── */}
      {activeTab === 'pending' && (
        <section>
          {pendingLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : pendingRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-12 h-12 rounded-full bg-stone-100 flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-stone-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-stone-600">No pending suggestions</p>
              <p className="text-xs text-stone-400 mt-1">
                All suggestions have been reviewed, or none have been generated yet.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-stone-200 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-stone-100 bg-stone-50 text-stone-600 text-xs font-medium">
                    <th className="text-left px-4 py-3">Business</th>
                    <th className="text-center px-4 py-3">Current Tier</th>
                    <th className="text-center px-4 py-3">Suggested Tier</th>
                    <th className="text-right px-4 py-3">Current Limit</th>
                    <th className="text-right px-4 py-3">Suggested Limit</th>
                    <th className="text-center px-4 py-3">Metrics Summary</th>
                    <th className="text-right px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingRows.map((row) => {
                    const biz = row.business ?? { name: '—', contact_email: '' };
                    const onTimePct =
                      row.completed_invoices > 0
                        ? (row.on_time_payments / row.completed_invoices) * 100
                        : 0;
                    const isActioning = actioningId === row.id;

                    return (
                      <tr
                        key={row.id}
                        className="border-b border-stone-100 last:border-0 motion-safe:transition-colors hover:bg-stone-50/50"
                      >
                        {/* Business */}
                        <td className="px-4 py-3">
                          <p className="font-medium text-stone-800">{biz.name}</p>
                          <p className="text-xs text-stone-400">{biz.contact_email}</p>
                        </td>

                        {/* Current tier */}
                        <td className="px-4 py-3 text-center">
                          <TierBadge tier={row.current_tier} />
                        </td>

                        {/* Suggested tier */}
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <TierBadge tier={row.suggested_tier} />
                            {row.suggested_tier !== row.current_tier && (
                              <span className="text-[10px] text-stone-400">
                                ↑
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Current limit */}
                        <td className="px-4 py-3 text-right font-medium text-stone-600">
                          {fmtAED(row.current_limit)}
                        </td>

                        {/* Suggested limit */}
                        <td className="px-4 py-3 text-right font-semibold text-stone-800">
                          {row.suggested_limit != null
                            ? fmtAED(row.suggested_limit)
                            : '—'}
                        </td>

                        {/* Metrics summary */}
                        <td className="px-4 py-3 text-center">
                          <div className="inline-flex flex-col items-start gap-0.5 text-xs text-stone-500">
                            <span>{row.completed_invoices} paid</span>
                            <span>{row.avg_days_to_pay.toFixed(1)}d avg</span>
                            <span
                              className={
                                onTimePct >= 90
                                  ? 'text-emerald-600 font-medium'
                                  : onTimePct >= 70
                                  ? 'text-amber-600 font-medium'
                                  : 'text-red-600 font-medium'
                              }
                            >
                              {pct(onTimePct)} on-time
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(row.id)}
                              disabled={isActioning}
                              className="text-xs px-3 py-1.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isActioning ? (
                                <span className="inline-flex items-center gap-1">
                                  <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
                                  …
                                </span>
                              ) : (
                                'Approve'
                              )}
                            </button>
                            <button
                              onClick={() => handleReject(row.id)}
                              disabled={isActioning}
                              className="text-xs px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ── Tab: All Businesses ───────────────────────────────────────────── */}
      {activeTab === 'businesses' && (
        <section>
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-stone-500">
              {bizLoading ? 'Loading…' : `${bizRows.length} approved business${bizRows.length !== 1 ? 'es' : ''}`}
            </p>
            <button
              onClick={handleRunHealthCheck}
              disabled={healthRunning}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-stone-800 text-white text-xs font-medium hover:bg-stone-900 motion-safe:transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {healthRunning ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white motion-safe:animate-spin" />
                  Running…
                </>
              ) : (
                'Run Health Check'
              )}
            </button>
          </div>

          {bizLoading ? (
            <div className="flex items-center justify-center py-16">
              <Spinner />
            </div>
          ) : bizRows.length === 0 ? (
            <div className="text-center py-16 text-stone-400 text-sm">
              No approved businesses found.
            </div>
          ) : (
            <div className="space-y-2">
              {bizRows.map((biz) => {
                const ca = normCreditAccount(biz.credit_account);
                const metrics = metricsMap[biz.id];

                return (
                  <div
                    key={biz.id}
                    className="bg-white rounded-lg border border-stone-200 px-4 py-4"
                  >
                    {/* Row header */}
                    <div className="flex flex-wrap items-start gap-x-4 gap-y-2">
                      {/* Business info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-stone-800 truncate">{biz.name}</p>
                        <p className="text-xs text-stone-400 truncate">{biz.contact_email}</p>
                      </div>

                      {/* Credit status */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {ca ? (
                          <>
                            <StatusPill status={ca.status} />
                            <TierBadge tier={ca.risk_tier} />
                            <span className="text-xs text-stone-500">
                              Limit:{' '}
                              <span className="font-semibold text-stone-700">
                                {fmtAED(ca.credit_limit)}
                              </span>
                            </span>
                            <span className="text-xs text-stone-400">
                              Net {ca.terms_days}d
                            </span>
                            {ca.last_reviewed_at && (
                              <span className="text-xs text-stone-400">
                                Reviewed{' '}
                                {new Date(ca.last_reviewed_at).toLocaleDateString('en-AE', {
                                  day: '2-digit',
                                  month: 'short',
                                })}
                              </span>
                            )}
                          </>
                        ) : (
                          <span className="text-xs text-stone-400 italic">No credit account</span>
                        )}

                        {/* Compute metrics button */}
                        <button
                          onClick={() => handleComputeMetrics(biz.id)}
                          disabled={metrics?.loading}
                          className="text-xs px-3 py-1.5 rounded-md border border-stone-200 text-stone-600 hover:bg-stone-50 motion-safe:transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {metrics?.loading ? (
                            <span className="inline-flex items-center gap-1">
                              <span className="w-3 h-3 rounded-full border-2 border-stone-200 border-t-stone-600 motion-safe:animate-spin" />
                              Computing…
                            </span>
                          ) : metrics?.data ? (
                            'Refresh Metrics'
                          ) : (
                            'Compute Metrics'
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Suspended reason */}
                    {ca?.status === 'suspended' && ca.suspended_reason && (
                      <p className="mt-2 text-xs text-red-600 bg-red-50 border border-red-100 rounded px-3 py-1.5">
                        {ca.suspended_reason}
                      </p>
                    )}

                    {/* Inline metrics */}
                    {metrics?.data && <MetricsPanel metrics={metrics.data} />}
                    {metrics && !metrics.loading && !metrics.data && (
                      <p className="mt-2 text-xs text-stone-400">
                        No metric data available for this business.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

// =============================================================================
// TabButton
// =============================================================================

function TabButton({
  label,
  active,
  badge,
  onClick,
}: {
  label: string;
  active: boolean;
  badge?: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'relative inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 motion-safe:transition-colors',
        active
          ? 'border-stone-800 text-stone-800'
          : 'border-transparent text-stone-500 hover:text-stone-700 hover:border-stone-300',
      ].join(' ')}
    >
      {label}
      {badge !== undefined && badge > 0 && (
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </button>
  );
}
