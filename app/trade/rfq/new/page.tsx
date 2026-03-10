'use client';

import { useState } from 'react';
import Link from 'next/link';
import TradeCard from '@/components/trade/shared/TradeCard';
import { PRODUCT_CATEGORIES, INCOTERMS, CURRENCIES } from '@/lib/trade/trade-constants';

type WizardStep = 'product' | 'logistics' | 'review';

const steps: { id: WizardStep; label: string; num: number }[] = [
    { id: 'product', label: 'Product Details', num: 1 },
    { id: 'logistics', label: 'Logistics & Terms', num: 2 },
    { id: 'review', label: 'Review & Submit', num: 3 },
];

export default function NewRFQPage() {
    const [currentStep, setCurrentStep] = useState<WizardStep>('product');

    const [form, setForm] = useState({
        title: '',
        category: '',
        description: '',
        quantity: '',
        unit: '',
        targetPrice: '',
        currency: 'USD',
        incoterm: 'CIF',
        destinationPort: 'Jebel Ali, Dubai',
        requiredBy: '',
    });

    function update(field: string, value: string) {
        setForm((f) => ({ ...f, [field]: value }));
    }

    const currentIndex = steps.findIndex((s) => s.id === currentStep);

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <Link href="/trade/rfq" className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to RFQ Engine
            </Link>

            <h1
                className="text-2xl font-bold text-stone-900"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
            >
                Create New RFQ
            </h1>

            {/* Step indicator */}
            <div className="flex items-center gap-2">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center gap-2 flex-1">
                        <button
                            onClick={() => setCurrentStep(step.id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-colors w-full ${
                                currentStep === step.id
                                    ? 'bg-stone-900 text-white'
                                    : i < currentIndex
                                    ? 'bg-emerald-50 text-emerald-700'
                                    : 'bg-stone-100 text-stone-400'
                            }`}
                        >
                            <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                                {i < currentIndex ? '✓' : step.num}
                            </span>
                            {step.label}
                        </button>
                        {i < steps.length - 1 && <div className="w-4 h-px bg-stone-200 flex-shrink-0" />}
                    </div>
                ))}
            </div>

            {/* Step 1: Product */}
            {currentStep === 'product' && (
                <TradeCard padding="lg">
                    <div className="space-y-5">
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                RFQ Title
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => update('title', e.target.value)}
                                placeholder="e.g., Virgin Argan Oil — Cold Pressed, Cosmetic Grade"
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                Product Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => update('category', e.target.value)}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                            >
                                <option value="">Select category</option>
                                {PRODUCT_CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                Detailed Requirements
                            </label>
                            <textarea
                                value={form.description}
                                onChange={(e) => update('description', e.target.value)}
                                rows={4}
                                placeholder="Describe quality standards, certifications, packaging, etc."
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 resize-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    value={form.quantity}
                                    onChange={(e) => update('quantity', e.target.value)}
                                    placeholder="500"
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    value={form.unit}
                                    onChange={(e) => update('unit', e.target.value)}
                                    placeholder="liters, kg, pieces"
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button
                                onClick={() => setCurrentStep('logistics')}
                                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                            >
                                Next →
                            </button>
                        </div>
                    </div>
                </TradeCard>
            )}

            {/* Step 2: Logistics */}
            {currentStep === 'logistics' && (
                <TradeCard padding="lg">
                    <div className="space-y-5">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Target Price per Unit
                                </label>
                                <input
                                    type="number"
                                    value={form.targetPrice}
                                    onChange={(e) => update('targetPrice', e.target.value)}
                                    placeholder="45.00"
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Currency
                                </label>
                                <select
                                    value={form.currency}
                                    onChange={(e) => update('currency', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                >
                                    {CURRENCIES.map((c) => (
                                        <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Incoterm
                                </label>
                                <select
                                    value={form.incoterm}
                                    onChange={(e) => update('incoterm', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                >
                                    {INCOTERMS.map((term) => (
                                        <option key={term} value={term}>{term}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                    Destination Port
                                </label>
                                <input
                                    type="text"
                                    value={form.destinationPort}
                                    onChange={(e) => update('destinationPort', e.target.value)}
                                    className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-1.5">
                                Required By Date
                            </label>
                            <input
                                type="date"
                                value={form.requiredBy}
                                onChange={(e) => update('requiredBy', e.target.value)}
                                className="w-full px-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400"
                            />
                        </div>
                        <div className="flex justify-between">
                            <button
                                onClick={() => setCurrentStep('product')}
                                className="px-6 py-2.5 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors"
                            >
                                ← Back
                            </button>
                            <button
                                onClick={() => setCurrentStep('review')}
                                className="px-6 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                            >
                                Review →
                            </button>
                        </div>
                    </div>
                </TradeCard>
            )}

            {/* Step 3: Review */}
            {currentStep === 'review' && (
                <TradeCard padding="lg">
                    <h2 className="text-sm font-semibold text-stone-900 mb-4" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        Review Your RFQ
                    </h2>
                    <div className="space-y-3 mb-6">
                        {[
                            ['Title', form.title || '—'],
                            ['Category', form.category || '—'],
                            ['Quantity', form.quantity ? `${form.quantity} ${form.unit}` : '—'],
                            ['Target Price', form.targetPrice ? `${form.targetPrice} ${form.currency}` : '—'],
                            ['Incoterm', form.incoterm],
                            ['Destination', form.destinationPort],
                            ['Required By', form.requiredBy || '—'],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between py-2 border-b border-stone-50">
                                <span className="text-xs text-stone-500">{label}</span>
                                <span className="text-xs font-medium text-stone-800">{value}</span>
                            </div>
                        ))}
                    </div>
                    {form.description && (
                        <div className="mb-6">
                            <span className="text-xs text-stone-500">Requirements</span>
                            <p className="text-sm text-stone-700 mt-1">{form.description}</p>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <button
                            onClick={() => setCurrentStep('logistics')}
                            className="px-6 py-2.5 border border-stone-200 text-stone-700 text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-50 transition-colors"
                        >
                            ← Back
                        </button>
                        <button
                            className="px-8 py-2.5 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors"
                        >
                            Submit RFQ
                        </button>
                    </div>
                </TradeCard>
            )}
        </div>
    );
}
