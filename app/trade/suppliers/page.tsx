'use client';

import { useState, useMemo } from 'react';
import TradeCard from '@/components/trade/shared/TradeCard';
import { TradeFilterPills } from '@/components/trade/shared/TradeFilter';
import SupplierCard from '@/components/trade/suppliers/SupplierCard';
import { TradeLoadingState, TradeErrorState } from '@/components/trade/shared/TradeLoadingState';
import { useTradeData } from '@/hooks/useTradeData';
import { fetchTradeSuppliers } from '@/lib/trade/trade-service';

const categoryFilters = [
    { value: 'all', label: 'All' },
    { value: 'Argan Oil & Derivatives', label: 'Argan Oil' },
    { value: 'Ceramics & Zellige', label: 'Zellige' },
    { value: 'Textiles & Leather', label: 'Leather' },
    { value: 'Saffron & Spices', label: 'Saffron' },
    { value: 'Olive Oil & Table Olives', label: 'Olive Oil' },
];

export default function SupplierDiscoveryPage() {
    const { data: suppliers, loading, error, refetch } = useTradeData(() => fetchTradeSuppliers(), []);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('all');

    const filtered = useMemo(() => {
        return suppliers.filter((s) => {
            const matchesSearch = !search ||
                s.companyName.toLowerCase().includes(search.toLowerCase()) ||
                s.city.toLowerCase().includes(search.toLowerCase()) ||
                s.mainCategories.some((c) => c.toLowerCase().includes(search.toLowerCase()));
            const matchesCat = category === 'all' || s.mainCategories.includes(category);
            return matchesSearch && matchesCat;
        }).sort((a, b) => (b.aiMatchScore || 0) - (a.aiMatchScore || 0));
    }, [suppliers, search, category]);

    if (loading) return <TradeLoadingState message="Loading suppliers..." />;
    if (error) return <TradeErrorState message={error} onRetry={refetch} />;

    return (
        <div className="space-y-6 max-w-7xl">
            {/* Header */}
            <div>
                <h1
                    className="text-2xl font-bold text-stone-900"
                    style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                    Supplier Discovery
                </h1>
                <p className="text-sm text-stone-500 mt-1">
                    AI-powered search across verified Moroccan suppliers
                </p>
            </div>

            {/* Search */}
            <TradeCard padding="md">
                <div className="flex items-center gap-3">
                    <span className="text-stone-400">⬡</span>
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search suppliers by name, city, or product category..."
                        className="flex-1 text-sm text-stone-800 bg-transparent outline-none placeholder:text-stone-400"
                    />
                    <span className="text-[9px] uppercase tracking-wider text-stone-400 font-semibold">
                        {filtered.length} results
                    </span>
                </div>
            </TradeCard>

            {/* Category filters */}
            <TradeFilterPills options={categoryFilters} value={category} onChange={setCategory} />

            {/* Supplier grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((supplier) => (
                    <SupplierCard key={supplier.id} supplier={supplier} />
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="py-16 text-center text-sm text-stone-400">
                    No suppliers match your search criteria
                </div>
            )}
        </div>
    );
}
