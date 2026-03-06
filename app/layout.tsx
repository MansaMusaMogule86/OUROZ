/**
 * OUROZ – Root App Layout
 * Wraps the entire app with global providers.
 * Preserves existing design system from globals.css.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { LangProvider } from '@/contexts/LangContext';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/shop/CartDrawer';

// Reuse existing globals (design system tokens)
import '../ouroz-engine/src/app/globals.css';

const geistSans = Geist({ variable: '--font-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'OUROZ – Authentic Moroccan Products in Dubai',
    description: 'Premium Moroccan groceries, spices and artisan products delivered in Dubai. Shop retail or wholesale.',
    openGraph: {
        siteName: 'OUROZ',
        locale: 'en_AE',
        alternateLocale: ['ar_AE', 'fr_FR'],
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geistSans.variable} ${geistMono.variable} bg-[var(--color-sahara)] antialiased`}>
                <LangProvider>
                    <CartProvider>
                        {children}
                        {/* Cart drawer lives here so it's always accessible */}
                        <CartDrawer />
                    </CartProvider>
                </LangProvider>
            </body>
        </html>
    );
}
