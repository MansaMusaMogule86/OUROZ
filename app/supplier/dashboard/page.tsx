'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface Stats {
    totalProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    totalOrders: number;
}

export default function SupplierDashboardPage() {
    const [stats, setStats] = useState<Stats>({ totalProducts: 0, pendingProducts: 0, approvedProducts: 0, totalOrders: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: supplier } = await supabase
                .from('suppliers')
                .select('id')
                .eq('owner_user_id', user.id)
                .single();

            if (!supplier) return;

            const { count: total } = await supabase
                .from('supplier_products')
                .select('*', { count: 'exact', head: true })
                .eq('supplier_id', supplier.id);

            const { count: pending } = await supabase
                .from('supplier_products')
                .select('*', { count: 'exact', head: true })
                .eq('supplier_id', supplier.id)
                .eq('status', 'pending');

            const { count: approved } = await supabase
                .from('supplier_products')
                .select('*', { count: 'exact', head: true })
                .eq('supplier_id', supplier.id)
                .eq('status', 'approved');

            setStats({
                totalProducts: total ?? 0,
                pendingProducts: pending ?? 0,
                approvedProducts: approved ?? 0,
                totalOrders: 0,
            });
            setLoading(false);
        })();
    }, []);

    const statCards = [
        { label: 'Total Products', value: stats.totalProducts, color: 'bg-blue-50 text-blue-700' },
        { label: 'Pending Review', value: stats.pendingProducts, color: 'bg-amber-50 text-amber-700' },
        { label: 'Approved & Live', value: stats.approvedProducts, color: 'bg-emerald-50 text-emerald-700' },
        { label: 'Total Orders', value: stats.totalOrders, color: 'bg-purple-50 text-purple-700' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Supplier Dashboard</h1>
                <Link href="/supplier/products/new"
                    className="px-6 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition text-sm">
                    + Add Product
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {statCards.map(card => (
                        <div key={card.label} className="bg-white rounded-xl p-5 border border-gray-100">
                            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
                            <p className={`text-3xl font-bold ${card.color} inline-block px-3 py-1 rounded-lg`}>{card.value}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Quick actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/supplier/products" className="bg-white rounded-xl p-6 border border-gray-100 hover:border-amber-200 transition group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition">Manage Products</h3>
                    <p className="text-sm text-gray-500 mt-1">Add, edit, or submit products for review</p>
                </Link>
                <Link href="/supplier/orders" className="bg-white rounded-xl p-6 border border-gray-100 hover:border-amber-200 transition group">
                    <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition">View Orders</h3>
                    <p className="text-sm text-gray-500 mt-1">Track and fulfill customer orders</p>
                </Link>
                <div className="bg-white rounded-xl p-6 border border-gray-100">
                    <h3 className="font-semibold text-gray-900">Commission Rate</h3>
                    <p className="text-sm text-gray-500 mt-1">Your current rate will be shown after approval</p>
                </div>
            </div>
        </div>
    );
}
