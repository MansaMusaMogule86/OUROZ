'use client';
/**
 * useUserRole – resolves the current user's role from user_profiles.
 * Listens to Supabase auth state changes so role updates immediately after
 * login/logout without requiring a full page refresh.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { fetchUserProfile, type V2UserProfile } from '@/lib/api';

export type UserRole = V2UserProfile['role'];

export interface UseUserRoleReturn {
    role: UserRole | null;
    profile: V2UserProfile | null;
    userId: string | null;
    loading: boolean;
    isAdmin: boolean;
    isWholesale: boolean;
    isCustomer: boolean;
    /** Re-fetch profile (call after profile mutations) */
    refresh: () => Promise<void>;
}

export function useUserRole(): UseUserRoleReturn {
    const [profile, setProfile] = useState<V2UserProfile | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const loadProfile = useCallback(async (uid: string | null) => {
        if (!uid) {
            setProfile(null);
            setUserId(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        const p = await fetchUserProfile(uid);
        setProfile(p);
        setUserId(uid);
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;

        // Initial load from current session
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!cancelled) loadProfile(user?.id ?? null);
        });

        // React to login / logout / token refresh
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                if (!cancelled) loadProfile(session?.user?.id ?? null);
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [loadProfile]);

    const refresh = useCallback(async () => {
        if (userId) await loadProfile(userId);
    }, [userId, loadProfile]);

    return {
        role:        profile?.role ?? null,
        profile,
        userId,
        loading,
        isAdmin:     profile?.role === 'admin',
        isWholesale: profile?.role === 'wholesale',
        isCustomer:  profile?.role === 'customer' || profile === null,
        refresh,
    };
}
