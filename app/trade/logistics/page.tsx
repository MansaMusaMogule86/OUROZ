'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import TradeCard from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeTabs from '@/components/trade/shared/TradeTabs';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { SHIPMENT_STATUS_CONFIG, RISK_LEVEL_CONFIG } from '@/lib/trade/trade-constants';
import { formatCurrency, formatDate, formatWeight, formatVolume } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeShipments } from '@/lib/trade/trade-service';

const methodIcons: Record<string, string> = { sea: '🚢', air: '✈', road: '🚛' };

export default function LogisticsPage() {
    const { data: shipments, loading, error, refetch } = useTradeData(() => fetchTradeShipments(), []);
    const [tab, setTab] = useState('all');

    const tabs = useMemo(() => [
        { id: 'all', label: 'All', count: shipments.length },
        { id: 'active', label: 'Active', count: shipments.filter((s) => !['delivered', 'exception'].includes(s.status)).length },
        { id: 'delivered', label: 'Delivered', count: shipments.filter((s) => s.status === 'delivered').length },
    ], [shipments]);

    const filtered = tab === 'all' ? shipments
        : tab === 'active' ? shipments.filter((s) => !['delivered', 'exception'].includes(s.status))
        : shipments.filter((s) => s.status === 'delivered');

    if (loading) return <TradeLoadingState message="Loading shipments..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Logistics Tracker
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Track shipments from Morocco to Dubai in real time
                </p>
            </div>

            <TradeTabs tabs={tabs} activeTab={tab} onTabChange={setTab} />

            <div className="space-y-3">
                {filtered.length === 0 && (
                    <div className="py-16 text-center text-sm text-stone-400">
                        No shipments found
                    </div>
                )}
                {filtered.map((shipment) => {
                    const statusConf = SHIPMENT_STATUS_CONFIG[shipment.status];
                    const riskConf = RISK_LEVEL_CONFIG[shipment.riskLevel];
                    return (
                        <Link key={shipment.id} href={`/trade/logistics/${shipment.id}`}>
                            <TradeCard padding="md" hover className="mb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-base">{methodIcons[shipment.shippingMethod]}</span>
                                            <span className="text-xs font-mono text-stone-400">{shipment.shipmentNumber}</span>
                                            <TradeBadge label={statusConf.label} variant={statusConf.variant} dot />
                                            {shipment.riskLevel !== 'low' && (
                                                <TradeBadge label={riskConf.label} variant={riskConf.variant} />
                                            )}
                                        </div>
                                        <h3 className="text-sm font-semibold text-stone-900 truncate">{shipment.description}</h3>
                                        <p className="text-[11px] text-stone-500 mt-1">
                                            {shipment.origin.city} → {shipment.destination.city} · {shipment.carrierName}
                                        </p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-sm font-semibold text-stone-800">
                                            {formatCurrency(shipment.value, shipment.currency)}
                                        </p>
                                        <p className="text-[10px] text-stone-400 mt-0.5">
                                            {formatWeight(shipment.weightKg)} · {formatVolume(shipment.volumeCbm)}
                                        </p>
                                        <p className="text-[10px] text-stone-400 mt-1">
                                            ETA: {formatDate(shipment.estimatedArrival)}
                                        </p>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="mt-3">
                                    <div className="flex gap-0.5">
                                        {shipment.milestones.map((m) => (
                                            <div
                                                key={m.id}
                                                className={`h-1 flex-1 rounded-full ${
                                                    m.status === 'completed' ? 'bg-emerald-400' :
                                                    m.status === 'current' ? 'bg-blue-400' :
                                                    m.status === 'delayed' ? 'bg-red-400' :
                                                    'bg-stone-200'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </TradeCard>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
