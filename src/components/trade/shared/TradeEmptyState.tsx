'use client';

import { clsx } from 'clsx';

interface TradeEmptyStateProps {
    icon?: string;
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

export default function TradeEmptyState({
    icon = '◇',
    title,
    description,
    actionLabel,
    onAction,
    className,
}: TradeEmptyStateProps) {
    return (
        <div className={clsx('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
            <span className="text-4xl text-stone-300 mb-4">{icon}</span>
            <h3
                className="text-lg font-semibold text-stone-700 mb-1"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
                {title}
            </h3>
            {description && (
                <p className="text-sm text-stone-500 max-w-sm mb-6">{description}</p>
            )}
            {actionLabel && onAction && (
                <button
                    onClick={onAction}
                    className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
}
