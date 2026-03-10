'use client';

import TradeCard from '@/components/trade/shared/TradeCard';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import { formatCurrency } from '@/lib/trade/trade-utils';
import type { TradeDashboardStats } from '@/types/trade';

interface DashboardStatsProps {
    stats: TradeDashboardStats;
}

const statItems = [
    { key: 'activeRfqs', label: 'Active RFQs', icon: '◇' },
    { key: 'pendingQuotes', label: 'Pending Quotes', icon: '◈' },
    { key: 'activeShipments', label: 'In Transit', icon: '◻' },
    { key: 'activeDeals', label: 'Active Deals', icon: '◉' },
] as const;

export default function DashboardStats({ stats }: DashboardStatsProps) {
    return (
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {statItems.map((item) => (
                <TradeCard key={item.key} padding="md" hover>
                    <div className="flex items-center gap-3">
                        <span className="text-lg text-stone-300">{item.icon}</span>
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                                {item.label}
                            </p>
                            <p
                                className="text-2xl font-bold text-stone-900 mt-0.5"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {stats[item.key]}
                            </p>
                        </div>
                    </div>
                </TradeCard>
            ))}

            {/* Compliance Score */}
            <TradeCard padding="md" hover>
                <div className="flex items-center gap-3">
                    <TradeScoreRing score={stats.complianceScore} size={48} strokeWidth={4} />
                    <div>
                        <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                            Compliance
                        </p>
                        <p className="text-xs text-stone-600 mt-0.5">Overall Score</p>
                    </div>
                </div>
            </TradeCard>

            {/* Trade Value */}
            <TradeCard padding="md" hover>
                <div>
                    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                        Trade Volume
                    </p>
                    <p
                        className="text-xl font-bold text-stone-900 mt-1"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {formatCurrency(stats.totalTradeValue, stats.currency)}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-medium mt-0.5">+12.4% vs last month</p>
                </div>
            </TradeCard>
        </div>
    );
}
