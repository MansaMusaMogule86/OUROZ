'use client';
/**
 * Pagination – numbered page controls.
 *
 * Renders: « Prev  1  2  …  5  6  [7]  8  9  …  14  15  Next »
 * Shows a window of ±2 pages around the current page; collapses distant
 * ranges to "…" to keep the bar compact.
 */

import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    page,
    totalPages,
    onPageChange,
    className = '',
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Build page number array with null as ellipsis placeholder
    function buildPages(): (number | null)[] {
        const delta = 2;
        const range: (number | null)[] = [];

        for (
            let i = Math.max(2, page - delta);
            i <= Math.min(totalPages - 1, page + delta);
            i++
        ) {
            range.push(i);
        }

        if (page - delta > 2) range.unshift(null);   // left ellipsis
        if (page + delta < totalPages - 1) range.push(null); // right ellipsis

        return [1, ...range, totalPages];
    }

    const pages = buildPages();

    const btnBase = `
        inline-flex items-center justify-center min-w-[2rem] h-9 px-2
        text-sm rounded-lg font-medium transition select-none
    `;
    const activeBtn = `${btnBase} bg-[var(--color-imperial)] text-white`;
    const inactiveBtn = `${btnBase} text-stone-600 hover:bg-stone-100 cursor-pointer`;
    const disabledBtn = `${btnBase} text-stone-300 cursor-not-allowed`;

    return (
        <nav
            aria-label="Pagination"
            className={`flex items-center justify-center gap-1 ${className}`}
        >
            {/* Prev */}
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
                aria-label="Previous page"
                className={page === 1 ? disabledBtn : inactiveBtn}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {pages.map((p, i) =>
                p === null ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="inline-flex items-center justify-center min-w-[2rem] h-9 text-sm text-stone-400 select-none"
                        aria-hidden="true"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={p}
                        onClick={() => onPageChange(p)}
                        aria-label={`Page ${p}`}
                        aria-current={p === page ? 'page' : undefined}
                        className={p === page ? activeBtn : inactiveBtn}
                    >
                        {p}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
                aria-label="Next page"
                className={page === totalPages ? disabledBtn : inactiveBtn}
            >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>
        </nav>
    );
}
