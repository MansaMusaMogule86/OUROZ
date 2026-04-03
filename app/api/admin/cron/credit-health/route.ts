/**
 * /api/admin/cron/credit-health
 *
 * POST – Executes the full credit health-check cycle via Supabase RPC.
 *        Accepts two categories of caller:
 *          a. Server-to-server cron: `x-cron-secret` header matches CRON_SECRET
 *          b. Authenticated admin user: session cookie with role = 'admin'
 *
 * GET  – Liveness probe. Returns { ok: true, message: 'Cron endpoint ready' }
 *        without auth so uptime monitors can ping it cleanly.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase-server';

// ---------------------------------------------------------------------------
// GET — health probe
// ---------------------------------------------------------------------------

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { ok: true, message: 'Cron endpoint ready' },
    { status: 200 }
  );
}

// ---------------------------------------------------------------------------
// POST — run health check
// ---------------------------------------------------------------------------

export async function POST(request: NextRequest): Promise<NextResponse> {
  const supabase = await createServerClient();

  // ── 1. Auth gate ─────────────────────────────────────────────────────────

  const authorized = await isAuthorized(request, supabase);
  if (!authorized) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    );
  }

  // ── 2. Invoke RPC ─────────────────────────────────────────────────────────

  const { data, error } = await supabase.rpc('run_credit_health_check');

  if (error) {
    console.error('[credit-health cron] RPC error:', error.message);
    return NextResponse.json(
      { ok: false, error: error.message },
      { status: 500 }
    );
  }

  // ── 3. Normalise result ───────────────────────────────────────────────────

  // The RPC may return either a plain object or an array of one row
  const raw = Array.isArray(data) ? data[0] : data;
  const result = {
    invoices_marked_overdue: Number(
      (raw as Record<string, unknown>)?.invoices_marked_overdue ?? 0
    ),
    accounts_suspended: Number(
      (raw as Record<string, unknown>)?.accounts_suspended ?? 0
    ),
    suggestions_created: Number(
      (raw as Record<string, unknown>)?.suggestions_created ?? 0
    ),
    ran_at:
      ((raw as Record<string, unknown>)?.ran_at as string) ??
      new Date().toISOString(),
  };

  return NextResponse.json({ ok: true, result }, { status: 200 });
}

// ---------------------------------------------------------------------------
// Authorization helper
// ---------------------------------------------------------------------------

type SupabaseClient = Awaited<ReturnType<typeof createServerClient>>;

async function isAuthorized(
  request: NextRequest,
  supabase: SupabaseClient
): Promise<boolean> {
  // Path A: server-to-server cron secret
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret) {
    const headerSecret = request.headers.get('x-cron-secret');
    if (headerSecret === cronSecret) {
      return true;
    }
  }

  // Path B: authenticated admin user via session
  // The Authorization header carries the user's JWT when using Supabase JS
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return false;
  }

  const token = authHeader.slice(7);

  // Verify the JWT and extract the user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return false;
  }

  // Check role via user_profiles table
  const { data: profile, error: profileError } = await supabase
    .from('user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (profileError || !profile) {
    return false;
  }

  return profile.role === 'admin';
}
