'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

interface CreditAccount {
  id: string;
  business_id: string;
  credit_limit: number;
  terms_days: number;
  status: 'active' | 'suspended';
  business?: { name: string; contact_email: string } | Array<{ name: string; contact_email: string }>;
}

interface LedgerEntry {
  business_id: string;
  amount: number;
}

interface CreditRow extends CreditAccount {
  outstanding: number;
  available: number;
}

function Toast({ message, type, onDismiss }: { message: string; type: 'error' | 'success'; onDismiss: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [onDismiss]);
  return (
    <div className={`fixed bottom-5 right-5 z-50 max-w-sm px-4 py-3 rounded-lg shadow-lg text-sm font-medium ${type === 'error' ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
      {message}
    </div>
  );
}

interface AdjustmentModalProps {
  businessId: string;
  businessName: string;
  adminId: string;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (msg: string, type: 'error' | 'success') => void;
}

function AdjustmentModal({ businessId, businessName, adminId, onClose, onSuccess, showToast }: AdjustmentModalProps) {
  const supabase = createClient();
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed === 0) { showToast('Enter a valid non-zero amount', 'error'); return; }
    if (!note.trim()) { showToast('Note is required', 'error'); return; }

    setSaving(true);
    const { error } = await supabase.rpc('post_ledger_entry', {
      p_business_id: businessId,
      p_type: 'adjustment',
      p_amount: parsed,
      p_note: note.trim(),
      p_created_by: adminId,
    });

    if (error) { showToast('Failed to post adjustment: ' + error.message, 'error'); }
    else { showToast('Adjustment posted', 'success'); onSuccess(); onClose(); }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-stone-800 mb-1">Manual Ledger Adjustment</h3>
        <p className="text-sm text-stone-500 mb-5">{businessName}</p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Amount (AED)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Positive = charge, negative = credit"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
            <p className="text-xs text-stone-400 mt-1">Positive value charges the account; negative value credits it.</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Note <span className="text-red-500">*</span></label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Reason for adjustment…"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-opacity disabled:opacity-60"
              style={{ background: 'var(--color-imperial)' }}
            >
              {saving ? 'Posting…' : 'Post adjustment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CreditPage() {
  const router = useRouter();
  const supabase = createClient();

  const [rows, setRows] = useState<CreditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminId, setAdminId] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [editLimit, setEditLimit] = useState<Record<string, string>>({});
  const [editTerms, setEditTerms] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [adjustModal, setAdjustModal] = useState<{ businessId: string; businessName: string } | null>(null);
  const [flashRow, setFlashRow] = useState<string | null>(null);

  const showToast = useCallback((message: string, type: 'error' | 'success') => {
    setToast({ message, type });
  }, []);

  const flashSuccess = (id: string) => {
    setFlashRow(id);
    setTimeout(() => setFlashRow(null), 1500);
  };

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.replace('/'); return; }
      const { data: profile } = await supabase.from('user_profiles').select('role').eq('user_id', user.id).single();
      const profileRole = (profile as { role?: string } | null)?.role;
      if (profileRole !== 'admin') { router.replace('/'); return; }
      setAdminId(user.id);
      await loadData();
      setLoading(false);
    }
    init();
  }, []);

  async function loadData() {
    const [{ data: accounts }, { data: ledger }] = await Promise.all([
      supabase
        .from('credit_accounts')
        .select('id, business_id, credit_limit, terms_days, status, business:business_id(name, contact_email)')
        .order('created_at', { ascending: false }),
      supabase
        .from('credit_ledger')
        .select('business_id, amount'),
    ]);

    const ledgerData = (ledger ?? []) as LedgerEntry[];
    const balanceMap: Record<string, number> = {};
    for (const entry of ledgerData) {
      balanceMap[entry.business_id] = (balanceMap[entry.business_id] ?? 0) + entry.amount;
    }

    const combined: CreditRow[] = ((accounts ?? []) as unknown as CreditAccount[]).map((acc) => {
      const outstanding = Math.max(0, balanceMap[acc.business_id] ?? 0);
      const business = Array.isArray(acc.business) ? acc.business[0] : acc.business;
      return {
        ...acc,
        business,
        outstanding,
        available: Math.max(0, acc.credit_limit - outstanding),
      };
    });

    setRows(combined);
  }

  async function saveCreditLimit(account: CreditRow) {
    const val = parseFloat(editLimit[account.id]);
    if (isNaN(val) || val < 0) { showToast('Invalid credit limit', 'error'); return; }
    setSaving((s) => ({ ...s, [`limit_${account.id}`]: true }));
    const { error } = await supabase.from('credit_accounts').update({ credit_limit: val }).eq('id', account.id);
    if (error) { showToast('Failed to update limit', 'error'); }
    else {
      setRows((prev) => prev.map((r) => r.id === account.id ? { ...r, credit_limit: val, available: Math.max(0, val - r.outstanding) } : r));
      setEditLimit((e) => { const n = { ...e }; delete n[account.id]; return n; });
      showToast('Credit limit updated', 'success');
      flashSuccess(account.id);
    }
    setSaving((s) => ({ ...s, [`limit_${account.id}`]: false }));
  }

  async function saveTerms(account: CreditRow) {
    const val = parseInt(editTerms[account.id]);
    if (isNaN(val)) { showToast('Invalid terms', 'error'); return; }
    setSaving((s) => ({ ...s, [`terms_${account.id}`]: true }));
    const { error } = await supabase.from('credit_accounts').update({ terms_days: val }).eq('id', account.id);
    if (error) { showToast('Failed to update terms', 'error'); }
    else {
      setRows((prev) => prev.map((r) => r.id === account.id ? { ...r, terms_days: val } : r));
      setEditTerms((e) => { const n = { ...e }; delete n[account.id]; return n; });
      showToast('Terms updated', 'success');
      flashSuccess(account.id);
    }
    setSaving((s) => ({ ...s, [`terms_${account.id}`]: false }));
  }

  async function toggleStatus(account: CreditRow) {
    const newStatus = account.status === 'active' ? 'suspended' : 'active';
    setSaving((s) => ({ ...s, [`status_${account.id}`]: true }));
    const { error } = await supabase.from('credit_accounts').update({ status: newStatus }).eq('id', account.id);
    if (error) { showToast('Failed to update status', 'error'); }
    else {
      setRows((prev) => prev.map((r) => r.id === account.id ? { ...r, status: newStatus } : r));
      showToast(`Account ${newStatus === 'active' ? 'activated' : 'suspended'}`, 'success');
      flashSuccess(account.id);
    }
    setSaving((s) => ({ ...s, [`status_${account.id}`]: false }));
  }

  const fmt = (v: number) => `AED ${v.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const totalExposure = rows.reduce((s, r) => s + r.credit_limit, 0);
  const totalOutstanding = rows.reduce((s, r) => s + r.outstanding, 0);
  const overdueCount = rows.filter((r) => r.outstanding > r.credit_limit && r.status === 'active').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-7 h-7 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--color-imperial)', borderTopColor: 'transparent' }} />
      </div>
    );
  }

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
      {adjustModal && (
        <AdjustmentModal
          businessId={adjustModal.businessId}
          businessName={adjustModal.businessName}
          adminId={adminId}
          onClose={() => setAdjustModal(null)}
          onSuccess={loadData}
          showToast={showToast}
        />
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-800">Credit Accounts</h2>
        <p className="text-sm text-stone-500 mt-0.5">Outstanding balances at a glance</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-7">
        <SummaryCard label="Total Credit Exposure" value={fmt(totalExposure)} sub="across all accounts" />
        <SummaryCard label="Total Outstanding" value={fmt(totalOutstanding)} sub="unpaid balance" accent={totalOutstanding > 0} />
        <SummaryCard label="Over-limit Accounts" value={String(overdueCount)} sub="active accounts over limit" accent={overdueCount > 0} />
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-medium text-stone-600">Business</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Credit Limit</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Outstanding</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Available</th>
              <th className="text-center px-4 py-3 font-medium text-stone-600">Terms</th>
              <th className="text-center px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-stone-400">No credit accounts found.</td>
              </tr>
            )}
            {rows.map((row, idx) => (
              <tr
                key={row.id}
                className={[
                  'border-b border-stone-100 transition-colors duration-150',
                  idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60',
                  flashRow === row.id ? 'bg-emerald-50' : '',
                  row.outstanding > row.credit_limit ? 'bg-red-50/40' : '',
                ].join(' ')}
              >
                <td className="px-4 py-3">
                  <div className="font-medium text-stone-800">{(row.business as any)?.name ?? '—'}</div>
                  <div className="text-xs text-stone-400">{(row.business as any)?.contact_email ?? ''}</div>
                </td>

                {/* Credit limit inline edit */}
                <td className="px-4 py-3 text-right">
                  {editLimit[row.id] !== undefined ? (
                    <div className="flex items-center justify-end gap-1">
                      <input
                        type="number"
                        min="0"
                        step="100"
                        value={editLimit[row.id]}
                        onChange={(e) => setEditLimit((l) => ({ ...l, [row.id]: e.target.value }))}
                        className="w-24 border border-stone-300 rounded px-2 py-1 text-xs text-right focus:outline-none focus:ring-1 focus:ring-blue-400"
                        autoFocus
                      />
                      <button
                        onClick={() => saveCreditLimit(row)}
                        disabled={saving[`limit_${row.id}`]}
                        className="text-xs px-2 py-1 rounded bg-stone-800 text-white disabled:opacity-50"
                      >
                        {saving[`limit_${row.id}`] ? '…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditLimit((e) => { const n = { ...e }; delete n[row.id]; return n; })}
                        className="text-xs px-2 py-1 rounded border border-stone-200 text-stone-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-stone-700 hover:underline"
                      onClick={() => setEditLimit((l) => ({ ...l, [row.id]: String(row.credit_limit) }))}
                    >
                      {fmt(row.credit_limit)}
                    </button>
                  )}
                </td>

                <td className={`px-4 py-3 text-right font-medium ${row.outstanding > 0 ? 'text-red-600' : 'text-stone-600'}`}>
                  {fmt(row.outstanding)}
                </td>
                <td className={`px-4 py-3 text-right ${row.available > 0 ? 'text-emerald-600' : 'text-stone-400'}`}>
                  {fmt(row.available)}
                </td>

                {/* Terms inline edit */}
                <td className="px-4 py-3 text-center">
                  {editTerms[row.id] !== undefined ? (
                    <div className="flex items-center justify-center gap-1">
                      <select
                        value={editTerms[row.id]}
                        onChange={(e) => setEditTerms((t) => ({ ...t, [row.id]: e.target.value }))}
                        className="border border-stone-300 rounded px-2 py-1 text-xs focus:outline-none"
                      >
                        {[7, 14, 30, 60, 90].map((d) => (
                          <option key={d} value={d}>{d} days</option>
                        ))}
                      </select>
                      <button
                        onClick={() => saveTerms(row)}
                        disabled={saving[`terms_${row.id}`]}
                        className="text-xs px-2 py-1 rounded bg-stone-800 text-white disabled:opacity-50"
                      >
                        {saving[`terms_${row.id}`] ? '…' : 'Save'}
                      </button>
                      <button
                        onClick={() => setEditTerms((e) => { const n = { ...e }; delete n[row.id]; return n; })}
                        className="text-xs px-2 py-1 rounded border border-stone-200 text-stone-500"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <button
                      className="text-stone-600 hover:underline text-xs"
                      onClick={() => setEditTerms((t) => ({ ...t, [row.id]: String(row.terms_days) }))}
                    >
                      {row.terms_days} days
                    </button>
                  )}
                </td>

                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    row.status === 'active'
                      ? 'bg-emerald-50 border border-emerald-200 text-emerald-700'
                      : 'bg-stone-100 border border-stone-200 text-stone-500'
                  }`}>
                    {row.status === 'active' ? 'Active' : 'Suspended'}
                  </span>
                </td>

                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => toggleStatus(row)}
                      disabled={saving[`status_${row.id}`]}
                      className={`text-xs px-2.5 py-1 rounded border transition-colors disabled:opacity-50 ${
                        row.status === 'active'
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                      }`}
                    >
                      {saving[`status_${row.id}`] ? '…' : row.status === 'active' ? 'Suspend' : 'Activate'}
                    </button>
                    <button
                      onClick={() => setAdjustModal({ businessId: row.business_id, businessName: (row.business as any)?.name ?? row.business_id })}
                      className="text-xs px-2.5 py-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                    >
                      Adjust
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, sub, accent }: { label: string; value: string; sub: string; accent?: boolean }) {
  return (
    <div className={`bg-white rounded-lg border p-4 ${accent ? 'border-red-200' : 'border-stone-200'}`}>
      <p className="text-xs font-medium text-stone-500 mb-1">{label}</p>
      <p className={`text-2xl font-semibold ${accent ? 'text-red-600' : 'text-stone-800'}`}>{value}</p>
      <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
    </div>
  );
}
