/**
 * CategoryShowcase — "Explore by Category" section.
 * Horizontal scroll of light portrait cards matching OUROZ reference design:
 * food photo fills upper portion, category label at bottom in dark serif.
 */
'use client';

import Link from 'next/link';

const CATEGORIES = [
  { slug: 'spices',             label: 'Spices',       image: '/images/categories/spices.jpg' },
  { slug: 'oils',               label: 'Oils',         image: '/images/categories/oils.jpg' },
  { slug: 'tea-herbal',         label: 'Tea',          image: '/images/categories/tea-coffee.jpg' },
  { slug: 'olives-moroccan',    label: 'Olives',       image: '/images/categories/olives.jpg' },
  { slug: 'kitchenware',        label: 'Ceramics',     image: '/images/categories/ceramics.jpg' },
  { slug: 'condiments-pantry',  label: 'Pantry Goods', image: '/images/categories/pantry.jpg' },
];

export default function CategoryShowcase() {
  return (
    <section className="relative py-16 lg:py-24">

      {/* Heading */}
      <div className="text-center mb-12 px-6">
        <h2
          className="font-heading text-[var(--color-charcoal)] text-3xl lg:text-5xl mb-3"
          style={{ fontWeight: 300 }}
        >
          Explore by Category
        </h2>
        <p
          className="font-body text-sm max-w-sm mx-auto"
          style={{ color: 'rgba(42,32,22,0.42)', lineHeight: 1.75 }}
        >
          Discover authentic Moroccan spices, oils, teas, and artisan goods
        </p>
      </div>

      {/* Horizontal scroll strip */}
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex gap-4 px-6 lg:px-14 pb-2" style={{ width: 'max-content' }}>
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/shop/${cat.slug}`}
              className="group flex-shrink-0 w-[155px] lg:w-[185px]"
            >
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  aspectRatio: '2 / 3',
                  background: 'rgba(232,213,190,0.52)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.52)',
                  boxShadow: '0 4px 20px rgba(42,32,22,0.07)',
                }}
              >
                {/* Photo — fills top ~78% */}
                <div className="absolute inset-x-0 top-0" style={{ bottom: 52 }}>
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  {/* Gentle fade at bottom for label readability */}
                  <div
                    className="absolute inset-x-0 bottom-0 h-10 pointer-events-none"
                    style={{ background: 'linear-gradient(to top, rgba(232,213,190,0.45), transparent)' }}
                  />
                </div>

                {/* Label */}
                <div
                  className="absolute inset-x-0 bottom-0 h-[52px] flex items-center px-4"
                  style={{
                    background: 'rgba(232,213,190,0.88)',
                    backdropFilter: 'blur(4px)',
                    WebkitBackdropFilter: 'blur(4px)',
                    borderTop: '1px solid rgba(255,255,255,0.52)',
                  }}
                >
                  <span
                    className="font-heading text-[var(--color-charcoal)]"
                    style={{ fontSize: 15, fontWeight: 500 }}
                  >
                    {cat.label}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <p
        className="text-center font-body text-xs mt-10 px-6"
        style={{ color: 'rgba(42,32,22,0.35)', lineHeight: 1.75 }}
      >
        Directly sourced from Moroccan cooperatives. Trusted supply for Dubai homes and restaurants.
      </p>

    </section>
  );
}
