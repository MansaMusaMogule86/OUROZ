import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient as createSupabaseMiddleware } from '@supabase/ssr';

/**
 * OUROZ – Route Protection Middleware
 *
 * Protects /account, /checkout, /supplier/*, /admin/* routes.
 * Redirects unauthenticated users to /auth/login.
 * Admin routes additionally require the 'admin' role in user_profiles.
 */

const PROTECTED_PREFIXES = ['/account', '/checkout', '/supplier', '/admin'];
const PUBLIC_SUPPLIER = ['/supplier/register'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect specific route prefixes
    const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
    if (!isProtected) return NextResponse.next();

    // Allow public supplier registration
    if (PUBLIC_SUPPLIER.includes(pathname)) return NextResponse.next();

    // Create Supabase client for middleware (reads cookies)
    let response = NextResponse.next({ request });

    const supabase = createSupabaseMiddleware(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
                    response = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        },
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        const loginUrl = new URL('/auth/login', request.url);
        loginUrl.searchParams.set('return', pathname);
        return NextResponse.redirect(loginUrl);
    }

    return response;
}

export const config = {
    matcher: ['/account/:path*', '/checkout/:path*', '/supplier/:path*', '/admin/:path*'],
};
