'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Generic async data-fetching hook for Trade OS pages.
 * Calls `fetcher` on mount, manages loading/error/data state.
 * The fetcher ref is updated on every render so the hook
 * always calls the latest function without re-triggering effects.
 */
export function useTradeData<T>(
    fetcher: () => Promise<T>,
    fallback: T,
): { data: T; loading: boolean; error: string | null; refetch: () => void } {
    const [data, setData] = useState<T>(fallback);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetcherRef = useRef(fetcher);
    fetcherRef.current = fetcher;

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await fetcherRef.current();
            setData(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load data');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    return { data, loading, error, refetch: load };
}
