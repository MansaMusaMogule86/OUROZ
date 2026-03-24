'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import OurozHeader from '@/components/shared/OurozHeader';
import OurozBackground from '@/components/shared/OurozBackground';
import { supabase } from '@/lib/supabase';

export default function SupplierRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    nameAr: '',
    nameFr: '',
    description: '',
    city: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError('Please sign in first');
      setLoading(false);
      return;
    }

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const { error: insertError } = await supabase.from('suppliers').insert({
      owner_user_id: user.id,
      name: form.name,
      name_ar: form.nameAr || null,
      name_fr: form.nameFr || null,
      slug,
      description: form.description,
      city: form.city,
      phone: form.phone,
      status: 'pending',
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/supplier/dashboard');
  };

  const inputClasses =
    'w-full px-4 py-3 rounded-xl bg-[var(--color-sahara)]/60 border border-[var(--color-charcoal)]/[0.06] text-[var(--color-charcoal)] text-sm font-body placeholder:text-[var(--color-charcoal)]/25 focus:outline-none focus:border-[var(--color-gold)]/30 focus:ring-1 focus:ring-[var(--color-gold)]/15 transition-all';

  const labelClasses =
    'block text-[10px] font-body font-bold uppercase tracking-[0.2em] text-[var(--color-charcoal)]/50 mb-2';

  return (
    <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
      <OurozBackground showArch showWatermark={false} showDunes />
      <OurozHeader />

      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-72px)] px-4 py-16">
        <div className="w-full max-w-[540px]">
          {/* Heading */}
          <div className="text-center mb-10">
            <p
              className="text-[10px] font-body font-bold uppercase tracking-[0.3em] mb-3"
              style={{ color: 'rgba(212, 175, 55, 0.5)' }}
            >
              SUPPLIER ACCESS
            </p>
            <h1
              className="text-3xl lg:text-4xl font-heading text-[var(--color-charcoal)] mb-2"
              style={{ fontWeight: 300, letterSpacing: '0.04em' }}
            >
              Request Access
            </h1>
            <p className="text-sm text-[var(--color-charcoal)]/35 font-body" style={{ fontWeight: 400 }}>
              Register your business to sell on OUROZ
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl bg-[var(--color-terracotta)]/10 border border-[var(--color-terracotta)]/20 px-4 py-3 text-sm text-[var(--color-terracotta)] font-body">
              {error}
            </div>
          )}

          {/* Form Card */}
          <form
            onSubmit={handleSubmit}
            className="glass-card rounded-2xl lg:rounded-3xl p-6 lg:p-8 space-y-5"
          >
            {/* Business Name (full width) */}
            <div>
              <label className={labelClasses}>Business Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                className={inputClasses}
                placeholder="Your business name"
              />
            </div>

            {/* Arabic / French names (2-col) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Name (Arabic)</label>
                <input
                  value={form.nameAr}
                  onChange={(e) => update('nameAr', e.target.value)}
                  dir="rtl"
                  className={inputClasses}
                  placeholder="الاسم بالعربية"
                />
              </div>
              <div>
                <label className={labelClasses}>Name (French)</label>
                <input
                  value={form.nameFr}
                  onChange={(e) => update('nameFr', e.target.value)}
                  className={inputClasses}
                  placeholder="Nom en français"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClasses}>Description *</label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className={`${inputClasses} resize-none`}
                placeholder="Tell us about your products and business"
              />
            </div>

            {/* City / Phone (2-col) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>City *</label>
                <input
                  required
                  value={form.city}
                  onChange={(e) => update('city', e.target.value)}
                  className={inputClasses}
                  placeholder="e.g. Casablanca"
                />
              </div>
              <div>
                <label className={labelClasses}>Phone *</label>
                <input
                  required
                  value={form.phone}
                  onChange={(e) => update('phone', e.target.value)}
                  className={inputClasses}
                  placeholder="+212..."
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 bg-[var(--color-charcoal)] text-[var(--color-sahara)] rounded-full font-body font-bold text-[10px] uppercase tracking-[0.3em] hover:bg-[var(--color-charcoal)]/85 transition-all duration-500 disabled:opacity-40"
            >
              {loading ? 'Submitting...' : 'Request Access'}
            </button>
          </form>

          {/* Bottom hint */}
          <p className="text-center text-[11px] text-[var(--color-charcoal)]/25 mt-6 font-body">
            Already a supplier?{' '}
            <a
              href="/auth/login"
              className="text-[var(--color-charcoal)]/40 underline underline-offset-2 hover:text-[var(--color-charcoal)]/60 transition-colors"
            >
              Sign in
            </a>
          </p>
        </div>
      </main>
    </div>
  );
}
