'use client';

import { clsx } from 'clsx';

interface FilterOption {
    value: string;
    label: string;
    count?: number;
}

interface TradeFilterProps {
    label: string;
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export default function TradeFilter({
    label,
    options,
    value,
    onChange,
    className,
}: TradeFilterProps) {
    return (
        <div className={clsx('flex flex-col gap-1.5', className)}>
            <label className="text-[9px] font-semibold uppercase tracking-[0.2em] text-stone-500">
                {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="text-xs bg-white border border-stone-200 rounded-lg px-3 py-2 text-stone-700 focus:outline-none focus:ring-1 focus:ring-stone-400 focus:border-stone-400 appearance-none cursor-pointer"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2378716c' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 10px center',
                    paddingRight: '32px',
                }}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}{opt.count !== undefined ? ` (${opt.count})` : ''}
                    </option>
                ))}
            </select>
        </div>
    );
}

/* Inline pill-style filter group for simpler use cases */

interface TradeFilterPillsProps {
    options: FilterOption[];
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function TradeFilterPills({
    options,
    value,
    onChange,
    className,
}: TradeFilterPillsProps) {
    return (
        <div className={clsx('flex flex-wrap gap-2', className)}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={clsx(
                        'px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-colors',
                        value === opt.value
                            ? 'bg-stone-900 text-white'
                            : 'bg-stone-100 text-stone-500 hover:bg-stone-200',
                    )}
                >
                    {opt.label}
                    {opt.count !== undefined && (
                        <span className="ml-1 opacity-70">{opt.count}</span>
                    )}
                </button>
            ))}
        </div>
    );
}
