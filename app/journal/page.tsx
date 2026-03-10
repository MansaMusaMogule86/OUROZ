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

export default function JournalPage() {
    const featuredPost = JOURNAL_POSTS[0];
    const restPosts = JOURNAL_POSTS.slice(1);

    return (
        <div className="space-y-20">
            {/* Hero */}
            <section className="text-center pt-12">
                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[var(--color-gold)]/40 mb-5">
                    الرحلة — The Journey
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-ink)]" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
                    The Rihla Journal
                </h1>
                <p className="text-sm text-[var(--color-charcoal)]/35 mt-5 max-w-md mx-auto leading-[1.8]" style={{ fontWeight: 300 }}>
                    Stories, recipes, and traditions from the heart of Morocco.
                </p>
                <div className="w-10 h-px bg-[var(--color-gold)]/20 mx-auto mt-8" />
            </section>

            {/* Featured post — editorial layout */}
            <Link href={`/journal/${featuredPost.slug}`} className="block group">
                <article className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden border border-[var(--color-charcoal)]/[0.04] hover:border-[var(--color-charcoal)]/[0.08] transition-all duration-500">
                    <div className="aspect-[16/10] md:aspect-auto relative overflow-hidden">
                        <img
                            src={featuredPost.image}
                            alt={featuredPost.title}
                            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                        />
                    </div>
                    <div className="flex flex-col justify-center p-8 md:p-12 bg-[var(--color-parchment)]">
                        <div className="flex items-center gap-3 mb-5">
                            <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-imperial)]/60">
                                {featuredPost.category}
                            </span>
                            <span className="text-[9px] text-[var(--color-charcoal)]/20">
                                {new Date(featuredPost.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                            </span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-ink)] mb-5 group-hover:text-[var(--color-imperial)] transition-colors duration-300" style={{ fontWeight: 300 }}>
                            {featuredPost.title}
                        </h2>
                        <p className="text-sm text-[var(--color-charcoal)]/35 leading-[1.8] mb-6" style={{ fontWeight: 300 }}>
                            {featuredPost.excerpt}
                        </p>
                        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-[var(--color-charcoal)]/30">
                            {featuredPost.readTime}
                        </span>
                    </div>
                </article>
            </Link>

            {/* Posts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {restPosts.map(post => (
                    <Link key={post.slug} href={`/journal/${post.slug}`} className="group block">
                        <article>
                            <div className="img-zoom mb-5">
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="w-full h-[240px] md:h-[260px] object-cover"
                                />
                            </div>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-imperial)]/50">
                                    {post.category}
                                </span>
                            </div>
                            <h3 className="text-lg font-serif text-[var(--color-charcoal)] mb-2 group-hover:text-[var(--color-imperial)] transition-colors duration-300" style={{ fontWeight: 400 }}>
                                {post.title}
                            </h3>
                            <p className="text-xs text-[var(--color-charcoal)]/30 leading-relaxed mb-3 line-clamp-2" style={{ fontWeight: 300 }}>
                                {post.excerpt}
                            </p>
                            <div className="flex items-center justify-between text-[9px] text-[var(--color-charcoal)]/20 uppercase tracking-wider">
                                <span>
                                    {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                                <span>{post.readTime}</span>
                            </div>
                        </article>
                    </Link>
                ))}
            </div>

            {/* Newsletter CTA */}
            <section className="text-center py-12">
                <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-serif text-[var(--color-ink)] mb-3" style={{ fontWeight: 300 }}>
                        Stay on the journey
                    </h3>
                    <p className="text-xs text-[var(--color-charcoal)]/30 mb-6">
                        Subscribe to The Rihla Journal for new stories, recipes, and exclusive offers.
                    </p>
                    <div className="flex gap-2">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-4 py-3.5 text-sm border border-[var(--color-charcoal)]/[0.08] bg-white
                                       focus:outline-none focus:border-[var(--color-charcoal)]/20 transition-colors"
                        />
                        <button
                            type="button"
                            className="px-6 py-3.5 bg-[var(--color-ink)] text-[var(--color-sahara)] text-[10px] font-medium uppercase tracking-[0.2em] hover:bg-[var(--color-imperial)] transition-colors duration-500"
                        >
                            Subscribe
                        </button>
                    </div>
                </div>
            </section>
        </div>
    );
}
