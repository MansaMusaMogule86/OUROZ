'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import type { Business, CreditAccount, PaymentMethod } from '@/types/business';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function Spinner() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="w-8 h-8 rounded-full border-2 border-sahara border-t-imperial animate-spin" />
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="border border-imperial/40 bg-imperial/5 rounded-lg px-4 py-3 text-sm text-imperial">
      {message}
    </div>
  );
}

function fmtAED(n: number) {
  return `AED ${n.toLocaleString('en-AE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function addDays(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

function fmtDate(d: Date) {
  return d.toLocaleDateString('en-AE', { day: '2-digit', month: 'short', year: 'numeric' });
}

// ---------------------------------------------------------------------------
// Cart item type (from localStorage)
// ---------------------------------------------------------------------------

interface CartItem {
  variant_id: string;
  qty: number;
  product_name: string;
  variant_sku: string;
  variant_label: string | null;
  image_url: string | null;
  unit_price: number;
  line_total: number;
}

// ---------------------------------------------------------------------------
// Shipping form data
// ---------------------------------------------------------------------------

interface ShippingForm {
  name: string;
  phone: string;
  address: string;
  emirate: string;
}

const EMPTY_SHIPPING: ShippingForm = {
  name: '',
  phone: '',
  address: '',
  emirate: 'Dubai',
};

const EMIRATES = [
  'Dubai',
  'Abu Dhabi',
  'Sharjah',
  'Ajman',
  'Ras Al Khaimah',
  'Fujairah',
  'Umm Al Quwain',
];

// ---------------------------------------------------------------------------
// Credit eligibility state
// ---------------------------------------------------------------------------

interface CreditCheck {
  loading: boolean;
  can_use_invoice: boolean;
  reason: string | null;
  available_credit: number;
  terms_days: number;
  has_overdue: boolean;
}

const INIT_CREDIT_CHECK: CreditCheck = {
  loading: true,
  can_use_invoice: false,
  reason: null,
  available_credit: 0,
  terms_days: 30,
  has_overdue: false,
};

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function BusinessCheckoutPage() {
  const router = useRouter();

  const [initLoading, setInitLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userId, setUserId] = useState<string | null>(null);
  const [business, setBusiness] = useState<Business | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [shipping, setShipping] = useState<ShippingForm>(EMPTY_SHIPPING);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [creditCheck, setCreditCheck] = useState<CreditCheck>(INIT_CREDIT_CHECK);

  // Derived totals
  const subtotal = cartItems.reduce((s, i) => s + i.line_total, 0);
  const vatAmount = subtotal * 0.05;
  const total = subtotal + vatAmount;

  // ---------------------------------------------------------------------------
  // Init: auth + business + cart + credit check
  // ---------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setInitLoading(false); return; }
        setUserId(user.id);

        // Business
        const { data: biz, error: bizErr } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_user_id', user.id)
          .maybeSingle();

        if (bizErr) throw bizErr;
        if (!biz || (biz as Business).status !== 'approved') {
          setBusiness(biz as Business | null);
          setInitLoading(false);
          return;
        }

        const typedBiz = biz as Business;
        setBusiness(typedBiz);

        // Cart from localStorage
        try {
          const raw = localStorage.getItem('ouroz_guest_cart');
          if (raw) {
            const parsed = JSON.parse(raw) as CartItem[];
            if (Array.isArray(parsed)) setCartItems(parsed);
          }
        } catch { /* malformed storage */ }

        // Credit check
        loadCreditCheck(typedBiz.id);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialise checkout.');
      } finally {
        setInitLoading(false);
      }
    })();
  }, []);

  async function loadCreditCheck(businessId: string) {
    setCreditCheck(prev => ({ ...prev, loading: true }));
    try {
      const [creditRes, overdueRes, availableRes] = await Promise.all([
        supabase.from('credit_accounts').select('status, terms_days').eq('business_id', businessId).eq('status', 'active').maybeSingle(),
        supabase.rpc('has_overdue_invoices', { p_business_id: businessId }),
        supabase.rpc('get_available_credit', { p_business_id: businessId }),
      ]);

      const account = creditRes.data as { status: string; terms_days: number } | null;
      const hasOverdue = Boolean(overdueRes.data);
      const available = Number(availableRes.data ?? 0);
      const terms_days = account?.terms_days ?? 30;

      if (!account) {
        setCreditCheck({ loading: false, can_use_invoice: false, reason: 'No active credit account. Contact your account manager.', available_credit: 0, terms_days: 30, has_overdue: false });
        return;
      }
      if (hasOverdue) {
        setCreditCheck({ loading: false, can_use_invoice: false, reason: 'Credit on hold — clear overdue invoices first.', available_credit: available, terms_days, has_overdue: true });
        return;
      }
      setCreditCheck({ loading: false, can_use_invoice: true, reason: null, available_credit: available, terms_days, has_overdue: false });
    } catch {
      setCreditCheck({ loading: false, can_use_invoice: false, reason: 'Could not verify credit status.', available_credit: 0, terms_days: 30, has_overdue: false });
    }
  }

  // ---------------------------------------------------------------------------
  // Shipping helpers
  // ---------------------------------------------------------------------------

  function setField(field: keyof ShippingForm, value: string) {
    setShipping(prev => ({ ...prev, [field]: value }));
  }

  function validateShipping(): string | null {
    if (!shipping.name.trim()) return 'Delivery name is required.';
    if (!shipping.phone.trim()) return 'Contact phone is required.';
    if (!shipping.address.trim()) return 'Delivery address is required.';
    return null;
  }

  // ---------------------------------------------------------------------------
  // Place order
  // ---------------------------------------------------------------------------

  async function handlePlaceOrder() {
    if (!userId || !business) return;

    const shippingErr = validateShipping();
    if (shippingErr) { setError(shippingErr); return; }

    if (cartItems.length === 0) { setError('Your cart is empty.'); return; }

    if (paymentMethod === 'invoice') {
      if (!creditCheck.can_use_invoice) {
        setError(creditCheck.reason ?? 'Invoice payment not available.');
        return;
      }
      if (total > creditCheck.available_credit) {
        setError(`Insufficient credit. Available: ${fmtAED(creditCheck.available_credit)}, Order total: ${fmtAED(total)}.`);
        return;
      }
    }

    setPlacing(true);
    setError(null);

    try {
      // Generate order number
      const { data: orderNumber, error: onErr } = await supabase.rpc('generate_order_number');
      if (onErr || !orderNumber) throw new Error('Failed to generate order number.');

      // Create order
      const { data: order, error: orderErr } = await supabase
        .from('orders')
        .insert({
          user_id:          userId,
          business_id:      business.id,
          order_number:     orderNumber as string,
          subtotal,
          shipping_cost:    0,
          vat_amount:       vatAmount,
          total,
          currency:         'AED',
          is_wholesale:     true,
          payment_method:   paymentMethod,
          status:           'pending',
          shipping_name:    shipping.name,
          shipping_phone:   shipping.phone,
          shipping_address: shipping.address,
          shipping_emirate: shipping.emirate,
        })
        .select('id')
        .single();

      if (orderErr || !order) throw new Error(orderErr?.message ?? 'Failed to create order.');

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id:          order.id,
        variant_id:        item.variant_id,
        product_name:      item.product_name,
        variant_sku:       item.variant_sku,
        variant_label:     item.variant_label,
        product_image_url: item.image_url,
        price_at_purchase: item.unit_price,
        quantity:          item.qty,
        line_total:        item.line_total,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) throw new Error(itemsErr.message);

      // Invoice flow
      let invoiceId: string | undefined;

      if (paymentMethod === 'invoice') {
        const { data: invNumber, error: invNumErr } = await supabase.rpc('generate_invoice_number');
        if (invNumErr || !invNumber) throw new Error('Failed to generate invoice number.');

        const dueDate = addDays(creditCheck.terms_days);
        const dueDateStr = dueDate.toISOString().split('T')[0];

        const { data: invoice, error: invErr } = await supabase
          .from('invoices')
          .insert({
            business_id:    business.id,
            order_id:       order.id,
            invoice_number: invNumber as string,
            subtotal,
            tax_amount:     vatAmount,
            total,
            amount_paid:    0,
            due_date:       dueDateStr,
            status:         'issued',
          })
          .select('id')
          .single();

        if (invErr || !invoice) throw new Error(invErr?.message ?? 'Failed to create invoice.');
        invoiceId = invoice.id;

        // Link invoice to order
        await supabase.from('orders').update({ invoice_id: invoiceId }).eq('id', order.id);

        // Post ledger charge
        await supabase.rpc('post_ledger_entry', {
          p_business_id: business.id,
          p_type:        'charge',
          p_amount:      total,
          p_order_id:    order.id,
          p_invoice_id:  invoiceId,
          p_note:        `Invoice ${invNumber as string}`,
        });
      }

      // Clear cart
      localStorage.removeItem('ouroz_guest_cart');

      // Redirect to success
      router.push(`/business/checkout/success?order=${orderNumber as string}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Checkout failed. Please try again.');
      setPlacing(false);
    }
  }

  // ---------------------------------------------------------------------------
  // Invoice eligibility for current total
  // ---------------------------------------------------------------------------

  const invoiceBlocked = !creditCheck.can_use_invoice;
  const insufficientCredit = creditCheck.can_use_invoice && total > creditCheck.available_credit;
  const invoiceUnavailable = invoiceBlocked || insufficientCredit;
  const dueDate = addDays(creditCheck.terms_days);

  // ---------------------------------------------------------------------------
  // Guard states
  // ---------------------------------------------------------------------------

  if (initLoading) return <Spinner />;

  if (!userId) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Sign in required</h2>
          <p className="text-charcoal/60 text-sm mb-6">Sign in to complete your B2B order.</p>
          <Link href="/auth/login?return=/business/checkout" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  if (!business || business.status !== 'approved') {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Approved business required</h2>
          <p className="text-charcoal/60 text-sm mb-6">B2B checkout is available to approved business accounts only.</p>
          <Link href="/business/apply" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Apply Now
          </Link>
        </div>
      </main>
    );
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">
          <h2 className="text-xl font-semibold text-charcoal mb-2">Your cart is empty</h2>
          <p className="text-charcoal/60 text-sm mb-6">Add products to your cart before proceeding to checkout.</p>
          <Link href="/shop?mode=wholesale" className="inline-block bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition">
            Browse Products
          </Link>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------------------------
  // Full checkout view
  // ---------------------------------------------------------------------------

  return (
    <main className="min-h-screen bg-sahara">
      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-imperial uppercase tracking-widest mb-1">{business.name}</p>
          <h1 className="text-2xl font-serif font-semibold text-charcoal">B2B Checkout</h1>
        </div>

        {error && <div className="mb-6"><ErrorBox message={error} /></div>}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left: shipping + payment */}
          <div className="lg:col-span-2 space-y-6">

            {/* Shipping */}
            <section className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-6">
              <h2 className="text-base font-semibold text-charcoal mb-5">Delivery Information</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField label="Full Name" required>
                    <input type="text" value={shipping.name} onChange={e => setField('name', e.target.value)} placeholder="Recipient name" className={inputClass} />
                  </FormField>
                  <FormField label="Contact Phone" required>
                    <input type="tel" value={shipping.phone} onChange={e => setField('phone', e.target.value)} placeholder="+971 50 000 0000" className={inputClass} />
                  </FormField>
                </div>
                <FormField label="Delivery Address" required>
                  <textarea value={shipping.address} onChange={e => setField('address', e.target.value)} rows={2} placeholder="Building, street, area" className={`${inputClass} resize-none`} />
                </FormField>
                <FormField label="Emirate" required>
                  <select value={shipping.emirate} onChange={e => setField('emirate', e.target.value)} className={inputClass}>
                    {EMIRATES.map(em => <option key={em} value={em}>{em}</option>)}
                  </select>
                </FormField>
              </div>
            </section>

            {/* Payment method */}
            <section className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-6">
              <h2 className="text-base font-semibold text-charcoal mb-5">Payment Method</h2>

              {/* Pay Now options */}
              <div className="mb-5">
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-3">Pay Now</p>
                <div className="space-y-2">
                  {(['card', 'bank_transfer', 'cash'] as PaymentMethod[]).map(method => (
                    <PaymentOption
                      key={method}
                      method={method}
                      label={methodLabel(method)}
                      selected={paymentMethod === method}
                      onSelect={() => setPaymentMethod(method)}
                      disabled={false}
                    />
                  ))}
                </div>
                <p className="text-xs text-charcoal/40 mt-2 ml-7">Payment gateway integration coming soon.</p>
              </div>

              {/* Pay on Invoice */}
              <div>
                <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-3">Pay on Invoice</p>
                {creditCheck.loading ? (
                  <div className="flex items-center gap-2 text-sm text-charcoal/50">
                    <span className="w-4 h-4 rounded-full border-2 border-sahara border-t-charcoal/30 animate-spin" />
                    Checking credit status...
                  </div>
                ) : (
                  <div>
                    <PaymentOption
                      method="invoice"
                      label="Invoice (Net terms)"
                      selected={paymentMethod === 'invoice'}
                      onSelect={() => !invoiceUnavailable && setPaymentMethod('invoice')}
                      disabled={invoiceUnavailable}
                    />

                    {/* Invoice details / messages */}
                    {!invoiceBlocked && !insufficientCredit && (
                      <div className="ml-7 mt-2 bg-zellige/5 border border-zellige/20 rounded-lg px-4 py-3 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-charcoal/60">Available credit</span>
                          <span className="font-semibold text-zellige">{fmtAED(creditCheck.available_credit)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-charcoal/60">Net {creditCheck.terms_days} — due by</span>
                          <span className="font-semibold text-charcoal">{fmtDate(dueDate)}</span>
                        </div>
                      </div>
                    )}

                    {invoiceBlocked && !insufficientCredit && creditCheck.reason && (
                      <p className="ml-7 mt-2 text-xs text-imperial">{creditCheck.reason}</p>
                    )}

                    {insufficientCredit && (
                      <p className="ml-7 mt-2 text-xs text-imperial">
                        Insufficient credit (available: {fmtAED(creditCheck.available_credit)})
                      </p>
                    )}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Right: order summary */}
          <div className="space-y-6">
            <section className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-6">
              <h2 className="text-base font-semibold text-charcoal mb-4">Order Summary</h2>

              <div className="space-y-3 mb-5">
                {cartItems.map(item => (
                  <div key={item.variant_id} className="flex items-start gap-3">
                    {item.image_url ? (
                      <img src={item.image_url} alt={item.product_name} className="w-12 h-12 rounded-lg object-cover border border-sahara/60 shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-sahara shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-charcoal line-clamp-1">{item.product_name}</p>
                      {item.variant_label && <p className="text-xs text-charcoal/50">{item.variant_label}</p>}
                      <p className="text-xs text-charcoal/60 mt-0.5">Qty {item.qty} × {fmtAED(item.unit_price)}</p>
                    </div>
                    <p className="text-sm font-semibold text-charcoal shrink-0">{fmtAED(item.line_total)}</p>
                  </div>
                ))}
              </div>

              <div className="border-t border-sahara/60 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-charcoal/70">
                  <span>Subtotal</span>
                  <span>{fmtAED(subtotal)}</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-charcoal/70">
                  <span>VAT (5%)</span>
                  <span>{fmtAED(vatAmount)}</span>
                </div>
                <div className="flex justify-between font-semibold text-charcoal text-base pt-2 border-t border-sahara/60">
                  <span>Total</span>
                  <span>{fmtAED(total)}</span>
                </div>
              </div>
            </section>

            {/* Place order button */}
            <button
              onClick={handlePlaceOrder}
              disabled={placing}
              className="w-full bg-imperial text-white text-sm font-semibold px-6 py-4 rounded-xl hover:bg-imperial/90 transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {placing && (
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
              )}
              {placing ? 'Placing Order...' : 'Place Order'}
            </button>

            <p className="text-center text-xs text-charcoal/40">
              By placing this order you agree to OUROZ commercial terms.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Payment option row
// ---------------------------------------------------------------------------

function PaymentOption({
  method,
  label,
  selected,
  disabled,
  onSelect,
}: {
  method: string;
  label: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg border text-sm text-left transition ${
        selected
          ? 'border-imperial bg-imperial/5 text-charcoal'
          : disabled
          ? 'border-charcoal/10 bg-charcoal/5 text-charcoal/35 cursor-not-allowed'
          : 'border-charcoal/15 hover:border-imperial/40 text-charcoal'
      }`}
    >
      <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selected ? 'border-imperial' : 'border-charcoal/30'}`}>
        {selected && <span className="w-2 h-2 rounded-full bg-imperial" />}
      </span>
      <span className="font-medium">{label}</span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Form field wrapper
// ---------------------------------------------------------------------------

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-charcoal/70 uppercase tracking-wide mb-1.5">
        {label}{required && <span className="text-imperial ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function methodLabel(method: PaymentMethod | string): string {
  const map: Record<string, string> = {
    card: 'Credit / Debit Card',
    bank_transfer: 'Bank Transfer',
    cash: 'Cash on Delivery',
    invoice: 'Invoice (Net terms)',
    cheque: 'Cheque',
  };
  return map[method] ?? method;
}

const inputClass =
  'w-full rounded-lg border border-charcoal/15 bg-sahara/30 px-4 py-2.5 text-sm text-charcoal placeholder-charcoal/35 focus:outline-none focus:ring-2 focus:ring-imperial/25 focus:border-imperial/40 transition';
