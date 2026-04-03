/**
 * Simple in-memory rate limiter.
 * Works per-process; fine for single-instance deployments.
 * For distributed environments, replace the store with Redis.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const store = new Map<string, Bucket>();

// Clean up stale buckets every 10 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, bucket] of store) {
    if (now >= bucket.resetAt) store.delete(key);
  }
}, 10 * 60 * 1000);

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * @param key         Unique identifier for the rate-limit bucket (e.g. "contact:1.2.3.4")
 * @param maxRequests Maximum requests allowed within the window
 * @param windowMs    Window size in milliseconds
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): RateLimitResult {
  const now = Date.now();
  let bucket = store.get(key);

  if (!bucket || now >= bucket.resetAt) {
    bucket = { count: 0, resetAt: now + windowMs };
    store.set(key, bucket);
  }

  bucket.count += 1;

  const limited = bucket.count > maxRequests;
  const remaining = Math.max(0, maxRequests - bucket.count);
  const retryAfterMs = limited ? bucket.resetAt - now : 0;

  return { limited, remaining, retryAfterMs };
}
