'use client';
/**
 * WholesaleGate – guards the wholesale tab experience.
 * Shows appropriate CTA / status based on wholesale application state.
 */

import React from 'react';
import Link from 'next/link';
import { useLang } from '@/contexts/LangContext';
import type { WholesaleStatus } from '@/types/shop';

interface WholesaleGateProps {
    /** null = user has no application */
    applicationStatus: WholesaleStatus | null;
    /** Children = actual wholesale content */
    children?: React.ReactNode;
}

export default function WholesaleGate({ applicationStatus, children }: WholesaleGateProps) {
    const { t } = useLang();

    // Approved → show content
    if (applicationStatus === 'approved') return <>{children ?? null}</>;

    // Pending → show status message
    if (applicationStatus === 'pending') {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4 px-4">
                <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl">
                    ⏳
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">Application Under Review</h3>
                <p className="text-stone-500 max-w-sm">
                    Your wholesale application is being reviewed. We'll notify you by email within 1–2 business days.
                </p>
                <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                    <span>🕐</span> {t('wholesalePending')}
                </span>
            </div>
        );
    }

    // Rejected → show why + re-apply link
    if (applicationStatus === 'rejected') {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-4 px-4">
                <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl">
                    ❌
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-charcoal)]">Application Not Approved</h3>
                <p className="text-stone-500 max-w-sm">
                    Your application was not approved at this time. Please contact us for more information or re-apply with updated documentation.
                </p>
                <Link
                    href="/wholesale/apply"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl
                               bg-[var(--color-imperial)] text-white font-semibold text-sm
                               hover:bg-[var(--color-imperial)]/90 transition"
                >
                    {t('applyForWholesale')}
                </Link>
            </div>
        );
    }

    // No application → show CTA to apply
    return (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-5 px-4">
            <div className="w-20 h-20 rounded-full bg-[var(--color-zellige)]/10 flex items-center justify-center text-3xl">
                🏭
            </div>
            <div>
                <h3 className="text-2xl font-bold text-[var(--color-charcoal)] mb-2">
                    Wholesale for Moroccan Restaurants & Retailers in Dubai
                </h3>
                <p className="text-stone-500 max-w-md mx-auto">
                    Access competitive pricing, bulk order discounts, and exclusive products.
                    Apply with your trade license to get started.
                </p>
            </div>

            {/* Benefits */}
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg text-sm text-stone-600">
                {[
                    ['📦', 'Bulk pricing tiers'],
                    ['🚚', 'Priority delivery'],
                    ['📋', 'Invoice & credit terms'],
                    ['🤝', 'Dedicated account manager'],
                    ['🧾', 'VAT compliant invoices'],
                    ['🔄', 'Easy reordering'],
                ].map(([icon, label]) => (
                    <li key={label} className="flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2">
                        <span>{icon}</span> {label}
                    </li>
                ))}
            </ul>

            <Link
                href="/wholesale/apply"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl
                           bg-[var(--color-zellige)] text-white font-semibold
                           hover:bg-[var(--color-zellige)]/90 transition text-base"
            >
                {t('applyForWholesale')} →
            </Link>
        </div>
    );
}
