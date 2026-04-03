'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { LangCode } from '@/types/shop';

// Minimal translation dictionary — extend as strings are needed.
const TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  cart:          { en: 'Cart',          ar: 'السلة',       fr: 'Panier'   },
  checkout:      { en: 'Checkout',      ar: 'الدفع',       fr: 'Paiement' },
  subtotal:      { en: 'Subtotal',      ar: 'المجموع الفرعي', fr: 'Sous-total' },
  total:         { en: 'Total',         ar: 'الإجمالي',    fr: 'Total'    },
  remove:        { en: 'Remove',        ar: 'إزالة',       fr: 'Supprimer' },
  placeOrder:    { en: 'Place Order',   ar: 'تأكيد الطلب', fr: 'Commander' },
  continueShopping: { en: 'Continue Shopping', ar: 'مواصلة التسوق', fr: 'Continuer les achats' },
};

interface LangContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  /** Simple key-based translation. Falls back to the key if not found. */
  t: (key: string) => string;
  /** True when the current language is RTL (Arabic). */
  isRTL: boolean;
}

const LangContext = createContext<LangContextValue>({
  lang: 'en',
  setLang: () => {},
  t: (key) => key,
  isRTL: false,
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');

  const t = useCallback(
    (key: string) => TRANSLATIONS[key]?.[lang] ?? key,
    [lang],
  );

  const isRTL = lang === 'ar';

  return (
    <LangContext.Provider value={{ lang, setLang, t, isRTL }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
