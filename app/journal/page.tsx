/**
 * /journal – The Rihla Journal
 * "Rihla" (رحلة) means "journey" in Arabic – a nod to Ibn Battuta's travelogue.
 */

import Link from 'next/link';

export const metadata = {
    title: 'The Rihla Journal – OUROZ',
    description: 'Stories, recipes, and traditions from the heart of Morocco. A journey through Amazigh culture and cuisine.',
};

interface JournalPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
}

const JOURNAL_POSTS: JournalPost[] = [
    {
        slug: 'art-of-moroccan-mint-tea',
        title: 'The Art of Moroccan Mint Tea',
        excerpt: 'More than a drink, Moroccan mint tea is a ritual of hospitality. Learn the traditional atay preparation passed down through generations of Amazigh families.',
        category: 'Traditions',
        date: '2025-12-15',
        readTime: '5 min read',
        image: 'https://placehold.co/800x500/2d5016/ffffff?text=Mint+Tea+Ritual',
    },
    {
        slug: 'ras-el-hanout-spice-guide',
        title: 'Ras el Hanout: The King of Spice Blends',
        excerpt: 'Every spice merchant has their secret recipe. We explore the history and 30+ ingredients that make up Morocco\'s most famous spice blend.',
        category: 'Spice Guide',
        date: '2025-11-28',
        readTime: '7 min read',
        image: 'https://placehold.co/800x500/8B4513/ffffff?text=Ras+el+Hanout',
    },
    {
        slug: 'argan-oil-liquid-gold',
        title: 'Argan Oil: Morocco\'s Liquid Gold',
        excerpt: 'From the cooperatives of Essaouira to your kitchen. The story of how Amazigh women preserve the ancient tradition of argan oil production.',
        category: 'Heritage',
        date: '2025-11-10',
        readTime: '6 min read',
        image: 'https://placehold.co/800x500/c9a84c/ffffff?text=Argan+Oil',
    },
    {
        slug: 'tagine-slow-cooking-secrets',
        title: 'Tagine: Secrets of Slow Cooking',
        excerpt: 'The conical clay pot that defines Moroccan cuisine. Master the techniques behind chicken tagine with preserved lemons and olives.',
        category: 'Recipes',
        date: '2025-10-22',
        readTime: '8 min read',
        image: 'https://placehold.co/800x500/cd853f/ffffff?text=Tagine+Cooking',
    },
    {
        slug: 'fez-medina-food-tour',
        title: 'A Food Tour Through the Fez Medina',
        excerpt: 'Walking through the world\'s largest car-free urban area, discovering street food, bakeries, and centuries-old food traditions.',
        category: 'Travel',
        date: '2025-10-05',
        readTime: '10 min read',
        image: 'https://placehold.co/800x500/9B1B30/ffffff?text=Fez+Medina',
    },
    {
        slug: 'couscous-friday-tradition',
        title: 'Friday Couscous: A Sacred Moroccan Tradition',
        excerpt: 'Every Friday, Moroccan families gather around a shared platter of couscous. This communal meal is more than food – it\'s identity.',
        category: 'Traditions',
        date: '2025-09-18',
        readTime: '5 min read',
        image: 'https://placehold.co/800x500/f5deb3/333333?text=Friday+Couscous',
    },
];

const CATEGORIES = ['All', 'Traditions', 'Recipes', 'Spice Guide', 'Heritage', 'Travel'];

function fmtDate(date: string, opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' }) {
    return new Date(date).toLocaleDateString('en-US', opts);
}

