/**
 * OUROZ – Supabase client
 * Install: npm install @supabase/supabase-js
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-anon-key';

/** Browser/client-side Supabase instance */
export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
    },
});

/**
 * Backward-compatible factory used across legacy pages.
 * Returns the singleton browser client.
 */
export function createClient() {
    return supabase;
}

/** Server-side Supabase instance using SERVICE_ROLE key (never expose to browser) */
export function createServerClient() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        // Fall back to anon key in dev/server components that don't need admin
        return createSupabaseClient(supabaseUrl, supabaseAnonKey);
    }
    return createSupabaseClient(supabaseUrl, serviceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}
