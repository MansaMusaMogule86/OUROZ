'use client';

import Link from 'next/link';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { DEAL_STATUS_CONFIG } from '@/lib/trade/trade-constants';
import { formatCurrency, formatRelativeTime } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeDeals } from '@/lib/trade/trade-service';

export default function DealsPage() {
    const { data: deals, loading, error, refetch } = useTradeData(() => fetchTradeDeals(), []);

    if (loading) return <TradeLoadingState message="Loading deals..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Deal Room
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Negotiate terms, track deal progress, and get AI strategy advice
                </p>
            </div>

            <div className="space-y-3">
                {deals.length === 0 && (
                    <div className="py-16 text-center text-sm text-stone-400">
                        No deals found
                    </div>
                )}
                {deals.map((deal) => {
                    const statusConf = DEAL_STATUS_CONFIG[deal.status];
                    const completedMilestones = deal.milestones.filter((m) => m.completed).length;
                    const totalMilestones = deal.milestones.length;

                    return (
                        <Link key={deal.id} href={`/trade/deals/${deal.id}`}>
                            <TradeCard padding="md" hover className="mb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-mono text-stone-400">{deal.dealNumber}</span>
                                            <TradeBadge label={statusConf.label} variant={statusConf.variant} dot />
                                        </div>
                                        <h3 className="text-sm font-semibold text-stone-900 truncate">{deal.title}</h3>
                                        <p className="text-[11px] text-stone-500 mt-1">
                                            {deal.supplierName}, {deal.supplierCity} · {deal.productName}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-sm font-semibold text-stone-800">
                                            {formatCurrency(deal.currentTerms.unitPrice, deal.currentTerms.currency)}/{deal.quantityUnit.replace(/s$/, '')}
                                        </p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">
                                            {deal.quantity} {deal.quantityUnit} · {deal.currentTerms.incoterm}
                                        </p>
                                        <p className="text-[10px] text-stone-400 mt-1">
                                            Updated {formatRelativeTime(deal.updatedAt)}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress */}
                                <div className="mt-3 flex items-center gap-2">
                                    <div className="flex gap-0.5 flex-1">
                                        {deal.milestones.map((m, i) => (
                                            <div
                                                key={i}
                                                className={`h-1 flex-1 rounded-full ${
                                                    m.completed ? 'bg-emerald-400' : 'bg-stone-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                    <span className="text-[9px] text-stone-400 font-medium">
                                        {completedMilestones}/{totalMilestones}
                                    </span>
                                </div>
                            </TradeCard>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
