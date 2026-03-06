'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useCart } from '@/contexts/CartContext';
import { canUseInvoice, createInvoiceForOrder } from '@/services/creditService';

type CheckoutMode = 'pay_now' | 'invoice';

interface ShippingForm {
    name: string;
    phone: string;
    address: string;
    emirate: string;
}

interface UserBusiness {
    id: string;
    status: 'pending' | 'approved' | 'rejected';
    name: string;
}

const EMIRATES = ['Dubai', 'Abu Dhabi', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

const INITIAL_SHIPPING: ShippingForm = {
    name: '',
    phone: '',
    address: '',
    emirate: 'Dubai',
};

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, clearCart } = useCart();

    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [userId, setUserId] = useState<string | null>(null);
    const [business, setBusiness] = useState<UserBusiness | null>(null);
    const [shipping, setShipping] = useState<ShippingForm>(INITIAL_SHIPPING);

    const [checkoutMode, setCheckoutMode] = useState<CheckoutMode>('pay_now');
    const [invoiceEligible, setInvoiceEligible] = useState(false);
    const [invoiceReason, setInvoiceReason] = useState<string | null>(null);
    const [availableCredit, setAvailableCredit] = useState(0);

    const subtotal = cart?.subtotal ?? 0;
    const vat = subtotal * 0.05;
    const shippingFee = subtotal >= 150 ? 0 : 25;
    const total = subtotal + vat + shippingFee;

    const canAttemptInvoice = business?.status === 'approved';

    const summary = useMemo(() => {
        return {
            itemCount: cart?.item_count ?? 0,
            subtotal,
            vat,
            shippingFee,
            total,
        };
    }, [cart?.item_count, subtotal, vat, shippingFee, total]);

    const fmtAED = (value: number) => `AED ${value.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    useEffect(() => {
        void initialize();
    }, []);

    useEffect(() => {
        if (!canAttemptInvoice) {
            setInvoiceEligible(false);
            setInvoiceReason('Only approved business accounts can use Pay on Invoice.');
            setCheckoutMode('pay_now');
            return;
        }
        void refreshInvoiceEligibility();
    }, [canAttemptInvoice, business?.id, total]);

    async function initialize() {
        setLoading(true);
        setError(null);
        const { data: { user } } = await supabase.auth.getUser();
        setUserId(user?.id ?? null);

        if (!user) {
            setLoading(false);
            return;
        }

        // Business membership first, owner fallback second.
        const { data: membershipRows } = await supabase
            .from('business_members')
            .select('business:business_id(id, status, name)')
            .eq('user_id', user.id)
            .limit(1);

        const memberBusiness = membershipRows?.[0]?.business as UserBusiness | UserBusiness[] | undefined;
        if (memberBusiness) {
            setBusiness(Array.isArray(memberBusiness) ? memberBusiness[0] ?? null : memberBusiness);
            setLoading(false);
            return;
        }

        const { data: ownerBusiness } = await supabase
            .from('businesses')
            .select('id, status, name')
            .eq('owner_user_id', user.id)
            .limit(1)
            .maybeSingle();

        setBusiness((ownerBusiness as UserBusiness | null) ?? null);
        setLoading(false);
    }

    async function refreshInvoiceEligibility() {
        if (!business?.id || !canAttemptInvoice) {
            return;
        }

        const check = await canUseInvoice(business.id, total);
        setInvoiceEligible(check.allowed);
        setInvoiceReason(check.reason);
        setAvailableCredit(check.available);

        if (!check.allowed && checkoutMode === 'invoice') {
            setCheckoutMode('pay_now');
        }
    }

    function updateField<K extends keyof ShippingForm>(field: K, value: ShippingForm[K]) {
        setShipping(prev => ({ ...prev, [field]: value }));
    }

    function validateShipping() {
        if (!shipping.name.trim()) return 'Full name is required.';
        if (!shipping.phone.trim()) return 'Phone number is required.';
        if (!shipping.address.trim()) return 'Address is required.';
        if (!shipping.emirate.trim()) return 'Emirate is required.';
        return null;
    }

    async function validateStock() {
        if (!cart?.items?.length) return { ok: false, message: 'Cart is empty.' };

        const variantIds = cart.items.map(item => item.variant_id);
        const { data, error: stockError } = await supabase
            .from('product_variants')
            .select('id, stock_quantity')
            .in('id', variantIds);

        if (stockError || !data) {
            return { ok: false, message: 'Unable to validate stock right now. Please retry.' };
        }

        const stockMap = new Map(data.map(row => [row.id, Number((row as { stock_quantity: number }).stock_quantity)]));

        for (const line of cart.items) {
            const available = stockMap.get(line.variant_id) ?? 0;
            if (line.qty > available) {
                return {
                    ok: false,
                    message: `Stock is not enough for ${line.product_name}. Available: ${available}, requested: ${line.qty}.`,
                };
            }
        }

        return { ok: true, message: null as string | null };
    }

    async function placeOrder() {
        setError(null);

        if (!userId) {
            setError('Please sign in to place your order.');
            return;
        }

        if (!cart?.items?.length) {
            setError('Your cart is empty.');
            return;
        }

        const shippingError = validateShipping();
        if (shippingError) {
            setError(shippingError);
            return;
        }

        if (checkoutMode === 'invoice') {
            if (!business?.id) {
                setError('Invoice checkout requires an approved business account.');
                return;
            }
            const check = await canUseInvoice(business.id, total);
            if (!check.allowed) {
                setError(check.reason ?? 'Pay on Invoice is currently unavailable.');
                setCheckoutMode('pay_now');
                return;
            }
        }

        const stockCheck = await validateStock();
        if (!stockCheck.ok) {
            setError(stockCheck.message);
            return;
        }

        setPlacingOrder(true);

        try {
            const { data: orderNumber, error: orderNumberError } = await supabase.rpc('generate_order_number');
            if (orderNumberError || !orderNumber) {
                throw new Error('Failed to generate order number.');
            }

            const isWholesale = checkoutMode === 'invoice' || business?.status === 'approved';
            const { data: order, error: orderError } = await supabase
                .from('orders')
                .insert({
                    user_id: userId,
                    business_id: checkoutMode === 'invoice' ? business?.id ?? null : null,
                    order_number: orderNumber as string,
                    subtotal,
                    shipping_cost: shippingFee,
                    vat_amount: vat,
                    total,
                    currency: 'AED',
                    is_wholesale: isWholesale,
                    order_type: isWholesale ? 'wholesale' : 'retail',
                    payment_mode: checkoutMode,
                    payment_method: checkoutMode === 'invoice' ? 'invoice' : 'card',
                    status: 'pending',
                    shipping_name: shipping.name,
                    shipping_phone: shipping.phone,
                    shipping_address: shipping.address,
                    shipping_emirate: shipping.emirate,
                })
                .select('id')
                .single();

            if (orderError || !order) {
                throw new Error(orderError?.message ?? 'Failed to create order.');
            }

            const orderItemsPayload = cart.items.map(item => ({
                order_id: order.id,
                variant_id: item.variant_id,
                product_name: item.product_name,
                variant_sku: item.variant_sku,
                variant_label: item.variant_label,
                product_image_url: item.image_url,
                price_at_purchase: item.unit_price,
                quantity: item.qty,
                line_total: item.line_total,
            }));

            const { error: itemsError } = await supabase.from('order_items').insert(orderItemsPayload);
            if (itemsError) {
                throw new Error(itemsError.message);
            }

            let invoiceNumber: string | null = null;
            let invoiceDueDate: string | null = null;

            if (checkoutMode === 'invoice' && business?.id) {
                const invoice = await createInvoiceForOrder(order.id, business.id);
                if (!invoice) {
                    throw new Error('Order placed, but invoice generation failed. Please contact support.');
                }
                invoiceNumber = invoice.invoice_number;
                invoiceDueDate = invoice.due_date;
            }

            await clearCart();

            const query = new URLSearchParams({
                order: orderNumber as string,
                mode: checkoutMode,
            });
            if (invoiceNumber) query.set('invoice', invoiceNumber);
            if (invoiceDueDate) query.set('due', invoiceDueDate);

            router.push(`/checkout/success?${query.toString()}`);
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed. Please try again.');
        } finally {
            setPlacingOrder(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto py-16 px-4">
                <div className="h-10 w-48 rounded bg-stone-100 animate-pulse motion-reduce:animate-none" />
                <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-96 rounded bg-stone-100 animate-pulse motion-reduce:animate-none" />
                    <div className="h-72 rounded bg-stone-100 animate-pulse motion-reduce:animate-none" />
                </div>
            </div>
        );
    }

    if (!userId) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Sign in required</h1>
                <p className="text-stone-500 mt-2">Please sign in to continue to checkout.</p>
                <Link href="/auth/login?return=/checkout" className="inline-flex mt-6 px-6 py-3 rounded-xl bg-[var(--color-imperial)] text-white text-sm font-semibold hover:bg-[var(--color-imperial)]/90 transition">
                    Sign In
                </Link>
            </div>
        );
    }

    if (!cart?.items?.length) {
        return (
            <div className="max-w-md mx-auto py-20 px-4 text-center">
                <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Your cart is empty</h1>
                <p className="text-stone-500 mt-2">Add products first, then return to checkout.</p>
                <Link href="/shop" className="inline-flex mt-6 px-6 py-3 rounded-xl bg-[var(--color-imperial)] text-white text-sm font-semibold hover:bg-[var(--color-imperial)]/90 transition">
                    Back to Shop
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-semibold text-[var(--color-charcoal)] mb-6">Checkout</h1>

            {error && (
                <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 space-y-6">
                    <section>
                        <h2 className="text-base font-semibold text-[var(--color-charcoal)] mb-3">Shipping details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Full name *</label>
                                <input
                                    type="text"
                                    value={shipping.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Phone *</label>
                                <input
                                    type="tel"
                                    value={shipping.phone}
                                    onChange={(e) => updateField('phone', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Emirate *</label>
                                <select
                                    value={shipping.emirate}
                                    onChange={(e) => updateField('emirate', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                >
                                    {EMIRATES.map((emirate) => (
                                        <option key={emirate} value={emirate}>{emirate}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-stone-500 mb-1.5">Address *</label>
                                <textarea
                                    rows={3}
                                    value={shipping.address}
                                    onChange={(e) => updateField('address', e.target.value)}
                                    className="w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                />
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-base font-semibold text-[var(--color-charcoal)] mb-3">Payment option</h2>
                        <div className="space-y-3">
                            <label className="flex items-start gap-3 rounded-xl border border-stone-200 px-4 py-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="checkoutMode"
                                    checked={checkoutMode === 'pay_now'}
                                    onChange={() => setCheckoutMode('pay_now')}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-charcoal)]">Pay Now</p>
                                    <p className="text-xs text-stone-500">Available for all customers and businesses.</p>
                                </div>
                            </label>

                            <label className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${invoiceEligible ? 'border-stone-200 cursor-pointer' : 'border-stone-100 bg-stone-50 cursor-not-allowed'}`}>
                                <input
                                    type="radio"
                                    name="checkoutMode"
                                    checked={checkoutMode === 'invoice'}
                                    onChange={() => invoiceEligible && setCheckoutMode('invoice')}
                                    disabled={!invoiceEligible}
                                    className="mt-1"
                                />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-charcoal)]">Pay on Invoice</p>
                                    <p className="text-xs text-stone-500">Only for approved businesses with active credit terms.</p>
                                    {invoiceEligible ? (
                                        <p className="text-xs text-emerald-600 mt-1">Eligible. Available credit: {fmtAED(availableCredit)}</p>
                                    ) : (
                                        <p className="text-xs text-amber-700 mt-1">{invoiceReason ?? 'Not eligible for invoice checkout yet.'}</p>
                                    )}
                                    {!canAttemptInvoice && (
                                        <Link href="/business/apply" className="inline-block mt-2 text-xs font-semibold text-[var(--color-imperial)] hover:underline">
                                            Apply for business account
                                        </Link>
                                    )}
                                </div>
                            </label>
                        </div>
                    </section>

                    <button
                        type="button"
                        onClick={placeOrder}
                        disabled={placingOrder}
                        className="w-full py-3 bg-[var(--color-imperial)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition disabled:opacity-60"
                    >
                        {placingOrder ? 'Placing order...' : `Place Order (${fmtAED(summary.total)})`}
                    </button>
                </div>

                <aside className="bg-white rounded-2xl border border-stone-100 p-5 space-y-3 h-fit sticky top-20">
                    <h3 className="font-semibold text-sm text-[var(--color-charcoal)]">Order Summary</h3>
                    <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between text-stone-500">
                            <span>Subtotal ({summary.itemCount} items)</span>
                            <span>{fmtAED(summary.subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                            <span>Shipping</span>
                            <span>{summary.shippingFee === 0 ? <span className="text-[var(--color-zellige)]">Free</span> : fmtAED(summary.shippingFee)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500">
                            <span>VAT (5%)</span>
                            <span>{fmtAED(summary.vat)}</span>
                        </div>
                    </div>
                    <div className="pt-2 border-t flex justify-between font-bold text-[var(--color-charcoal)]">
                        <span>Total</span>
                        <span>{fmtAED(summary.total)}</span>
                    </div>
                    {checkoutMode === 'invoice' && (
                        <p className="text-xs text-stone-500">
                            This order will generate an invoice with your approved credit terms.
                        </p>
                    )}
                </aside>
            </div>
        </div>
    );
}
