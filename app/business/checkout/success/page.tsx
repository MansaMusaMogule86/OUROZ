'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Inner component — uses useSearchParams (must be inside Suspense)
// ---------------------------------------------------------------------------

function SuccessContent() {
  const params = useSearchParams();
  const orderNumber = params.get('order');

  return (
    <main className="min-h-screen bg-sahara flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-sm border border-sahara/60 p-10 max-w-md w-full text-center">

        {/* Icon */}
        <div className="w-16 h-16 rounded-full bg-zellige/10 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-zellige" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Headline */}
        <p className="text-xs font-semibold text-imperial uppercase tracking-widest mb-2">Order Confirmed</p>
        <h1 className="text-2xl font-serif font-semibold text-charcoal mb-2">Order placed!</h1>
        <p className="text-charcoal/60 text-sm mb-6">
          Your wholesale order has been received. Our team will process it shortly.
        </p>

        {/* Order number */}
        {orderNumber && (
          <div className="bg-sahara/70 rounded-xl px-6 py-4 mb-8">
            <p className="text-xs font-semibold text-charcoal/50 uppercase tracking-wide mb-1">Order Number</p>
            <p className="text-xl font-mono font-semibold text-charcoal">{orderNumber}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/business/dashboard"
            className="w-full text-center bg-imperial text-white text-sm font-semibold px-6 py-3 rounded-lg hover:bg-imperial/90 transition"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/business/invoices"
            className="w-full text-center border border-charcoal/20 text-charcoal text-sm font-semibold px-6 py-3 rounded-lg hover:bg-sahara transition"
          >
            View Invoices
          </Link>
          <Link
            href="/shop?mode=wholesale"
            className="w-full text-center text-sm text-charcoal/60 hover:text-charcoal transition py-2"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Footer note */}
        <p className="text-xs text-charcoal/40 mt-6">
          A confirmation will be sent to your registered email. If you selected invoice terms, your invoice is now active.
        </p>
      </div>
    </main>
  );
}

// ---------------------------------------------------------------------------
// Page — wrapped in Suspense for useSearchParams
// ---------------------------------------------------------------------------

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-sahara flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-sahara border-t-imperial animate-spin" />
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
