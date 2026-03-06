'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function SupplierRegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({ name: '', nameAr: '', nameFr: '', description: '', city: '', phone: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setError('Please sign in first'); setLoading(false); return; }

        // Create slug from name
        const slug = form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

    return (
        <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
            <div className="w-full max-w-lg space-y-8">
                <div className="text-center">
                    <Link href="/shop" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-amber-600 to-amber-800 rounded-full flex items-center justify-center">
                            <span className="text-white font-serif text-lg">ⵣ</span>
                        </div>
                        <span className="text-2xl font-serif font-bold">OUROZ</span>
                    </Link>
                    <h1 className="mt-6 text-3xl font-bold text-[var(--color-charcoal)]">Become a Supplier</h1>
                    <p className="mt-2 text-sm text-[var(--color-charcoal)]/60">Register your business to sell on OUROZ</p>
                </div>

                {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">{error}</div>}

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Business Name *</label>
                        <input required value={form.name} onChange={e => update('name', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="Your business name" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (Arabic)</label>
                            <input value={form.nameAr} onChange={e => update('nameAr', e.target.value)} dir="rtl"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="الاسم بالعربية" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name (French)</label>
                            <input value={form.nameFr} onChange={e => update('nameFr', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="Nom en français" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                        <textarea required rows={3} value={form.description} onChange={e => update('description', e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none resize-none"
                            placeholder="Tell us about your products and business" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input required value={form.city} onChange={e => update('city', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="e.g. Casablanca" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                            <input required value={form.phone} onChange={e => update('phone', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" placeholder="+212..." />
                        </div>
                    </div>
                    <button type="submit" disabled={loading}
                        className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition disabled:opacity-50">
                        {loading ? 'Registering...' : 'Register as Supplier'}
                    </button>
                </form>
            </div>
        </div>
    );
}
