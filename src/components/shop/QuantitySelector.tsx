'use client';
/**
 * QuantitySelector – +/- stepper with min (1) and optional max.
 */

import React from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import { useLang } from '@/contexts/LangContext';

interface QuantitySelectorProps {
    value: number;
    onChange: (qty: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
}

export default function QuantitySelector({
    value,
    onChange,
    min = 1,
    max,
    disabled = false,
}: QuantitySelectorProps) {
    const { t } = useLang();

    const decrement = () => onChange(Math.max(min, value - 1));
    const increment = () => onChange(max !== undefined ? Math.min(max, value + 1) : value + 1);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const parsed = parseInt(e.target.value, 10);
        if (!isNaN(parsed)) {
            const clamped = Math.max(min, max !== undefined ? Math.min(max, parsed) : parsed);
            onChange(clamped);
        }
    };

    return (
        <div className="inline-flex items-center border border-stone-200 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={decrement}
                disabled={disabled || value <= min}
                aria-label="Decrease quantity"
                className="flex items-center justify-center w-10 h-10 bg-stone-50 hover:bg-stone-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <MinusIcon className="w-4 h-4" />
            </button>

            <input
                type="number"
                value={value}
                onChange={handleInput}
                disabled={disabled}
                min={min}
                max={max}
                aria-label={t('qty')}
                className="w-14 h-10 text-center text-sm font-semibold
                           bg-white border-x border-stone-200
                           focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/30
                           [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none
                           [&::-webkit-inner-spin-button]:appearance-none"
            />

            <button
                type="button"
                onClick={increment}
                disabled={disabled || (max !== undefined && value >= max)}
                aria-label="Increase quantity"
                className="flex items-center justify-center w-10 h-10 bg-stone-50 hover:bg-stone-100
                           disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
                <PlusIcon className="w-4 h-4" />
            </button>
        </div>
    );
}
