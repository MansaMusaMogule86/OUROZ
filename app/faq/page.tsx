/**
 * /faq – Frequently Asked Questions
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FAQ {
    question: string;
    answer: string;
}

const FAQ_SECTIONS: { title: string; faqs: FAQ[] }[] = [
    {
        title: 'Shopping & Orders',
        faqs: [
            {
                question: 'How do I place an order?',
                answer: 'Browse our shop, add products to your cart, and proceed to checkout. You can pay with a credit/debit card or, if you have an approved business account, use Pay on Invoice.',
            },
            {
                question: 'What payment methods do you accept?',
                answer: 'We accept Visa, Mastercard, and Apple Pay for retail orders. Approved business accounts can also use our Pay on Invoice option with net-30 credit terms.',
            },
            {
                question: 'Can I modify or cancel my order?',
                answer: 'You can modify or cancel your order within 1 hour of placing it. After that, please contact our support team. Once an order is shipped, it cannot be cancelled.',
            },
            {
                question: 'Do you offer gift wrapping?',
                answer: 'Not yet, but we\'re working on it! Traditional Moroccan-style gift packaging will be available soon.',
            },
        ],
    },
    {
        title: 'Delivery & Shipping',
        faqs: [
            {
                question: 'Where do you deliver?',
                answer: 'We deliver to all seven Emirates in the UAE: Dubai, Abu Dhabi, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.',
            },
            {
                question: 'How much does delivery cost?',
                answer: 'Delivery is FREE for orders over AED 150. For orders below AED 150, a flat delivery fee of AED 25 applies.',
            },
            {
                question: 'How long does delivery take?',
                answer: 'Same-day delivery is available in Dubai for orders placed before 2pm. Next-day delivery for other Emirates. Wholesale/bulk orders may require 2-3 business days.',
            },
            {
                question: 'Do you ship internationally?',
                answer: 'Currently, we only deliver within the UAE. International shipping is on our roadmap for 2026.',
            },
        ],
    },
    {
        title: 'Wholesale & Business',
        faqs: [
            {
                question: 'How do I get wholesale pricing?',
                answer: 'Apply for a wholesale account through our Wholesale page. Once approved, you\'ll see tiered pricing on all eligible products. Discounts range from 8% to 15% depending on quantity.',
            },
            {
                question: 'What are the minimum order quantities?',
                answer: 'Minimum wholesale quantities vary by product, typically starting at 6 units. Check each product page for specific tier pricing.',
            },
            {
                question: 'Do you offer credit terms?',
                answer: 'Yes. Approved business accounts can use our Pay on Invoice option with net-30 credit terms. Credit limits are assigned based on your business profile and order history.',
            },
            {
                question: 'Can I become a supplier on OUROZ?',
                answer: 'Absolutely! If you produce or distribute authentic Moroccan products, apply through our Supplier Registration page. We review applications within 5 business days.',
            },
        ],
    },
    {
        title: 'Products & Quality',
        faqs: [
            {
                question: 'Are your products authentic?',
                answer: 'Every product on OUROZ is sourced directly from Morocco through verified supply chains. We work with established brands like Aicha, Sultan, Bimo, and artisan cooperatives.',
            },
            {
                question: 'How do you ensure freshness?',
                answer: 'We maintain temperature-controlled storage and use expedited shipping from Morocco. Products are inspected upon arrival and stored according to manufacturer specifications.',
            },
            {
                question: 'Do you carry organic products?',
                answer: 'Several of our products are organic or naturally produced, including our argan oil and honey. Look for the organic badge on qualifying products.',
            },
            {
                question: 'What if I receive a damaged product?',
                answer: 'Contact us within 48 hours of delivery with photos of the damage. We\'ll arrange a replacement or full refund at no additional cost.',
            },
        ],
    },
];

function FAQItem({ faq }: { faq: FAQ }) {
    const [open, setOpen] = useState(false);
    return (
        <div className="border-b border-[var(--color-charcoal)]/[0.04] last:border-0">
            <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left group"
            >
                <span className="text-sm text-[var(--color-charcoal)]/70 group-hover:text-[var(--color-charcoal)] transition-colors duration-300 pr-4" style={{ fontWeight: 400 }}>
                    {faq.question}
                </span>
                <span className={`text-sm text-[var(--color-charcoal)]/20 shrink-0 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}>
                    +
                </span>
            </button>
            {open && (
                <div className="pb-5 pr-8">
                    <p className="text-sm text-[var(--color-charcoal)]/35 leading-[1.8]" style={{ fontWeight: 300 }}>
                        {faq.answer}
                    </p>
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    return (
        <div className="space-y-20">
            {/* Hero */}
            <section className="text-center pt-12">
                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[var(--color-gold)]/40 mb-5">
                    Help Center
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-ink)]" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
                    Frequently Asked Questions
                </h1>
                <div className="w-10 h-px bg-[var(--color-gold)]/20 mx-auto mt-8" />
            </section>

            {/* FAQ Sections */}
            <div className="max-w-3xl mx-auto space-y-16">
                {FAQ_SECTIONS.map(section => (
                    <div key={section.title}>
                        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[var(--color-clay)] mb-4">
                            {section.title}
                        </p>
                        <div className="border-t border-[var(--color-charcoal)]/[0.06]">
                            {section.faqs.map(faq => (
                                <FAQItem key={faq.question} faq={faq} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <section className="text-center py-12 max-w-lg mx-auto">
                <h3 className="text-xl font-serif text-[var(--color-ink)] mb-3" style={{ fontWeight: 300 }}>
                    Still have questions?
                </h3>
                <p className="text-xs text-[var(--color-charcoal)]/30 mb-8">
                    Our support team is ready to help you with anything.
                </p>
                <Link
                    href="/contact"
                    className="inline-block px-10 py-4 bg-[var(--color-ink)] text-[var(--color-sahara)] text-[10px] font-medium uppercase tracking-[0.3em] hover:bg-[var(--color-imperial)] transition-colors duration-500"
                >
                    Contact Us
                </Link>
            </section>
        </div>
    );
}
