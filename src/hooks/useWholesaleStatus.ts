'use client';
/**
 * useWholesaleStatus – tracks the current user's wholesale application status.
 *
 * States:
 *   'not_applied' → no row in wholesale_applications
 *   'pending'     → submitted, awaiting admin review
 *   'approved'    → account active; wholesale pricing visible
 *   'rejected'    → admin rejected; can re-apply (business logic decision)
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchWholesaleApplication, type V2WholesaleApplication } from '@/lib/api';

export type WholesaleStatus = V2WholesaleApplication['status'] | 'not_applied';

export interface UseWholesaleStatusReturn {
    status: WholesaleStatus;
    application: V2WholesaleApplication | null;
    loading: boolean;
    isApproved: boolean;
    isPending: boolean;
    isRejected: boolean;
    hasNotApplied: boolean;
    /** Re-fetch (call after submitting application) */
    refresh: () => Promise<void>;
}

export function useWholesaleStatus(): UseWholesaleStatusReturn {
    const [application, setApplication] = useState<V2WholesaleApplication | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const load = useCallback(async (uid: string | null) => {
        setLoading(true);
        if (!uid) {
            setApplication(null);
            setUserId(null);
            setLoading(false);
            return;
        }
        setUserId(uid);
        const app = await fetchWholesaleApplication(uid);
        setApplication(app);
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!cancelled) load(user?.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!cancelled) load(session?.user?.id ?? null);
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [load]);

    const refresh = useCallback(async () => {
        if (userId) await load(userId);
    }, [userId, load]);

    const status: WholesaleStatus = application?.status ?? 'not_applied';

    return {
        status,
        application,
        loading,
        isApproved:    status === 'approved',
        isPending:     status === 'pending',
        isRejected:    status === 'rejected',
        hasNotApplied: status === 'not_applied',
        refresh,
    };
}
