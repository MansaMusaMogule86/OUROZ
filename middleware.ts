import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient as createSupabaseMiddleware } from '@supabase/ssr';

/**
 * OUROZ – Route Protection Middleware
 *
 * Protects privileged routes: account, checkout, supplier, admin, business,
 * wholesale, and trade areas. Redirects unauthenticated users to /auth/login.
 * Role-specific checks are enforced in layout components.
 */

const PROTECTED_PREFIXES = ['/account', '/checkout', '/supplier', '/admin', '/business', '/wholesale', '/trade'];
const PUBLIC_EXCEPTIONS = ['/supplier/register', '/wholesale/apply', '/business/apply'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Only protect specific route prefixes
    const isProtected = PROTECTED_PREFIXES.some(prefix => pathname.startsWith(prefix));
    if (!isProtected) return NextResponse.next();

    // Allow public pages (registration, applications) within protected prefixes
    if (PUBLIC_EXCEPTIONS.includes(pathname)) return NextResponse.next();

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
    matcher: [
        '/account/:path*',
        '/checkout/:path*',
        '/supplier/:path*',
        '/admin/:path*',
        '/business/:path*',
        '/wholesale/:path*',
        '/trade/:path*',
    ],
};
