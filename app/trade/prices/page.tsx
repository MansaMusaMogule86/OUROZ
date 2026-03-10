'use client';

import { useState, useMemo } from 'react';
import TradeCard, { TradeCardTitle } from '@/components/trade/shared/TradeCard';
import TradeBadge from '@/components/trade/shared/TradeBadge';
import TradeAIInsight from '@/components/trade/shared/TradeAIInsight';
import { TradeLineChart } from '@/components/trade/shared/TradeChart';
import { TradeFilterPills } from '@/components/trade/shared/TradeFilter';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { formatCurrency, formatPercentage } from '@/lib/trade/trade-utils';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradePrices, fetchTradePriceAlerts } from '@/lib/trade/trade-service';
import { clsx } from 'clsx';

const trendConfig = {
    rising: { label: 'Rising', variant: 'error' as const, color: '#DC2626' },
    stable: { label: 'Stable', variant: 'info' as const, color: '#2563EB' },
    falling: { label: 'Falling', variant: 'success' as const, color: '#059669' },
};

const categoryFilters = [
    { value: 'all', label: 'All Products' },
    { value: 'Argan Oil & Derivatives', label: 'Argan Oil' },
    { value: 'Olive Oil & Table Olives', label: 'Olive Oil' },
    { value: 'Saffron & Spices', label: 'Spices' },
    { value: 'Ceramics & Zellige', label: 'Zellige' },
    { value: 'Cosmetics & Beauty', label: 'Cosmetics' },
];

export default function PriceIntelligencePage() {
    const { data: prices, loading: pricesLoading, error: pricesError, refetch: refetchPrices } = useTradeData(() => fetchTradePrices(), []);
    const { data: alerts, loading: alertsLoading } = useTradeData(() => fetchTradePriceAlerts(), []);

    const [category, setCategory] = useState('all');
    const [selected, setSelected] = useState<string | null>(null);

    // Auto-select first price when data loads
    const effectiveSelected = selected ?? prices[0]?.id ?? null;

    const filtered = useMemo(() => {
        if (category === 'all') return prices;
        return prices.filter((p) => p.category === category);
    }, [prices, category]);

    const selectedPrice = prices.find((p) => p.id === effectiveSelected);

    const loading = pricesLoading || alertsLoading;
    if (loading) return <TradeLoadingState message="Loading price intelligence..." />;
    if (pricesError) return <TradeErrorState message={pricesError} onRetry={refetchPrices} />;

    return (
        <div className="space-y-6 max-w-7xl">
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Price Intelligence
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    Real-time market prices and benchmarks for Moroccan exports
                </p>
            </div>

            <TradeFilterPills options={categoryFilters} value={category} onChange={setCategory} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Price list */}
                <div className="lg:col-span-1 space-y-2 max-h-[75vh] overflow-y-auto pr-1">
                    {filtered.map((price) => {
                        const tc = trendConfig[price.trend];
                        const isSelected = price.id === effectiveSelected;
                        return (
                            <button
                                key={price.id}
                                onClick={() => setSelected(price.id)}
                                className={clsx(
                                    'w-full text-left rounded-xl border p-4 transition-all',
                                    isSelected
                                        ? 'border-stone-300 bg-white shadow-sm'
                                        : 'border-stone-100 bg-white/50 hover:bg-white hover:border-stone-200',
                                )}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="min-w-0 flex-1">
                                        <h3 className="text-xs font-semibold text-stone-800 truncate">{price.productName}</h3>
                                        <p className="text-[10px] text-stone-400 mt-0.5">{price.category}</p>
                                    </div>
                                    <TradeBadge label={tc.label} variant={tc.variant} />
                                </div>
                                <div className="flex items-baseline gap-2 mt-2">
                                    <span className="text-lg font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                        {formatCurrency(price.currentPrice, price.currency)}
                                    </span>
                                    <span className="text-[10px] text-stone-400">/{price.unit}</span>
                                    <span className={clsx(
                                        'text-xs font-semibold ml-auto',
                                        price.changePercent >= 0 ? 'text-red-600' : 'text-emerald-600',
                                    )}>
                                        {formatPercentage(price.changePercent)}
                                    </span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                {/* Detail panel */}
                <div className="lg:col-span-2 space-y-4">
                    {selectedPrice ? (
                        <>
                            <TradeCard padding="lg">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h2 className="text-lg font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            {selectedPrice.productName}
                                        </h2>
                                        <p className="text-xs text-stone-500">{selectedPrice.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-stone-900" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                                            {formatCurrency(selectedPrice.currentPrice, selectedPrice.currency)}
                                        </p>
                                        <p className="text-[10px] text-stone-400">per {selectedPrice.unit}</p>
                                    </div>
                                </div>

                                {/* Chart */}
                                <TradeLineChart
                                    data={selectedPrice.history.map((h) => ({
                                        label: h.date.slice(5, 7),
                                        value: h.price,
                                    }))}
                                    height={180}
                                    color={trendConfig[selectedPrice.trend].color}
                                    showLabels
                                    className="mb-4"
                                />

                                {/* Benchmarks */}
                                <TradeCardTitle className="mb-3">Market Benchmarks</TradeCardTitle>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        ['Morocco Avg', selectedPrice.benchmarks.moroccoAvg],
                                        ['Global Avg', selectedPrice.benchmarks.globalAvg],
                                        ['Best Price', selectedPrice.benchmarks.bestPrice],
                                        ['Previous', selectedPrice.previousPrice],
                                    ].map(([label, value]) => (
                                        <div key={label as string} className="bg-stone-50 rounded-lg p-3 text-center">
                                            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">{label}</span>
                                            <p className="text-sm font-bold text-stone-800 mt-0.5">
                                                {formatCurrency(value as number, selectedPrice.currency)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                {selectedPrice.benchmarks.bestPriceSupplier && (
                                    <p className="text-[10px] text-stone-400 mt-2">
                                        Best price from: {selectedPrice.benchmarks.bestPriceSupplier}
                                    </p>
                                )}
                            </TradeCard>

                            {selectedPrice.aiSummary && (
                                <TradeAIInsight
                                    title="AI Market Analysis"
                                    content={selectedPrice.aiSummary}
                                    type="market"
                                />
                            )}
                        </>
                    ) : (
                        <div className="py-20 text-center text-sm text-stone-400">
                            Select a product to view price details
                        </div>
                    )}

                    {/* Price Alerts */}
                    <TradeCard padding="md">
                        <TradeCardTitle className="mb-3">Active Price Alerts</TradeCardTitle>
                        <div className="space-y-2">
                            {alerts.map((alert) => (
                                <div key={alert.id} className="flex items-center justify-between py-2 border-b border-stone-50">
                                    <div className="flex items-center gap-2">
                                        <span className={clsx(
                                            'w-2 h-2 rounded-full',
                                            alert.triggeredAt ? 'bg-amber-500' : 'bg-stone-300',
                                        )} />
                                        <span className="text-xs text-stone-700">{alert.productName}</span>
                                    </div>
                                    <span className="text-xs text-stone-500">
                                        {alert.condition === 'below' ? '↓ Below' : '↑ Above'} {formatCurrency(alert.threshold, alert.currency)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </TradeCard>
                </div>
            </div>
        </div>
    );
}
