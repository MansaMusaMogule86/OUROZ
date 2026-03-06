'use client';
/**
 * useProducts – Products listing hook with filters, search, and pagination.
 *
 * Search strategy (per GOD MODE spec):
 *   1. If search input is present → Postgres FTS via search_vector
 *   2. If FTS yields 0 results → fallback to search_keywords UNION + ILIKE
 *   3. Otherwise → standard filtered query with pagination
 *
 * Returns:
 *   products, total, page, totalPages, loading, error
 *   setPage, setFilters (stable references → safe in dependency arrays)
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import {
    fetchProducts,
    fetchProductsByKeyword,
    type V2ProductCard,
    type ProductFilters,
} from '@/lib/api';

export interface ProductsFiltersState {
    categoryId?: string | null;
    brandId?: string | null;
    search?: string;
    isFeatured?: boolean;
    isWholesaleEnabled?: boolean;
}

export interface UseProductsReturn {
    products: V2ProductCard[];
    total: number;
    page: number;
    totalPages: number;
    loading: boolean;
    error: string | null;
    setPage: (page: number) => void;
    setFilters: (filters: ProductsFiltersState) => void;
    /** Reset to page 1 and clear all filters */
    reset: () => void;
}

const DEFAULT_LIMIT = 24;

export function useProducts(
    initialFilters: ProductsFiltersState = {},
    limit = DEFAULT_LIMIT
): UseProductsReturn {
    const [filters, _setFilters] = useState<ProductsFiltersState>(initialFilters);
    const [page, _setPage] = useState(1);
    const [products, setProducts] = useState<V2ProductCard[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Debounce search input to avoid hitting Supabase on every keystroke
    const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [debouncedSearch, setDebouncedSearch] = useState(initialFilters.search ?? '');

    // Stable setters
    const setFilters = useCallback((next: ProductsFiltersState) => {
        _setPage(1); // reset pagination on filter change
        _setFilters(next);

        // Debounce search specifically
        if (next.search !== undefined) {
            if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
            searchDebounceRef.current = setTimeout(() => {
                setDebouncedSearch(next.search ?? '');
            }, 350);
        }
    }, []);

    const setPage = useCallback((p: number) => _setPage(p), []);

    const reset = useCallback(() => {
        _setFilters({});
        _setPage(1);
        setDebouncedSearch('');
    }, []);

    // Fetch whenever effective filters or page changes
    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        const effectiveSearch = debouncedSearch.trim();

        const run = async () => {
            try {
                const apiFilters: ProductFilters = {
                    page,
                    limit,
                    category_id:          filters.categoryId ?? null,
                    brand_id:             filters.brandId ?? null,
                    is_featured:          filters.isFeatured,
                    is_wholesale_enabled: filters.isWholesaleEnabled,
                    search:               effectiveSearch || null,
                };

                let result = await fetchProducts(apiFilters);

                // If FTS returned 0 and there's a search term → try keyword fallback
                if (result.total === 0 && effectiveSearch) {
                    const fallback = await fetchProductsByKeyword(effectiveSearch, limit);
                    result = { products: fallback, total: fallback.length };
                }

                if (!cancelled) {
                    setProducts(result.products);
                    setTotal(result.total);
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Failed to load products.');
                    setProducts([]);
                    setTotal(0);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        run();
        return () => { cancelled = true; };
    }, [filters, debouncedSearch, page, limit]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return {
        products,
        total,
        page,
        totalPages,
        loading,
        error,
        setPage,
        setFilters,
        reset,
    };
}
