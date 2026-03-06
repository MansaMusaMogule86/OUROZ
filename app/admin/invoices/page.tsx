'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';

type InvoiceStatus = 'issued' | 'overdue' | 'partial' | 'paid' | 'void';
type FilterTab = 'all' | InvoiceStatus;

interface Invoice {
  id: string;
  invoice_number: string;
  business_id: string;
  total: number;
  amount_paid: number;
  due_date: string;
  status: InvoiceStatus;
  created_at: string;
  business?: { name: string } | Array<{ name: string }>;
}

interface PaymentMethod {
  value: string;
  label: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'card', label: 'Card' },
  { value: 'cash', label: 'Cash' },
  { value: 'cheque', label: 'Cheque' },
];

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

function StatusBadge({ status }: { status: InvoiceStatus }) {
  const map: Record<InvoiceStatus, { bg: string; text: string; label: string }> = {
    issued:  { bg: 'bg-blue-50 border border-blue-200',     text: 'text-blue-700',   label: 'Issued' },
    overdue: { bg: 'bg-red-50 border border-red-200',       text: 'text-red-700',    label: 'Overdue' },
    partial: { bg: 'bg-amber-50 border border-amber-200',   text: 'text-amber-700',  label: 'Partial' },
    paid:    { bg: 'bg-emerald-50 border border-emerald-200', text: 'text-emerald-700', label: 'Paid' },
    void:    { bg: 'bg-stone-100 border border-stone-200',  text: 'text-stone-500',  label: 'Void' },
  };
  const s = map[status] ?? map.issued;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
}

interface MarkPaidModalProps {
  invoice: Invoice;
  onClose: () => void;
  onSuccess: () => void;
  showToast: (msg: string, type: 'error' | 'success') => void;
}

