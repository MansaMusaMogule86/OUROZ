'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type Tab = 'profile' | 'orders' | 'settings';

interface UserProfile {
    email: string;
    fullName: string;
    role: string;
    createdAt: string;
}

interface OrderSummary {
    id: string;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
}

export default function AccountPage() {
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('profile');
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [orders, setOrders] = useState<OrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingName, setEditingName] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/auth/login?return=/account');
                return;
            }

            // Profile
            const { data: prof } = await supabase
                .from('user_profiles')
                .select('full_name, role, created_at')
                .eq('user_id', user.id)
                .single();

            setProfile({
                email: user.email ?? '',
                fullName: (prof as { full_name?: string })?.full_name ?? user.user_metadata?.full_name ?? '',
                role: (prof as { role?: string })?.role ?? 'customer',
                createdAt: (prof as { created_at?: string })?.created_at ?? user.created_at,
            });

            setNameInput((prof as { full_name?: string })?.full_name ?? user.user_metadata?.full_name ?? '');

            // Orders
            const { data: orderData } = await supabase
                .from('orders')
                .select('id, order_number, status, total, created_at')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50);

            setOrders((orderData ?? []) as OrderSummary[]);
            setLoading(false);
        })();
    }, [router]);

    const handleSaveName = async () => {
        if (!nameInput.trim()) return;
        setSaving(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            await supabase
                .from('user_profiles')
                .update({ full_name: nameInput.trim() })
                .eq('user_id', user.id);
            setProfile(prev => prev ? { ...prev, fullName: nameInput.trim() } : prev);
        }
        setSaving(false);
        setEditingName(false);
    };

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const statusStyles: Record<string, string> = {
        pending: 'bg-gray-100 text-gray-600',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-amber-100 text-amber-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center">
                <div className="animate-pulse text-[var(--color-charcoal)]/50">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/shop" className="text-sm text-amber-600 hover:underline mb-2 inline-block">&larr; Back to Shop</Link>
                        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">My Account</h1>
                    </div>
                    <button onClick={handleSignOut}
                        className="text-sm px-4 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition">
                        Sign Out
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 bg-white rounded-xl p-1 w-fit border border-gray-100">
                    {(['profile', 'orders', 'settings'] as Tab[]).map(t => (
                        <button key={t} onClick={() => setTab(t)}
                            className={`px-5 py-2 rounded-lg text-sm font-medium transition capitalize ${
                                tab === t ? 'bg-amber-600 text-white' : 'text-gray-500 hover:text-gray-800'
                            }`}>
                            {t}
                        </button>
                    ))}
                </div>

                {/* Profile tab */}
                {tab === 'profile' && profile && (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100 space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl font-bold text-amber-700">
                                {profile.fullName?.charAt(0)?.toUpperCase() || profile.email.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                {editingName ? (
                                    <div className="flex items-center gap-2">
                                        <input value={nameInput} onChange={e => setNameInput(e.target.value)}
                                            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 outline-none" />
                                        <button onClick={handleSaveName} disabled={saving}
                                            className="text-xs px-3 py-1.5 bg-amber-600 text-white rounded-lg disabled:opacity-50">Save</button>
                                        <button onClick={() => setEditingName(false)}
                                            className="text-xs px-3 py-1.5 text-gray-500">Cancel</button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-lg font-bold text-gray-900">{profile.fullName || 'No name set'}</h2>
                                        <button onClick={() => setEditingName(true)}
                                            className="text-xs text-amber-600 hover:underline">Edit</button>
                                    </div>
                                )}
                                <p className="text-sm text-gray-500">{profile.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-1">Account Type</p>
                                <p className="font-semibold capitalize">{profile.role}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-xl">
                                <p className="text-gray-500 mb-1">Member Since</p>
                                <p className="font-semibold">{new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</p>
                            </div>
                        </div>
                        {profile.role === 'customer' && (
                            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
                                <p className="text-sm font-medium text-amber-800 mb-1">Upgrade to Wholesale</p>
                                <p className="text-xs text-amber-600 mb-3">Get tiered pricing and credit terms for bulk orders.</p>
                                <Link href="/wholesale/apply"
                                    className="inline-block text-xs px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition">
                                    Apply for Wholesale
                                </Link>
                            </div>
                        )}
                    </div>
                )}

                {/* Orders tab */}
                {tab === 'orders' && (
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                        {orders.length === 0 ? (
                            <div className="p-12 text-center">
                                <p className="text-gray-500 mb-4">No orders yet</p>
                                <Link href="/shop" className="text-sm text-amber-600 font-medium hover:underline">Start Shopping</Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {orders.map(o => (
                                    <Link key={o.id} href={`/orders/${o.order_number}`}
                                        className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                                        <div>
                                            <p className="font-medium text-gray-900">#{o.order_number}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                {new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[o.status] ?? 'bg-gray-100'}`}>
                                                {o.status}
                                            </span>
                                            <span className="font-semibold text-gray-900">AED {Number(o.total).toFixed(2)}</span>
                                            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings tab */}
                {tab === 'settings' && (
                    <div className="space-y-4">
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-4">Password</h3>
                            <Link href="/auth/password-reset"
                                className="text-sm text-amber-600 font-medium hover:underline">
                                Reset Password
                            </Link>
                        </div>
                        <div className="bg-white rounded-2xl p-6 border border-gray-100">
                            <h3 className="font-semibold text-gray-900 mb-2">Supplier Account</h3>
                            <p className="text-sm text-gray-500 mb-3">Sell your Moroccan products on OUROZ.</p>
                            <Link href="/supplier/register"
                                className="text-sm text-amber-600 font-medium hover:underline">
                                Register as Supplier
                            </Link>
                        </div>
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                            <h3 className="font-semibold text-red-800 mb-2">Sign Out</h3>
                            <p className="text-sm text-red-600 mb-3">Sign out of your account on this device.</p>
                            <button onClick={handleSignOut}
                                className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition">
                                Sign Out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
