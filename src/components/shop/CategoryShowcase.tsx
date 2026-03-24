/**
 * CategoryShowcase – "Explore by Category" section
 * 6 glassmorphism cards in 3×2 grid, each with image, label, product count.
 * Left decorative Moroccan arch overlaps.
 */
'use client';

import Link from 'next/link';

const CATEGORIES = [
  { slug: 'spices', label: 'Spices', count: 48, image: '/images/categories/spices.jpg' },
  { slug: 'oils', label: 'Oils', count: 24, image: '/images/categories/oils.jpg' },
  { slug: 'tea-coffee', label: 'Tea & Coffee', count: 32, image: '/images/categories/tea-coffee.jpg' },
  { slug: 'olives', label: 'Olives', count: 18, image: '/images/categories/olives.jpg' },
  { slug: 'ceramics', label: 'Ceramics', count: 12, image: '/images/categories/ceramics.jpg' },
  { slug: 'pantry', label: 'Pantry Goods', count: 36, image: '/images/categories/pantry.jpg' },
];

interface Props {
  title?: string;
}

export default function CategoryShowcase({ title }: Props) {
  return (
    <section className="relative py-16 lg:py-24">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-14">
        {/* Section heading */}
        <div className="text-center mb-12 lg:mb-16">
          <h2
            className="text-3xl lg:text-5xl font-heading text-[var(--color-charcoal)] mb-3"
            style={{ fontWeight: 300, letterSpacing: '0.06em' }}
          >
            {title || 'Explore by Category'}
          </h2>
          <div className="w-14 h-px bg-[var(--color-gold)]/25 mx-auto mb-4" />
          <p
            className="text-sm text-[var(--color-charcoal)]/40 max-w-md mx-auto"
            style={{ fontWeight: 400, lineHeight: 1.8 }}
          >
            Curated collections from Morocco&apos;s finest producers
          </p>
        </div>

        {/* 3×2 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop?category=${cat.slug}`}
              className="group relative rounded-2xl lg:rounded-3xl overflow-hidden aspect-[4/5] lg:aspect-[3/4]"
            >
              {/* Background image */}
              <div className="absolute inset-0 bg-[var(--color-sahara-dark)]">
                <img
                  src={cat.image}
                  alt={cat.label}
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-90 group-hover:scale-105 transition-all duration-700"
                />
              </div>

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

              {/* Glass card at bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-5">
                <div className="glass-card rounded-xl lg:rounded-2xl px-4 py-3 lg:px-5 lg:py-4">
                  <p
                    className="text-white text-sm lg:text-base font-heading tracking-wide"
                    style={{ fontWeight: 500 }}
                  >
                    {cat.label}
                  </p>
                  <p className="text-white/50 text-[10px] lg:text-xs font-body mt-0.5">
                    {cat.count} Products
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
