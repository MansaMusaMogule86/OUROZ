import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-[var(--color-charcoal)] text-white/40 mt-20">
            {/* Gold editorial divider */}
            <div className="h-px bg-gradient-to-r from-transparent via-[var(--color-gold)]/20 to-transparent" />

            {/* Brand statement */}
            <div className="max-w-7xl mx-auto px-6 sm:px-10 pt-20 pb-6 text-center">
                <p className="text-white/10 font-serif text-lg md:text-xl italic tracking-wide" style={{ fontWeight: 300 }}>
                    &ldquo;من الأطلس إلى مائدتك&rdquo;
                </p>
                <p className="text-[9px] uppercase tracking-[0.4em] text-white/15 mt-2">
                    From the Atlas to your table
                </p>
            </div>

            <div className="max-w-7xl mx-auto px-6 sm:px-10 pb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                    {/* Brand */}
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="text-xl font-serif text-[var(--color-gold)]/40">ⵣ</span>
                            <span className="text-[13px] font-serif tracking-[0.18em] uppercase text-white/50" style={{ fontWeight: 300 }}>
                                OUROZ
                            </span>
                        </div>
                        <p className="text-xs leading-[1.8] text-white/20 max-w-[220px]">
                            Curated Moroccan provisions for the discerning table. Sourced with integrity, delivered with care.
                        </p>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/30 mb-5">
                            Collections
                        </h4>
                        <ul className="space-y-3 text-[12px]">
                            <li><Link href="/shop" className="text-white/35 hover:text-white/60 transition-colors duration-300">All Products</Link></li>
                            <li><Link href="/shop/oils-condiments" className="text-white/35 hover:text-white/60 transition-colors duration-300">Oils & Condiments</Link></li>
                            <li><Link href="/shop/tea-drinks" className="text-white/35 hover:text-white/60 transition-colors duration-300">Tea & Beverages</Link></li>
                            <li><Link href="/shop/spices-herbs" className="text-white/35 hover:text-white/60 transition-colors duration-300">Spices & Herbs</Link></li>
                            <li><Link href="/wholesale/apply" className="text-white/35 hover:text-white/60 transition-colors duration-300">Wholesale</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/30 mb-5">
                            Company
                        </h4>
                        <ul className="space-y-3 text-[12px]">
                            <li><Link href="/about" className="text-white/35 hover:text-white/60 transition-colors duration-300">About OUROZ</Link></li>
                            <li><Link href="/journal" className="text-white/35 hover:text-white/60 transition-colors duration-300">The Journal</Link></li>
                            <li><Link href="/contact" className="text-white/35 hover:text-white/60 transition-colors duration-300">Contact</Link></li>
                            <li><Link href="/faq" className="text-white/35 hover:text-white/60 transition-colors duration-300">FAQ</Link></li>
                            <li><Link href="/suppliers" className="text-white/35 hover:text-white/60 transition-colors duration-300">Become a Supplier</Link></li>
                        </ul>
                    </div>

                    {/* Account */}
                    <div>
                        <h4 className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/30 mb-5">
                            Account
                        </h4>
                        <ul className="space-y-3 text-[12px]">
                            <li><Link href="/auth/login" className="text-white/35 hover:text-white/60 transition-colors duration-300">Sign In</Link></li>
                            <li><Link href="/auth/signup" className="text-white/35 hover:text-white/60 transition-colors duration-300">Create Account</Link></li>
                            <li><Link href="/account" className="text-white/35 hover:text-white/60 transition-colors duration-300">My Account</Link></li>
                            <li><Link href="/wishlist" className="text-white/35 hover:text-white/60 transition-colors duration-300">Wishlist</Link></li>
                            <li><Link href="/cart" className="text-white/35 hover:text-white/60 transition-colors duration-300">Cart</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-white/[0.04] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-[9px] uppercase tracking-[0.25em] text-white/15">
                        &copy; {new Date().getFullYear()} OUROZ. All rights reserved.
                    </p>
                    <div className="flex items-center gap-8 text-[9px] uppercase tracking-[0.2em] text-white/15">
                        <Link href="/faq" className="hover:text-white/30 transition-colors duration-300">Privacy</Link>
                        <Link href="/faq" className="hover:text-white/30 transition-colors duration-300">Terms</Link>
                        <Link href="/faq" className="hover:text-white/30 transition-colors duration-300">Shipping</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
