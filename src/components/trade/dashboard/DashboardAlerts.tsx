'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import { RISK_LEVEL_CONFIG } from '@/lib/trade/trade-constants';
import { formatRelativeTime } from '@/lib/trade/trade-utils';
import type { TradeAlert } from '@/types/trade';

interface DashboardAlertsProps {
    alerts: TradeAlert[];
}

export default function DashboardAlerts({ alerts }: DashboardAlertsProps) {
    if (alerts.length === 0) return null;

    return (
        <TradeCard padding="none">
            <div className="px-5 py-4 border-b border-stone-100">
                <h2 className="text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-500">
                    ⚡ Active Alerts
                </h2>
            </div>
            <div className="divide-y divide-stone-100">
                {alerts.map((alert) => {
                    const config = RISK_LEVEL_CONFIG[alert.level];
                    return (
                        <Link
                            key={alert.id}
                            href={alert.href || '/trade'}
                            className={clsx(
                                'flex items-start gap-3 px-5 py-3.5 hover:bg-stone-50/50 transition-colors',
                                !alert.isRead && 'bg-amber-50/30',
                            )}
                        >
                            {!alert.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="text-xs font-semibold text-stone-800 truncate">
                                        {alert.title}
                                    </span>
                                    <TradeBadge label={config.label} variant={config.variant} />
                                </div>
                                <p className="text-[11px] text-stone-500 truncate">{alert.description}</p>
                            </div>
                            <span className="text-[10px] text-stone-400 flex-shrink-0 mt-0.5">
                                {formatRelativeTime(alert.createdAt)}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </TradeCard>
    );
}
