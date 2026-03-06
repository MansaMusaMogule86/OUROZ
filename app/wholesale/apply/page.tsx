'use client';
/**
 * /wholesale/apply – Business wholesale application form.
 * Authenticated users submit a wholesale account application.
 * Non-auth'd users see a login prompt.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LangContext';
import type { WholesaleStatus, WholesaleApplyFormData } from '@/types/shop';

const BUSINESS_TYPES = [
    'Restaurant', 'Cafe', 'Hotel', 'Catering', 'Grocery Retailer',
    'Supermarket', 'Online Retailer', 'Food Distributor', 'Other',
];

type FormState = 'idle' | 'submitting' | 'success' | 'error';

export default function WholesaleApplyPage() {
    const { t } = useLang();

    const [userId, setUserId] = useState<string | null>(null);
    const [existingStatus, setExistingStatus] = useState<WholesaleStatus | null>(null);
    const [formState, setFormState] = useState<FormState>('idle');
    const [errorMsg, setErrorMsg] = useState('');
    const [form, setForm] = useState<WholesaleApplyFormData>({
        business_name: '',
        trade_license_number: '',
        trade_license_url: '',
        contact_email: '',
        contact_phone: '',
        business_type: '',
    });

    // Check auth + existing application
    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) return;
            setUserId(user.id);

            const { data } = await supabase
                .from('wholesale_accounts')
                .select('status')
                .eq('user_id', user.id)
                .single();

            if (data) setExistingStatus(data.status as WholesaleStatus);

            // Pre-fill email
            setForm(f => ({ ...f, contact_email: user.email ?? '' }));
        });
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!userId) return;

        setFormState('submitting');
        setErrorMsg('');

        const { error } = await supabase.from('wholesale_accounts').insert({
            user_id: userId,
            business_name: form.business_name,
            trade_license_number: form.trade_license_number || null,
            trade_license_url: form.trade_license_url || null,
            contact_email: form.contact_email,
            contact_phone: form.contact_phone || null,
            business_type: form.business_type || null,
            status: 'pending',
        });

        if (error) {
            setErrorMsg(error.message);
            setFormState('error');
        } else {
            setFormState('success');
            setExistingStatus('pending');
        }
    };

    // ── Not logged in ──
    if (!userId) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <div className="text-5xl">🔐</div>
                <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">
                    Sign In Required
                </h1>
                <p className="text-stone-500">
                    Please sign in or create an account to apply for wholesale access.
                </p>
                <div className="flex gap-3 justify-center">
                    <Link href="/auth/login?return=/wholesale/apply"
                          className="px-6 py-3 bg-[var(--color-imperial)] text-white rounded-xl font-semibold text-sm
                                     hover:bg-[var(--color-imperial)]/90 transition">
                        Sign In
                    </Link>
                    <Link href="/auth/signup"
                          className="px-6 py-3 border border-stone-200 text-stone-600 rounded-xl font-semibold text-sm
                                     hover:bg-stone-50 transition">
                        Create Account
                    </Link>
                </div>
            </div>
        );
    }

    // ── Already applied ──
    if (existingStatus === 'pending') {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <div className="text-5xl">⏳</div>
                <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Application Under Review</h1>
                <p className="text-stone-500">We'll notify you within 1–2 business days.</p>
                <Link href="/shop"
                      className="inline-flex px-6 py-3 bg-[var(--color-imperial)] text-white rounded-xl
                                 font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    if (existingStatus === 'approved') {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <div className="text-5xl">✅</div>
                <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Wholesale Access Approved</h1>
                <Link href="/wholesale/dashboard"
                      className="inline-flex px-6 py-3 bg-[var(--color-zellige)] text-white rounded-xl
                                 font-semibold text-sm hover:bg-[var(--color-zellige)]/90 transition">
                    Go to Dashboard
                </Link>
            </div>
        );
    }

    // ── Application form ──
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">
                    {t('applyForWholesale')}
                </h1>
                <p className="text-stone-500">
                    Fill in your business details. We'll review your application and respond within 1–2 business days.
                </p>
            </div>

            {/* Benefits strip */}
            <div className="grid grid-cols-3 gap-3 mb-8">
                {[
                    { icon: '💰', text: 'Bulk pricing' },
                    { icon: '🏷', text: 'Exclusive tiers' },
                    { icon: '📋', text: 'Invoice billing' },
                ].map(b => (
                    <div key={b.text}
                         className="flex flex-col items-center gap-1 bg-stone-50 rounded-xl p-3 text-center">
                        <span className="text-2xl">{b.icon}</span>
                        <span className="text-xs font-medium text-stone-600">{b.text}</span>
                    </div>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}
                  className="bg-white rounded-2xl border border-stone-100 p-6 space-y-5">
                {formState === 'error' && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        {errorMsg || 'An error occurred. Please try again.'}
                    </div>
                )}

                <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                        {t('businessName')} *
                    </label>
                    <input
                        name="business_name"
                        type="text"
                        value={form.business_name}
                        onChange={handleChange}
                        placeholder="e.g. Al Moghrabi Restaurant LLC"
                        required
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                            {t('tradeLicense')}
                        </label>
                        <input
                            name="trade_license_number"
                            type="text"
                            value={form.trade_license_number}
                            onChange={handleChange}
                            placeholder="e.g. DED-123456"
                            className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                            {t('businessType')}
                        </label>
                        <select
                            name="business_type"
                            value={form.business_type}
                            onChange={handleChange}
                            className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                        >
                            <option value="">Select type</option>
                            {BUSINESS_TYPES.map(bt => (
                                <option key={bt} value={bt}>{bt}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                        Trade License URL
                    </label>
                    <input
                        name="trade_license_url"
                        type="url"
                        value={form.trade_license_url}
                        onChange={handleChange}
                        placeholder="https://drive.google.com/... (optional)"
                        className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                   focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                            {t('contactEmail')} *
                        </label>
                        <input
                            name="contact_email"
                            type="email"
                            value={form.contact_email}
                            onChange={handleChange}
                            required
                            className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-stone-500 mb-1.5 uppercase tracking-wide">
                            {t('contactPhone')}
                        </label>
                        <input
                            name="contact_phone"
                            type="tel"
                            value={form.contact_phone}
                            onChange={handleChange}
                            placeholder="+971 50 XXX XXXX"
                            className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl
                                       focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={formState === 'submitting'}
                    className="w-full py-3.5 bg-[var(--color-zellige)] text-white rounded-xl font-semibold
                               hover:bg-[var(--color-zellige)]/90 disabled:opacity-60 transition"
                >
                    {formState === 'submitting' ? 'Submitting…' : t('submit')}
                </button>
            </form>
        </div>
    );
}