function MarkPaidModal({ invoice, onClose, onSuccess, showToast }: MarkPaidModalProps) {
  const supabase = createClient();
  const outstanding = invoice.total - invoice.amount_paid;
  const [amount, setAmount] = useState(String(outstanding.toFixed(2)));
  const [method, setMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [receivedDate, setReceivedDate] = useState(new Date().toISOString().split('T')[0]);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) { showToast('Enter a valid payment amount', 'error'); return; }

    setSaving(true);
    const { error } = await supabase.from('payments').insert({
      invoice_id: invoice.id,
      business_id: invoice.business_id,
      amount: parsedAmount,
      payment_method: method,
      reference_number: reference.trim() || null,
      received_at: new Date(receivedDate).toISOString(),
    });

    if (error) { showToast('Failed to record payment: ' + error.message, 'error'); setSaving(false); return; }
    showToast('Payment recorded', 'success');
    onSuccess();
    onClose();
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-stone-800 mb-0.5">Record Payment</h3>
        <p className="text-sm text-stone-500 mb-5">
          Invoice #{invoice.invoice_number} — Outstanding: AED {outstanding.toLocaleString('en-AE', { minimumFractionDigits: 2 })}
        </p>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Amount (AED)</label>
            <input
              type="number"
              min="0.01"
              max={outstanding}
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Payment Method</label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m.value} value={m.value}>{m.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Reference Number</label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Optional"
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1">Received Date</label>
            <input
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
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
              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60 transition-opacity"
              style={{ background: 'var(--color-imperial)' }}
            >
              {saving ? 'Recording…' : 'Record payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface NoteModalProps {
  invoiceId: string;
  adminId: string;
  onClose: () => void;
  showToast: (msg: string, type: 'error' | 'success') => void;
}

function NoteModal({ invoiceId, adminId, onClose, showToast }: NoteModalProps) {
  const supabase = createClient();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSaving(true);
    const { error } = await supabase.from('admin_notes').insert({
      entity_id: invoiceId,
      entity_type: 'invoice',
      content: content.trim(),
      created_by: adminId,
    });
    if (error) { showToast('Failed to save note', 'error'); }
    else { showToast('Note saved', 'success'); onClose(); }
    setSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-base font-semibold text-stone-800 mb-4">Add Admin Note</h3>
        <form onSubmit={submit} className="space-y-3">
          <textarea
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Note content…"
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-400"
            autoFocus
          />
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50">Cancel</button>
            <button type="submit" disabled={saving || !content.trim()} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-60" style={{ background: 'var(--color-imperial)' }}>
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function InvoicesPage() {
  const router = useRouter();
  const supabase = createClient();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [adminId, setAdminId] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);
  const [payModal, setPayModal] = useState<Invoice | null>(null);
  const [noteModal, setNoteModal] = useState<string | null>(null);
  const [marking, setMarking] = useState(false);
  const [voidingId, setVoidingId] = useState<string | null>(null);
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
      await loadInvoices();
      setLoading(false);
    }
    init();
  }, []);

  async function loadInvoices() {
    const { data, error } = await supabase
      .from('invoices')
      .select('id, invoice_number, business_id, total, amount_paid, due_date, status, created_at, business:business_id(name)')
      .order('due_date', { ascending: true });

    if (error) { showToast('Failed to load invoices', 'error'); return; }

    const normalized = ((data ?? []) as unknown as Invoice[]).map((invoice) => ({
      ...invoice,
      business: Array.isArray(invoice.business) ? invoice.business[0] : invoice.business,
    }));

    setInvoices(normalized);
  }

  async function markOverdue() {
    setMarking(true);
    const { error } = await supabase.rpc('mark_overdue_invoices');
    if (error) { showToast('Failed to mark overdue invoices: ' + error.message, 'error'); }
    else {
      showToast('Overdue invoices updated', 'success');
      await loadInvoices();
    }
    setMarking(false);
  }

  async function voidInvoice(id: string) {
    if (!confirm('Void this invoice? This cannot be undone.')) return;
    setVoidingId(id);
    const { error } = await supabase.from('invoices').update({ status: 'void' }).eq('id', id);
    if (error) { showToast('Failed to void invoice', 'error'); }
    else {
      setInvoices((prev) => prev.map((inv) => inv.id === id ? { ...inv, status: 'void' as InvoiceStatus } : inv));
      showToast('Invoice voided', 'success');
      flashSuccess(id);
    }
    setVoidingId(null);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isOverdue = (inv: Invoice) => new Date(inv.due_date) < today && inv.status !== 'paid' && inv.status !== 'void';

  const filteredInvoices = filter === 'all'
    ? invoices
    : invoices.filter((inv) => inv.status === filter);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'issued', label: 'Issued' },
    { key: 'overdue', label: 'Overdue' },
    { key: 'partial', label: 'Partial' },
    { key: 'paid', label: 'Paid' },
  ];

  const fmt = (v: number) => `AED ${v.toLocaleString('en-AE', { minimumFractionDigits: 2 })}`;

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
      {payModal && (
        <MarkPaidModal
          invoice={payModal}
          onClose={() => setPayModal(null)}
          onSuccess={loadInvoices}
          showToast={showToast}
        />
      )}
      {noteModal && (
        <NoteModal
          invoiceId={noteModal}
          adminId={adminId}
          onClose={() => setNoteModal(null)}
          showToast={showToast}
        />
      )}

      <div className="mb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-semibold text-stone-800">Invoices</h2>
          <p className="text-sm text-stone-500 mt-0.5">Track and manage all customer invoices</p>
        </div>
        <button
          onClick={markOverdue}
          disabled={marking}
          className="px-4 py-2 rounded-lg text-sm font-medium border border-stone-300 text-stone-700 hover:bg-stone-100 transition-colors disabled:opacity-60"
        >
          {marking ? 'Marking…' : 'Mark overdue invoices'}
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-5 border-b border-stone-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={[
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors duration-150 whitespace-nowrap',
              filter === tab.key
                ? 'border-[var(--color-imperial)] text-stone-800'
                : 'border-transparent text-stone-500 hover:text-stone-700',
            ].join(' ')}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-stone-200 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50">
              <th className="text-left px-4 py-3 font-medium text-stone-600">Invoice #</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600">Business</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Total</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Paid</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Outstanding</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600">Due Date</th>
              <th className="text-left px-4 py-3 font-medium text-stone-600">Status</th>
              <th className="text-right px-4 py-3 font-medium text-stone-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInvoices.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-stone-400">No invoices found.</td>
              </tr>
            )}
            {filteredInvoices.map((inv, idx) => {
              const overdueRow = isOverdue(inv);
              const outstanding = inv.total - inv.amount_paid;
              const actionable = inv.status === 'issued' || inv.status === 'overdue' || inv.status === 'partial';

              return (
                <tr
                  key={inv.id}
                  className={[
                    'border-b border-stone-100 transition-colors duration-150',
                    overdueRow && inv.status !== 'void' ? 'bg-red-50/50' : idx % 2 === 0 ? 'bg-white' : 'bg-stone-50/60',
                    flashRow === inv.id ? 'bg-emerald-50' : '',
                  ].join(' ')}
                >
                  <td className="px-4 py-3 font-mono text-xs text-stone-700">{inv.invoice_number}</td>
                  <td className="px-4 py-3 text-stone-700">{(inv.business as any)?.name ?? '—'}</td>
                  <td className="px-4 py-3 text-right text-stone-700">{fmt(inv.total)}</td>
                  <td className="px-4 py-3 text-right text-emerald-600">{fmt(inv.amount_paid)}</td>
                  <td className={`px-4 py-3 text-right font-medium ${outstanding > 0 ? 'text-red-600' : 'text-stone-400'}`}>
                    {fmt(outstanding)}
                  </td>
                  <td className={`px-4 py-3 ${overdueRow ? 'text-red-600 font-medium' : 'text-stone-600'}`}>
                    {new Date(inv.due_date).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={inv.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                      {actionable && (
                        <button
                          onClick={() => setPayModal(inv)}
                          className="text-xs px-2.5 py-1 rounded text-white transition-opacity"
                          style={{ background: 'var(--color-imperial)' }}
                        >
                          Mark Paid
                        </button>
                      )}
                      {actionable && inv.status !== 'void' && (
                        <button
                          onClick={() => voidInvoice(inv.id)}
                          disabled={voidingId === inv.id}
                          className="text-xs px-2.5 py-1 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
                        >
                          {voidingId === inv.id ? '…' : 'Void'}
                        </button>
                      )}
                      <button
                        onClick={() => setNoteModal(inv.id)}
                        className="text-xs px-2.5 py-1 rounded border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors"
                      >
                        Note
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
