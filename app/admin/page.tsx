'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
    totalProducts: number;
    activeProducts: number;
    totalOrders: number;
    pendingOrders: number;
    totalSuppliers: number;
    pendingSuppliers: number;
    totalBusinesses: number;
    pendingBusinesses: number;
    revenueTotal: number;
}

interface RecentOrder {
    id: string;
    order_number: string;
    status: string;
    total: number;
    shipping_name: string;
    created_at: string;
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboard();
    }, []);

    async function loadDashboard() {
        const [
            { count: totalProducts },
            { count: activeProducts },
            { count: totalOrders },
            { count: pendingOrders },
            { count: totalSuppliers },
            { count: pendingSuppliers },
            { count: totalBusinesses },
            { count: pendingBusinesses },
        ] = await Promise.all([
            supabase.from('products').select('*', { count: 'exact', head: true }),
            supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
            supabase.from('orders').select('*', { count: 'exact', head: true }),
            supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('suppliers').select('*', { count: 'exact', head: true }),
            supabase.from('suppliers').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
            supabase.from('wholesale_applications').select('*', { count: 'exact', head: true }),
            supabase.from('wholesale_applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        // Revenue sum — get all confirmed+ orders
        const { data: orderTotals } = await supabase
            .from('orders')
            .select('total')
            .in('status', ['confirmed', 'processing', 'shipped', 'delivered']);

        const revenueTotal = (orderTotals ?? []).reduce((sum, o) => sum + Number(o.total), 0);

        setStats({
            totalProducts: totalProducts ?? 0,
            activeProducts: activeProducts ?? 0,
            totalOrders: totalOrders ?? 0,
            pendingOrders: pendingOrders ?? 0,
            totalSuppliers: totalSuppliers ?? 0,
            pendingSuppliers: pendingSuppliers ?? 0,
            totalBusinesses: totalBusinesses ?? 0,
            pendingBusinesses: pendingBusinesses ?? 0,
            revenueTotal,
        });

        // Recent orders
        const { data: orders } = await supabase
            .from('orders')
            .select('id, order_number, status, total, shipping_name, created_at')
            .order('created_at', { ascending: false })
            .limit(10);

        setRecentOrders((orders ?? []) as RecentOrder[]);
        setLoading(false);
    }

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
            <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse border border-stone-200" />)}
                </div>
            </div>
        );
    }

    const cards = [
        { label: 'Revenue', value: `AED ${stats!.revenueTotal.toFixed(0)}`, color: 'text-emerald-700', bg: 'bg-emerald-50' },
        { label: 'Total Orders', value: stats!.totalOrders, color: 'text-blue-700', bg: 'bg-blue-50', badge: stats!.pendingOrders > 0 ? `${stats!.pendingOrders} pending` : null },
        { label: 'Products', value: `${stats!.activeProducts} / ${stats!.totalProducts}`, color: 'text-stone-700', bg: 'bg-stone-50', sub: 'active / total' },
        { label: 'Suppliers', value: stats!.totalSuppliers, color: 'text-amber-700', bg: 'bg-amber-50', badge: stats!.pendingSuppliers > 0 ? `${stats!.pendingSuppliers} pending` : null },
    ];

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-xl font-semibold text-stone-800">Dashboard</h1>
                    <p className="text-sm text-stone-500 mt-0.5">Overview of your marketplace</p>
                </div>
                <button onClick={() => { setLoading(true); loadDashboard(); }}
                    className="text-xs px-3 py-1.5 border border-stone-300 rounded text-stone-600 hover:bg-stone-50 transition">
                    Refresh
                </button>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {cards.map(card => (
                    <div key={card.label} className="bg-white rounded-xl border border-stone-200 p-5">
                        <p className="text-xs text-stone-500 uppercase tracking-wide mb-1">{card.label}</p>
                        <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
                        {card.badge && (
                            <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full font-medium">
                                {card.badge}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Link href="/admin/suppliers" className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 transition group">
                    <h3 className="font-semibold text-stone-800 group-hover:text-amber-600 transition">Supplier Approvals</h3>
                    <p className="text-sm text-stone-500 mt-1">
                        {stats!.pendingSuppliers > 0 ? `${stats!.pendingSuppliers} supplier(s) awaiting approval` : 'All suppliers reviewed'}
                    </p>
                </Link>
                <Link href="/admin/products" className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 transition group">
                    <h3 className="font-semibold text-stone-800 group-hover:text-amber-600 transition">Product Catalog</h3>
                    <p className="text-sm text-stone-500 mt-1">{stats!.activeProducts} active products in the store</p>
                </Link>
                <Link href="/admin/businesses" className="bg-white rounded-xl border border-stone-200 p-5 hover:border-amber-300 transition group">
                    <h3 className="font-semibold text-stone-800 group-hover:text-amber-600 transition">Business Accounts</h3>
                    <p className="text-sm text-stone-500 mt-1">
                        {stats!.pendingBusinesses > 0 ? `${stats!.pendingBusinesses} application(s) pending` : 'All applications reviewed'}
                    </p>
                </Link>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-xl border border-stone-200">
                <div className="px-5 py-4 border-b border-stone-100 flex items-center justify-between">
                    <h2 className="font-semibold text-stone-800">Recent Orders</h2>
                    <span className="text-xs text-stone-400">Last 10</span>
                </div>
                {recentOrders.length === 0 ? (
                    <p className="p-8 text-center text-sm text-stone-400">No orders yet</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100">
                                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase">Order</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase">Customer</th>
                                <th className="text-left px-5 py-3 text-xs font-semibold text-stone-500 uppercase">Status</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase">Total</th>
                                <th className="text-right px-5 py-3 text-xs font-semibold text-stone-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {recentOrders.map(o => (
                                <tr key={o.id} className="hover:bg-stone-50/50">
                                    <td className="px-5 py-3 font-medium text-stone-800">#{o.order_number}</td>
                                    <td className="px-5 py-3 text-stone-600">{o.shipping_name ?? '—'}</td>
                                    <td className="px-5 py-3">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[o.status] ?? 'bg-gray-100'}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right font-medium">AED {Number(o.total).toFixed(2)}</td>
                                    <td className="px-5 py-3 text-right text-stone-400 text-xs">
                                        {new Date(o.created_at).toLocaleDateString('en-AE', { day: 'numeric', month: 'short' })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
