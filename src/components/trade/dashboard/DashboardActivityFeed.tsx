'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import TradeCard from '@/components/trade/shared/TradeCard';
import { formatRelativeTime } from '@/lib/trade/trade-utils';
import type { TradeActivityItem } from '@/types/trade';

interface DashboardActivityFeedProps {
    activities: TradeActivityItem[];
}

const typeIcons: Record<string, { icon: string; color: string }> = {
    rfq: { icon: '◇', color: 'bg-blue-100 text-blue-600' },
    quote: { icon: '◈', color: 'bg-emerald-100 text-emerald-600' },
    shipment: { icon: '◻', color: 'bg-indigo-100 text-indigo-600' },
    deal: { icon: '◉', color: 'bg-amber-100 text-amber-700' },
    compliance: { icon: '▧', color: 'bg-stone-100 text-stone-600' },
    price: { icon: '◐', color: 'bg-purple-100 text-purple-600' },
};

export default function DashboardActivityFeed({ activities }: DashboardActivityFeedProps) {
    return (
        <TradeCard padding="none">
            <div className="px-5 py-4 border-b border-stone-100">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    Recent Activity
                </h2>
            </div>
            <div className="divide-y divide-stone-50">
                {activities.map((act) => {
                    const typeInfo = typeIcons[act.type] || typeIcons.rfq;
                    const inner = (
                        <>
                            <span
                                className={clsx(
                                    'w-7 h-7 rounded-lg flex items-center justify-center text-xs flex-shrink-0 mt-0.5',
                                    typeInfo.color,
                                )}
                            >
                                {typeInfo.icon}
                            </span>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-semibold text-stone-800">{act.title}</p>
                                <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{act.description}</p>
                            </div>
                            <span className="text-[10px] text-stone-400 flex-shrink-0 mt-0.5">
                                {formatRelativeTime(act.timestamp)}
                            </span>
                        </>
                    );
                    const cls = clsx(
                        'flex items-start gap-3 px-5 py-3 transition-colors',
                        act.href && 'hover:bg-stone-50/50',
                    );
                    return act.href ? (
                        <Link key={act.id} href={act.href} className={cls}>{inner}</Link>
                    ) : (
                        <div key={act.id} className={cls}>{inner}</div>
                    );
                })}
            </div>
        </TradeCard>
    );
}
