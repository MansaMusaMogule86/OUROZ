'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeTabs from '@/components/trade/shared/TradeTabs';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { RFQ_STATUS_CONFIG } from '@/lib/trade/trade-constants';
import { formatDate, formatCurrency, daysUntil } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeRfqs } from '@/lib/trade/trade-service';

export default function RFQListPage() {
    const { data: rfqs, loading, error, refetch } = useTradeData(() => fetchTradeRfqs(), []);
    const [activeTab, setActiveTab] = useState('all');

    const tabs = useMemo(() => [
        { id: 'all', label: 'All', count: rfqs.length },
        { id: 'open', label: 'Open', count: rfqs.filter((r) => r.status === 'open').length },
        { id: 'comparing', label: 'Comparing', count: rfqs.filter((r) => r.status === 'comparing').length },
        { id: 'draft', label: 'Drafts', count: rfqs.filter((r) => r.status === 'draft').length },
    ], [rfqs]);

    const filtered = activeTab === 'all'
        ? rfqs
        : rfqs.filter((r) => r.status === activeTab);

    if (loading) return <TradeLoadingState message="Loading RFQs..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1
                        className="text-2xl font-bold text-stone-900"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        RFQ Engine
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        Create, manage, and compare requests for quotation
                    </p>
                </div>
                <Link
                    href="/trade/rfq/new"
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                >
                    + New RFQ
                </Link>
            </div>

            {/* Tabs */}
            <TradeTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

            {/* RFQ List */}
            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-sm text-stone-400">
                        No RFQs found
                    </div>
                )}
                {filtered.map((rfq) => {
                    const statusConfig = RFQ_STATUS_CONFIG[rfq.status];
                    const remaining = daysUntil(rfq.expiresAt);
                    return (
                        <Link key={rfq.id} href={`/trade/rfq/${rfq.id}`}>
                            <TradeCard padding="md" hover className="mb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-[10px] font-mono text-stone-400">{rfq.rfqNumber}</span>
                                            <TradeBadge label={statusConfig.label} variant={statusConfig.variant} dot />
                                        </div>
                                        <h3 className="text-sm font-semibold text-stone-900 truncate">{rfq.title}</h3>
                                        <div className="flex items-center gap-4 mt-2 text-[11px] text-stone-500">
                                            <span>{rfq.category}</span>
                                            <span>·</span>
                                            <span>{rfq.quantity} {rfq.quantityUnit}</span>
                                            <span>·</span>
                                            <span>{rfq.incoterm} to {rfq.destinationPort}</span>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        {rfq.targetPricePerUnit && (
                                            <p className="text-sm font-semibold text-stone-800">
                                                {formatCurrency(rfq.targetPricePerUnit, rfq.targetCurrency)}/{rfq.quantityUnit.replace(/s$/, '')}
                                            </p>
                                        )}
                                        <div className="flex items-center gap-3 mt-1.5 text-[10px] text-stone-500">
                                            <span>{rfq.quoteCount} quotes</span>
                                            <span>{rfq.viewCount} views</span>
                                        </div>
                                        {remaining > 0 && rfq.status !== 'awarded' && rfq.status !== 'cancelled' && (
                                            <p className="text-[10px] text-stone-400 mt-1">{remaining}d remaining</p>
                                        )}
                                    </div>
                                </div>
                            </TradeCard>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
