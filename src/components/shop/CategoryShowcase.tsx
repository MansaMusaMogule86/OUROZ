/**
 * OUROZ — CategoryShowcase
 * Premium staggered category section with editorial asymmetric layout.
 * Server component — renders the architectural grid.
 * Individual cards are client components for hover interactions.
 */

import CategoryCard from './CategoryCard';
import type { CategoryCardData } from './CategoryCard';

// ─── Curated Category Data ─────────────────────────────────────────────────
// In production, this comes from the database via fetchCategories().
// The showcase always displays exactly 10 curated categories.
// Each image should be a high-resolution editorial photograph.

const SHOWCASE_CATEGORIES: CategoryCardData[] = [
    {
        slug: 'spices-rare-seasonings',
        title: 'Spices & Rare Seasonings',
        subtitle: 'Heritage blends from Fez and Meknes',
        imageUrl: '/images/categories/spices.jpg',
        featured: true,
    },
    {
        slug: 'single-origin-olive-oils',
        title: 'Single Origin Olive Oils',
        subtitle: 'Cold-pressed from certified groves',
        imageUrl: '/images/categories/olive-oils.jpg',
    },
    {
        slug: 'couscous-heritage-grains',
        title: 'Couscous & Heritage Grains',
        subtitle: 'Hand-rolled by master artisans',
        imageUrl: '/images/categories/couscous.jpg',
    },
    {
        slug: 'artisan-patisserie',
        title: 'Artisan Pâtisserie & Sweets',
        subtitle: 'Traditional recipes, pure ingredients',
        imageUrl: '/images/categories/patisserie.jpg',
    },
    {
        slug: 'ceremonial-tea-coffee',
        title: 'Ceremonial Tea & Coffee',
        subtitle: 'Curated origins for ritual service',
        imageUrl: '/images/categories/tea-coffee.jpg',
    },
    {
        slug: 'argan-botanical-beauty',
        title: 'Argan & Botanical Beauty',
        subtitle: 'Cold-pressed argan and rare botanicals',
        imageUrl: '/images/categories/argan.jpg',
    },
    {
        slug: 'handwoven-textiles',
        title: 'Handwoven Textiles',
        subtitle: 'Atlas looms, Berber tradition',
        imageUrl: '/images/categories/textiles.jpg',
    },
    {
        slug: 'moroccan-ceramics',
        title: 'Moroccan Ceramics',
        subtitle: 'Fez and Safi master workshops',
        imageUrl: '/images/categories/ceramics.jpg',
    },
    {
        slug: 'atlantic-seafood',
        title: 'Atlantic Tuna & Seafood',
        subtitle: 'Port-direct, premium catch',
        imageUrl: '/images/categories/seafood.jpg',
    },
    {
        slug: 'curated-grocery',
        title: 'Curated Grocery Essentials',
        subtitle: 'The everyday, elevated',
        imageUrl: '/images/categories/grocery.jpg',
    },
];

interface CategoryShowcaseProps {
    /** Override with database categories if available */
    categories?: CategoryCardData[];
    /** Section title */
    title?: string;
}

export default function CategoryShowcase({
    categories,
    title = 'The Collection',
}: CategoryShowcaseProps) {
    const cats = categories && categories.length >= 6 ? categories : SHOWCASE_CATEGORIES;

    // Split into architectural rows
    const featured = cats[0];     // Row 1 left — dominant
    const stackTop = cats[1];     // Row 1 right top
    const stackBot = cats[2];     // Row 1 right bottom
    const row2 = cats.slice(3, 6);  // Row 2 — three even cards
    const row3 = cats.slice(6, 10); // Row 3 — remaining four (optional)

    return (
        <section className="relative" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
            <div className="max-w-[1200px] mx-auto px-5 sm:px-10">

                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2
                        className="text-[var(--color-charcoal)]"
                        style={{
                            fontFamily: 'var(--font-serif, "Playfair Display", serif)',
                            fontSize: 'clamp(1.75rem, 4vw, 2.75rem)',
                            fontWeight: 300,
                            letterSpacing: '0.08em',
                        }}
                    >
                        {title}
                    </h2>
                    <div
                        className="mx-auto mt-5"
                        style={{
                            width: '40px',
                            height: '1px',
                            backgroundColor: 'rgba(212, 175, 55, 0.3)',
                        }}
                    />
                </div>

                {/* ── Row 1: Featured + Stacked Pair ────────────────────── */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Featured (left, dominant) */}
                    <CategoryCard
                        data={featured}
                        className="h-[320px] md:h-[380px] lg:h-[420px]"
                        priority
                    />

                    {/* Right stack */}
                    <div className="grid grid-cols-1 gap-5">
                        <CategoryCard
                            data={stackTop}
                            className="h-[260px] md:h-[200px] lg:h-[200px]"
                        />
                        <CategoryCard
                            data={stackBot}
                            className="h-[260px] md:h-[200px] lg:h-[200px]"
                        />
                    </div>
                </div>

                {/* ── Row 2: Three Even Cards ───────────────────────────── */}
                {row2.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
                        {row2.map(cat => (
                            <CategoryCard
                                key={cat.slug}
                                data={cat}
                                className="h-[260px] md:h-[320px]"
                            />
                        ))}
                    </div>
                )}

                {/* ── Row 3: Four Remaining (optional) ─────────────────── */}
                {row3.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5">
                        {row3.map(cat => (
                            <CategoryCard
                                key={cat.slug}
                                data={cat}
                                className="h-[240px] md:h-[280px]"
                            />
                        ))}
                    </div>
                )}

                {/* ── Browse All Link ──────────────────────────────────── */}
                <div className="text-center mt-14">
                    <a
                        href="/shop"
                        className="inline-block text-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)]/80 transition-colors duration-400"
                        style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            letterSpacing: '0.25em',
                            textTransform: 'uppercase',
                            borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
                            paddingBottom: '4px',
                        }}
                    >
                        Browse All Categories
                    </a>
                </div>
            </div>
        </section>
    );
}
