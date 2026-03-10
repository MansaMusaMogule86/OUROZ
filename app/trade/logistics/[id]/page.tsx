'use client';

import { use } from 'react';
import Link from 'next/link';
import TradeCard, { TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeTimeline from '@/components/trade/shared/TradeTimeline';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { SHIPMENT_STATUS_CONFIG, RISK_LEVEL_CONFIG } from '@/lib/trade/trade-constants';
import { formatCurrency, formatDate, formatWeight, formatVolume } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeShipmentById } from '@/lib/trade/trade-service';

export default function ShipmentDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const { data: shipment, loading, error, refetch } = useTradeData(() => fetchTradeShipmentById(id), null);

    if (loading) return <TradeLoadingState message="Loading shipment..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    if (!shipment) {
        return (
            <div className="py-20 text-center">
                <p className="text-stone-500">Shipment not found</p>
                <Link href="/trade/logistics" className="text-sm text-stone-700 underline mt-2 inline-block">
                    Back to Logistics
                </Link>
            </div>
        );
    }

    const statusConf = SHIPMENT_STATUS_CONFIG[shipment.status];
    const riskConf = RISK_LEVEL_CONFIG[shipment.riskLevel];

    return (
        <div className="space-y-6 max-w-5xl">
            <Link href="/trade/logistics" className="text-[10px] uppercase tracking-wider text-stone-400 hover:text-stone-600 transition-colors">
                ← Back to Logistics Tracker
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-stone-400">{shipment.shipmentNumber}</span>
                        <TradeBadge label={statusConf.label} variant={statusConf.variant} dot />
                        {shipment.riskLevel !== 'low' && (
                            <TradeBadge label={riskConf.label} variant={riskConf.variant} />
                        )}
                    </div>
                    <h1
                        className="text-xl font-bold text-stone-900"
                        style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                    >
                        {shipment.description}
                    </h1>
                    <p className="text-sm text-stone-500 mt-1">
                        {shipment.supplierName} · {shipment.carrierName} · {shipment.incoterm}
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                        {formatCurrency(shipment.value, shipment.currency)}
                    </p>
                    <p className="text-[10px] text-stone-400">
                        {formatWeight(shipment.weightKg)} · {formatVolume(shipment.volumeCbm)}
                    </p>
                </div>
            </div>

            {/* Route card */}
            <TradeCard padding="lg">
                <div className="flex items-center justify-between">
                    <div className="text-center">
                        <p className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">Origin</p>
                        <p className="text-sm font-semibold text-stone-800 mt-1">{shipment.origin.city}</p>
                        <p className="text-[10px] text-stone-500">{shipment.origin.port}</p>
                        <p className="text-[10px] text-stone-400">{shipment.origin.country}</p>
                    </div>
                    <div className="flex-1 mx-6">
                        <div className="h-px bg-stone-200 relative">
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-emerald-500" />
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-stone-300" />
                            <span className="absolute top-3 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-wider text-stone-400 font-semibold whitespace-nowrap">
                                {shipment.shippingMethod === 'sea' ? '🚢' : shipment.shippingMethod === 'air' ? '✈' : '🚛'} {shipment.shippingMethod}
                            </span>
                        </div>
                    </div>
                    <div className="text-center">
                        <p className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">Destination</p>
                        <p className="text-sm font-semibold text-stone-800 mt-1">{shipment.destination.city}</p>
                        <p className="text-[10px] text-stone-500">{shipment.destination.port}</p>
                        <p className="text-[10px] text-stone-400">{shipment.destination.country}</p>
                    </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-stone-100">
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400">Departure</span>
                        <p className="text-xs font-medium text-stone-700 mt-0.5">
                            {shipment.actualDeparture ? formatDate(shipment.actualDeparture) : formatDate(shipment.estimatedDeparture)}
                        </p>
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400">ETA</span>
                        <p className="text-xs font-medium text-stone-700 mt-0.5">{formatDate(shipment.estimatedArrival)}</p>
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400">Tracking</span>
                        <p className="text-xs font-mono text-stone-700 mt-0.5">{shipment.trackingNumber || '—'}</p>
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-stone-400">Container</span>
                        <p className="text-xs font-mono text-stone-700 mt-0.5">{shipment.containerNumber || '—'}</p>
                    </div>
                </div>
            </TradeCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Timeline */}
                <TradeCard padding="lg">
                    <TradeCardTitle className="mb-4">Shipment Timeline</TradeCardTitle>
                    <TradeTimeline
                        steps={shipment.milestones.map((m) => ({
                            id: m.id,
                            label: m.label,
                            status: m.status,
                            date: m.actualDate ? formatDate(m.actualDate) : formatDate(m.estimatedDate),
                            detail: m.location || m.notes,
                        }))}
                    />
                </TradeCard>

                {/* Documents + Risk */}
                <div className="space-y-4">
                    <TradeCard padding="lg">
                        <TradeCardTitle className="mb-4">Documents</TradeCardTitle>
                        <div className="space-y-2">
                            {shipment.documents.map((doc) => (
                                <div key={doc.id} className="flex items-center justify-between py-2 border-b border-stone-50">
                                    <div>
                                        <p className="text-xs font-medium text-stone-700">{doc.type}</p>
                                        <p className="text-[10px] text-stone-400">{doc.name}</p>
                                    </div>
                                    <TradeBadge
                                        label={doc.status}
                                        variant={doc.status === 'verified' ? 'success' : doc.status === 'pending' ? 'warning' : 'neutral'}
                                        dot
                                    />
                                </div>
                            ))}
                        </div>
                    </TradeCard>

                    {shipment.riskAlerts.length > 0 && (
                        <TradeCard padding="lg">
                            <TradeCardTitle className="mb-4">Risk Alerts</TradeCardTitle>
                            <div className="space-y-3">
                                {shipment.riskAlerts.map((alert) => (
                                    <div key={alert.id} className="bg-red-50 border border-red-100 rounded-lg p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <TradeBadge label={RISK_LEVEL_CONFIG[alert.level].label} variant={RISK_LEVEL_CONFIG[alert.level].variant} />
                                        </div>
                                        <h4 className="text-xs font-semibold text-stone-800">{alert.title}</h4>
                                        <p className="text-[11px] text-stone-600 mt-1">{alert.description}</p>
                                    </div>
                                ))}
                            </div>
                        </TradeCard>
                    )}
                </div>
            </div>
        </div>
    );
}
