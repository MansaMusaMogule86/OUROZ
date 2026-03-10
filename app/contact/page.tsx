/**
 * /contact – Contact OUROZ page
 */

'use client';

import { useState } from 'react';

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSubmitting(true);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.details?.[0] ?? data?.error ?? 'Failed to send message');
            }

            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-20">
            {/* Hero */}
            <section className="text-center pt-12">
                <p className="text-[9px] font-medium uppercase tracking-[0.5em] text-[var(--color-gold)]/40 mb-5">
                    Get in Touch
                </p>
                <h1 className="text-4xl md:text-6xl font-serif text-[var(--color-ink)]" style={{ fontWeight: 300, letterSpacing: '0.02em' }}>
                    Contact Us
                </h1>
                <div className="w-10 h-px bg-[var(--color-gold)]/20 mx-auto mt-8 mb-8" />
                <p className="text-sm text-[var(--color-charcoal)]/35 max-w-md mx-auto leading-[1.8]" style={{ fontWeight: 300 }}>
                    Have a question about our products, wholesale pricing, or delivery? We&apos;re here to help.
                </p>
            </section>

            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
                {/* Contact info */}
                <div className="space-y-10">
                    {[
                        { title: 'Address', lines: ['OUROZ Trading LLC', 'Dubai, United Arab Emirates'] },
                        { title: 'Email', lines: ['hello@ouroz.ae', 'wholesale@ouroz.ae'] },
                        { title: 'Phone', lines: ['+971 50 XXX XXXX', 'Sun–Thu: 9am – 6pm'] },
                        { title: 'Working Hours', lines: ['Sunday – Thursday: 9am – 6pm', 'Friday – Saturday: Closed'] },
                    ].map(info => (
                        <div key={info.title}>
                            <h3 className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/40 mb-2">
                                {info.title}
                            </h3>
                            {info.lines.map(line => (
                                <p key={line} className="text-sm text-[var(--color-charcoal)]/50 leading-relaxed" style={{ fontWeight: 300 }}>
                                    {line}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Contact form */}
                <div className="md:col-span-2">
                    {submitted ? (
                        <div className="border border-[var(--color-zellige)]/15 p-12 text-center bg-[var(--color-parchment)]">
                            <h3 className="text-xl font-serif text-[var(--color-ink)] mb-3" style={{ fontWeight: 300 }}>
                                Message sent
                            </h3>
                            <p className="text-sm text-[var(--color-charcoal)]/35 mb-6" style={{ fontWeight: 300 }}>
                                Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                            </p>
                            <button
                                type="button"
                                onClick={() => { setSubmitted(false); setError(null); setForm({ name: '', email: '', subject: '', message: '' }); }}
                                className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--color-imperial)] hover:text-[var(--color-imperial)]/70 transition-colors duration-300"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {error && (
                                <div className="p-4 border border-[var(--color-imperial)]/20 bg-[var(--color-imperial)]/5 text-sm text-[var(--color-imperial)]">
                                    {error}
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/30 mb-2">
                                        Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3.5 text-sm border border-[var(--color-charcoal)]/[0.08] bg-white
                                                   focus:outline-none focus:border-[var(--color-charcoal)]/20 transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/30 mb-2">
                                        Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-4 py-3.5 text-sm border border-[var(--color-charcoal)]/[0.08] bg-white
                                                   focus:outline-none focus:border-[var(--color-charcoal)]/20 transition-colors"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/30 mb-2">
                                    Subject
                                </label>
                                <select
                                    value={form.subject}
                                    onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full px-4 py-3.5 text-sm border border-[var(--color-charcoal)]/[0.08] bg-white
                                               focus:outline-none focus:border-[var(--color-charcoal)]/20 transition-colors"
                                >
                                    <option value="">Select a topic</option>
                                    <option value="general">General Inquiry</option>
                                    <option value="wholesale">Wholesale & Business</option>
                                    <option value="order">Order Issue</option>
                                    <option value="delivery">Delivery Question</option>
                                    <option value="supplier">Become a Supplier</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-[9px] font-medium uppercase tracking-[0.2em] text-[var(--color-charcoal)]/30 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full px-4 py-3.5 text-sm border border-[var(--color-charcoal)]/[0.08] bg-white resize-none
                                               focus:outline-none focus:border-[var(--color-charcoal)]/20 transition-colors"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full py-4 bg-[var(--color-ink)] text-[var(--color-sahara)] text-[10px] font-medium uppercase tracking-[0.25em] hover:bg-[var(--color-imperial)] transition-colors duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submitting ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
