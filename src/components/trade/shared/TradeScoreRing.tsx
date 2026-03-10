'use client';

import { clsx } from 'clsx';

interface TradeScoreRingProps {
    score: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    label?: string;
    className?: string;
}

function getColor(pct: number): string {
    if (pct >= 80) return '#059669'; // emerald-600
    if (pct >= 60) return '#D97706'; // amber-600
    return '#DC2626'; // red-600
}

export default function TradeScoreRing({
    score,
    max = 100,
    size = 64,
    strokeWidth = 5,
    label,
    className,
}: TradeScoreRingProps) {
    const pct = Math.min(Math.round((score / max) * 100), 100);
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (pct / 100) * circumference;
    const color = getColor(pct);

    return (
        <div className={clsx('flex flex-col items-center gap-1', className)}>
            <div className="relative" style={{ width: size, height: size }}>
                <svg width={size} height={size} className="-rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke="#e7e5e4"
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        fill="none"
                        stroke={color}
                        strokeWidth={strokeWidth}
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        className="transition-all duration-700"
                    />
                </svg>
                <span
                    className="absolute inset-0 flex items-center justify-center text-sm font-bold text-stone-800"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    {score}
                </span>
            </div>
            {label && (
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                    {label}
                </span>
            )}
        </div>
    );
}
