/**
 * /about – About OUROZ page
 */

import Link from 'next/link';

export const metadata = {
    title: 'About OUROZ – Authentic Moroccan Products in Dubai',
    description: 'OUROZ bridges Morocco and the UAE, delivering authentic Amazigh products, spices, and artisan goods directly to your door.',
};

export default function AboutPage() {
    return (
        <div className="space-y-24">
            {/* Hero */}
            <section className="text-center pt-12">
                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[var(--color-gold)]/40 mb-5">
                    Our Story
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-ink)]" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
                    About OUROZ
                </h1>
                <div className="w-10 h-px bg-[var(--color-gold)]/20 mx-auto mt-8 mb-8" />
                <p className="text-sm text-[var(--color-charcoal)]/35 max-w-xl mx-auto leading-[1.9]" style={{ fontWeight: 300 }}>
                    OUROZ — derived from the Amazigh word for &quot;gold&quot; — is a marketplace that bridges the rich heritage of Morocco with the vibrant communities of the UAE.
                </p>
            </section>

            {/* Mission — asymmetric editorial */}
            <section className="max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
                    <div className="md:col-span-5 aspect-[4/5] overflow-hidden bg-gradient-to-br from-[var(--color-imperial)]/[0.06] to-[var(--color-gold)]/[0.06] flex items-center justify-center">
                        <img src="/logo/logo.png" alt="OUROZ" className="w-[60%] h-[60%] object-contain select-none" draggable={false} />
                    </div>
                    <div className="md:col-span-7 space-y-6">
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[var(--color-clay)]">
                            Our Mission
                        </p>
                        <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-ink)] leading-[1.2]" style={{ fontWeight: 300 }}>
                            Connecting heritage to the modern table
                        </h2>
                        <div className="w-10 h-px bg-[var(--color-gold)]/20" />
                        <p className="text-sm text-[var(--color-charcoal)]/35 leading-[1.9]" style={{ fontWeight: 300 }}>
                            We believe that food connects people to their roots. For the Moroccan diaspora in the UAE — and for anyone who appreciates authentic flavors — OUROZ provides a direct link to the spices, preserves, teas, and artisan products that define Moroccan cuisine and culture.
                        </p>
                        <p className="text-sm text-[var(--color-charcoal)]/35 leading-[1.9]" style={{ fontWeight: 300 }}>
                            We work directly with Moroccan cooperatives, family-owned brands, and artisan producers to ensure fair trade practices and the highest quality. Every product on OUROZ carries a verified lineage back to its source.
                        </p>
                    </div>
                </div>
            </section>

            {/* Values — numbered pillars */}
            <section className="max-w-5xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[var(--color-gold)]/40 mb-4">
                        Our Values
                    </p>
                    <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-ink)]" style={{ fontWeight: 300 }}>
                        What We Stand For
                    </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[var(--color-charcoal)]/[0.06]">
                    {[
                        { num: '01', title: 'Authenticity', desc: 'Every product is sourced directly from Morocco with verified provenance. No middlemen, no compromises on quality.' },
                        { num: '02', title: 'Fair Trade', desc: 'We partner with women-led cooperatives and family businesses, ensuring fair compensation and sustainable practices.' },
                        { num: '03', title: 'Community', desc: 'OUROZ serves the Moroccan community in the UAE while introducing Amazigh culture to a global audience through food.' },
                    ].map((v, i) => (
                        <div key={v.num} className={`py-12 md:py-14 md:px-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-[var(--color-charcoal)]/[0.06]' : ''}`}>
                            <span className="text-[10px] font-serif text-[var(--color-gold)]/40 tracking-wider">{v.num}</span>
                            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-charcoal)] mt-3 mb-4">{v.title}</h3>
                            <p className="text-sm text-[var(--color-charcoal)]/30 leading-[1.8]" style={{ fontWeight: 300 }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-[var(--color-charcoal)]/[0.06]">
                    {[
                        { num: '04', title: 'Fresh & Fast', desc: 'Same-day and next-day delivery across all Emirates. Temperature-controlled logistics keep products fresh.' },
                        { num: '05', title: 'Wholesale Ready', desc: 'Restaurants, cafes, and retailers can access wholesale pricing with flexible credit terms and bulk delivery.' },
                        { num: '06', title: 'Cultural Bridge', desc: 'Through The Rihla Journal, we share stories, recipes, and traditions that connect food to its deeper cultural meaning.' },
                    ].map((v, i) => (
                        <div key={v.num} className={`py-12 md:py-14 md:px-8 ${i < 2 ? 'border-b md:border-b-0 md:border-r border-[var(--color-charcoal)]/[0.06]' : ''}`}>
                            <span className="text-[10px] font-serif text-[var(--color-gold)]/40 tracking-wider">{v.num}</span>
                            <h3 className="text-sm font-medium uppercase tracking-[0.15em] text-[var(--color-charcoal)] mt-3 mb-4">{v.title}</h3>
                            <p className="text-sm text-[var(--color-charcoal)]/30 leading-[1.8]" style={{ fontWeight: 300 }}>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section className="text-center py-12">
                <h2 className="text-2xl md:text-3xl font-serif text-[var(--color-ink)] mb-6" style={{ fontWeight: 300 }}>
                    Ready to explore Morocco?
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/shop"
                        className="inline-flex items-center justify-center px-10 py-4 bg-[var(--color-ink)] text-[var(--color-sahara)] text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-[var(--color-imperial)] transition-colors duration-500"
                    >
                        Browse Products
                    </Link>
                    <Link
                        href="/supplier/register"
                        className="inline-flex items-center justify-center px-10 py-4 border border-[var(--color-charcoal)]/15 text-[var(--color-charcoal)]/60 text-[10px] font-medium uppercase tracking-[0.3em] hover:border-[var(--color-charcoal)]/40 hover:text-[var(--color-charcoal)] transition-all duration-500"
                    >
                        Become a Supplier
                    </Link>
                </div>
            </section>
        </div>
    );
}
