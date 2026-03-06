'use client';

import React from 'react';
import type { V2Brand } from '@/lib/api';

const SCREENSHOT_BRAND_NAMES = [
  'Aicha',
  'Alitkane',
  'Alsa',
  'Amber',
  'Asta Café',
  'Bellar',
  'Bimo',
  'Dari',
  'Délicia',
  'Leo',
  'Ghadaq',
  'Hanouna Taste',
  'Henry’s',
  'House of Argan',
  'Idéal',
  'Isabel',
  'Jibal',
  'Joly',
  'Kenz',
  'Knorr',
  'Made in Morocco',
  'Moroccan Heritage',
  'Oued Souss',
  'Rouh Dounia',
  'Star',
  'Sultan',
  'Taous',
  'Tiyya Maroc',
  'TopChef',
  'Yamfu',
];

interface BrandTickerProps {
  brands: V2Brand[];
}

function normalize(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '')
    .toLowerCase();
}

export default function BrandTicker({ brands }: BrandTickerProps) {
  const brandByNormalizedName = new Map(
    brands.map((brand) => [normalize(brand.name), brand])
  );

  const orderedBrands = SCREENSHOT_BRAND_NAMES.map((name) => {
    const matched = brandByNormalizedName.get(normalize(name));
    return {
      id: matched?.id ?? name,
      name,
      logoUrl: matched?.logo_url ?? null,
      slug: matched?.slug ?? null,
    };
  });

  const items = [...orderedBrands, ...orderedBrands];

  return (
    <section className="rounded-3xl border border-stone-200 bg-white px-4 py-6 md:px-6 md:py-8">
      <div className="mb-4 md:mb-5">
        <h2 className="text-lg md:text-xl font-semibold text-[var(--color-charcoal)]">Trusted Moroccan Brands</h2>
        <p className="text-sm text-stone-500">Selected brands available across retail and wholesale.</p>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-stone-100 bg-stone-50/70 py-3">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-50 to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-stone-50 to-transparent" />

        <div className="brand-ticker-track motion-reduce:!animate-none" aria-label="Moroccan brands ticker">
          {items.map((brand, idx) => (
            <article
              key={`${brand.id}-${idx}`}
              className="inline-flex min-w-[180px] items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm"
            >
              <div className="h-9 w-9 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={`${brand.name} logo`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span className="text-xs font-semibold text-stone-500">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-stone-700">{brand.name}</p>
                <p className="truncate text-[11px] text-stone-400">Moroccan Brand</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <style jsx>{`
        .brand-ticker-track {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: max-content;
          animation: brandTickerRightToLeft 36s linear infinite;
          will-change: transform;
        }

        .brand-ticker-track:hover {
          animation-play-state: paused;
        }

        @keyframes brandTickerRightToLeft {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
