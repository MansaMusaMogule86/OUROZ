'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Business } from '@/types/business';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="flex items-center justify-center py-20">
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
    pending: 'bg-amber-100 text-amber-800',
    approved: 'bg-zellige/10 text-zellige',
    rejected: 'bg-imperial/10 text-imperial',
  };
  return (
    <span className={`inline-block text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] ?? 'bg-gray-100 text-gray-700'}`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type StepNum = 1 | 2;

interface FormData {
  name: string;
  legal_name: string;
  business_type: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  license_url: string;
}

const EMPTY_FORM: FormData = {
  name: '',
  legal_name: '',
  business_type: '',
  contact_email: '',
  contact_phone: '',
  address: '',
  license_url: '',
};

const BUSINESS_TYPES = [
  { value: 'restaurant', label: 'Restaurant' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'cafe', label: 'Cafe' },
  { value: 'distributor', label: 'Distributor' },
  { value: 'other', label: 'Other' },
];

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Ras Al Khaimah', 'Fujairah', 'Umm Al Quwain'];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BusinessApplyPage() {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string>('');
  const [existingBusiness, setExistingBusiness] = useState<Business | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [step, setStep] = useState<StepNum>(1);
  const [form, setForm] = useState<FormData>(EMPTY_FORM);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      setUserId(user.id);
      setUserEmail(user.email ?? '');

      // Pre-fill contact email from auth
      setForm(prev => ({ ...prev, contact_email: user.email ?? '' }));

      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_user_id', user.id)
        .maybeSingle();

      if (biz) setExistingBusiness(biz as Business);
      setLoading(false);
    })();
  }, []);

  function set(field: keyof FormData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function validateStep1(): string | null {
    if (!form.name.trim()) return 'Business name is required.';
    if (!form.contact_email.trim()) return 'Contact email is required.';
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(form.contact_email)) return 'Enter a valid email address.';
    return null;
  }

  function handleNextStep() {
    const err = validateStep1();
    if (err) { setError(err); return; }
    setError(null);
    setStep(2);
  }

  async function handleSubmit() {
    if (!userId) return;
    setSubmitting(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('businesses')
      .insert({
        owner_user_id: userId,
        name: form.name.trim(),
        legal_name: form.legal_name.trim() || null,
        business_type: form.business_type || null,
        contact_email: form.contact_email.trim(),
        contact_phone: form.contact_phone.trim() || null,
        address: form.address.trim() || null,
        trade_license_url: form.license_url.trim() || null,
        status: 'pending',
      });

    if (insertError) {
      setError(insertError.message);
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setSubmitting(false);
  }

  // -------------------------------------------------------------------------
  // States
  // -------------------------------------------------------------------------

  if (loading) return <Spinner />;

  if (!userId) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-full bg-imperial/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-6 h-6 text-imperial" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-charcoal mb-2">Sign in to apply</h2>
          <p className="text-charcoal/60 text-sm mb-6">
            Create an account or sign in to submit your business application.
          </p>
          <Link
            href="/auth/login?return=/business/apply"
            className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <div className="w-14 h-14 rounded-full bg-zellige/10 flex items-center justify-center mx-auto mb-5">
            <svg className="w-7 h-7 text-zellige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-charcoal mb-2">Application submitted</h2>
          <p className="text-charcoal/60 text-sm mb-6">
            Your business application is under review. We will contact you at{' '}
            <span className="font-medium text-charcoal">{form.contact_email}</span> within 1–2 business days.
          </p>
          <Link
            href="/business/dashboard"
            className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
    );
  }

  if (existingBusiness) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full">
          <h2 className="text-xl font-semibold text-charcoal mb-1">Business Application</h2>
          <p className="text-charcoal/60 text-sm mb-6">You already have a business registered on OUROZ.</p>

          <div className="bg-sahara/60 rounded-xl p-5 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-charcoal">{existingBusiness.name}</span>
              <StatusPill status={existingBusiness.status} />
            </div>
            {existingBusiness.business_type && (
              <p className="text-sm text-charcoal/60 capitalize">{existingBusiness.business_type}</p>
            )}
            {existingBusiness.status === 'rejected' && existingBusiness.rejection_reason && (
              <div className="mt-4 border-t border-charcoal/10 pt-4">
                <p className="text-xs font-semibold text-imperial uppercase tracking-wide mb-1">Rejection reason</p>
                <p className="text-sm text-charcoal/70">{existingBusiness.rejection_reason}</p>
              </div>
            )}
          </div>

          {existingBusiness.status === 'approved' && (
            <Link
              href="/business/dashboard"
              className="block text-center bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
            >
              Go to Dashboard
            </Link>
          )}
          {existingBusiness.status === 'pending' && (
            <p className="text-center text-sm text-charcoal/60">
              Your application is currently under review.
            </p>
          )}
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Application form
  // -------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-sahara py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-imperial uppercase tracking-widest mb-2">OUROZ Business</p>
          <h1 className="text-3xl font-serif font-semibold text-charcoal">Apply for a Business Account</h1>
          <p className="text-charcoal/60 mt-2 text-sm">
            Access wholesale pricing, invoice terms, and subscription ordering.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-8">
          <StepBubble number={1} label="Business Details" active={step === 1} done={step > 1} />
          <div className="flex-1 h-px bg-charcoal/15" />
          <StepBubble number={2} label="Review & Submit" active={step === 2} done={false} />
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-8">

          {error && <div className="mb-6"><ErrorBox message={error} /></div>}

          {step === 1 && (
            <Step1
              form={form}
              set={set}
              onNext={handleNextStep}
            />
          )}

          {step === 2 && (
            <Step2
              form={form}
              submitting={submitting}
              onBack={() => setStep(1)}
              onSubmit={handleSubmit}
            />
          )}
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Step bubble
// ---------------------------------------------------------------------------