export default function JournalPage() {
    const featuredPost = JOURNAL_POSTS[0];
    const restPosts = JOURNAL_POSTS.slice(1);

    return (
        <div className="space-y-24 pb-12">
            {/* ═══════════ HERO ═══════════ */}
            <section className="relative text-center pt-16 pb-2">
                <div className="flex items-center justify-center gap-4 mb-7">
                    <span className="h-px w-10 bg-[var(--color-gold)]/30" />
                    <span
                        className="font-heading text-[var(--color-gold)]"
                        style={{ fontSize: '1.75rem', fontWeight: 300, lineHeight: 1 }}
                    >
                        ⵣ
                    </span>
                    <span className="h-px w-10 bg-[var(--color-gold)]/30" />
                </div>

                <p
                    className="font-body uppercase mb-6"
                    style={{
                        fontSize: '0.65rem',
                        letterSpacing: '0.5em',
                        color: 'rgba(201,168,76,0.85)',
                        fontWeight: 600,
                    }}
                >
                    الرحلة · The Journey
                </p>

                <h1
                    className="font-heading text-[var(--color-charcoal)] leading-[0.95] tracking-[-0.02em]"
                    style={{ fontSize: 'clamp(3rem, 8vw, 6.5rem)', fontWeight: 400 }}
                >
                    The{' '}
                    <em className="italic" style={{ fontWeight: 300, color: 'var(--color-imperial)' }}>
                        Rihla
                    </em>{' '}
                    Journal
                </h1>

                <p
                    className="font-body text-[var(--color-charcoal)]/55 mt-7 max-w-xl mx-auto leading-[1.85]"
                    style={{ fontSize: '0.95rem', fontWeight: 300 }}
                >
                    Stories, recipes, and traditions from the heart of Morocco — chronicles
                    of a journey through Amazigh culture, spice routes, and the quiet
                    ceremonies of the everyday.
                </p>

                <nav className="flex flex-wrap items-center justify-center gap-2 mt-10">
                    {CATEGORIES.map((cat, i) => (
                        <span
                            key={cat}
                            className={`font-body uppercase rounded-full px-4 py-2 transition-all duration-300 cursor-default ${
                                i === 0
                                    ? 'bg-[var(--color-charcoal)] text-[var(--color-sahara)]'
                                    : 'border border-[var(--color-charcoal)]/12 text-[var(--color-charcoal)]/55 hover:border-[var(--color-charcoal)]/30 hover:text-[var(--color-charcoal)]'
                            }`}
                            style={{ fontSize: '0.625rem', letterSpacing: '0.22em', fontWeight: 600 }}
                        >
                            {cat}
                        </span>
                    ))}
                </nav>
            </section>

            {/* ═══════════ FEATURED ═══════════ */}
            <section>
                <header className="flex items-end justify-between mb-8 border-b border-[var(--color-charcoal)]/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-[var(--color-gold)]/60" />
                        <p
                            className="font-body uppercase text-[var(--color-gold)]"
                            style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontWeight: 600 }}
                        >
                            Featured Story
                        </p>
                    </div>
                    <span
                        className="font-body uppercase text-[var(--color-charcoal)]/30"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}
                    >
                        Issue 01
                    </span>
                </header>

                <Link href={`/journal/${featuredPost.slug}`} className="group block">
                    <article
                        className="grid grid-cols-1 md:grid-cols-12 gap-0 overflow-hidden rounded-2xl"
                        style={{
                            background: 'rgba(253,248,240,0.7)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.55)',
                            boxShadow: '0 18px 50px -20px rgba(42,32,22,0.18)',
                        }}
                    >
                        <div className="md:col-span-7 relative overflow-hidden aspect-[16/10] md:aspect-auto md:min-h-[460px]">
                            <img
                                src={featuredPost.image}
                                alt={featuredPost.title}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/30 via-transparent to-transparent" />
                            <span
                                className="absolute top-5 left-5 font-body uppercase rounded-full px-3.5 py-1.5"
                                style={{
                                    fontSize: '0.6rem',
                                    letterSpacing: '0.25em',
                                    fontWeight: 600,
                                    background: 'rgba(253,248,240,0.92)',
                                    color: 'var(--color-imperial)',
                                    backdropFilter: 'blur(6px)',
                                }}
                            >
                                {featuredPost.category}
                            </span>
                        </div>

                        <div className="md:col-span-5 flex flex-col justify-center p-8 md:p-12 lg:p-14">
                            <p
                                className="font-body uppercase text-[var(--color-charcoal)]/40 mb-5"
                                style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontWeight: 500 }}
                            >
                                {fmtDate(featuredPost.date)} · {featuredPost.readTime}
                            </p>

                            <h2
                                className="font-heading text-[var(--color-charcoal)] mb-5 leading-[1.05] tracking-[-0.01em] transition-colors duration-500 group-hover:text-[var(--color-imperial)]"
                                style={{ fontSize: 'clamp(1.65rem, 3vw, 2.5rem)', fontWeight: 400 }}
                            >
                                {featuredPost.title}
                            </h2>

                            <p
                                className="font-body text-[var(--color-charcoal)]/60 leading-[1.85] mb-8"
                                style={{ fontSize: '0.92rem', fontWeight: 300 }}
                            >
                                {featuredPost.excerpt}
                            </p>

                            <span
                                className="inline-flex items-center gap-3 font-body uppercase text-[var(--color-charcoal)] group-hover:text-[var(--color-imperial)] transition-colors duration-400"
                                style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 600 }}
                            >
                                Read the Story
                                <span
                                    className="inline-block transition-transform duration-500 group-hover:translate-x-1.5"
                                    aria-hidden
                                >
                                    →
                                </span>
                            </span>
                        </div>
                    </article>
                </Link>
            </section>

            {/* ═══════════ ARCHIVE GRID ═══════════ */}
            <section>
                <header className="flex items-end justify-between mb-10 border-b border-[var(--color-charcoal)]/10 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="h-px w-6 bg-[var(--color-gold)]/60" />
                        <p
                            className="font-body uppercase text-[var(--color-gold)]"
                            style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontWeight: 600 }}
                        >
                            The Archive
                        </p>
                    </div>
                    <span
                        className="font-body uppercase text-[var(--color-charcoal)]/30"
                        style={{ fontSize: '0.6rem', letterSpacing: '0.25em' }}
                    >
                        {restPosts.length} Stories
                    </span>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-14">
                    {restPosts.map((post) => (
                        <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
                            <article>
                                <div className="relative overflow-hidden rounded-xl mb-6 aspect-[4/5]">
                                    <img
                                        src={post.image}
                                        alt={post.title}
                                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.06]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/40 via-transparent to-transparent opacity-70" />
                                    <span
                                        className="absolute top-4 left-4 font-body uppercase rounded-full px-3 py-1"
                                        style={{
                                            fontSize: '0.55rem',
                                            letterSpacing: '0.25em',
                                            fontWeight: 600,
                                            background: 'rgba(253,248,240,0.92)',
                                            color: 'var(--color-imperial)',
                                            backdropFilter: 'blur(6px)',
                                        }}
                                    >
                                        {post.category}
                                    </span>
                                </div>

                                <p
                                    className="font-body uppercase text-[var(--color-charcoal)]/35 mb-3"
                                    style={{ fontSize: '0.58rem', letterSpacing: '0.28em', fontWeight: 500 }}
                                >
                                    {fmtDate(post.date, { month: 'short', day: 'numeric', year: 'numeric' })} · {post.readTime}
                                </p>

                                <h3
                                    className="font-heading text-[var(--color-charcoal)] leading-[1.15] tracking-[-0.01em] mb-3 transition-colors duration-400 group-hover:text-[var(--color-imperial)]"
                                    style={{ fontSize: '1.4rem', fontWeight: 400 }}
                                >
                                    {post.title}
                                </h3>

                                <p
                                    className="font-body text-[var(--color-charcoal)]/55 leading-[1.75] line-clamp-3 mb-5"
                                    style={{ fontSize: '0.85rem', fontWeight: 300 }}
                                >
                                    {post.excerpt}
                                </p>

                                <span
                                    className="inline-flex items-center gap-2 font-body uppercase text-[var(--color-charcoal)]/70 group-hover:text-[var(--color-imperial)] transition-colors duration-400"
                                    style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontWeight: 600 }}
                                >
                                    Read
                                    <span
                                        className="inline-block transition-transform duration-500 group-hover:translate-x-1"
                                        aria-hidden
                                    >
                                        →
                                    </span>
                                </span>
                            </article>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ═══════════ NEWSLETTER ═══════════ */}
            <section className="relative">
                <div
                    className="relative overflow-hidden rounded-2xl px-8 py-16 md:px-16 md:py-20 text-center"
                    style={{
                        background: 'linear-gradient(160deg, var(--color-ink) 0%, #1a1410 100%)',
                        boxShadow: '0 30px 80px -30px rgba(42,32,22,0.45)',
                    }}
                >
                    <div
                        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[420px] h-[420px] rounded-full opacity-20 pointer-events-none"
                        style={{
                            background:
                                'radial-gradient(circle, rgba(212,175,55,0.55) 0%, transparent 60%)',
                        }}
                    />

                    <div className="relative">
                        <span
                            className="font-heading text-[var(--color-gold)]/80"
                            style={{ fontSize: '1.5rem', fontWeight: 300, lineHeight: 1 }}
                        >
                            ⵣ
                        </span>

                        <p
                            className="font-body uppercase text-[var(--color-gold)]/80 mt-6 mb-4"
                            style={{ fontSize: '0.6rem', letterSpacing: '0.45em', fontWeight: 600 }}
                        >
                            Subscribe
                        </p>

                        <h3
                            className="font-heading text-[var(--color-sahara)] mb-4 leading-[1.05] tracking-[-0.01em]"
                            style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', fontWeight: 400 }}
                        >
                            Stay on the journey
                        </h3>

                        <p
                            className="font-body text-[var(--color-sahara)]/55 max-w-md mx-auto mb-10 leading-[1.85]"
                            style={{ fontSize: '0.9rem', fontWeight: 300 }}
                        >
                            New stories, recipes, and limited harvests — delivered to your
                            inbox. No noise, only the journal.
                        </p>

                        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                            <input
                                type="email"
                                required
                                placeholder="your@email.com"
                                className="flex-1 px-5 py-3.5 rounded-full bg-white/[0.06] text-[var(--color-sahara)] placeholder:text-[var(--color-sahara)]/30 border border-white/10 focus:outline-none focus:border-[var(--color-gold)]/60 transition-colors"
                                style={{ fontSize: '0.85rem' }}
                            />
                            <button
                                type="submit"
                                className="px-7 py-3.5 rounded-full bg-[var(--color-gold)] text-[var(--color-ink)] font-body uppercase hover:bg-[var(--color-sahara)] transition-colors duration-400"
                                style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 700 }}
                            >
                                Subscribe
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
}
