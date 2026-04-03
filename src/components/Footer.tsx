import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[var(--color-charcoal)] py-14 text-white/40">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 sm:px-10 md:grid-cols-4">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10">
              <span className="font-heading text-sm text-[var(--color-gold)]/50">&#11581;</span>
            </div>
            <span className="font-heading text-sm uppercase tracking-[0.3em] text-white/60">OUROZ</span>
          </div>
          <p className="text-xs leading-relaxed text-white/25">
            Authentic Moroccan products, delivered across the UAE.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Shop</h4>
          <div className="space-y-2.5 text-xs">
            <Link href="/shop" className="block transition-colors hover:text-white/70">All Products</Link>
            <Link href="/wholesale/apply" className="block transition-colors hover:text-white/70">Wholesale</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Sell</h4>
          <div className="space-y-2.5 text-xs">
            <Link href="/supplier/register" className="block transition-colors hover:text-white/70">Become a Supplier</Link>
            <Link href="/suppliers" className="block transition-colors hover:text-white/70">Supplier Directory</Link>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-[10px] font-bold uppercase tracking-[0.2em] text-white/50">Account</h4>
          <div className="space-y-2.5 text-xs">
            <Link href="/auth/login" className="block transition-colors hover:text-white/70">Sign In</Link>
            <Link href="/about" className="block transition-colors hover:text-white/70">About</Link>
            <Link href="/journal" className="block transition-colors hover:text-white/70">Journal</Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/[0.06] px-6 pt-6 text-center text-[10px] uppercase tracking-[0.2em] text-white/15 sm:px-10">
        <p>&copy; {new Date().getFullYear()} OUROZ. All rights reserved.</p>
      </div>
    </footer>
  );
}
