'use client';
/**
 * CategoryNav – horizontal scrollable category pills.
 */

import React from 'react';
import Link from 'next/link';
import type { Category } from '@/types/shop';

interface CategoryNavProps {
    categories: Category[];
    activeSlug?: string;
}

export default function CategoryNav({ categories, activeSlug }: CategoryNavProps) {
    if (categories.length === 0) return null;

    return (
        <nav
            aria-label="Product categories"
            className="overflow-x-auto scrollbar-hide py-2"
        >
            <ul className="flex items-center gap-2 min-w-max px-1">
                {/* All categories */}
                <li>
                    <Link
                        href="/shop"
                        className={`
                            inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                            font-medium transition-all whitespace-nowrap
                            ${!activeSlug
                                ? 'bg-[var(--color-imperial)] text-white shadow-sm'
                                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                            }
                        `}
                    >
                        🏪 All
                    </Link>
                </li>

                {categories.map(cat => (
                    <li key={cat.id}>
                        <Link
                            href={`/shop/${cat.slug}`}
                            className={`
                                inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                                font-medium transition-all whitespace-nowrap
                                ${activeSlug === cat.slug
                                    ? 'bg-[var(--color-imperial)] text-white shadow-sm'
                                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                                }
                            `}
                        >
                            {cat.icon && <span>{cat.icon}</span>}
                            {cat.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
