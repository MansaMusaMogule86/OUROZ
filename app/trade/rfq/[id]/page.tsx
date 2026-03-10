'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import TradeCard, { TradeCardHeader, TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeTabs from '@/components/trade/shared/TradeTabs';
import TradeAIInsight from '@/components/trade/shared/TradeAIInsight';
import RFQQuoteCard from '@/components/trade/rfq/RFQQuoteCard';
import RFQComparisonTable from '@/components/trade/rfq/RFQComparisonTable';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { RFQ_STATUS_CONFIG } from '@/lib/trade/trade-constants';
import { formatCurrency, formatDate, daysUntil } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeRfqById } from '@/lib/trade/trade-service';

export default function RFQDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [view, setView] = useState('quotes');
    const { data: rfq, loading, error, refetch } = useTradeData(() => fetchTradeRfqById(id), null);

    if (loading) return <TradeLoadingState message="Loading RFQ..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    if (!rfq) {
        return (
            <div className="py-20 text-center">
                <p className="text-stone-500">RFQ not found</p>
                <Link href="/trade/rfq" className="text-sm text-stone-700 underline mt-2 inline-block">
                    Back to RFQ list
                </Link>
            </div>
        );
    }

    const statusConfig = RFQ_STATUS_CONFIG[rfq.status];
    const remaining = daysUntil(rfq.expiresAt);

    const viewTabs = [
        { id: 'quotes', label: 'Quotes', count: rfq.quotes.length },
        { id: 'compare', label: 'Compare' },
        { id: 'details', label: 'Details' },
    ];

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Breadcrumb link */}
            <Link href="/trade/rfq" className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to RFQ Engine
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-stone-400">{rfq.rfqNumber}</span>
                        <TradeBadge label={statusConfig.label} variant={statusConfig.variant} dot />
                    </div>
                    <h1
                        className="text-xl font-bold text-stone-900"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {rfq.title}
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        {rfq.quantity} {rfq.quantityUnit} · {rfq.incoterm} · {rfq.destinationPort}
                    </p>
                </div>
                <div className="text-right">
                    {rfq.targetPricePerUnit && (
                        <p className="text-lg font-bold text-stone-800" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                            {formatCurrency(rfq.targetPricePerUnit, rfq.targetCurrency)}<span className="text-xs text-stone-500 font-normal">/{rfq.quantityUnit.replace(/s$/, '')}</span>
                        </p>
                    )}
                    <p className="text-[10px] text-stone-400 mt-1">
                        Created {formatDate(rfq.createdAt)} · {remaining > 0 ? `${remaining}d remaining` : 'Expired'}
                    </p>
                </div>
            </div>

            {/* AI suggestions */}
            {rfq.aiSuggestions && rfq.aiSuggestions.length > 0 && (
                <TradeAIInsight
                    title="AI Procurement Assistant"
                    content={rfq.aiSuggestions.join(' ')}
                    type="recommendation"
                />
            )}

            {/* Stats bar */}
            <div className="grid grid-cols-4 gap-4">
                <TradeCard padding="sm">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Quotes</p>
                    <p className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{rfq.quoteCount}</p>
                </TradeCard>
                <TradeCard padding="sm">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Views</p>
                    <p className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{rfq.viewCount}</p>
                </TradeCard>
                <TradeCard padding="sm">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">AI Score</p>
                    <p className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{rfq.aiScore || '—'}</p>
                </TradeCard>
                <TradeCard padding="sm">
                    <p className="text-[9px] font-semibold uppercase tracking-wider text-stone-500">Category</p>
                    <p className="text-sm font-medium text-stone-700 mt-0.5">{rfq.category}</p>
                </TradeCard>
            </div>

            {/* View tabs */}
            <TradeTabs tabs={viewTabs} activeTab={view} onTabChange={setView} />

            {/* Tab content */}
            {view === 'quotes' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {rfq.quotes.length === 0 ? (
                        <div className="lg:col-span-2 py-12 text-center text-sm text-stone-400">
                            No quotes received yet
                        </div>
                    ) : (
                        rfq.quotes.map((quote, i) => (
                            <RFQQuoteCard
                                key={quote.id}
                                quote={quote}
                                isRecommended={i === 0 && (quote.aiComparisonScore || 0) >= 90}
                            />
                        ))
                    )}
                </div>
            )}

            {view === 'compare' && (
                <TradeCard padding="none">
                    {rfq.quotes.length > 0 ? (
                        <RFQComparisonTable quotes={rfq.quotes} />
                    ) : (
                        <div className="py-12 text-center text-sm text-stone-400">
                            Need at least 2 quotes to compare
                        </div>
                    )}
                </TradeCard>
            )}

            {view === 'details' && (
                <TradeCard padding="lg">
                    <TradeCardHeader>
                        <TradeCardTitle>Requirements</TradeCardTitle>
                    </TradeCardHeader>
                    <p className="text-sm text-stone-700 leading-relaxed mb-6">{rfq.detailedRequirements}</p>

                    <TradeCardTitle className="mb-3">Specifications</TradeCardTitle>
                    <div className="grid grid-cols-2 gap-3">
                        {rfq.specifications.map((spec) => (
                            <div key={spec.key} className="bg-stone-50 rounded-lg px-4 py-2.5">
                                <span className="text-[10px] uppercase tracking-wider text-stone-500 font-semibold">{spec.key}</span>
                                <p className="text-sm text-stone-800 font-medium mt-0.5">{spec.value}</p>
                            </div>
                        ))}
                    </div>
                </TradeCard>
            )}
        </div>
    );
}
