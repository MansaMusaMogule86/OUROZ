'use client';
/**
 * LanguageSwitcher – AR / FR / EN
 * Stores preference in localStorage + cookie.
 */

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import type { LangCode } from '@/types/shop';

const LANGS: { code: LangCode; label: string; flag: string }[] = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ar', label: 'ع', flag: '🇲🇦' },
    { code: 'fr', label: 'FR', flag: '🇫🇷' },
];

export default function LanguageSwitcher() {
    const { lang, setLang } = useLang();

    return (
        <div className="flex items-center gap-1 bg-[var(--color-sahara)] border border-stone-200 rounded-lg p-1">
            {LANGS.map(({ code, label, flag }) => (
                <button
                    key={code}
                    onClick={() => setLang(code)}
                    aria-label={`Switch to ${label}`}
                    className={`
                        flex items-center gap-1 px-2.5 py-1.5 rounded-md text-sm font-medium
                        transition-all duration-150
                        ${lang === code
                            ? 'bg-[var(--color-imperial)] text-white shadow-sm'
                            : 'text-[var(--color-charcoal)] hover:bg-stone-200'
                        }
                    `}
                >
                    <span className="text-base leading-none">{flag}</span>
                    <span>{label}</span>
                </button>
            ))}
        </div>
    );
}
