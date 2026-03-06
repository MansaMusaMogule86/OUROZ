'use client';
/**
 * SearchBar – debounced text input for product search.
 * Emits `onSearch(value)` 350ms after the user stops typing.
 * `onSearch('')` is emitted when the input is cleared.
 */

import React, { useState, useRef, useCallback, useEffect } from 'react';

interface SearchBarProps {
    /** Called with the search string (debounced). Empty string = cleared. */
    onSearch: (value: string) => void;
    /** Controlled value – pass to keep parent and input in sync */
    value?: string;
    placeholder?: string;
    /** Debounce delay in ms (default 350) */
    debounceMs?: number;
    className?: string;
    autoFocus?: boolean;
}

export default function SearchBar({
    onSearch,
    value: controlledValue,
    placeholder = 'Search products…',
    debounceMs = 350,
    className = '',
    autoFocus = false,
}: SearchBarProps) {
    const [inputValue, setInputValue] = useState(controlledValue ?? '');
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Sync if parent changes controlled value
    useEffect(() => {
        if (controlledValue !== undefined && controlledValue !== inputValue) {
            setInputValue(controlledValue);
        }
    // Intentionally only react to controlledValue changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [controlledValue]);

    const emit = useCallback((val: string) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => onSearch(val), debounceMs);
    }, [onSearch, debounceMs]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        const val = e.target.value;
        setInputValue(val);
        emit(val);
    }

    function handleClear() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setInputValue('');
        onSearch('');
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Escape') handleClear();
        if (e.key === 'Enter') {
            if (timerRef.current) clearTimeout(timerRef.current);
            onSearch(inputValue.trim());
        }
    }

    return (
        <div className={`relative flex items-center ${className}`}>
            {/* Search icon */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none select-none">
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path
                        d="M13.5 13.5L18 18M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                    />
                </svg>
            </span>

            <input
                type="search"
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoFocus={autoFocus}
                className="
                    w-full pl-9 pr-9 py-2.5 text-sm
                    bg-white border border-stone-200 rounded-xl
                    placeholder:text-stone-400 text-stone-800
                    focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/30
                    focus:border-[var(--color-imperial)]
                    transition
                    [appearance:none]
                "
                aria-label="Search products"
            />

            {/* Clear button */}
            {inputValue && (
                <button
                    type="button"
                    onClick={handleClear}
                    aria-label="Clear search"
                    className="
                        absolute right-2.5 top-1/2 -translate-y-1/2
                        text-stone-400 hover:text-stone-600 transition
                        w-5 h-5 flex items-center justify-center rounded-full
                        hover:bg-stone-100
                    "
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                        <path
                            d="M1 1l10 10M11 1L1 11"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
}
