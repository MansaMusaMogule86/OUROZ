import React, { useMemo, useState } from 'react';
import { Product } from '../../types';

interface CartItem {
  product: Product;
  quantity: number;
}

interface CheckoutData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  notes: string;
}

interface CheckoutPageProps {
  items: CartItem[];
  onBack: () => void;
  onPlaceOrder: (order: CheckoutData) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ items, onBack, onPlaceOrder }) => {
  const [form, setForm] = useState<CheckoutData>({
    fullName: '',
    email: '',
    phone: '',
    country: 'UAE',
    city: '',
    address: '',
    notes: '',
  });

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items]
  );
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;
  const currency = items[0]?.product.currency || 'AED';

  const updateField = (field: keyof CheckoutData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    form.fullName.trim().length > 2 &&
    form.email.includes('@') &&
    form.phone.trim().length >= 6 &&
    form.city.trim().length > 1 &&
    form.address.trim().length > 5;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onPlaceOrder(form);
  };

  return (
    <div className="animate-fade-in space-y-10 pb-32">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-vogue text-4xl text-henna">Checkout</h1>
          <p className="text-henna/40 font-serif italic mt-2">Secure your selected artisan pieces</p>
        </div>
        <button
          onClick={onBack}
          className="px-6 py-3 border border-gold/30 rounded-full heading-vogue text-[10px] tracking-[0.3em] text-henna hover:bg-sahara/40 transition-all"
        >
          Back to Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 glass-vogue rounded-[2rem] p-8 border border-gold/10 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} placeholder="Full name" className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <input value={form.email} onChange={(e) => updateField('email', e.target.value)} placeholder="Email" className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <input value={form.phone} onChange={(e) => updateField('phone', e.target.value)} placeholder="Phone" className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <input value={form.country} onChange={(e) => updateField('country', e.target.value)} placeholder="Country" className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20" />
            <input value={form.city} onChange={(e) => updateField('city', e.target.value)} placeholder="City" className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20 md:col-span-2" />
            <textarea value={form.address} onChange={(e) => updateField('address', e.target.value)} placeholder="Shipping address" rows={3} className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20 md:col-span-2" />
            <textarea value={form.notes} onChange={(e) => updateField('notes', e.target.value)} placeholder="Order notes (optional)" rows={3} className="px-5 py-4 rounded-2xl border border-gold/20 bg-white/70 focus:outline-none focus:ring-2 focus:ring-gold/20 md:col-span-2" />
          </div>

          <button
            type="submit"
            disabled={!isValid}
            className="w-full py-5 rounded-full bg-henna text-white heading-vogue text-[11px] tracking-[0.35em] hover:bg-majorelle transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Place Order
          </button>
        </form>

        <div className="glass-vogue rounded-[2rem] p-8 border border-gold/10 space-y-5 h-fit sticky top-28">
          <h2 className="heading-vogue text-xl text-henna">Summary</h2>
          <div className="space-y-3 max-h-72 overflow-auto pr-1">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between text-sm border-b border-gold/10 pb-2">
                <span className="text-henna/70 line-clamp-1 pr-3">{product.name} × {quantity}</span>
                <span className="font-bold text-henna">{(product.price * quantity).toFixed(0)} {currency}</span>
              </div>
            ))}
          </div>
          <div className="pt-3 border-t border-gold/10 space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-henna/50">Subtotal</span><span className="text-henna font-bold">{subtotal.toFixed(0)} {currency}</span></div>
            <div className="flex justify-between"><span className="text-henna/50">Shipping</span><span className="text-henna font-bold">{shipping === 0 ? 'Free' : `${shipping} ${currency}`}</span></div>
            <div className="flex justify-between text-lg pt-2"><span className="heading-vogue text-henna">Total</span><span className="heading-vogue text-henna">{total.toFixed(0)} {currency}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
