
import React from 'react';
import { Product } from '../../types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartPageProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  onContinueShopping: () => void;
  onViewProduct: (product: Product) => void;
}

const CartPage: React.FC<CartPageProps> = ({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onContinueShopping,
  onViewProduct
}) => {
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 49;
  const total = subtotal + shipping;
  const currency = items[0]?.product.currency || 'AED';

  if (items.length === 0) {
    return (
      <div className="animate-fade-in flex flex-col items-center justify-center min-h-[60vh] space-y-8">
        <div className="w-32 h-32 rounded-full bg-sahara/50 flex items-center justify-center border border-gold/20">
          <span className="text-6xl font-serif text-gold/30">ⵣ</span>
        </div>
        <div className="text-center space-y-3">
          <h1 className="heading-vogue text-4xl text-henna">Your Cart is Empty</h1>
          <p className="text-henna/40 font-serif italic text-lg">Begin your journey through the Collective</p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-12 py-5 bg-henna text-white rounded-full heading-vogue text-[11px] tracking-[0.4em] hover:bg-majorelle transition-all shadow-luxury"
        >
          Explore Collective
        </button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 pb-32">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-vogue text-4xl text-henna">Your Cart</h1>
          <p className="text-henna/40 font-serif italic mt-2">{items.length} artifact{items.length !== 1 ? 's' : ''} selected</p>
        </div>
        <button
          onClick={onClearCart}
          className="text-[10px] font-bold text-red-400 uppercase tracking-widest hover:text-red-600 transition-colors"
        >
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="glass-vogue rounded-[2rem] p-6 border border-gold/10 flex gap-6 group hover:border-gold/30 transition-all">
              <div
                className="w-32 h-32 rounded-2xl overflow-hidden shrink-0 cursor-pointer bg-sahara/30"
                onClick={() => onViewProduct(product)}
              >
                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform" alt={product.name} />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[9px] font-black text-gold/50 uppercase tracking-[0.3em]">{product.category}</span>
                  <h3
                    className="heading-vogue text-lg text-henna cursor-pointer hover:text-gold transition-colors"
                    onClick={() => onViewProduct(product)}
                  >
                    {product.name}
                  </h3>
                  {product.origin && (
                    <p className="text-[10px] text-henna/30 font-medium mt-1">Origin: {product.origin}</p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border border-gold/20 rounded-full overflow-hidden">
                    <button
                      onClick={() => onUpdateQuantity(product.id, Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-henna hover:bg-sahara/50 transition-colors"
                    >
                      −
                    </button>
                    <span className="w-10 text-center font-bold text-henna text-sm">{quantity}</span>
                    <button
                      onClick={() => onUpdateQuantity(product.id, quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-henna hover:bg-sahara/50 transition-colors"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-6">
                    <span className="heading-vogue text-xl text-henna">
                      {(product.price * quantity).toFixed(0)} <span className="text-[9px] text-gold/60">{product.currency}</span>
                    </span>
                    <button
                      onClick={() => onRemoveItem(product.id)}
                      className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center hover:bg-red-100 transition-colors text-sm"
                    >
                      ×
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="glass-vogue rounded-[2rem] p-8 border border-gold/10 space-y-6 sticky top-32">
            <h2 className="heading-vogue text-xl text-henna">Order Summary</h2>

            <div className="space-y-4 border-b border-gold/10 pb-6">
              <div className="flex justify-between text-sm">
                <span className="text-henna/50">Subtotal</span>
                <span className="font-bold text-henna">{subtotal.toFixed(0)} {currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-henna/50">Shipping</span>
                <span className="font-bold text-henna">{shipping === 0 ? 'Free' : `${shipping} ${currency}`}</span>
              </div>
              {shipping > 0 && (
                <p className="text-[10px] text-gold/60 font-medium">Free shipping on orders over 500 {currency}</p>
              )}
            </div>

            <div className="flex justify-between items-baseline">
              <span className="heading-vogue text-sm text-henna/60 tracking-[0.2em]">Total</span>
              <span className="heading-vogue text-3xl text-henna tracking-tighter">
                {total.toFixed(0)} <span className="text-sm text-gold/60">{currency}</span>
              </span>
            </div>

            <button className="w-full py-5 bg-henna text-white rounded-full heading-vogue text-[11px] tracking-[0.4em] hover:bg-majorelle transition-all shadow-luxury active:scale-[0.98]">
              Proceed to Checkout
            </button>

            <button
              onClick={onContinueShopping}
              className="w-full py-4 border border-gold/20 text-henna rounded-full heading-vogue text-[10px] tracking-[0.3em] hover:bg-sahara/50 transition-all"
            >
              Continue Shopping
            </button>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              <div className="text-center p-3 rounded-xl bg-sahara/30 border border-gold/5">
                <p className="text-[8px] font-black text-gold/50 uppercase tracking-widest">Secure</p>
                <p className="text-[10px] font-bold text-henna">Payment</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-sahara/30 border border-gold/5">
                <p className="text-[8px] font-black text-gold/50 uppercase tracking-widest">Verified</p>
                <p className="text-[10px] font-bold text-henna">Artisans</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-sahara/30 border border-gold/5">
                <p className="text-[8px] font-black text-gold/50 uppercase tracking-widest">Global</p>
                <p className="text-[10px] font-bold text-henna">Shipping</p>
              </div>
              <div className="text-center p-3 rounded-xl bg-sahara/30 border border-gold/5">
                <p className="text-[8px] font-black text-gold/50 uppercase tracking-widest">14 Day</p>
                <p className="text-[10px] font-bold text-henna">Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
