'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import SearchBar from '@/components/shop/SearchBar';
import ProductGrid from '@/components/shop/ProductGrid';
import { supabase } from '@/lib/supabase';

interface SearchResult {
    id: string;
    name: string;
    slug: string;
    base_price: number;
    compare_price: number | null;
    image_urls: string[];
    is_active: boolean;
    category: { name: string; slug: string } | null;
    brand: { name: string } | null;
    variants: {
        id: string;
        sku: string;
        label: string;
        retail_price: number;
        stock_quantity: number;
        is_active: boolean;
        price_tiers: { min_quantity: number; price: number; label: string | null }[];
    }[];
}

export default function SearchPage() {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [query, setQuery] = useState('');

    const handleSearch = useCallback(async (value: string) => {
        setQuery(value);
        if (!value.trim()) {
            setResults([]);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);

        // Full-text search with ILIKE fallback
        const searchTerm = `%${value.trim()}%`;

        const { data } = await supabase
            .from('products')
            .select(`
                id, name, slug, base_price, compare_price, image_urls, is_active,
                category:categories(name, slug),
                brand:brands(name),
                variants:product_variants(id, sku, label, retail_price, stock_quantity, is_active,
                    price_tiers(min_quantity, price, label)
                )
            `)
            .eq('is_active', true)
            .or(`name.ilike.${searchTerm},description.ilike.${searchTerm}`)
            .order('name')
            .limit(48);

        setResults((data as unknown as SearchResult[]) ?? []);
        setLoading(false);
    }, []);

    // Adapt results for ProductGrid format
    const gridProducts = results.map(p => {
        const v = p.variants?.find(v => v.is_active) ?? p.variants?.[0];
        return {
            id: p.id,
            name: p.name,
            slug: p.slug,
            base_price: p.base_price,
            compare_price: p.compare_price,
            image_urls: p.image_urls ?? [],
            category_name: p.category?.name ?? null,
            brand_name: p.brand?.name ?? null,
            default_variant_id: v?.id ?? '',
            retail_price: v?.retail_price ?? p.base_price,
            stock_quantity: v ? p.variants.reduce((s, vv) => s + vv.stock_quantity, 0) : 0,
            lowest_tier_price: v?.price_tiers?.length ? Math.min(...v.price_tiers.map(t => t.price)) : null,
            is_wholesale_enabled: (v?.price_tiers?.length ?? 0) > 0,
        };
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4 mb-2">
                <Link href="/shop" className="text-sm text-amber-600 hover:underline">&larr; Back</Link>
                <h1 className="text-xl font-bold text-[var(--color-charcoal)]">Search Products</h1>
            </div>

            <SearchBar
                onSearch={handleSearch}
                autoFocus
                placeholder="Search by name, ingredient, or description..."
                className="max-w-2xl"
            />

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[1,2,3,4,5,6,7,8].map(i => (
                        <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-stone-100" />
                    ))}
                </div>
            ) : searched && results.length === 0 ? (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                    <p className="text-lg font-semibold text-gray-800 mb-2">No products found</p>
                    <p className="text-sm text-gray-500">
                        No results for &ldquo;{query}&rdquo;. Try a different search term.
                    </p>
                </div>
            ) : results.length > 0 ? (
                <div>
                    <p className="text-sm text-stone-500 mb-4">{results.length} result{results.length !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;</p>
                    <ProductGrid products={gridProducts as never[]} mode="retail" />
                </div>
            ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-stone-100">
                    <p className="text-gray-400">Start typing to search products...</p>
                </div>
            )}
        </div>
    );
}
