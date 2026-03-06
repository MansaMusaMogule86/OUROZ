import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

/**
 * OAuth callback handler.
 * Supabase redirects here after OAuth flow (Google, etc.)
 * Exchanges the code for a session, then redirects to the return URL.
 */
export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const returnTo = searchParams.get('return') || '/shop';

    if (code) {
        const supabase = createServerClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    return NextResponse.redirect(new URL(returnTo, request.url));
}
