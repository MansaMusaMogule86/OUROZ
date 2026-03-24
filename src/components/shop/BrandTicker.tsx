'use client';

import type { Brand } from '@/types/shop';

interface Props {
  brands: Brand[];
}

export default function BrandTicker({ brands }: Props) {
  if (!brands.length) return null;

  return (
    <div className="py-8 overflow-hidden">
      <div className="flex gap-12 items-center justify-center">
        {brands.map((brand) => (
          <span
            key={brand.id}
            className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-charcoal)]/20"
          >
            {brand.name}
          </span>
        ))}
      </div>
    </div>
  );
}
