'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import {
  approveSupplier,
  approveSupplierProduct,
  fetchPendingSupplierProducts,
} from '@/services/supplierService';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SupplierRow {
  id: string;
  display_name: string;
  legal_name: string | null;
  contact_email: string;
  status: 'pending' | 'approved' | 'suspended';
  country_of_origin: string | null;
  created_at: string;
}

interface PendingProduct {
  id: string;
  supplier_id: string;
  product: {
    id: string;
    name: string;
    base_price: number;
    category: { name: string } | null;
    brand: { name: string } | null;
  };
  submitted_at: string;
  commission_pct: number;
  status: string;
}

type ActiveTab = 'suppliers' | 'products';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending:   'bg-amber-100 text-amber-800',
    approved:  'bg-emerald-100 text-emerald-800',
    suspended: 'bg-red-100 text-red-800',
    rejected:  'bg-stone-100 text-stone-600',
    under_review: 'bg-blue-100 text-blue-800',
    draft:     'bg-stone-100 text-stone-500',
    active:    'bg-emerald-100 text-emerald-800',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function AdminSuppliersPage() {
  const [tab, setTab]                     = useState<ActiveTab>('suppliers');
  const [suppliers, setSuppliers]         = useState<SupplierRow[]>([]);
  const [pendingProducts, setPending]     = useState<PendingProduct[]>([]);
  const [loading, setLoading]             = useState(true);
  const [approving, setApproving]         = useState<Record<string, boolean>>({});
  const [rejecting, setRejecting]         = useState<Record<string, boolean>>({});
  const [rejectNote, setRejectNote]       = useState<Record<string, string>>({});
  const [commissionEdit, setCommission]   = useState<Record<string, number>>({});

  // -------------------------------------------------------------------------
  // Load
  // -------------------------------------------------------------------------

  const loadSuppliers = useCallback(async () => {
    const { data } = await supabase
      .from('suppliers')
      .select('id, display_name, legal_name, contact_email, status, country_of_origin, created_at')
      .order('created_at', { ascending: false });
    setSuppliers((data as SupplierRow[]) ?? []);
  }, []);

  const loadPending = useCallback(async () => {
    const items = await fetchPendingSupplierProducts();
    setPending(items as unknown as PendingProduct[]);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    await Promise.all([loadSuppliers(), loadPending()]);
    setLoading(false);
  }, [loadSuppliers, loadPending]);

  useEffect(() => { load(); }, [load]);

  // -------------------------------------------------------------------------
  // Supplier actions
  // -------------------------------------------------------------------------

  async function handleApproveSupplier(supplierId: string, defaultCommission = 10) {
    setApproving(prev => ({ ...prev, [supplierId]: true }));
    const { data: { user } } = await supabase.auth.getUser();
    const res = await approveSupplier(supplierId, user?.id ?? 'admin', defaultCommission);
    if (!res.ok) alert(`Failed: ${res.error}`);
    await loadSuppliers();
    setApproving(prev => ({ ...prev, [supplierId]: false }));
  }

  async function handleSuspendSupplier(supplierId: string) {
    if (!confirm('Suspend this supplier? Their products will be deactivated.')) return;
    const { error } = await supabase
      .from('suppliers')
      .update({ status: 'suspended' })
      .eq('id', supplierId);
    if (error) alert(error.message);
    await loadSuppliers();
  }

  // -------------------------------------------------------------------------
  // Product actions
  // -------------------------------------------------------------------------

  async function handleApproveProduct(sp: PendingProduct) {
    setApproving(prev => ({ ...prev, [sp.id]: true }));
    const { data: { user } } = await supabase.auth.getUser();
    const pct = commissionEdit[sp.id] ?? sp.commission_pct;

    // Persist commission rate update before approving (if changed)
    if (pct !== sp.commission_pct) {
      await supabase
        .from('supplier_products')
        .update({ commission_pct: pct })
        .eq('id', sp.id);
    }

    const res = await approveSupplierProduct(sp.id, user?.id ?? 'admin');
    if (!res.ok) alert(`Failed: ${res.error}`);
    await loadPending();
    setApproving(prev => ({ ...prev, [sp.id]: false }));
  }

  async function handleRejectProduct(sp: PendingProduct) {
    const reason = rejectNote[sp.id]?.trim();
    if (!reason) { alert('Enter a rejection reason before rejecting.'); return; }
    setRejecting(prev => ({ ...prev, [sp.id]: true }));
    const { error } = await supabase
      .from('supplier_products')
      .update({ status: 'rejected', rejection_reason: reason })
      .eq('id', sp.id);
    if (error) alert(error.message);
    await loadPending();
    setRejecting(prev => ({ ...prev, [sp.id]: false }));
  }

  // -------------------------------------------------------------------------
  // Counts
  // -------------------------------------------------------------------------

  const pendingSuppliers  = suppliers.filter(s => s.status === 'pending').length;
  const approvedSuppliers = suppliers.filter(s => s.status === 'approved').length;

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Suppliers</h1>
          <p className="text-sm text-stone-500 mt-0.5">Manage supplier applications and product catalogue submissions.</p>
        </div>
        <button
          onClick={load}
          className="text-xs px-3 py-1.5 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 transition"
        >
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-stone-800">{suppliers.length}</p>
          <p className="text-xs text-stone-500 mt-0.5">Total suppliers</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4">
          <p className="text-2xl font-bold text-amber-700">{pendingSuppliers}</p>
          <p className="text-xs text-stone-500 mt-0.5">Pending approval</p>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <p className="text-2xl font-bold text-stone-800">{pendingProducts.length}</p>
          <p className="text-xs text-stone-500 mt-0.5">Products awaiting review</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 bg-stone-100 rounded-lg p-1 w-fit">
        {(['suppliers', 'products'] as ActiveTab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={[
              'px-4 py-1.5 rounded-md text-sm font-medium transition capitalize',
              tab === t ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {t === 'products' ? `Pending Products (${pendingProducts.length})` : `Suppliers (${suppliers.length})`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-sm text-stone-400">
          Loading…
        </div>
      ) : tab === 'suppliers' ? (

        /* ------------------------------------------------------------------ */
        /* Suppliers tab                                                        */
        /* ------------------------------------------------------------------ */
        <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
          {suppliers.length === 0 ? (
            <p className="p-12 text-center text-sm text-stone-400">No suppliers yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Email</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Country</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Status</th>
                  <th className="text-left px-4 py-3 font-semibold text-stone-500 text-xs uppercase tracking-wide">Applied</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {suppliers.map(s => (
                  <tr key={s.id} className="hover:bg-stone-50/50">
                    <td className="px-4 py-3">
                      <p className="font-medium text-stone-800">{s.display_name}</p>
                      {s.legal_name && <p className="text-xs text-stone-400">{s.legal_name}</p>}
                    </td>
                    <td className="px-4 py-3 text-stone-600">{s.contact_email}</td>
                    <td className="px-4 py-3 text-stone-600">{s.country_of_origin ?? '—'}</td>
                    <td className="px-4 py-3"><StatusPill status={s.status} /></td>
                    <td className="px-4 py-3 text-xs text-stone-400">{fmtDate(s.created_at)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        {s.status === 'pending' && (
                          <button
                            onClick={() => handleApproveSupplier(s.id)}
                            disabled={approving[s.id]}
                            className="text-xs px-2.5 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 transition disabled:opacity-50"
                          >
                            {approving[s.id] ? 'Approving…' : 'Approve'}
                          </button>
                        )}
                        {s.status === 'approved' && (
                          <button
                            onClick={() => handleSuspendSupplier(s.id)}
                            className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition"
                          >
                            Suspend
                          </button>
                        )}
                        {s.status === 'suspended' && (
                          <button
                            onClick={() => handleApproveSupplier(s.id)}
                            disabled={approving[s.id]}
                            className="text-xs px-2.5 py-1 rounded border border-stone-300 text-stone-600 hover:bg-stone-100 transition disabled:opacity-50"
                          >
                            Reinstate
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      ) : (

        /* ------------------------------------------------------------------ */
        /* Pending products tab                                                 */
        /* ------------------------------------------------------------------ */
        <div className="space-y-4">
          {pendingProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-stone-200 p-12 text-center text-sm text-stone-400">
              No products awaiting review.
            </div>
          ) : (
            pendingProducts.map(sp => (
              <div key={sp.id} className="bg-white rounded-xl border border-stone-200 p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-stone-800">{sp.product?.name ?? 'Unnamed product'}</p>
                      <StatusPill status={sp.status} />
                    </div>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-stone-500">
                      {sp.product?.category && <span>Category: {sp.product.category.name}</span>}
                      {sp.product?.brand    && <span>Brand: {sp.product.brand.name}</span>}
                      <span>Base price: AED {sp.product?.base_price?.toFixed(2)}</span>
                      <span>Submitted: {fmtDate(sp.submitted_at)}</span>
                    </div>
                  </div>

                  {/* Commission rate editor */}
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-xs text-stone-500 whitespace-nowrap">Commission %</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={commissionEdit[sp.id] ?? sp.commission_pct}
                      onChange={e =>
                        setCommission(prev => ({ ...prev, [sp.id]: parseFloat(e.target.value) }))
                      }
                      className="w-16 text-center border border-stone-200 rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-stone-300"
                    />
                  </div>
                </div>

                {/* Reject reason input + action buttons */}
                <div className="mt-4 flex items-center gap-3">
                  <input
                    type="text"
                    placeholder="Rejection reason (required to reject)"
                    value={rejectNote[sp.id] ?? ''}
                    onChange={e =>
                      setRejectNote(prev => ({ ...prev, [sp.id]: e.target.value }))
                    }
                    className="flex-1 border border-stone-200 rounded-lg px-3 py-2 text-sm text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-stone-300"
                  />
                  <button
                    onClick={() => handleRejectProduct(sp)}
                    disabled={rejecting[sp.id]}
                    className="px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition disabled:opacity-50"
                  >
                    {rejecting[sp.id] ? 'Rejecting…' : 'Reject'}
                  </button>
                  <button
                    onClick={() => handleApproveProduct(sp)}
                    disabled={approving[sp.id]}
                    className="px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {approving[sp.id] ? 'Approving…' : 'Approve & publish'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
