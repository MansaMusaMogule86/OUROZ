'use client';
/**
 * /wholesale/dashboard – Wholesale account dashboard.
 * Shows: approval status, recent orders, quick reorder.
 * Invoices section is a stub.
 */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { useLang } from '@/contexts/LangContext';
import { useCart } from '@/contexts/CartContext';
import type { DbOrder, DbOrderItem, WholesaleStatus } from '@/types/shop';

interface WholesaleData {
    status: WholesaleStatus;
    business_name: string;
    created_at: string;
}

interface OrderWithItems extends DbOrder {
    order_items: DbOrderItem[];
}

export default function WholesaleDashboardPage() {
    const { t } = useLang();
    const { addItem } = useCart();
    const [loading, setLoading] = useState(true);
    const [account, setAccount] = useState<WholesaleData | null>(null);
    const [orders, setOrders] = useState<OrderWithItems[]>([]);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getUser().then(async ({ data: { user } }) => {
            if (!user) { setLoading(false); return; }
            setUserId(user.id);

            const [{ data: wholesale }, { data: recentOrders }] = await Promise.all([
                supabase
                    .from('wholesale_accounts')
                    .select('status, business_name, created_at')
                    .eq('user_id', user.id)
                    .single(),
                supabase
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('user_id', user.id)
                    .eq('is_wholesale', true)
                    .order('created_at', { ascending: false })
                    .limit(5),
            ]);

            if (wholesale) setAccount(wholesale as WholesaleData);
            if (recentOrders) setOrders(recentOrders as OrderWithItems[]);
            setLoading(false);
        });
    }, []);

    const fmt = (n: number) =>
        new Intl.NumberFormat('en-AE', { style: 'currency', currency: 'AED', minimumFractionDigits: 2 }).format(n);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-4 border-[var(--color-imperial)]/20
                                border-t-[var(--color-imperial)] rounded-full animate-spin" />
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <p className="text-stone-500">Please sign in to view your wholesale dashboard.</p>
                <Link href="/auth/login?return=/wholesale/dashboard"
                      className="inline-flex px-6 py-3 bg-[var(--color-imperial)] text-white rounded-xl
                                 font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition">
                    Sign In
                </Link>
            </div>
        );
    }

    if (!account) {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <p className="text-stone-500">No wholesale account found.</p>
                <Link href="/wholesale/apply"
                      className="inline-flex px-6 py-3 bg-[var(--color-zellige)] text-white rounded-xl
                                 font-semibold text-sm hover:bg-[var(--color-zellige)]/90 transition">
                    Apply for Wholesale
                </Link>
            </div>
        );
    }

    if (account.status === 'pending') {
        return (
            <div className="max-w-md mx-auto py-20 text-center space-y-4">
                <div className="text-5xl">⏳</div>
                <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Application Under Review</h1>
                <p className="text-stone-500">
                    <strong>{account.business_name}</strong>'s application is being reviewed.
                    We'll email you within 1–2 business days.
                </p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto py-8 px-4 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">
                        Wholesale Dashboard
                    </h1>
                    <p className="text-stone-500 text-sm mt-0.5">
                        {account.business_name}
                        <span className="ms-2 inline-flex items-center gap-1 text-xs
                                         bg-[var(--color-zellige)]/10 text-[var(--color-zellige)]
                                         px-2 py-0.5 rounded-full font-medium">
                            ✅ Approved
                        </span>
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="px-5 py-2.5 bg-[var(--color-imperial)] text-white rounded-xl
                               font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition"
                >
                    Shop Now
                </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Orders', value: orders.length },
                    { label: 'Total Spend', value: fmt(orders.reduce((s, o) => s + Number(o.total), 0)) },
                    { label: 'Member Since', value: new Date(account.created_at).toLocaleDateString('en-AE', { month: 'short', year: 'numeric' }) },
                    { label: 'Account Status', value: 'Active' },
                ].map(stat => (
                    <div key={stat.label}
                         className="bg-white rounded-2xl border border-stone-100 p-4 text-center">
                        <p className="text-lg font-bold text-[var(--color-charcoal)]">{stat.value}</p>
                        <p className="text-xs text-stone-400 mt-0.5">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-2xl border border-stone-100">
                <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                    <h2 className="font-semibold text-[var(--color-charcoal)]">Recent Orders</h2>
                </div>
                {orders.length === 0 ? (
                    <div className="px-6 py-12 text-center text-stone-400">
                        <p>No wholesale orders yet.</p>
                        <Link href="/shop" className="text-sm text-[var(--color-imperial)] hover:underline mt-2 inline-block">
                            Start shopping →
                        </Link>
                    </div>
                ) : (
                    <div className="divide-y divide-stone-100">
                        {orders.map(order => (
                            <div key={order.id} className="px-6 py-4">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-[var(--color-charcoal)]">
                                            {order.order_number}
                                        </p>
                                        <p className="text-xs text-stone-400 mt-0.5">
                                            {new Date(order.created_at).toLocaleDateString('en-AE', {
                                                day: 'numeric', month: 'short', year: 'numeric'
                                            })}
                                            {' · '}
                                            {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[var(--color-charcoal)]">
                                            {fmt(Number(order.total))}
                                        </p>
                                        <span className={`
                                            text-xs px-2 py-0.5 rounded-full font-medium
                                            ${order.status === 'delivered'
                                                ? 'bg-emerald-100 text-emerald-700'
                                                : order.status === 'cancelled'
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-amber-100 text-amber-700'
                                            }
                                        `}>
                                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>

                                {/* Reorder button */}
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={async () => {
                                            for (const item of order.order_items) {
                                                await addItem({
                                                    variantId: item.variant_id,
                                                    qty: item.qty,
                                                    name: item.product_name,
                                                    image: item.product_image_url,
                                                    sku: item.variant_sku,
                                                    label: item.variant_label,
                                                    price: Number(item.unit_price),
                                                    productId: item.variant_id, // approximation
                                                    productSlug: '',
                                                });
                                            }
                                        }}
                                        className="text-xs font-semibold text-[var(--color-imperial)]
                                                   hover:text-[var(--color-imperial)]/80 flex items-center gap-1"
                                    >
                                        🔄 Reorder
                                    </button>
                                    <span className="text-stone-300">·</span>
                                    <button className="text-xs font-semibold text-stone-400 hover:text-stone-600 flex items-center gap-1">
                                        📄 Invoice (stub)
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Invoices stub */}
            <div className="bg-white rounded-2xl border border-stone-100 px-6 py-8 text-center">
                <p className="text-2xl mb-3">📊</p>
                <h3 className="font-semibold text-[var(--color-charcoal)] mb-1">Invoices & Statements</h3>
                <p className="text-sm text-stone-400">Invoice generation coming soon. Contact your account manager for billing.</p>
            </div>
        </div>
    );
}
