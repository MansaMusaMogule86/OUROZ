'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { runSubscription, updateSubscriptionStatus } from '@/services/subscriptionService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SubRow {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'cancelled';
  cadence: string;
  next_run_at: string;
  payment_method: string;
  business: { id: string; name: string } | null;
  last_run: { status: string; run_at: string; notes: string | null } | null;
}

type Filter = 'all' | 'active' | 'paused' | 'cancelled';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    active:    'bg-emerald-100 text-emerald-800',
    paused:    'bg-amber-100 text-amber-800',
    cancelled: 'bg-stone-100 text-stone-600',
    running:       'bg-blue-100 text-blue-800',
    created_order: 'bg-emerald-100 text-emerald-800',
    partial:       'bg-amber-100 text-amber-800',
    failed:        'bg-red-100 text-red-800',
    skipped:       'bg-stone-100 text-stone-600',
    scheduled:     'bg-blue-50 text-blue-600',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function cadenceLabel(c: string) {
  const map: Record<string, string> = {
    weekly: 'Weekly', biweekly: 'Bi-weekly',
    monthly: 'Monthly', quarterly: 'Quarterly',
  };
  return map[c] ?? c;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSubscriptionsPage() {
  const [subs, setSubs]       = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter]   = useState<Filter>('all');
  const [search, setSearch]   = useState('');

  // Per-row action state
  const [running,  setRunning]  = useState<Record<string, boolean>>({});
  const [toggling, setToggling] = useState<Record<string, boolean>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase
      .from('subscriptions')
      .select(`
        id, name, status, cadence, next_run_at, payment_method,
        business:business_id ( id, name ),
        last_run:subscription_runs (
          status, run_at, notes
        )
      `)
      .order('created_at', { ascending: false });

    if (data) {
      const rows = (data as unknown[]).map((row: unknown) => {
        const r = row as {
          id: string; name: string; status: SubRow['status'];
          cadence: string; next_run_at: string; payment_method: string;
          business: SubRow['business'];
          last_run: { status: string; run_at: string; notes: string | null }[] | null;
        };
        // Sort runs by run_at desc, pick first non-scheduled
        const runs = r.last_run ?? [];
        const sorted = [...runs].sort(
          (a, b) => new Date(b.run_at).getTime() - new Date(a.run_at).getTime()
        );
        const lastRun = sorted.find(x => x.status !== 'scheduled') ?? null;
        return { ...r, last_run: lastRun } as SubRow;
      });
      setSubs(rows);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // -------------------------------------------------------------------------
  // Actions
  // -------------------------------------------------------------------------

  async function handleRun(subId: string) {
    setRunning(prev => ({ ...prev, [subId]: true }));
    const { data: { user } } = await supabase.auth.getUser();
    const res = await runSubscription(subId, user?.id ?? 'admin');
    if (res.ok) {
      alert(`Run complete. Order created: ${res.order_id}`);
    } else {
      alert(`Run failed: ${res.notes ?? res.errors?.join(', ')}`);
    }
    await load();
    setRunning(prev => ({ ...prev, [subId]: false }));
  }

  async function handleToggle(sub: SubRow) {
    setToggling(prev => ({ ...prev, [sub.id]: true }));
    const newStatus = sub.status === 'active' ? 'paused' : 'active';
    const res = await updateSubscriptionStatus(sub.id, newStatus);
    if (!res.ok) alert(`Failed: ${res.error}`);
    await load();
    setToggling(prev => ({ ...prev, [sub.id]: false }));
  }

  async function handleCancel(subId: string) {
    if (!confirm('Cancel this subscription? This cannot be undone.')) return;
    const res = await updateSubscriptionStatus(subId, 'cancelled');
    if (!res.ok) alert(`Failed: ${res.error}`);
    await load();
  }

  // -------------------------------------------------------------------------
  // Filtering
  // -------------------------------------------------------------------------

  const visible = subs.filter(s => {
    if (filter !== 'all' && s.status !== filter) return false;
    if (search && !s.name.toLowerCase().includes(search.toLowerCase()) &&
        !s.business?.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const counts = {
    all:       subs.length,
    active:    subs.filter(s => s.status === 'active').length,
    paused:    subs.filter(s => s.status === 'paused').length,
    cancelled: subs.filter(s => s.status === 'cancelled').length,
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Subscriptions</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage B2B recurring orders across all businesses.</p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {(['all', 'active', 'paused', 'cancelled'] as Filter[]).map(k => (
          <button
            key={k}
            onClick={() => setFilter(k)}
            className={[
              'bg-white rounded-xl border p-4 text-left transition',
              filter === k ? 'border-stone-400 ring-1 ring-stone-300' : 'border-stone-200 hover:border-stone-300',
            ].join(' ')}
          >
            <p className="text-2xl font-bold text-stone-800">{counts[k]}</p>
            <p className="text-xs text-stone-500 mt-0.5 capitalize">{k}</p>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by subscription or business name…"
          className="w-full max-w-sm bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-300"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-sm text-stone-400">
          Loading subscriptions…
        </div>
      ) : visible.length === 0 ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-sm text-stone-400">
          No subscriptions found.
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-100">
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Subscription</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Business</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Cadence</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Next Run</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Last Run</th>
                <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Payment</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {visible.map(sub => (
                <tr key={sub.id} className="hover:bg-stone-50/50">
                  <td className="px-4 py-3 font-medium text-stone-800">{sub.name}</td>
                  <td className="px-4 py-3 text-stone-600">{sub.business?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-stone-600">{cadenceLabel(sub.cadence)}</td>
                  <td className="px-4 py-3"><StatusPill status={sub.status} /></td>
                  <td className="px-4 py-3 text-stone-600 text-xs">
                    {sub.next_run_at ? fmtDate(sub.next_run_at) : '—'}
                  </td>
                  <td className="px-4 py-3">
                    {sub.last_run ? (
                      <span className="space-y-0.5">
                        <StatusPill status={sub.last_run.status} />
                        {sub.last_run.notes && (
                          <p className="text-xs text-stone-400 mt-0.5 max-w-[160px] truncate" title={sub.last_run.notes}>
                            {sub.last_run.notes}
                          </p>
                        )}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">No runs yet</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-stone-600 capitalize text-xs">
                    {sub.payment_method.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 justify-end">
                      {/* Run now — only for active */}
                      {sub.status === 'active' && (
                        <button
                          onClick={() => handleRun(sub.id)}
                          disabled={running[sub.id]}
                          className="text-xs px-2.5 py-1 rounded bg-stone-800 text-white hover:bg-stone-700 transition disabled:opacity-50"
                        >
                          {running[sub.id] ? 'Running…' : 'Run now'}
                        </button>
                      )}

                      {/* Pause / Resume */}
                      {sub.status !== 'cancelled' && (
                        <button
                          onClick={() => handleToggle(sub)}
                          disabled={toggling[sub.id]}
                          className="text-xs px-2.5 py-1 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 transition disabled:opacity-50"
                        >
                          {toggling[sub.id]
                            ? '…'
                            : sub.status === 'active' ? 'Pause' : 'Resume'}
                        </button>
                      )}

                      {/* Cancel */}
                      {sub.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(sub.id)}
                          className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
