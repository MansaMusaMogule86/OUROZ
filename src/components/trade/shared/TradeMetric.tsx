'use client';

import { clsx } from 'clsx';

interface TradeMetricProps {
    label: string;
    value: string | number;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
    icon?: React.ReactNode;
    className?: string;
}

export default function TradeMetric({
    label,
    value,
    change,
    changeType = 'neutral',
    icon,
    className,
}: TradeMetricProps) {
    return (
        <div className={clsx('flex flex-col gap-1', className)}>
            <div className="flex items-center gap-2">
                {icon && (
                    <span className="text-stone-400 flex-shrink-0">{icon}</span>
                )}
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {label}
                </span>
            </div>
            <div className="flex items-baseline gap-2">
                <span
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    {value}
                </span>
                {change && (
                    <span
                        className={clsx(
                            'text-xs font-medium',
                            changeType === 'positive' && 'text-emerald-600',
                            changeType === 'negative' && 'text-red-600',
                            changeType === 'neutral' && 'text-stone-500',
                        )}
                    >
                        {change}
                    </span>
                )}
            </div>
        </div>
    );
}
