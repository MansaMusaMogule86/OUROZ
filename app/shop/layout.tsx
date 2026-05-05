import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import type { LangCode } from '@/types/shop';
import LanguageSwitcher from '@/components/shop/LanguageSwitcher';
import CartIconButton from '@/components/shop/CartIconButton';

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('ouroz_lang')?.value ?? 'en') as LangCode;

    return (
        <div className="min-h-screen bg-[#F5E6D3] text-[#1A1A1A] relative selection:bg-[#1A1A1A] selection:text-[#F5E6D3] overflow-x-hidden font-sans">
            
            {/* ── DESIGN SYSTEM OVERLAYS ── */}
            
            {/* 1. Grain Texture Overlay (Rule #1) */}
            <div className="fixed inset-0 z-[100] pointer-events-none opacity-[0.05] mix-blend-multiply" 
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>

            {/* 2. Paper Texture Overlay */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-[0.4] bg-[url('/images/sand-dunes.png')] bg-cover bg-center mix-blend-soft-light" />

            {/* ── NAVBAR ─────────────────────────────────────────────── */}
            <header className="sticky top-0 w-full z-[60] flex items-center justify-between px-10 md:px-14 py-6 bg-[#F5E6D3]/80 backdrop-blur-md border-b border-[#1A1A1A]/5">
                <Link href="/" className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full border border-[#1A1A1A]/20 flex items-center justify-center overflow-hidden bg-white">
                        <img src="/logo/logo.png" alt="OUROZ" className="w-[80%] h-[80%] object-contain" draggable={false} />
                    </div>
                    <span className="text-xl font-serif tracking-[0.3em] text-[#1A1A1A] uppercase font-bold">OUROZ</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-12">
                    <Link href="/shop" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A] transition-all">SHOP</Link>
                    <Link href="/supplier/register" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/40 hover:text-[#1A1A1A]">SUPPLIERS</Link>
                    <Link href="/journal" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/40 hover:text-[#1A1A1A]">JOURNAL</Link>
                    <Link href="/about" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/40 hover:text-[#1A1A1A]">ABOUT</Link>
                    <Link href="/contact" className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#1A1A1A]/40 hover:text-[#1A1A1A]">CONTACT</Link>
                </nav>

                <div className="flex items-center gap-4 pr-2">
                    <LanguageSwitcher />
                    <CartIconButton />
                </div>
            </header>

            {/* Page content */}
            <main className="relative z-10 max-w-[1600px] mx-auto px-6 md:px-14 py-12">
                {children}
            </main>
        </div>
    );
}
