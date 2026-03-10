'use client';

import Link from 'next/link';
import TradeAIInsight from '@/components/trade/shared/TradeAIInsight';
import type { TradeAIInsightItem } from '@/types/trade';

interface DashboardAISummaryProps {
    insights: TradeAIInsightItem[];
}

export default function DashboardAISummary({ insights }: DashboardAISummaryProps) {
    return (
        <div>
            <h2
                className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500 mb-4"
            >
                ✦ AI Intelligence Feed
            </h2>
            <div className="space-y-3">
                {insights.slice(0, 4).map((insight) => (
                    <TradeAIInsight
                        key={insight.id}
                        title={insight.title}
                        content={insight.content}
                        type={insight.type}
                        actionLabel={insight.actionLabel}
                        onAction={
                            insight.actionHref
                                ? undefined
                                : undefined
                        }
                    />
                ))}
            </div>
            {insights.length > 4 && (
                <Link
                    href="/trade"
                    className="block mt-3 text-[10px] font-semibold uppercase tracking-wider text-stone-500 hover:text-stone-700 transition-colors text-center"
                >
                    View all insights →
                </Link>
            )}
        </div>
    );
}
