'use client';
/**
 * ShopFilters – Brand + Category filter sidebar / topbar.
 *
 * Renders two sections:
 *   1. Category pills (horizontal scroll on mobile, vertical list on md+)
 *   2. Brand checkboxes
 *
 * All filter state lives in the parent; this component is purely presentational.
 * Pass `null` to clear a filter (shows all results).
 */

import React, { useState } from 'react';
import { ChevronUpIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { V2Brand, V2Category } from '@/lib/api';

interface ShopFiltersProps {
    categories: V2Category[];
    brands: V2Brand[];
    selectedCategoryId: string | null;
    selectedBrandId: string | null;
    onCategoryChange: (categoryId: string | null) => void;
    onBrandChange: (brandId: string | null) => void;
    /** Display language for names */
    lang?: 'en' | 'ar' | 'fr';
    className?: string;
}

function categoryName(cat: V2Category, lang: 'en' | 'ar' | 'fr'): string {
    if (lang === 'ar' && cat.name_ar) return cat.name_ar;
    if (lang === 'fr' && cat.name_fr) return cat.name_fr;
    return cat.name;
}

function brandName(brand: V2Brand, lang: 'en' | 'ar' | 'fr'): string {
    if (lang === 'ar' && brand.name_ar) return brand.name_ar;
    if (lang === 'fr' && brand.name_fr) return brand.name_fr;
    return brand.name;
}

export default function ShopFilters({
    categories,
    brands,
    selectedCategoryId,
    selectedBrandId,
    onCategoryChange,
    onBrandChange,
    lang = 'en',
    className = '',
}: ShopFiltersProps) {
    const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

    const toggleCategory = (categoryId: string) => {
        setExpandedCategories(prev => {
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };

    // Only show root-level categories (no parent)
    const rootCategories = categories.filter(c => !c.parent_id);

    return (
        <aside className={`space-y-6 ${className}`}>

            {/* ── Categories ───────────────────────────── */}
            {rootCategories.length > 0 && (
                <section>
                    {/* Mobile: horizontal scroll pills */}
                    <div className="flex flex-wrap gap-2 md:hidden mb-6">
                        <Pill
                            label="All"
                            active={selectedCategoryId === null}
                            onClick={() => onCategoryChange(null)}
                        />
                        {rootCategories.map(cat => (
                            <Pill
                                key={cat.id}
                                label={categoryName(cat, lang)}
                                active={selectedCategoryId === cat.id}
                                onClick={() =>
                                    onCategoryChange(
                                        selectedCategoryId === cat.id ? null : cat.id
                                    )
                                }
                            />
                        ))}
                    </div>

                    {/* Desktop: Accordion Sidebar */}
                    <div className="hidden md:block rounded-xl overflow-hidden border border-stone-200">
                        {/* Header */}
                        <div className="bg-[#044c46] text-white px-4 py-3 text-sm font-bold uppercase tracking-wide">
                            Categories
                        </div>

                        {/* List */}
                        <ul className="flex flex-col bg-white">
                            {rootCategories.map((cat, index) => {
                                const hasChildren = categories.some(c => c.parent_id === cat.id);
                                const isExpanded = expandedCategories.has(cat.id);
                                const isSelected = selectedCategoryId === cat.id;

                                // Subcategories for this node
                                const subCategories = categories.filter(c => c.parent_id === cat.id);

                                return (
                                    <li key={cat.id} className={index !== 0 ? "border-t border-stone-100" : ""}>
                                        <div
                                            className="w-full flex items-center justify-between px-4 py-3 cursor-pointer group hover:bg-stone-50 transition"
                                            onClick={() => {
                                                if (hasChildren) {
                                                    toggleCategory(cat.id);
                                                } else {
                                                    onCategoryChange(isSelected ? null : cat.id);
                                                }
                                            }}
                                        >
                                            <span
                                                className={`text-[15px] flex-1 ${isSelected || isExpanded ? 'font-semibold text-stone-900' : 'text-stone-700'}`}
                                            >
                                                {categoryName(cat, lang)}
                                            </span>
                                            {hasChildren && (
                                                <div className="p-1 text-stone-400 group-hover:text-stone-700 transition">
                                                    {isExpanded ? (
                                                        <ChevronUpIcon className="w-4 h-4" />
                                                    ) : (
                                                        <ChevronRightIcon className="w-4 h-4" />
                                                    )}
                                                </div>
                                            )}
                                            {!hasChildren && (
                                                <div className="w-6 h-6 flex items-center justify-center text-stone-300">
                                                    <ChevronRightIcon className="w-4 h-4" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Subcategories (Expanded) */}
                                        {hasChildren && isExpanded && (
                                            <div className="pl-4 pr-4 pb-3 flex flex-col">
                                                {/* Left border indent indicator */}
                                                <ul className="border-l border-stone-200 ml-2 pl-4 flex flex-col gap-3 pt-1">
                                                    {subCategories.map(subCat => {
                                                        const isSubSelected = selectedCategoryId === subCat.id;
                                                        return (
                                                            <li key={subCat.id}>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onCategoryChange(isSubSelected ? null : subCat.id);
                                                                    }}
                                                                    className={`text-sm text-left transition w-full ${isSubSelected ? 'text-[#044c46] font-medium' : 'text-[#3E5C76] hover:text-[#044c46]'}`}
                                                                >
                                                                    {categoryName(subCat, lang)}
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            </div>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </section>
            )}

            {/* ── Brands ───────────────────────────────── */}
            {brands.length > 0 && (
                <section>
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3">
                        Brand
                    </h3>
                    <ul className="flex flex-col gap-1">
                        {brands.map(brand => {
                            const checked = selectedBrandId === brand.id;
                            return (
                                <li key={brand.id}>
                                    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
                                        <input
                                            type="checkbox"
                                            checked={checked}
                                            onChange={() =>
                                                onBrandChange(checked ? null : brand.id)
                                            }
                                            className="
                                                w-4 h-4 rounded border-stone-300
                                                text-[var(--color-imperial)]
                                                focus:ring-[var(--color-imperial)]/30
                                                cursor-pointer
                                            "
                                        />
                                        <span className="text-sm text-stone-700 group-hover:text-stone-900 transition leading-none">
                                            {brandName(brand, lang)}
                                        </span>
                                    </label>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            )}
        </aside>
    );
}

// =============================================================================
// Internal sub-components
// =============================================================================

function Pill({
    label,
    active,
    onClick,
}: {
    label: string;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap
                ${active
                    ? 'bg-[var(--color-imperial)] text-white shadow-sm'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }
            `}
        >
            {label}
        </button>
    );
}

function CategoryRow({
    label,
    icon,
    active,
    onClick,
}: {
    label: string;
    icon: string | null;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <li>
            <button
                type="button"
                onClick={onClick}
                className={`
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm
                    font-medium transition text-left
                    ${active
                        ? 'bg-[var(--color-imperial)]/10 text-[var(--color-imperial)]'
                        : 'text-stone-600 hover:bg-stone-100'
                    }
                `}
            >
                {icon && <span className="text-base leading-none">{icon}</span>}
                <span className="truncate">{label}</span>
            </button>
        </li>
    );
}
