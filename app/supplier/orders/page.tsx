'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface SupplierOrder {
    orderId: string;
    orderNumber: string;
    status: OrderStatus;
    total: number;
    shippingName: string;
    shippingEmirate: string;
    shippingPhone: string;
    createdAt: string;
    items: {
        productName: string;
        variantLabel: string | null;
        quantity: number;
        lineTotal: number;
    }[];
}

export default function SupplierOrdersPage() {
    const [orders, setOrders] = useState<SupplierOrder[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [filter, setFilter] = useState<OrderStatus | 'all'>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: supplier } = await supabase
            .from('suppliers')
            .select('id')
            .eq('owner_user_id', user.id)
            .single();

        if (!supplier) return;

        // Get product IDs belonging to this supplier
        const { data: supplierProducts } = await supabase
            .from('supplier_products')
            .select('product_id')
            .eq('supplier_id', supplier.id)
            .eq('status', 'approved');

        if (!supplierProducts || supplierProducts.length === 0) {
            setLoading(false);
            return;
        }

        const productIds = supplierProducts.map(sp => sp.product_id);

        // Get variant IDs for these products
        const { data: variants } = await supabase
            .from('product_variants')
            .select('id, product_id')
            .in('product_id', productIds);

        if (!variants || variants.length === 0) {
            setLoading(false);
            return;
        }

        const variantIds = variants.map(v => v.id);

        // Get order items for these variants
        const { data: orderItems } = await supabase
            .from('order_items')
            .select('order_id, product_name, variant_label, quantity, line_total, variant_id')
            .in('variant_id', variantIds);

        if (!orderItems || orderItems.length === 0) {
            setLoading(false);
            return;
        }

        // Get unique order IDs
        const orderIds = [...new Set(orderItems.map(oi => oi.order_id))];

        // Fetch orders
        const { data: ordersData } = await supabase
            .from('orders')
            .select('id, order_number, status, total, shipping_name, shipping_emirate, shipping_phone, created_at')
            .in('id', orderIds)
            .order('created_at', { ascending: false });

        if (!ordersData) {
            setLoading(false);
            return;
        }

        // Group items by order
        const grouped: SupplierOrder[] = ordersData.map(o => ({
            orderId: o.id,
            orderNumber: o.order_number,
            status: o.status as OrderStatus,
            total: o.total,
            shippingName: o.shipping_name ?? '',
            shippingEmirate: o.shipping_emirate ?? '',
            shippingPhone: o.shipping_phone ?? '',
            createdAt: o.created_at,
            items: orderItems
                .filter(oi => oi.order_id === o.id)
                .map(oi => ({
                    productName: oi.product_name,
                    variantLabel: oi.variant_label,
                    quantity: oi.quantity,
                    lineTotal: oi.line_total,
                })),
        }));

        setOrders(grouped);
        setLoading(false);
    };

    const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
        setUpdatingId(orderId);

        const { error } = await supabase
            .from('orders')
            .update({ status: newStatus })
            .eq('id', orderId);

        if (!error) {
            setOrders(prev => prev.map(o =>
                o.orderId === orderId ? { ...o, status: newStatus } : o
            ));
        }

        setUpdatingId(null);
    };

    const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
        confirmed: 'processing',
        processing: 'shipped',
        shipped: 'delivered',
    };

    const statusStyles: Record<OrderStatus, string> = {
        pending: 'bg-gray-100 text-gray-600',
        confirmed: 'bg-blue-100 text-blue-700',
        processing: 'bg-amber-100 text-amber-700',
        shipped: 'bg-indigo-100 text-indigo-700',
        delivered: 'bg-emerald-100 text-emerald-700',
        cancelled: 'bg-red-100 text-red-700',
    };

    const actionLabels: Partial<Record<OrderStatus, string>> = {
        processing: 'Mark Processing',
        shipped: 'Mark Shipped',
        delivered: 'Mark Delivered',
    };

    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

    const statusCounts = orders.reduce((acc, o) => {
        acc[o.status] = (acc[o.status] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Orders</h1>

            {/* Filter tabs */}
            <div className="flex gap-2 flex-wrap">
                {(['all', 'confirmed', 'processing', 'shipped', 'delivered'] as const).map(s => (
                    <button key={s} onClick={() => setFilter(s)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                            filter === s ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                        }`}>
                        {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
                        {s === 'all' ? ` (${orders.length})` : statusCounts[s] ? ` (${statusCounts[s]})` : ''}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="space-y-3">
                    {[1,2,3].map(i => <div key={i} className="h-24 bg-white rounded-xl animate-pulse" />)}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-gray-100">
                    <p className="text-gray-500">No orders{filter !== 'all' ? ` with status "${filter}"` : ''}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map(order => (
                        <div key={order.orderId} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                            {/* Order header */}
                            <div className="p-4 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                                onClick={() => setExpandedId(expandedId === order.orderId ? null : order.orderId)}>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-semibold text-gray-900">#{order.orderNumber}</h3>
                                        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500">
                                        {order.shippingName} · {order.shippingEmirate} · {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <p className="text-lg font-semibold text-gray-900">AED {Number(order.total).toFixed(2)}</p>
                                {nextStatus[order.status] && (
                                    <button
                                        onClick={(e) => { e.stopPropagation(); updateStatus(order.orderId, nextStatus[order.status]!); }}
                                        disabled={updatingId === order.orderId}
                                        className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition disabled:opacity-50 shrink-0">
                                        {updatingId === order.orderId ? 'Updating...' : actionLabels[nextStatus[order.status]!]}
                                    </button>
                                )}
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === order.orderId ? 'rotate-180' : ''}`}
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>

                            {/* Expanded details */}
                            {expandedId === order.orderId && (
                                <div className="border-t border-gray-100 p-4 bg-gray-50">
                                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                                        <div>
                                            <p className="text-gray-500">Customer</p>
                                            <p className="font-medium">{order.shippingName}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Phone</p>
                                            <p className="font-medium">{order.shippingPhone || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Emirate</p>
                                            <p className="font-medium">{order.shippingEmirate || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Date</p>
                                            <p className="font-medium">{new Date(order.createdAt).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="text-gray-500 border-b">
                                                <th className="text-left py-2">Item</th>
                                                <th className="text-center py-2">Qty</th>
                                                <th className="text-right py-2">Total</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {order.items.map((item, i) => (
                                                <tr key={i} className="border-b border-gray-100">
                                                    <td className="py-2">{item.productName}{item.variantLabel ? ` (${item.variantLabel})` : ''}</td>
                                                    <td className="py-2 text-center">{item.quantity}</td>
                                                    <td className="py-2 text-right">AED {Number(item.lineTotal).toFixed(2)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
