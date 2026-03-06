import React from 'react';

interface OrderSuccessPageProps {
  orderId: string;
  onContinueShopping: () => void;
}

const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ orderId, onContinueShopping }) => {
  return (
    <div className="animate-fade-in min-h-[60vh] flex items-center justify-center">
      <div className="max-w-2xl w-full glass-vogue rounded-[2.5rem] p-12 border border-gold/20 text-center space-y-8">
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-4xl">✓</div>
        <div className="space-y-3">
          <h1 className="heading-vogue text-4xl text-henna">Order Confirmed</h1>
          <p className="text-henna/50 font-serif italic text-lg">Thank you for shopping with OUROZ. Your curated order has been received.</p>
          <p className="text-[11px] uppercase tracking-[0.35em] text-gold font-black">Order ID: {orderId}</p>
        </div>
        <button
          onClick={onContinueShopping}
          className="px-10 py-4 rounded-full bg-henna text-white heading-vogue text-[10px] tracking-[0.35em] hover:bg-majorelle transition-all"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
