'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Business, Invoice, InvoiceStatus } from '@/types/business';

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

const STATUS_COLORS: Record<InvoiceStatus, string> = {
  issued:  'bg-amber-100 text-amber-800',
  overdue: 'bg-imperial/10 text-imperial',
  paid:    'bg-zellige/10 text-zellige',
  partial: 'bg-blue-100 text-blue-800',
  void:    'bg-charcoal/10 text-charcoal/60',
};

function StatusPill({ status }: { status: InvoiceStatus }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-100 text-gray-600'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function fmtAED(n: number) {
  return `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type FilterStatus = 'all' | InvoiceStatus;
type SortKey = 'date' | 'due_date' | 'total';

const PAGE_SIZE = 20;

const FILTER_OPTIONS: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'issued', label: 'Issued' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'paid', label: 'Paid' },
  { value: 'partial', label: 'Partial' },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'date', label: 'Date' },
  { value: 'due_date', label: 'Due Date' },
  { value: 'total', label: 'Total' },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BusinessInvoicesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [allInvoices, setAllInvoices] = useState<Invoice[]>([]);

  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

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

        const { data: invData, error: invErr } = await supabase
          .from('invoices')
          .select('*')
          .eq('business_id', (biz as Business).id)
          .order('created_at', { ascending: false });

        if (invErr) throw invErr;
        setAllInvoices((invData ?? []) as Invoice[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load invoices.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------------------------------------------------
  // Derived data
  // -------------------------------------------------------------------------

  const filtered = useMemo(() => {
    let result = filterStatus === 'all'
      ? allInvoices
      : allInvoices.filter(inv => inv.status === filterStatus);

    result = [...result].sort((a, b) => {
      if (sortKey === 'date') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortKey === 'due_date') return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      if (sortKey === 'total') return b.total - a.total;
      return 0;
    });

    return result;
  }, [allInvoices, filterStatus, sortKey]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Summary figures
  const overdueInvoices = allInvoices.filter(inv => inv.status === 'overdue');
  const totalOutstanding = allInvoices
    .filter(inv => ['issued', 'overdue', 'partial'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.total - inv.amount_paid), 0);

  function handleFilterChange(val: FilterStatus) {
    setFilterStatus(val);
    setPage(1);
    setExpandedId(null);
  }

  function handleSortChange(val: SortKey) {
    setSortKey(val);
    setPage(1);
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  // -------------------------------------------------------------------------
  // Guard states
  // -------------------------------------------------------------------------

  if (loading) return <Spinner />;

  if (!userId) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Sign in required</h2>
          <p className="text-charcoal/60 text-sm mb-6">Sign in to view your invoices.</p>
          <Link href="/auth/login?return=/business/invoices" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
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
          <h2 className="text-xl font-semibold text-charcoal mb-2">No approved business account</h2>
          <p className="text-charcoal/60 text-sm mb-6">
            {business ? `Your application is ${business.status}.` : 'Apply to access invoices.'}
          </p>
          <Link href="/business/dashboard" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Full invoices view
  // -------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-sahara">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <p className="text-xs font-semibold text-imperial uppercase tracking-widest mb-1">
              {business.name}
            </p>
            <h1 className="text-2xl font-serif font-semibold text-charcoal">Invoices</h1>
          </div>
          <Link
            href="/business/dashboard"
            className="text-sm font-semibold text-charcoal/60 hover:text-charcoal transition"
          >
            &larr; Dashboard
          </Link>
        </div>

        {error && <div className="mb-6"><ErrorBox message={error} /></div>}

        {/* Summary banner */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <SummaryCard label="Total Invoices" value={String(allInvoices.length)} />
          <SummaryCard label="Outstanding" value={fmtAED(totalOutstanding)} alert={totalOutstanding > 0} />
          <SummaryCard label="Overdue" value={String(overdueInvoices.length)} alert={overdueInvoices.length > 0} />
        </div>

        {/* Filters & sort */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          {/* Status filter pills */}
          <div className="flex flex-wrap gap-2">
            {FILTER_OPTIONS.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleFilterChange(opt.value)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition ${
                  filterStatus === opt.value
                    ? 'bg-imperial text-white'
                    : 'bg-white border border-charcoal/15 text-charcoal/70 hover:border-imperial/40'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="sm:ml-auto flex items-center gap-2">
            <span className="text-xs text-charcoal/50">Sort by</span>
            <select
              value={sortKey}
              onChange={e => handleSortChange(e.target.value as SortKey)}
              className="text-xs border border-charcoal/15 bg-white rounded-lg px-3 py-1.5 text-charcoal focus:outline-none focus:ring-2 focus:ring-imperial/25"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Invoice table */}
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 overflow-hidden">
          {paginated.length === 0 ? (
            <div className="py-16 text-center text-charcoal/50 text-sm">
              No invoices match this filter.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-sahara/60 bg-sahara/30">
                    <th className="text-left px-6 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Invoice</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Due</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Total</th>
                    <th className="text-right px-4 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Paid</th>
                    <th className="text-center px-6 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(inv => (
                    <InvoiceRow
                      key={inv.id}
                      invoice={inv}
                      businessAddress={business.address}
                      expanded={expandedId === inv.id}
                      onToggle={() => toggleExpand(inv.id)}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            <button
              disabled={page === 1}
              onClick={() => setPage(p => p - 1)}
              className="text-sm px-4 py-2 rounded-lg border border-charcoal/15 text-charcoal/70 hover:bg-sahara transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-charcoal/60">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(p => p + 1)}
              className="text-sm px-4 py-2 rounded-lg border border-charcoal/15 text-charcoal/70 hover:bg-sahara transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Invoice row with inline expansion
// ---------------------------------------------------------------------------

function InvoiceRow({
  invoice,
  businessAddress,
  expanded,
  onToggle,
}: {
  invoice: Invoice;
  businessAddress: string | null;
  expanded: boolean;
  onToggle: () => void;
}) {
  const balance = invoice.total - invoice.amount_paid;
  const isOverdueDate = !['paid', 'void'].includes(invoice.status) && new Date(invoice.due_date) < new Date();

  return (
    <>
      <tr
        onClick={onToggle}
        className={`border-b border-sahara/40 cursor-pointer transition ${expanded ? 'bg-sahara/30' : 'hover:bg-sahara/20'}`}
      >
        <td className="px-6 py-3.5 font-mono font-medium text-charcoal text-sm">
          {invoice.invoice_number}
        </td>
        <td className="px-4 py-3.5 text-charcoal/70 text-sm whitespace-nowrap">
          {fmtDate(invoice.created_at)}
        </td>
        <td className={`px-4 py-3.5 text-sm whitespace-nowrap ${isOverdueDate ? 'text-imperial font-medium' : 'text-charcoal/70'}`}>
          {fmtDate(invoice.due_date)}
        </td>
        <td className="px-4 py-3.5 text-right font-semibold text-charcoal text-sm">
          {fmtAED(invoice.total)}
        </td>
        <td className="px-4 py-3.5 text-right text-charcoal/70 text-sm">
          {fmtAED(invoice.amount_paid)}
        </td>
        <td className="px-6 py-3.5 text-center">
          <StatusPill status={invoice.status} />
        </td>
        <td className="px-4 py-3.5 text-right">
          <ChevronIcon open={expanded} />
        </td>
      </tr>

      {expanded && (
        <tr className="bg-sahara/10">
          <td colSpan={7} className="px-6 py-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Details */}
              <div className="space-y-3 text-sm">
                <h4 className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2">Invoice Details</h4>
                <DetailRow label="Invoice Number" value={invoice.invoice_number} mono />
                <DetailRow label="Date Issued" value={fmtDate(invoice.created_at)} />
                <DetailRow label="Due Date" value={fmtDate(invoice.due_date)} />
                <DetailRow label="Subtotal" value={fmtAED(invoice.subtotal)} />
                <DetailRow label="VAT (5%)" value={fmtAED(invoice.tax_amount)} />
                <DetailRow label="Total" value={fmtAED(invoice.total)} bold />
                <DetailRow label="Amount Paid" value={fmtAED(invoice.amount_paid)} />
                {balance > 0.01 && (
                  <DetailRow label="Balance Due" value={fmtAED(balance)} alert />
                )}
              </div>

              {/* Address & notes */}
              <div className="space-y-3 text-sm">
                <h4 className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-2">Billing Address</h4>
                <p className="text-charcoal/70 leading-relaxed">
                  {businessAddress ?? 'No address on file.'}
                </p>

                {invoice.notes && (
                  <>
                    <h4 className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mt-4 mb-2">Notes</h4>
                    <p className="text-charcoal/70 leading-relaxed">{invoice.notes}</p>
                  </>
                )}
              </div>
            </div>

            {/* Download stub */}
            <div className="mt-5 pt-4 border-t border-sahara/60">
              <button
                onClick={e => { e.stopPropagation(); alert(`PDF download for ${invoice.invoice_number} — coming soon.`); }}
                className="text-xs font-semibold border border-charcoal/20 text-charcoal/70 px-4 py-2 rounded-lg hover:bg-sahara transition"
              >
                Download PDF (coming soon)
              </button>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Detail row
// ---------------------------------------------------------------------------

function DetailRow({
  label,
  value,
  mono,
  bold,
  alert,
}: {
  label: string;
  value: string;
  mono?: boolean;
  bold?: boolean;
  alert?: boolean;
}) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-charcoal/55">{label}</span>
      <span className={`${mono ? 'font-mono' : ''} ${bold ? 'font-semibold text-charcoal' : ''} ${alert ? 'font-semibold text-imperial' : 'text-charcoal'}`}>
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary card
// ---------------------------------------------------------------------------

function SummaryCard({ label, value, alert }: { label: string; value: string; alert?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-sahara/60 shadow-sm px-5 py-4">
      <p className="text-xs text-charcoal/50 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-lg font-semibold ${alert ? 'text-imperial' : 'text-charcoal'}`}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Chevron icon
// ---------------------------------------------------------------------------

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      className={`w-4 h-4 text-charcoal/40 transition-transform ${open ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );
}
