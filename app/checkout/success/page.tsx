import Link from 'next/link';

type SearchParams = {
  order?: string;
  mode?: 'pay_now' | 'invoice' | string;
  invoice?: string;
  due?: string;
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const orderNumber = params.order ?? '—';
  const mode = params.mode ?? 'pay_now';
  const invoiceNumber = params.invoice;
  const dueDate = params.due;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      <div className="bg-white border border-stone-100 rounded-2xl p-8 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl mb-4">
          ✓
        </div>

        <h1 className="text-2xl font-semibold text-[var(--color-charcoal)]">Order placed successfully</h1>
        <p className="text-stone-500 mt-2">Thank you. Your order is now in our system.</p>

        <div className="mt-6 text-left bg-stone-50 border border-stone-100 rounded-xl p-4 space-y-2">
          <p className="text-sm text-stone-600">
            <span className="font-semibold text-stone-800">Order number:</span> {orderNumber}
          </p>
          <p className="text-sm text-stone-600 capitalize">
            <span className="font-semibold text-stone-800">Payment mode:</span> {mode === 'invoice' ? 'Pay on Invoice' : 'Pay Now'}
          </p>
          {mode === 'invoice' && invoiceNumber && (
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Invoice:</span> {invoiceNumber}
            </p>
          )}
          {mode === 'invoice' && dueDate && (
            <p className="text-sm text-stone-600">
              <span className="font-semibold text-stone-800">Due date:</span> {new Date(dueDate).toLocaleDateString('en-AE')}
            </p>
          )}
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/shop"
            className="px-5 py-2.5 rounded-xl bg-[var(--color-imperial)] text-white text-sm font-semibold hover:bg-[var(--color-imperial)]/90 transition"
          >
            Continue Shopping
          </Link>
          <Link
            href="/business/dashboard"
            className="px-5 py-2.5 rounded-xl border border-stone-200 text-stone-700 text-sm font-semibold hover:bg-stone-50 transition"
          >
            Open Business Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
