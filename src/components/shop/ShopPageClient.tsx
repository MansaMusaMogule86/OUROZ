'use client';

import type { Category, Brand } from '@/types/shop';

interface Props {
  categories: Category[];
  brands: Brand[];
  lang: string;
}

export default function ShopPageClient({ categories }: Props) {
  return (
    <div className="text-center py-16">
      <p className="text-sm text-[var(--color-charcoal)]/30 font-body">
        {categories.length} categories available
      </p>
    </div>
  );
}
