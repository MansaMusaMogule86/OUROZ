'use client';

import { use } from 'react';
import Link from 'next/link';
import { clsx } from 'clsx';
import TradeCard, { TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeAIInsight from '@/components/trade/shared/TradeAIInsight';
import TradeTimeline from '@/components/trade/shared/TradeTimeline';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { DEAL_STATUS_CONFIG } from '@/lib/trade/trade-constants';
import { formatCurrency, formatDate, formatRelativeTime } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeDealById } from '@/lib/trade/trade-service';

const senderColors: Record<string, string> = {
    buyer: 'bg-blue-50 border-blue-100',
    supplier: 'bg-white border-stone-200',
    ai: 'bg-amber-50 border-amber-200',
    system: 'bg-stone-50 border-stone-200',
};

export default function DealRoomPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: deal, loading, error, refetch } = useTradeData(() => fetchTradeDealById(id), null);

    if (loading) return <TradeLoadingState message="Loading deal..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    if (!deal) {
        return (
            <div className="py-20 text-center">
                <p className="text-stone-500">Deal not found</p>
                <Link href="/trade/deals" className="text-sm text-stone-700 underline mt-2 inline-block">
                    Back to Deal Room
                </Link>
            </div>
        );
    }

    const statusConf = DEAL_STATUS_CONFIG[deal.status];

    return (
        <div className="space-y-6 max-w-6xl">
            <Link href="/trade/deals" className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to Deal Room
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-stone-400">{deal.dealNumber}</span>
                        <TradeBadge label={statusConf.label} variant={statusConf.variant} dot />
                    </div>
                    <h1
                        className="text-xl font-bold text-stone-900"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {deal.title}
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        {deal.supplierName}, {deal.supplierCity} · {deal.quantity} {deal.quantityUnit}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {formatCurrency(deal.currentTerms.unitPrice, deal.currentTerms.currency)}
                    </p>
                    <p className="text-[10px] text-stone-400">per {deal.quantityUnit.replace(/s$/, '')}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat panel — 2/3 */}
                <div className="lg:col-span-2 space-y-4">
                    <TradeCard padding="none">
                        <div className="px-5 py-3 border-b border-stone-100">
                            <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                                Negotiation Thread
                            </h2>
                        </div>
                        <div className="p-5 space-y-3 max-h-[500px] overflow-y-auto">
                            {deal.messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={clsx(
                                        'rounded-lg border p-4',
                                        senderColors[msg.senderType],
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-semibold text-stone-800">{msg.senderName}</span>
                                            {msg.senderType === 'ai' && (
                                                <span className="text-[9px] text-amber-600 font-semibold">✦ AI</span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-stone-400">{formatRelativeTime(msg.timestamp)}</span>
                                    </div>
                                    <p className="text-xs text-stone-700 leading-relaxed">{msg.content}</p>
                                </div>
                            ))}
                        </div>
                        {/* Message input */}
                        <div className="px-5 py-3 border-t border-stone-100">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type your message..."
                                    className="flex-1 text-sm text-stone-800 bg-stone-50 rounded-lg px-4 py-2.5 outline-none focus:ring-1 focus:ring-stone-300"
                                />
                                <button className="px-4 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors">
                                    Send
                                </button>
                            </div>
                        </div>
                    </TradeCard>
                </div>

                {/* Right sidebar — 1/3 */}
                <div className="space-y-4">
                    {/* Current terms */}
                    <TradeCard padding="md">
                        <TradeCardTitle className="mb-3">Current Terms</TradeCardTitle>
                        <div className="space-y-2">
                            {[
                                ['Unit Price', formatCurrency(deal.currentTerms.unitPrice, deal.currentTerms.currency)],
                                ['Quantity', `${deal.currentTerms.quantity} ${deal.quantityUnit}`],
                                ['Total', formatCurrency(deal.currentTerms.unitPrice * deal.currentTerms.quantity, deal.currentTerms.currency)],
                                ['Incoterm', deal.currentTerms.incoterm],
                                ['Payment', deal.currentTerms.paymentTerms],
                                ['Lead Time', `${deal.currentTerms.leadTimeDays} days`],
                                ['Shipping', deal.currentTerms.shippingMethod],
                            ].map(([label, value]) => (
                                <div key={label} className="flex justify-between py-1.5 border-b border-stone-50">
                                    <span className="text-[10px] text-stone-500">{label}</span>
                                    <span className="text-[11px] font-medium text-stone-800">{value}</span>
                                </div>
                            ))}
                        </div>
                        {deal.currentTerms.specialConditions && (
                            <div className="mt-3 p-2.5 bg-stone-50 rounded-lg">
                                <span className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">Special Conditions</span>
                                <p className="text-[11px] text-stone-600 mt-0.5">{deal.currentTerms.specialConditions}</p>
                            </div>
                        )}
                    </TradeCard>

                    {/* AI Strategy */}
                    {deal.aiStrategyNotes && (
                        <TradeCard padding="md">
                            <div className="flex items-center gap-2 mb-3">
                                <TradeCardTitle>AI Strategy Advisor</TradeCardTitle>
                                {deal.aiConfidence && (
                                    <TradeScoreRing score={deal.aiConfidence} size={36} strokeWidth={3} />
                                )}
                            </div>
                            {deal.aiRecommendedPrice && (
                                <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 mb-3">
                                    <span className="text-[9px] uppercase tracking-wider text-amber-600 font-semibold">Recommended Price</span>
                                    <p className="text-lg font-bold text-amber-800" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                        {formatCurrency(deal.aiRecommendedPrice, deal.currentTerms.currency)}
                                    </p>
                                </div>
                            )}
                            <div className="space-y-2">
                                {deal.aiStrategyNotes.map((note, i) => (
                                    <div key={i} className="flex gap-2 text-[11px] text-stone-600">
                                        <span className="text-amber-500 flex-shrink-0">✦</span>
                                        <span>{note}</span>
                                    </div>
                                ))}
                            </div>
                        </TradeCard>
                    )}

                    {/* Milestones */}
                    <TradeCard padding="md">
                        <TradeCardTitle className="mb-3">Deal Milestones</TradeCardTitle>
                        <TradeTimeline
                            steps={deal.milestones.map((m, i) => ({
                                id: `ms-${i}`,
                                label: m.label,
                                status: m.completed ? 'completed' : i === deal.milestones.findIndex((x) => !x.completed) ? 'current' : 'pending',
                                date: formatDate(m.date),
                            }))}
                        />
                    </TradeCard>
                </div>
            </div>
        </div>
    );
}
