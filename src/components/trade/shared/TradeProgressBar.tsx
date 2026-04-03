'use client';

import { clsx } from 'clsx';

interface TradeProgressBarProps {
    value: number;
    max?: number;
    label?: string;
    showValue?: boolean;
    size?: 'sm' | 'md';
    color?: 'zellige' | 'gold' | 'imperial' | 'blue' | 'auto';
    className?: string;
}

function getAutoColor(pct: number): string {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    return 'bg-red-500';
}

const colorMap: Record<string, string> = {
    zellige: 'bg-emerald-600',
    gold: 'bg-amber-500',
    imperial: 'bg-red-700',
    blue: 'bg-blue-500',
};

export default function TradeProgressBar({
    value,
    max = 100,
    label,
    showValue = true,
    size = 'sm',
    color = 'auto',
    className,
}: TradeProgressBarProps) {
    const pct = Math.min(Math.round((value / max) * 100), 100);
    const barColor = color === 'auto' ? getAutoColor(pct) : colorMap[color];

    return (
        <div className={clsx('flex flex-col gap-1', className)}>
            {(label || showValue) && (
                <div className="flex items-center justify-between">
                    {label && (
                        <span className="text-[10px] font-medium uppercase tracking-wider text-stone-500">
                            {label}
                        </span>
                    )}
                    {showValue && (
                        <span className="text-xs font-semibold text-stone-700">{pct}%</span>
                    )}
                </div>
            )}
            <div
                className={clsx(
                    'w-full rounded-full bg-stone-100 overflow-hidden',
                    size === 'sm' ? 'h-1.5' : 'h-2.5',
                )}
            >
                <div
                    className={clsx('h-full rounded-full transition-all duration-500', barColor)}
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}
