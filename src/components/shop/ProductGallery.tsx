'use client';
/**
 * ProductGallery – image carousel with thumbnail strip.
 * No external carousel library needed.
 */

import React, { useState } from 'react';
import Image from 'next/image';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import type { DbProductImage } from '@/types/shop';
import { useLang } from '@/contexts/LangContext';

interface ProductGalleryProps {
    images: DbProductImage[];
    productName: string;
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
    const { t } = useLang();
    const [activeIdx, setActiveIdx] = useState(0);

    const sorted = [...images].sort((a, b) => a.sort_order - b.sort_order);

    if (sorted.length === 0) {
        return (
            <div className="aspect-square rounded-2xl bg-[var(--color-sahara)] flex items-center justify-center">
                <span className="text-stone-400 text-sm">{t('gallery')}</span>
            </div>
        );
    }

    const current = sorted[activeIdx];
    const hasPrev = activeIdx > 0;
    const hasNext = activeIdx < sorted.length - 1;

    return (
        <div className="flex flex-col gap-3">
            {/* Main image */}
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-[var(--color-sahara)] group">
                <Image
                    src={current.url}
                    alt={current.alt_text ?? productName}
                    fill
                    className="object-cover"
                    priority={activeIdx === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Prev / Next navigation */}
                {hasPrev && (
                    <button
                        onClick={() => setActiveIdx(i => i - 1)}
                        className="absolute start-2 top-1/2 -translate-y-1/2 p-2
                                   bg-white/80 hover:bg-white rounded-full shadow
                                   opacity-0 group-hover:opacity-100 transition"
                        aria-label="Previous image"
                    >
                        <ChevronLeftIcon className="w-4 h-4" />
                    </button>
                )}
                {hasNext && (
                    <button
                        onClick={() => setActiveIdx(i => i + 1)}
                        className="absolute end-2 top-1/2 -translate-y-1/2 p-2
                                   bg-white/80 hover:bg-white rounded-full shadow
                                   opacity-0 group-hover:opacity-100 transition"
                        aria-label="Next image"
                    >
                        <ChevronRightIcon className="w-4 h-4" />
                    </button>
                )}

                {/* Dot indicators */}
                {sorted.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {sorted.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIdx(i)}
                                className={`w-2 h-2 rounded-full transition-all ${
                                    i === activeIdx ? 'bg-white w-4' : 'bg-white/50'
                                }`}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {sorted.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                    {sorted.map((img, i) => (
                        <button
                            key={img.id}
                            onClick={() => setActiveIdx(i)}
                            className={`
                                relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition
                                ${i === activeIdx
                                    ? 'border-[var(--color-imperial)] shadow-sm'
                                    : 'border-stone-200 hover:border-stone-400'
                                }
                            `}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt_text ?? `Image ${i + 1}`}
                                fill
                                className="object-cover"
                                sizes="64px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
