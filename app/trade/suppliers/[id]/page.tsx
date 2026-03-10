'use client';

import { use } from 'react';
import Link from 'next/link';
import TradeCard, { TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import TradeProgressBar from '@/components/trade/shared/TradeProgressBar';
import TradeAIInsight from '@/components/trade/shared/TradeAIInsight';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeSupplierById } from '@/lib/trade/trade-service';

export default function SupplierProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: supplier, loading, error, refetch } = useTradeData(() => fetchTradeSupplierById(id), null);

    if (loading) return <TradeLoadingState message="Loading supplier profile..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    if (!supplier) {
        return (
            <div className="py-20 text-center">
                <p className="text-stone-500">Supplier not found</p>
                <Link href="/trade/suppliers" className="text-sm text-stone-700 underline mt-2 inline-block">
                    Back to Supplier Discovery
                </Link>
            </div>
        );
    }

    const verificationVariant = supplier.verificationLevel === 'gold' ? 'premium' as const
        : supplier.verificationLevel === 'verified' || supplier.verificationLevel === 'trusted' ? 'success' as const
        : 'neutral' as const;

    return (
        <div className="space-y-6 max-w-5xl">
            <Link href="/trade/suppliers" className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to Supplier Discovery
            </Link>

            {/* Profile header */}
            <TradeCard padding="lg">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <h1
                                className="text-xl font-bold text-stone-900"
                                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                            >
                                {supplier.companyName}
                            </h1>
                            <TradeBadge label={supplier.verificationLevel} variant={verificationVariant} />
                        </div>
                        <p className="text-sm text-stone-500">
                            {supplier.city}, {supplier.region} · Est. {supplier.yearEstablished} · {supplier.employeeCount} employees
                        </p>
                        <p className="text-sm text-stone-600 mt-3 max-w-2xl leading-relaxed">{supplier.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {supplier.mainCategories.map((cat) => (
                                <TradeBadge key={cat} label={cat} variant="info" />
                            ))}
                        </div>
                    </div>
                    {supplier.aiMatchScore && (
                        <TradeScoreRing score={supplier.aiMatchScore} size={72} strokeWidth={5} label="AI Match" />
                    )}
                </div>
            </TradeCard>

            {/* AI Match Reasons */}
            {supplier.aiMatchReasons && (
                <TradeAIInsight
                    title="Why This Supplier Matches"
                    content={supplier.aiMatchReasons.join('. ') + '.'}
                    type="recommendation"
                />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Performance Metrics */}
                <TradeCard padding="lg">
                    <TradeCardTitle className="mb-4">Performance Metrics</TradeCardTitle>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-stone-600">Rating</span>
                            <span className="text-sm font-semibold text-stone-800">
                                ★ {supplier.ratingAvg} ({supplier.ratingCount} reviews)
                            </span>
                        </div>
                        <TradeProgressBar value={supplier.responseRate} label="Response Rate" />
                        <TradeProgressBar value={supplier.onTimeDeliveryRate} label="On-Time Delivery" />
                        <TradeProgressBar value={supplier.repeatBuyerRate} label="Repeat Buyer Rate" />
                        <TradeProgressBar value={supplier.complianceScore} label="Compliance Score" />
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-xs text-stone-600">Total Transactions</span>
                            <span className="text-sm font-semibold text-stone-800">{supplier.totalTransactions}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-stone-600">Avg Response Time</span>
                            <span className="text-sm font-semibold text-stone-800">{supplier.responseTimeHours}h</span>
                        </div>
                    </div>
                </TradeCard>

                {/* Capabilities */}
                <TradeCard padding="lg">
                    <TradeCardTitle className="mb-4">Capabilities</TradeCardTitle>
                    <div className="space-y-3">
                        {[
                            ['Monthly Capacity', supplier.monthlyCapacity],
                            ['MOQ', `${supplier.moqMin} units`],
                            ['Lead Time', `${supplier.leadTimeDaysMin}–${supplier.leadTimeDaysMax} days`],
                            ['Samples', supplier.sampleAvailable ? 'Available' : 'Not available'],
                            ['Export License', supplier.hasExportLicense ? 'Yes' : 'No'],
                            ['Free Zone', supplier.freeZoneCertified ? 'Certified' : 'No'],
                            ['Languages', supplier.languages.join(', ')],
                            ['Export Markets', supplier.exportCountries.join(', ')],
                        ].map(([label, value]) => (
                            <div key={label} className="flex justify-between py-2 border-b border-stone-50">
                                <span className="text-xs text-stone-500">{label}</span>
                                <span className="text-xs font-medium text-stone-800">{value}</span>
                            </div>
                        ))}
                    </div>
                </TradeCard>
            </div>

            {/* Certifications */}
            <TradeCard padding="lg">
                <TradeCardTitle className="mb-4">Certifications</TradeCardTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {supplier.certifications.map((cert) => (
                        <div key={cert.id} className="bg-stone-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs font-semibold text-stone-800">{cert.name}</h4>
                                <TradeBadge
                                    label={cert.status}
                                    variant={cert.status === 'verified' ? 'success' : 'neutral'}
                                    dot
                                />
                            </div>
                            <p className="text-[10px] text-stone-500">Issuer: {cert.issuer}</p>
                            {cert.expiresAt && (
                                <p className="text-[10px] text-stone-400 mt-0.5">Expires: {cert.expiresAt}</p>
                            )}
                        </div>
                    ))}
                </div>
            </TradeCard>

            {/* Contact */}
            <TradeCard padding="lg">
                <TradeCardTitle className="mb-4">Contact</TradeCardTitle>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm font-semibold">
                        {supplier.contactName.charAt(0)}
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-stone-800">{supplier.contactName}</p>
                        <p className="text-xs text-stone-500">{supplier.contactTitle}</p>
                    </div>
                    <button className="ml-auto px-5 py-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-wider rounded-lg hover:bg-stone-800 transition-colors">
                        Contact Supplier
                    </button>
                </div>
            </TradeCard>
        </div>
    );
}
