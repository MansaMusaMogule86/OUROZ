'use client';
/**
 * ShopTabs – "Shop for Home" vs "For Businesses"
 * Single visual switch at the top of /shop.
 * Drives which price tier and CTA is shown.
 */

import React from 'react';
import { HomeIcon, BuildingStorefrontIcon } from '@heroicons/react/24/outline';
import { useLang } from '@/contexts/LangContext';

export type ShopMode = 'retail' | 'wholesale';

interface ShopTabsProps {
    mode: ShopMode;
    onChange: (mode: ShopMode) => void;
    className?: string;
}

export default function ShopTabs({ mode, onChange, className = '' }: ShopTabsProps) {
    const { t } = useLang();

    const tabs: { id: ShopMode; label: string; icon: React.ReactNode }[] = [
        {
            id: 'retail',
            label: t('shopForHome'),
            icon: <HomeIcon className="w-4 h-4" />,
        },
        {
            id: 'wholesale',
            label: t('forBusinesses'),
            icon: (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
                </svg>
            ),
        },
    ];

    return (
        <div className={`flex bg-stone-100 rounded-xl p-1 gap-1 ${className}`}>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`
                        flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                        rounded-lg text-sm font-semibold transition-all duration-200
                        ${mode === tab.id
                            ? 'bg-white text-[var(--color-imperial)] shadow-sm ring-1 ring-[var(--color-imperial)]/20'
                            : 'text-stone-500 hover:text-stone-700'
                        }
                    `}
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
