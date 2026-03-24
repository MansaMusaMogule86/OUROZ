'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import type { LangCode } from '@/types/shop';

interface LangContextValue {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
}

const LangContext = createContext<LangContextValue>({ lang: 'en', setLang: () => {} });

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

export function useLang() {
  return useContext(LangContext);
}
