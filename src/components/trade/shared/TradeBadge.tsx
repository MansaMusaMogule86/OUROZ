'use client';

import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium';

const variantStyles: Record<BadgeVariant, string> = {
    success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    warning: 'bg-amber-50 text-amber-700 border-amber-200',
    error: 'bg-red-50 text-red-700 border-red-200',
    info: 'bg-blue-50 text-blue-700 border-blue-200',
    neutral: 'bg-stone-100 text-stone-600 border-stone-200',
    premium: 'bg-amber-50 text-amber-800 border-amber-300',
};

interface TradeBadgeProps {
    label: string;
    variant?: BadgeVariant;
    size?: 'sm' | 'md';
    dot?: boolean;
    className?: string;
}

export default function TradeBadge({
    label,
    variant = 'neutral',
    size = 'sm',
    dot = false,
    className,
}: TradeBadgeProps) {
    return (
        <span
            className={clsx(
                'inline-flex items-center gap-1.5 rounded-full border font-medium',
                size === 'sm' ? 'px-2.5 py-0.5 text-[10px] tracking-wide uppercase' : 'px-3 py-1 text-xs',
                variantStyles[variant],
                className,
            )}
        >
            {dot && (
                <span
                    className={clsx(
                        'inline-block w-1.5 h-1.5 rounded-full',
                        variant === 'success' && 'bg-emerald-500',
                        variant === 'warning' && 'bg-amber-500',
                        variant === 'error' && 'bg-red-500',
                        variant === 'info' && 'bg-blue-500',
                        variant === 'neutral' && 'bg-stone-400',
                        variant === 'premium' && 'bg-amber-600',
                    )}
                />
            )}
            {label}
        </span>
    );
}
