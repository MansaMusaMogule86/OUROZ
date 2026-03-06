'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderDetail {
    id: string;
    orderNumber: string;
    status: OrderStatus;
    subtotal: number;
    shippingCost: number;
    vatAmount: number;
    total: number;
    shippingName: string;
    shippingAddress: string;
    shippingEmirate: string;
    shippingPhone: string;
    notes: string | null;
    createdAt: string;
    items: {
        productName: string;
        variantLabel: string | null;
        productImageUrl: string | null;
        quantity: number;
        priceAtPurchase: number;
        lineTotal: number;
    }[];
}

const STATUS_STEPS: OrderStatus[] = ['confirmed', 'processing', 'shipped', 'delivered'];

export default function OrderTrackingPage() {
    const params = useParams();
    const orderNumber = params.orderNumber as string;
    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        (async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                setError('Please sign in to view your order');
                setLoading(false);
                return;
            }

            const { data: orderData, error: orderError } = await supabase
                .from('orders')
                .select('id, order_number, status, subtotal, shipping_cost, vat_amount, total, shipping_name, shipping_address, shipping_emirate, shipping_phone, notes, created_at')
                .eq('order_number', orderNumber)
                .eq('user_id', user.id)
                .single();

            if (orderError || !orderData) {
                setError('Order not found');
                setLoading(false);
                return;
            }

            const { data: items } = await supabase
                .from('order_items')
                .select('product_name, variant_label, product_image_url, quantity, price_at_purchase, line_total')
                .eq('order_id', orderData.id);

            setOrder({
                id: orderData.id,
                orderNumber: orderData.order_number,
                status: orderData.status as OrderStatus,
                subtotal: orderData.subtotal,
                shippingCost: orderData.shipping_cost,
                vatAmount: orderData.vat_amount,
                total: orderData.total,
                shippingName: orderData.shipping_name ?? '',
                shippingAddress: orderData.shipping_address ?? '',
                shippingEmirate: orderData.shipping_emirate ?? '',
                shippingPhone: orderData.shipping_phone ?? '',
                notes: orderData.notes,
                createdAt: orderData.created_at,
                items: (items ?? []).map(i => ({
                    productName: i.product_name,
                    variantLabel: i.variant_label,
                    productImageUrl: i.product_image_url,
                    quantity: i.quantity,
                    priceAtPurchase: i.price_at_purchase,
                    lineTotal: i.line_total,
                })),
            });
            setLoading(false);
        })();
    }, [orderNumber]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center">
                <div className="animate-pulse text-[var(--color-charcoal)]/50">Loading order...</div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-[var(--color-sahara)] flex items-center justify-center px-4">
                <div className="bg-white rounded-2xl p-8 text-center max-w-md w-full">
                    <p className="text-red-600 mb-4">{error ?? 'Order not found'}</p>
                    <Link href="/shop" className="text-amber-600 font-medium hover:underline">Back to Shop</Link>
                </div>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.indexOf(order.status);
    const isCancelled = order.status === 'cancelled';
    const trackingNumber = order.notes?.match(/Tracking:\s*(.+)/)?.[1];

    return (
        <div className="min-h-screen bg-[var(--color-sahara)]">
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <Link href="/shop" className="text-sm text-amber-600 hover:underline mb-2 inline-block">&larr; Back to Shop</Link>
                        <h1 className="text-2xl font-bold text-[var(--color-charcoal)]">Order #{order.orderNumber}</h1>
                        <p className="text-sm text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                </div>

                {/* Status tracker */}
                {!isCancelled ? (
                    <div className="bg-white rounded-2xl p-6 border border-gray-100">
                        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-6">Order Status</h2>
                        <div className="flex items-center justify-between relative">
                            {/* Progress line */}
                            <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200 mx-8" />
                            <div className="absolute top-4 left-0 h-0.5 bg-amber-500 mx-8"
                                style={{ width: `${currentStepIndex >= 0 ? (currentStepIndex / (STATUS_STEPS.length - 1)) * 100 : 0}%` }} />

                            {STATUS_STEPS.map((step, i) => {
                                const isComplete = currentStepIndex >= i;
                                const isCurrent = currentStepIndex === i;
                                return (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                            isComplete ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'
                                        } ${isCurrent ? 'ring-4 ring-amber-200' : ''}`}>
                                            {isComplete ? (
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : i + 1}
                                        </div>
                                        <p className={`mt-2 text-xs font-medium ${isComplete ? 'text-amber-600' : 'text-gray-400'}`}>
                                            {step.charAt(0).toUpperCase() + step.slice(1)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {trackingNumber && (
                            <div className="mt-6 p-3 bg-emerald-50 rounded-lg text-sm">
                                <span className="font-medium text-emerald-700">Tracking Number:</span>{' '}
                                <span className="text-emerald-900">{trackingNumber}</span>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
                        <p className="text-red-700 font-semibold">This order has been cancelled</p>
                    </div>
                )}

                {/* Items */}
                <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <h2 className="font-semibold text-gray-900">Items ({order.items.length})</h2>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item, i) => (
                            <div key={i} className="p-4 flex items-center gap-4">
                                <div className="w-14 h-14 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                    {item.productImageUrl && (
                                        <img src={item.productImageUrl} alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{item.productName}</p>
                                    {item.variantLabel && <p className="text-xs text-gray-500">{item.variantLabel}</p>}
                                    <p className="text-sm text-gray-500">Qty: {item.quantity} × AED {Number(item.priceAtPurchase).toFixed(2)}</p>
                                </div>
                                <p className="font-semibold text-gray-900">AED {Number(item.lineTotal).toFixed(2)}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary & Shipping */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-3 text-sm">
                        <h3 className="font-semibold text-gray-900">Order Summary</h3>
                        <div className="flex justify-between"><span className="text-gray-500">Subtotal</span><span>AED {Number(order.subtotal).toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">Shipping</span><span>AED {Number(order.shippingCost).toFixed(2)}</span></div>
                        <div className="flex justify-between"><span className="text-gray-500">VAT</span><span>AED {Number(order.vatAmount).toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-base pt-2 border-t">
                            <span>Total</span><span className="text-amber-600">AED {Number(order.total).toFixed(2)}</span>
                        </div>
                    </div>
                    <div className="bg-white rounded-2xl p-5 border border-gray-100 space-y-2 text-sm">
                        <h3 className="font-semibold text-gray-900">Shipping Address</h3>
                        <p className="text-gray-700">{order.shippingName}</p>
                        {order.shippingAddress && <p className="text-gray-500">{order.shippingAddress}</p>}
                        <p className="text-gray-500">{order.shippingEmirate}</p>
                        {order.shippingPhone && <p className="text-gray-500">{order.shippingPhone}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}
