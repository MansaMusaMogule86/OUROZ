import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import { LangProvider } from '@/contexts/LangContext';
import { CartProvider } from '@/contexts/CartContext';
import CartDrawer from '@/components/shop/CartDrawer';
import { ToastProvider } from '@/components/ui/Toast';

import './globals.css';

const cormorant = Cormorant_Garamond({
  variable: '--font-heading',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'OUROZ – Moroccan Provisions from the Atlas',
  description: 'Premium Moroccan spices, oils, teas, and artisan goods sourced directly from cooperatives and family producers across Morocco.',
  icons: {
    icon: '/logo/logo.png',
    shortcut: '/logo/logo.png',
    apple: '/logo/logo.png',
  },
  openGraph: {
    siteName: 'OUROZ',
    locale: 'en_AE',
    alternateLocale: ['ar_AE', 'fr_FR'],
    images: ['/logo/logo.png'],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${cormorant.variable} ${manrope.variable} antialiased font-body`}
      >
        <LangProvider>
          <CartProvider>
            <ToastProvider>
              {children}
              <CartDrawer />
            </ToastProvider>
          </CartProvider>
        </LangProvider>
      </body>
    </html>
  );
}
