/**
 * /supplier/register – Supplier Access page
 * Matches design screenshot exactly:
 * Centered form card with fields: Company Name, Business Email,
 * Phone Number, Country, Product Category, Trade License Upload.
 * "Request Access" CTA + "Already Approved? Sign In" link.
 */

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

const PRODUCT_CATEGORIES = [
    'Spices & Seasonings',
    'Oils & Condiments',
    'Tea & Beverages',
    'Preserved Foods',
    'Bakery & Sweets',
    'Ceramics & Crafts',
    'Textiles & Homeware',
    'Beauty & Argan',
    'Other',
];

const COUNTRIES = [
    'Morocco',
    'United Arab Emirates',
    'Tunisia',
    'Algeria',
    'Egypt',
    'Turkey',
    'France',
    'Spain',
    'Other',
];

export default function SupplierRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        companyName: '',
        email: '',
        phone: '',
        phoneCode: '+212',
        country: '',
        category: '',
        tradeLicense: null as File | null,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = (field: string, value: string) =>
        setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            setError('Please sign in first');
            setLoading(false);
            return;
        }

        const slug = form.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        const { error: insertError } = await supabase.from('suppliers').insert({
            owner_user_id: user.id,
            name: form.companyName,
            slug,
            description: `${form.category} supplier from ${form.country}`,
            phone: `${form.phoneCode} ${form.phone}`,
            status: 'pending',
        });

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        router.push('/supplier/dashboard');
    };

    const inputClasses = "w-full px-4 py-3 text-sm border-b border-[var(--color-charcoal)]/15 bg-transparent focus:outline-none focus:border-[var(--color-charcoal)]/40 transition-colors placeholder:text-[var(--color-charcoal)]/30";
    const labelClasses = "block text-[11px] font-medium text-[var(--color-charcoal)]/50 mb-2 uppercase tracking-wider";

    return (
        <div className="min-h-screen bg-[var(--color-sahara)] relative overflow-hidden">
            <Navbar />

            {/* Faded Amazigh watermark — right side */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-[15%] pointer-events-none select-none opacity-[0.05] z-0">
                <span className="text-[40vw] font-serif leading-none block" style={{
                    background: 'linear-gradient(135deg, rgba(85,107,47,0.8) 0%, rgba(200,90,90,0.8) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    ⵣ
                </span>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto px-5 sm:px-8 pt-32 pb-20">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif text-[var(--color-charcoal)] mb-4" style={{ fontWeight: 400 }}>
                        Supplier Access
                    </h1>
                    <p className="text-sm text-[var(--color-charcoal)]/50 max-w-md mx-auto leading-relaxed">
                        Moroccan producers, distributors, and trade partners can request access
                        to manage product listings, stock, and wholesale orders.
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-8 border border-[var(--color-imperial)]/20 bg-white/60 backdrop-blur rounded-xl p-4 text-sm text-[var(--color-imperial)] text-center">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Row 1: Company Name | Business Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="companyName" className={labelClasses}>Company Name</label>
                            <input
                                id="companyName"
                                type="text"
                                required
                                value={form.companyName}
                                onChange={e => update('companyName', e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className={labelClasses}>Business Email</label>
                            <input
                                id="email"
                                type="email"
                                required
                                value={form.email}
                                onChange={e => update('email', e.target.value)}
                                className={inputClasses}
                            />
                        </div>
                    </div>

                    {/* Row 2: Phone Number | Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label htmlFor="phone" className={labelClasses}>Phone Number</label>
                            <div className="flex items-center border-b border-[var(--color-charcoal)]/15 focus-within:border-[var(--color-charcoal)]/40 transition-colors">
                                <select
                                    title="Phone country code"
                                    value={form.phoneCode}
                                    onChange={e => update('phoneCode', e.target.value)}
                                    className="bg-transparent text-sm text-[var(--color-charcoal)]/60 pr-1 py-3 focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="+212">+212</option>
                                    <option value="+971">+971</option>
                                    <option value="+216">+216</option>
                                    <option value="+213">+213</option>
                                    <option value="+33">+33</option>
                                    <option value="+34">+34</option>
                                </select>
                                <span className="text-[var(--color-charcoal)]/15 mx-2">|</span>
                                <input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={form.phone}
                                    onChange={e => update('phone', e.target.value)}
                                    className="flex-1 bg-transparent text-sm py-3 focus:outline-none placeholder:text-[var(--color-charcoal)]/30"
                                />
                            </div>
                        </div>
                        <div>
                            <label className={labelClasses}>Country</label>
                            <select
                                required
                                title="Country"
                                value={form.country}
                                onChange={e => update('country', e.target.value)}
                                className={`${inputClasses} appearance-none cursor-pointer`}
                            >
                                <option value="">Select Country</option>
                                {COUNTRIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Row 3: Product Category | Trade License Upload */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div>
                            <label className={labelClasses}>Product Category</label>
                            <select
                                required
                                title="Product Category"
                                value={form.category}
                                onChange={e => update('category', e.target.value)}
                                className={`${inputClasses} appearance-none cursor-pointer`}
                            >
                                <option value="">Choose a category</option>
                                {PRODUCT_CATEGORIES.map(c => (
                                    <option key={c} value={c}>{c}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className={labelClasses}>Trade License Upload</label>
                            <div className="flex items-center border-b border-[var(--color-charcoal)]/15 py-3 gap-3">
                                <label className="cursor-pointer text-sm text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)]/60 transition-colors flex-1 truncate">
                                    {form.tradeLicense ? form.tradeLicense.name : 'Upload Trade...'}
                                    <input
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        title="Trade License file"
                                        className="hidden"
                                        onChange={e => {
                                            const file = e.target.files?.[0] || null;
                                            setForm(prev => ({ ...prev, tradeLicense: file }));
                                        }}
                                    />
                                </label>
                                <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-charcoal)]/30 bg-[var(--color-charcoal)]/5 px-2.5 py-1 rounded">
                                    PDF
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4 text-center">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-12 py-4 bg-[#2C2B29] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full hover:bg-black transition-colors duration-300 disabled:opacity-50"
                        >
                            {loading ? 'Submitting...' : 'Request Access'}
                        </button>
                    </div>

                    {/* Review notice */}
                    <p className="text-center text-[11px] text-[var(--color-charcoal)]/35 mt-2">
                        All supplier accounts are reviewed before activation.
                    </p>

                    {/* Sign in link */}
                    <div className="text-center pt-2">
                        <Link
                            href="/auth/login"
                            className="text-sm text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300"
                        >
                            Already Approved? <span className="font-medium underline underline-offset-4">Sign In</span>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
