/**
 * /journal/[slug] – Individual journal article page
 */

import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
    params: Promise<{ slug: string }>;
}

const ARTICLES: Record<string, {
    title: string;
    category: string;
    date: string;
    readTime: string;
    image: string;
    content: string[];
}> = {
    'art-of-moroccan-mint-tea': {
        title: 'The Art of Moroccan Mint Tea',
        category: 'Traditions',
        date: '2025-12-15',
        readTime: '5 min read',
        image: 'https://placehold.co/1200x600/2d5016/ffffff?text=Mint+Tea+Ritual',
        content: [
            'In Morocco, tea is not merely a beverage — it is the cornerstone of hospitality, a symbol of friendship, and a ritual passed down through countless generations of Amazigh and Arab families alike.',
            'The preparation of atay (أتاي), as it is known in Darija, follows a precise choreography. Chinese gunpowder green tea — tightly rolled into small pellets — forms the base. The tea is first "washed" with a splash of boiling water that is discarded, removing bitterness while preserving the tea\'s essential character.',
            'Fresh spearmint — not peppermint — is the traditional herb of choice. In winter, you might find wormwood (chiba) or verbena (louiza) as substitutes. The mint is never crushed; whole sprigs are tucked into the pot, their oils releasing slowly into the steaming liquid.',
            'Sugar is not optional. Generous blocks of compressed sugar are added directly to the pot, creating the characteristic sweetness that balances the bitterness of the gunpowder tea. The amount varies by region — southern families tend to use more, while northern preparations might be lighter.',
            'The pouring itself is an art: held at arm\'s length, the stream creates a frothy crown (razwa) atop each glass. This aeration enhances the flavor and cools the tea to a drinkable temperature. Three glasses are served — as the saying goes: "The first glass is as gentle as life, the second is as strong as love, the third is as bitter as death."',
            'At OUROZ, we carry Sultan and Damti teas sourced directly from Morocco, along with traditional tea glasses and pots. Bring the ritual home.',
        ],
    },
    'ras-el-hanout-spice-guide': {
        title: 'Ras el Hanout: The King of Spice Blends',
        category: 'Spice Guide',
        date: '2025-11-28',
        readTime: '7 min read',
        image: 'https://placehold.co/1200x600/8B4513/ffffff?text=Ras+el+Hanout',
        content: [
            'Ras el Hanout (رأس الحانوت) literally translates to "head of the shop" — meaning the very best blend a spice merchant has to offer. No two recipes are identical; each merchant guards their formula as a trade secret.',
            'A typical blend might contain 12 to 30 ingredients, though some legendary versions have included over 100. Common components include cumin, coriander, turmeric, paprika, cinnamon, ginger, black pepper, cardamom, clove, nutmeg, and allspice.',
            'What distinguishes a great ras el hanout from a merely good one are the rare additions: dried rosebuds, orris root, grains of paradise, long pepper, cubeb pepper, monk\'s pepper, and occasionally lavender. These floral and exotic notes create layers of complexity that unfold during cooking.',
            'In the souks of Marrakech and Fez, spice merchants (attareen) will often blend ras el hanout fresh to order, adjusting the proportions based on what dish you plan to prepare. A blend for lamb tagine differs subtly from one intended for couscous or mrouzia.',
            'The spice blend is remarkably versatile: rub it on meats before grilling, stir it into rice, sprinkle over roasted vegetables, or mix it into marinades. Its warmth without excessive heat makes it accessible to all palates.',
            'Our Hawaj brand Ras el Hanout Premium is sourced from a family-owned spice house in the Fez medina, where the recipe has been refined over four generations.',
        ],
    },
    'argan-oil-liquid-gold': {
        title: 'Argan Oil: Morocco\'s Liquid Gold',
        category: 'Heritage',
        date: '2025-11-10',
        readTime: '6 min read',
        image: 'https://placehold.co/1200x600/c9a84c/ffffff?text=Argan+Oil',
        content: [
            'The argan tree (Argania spinosa) grows nowhere else on Earth but in the semi-arid regions of southwestern Morocco. UNESCO declared the argan forest a Biosphere Reserve in 1998, recognizing both its ecological importance and the cultural heritage of the Amazigh women who harvest its fruit.',
            'The production process is extraordinarily labor-intensive. Each fruit contains a nut harder than a hazelnut, which must be cracked by hand between two stones. Inside, one to three tiny kernels yield just a few drops of oil. It takes approximately 30 kilograms of fruit to produce a single liter of argan oil.',
            'Culinary argan oil is made from roasted kernels, giving it a deep, nutty flavor with notes of hazelnut and caramel. It is drizzled over couscous, used in amlou (a Moroccan almond butter), and added to salads. Unlike olive oil, argan oil should never be heated — its delicate compounds break down at high temperatures.',
            'Women\'s cooperatives across the Souss-Massa region have transformed argan oil production into a vehicle for economic empowerment. These cooperatives provide fair wages, literacy programs, and healthcare to women who might otherwise have limited economic opportunities.',
            'The rising global demand for argan oil has been both a blessing and a challenge. While it has brought income to rural communities, it has also led to concerns about overexploitation of the argan forest. Sustainable harvesting practices are essential for preserving this unique ecosystem.',
            'House of Argan, available at OUROZ, works exclusively with certified cooperatives that follow sustainable harvesting practices and provide fair compensation to the women artisans.',
        ],
    },
    'tagine-slow-cooking-secrets': {
        title: 'Tagine: Secrets of Slow Cooking',
        category: 'Recipes',
        date: '2025-10-22',
        readTime: '8 min read',
        image: 'https://placehold.co/1200x600/cd853f/ffffff?text=Tagine+Cooking',
        content: [
            'The tagine is both a cooking vessel and the dish prepared within it. Its distinctive conical lid creates a natural convection cycle: steam rises, condenses on the cool upper walls, and drips back down, continuously basting the food in its own juices.',
            'A traditional tagine is made from unglazed clay, seasoned over time like a cast iron skillet. The clay absorbs flavors from each cooking session, developing a patina that enriches every subsequent dish. Modern glazed versions are more practical for everyday use but lack this character.',
            'The foundation of any tagine is a sofrito-like base: onions, garlic, olive oil, and a carefully measured blend of spices cooked low and slow until the onions melt into a silky sauce. This base takes patience — rushing it with high heat will produce a fundamentally different (and inferior) result.',
            'Classic combinations include chicken with preserved lemons and olives, lamb with prunes and almonds, and kefta (spiced meatballs) with eggs and tomato sauce. Vegetarian tagines with root vegetables, chickpeas, and dried fruits are equally celebrated.',
            'The key technique is layering: proteins go in first, surrounded by harder vegetables, then topped with softer ones and dried fruits. Everything cooks together on the lowest possible heat for hours, allowing flavors to marry and intensify.',
            'Temperature is critical: a tagine should never boil. The gentlest simmer — tiny bubbles barely breaking the surface — produces the tenderest meat and the most concentrated sauces. If you can hear it cooking, the heat is too high.',
            'Serve your tagine communally, placing the vessel in the center of the table. Tradition calls for eating directly from the dish with bread, each person eating from the section nearest to them.',
        ],
    },
    'fez-medina-food-tour': {
        title: 'A Food Tour Through the Fez Medina',
        category: 'Travel',
        date: '2025-10-05',
        readTime: '10 min read',
        image: 'https://placehold.co/1200x600/9B1B30/ffffff?text=Fez+Medina',
        content: [
            'Fez el Bali is the largest car-free urban zone in the world, a labyrinth of 9,000 narrow alleyways that has been continuously inhabited since the 9th century. Within its walls, food traditions survive that have changed remarkably little over centuries.',
            'The day begins at the communal wood-fired ovens (ferran). Women bring trays of marqa (slow-cooked stew) and bread dough in the morning, marked with a distinctive family symbol. By midday, they return to collect their perfectly baked creations — a system of communal cooking that has operated since medieval times.',
            'The spice quarter (souk el attarine) is a feast for the senses. Pyramids of ground cumin, paprika, and turmeric glow in jewel tones. Saffron threads are weighed on delicate brass scales. Merchants call out, offering samples of their signature ras el hanout.',
            'Street food in Fez is elevated to an art form. Bissara, a broad bean soup seasoned with cumin and drizzled with olive oil, is the city\'s unofficial breakfast. Sfenj, Moroccan doughnuts fried to golden perfection, are dipped in sugar or honey.',
            'At the tanneries of Chouara, the oldest leather tanneries in the world, the connection between food and craft becomes literal. The same olive oil, saffron, and poppy seeds used in cooking are employed to dye leather.',
            'The medina\'s restaurants range from simple hole-in-the-wall establishments serving perfect bowls of harira to palace riads offering multi-course diffa feasts with pastilla, tagine, and mechanical couscous.',
            'If you can\'t make it to Fez, OUROZ brings the medina\'s flavors to Dubai. Our spice collection, preserved foods, and traditional ingredients are sourced from the very same merchants who have supplied Fez\'s kitchens for generations.',
        ],
    },
    'couscous-friday-tradition': {
        title: 'Friday Couscous: A Sacred Moroccan Tradition',
        category: 'Traditions',
        date: '2025-09-18',
        readTime: '5 min read',
        image: 'https://placehold.co/1200x600/f5deb3/333333?text=Friday+Couscous',
        content: [
            'In Morocco, Friday is couscous day. This is not a suggestion or a restaurant special — it is a deeply rooted tradition observed by nearly every Moroccan family, regardless of social class, region, or background.',
            'The preparation begins early in the morning. Couscous grains are hand-rolled from semolina flour and water, then steamed three times in a couscoussier (a tall pot with a perforated steamer basket). Between steamings, the grains are raked by hand to prevent clumping and enriched with butter or olive oil.',
            'The accompanying stew — typically a rich vegetable medley with chickpeas, seven vegetables, and either lamb or chicken — simmers alongside the steaming process. The vegetables follow a seasonal calendar: pumpkin in autumn, turnips in winter, zucchini in summer.',
            'The communal aspect is essential. Family members gather around a single large platter, eating from its edges toward the center. The choicest pieces of meat are placed in the middle by the host, and custom dictates that you eat only from the section of the platter directly in front of you.',
            'This weekly gathering serves as the family\'s anchor — a time when multiple generations come together, disputes are set aside, and the bonds of kinship are reinforced through the simple act of sharing food.',
            'Dari Fine Semolina, available at OUROZ, is the same premium semolina used by Moroccan households to prepare this sacred weekly dish.',
        ],
    },
};

