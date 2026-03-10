'use client';

import Link from 'next/link';
import { clsx } from 'clsx';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeScoreRing from '@/components/trade/shared/TradeScoreRing';
import TradeProgressBar from '@/components/trade/shared/TradeProgressBar';
import type { TradeSupplier } from '@/types/trade';

interface SupplierCardProps {
    supplier: TradeSupplier;
}

const verificationConfig: Record<string, { label: string; variant: 'success' | 'warning' | 'neutral' | 'premium' }> = {
    gold: { label: 'Gold', variant: 'premium' },
    verified: { label: 'Verified', variant: 'success' },
    trusted: { label: 'Trusted', variant: 'success' },
    basic: { label: 'Basic', variant: 'neutral' },
};

export default function SupplierCard({ supplier }: SupplierCardProps) {
    const vConfig = verificationConfig[supplier.verificationLevel] || verificationConfig.basic;

    return (
        <Link href={`/trade/suppliers/${supplier.id}`}>
            <TradeCard padding="none" hover>
                <div className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-semibold text-stone-900 truncate">{supplier.companyName}</h3>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                                {supplier.city}, {supplier.region}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <TradeBadge label={vConfig.label} variant={vConfig.variant} />
                                <TradeBadge label={supplier.companyType.replace('_', ' ')} variant="neutral" />
                            </div>
                        </div>
                        {supplier.aiMatchScore && (
                            <TradeScoreRing score={supplier.aiMatchScore} size={52} strokeWidth={4} label="Match" />
                        )}
                    </div>

                    {/* Categories */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {supplier.mainCategories.slice(0, 2).map((cat) => (
                            <span key={cat} className="text-[10px] bg-stone-50 text-stone-600 px-2 py-0.5 rounded">
                                {cat}
                            </span>
                        ))}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-3">
                        <div>
                            <span className="text-[9px] text-stone-400 uppercase tracking-wider">Rating</span>
                            <p className="text-sm font-semibold text-stone-800">
                                ★ {supplier.ratingAvg} <span className="text-[10px] text-stone-400 font-normal">({supplier.ratingCount})</span>
                            </p>
                        </div>
                        <div>
                            <span className="text-[9px] text-stone-400 uppercase tracking-wider">Response</span>
                            <p className="text-sm font-semibold text-stone-800">{supplier.responseTimeHours}h</p>
                        </div>
                        <div>
                            <span className="text-[9px] text-stone-400 uppercase tracking-wider">On-Time</span>
                            <p className="text-sm font-semibold text-stone-800">{supplier.onTimeDeliveryRate}%</p>
                        </div>
                    </div>

                    {/* Compliance bar */}
                    <TradeProgressBar value={supplier.complianceScore} label="Compliance" size="sm" />
                </div>

                {/* Certifications footer */}
                {supplier.certifications.length > 0 && (
                    <div className="px-5 py-2.5 border-t border-stone-100 flex items-center gap-2">
                        <span className="text-[9px] text-stone-400 uppercase tracking-wider">Certs:</span>
                        {supplier.certifications.slice(0, 3).map((cert) => (
                            <span key={cert.id} className="text-[10px] text-stone-600">{cert.name}</span>
                        ))}
                    </div>
                )}
            </TradeCard>
        </Link>
    );
}
