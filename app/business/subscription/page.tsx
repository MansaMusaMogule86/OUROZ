'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type {
  Business,
  Subscription,
  SubscriptionItem,
  SubscriptionWithItems,
  Cadence,
  SubscriptionStatus,
} from '@/types/business';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-sahara border-t-imperial animate-spin" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="border border-imperial/40 bg-imperial/5 rounded-lg px-4 py-3 text-sm text-imperial">
      {message}
    </div>
  );
}

function fmtAED(n: number) {
  return `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
}

function nextRunDate(cadence: Cadence): string {
  const d = new Date();
  if (cadence === 'weekly') d.setDate(d.getDate() + 7);
  else if (cadence === 'biweekly') d.setDate(d.getDate() + 14);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

const STATUS_COLORS: Record<SubscriptionStatus, string> = {
  active:    'bg-zellige/10 text-zellige',
  paused:    'bg-amber-100 text-amber-800',
  cancelled: 'bg-charcoal/10 text-charcoal/60',
};

function StatusPill({ status }: { status: SubscriptionStatus }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[status]}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function cadenceLabel(c: Cadence) {
  const map: Record<Cadence, string> = { weekly: 'Weekly', biweekly: 'Bi-weekly', monthly: 'Monthly' };
  return map[c];
}

// ---------------------------------------------------------------------------
// Toast (inline)
// ---------------------------------------------------------------------------

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-charcoal text-white text-sm font-medium px-5 py-3 rounded-xl shadow-lg flex items-center gap-3">
      {message}
      <button onClick={onClose} className="ml-2 text-white/60 hover:text-white">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

// ---------------------------------------------------------------------------
// New subscription form state
// ---------------------------------------------------------------------------

interface NewSubForm {
  name: string;
  cadence: Cadence;
  payment_method: 'bank_transfer' | 'invoice';
  on_partial: 'partial' | 'fail' | 'skip';
  items: NewSubItem[];
}

interface NewSubItem {
  variant_id: string;
  product_name: string;
  sku: string;
  qty: number;
  agreed_price: number | null;
}

const EMPTY_FORM: NewSubForm = {
  name: '',
  cadence: 'monthly',
  payment_method: 'bank_transfer',
  on_partial: 'partial',
  items: [],
};

interface ProductVariantSearch {
  id: string;
  sku: string;
  weight_label: string | null;
  retail_price: number;
  product: { id: string; name: string } | Array<{ id: string; name: string }>;
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BusinessSubscriptionPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [subscriptions, setSubscriptions] = useState<SubscriptionWithItems[]>([]);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [runConfirmId, setRunConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // sub id being mutated

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);

        const { data: biz, error: bizErr } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_user_id', user.id)
          .maybeSingle();

        if (bizErr) throw bizErr;
        if (!biz || (biz as Business).status !== 'approved') {
          setBusiness(biz as Business | null);
          setLoading(false);
          return;
        }

        setBusiness(biz as Business);
        await loadSubscriptions((biz as Business).id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscriptions.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function loadSubscriptions(businessId: string) {
    const { data, error: subErr } = await supabase
      .from('subscriptions')
      .select(`
        *,
        subscription_items (
          *,
          variant:variant_id (
            id, sku, weight_label,
            retail_price, stock_quantity,
            product:product_id ( id, name, image_urls )
          )
        )
      `)
      .eq('business_id', businessId)
      .order('created_at', { ascending: false });

    if (subErr) throw subErr;
    setSubscriptions((data ?? []) as SubscriptionWithItems[]);
  }

  // ---------------------------------------------------------------------------
  // Status actions
  // ---------------------------------------------------------------------------

  async function updateStatus(subId: string, status: SubscriptionStatus) {
    if (!business) return;
    setActionLoading(subId);
    try {
      const updates: Record<string, unknown> = { status };
      if (status === 'active') {
        const sub = subscriptions.find(s => s.id === subId);
        if (sub) updates.next_run_at = nextRunDate(sub.cadence);
      }
      if (status === 'paused') {
        updates.next_run_at = null;
      }

      const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subId);

      if (error) throw error;
      await loadSubscriptions(business.id);
      setToast(status === 'active' ? 'Subscription resumed.' : status === 'paused' ? 'Subscription paused.' : 'Subscription cancelled.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Action failed.');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRunNow(subId: string) {
    setRunConfirmId(null);
    setActionLoading(subId);
    // Stub — in production, call subscriptionService.runSubscription
    await new Promise(r => setTimeout(r, 800));
    setActionLoading(null);
    setToast('Run triggered. Order will be created shortly.');
  }

  // ---------------------------------------------------------------------------
  // Create subscription
  // ---------------------------------------------------------------------------

  async function handleCreateSubscription(form: NewSubForm) {
    if (!business || !userId) return;

    const { data: sub, error: subErr } = await supabase
      .from('subscriptions')
      .insert({
        business_id:      business.id,
        name:             form.name,
        cadence:          form.cadence,
        payment_method:   form.payment_method,
        on_partial:       form.on_partial,
        status:           'active',
        next_run_at:      nextRunDate(form.cadence),
      })
      .select('id')
      .single();

    if (subErr || !sub) throw new Error(subErr?.message ?? 'Failed to create subscription.');

    if (form.items.length > 0) {
      const items = form.items.map(item => ({
        subscription_id: sub.id,
        variant_id:      item.variant_id,
        qty:             item.qty,
        agreed_price:    item.agreed_price,
      }));
      const { error: itemsErr } = await supabase.from('subscription_items').insert(items);
      if (itemsErr) throw new Error(itemsErr.message);
    }

    await loadSubscriptions(business.id);
    setShowCreateModal(false);
    setToast('Subscription created.');
  }

  // ---------------------------------------------------------------------------
  // Guard states
  // ---------------------------------------------------------------------------

  if (loading) return <Spinner />;

  if (!userId) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Sign in required</h2>
          <p className="text-charcoal/60 text-sm mb-6">Sign in to manage subscriptions.</p>
          <Link href="/auth/login?return=/business/subscription" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (!business || business.status !== 'approved') {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Approved business required</h2>
          <p className="text-charcoal/60 text-sm mb-6">Subscriptions are available to approved business accounts.</p>
          <Link href="/business/dashboard" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Main view
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-sahara">
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-imperial uppercase tracking-widest mb-1">{business.name}</p>
            <h1 className="text-2xl font-serif font-semibold text-charcoal">Subscriptions</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/business/dashboard" className="text-sm font-semibold text-charcoal/60 hover:text-charcoal transition">
              &larr; Dashboard
            </Link>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-imperial text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-imperial/90 transition"
            >
              New Subscription
            </button>
          </div>
        </div>

        {error && <div className="mb-6"><ErrorBox message={error} /></div>}

        {/* Subscription list */}
        {subscriptions.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 py-16 text-center">
            <p className="text-charcoal/50 text-sm mb-4">No subscriptions yet.</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
            >
              Create Your First Subscription
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {subscriptions.map(sub => (
              <SubscriptionCard
                key={sub.id}
                subscription={sub}
                loading={actionLoading === sub.id}
                editing={editingId === sub.id}
                onToggleEdit={() => setEditingId(prev => prev === sub.id ? null : sub.id)}
                onPause={() => updateStatus(sub.id, 'paused')}
                onResume={() => updateStatus(sub.id, 'active')}
                onCancel={() => updateStatus(sub.id, 'cancelled')}
                onRunNow={() => setRunConfirmId(sub.id)}
                onEditSave={async (updates) => {
                  if (!business) return;
                  setActionLoading(sub.id);
                  try {
                    const { error } = await supabase.from('subscriptions').update(updates).eq('id', sub.id);
                    if (error) throw error;
                    await loadSubscriptions(business.id);
                    setEditingId(null);
                    setToast('Subscription updated.');
                  } catch (err) {
                    setError(err instanceof Error ? err.message : 'Update failed.');
                  } finally {
                    setActionLoading(null);
                  }
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Run confirm dialog */}
      {runConfirmId && (
        <ConfirmDialog
          message="This will trigger an immediate subscription run and create an order. Continue?"
          onConfirm={() => handleRunNow(runConfirmId)}
          onCancel={() => setRunConfirmId(null)}
        />
      )}

      {/* Create modal */}
      {showCreateModal && (
        <CreateSubscriptionModal
          businessId={business.id}
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSubscription}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </main>
  );
}

// ---------------------------------------------------------------------------
// Subscription card
// ---------------------------------------------------------------------------

function SubscriptionCard({
  subscription: sub,
  loading,
  editing,
  onToggleEdit,
  onPause,
  onResume,
  onCancel,
  onRunNow,
  onEditSave,
}: {
  subscription: SubscriptionWithItems;
  loading: boolean;
  editing: boolean;
  onToggleEdit: () => void;
  onPause: () => void;
  onResume: () => void;
  onCancel: () => void;
  onRunNow: () => void;
  onEditSave: (updates: Partial<Subscription>) => Promise<void>;
}) {
  const itemCount = sub.items?.length ?? 0;
  const estimatedValue = sub.items?.reduce((sum, item) => {
    const price = item.agreed_price ?? item.variant?.retail_price ?? 0;
    return sum + price * item.qty;
  }, 0) ?? 0;

  const [editName, setEditName] = useState(sub.name);
  const [editCadence, setEditCadence] = useState<Cadence>(sub.cadence);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 overflow-hidden">
      {/* Card header */}
      <div className="px-6 py-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-charcoal">{sub.name}</span>
            <StatusPill status={sub.status} />
            <span className="text-xs text-charcoal/50 bg-sahara/60 px-2 py-1 rounded-full">
              {cadenceLabel(sub.cadence)}
            </span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {loading ? (
              <span className="w-5 h-5 rounded-full border-2 border-sahara border-t-imperial animate-spin" />
            ) : (
              <>
                {sub.status === 'active' && (
                  <>
                    <ActionButton label="Run Now" onClick={onRunNow} variant="ghost" />
                    <ActionButton label="Pause" onClick={onPause} variant="ghost" />
                  </>
                )}
                {sub.status === 'paused' && (
                  <ActionButton label="Resume" onClick={onResume} variant="ghost" />
                )}
                {sub.status !== 'cancelled' && (
                  <>
                    <ActionButton label={editing ? 'Close' : 'Edit'} onClick={onToggleEdit} variant="ghost" />
                    <ActionButton label="Cancel" onClick={onCancel} variant="danger" />
                  </>
                )}
              </>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-5 mt-4 text-sm">
          <div>
            <span className="text-charcoal/50 text-xs">Items</span>
            <p className="font-semibold text-charcoal">{itemCount}</p>
          </div>
          <div>
            <span className="text-charcoal/50 text-xs">Est. Value</span>
            <p className="font-semibold text-charcoal">{fmtAED(estimatedValue)}</p>
          </div>
          <div>
            <span className="text-charcoal/50 text-xs">Payment</span>
            <p className="font-semibold text-charcoal capitalize">{sub.payment_method.replace('_', ' ')}</p>
          </div>
          {sub.next_run_at && (
            <div>
              <span className="text-charcoal/50 text-xs">Next Run</span>
              <p className="font-semibold text-charcoal">{fmtDate(sub.next_run_at)}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items list */}
      {itemCount > 0 && (
        <div className="border-t border-sahara/50 px-6 py-4">
          <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-3">Items</p>
          <div className="space-y-2">
            {sub.items?.map(item => {
              const variant = item.variant;
              const price = item.agreed_price ?? variant?.retail_price ?? 0;
              return (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div>
                    <span className="font-medium text-charcoal">{variant?.product?.name ?? 'Unknown product'}</span>
                    {variant?.weight && (
                      <span className="text-charcoal/50 ml-1.5">{variant.weight}</span>
                    )}
                    <span className="text-xs text-charcoal/40 ml-2 font-mono">{variant?.sku}</span>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-charcoal/60">Qty {item.qty}</span>
                    {item.agreed_price && (
                      <span className="ml-2 text-xs text-zellige font-medium">@ {fmtAED(price)}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Inline edit form */}
      {editing && (
        <div className="border-t border-sahara/50 bg-sahara/10 px-6 py-5">
          <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-4">Edit Subscription</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">Name</label>
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">Cadence</label>
              <select value={editCadence} onChange={e => setEditCadence(e.target.value as Cadence)} className={inputClass}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          </div>
          <button
            onClick={() => onEditSave({ name: editName, cadence: editCadence })}
            className="bg-imperial text-white text-sm font-semibold px-5 py-2 rounded-lg hover:bg-imperial/90 transition"
          >
            Save Changes
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Action button
// ---------------------------------------------------------------------------

function ActionButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: 'ghost' | 'danger';
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
        variant === 'danger'
          ? 'border-imperial/30 text-imperial hover:bg-imperial/10'
          : 'border-charcoal/20 text-charcoal/70 hover:bg-sahara'
      }`}
    >
      {label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Confirm dialog
// ---------------------------------------------------------------------------

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-charcoal/60 p-6">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-8 text-center">
        <p className="text-charcoal font-medium text-sm mb-6">{message}</p>
        <div className="flex gap-3 justify-center">
          <button onClick={onCancel} className="px-5 py-2.5 text-sm font-semibold border border-charcoal/20 text-charcoal/70 rounded-lg hover:bg-sahara transition">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-5 py-2.5 text-sm font-semibold bg-imperial text-white rounded-lg hover:bg-imperial/90 transition">
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Create subscription modal
// ---------------------------------------------------------------------------

function CreateSubscriptionModal({
  businessId,
  onClose,
  onCreate,
}: {
  businessId: string;
  onClose: () => void;
  onCreate: (form: NewSubForm) => Promise<void>;
}) {
  const [form, setForm] = useState<NewSubForm>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Variant search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<ProductVariantSearch[]>([]);
  const [searching, setSearching] = useState(false);

  function setField<K extends keyof NewSubForm>(key: K, value: NewSubForm[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  async function handleVariantSearch(q: string) {
    setSearchQuery(q);
    if (q.length < 2) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const { data } = await supabase
        .from('product_variants')
        .select(`
          id, sku, weight_label, retail_price,
          product:product_id ( id, name )
        `)
        .or(`sku.ilike.%${q}%`)
        .limit(10);

      const normalized = ((data ?? []) as unknown as ProductVariantSearch[]).map((variant) => ({
        ...variant,
        product: Array.isArray(variant.product) ? variant.product[0] : variant.product,
      }));

      setSearchResults(normalized);
    } finally {
      setSearching(false);
    }
  }

  function addItem(variant: ProductVariantSearch) {
    const exists = form.items.find(i => i.variant_id === variant.id);
    if (exists) return;
    const product = Array.isArray(variant.product) ? variant.product[0] : variant.product;
    if (!product) return;
    setForm(prev => ({
      ...prev,
      items: [...prev.items, {
        variant_id:    variant.id,
        product_name:  product.name,
        sku:           variant.sku,
        qty:           1,
        agreed_price:  null,
      }],
    }));
    setSearchQuery('');
    setSearchResults([]);
  }

  function updateItem(variantId: string, field: 'qty' | 'agreed_price', value: number | null) {
    setForm(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.variant_id === variantId ? { ...item, [field]: value } : item
      ),
    }));
  }

  function removeItem(variantId: string) {
    setForm(prev => ({ ...prev, items: prev.items.filter(i => i.variant_id !== variantId) }));
  }

  async function handleSubmit() {
    if (!form.name.trim()) { setFormError('Subscription name is required.'); return; }
    if (form.items.length === 0) { setFormError('Add at least one item.'); return; }
    setSaving(true);
    setFormError(null);
    try {
      await onCreate(form);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Failed to create subscription.');
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-charcoal/60 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-sahara/60">
          <h2 className="text-lg font-semibold text-charcoal">New Subscription</h2>
          <button onClick={onClose} className="text-charcoal/40 hover:text-charcoal transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Modal body */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
          {formError && <ErrorBox message={formError} />}

          {/* Basic info */}
          <FormField label="Subscription Name" required>
            <input type="text" value={form.name} onChange={e => setField('name', e.target.value)} placeholder="e.g. Weekly Produce Order" className={inputClass} />
          </FormField>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Cadence">
              <select value={form.cadence} onChange={e => setField('cadence', e.target.value as Cadence)} className={inputClass}>
                <option value="weekly">Weekly</option>
                <option value="biweekly">Bi-weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </FormField>
            <FormField label="Payment Method">
              <select value={form.payment_method} onChange={e => setField('payment_method', e.target.value as 'bank_transfer' | 'invoice')} className={inputClass}>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="invoice">Invoice</option>
              </select>
            </FormField>
            <FormField label="On Partial Stock">
              <select value={form.on_partial} onChange={e => setField('on_partial', e.target.value as 'partial' | 'fail' | 'skip')} className={inputClass}>
                <option value="partial">Partial Order</option>
                <option value="fail">Fail Run</option>
                <option value="skip">Skip Items</option>
              </select>
            </FormField>
          </div>

          {/* Items section */}
          <div>
            <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-2">
              Items
            </label>

            {/* Search */}
            <div className="relative mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={e => handleVariantSearch(e.target.value)}
                placeholder="Search by SKU or product name..."
                className={inputClass}
              />
              {searching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <span className="w-4 h-4 rounded-full border-2 border-sahara border-t-imperial animate-spin block" />
                </div>
              )}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-charcoal/15 rounded-xl shadow-lg z-10 overflow-hidden">
                  {searchResults.map(v => (
                    <button
                      key={v.id}
                      onClick={() => addItem(v)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-sahara/60 transition text-sm text-left border-b border-sahara/40 last:border-0"
                    >
                      <div>
                        <span className="font-medium text-charcoal">{(Array.isArray(v.product) ? v.product[0]?.name : v.product?.name) ?? 'Unknown product'}</span>
                        {v.weight_label && <span className="text-charcoal/50 ml-2">{v.weight_label}</span>}
                        <span className="ml-2 font-mono text-xs text-charcoal/40">{v.sku}</span>
                      </div>
                      <span className="text-charcoal/60 shrink-0">{fmtAED(v.retail_price)}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Items table */}
            {form.items.length > 0 ? (
              <div className="border border-sahara/60 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-sahara/30 border-b border-sahara/60">
                    <tr>
                      <th className="text-left px-4 py-2.5 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Product</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-charcoal/60 uppercase tracking-wide w-24">Qty</th>
                      <th className="text-right px-4 py-2.5 text-xs font-semibold text-charcoal/60 uppercase tracking-wide w-32">Agreed Price</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sahara/40">
                    {form.items.map(item => (
                      <tr key={item.variant_id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-charcoal">{item.product_name}</p>
                          <p className="text-xs font-mono text-charcoal/40">{item.sku}</p>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={1}
                            value={item.qty}
                            onChange={e => updateItem(item.variant_id, 'qty', Math.max(1, parseInt(e.target.value) || 1))}
                            className="w-20 ml-auto block rounded-lg border border-charcoal/15 bg-sahara/30 px-2 py-1.5 text-sm text-right text-charcoal focus:outline-none focus:ring-2 focus:ring-imperial/25"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min={0}
                            step={0.01}
                            placeholder="Default"
                            value={item.agreed_price ?? ''}
                            onChange={e => updateItem(item.variant_id, 'agreed_price', e.target.value ? parseFloat(e.target.value) : null)}
                            className="w-28 ml-auto block rounded-lg border border-charcoal/15 bg-sahara/30 px-2 py-1.5 text-sm text-right text-charcoal focus:outline-none focus:ring-2 focus:ring-imperial/25"
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button onClick={() => removeItem(item.variant_id)} className="text-charcoal/30 hover:text-imperial transition">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-sm text-charcoal/40 border border-dashed border-charcoal/20 rounded-xl py-6 text-center">
                Search above to add products.
              </p>
            )}
          </div>
        </div>

        {/* Modal footer */}
        <div className="px-6 py-4 border-t border-sahara/60 flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 text-sm font-semibold border border-charcoal/20 text-charcoal/70 rounded-lg hover:bg-sahara transition">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold bg-imperial text-white rounded-lg hover:bg-imperial/90 transition disabled:opacity-60 flex items-center gap-2"
          >
            {saving && <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />}
            Create Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-imperial ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full rounded-lg border border-charcoal/15 bg-sahara/30 px-4 py-2.5 text-sm text-charcoal placeholder-charcoal/35 focus:outline-none focus:ring-2 focus:ring-imperial/25 focus:border-imperial/40 transition';
