'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Business, CreditAccount, Invoice } from '@/types/business';

// ---------------------------------------------------------------------------
// Helpers / shared UI
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

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    issued: 'bg-amber-100 text-amber-800',
    overdue: 'bg-imperial/10 text-imperial',
    paid: 'bg-zellige/10 text-zellige',
    partial: 'bg-blue-100 text-blue-800',
    void: 'bg-charcoal/10 text-charcoal/60',
    active: 'bg-zellige/10 text-zellige',
    suspended: 'bg-imperial/10 text-imperial',
    approved: 'bg-zellige/10 text-zellige',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-600'}`}>
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
// Page
// ---------------------------------------------------------------------------

export default function BusinessDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [creditAccount, setCreditAccount] = useState<CreditAccount | null>(null);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [outstandingBalance, setOutstandingBalance] = useState(0);
  const [availableCredit, setAvailableCredit] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }
        setUserId(user.id);

        // Fetch business
        const { data: biz, error: bizErr } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_user_id', user.id)
          .maybeSingle();

        if (bizErr) throw bizErr;
        if (!biz) { setLoading(false); return; }

        const typedBiz = biz as Business;
        setBusiness(typedBiz);

        if (typedBiz.status !== 'approved') { setLoading(false); return; }

        // Parallel fetches for approved business
        const [creditRes, invoicesRes, outstandingRes, availableRes] = await Promise.all([
          supabase.from('credit_accounts').select('*').eq('business_id', typedBiz.id).maybeSingle(),
          supabase.from('invoices').select('*').eq('business_id', typedBiz.id).order('created_at', { ascending: false }).limit(5),
          supabase.rpc('get_outstanding_balance', { p_business_id: typedBiz.id }),
          supabase.rpc('get_available_credit', { p_business_id: typedBiz.id }),
        ]);

        if (creditRes.data) setCreditAccount(creditRes.data as CreditAccount);
        if (invoicesRes.data) setInvoices(invoicesRes.data as Invoice[]);
        setOutstandingBalance(Number(outstandingRes.data ?? 0));
        setAvailableCredit(Number(availableRes.data ?? 0));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard.');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // -------------------------------------------------------------------------
  // States
  // -------------------------------------------------------------------------

  if (loading) return <Spinner />;

  if (!userId) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Sign in required</h2>
          <p className="text-charcoal/60 text-sm mb-6">Sign in to access your business dashboard.</p>
          <Link
            href="/auth/login?return=/business/dashboard"
            className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (!business) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">No business account</h2>
          <p className="text-charcoal/60 text-sm mb-6">
            Apply for a business account to access wholesale pricing, invoice terms, and subscriptions.
          </p>
          <Link
            href="/business/apply"
            className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Apply Now
          </Link>
        </div>
      </main>
    );
  }

  if (business.status === 'pending') {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-charcoal mb-1">Application under review</h2>
          <p className="text-charcoal/60 text-sm mb-2">
            <span className="font-semibold text-charcoal">{business.name}</span>
          </p>
          <p className="text-charcoal/55 text-sm">
            Our team is reviewing your application. You will receive an update within 1–2 business days.
          </p>
        </div>
      </main>
    );
  }

  if (business.status === 'rejected') {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-imperial/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-imperial" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-charcoal mb-1">Application not approved</h2>
          <p className="text-charcoal/60 text-sm font-medium mb-4">{business.name}</p>
          {business.rejection_reason && (
            <div className="bg-imperial/5 border border-imperial/20 rounded-lg px-4 py-3 mb-5 text-sm text-charcoal/70 text-left">
              <p className="text-xs font-semibold text-imperial uppercase tracking-wide mb-1">Reason</p>
              <p>{business.rejection_reason}</p>
            </div>
          )}
          <p className="text-charcoal/50 text-xs mb-6">
            Please contact support or submit a new application with updated documentation.
          </p>
          <Link
            href="/business/apply"
            className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Submit New Application
          </Link>
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Approved dashboard
  // -------------------------------------------------------------------------

  const isCreditSuspended = creditAccount?.status === 'suspended';
  const hasOverdueInvoices = invoices.some(inv => inv.status === 'overdue');
  const pendingInvoices = invoices.filter(inv => inv.status === 'issued' || inv.status === 'overdue' || inv.status === 'partial');
  const pendingTotal = pendingInvoices.reduce((sum, inv) => sum + (inv.total - inv.amount_paid), 0);

  return (
    <main className="min-h-screen bg-sahara">
      {/* Credit suspended banner */}
      {isCreditSuspended && (
        <div className="bg-imperial text-white text-sm font-medium px-6 py-3 text-center">
          Credit suspended — overdue invoices exist. Please clear outstanding amounts to restore credit.
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-10">

        {error && <div className="mb-6"><ErrorBox message={error} /></div>}

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-serif font-semibold text-charcoal">{business.name}</h1>
              <StatusPill status="approved" />
            </div>
            <p className="text-charcoal/55 text-sm">
              {business.business_type && <span className="capitalize">{business.business_type} · </span>}
              {business.contact_email}
            </p>
          </div>
          {creditAccount && (
            <div className="bg-white border border-sahara/60 rounded-xl px-5 py-3 text-right shadow-sm">
              <p className="text-xs text-charcoal/50 uppercase tracking-wide font-semibold mb-0.5">Available Credit</p>
              <p className="text-xl font-semibold text-zellige">{fmtAED(availableCredit)}</p>
            </div>
          )}
        </div>

        {/* Credit summary */}
        {creditAccount && (
          <CreditSummaryCard
            account={creditAccount}
            outstanding={outstandingBalance}
            available={availableCredit}
          />
        )}

        {/* Quick stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Total Invoices" value={String(invoices.length)} />
          <StatCard label="Pending Amount" value={fmtAED(pendingTotal)} highlight={pendingTotal > 0} />
          <StatCard label="Credit Limit" value={fmtAED(creditAccount?.credit_limit ?? 0)} />
          <StatCard label="Net Terms" value={creditAccount ? `Net ${creditAccount.terms_days}` : '—'} />
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <QuickActionCard
            title="New Order"
            description="Browse and order wholesale products"
            href="/shop?mode=wholesale"
            cta="Go to Shop"
            accent="imperial"
          />
          <QuickActionCard
            title="Subscriptions"
            description="Manage recurring supply orders"
            href="/business/subscription"
            cta="Manage Subscriptions"
            accent="zellige"
          />
          <QuickActionCard
            title="B2B Checkout"
            description="Complete a pending cart with invoice terms"
            href="/business/checkout"
            cta="Go to Checkout"
            accent="gold"
          />
        </div>

        {/* Recent invoices */}
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-sahara/60">
            <h2 className="font-semibold text-charcoal text-base">Recent Invoices</h2>
            <Link href="/business/invoices" className="text-xs font-semibold text-imperial hover:underline">
              View all
            </Link>
          </div>

          {invoices.length === 0 ? (
            <div className="py-12 text-center text-charcoal/50 text-sm">
              No invoices yet. Place your first order to get started.
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
                    <th className="text-center px-6 py-3 text-xs font-semibold text-charcoal/60 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sahara/40">
                  {invoices.map(inv => (
                    <tr key={inv.id} className="hover:bg-sahara/20 transition">
                      <td className="px-6 py-3.5 font-mono font-medium text-charcoal">{inv.invoice_number}</td>
                      <td className="px-4 py-3.5 text-charcoal/70">{fmtDate(inv.created_at)}</td>
                      <td className="px-4 py-3.5 text-charcoal/70">{fmtDate(inv.due_date)}</td>
                      <td className="px-4 py-3.5 text-right font-semibold text-charcoal">{fmtAED(inv.total)}</td>
                      <td className="px-6 py-3.5 text-center">
                        <StatusPill status={inv.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Credit summary card
// ---------------------------------------------------------------------------

function CreditSummaryCard({
  account,
  outstanding,
  available,
}: {
  account: CreditAccount;
  outstanding: number;
  available: number;
}) {
  const isSuspended = account.status === 'suspended';

  return (
    <div className={`rounded-2xl border shadow-sm mb-8 overflow-hidden ${isSuspended ? 'border-imperial/40' : 'border-sahara/60'}`}>
      {isSuspended && (
        <div className="bg-imperial/10 border-b border-imperial/20 px-5 py-2.5">
          <p className="text-xs font-semibold text-imperial">
            Credit account suspended{account.suspended_reason ? ` — ${account.suspended_reason}` : ''}
          </p>
        </div>
      )}
      <div className="bg-white px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-charcoal/60 uppercase tracking-wide">Credit Account</h2>
          <StatusPill status={account.status} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          <CreditStat label="Credit Limit" value={fmtAED(account.credit_limit)} />
          <CreditStat label="Outstanding" value={fmtAED(outstanding)} alert={outstanding > 0} />
          <CreditStat label="Available" value={fmtAED(available)} highlight />
          <CreditStat label="Payment Terms" value={`Net ${account.terms_days}`} />
        </div>
      </div>
    </div>
  );
}

function CreditStat({
  label,
  value,
  highlight,
  alert,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  alert?: boolean;
}) {
  return (
    <div>
      <p className="text-xs text-charcoal/50 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-lg font-semibold ${alert ? 'text-imperial' : highlight ? 'text-zellige' : 'text-charcoal'}`}>
        {value}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Stat card
// ---------------------------------------------------------------------------

function StatCard({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="bg-white rounded-xl border border-sahara/60 shadow-sm px-4 py-4">
      <p className="text-xs text-charcoal/50 uppercase tracking-wide font-semibold mb-1">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? 'text-imperial' : 'text-charcoal'}`}>{value}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Quick action card
// ---------------------------------------------------------------------------

function QuickActionCard({
  title,
  description,
  href,
  cta,
  accent,
}: {
  title: string;
  description: string;
  href: string;
  cta: string;
  accent: 'imperial' | 'zellige' | 'gold';
}) {
  const accentMap = {
    imperial: 'bg-imperial text-white hover:bg-imperial/90',
    zellige: 'bg-zellige text-white hover:bg-zellige/90',
    gold: 'bg-gold text-charcoal hover:bg-gold/90',
  };

  return (
    <div className="bg-white rounded-2xl border border-sahara/60 shadow-sm px-5 py-5 flex flex-col gap-4">
      <div>
        <h3 className="font-semibold text-charcoal mb-1">{title}</h3>
        <p className="text-xs text-charcoal/55">{description}</p>
      </div>
      <Link
        href={href}
        className={`inline-block text-center text-sm font-semibold px-4 py-2.5 rounded-lg transition ${accentMap[accent]}`}
      >
        {cta}
      </Link>
    </div>
  );
}
