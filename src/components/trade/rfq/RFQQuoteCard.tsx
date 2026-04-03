'use client';

import { clsx } from 'clsx';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import { formatCurrency } from '@/lib/trade/trade-utils';
import type { TradeQuote } from '@/types/trade';

interface RFQQuoteCardProps {
    quote: TradeQuote;
    isRecommended?: boolean;
    onSelect?: () => void;
}

const verificationBadge: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' | 'premium' }> = {
    gold: { label: 'Gold Verified', variant: 'premium' },
    verified: { label: 'Verified', variant: 'success' },
    basic: { label: 'Basic', variant: 'neutral' },
    trusted: { label: 'Trusted', variant: 'success' },
};

export default function RFQQuoteCard({ quote, isRecommended, onSelect }: RFQQuoteCardProps) {
    const vBadge = verificationBadge[quote.supplierVerification] || verificationBadge.basic;

    return (
        <TradeCard
            padding="none"
            className={clsx(isRecommended && 'ring-2 ring-amber-300/60')}
        >
            {isRecommended && (
                <div className="bg-amber-50 text-amber-700 text-[9px] font-semibold uppercase tracking-[0.2em] text-center py-1.5 border-b border-amber-200">
                    ✦ AI Recommended
                </div>
            )}

            <div className="p-5">
                {/* Supplier header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-sm font-semibold text-stone-900">{quote.supplierName}</h3>
                        <p className="text-[11px] text-stone-500 mt-0.5">{quote.supplierCity}, Morocco</p>
                        <TradeBadge label={vBadge.label} variant={vBadge.variant} className="mt-1.5" />
                    </div>
                    {quote.aiComparisonScore && (
                        <TradeScoreRing score={quote.aiComparisonScore} size={52} strokeWidth={4} label="Match" />
                    )}
                </div>

                {/* Price */}
                <div className="bg-stone-50 rounded-lg p-3 mb-4">
                    <div className="flex items-baseline justify-between">
                        <div>
                            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Unit Price</span>
                            <p
                                className="text-xl font-bold text-stone-900"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {formatCurrency(quote.unitPrice, quote.currency)}
                            </p>
                        </div>
                        <div className="text-right">
                            <span className="text-[9px] uppercase tracking-wider text-stone-500 font-semibold">Total</span>
                            <p className="text-sm font-semibold text-stone-700">
                                {formatCurrency(quote.totalPrice, quote.currency)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs mb-4">
                    <div>
                        <span className="text-stone-400">MOQ</span>
                        <p className="text-stone-700 font-medium">{quote.moq} units</p>
                    </div>
                    <div>
                        <span className="text-stone-400">Lead Time</span>
                        <p className="text-stone-700 font-medium">{quote.leadTimeDays} days</p>
                    </div>
                    <div>
                        <span className="text-stone-400">Incoterm</span>
                        <p className="text-stone-700 font-medium">{quote.incoterm}</p>
                    </div>
                    <div>
                        <span className="text-stone-400">Payment</span>
                        <p className="text-stone-700 font-medium">{quote.paymentTerms}</p>
                    </div>
                    <div>
                        <span className="text-stone-400">Sample</span>
                        <p className="text-stone-700 font-medium">
                            {quote.sampleAvailable
                                ? quote.samplePrice ? `${formatCurrency(quote.samplePrice, quote.currency)}` : 'Free'
                                : 'Not available'}
                        </p>
                    </div>
                    <div>
                        <span className="text-stone-400">Negotiable</span>
                        <p className="text-stone-700 font-medium">{quote.isNegotiable ? 'Yes' : 'Fixed'}</p>
                    </div>
                </div>

                {/* AI Notes */}
                {quote.aiNotes && (
                    <div className="text-[11px] text-stone-600 bg-amber-50/50 border border-amber-100 rounded-lg p-3 mb-4">
                        <span className="text-amber-600 font-semibold">AI:</span> {quote.aiNotes}
                    </div>
                )}

                {/* Action */}
                {onSelect && (
                    <button
                        onClick={onSelect}
                        className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                    >
                        Select Quote
                    </button>
                )}
            </div>
        </TradeCard>
    );
}
