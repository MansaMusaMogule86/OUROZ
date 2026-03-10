/**
 * Simple in-memory sliding-window rate limiter for Next.js API routes.
 * Suitable for single-instance deployments. For multi-instance / serverless,
 * swap the Map for Redis (e.g. Upstash).
 */

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean expired entries every 5 minutes to prevent memory leak
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup() {
    const now = Date.now();
    if (now - lastCleanup < CLEANUP_INTERVAL) return;
    lastCleanup = now;
    for (const [key, entry] of store) {
        if (entry.resetAt < now) store.delete(key);
    }
}

/**
 * Check whether a request should be rate-limited.
 *
 * @param key   Unique identifier (IP, user ID, etc.)
 * @param limit Max requests per window
 * @param windowMs Window duration in milliseconds
 * @returns `{ limited: false, remaining }` or `{ limited: true, retryAfterMs }`
 */
export function rateLimit(
    key: string,
    limit: number,
    windowMs: number,
): { limited: boolean; remaining: number; retryAfterMs: number } {
    cleanup();
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || entry.resetAt < now) {
        store.set(key, { count: 1, resetAt: now + windowMs });
        return { limited: false, remaining: limit - 1, retryAfterMs: 0 };
    }

    entry.count += 1;
    if (entry.count > limit) {
        return { limited: true, remaining: 0, retryAfterMs: entry.resetAt - now };
    }

    return { limited: false, remaining: limit - entry.count, retryAfterMs: 0 };
}