function StepBubble({ number, label, active, done }: {
  number: number;
  label: string;
  active: boolean;
  done: boolean;
}) {
  const bg = done
    ? 'bg-zellige text-white'
    : active
    ? 'bg-imperial text-white'
    : 'bg-charcoal/10 text-charcoal/50';

  return (
    <div className="flex items-center gap-2">
      <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${bg}`}>
        {done ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        ) : number}
      </span>
      <span className={`text-sm font-medium ${active ? 'text-charcoal' : 'text-charcoal/50'}`}>{label}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 1
// ---------------------------------------------------------------------------

function Step1({
  form,
  set,
  onNext,
}: {
  form: FormData;
  set: (field: keyof FormData, value: string) => void;
  onNext: () => void;
}) {
  return (
    <div className="space-y-5">
      <FormField label="Business Name" required>
        <input
          type="text"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Al Baraka Restaurant LLC"
          className={inputClass}
        />
      </FormField>

      <FormField label="Legal / Trade Name">
        <input
          type="text"
          value={form.legal_name}
          onChange={e => set('legal_name', e.target.value)}
          placeholder="As it appears on trade license"
          className={inputClass}
        />
      </FormField>

      <FormField label="Business Type">
        <select
          value={form.business_type}
          onChange={e => set('business_type', e.target.value)}
          className={inputClass}
        >
          <option value="">Select type</option>
          {BUSINESS_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </FormField>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <FormField label="Contact Email" required>
          <input
            type="email"
            value={form.contact_email}
            onChange={e => set('contact_email', e.target.value)}
            placeholder="orders@yourbusiness.com"
            className={inputClass}
          />
        </FormField>

        <FormField label="Contact Phone">
          <input
            type="tel"
            value={form.contact_phone}
            onChange={e => set('contact_phone', e.target.value)}
            placeholder="+971 50 000 0000"
            className={inputClass}
          />
        </FormField>
      </div>

      <FormField label="Business Address">
        <textarea
          value={form.address}
          onChange={e => set('address', e.target.value)}
          placeholder="Street, area, emirate"
          rows={2}
          className={`${inputClass} resize-none`}
        />
      </FormField>

      <FormField label="Trade License">
        <div className="flex items-center gap-3">
          <label className="flex-1 cursor-pointer">
            <span className={`${inputClass} block cursor-pointer text-charcoal/50`}>
              {form.license_url
                ? form.license_url
                : 'Select trade license document'}
            </span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="sr-only"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) set('license_url', file.name);
              }}
            />
          </label>
        </div>
        <p className="text-xs text-charcoal/40 mt-1">PDF, JPG or PNG. Upload will be finalized post-review.</p>
      </FormField>

      <div className="pt-2">
        <button
          onClick={onNext}
          className="w-full bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
        >
          Review Application
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step 2
// ---------------------------------------------------------------------------

function Step2({
  form,
  submitting,
  onBack,
  onSubmit,
}: {
  form: FormData;
  submitting: boolean;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const rows: { label: string; value: string }[] = [
    { label: 'Business Name', value: form.name },
    { label: 'Legal / Trade Name', value: form.legal_name || '—' },
    { label: 'Business Type', value: form.business_type || '—' },
    { label: 'Contact Email', value: form.contact_email },
    { label: 'Contact Phone', value: form.contact_phone || '—' },
    { label: 'Address', value: form.address || '—' },
    { label: 'Trade License', value: form.license_url || '—' },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold text-charcoal mb-5">Review your application</h3>

      <dl className="divide-y divide-charcoal/8">
        {rows.map(row => (
          <div key={row.label} className="flex justify-between py-3 text-sm">
            <dt className="text-charcoal/55 w-40 shrink-0">{row.label}</dt>
            <dd className="text-charcoal font-medium text-right">{row.value}</dd>
          </div>
        ))}
      </dl>

      <p className="text-xs text-charcoal/50 mt-6 mb-6 leading-relaxed">
        By submitting, you confirm that all information is accurate. Your application will be reviewed within 1–2 business days.
        Approved businesses gain access to wholesale pricing, Net payment terms, and subscription ordering.
      </p>

      <div className="flex gap-3">
        <button
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border border-charcoal/20 text-charcoal text-sm font-semibold px-6 py-3 rounded-lg hover:bg-sahara transition"
        >
          Edit Details
        </button>
        <button
          onClick={onSubmit}
          disabled={submitting}
          className="flex-1 bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting && (
            <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          )}
          Submit Application
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared field wrapper
// ---------------------------------------------------------------------------

function FormField({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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
