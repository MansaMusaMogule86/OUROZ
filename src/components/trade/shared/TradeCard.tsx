'use client';

import { clsx } from 'clsx';

interface TradeCardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
    hover?: boolean;
    onClick?: () => void;
}

const paddingMap = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
};

export default function TradeCard({
    children,
    className,
    padding = 'md',
    hover = false,
    onClick,
}: TradeCardProps) {
    const Component = onClick ? 'button' : 'div';
    return (
        <Component
            onClick={onClick}
            className={clsx(
                'bg-white rounded-xl border border-stone-200/60 shadow-sm',
                paddingMap[padding],
                hover && 'transition-all duration-200 hover:shadow-md hover:border-stone-300/80 hover:-translate-y-0.5',
                onClick && 'text-left w-full cursor-pointer',
                className,
            )}
        >
            {children}
        </Component>
    );
}

/* Sub-components for structured card layouts */

export function TradeCardHeader({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={clsx('flex items-center justify-between mb-4', className)}>
            {children}
        </div>
    );
}

export function TradeCardTitle({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3
            className={clsx('text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-500', className)}
        >
            {children}
        </h3>
    );
}
