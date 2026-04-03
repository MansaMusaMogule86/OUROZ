import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';
import { rateLimit } from '@/lib/rate-limit';

/**
 * POST /api/contact
 * Accepts contact form submissions. Public endpoint (no auth required).
 * Rate-limited to 5 requests per IP per 15 minutes.
 * Validates input, stores in contact_submissions table.
 */
export async function POST(request: NextRequest) {
    try {
        // Rate limit by IP — 5 submissions per 15 minutes
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
        const rl = rateLimit(`contact:${ip}`, 5, 15 * 60 * 1000);
        if (rl.limited) {
            return NextResponse.json(
                { error: 'Too many submissions. Please try again later.' },
                { status: 429, headers: { 'Retry-After': String(Math.ceil(rl.retryAfterMs / 1000)) } },
            );
        }

        const body = await request.json();

        const name = typeof body.name === 'string' ? body.name.trim() : '';
        const email = typeof body.email === 'string' ? body.email.trim() : '';
        const subject = typeof body.subject === 'string' ? body.subject.trim() : '';
        const message = typeof body.message === 'string' ? body.message.trim() : '';

        // Validate required fields
        const errors: string[] = [];
        if (!name || name.length < 2) errors.push('Name is required (min 2 characters)');
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Valid email is required');
        if (!message || message.length < 10) errors.push('Message is required (min 10 characters)');
        if (message.length > 5000) errors.push('Message is too long (max 5000 characters)');
        if (name.length > 200) errors.push('Name is too long (max 200 characters)');

        if (errors.length > 0) {
            return NextResponse.json({ error: 'Validation failed', details: errors }, { status: 400 });
        }

        // Honeypot: reject if hidden field is filled (bot detection)
        if (body._hp) {
            // Silently accept to not tip off bots, but don't store
            return NextResponse.json({ ok: true });
        }

        const supabase = await createServerClient();

        const { error: insertError } = await supabase
            .from('contact_submissions')
            .insert({
                name,
                email,
                subject,
                message,
                status: 'pending',
            });

        if (insertError) {
            console.error('[contact] Insert failed:', insertError.message);
            return NextResponse.json({ error: 'Failed to submit message' }, { status: 500 });
        }

        return NextResponse.json({ ok: true }, { status: 201 });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        console.error('[contact] Unexpected error:', message);
        return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
}