export async function generateMetadata({ params }: Props) {
    const { slug } = await params;
    const article = ARTICLES[slug];
    if (!article) return { title: 'Article Not Found – OUROZ' };
    return {
        title: `${article.title} – The Rihla Journal`,
        description: article.content[0]?.slice(0, 160),
    };
}

export default async function JournalArticlePage({ params }: Props) {
    const { slug } = await params;
    const article = ARTICLES[slug];

    if (!article) notFound();

    const formattedDate = new Date(article.date).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <article className="max-w-3xl mx-auto pb-12">
            {/* Breadcrumb */}
            <nav
                className="font-body uppercase mb-12"
                style={{ fontSize: '0.6rem', letterSpacing: '0.28em', fontWeight: 500 }}
            >
                <Link
                    href="/journal"
                    className="text-[var(--color-charcoal)]/40 hover:text-[var(--color-imperial)] transition-colors"
                >
                    Journal
                </Link>
                <span className="mx-3 text-[var(--color-charcoal)]/20">/</span>
                <span className="text-[var(--color-charcoal)]/65">{article.category}</span>
            </nav>

            {/* Header */}
            <header className="text-center mb-12">
                <div className="flex items-center justify-center gap-4 mb-7">
                    <span className="h-px w-10 bg-[var(--color-gold)]/30" />
                    <span
                        className="font-heading text-[var(--color-gold)]"
                        style={{ fontSize: '1.5rem', fontWeight: 300, lineHeight: 1 }}
                    >
                        ⵣ
                    </span>
                    <span className="h-px w-10 bg-[var(--color-gold)]/30" />
                </div>

                <p
                    className="font-body uppercase text-[var(--color-imperial)] mb-7"
                    style={{ fontSize: '0.62rem', letterSpacing: '0.4em', fontWeight: 600 }}
                >
                    {article.category}
                </p>

                <h1
                    className="font-heading text-[var(--color-charcoal)] leading-[1.05] tracking-[-0.015em] mb-8"
                    style={{ fontSize: 'clamp(2.25rem, 5.5vw, 4rem)', fontWeight: 400 }}
                >
                    {article.title}
                </h1>

                <div
                    className="flex items-center justify-center gap-4 font-body uppercase text-[var(--color-charcoal)]/40"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.28em', fontWeight: 500 }}
                >
                    <span>{formattedDate}</span>
                    <span className="h-1 w-1 rounded-full bg-[var(--color-gold)]/50" />
                    <span>{article.readTime}</span>
                </div>
            </header>

            {/* Hero image */}
            <div
                className="aspect-[2/1] rounded-2xl overflow-hidden mb-14 relative"
                style={{
                    boxShadow: '0 24px 60px -25px rgba(42,32,22,0.25)',
                    border: '1px solid rgba(255,255,255,0.55)',
                }}
            >
                <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-charcoal)]/15 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Body */}
            <div className="space-y-7">
                {article.content.map((paragraph, i) => (
                    <p
                        key={i}
                        className={`font-body text-[var(--color-charcoal)]/75 leading-[1.95] ${
                            i === 0
                                ? 'text-[1.1rem] first-letter:text-[4.5rem] first-letter:font-heading first-letter:font-normal first-letter:text-[var(--color-imperial)] first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:leading-[0.9]'
                                : 'text-[1rem]'
                        }`}
                        style={{ fontWeight: 300 }}
                    >
                        {paragraph}
                    </p>
                ))}
            </div>

            {/* Ornament divider */}
            <div className="flex items-center justify-center gap-4 my-16">
                <span className="h-px w-16 bg-[var(--color-gold)]/30" />
                <span
                    className="font-heading text-[var(--color-gold)]/70"
                    style={{ fontSize: '1.25rem', fontWeight: 300, lineHeight: 1 }}
                >
                    ⵣ
                </span>
                <span className="h-px w-16 bg-[var(--color-gold)]/30" />
            </div>

            {/* CTA */}
            <div
                className="relative overflow-hidden rounded-2xl px-8 py-12 md:px-12 text-center"
                style={{
                    background: 'rgba(253,248,240,0.7)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.55)',
                    boxShadow: '0 18px 50px -20px rgba(42,32,22,0.18)',
                }}
            >
                <p
                    className="font-body uppercase text-[var(--color-gold)] mb-4"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.4em', fontWeight: 600 }}
                >
                    From the Souk
                </p>
                <h3
                    className="font-heading text-[var(--color-charcoal)] mb-4 leading-[1.15] tracking-[-0.01em]"
                    style={{ fontSize: 'clamp(1.4rem, 3vw, 1.85rem)', fontWeight: 400 }}
                >
                    Bring this story home
                </h3>
                <p
                    className="font-body text-[var(--color-charcoal)]/55 max-w-md mx-auto mb-8 leading-[1.85]"
                    style={{ fontSize: '0.9rem', fontWeight: 300 }}
                >
                    Explore the products, spices, and ingredients featured in this article —
                    sourced directly from Morocco.
                </p>
                <Link
                    href="/shop"
                    className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full bg-[var(--color-charcoal)] text-[var(--color-sahara)] font-body uppercase hover:bg-[var(--color-imperial)] transition-colors duration-500"
                    style={{ fontSize: '0.65rem', letterSpacing: '0.3em', fontWeight: 700 }}
                >
                    Shop the Story
                    <span aria-hidden>→</span>
                </Link>
            </div>

            {/* Back link */}
            <div className="mt-12 text-center">
                <Link
                    href="/journal"
                    className="inline-flex items-center gap-2 font-body uppercase text-[var(--color-charcoal)]/50 hover:text-[var(--color-imperial)] transition-colors"
                    style={{ fontSize: '0.6rem', letterSpacing: '0.3em', fontWeight: 600 }}
                >
                    <span aria-hidden>←</span>
                    Back to Journal
                </Link>
            </div>
        </article>
    );
}
