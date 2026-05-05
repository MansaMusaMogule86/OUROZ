import React from 'react';
import Link from 'next/link';
import Footer from '@/components/Footer';
import OurozBackground from '@/components/shared/OurozBackground';
import LanguageSwitcher from '@/components/shop/LanguageSwitcher';
import CartIconButton from '@/components/shop/CartIconButton';

export default function ShopLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen bg-[var(--color-sahara)] overflow-hidden">
            <OurozBackground showArch={false} showWatermark showDunes={false} />

            <div className="relative z-10 flex min-h-screen flex-col">
                {/* Shop header — canonical tokens, with cart + language controls */}
                <header className="sticky top-0 w-full z-[60] bg-[var(--color-sahara)]/85 backdrop-blur-md border-b border-[var(--color-charcoal)]/[0.04]">
                    <div className="max-w-[1440px] mx-auto flex items-center justify-between px-8 lg:px-14 h-[72px]">
                        <Link href="/" className="flex items-center gap-3 shrink-0">
                            <div className="w-8 h-8 rounded-full border border-[var(--color-charcoal)]/15 flex items-center justify-center overflow-hidden bg-white">
                                <img src="/logo/logo.png" alt="OUROZ" className="w-[82%] h-[82%] object-contain" draggable={false} />
                            </div>
                            <span
                                className="text-[15px] font-heading tracking-[0.35em] uppercase"
                                style={{ fontWeight: 600 }}
                            >
                                OUROZ
                            </span>
                        </Link>

                        <nav className="hidden lg:flex items-center gap-10">
                            <Link href="/shop" className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)] transition-colors duration-300">SHOP</Link>
                            <Link href="/suppliers" className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300">SUPPLIERS</Link>
                            <Link href="/journal" className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300">JOURNAL</Link>
                            <Link href="/about" className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300">ABOUT</Link>
                            <Link href="/contact" className="text-[10px] font-body font-bold uppercase tracking-[0.22em] text-[var(--color-charcoal)]/50 hover:text-[var(--color-charcoal)] transition-colors duration-300">CONTACT</Link>
                        </nav>

                        <div className="flex items-center gap-4 shrink-0">
                            <LanguageSwitcher />
                            <CartIconButton />
                        </div>
                    </div>
                </header>

                <main className="flex-1 max-w-[1400px] w-full mx-auto px-6 lg:px-14 py-10">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
}
