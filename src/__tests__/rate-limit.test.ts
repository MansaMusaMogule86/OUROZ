import { describe, it, expect, beforeEach, vi } from 'vitest';
import { rateLimit } from '@/lib/rate-limit';

describe('rateLimit', () => {
    beforeEach(() => {
        // Reset module state between tests by using unique keys
    });

    it('allows requests under the limit', () => {
        const key = `test-under-${Date.now()}`;
        const result = rateLimit(key, 5, 60_000);
        expect(result.limited).toBe(false);
        expect(result.remaining).toBe(4);
        expect(result.retryAfterMs).toBe(0);
    });

    it('decrements remaining count with each request', () => {
        const key = `test-decrement-${Date.now()}`;
        rateLimit(key, 3, 60_000);
        const r2 = rateLimit(key, 3, 60_000);
        expect(r2.remaining).toBe(1);

        const r3 = rateLimit(key, 3, 60_000);
        expect(r3.remaining).toBe(0);
        expect(r3.limited).toBe(false);
    });

    it('blocks requests over the limit', () => {
        const key = `test-over-${Date.now()}`;
        // Use up all 3 allowed
        rateLimit(key, 3, 60_000);
        rateLimit(key, 3, 60_000);
        rateLimit(key, 3, 60_000);

        // 4th should be blocked
        const result = rateLimit(key, 3, 60_000);
        expect(result.limited).toBe(true);
        expect(result.remaining).toBe(0);
        expect(result.retryAfterMs).toBeGreaterThan(0);
    });

    it('resets after window expires', () => {
        const key = `test-reset-${Date.now()}`;
        // Use a very small window
        vi.useFakeTimers();

        rateLimit(key, 2, 1000);
        rateLimit(key, 2, 1000);
        const blocked = rateLimit(key, 2, 1000);
        expect(blocked.limited).toBe(true);

        // Advance past the window
        vi.advanceTimersByTime(1100);

        const afterReset = rateLimit(key, 2, 1000);
        expect(afterReset.limited).toBe(false);
        expect(afterReset.remaining).toBe(1);

        vi.useRealTimers();
    });

    it('tracks different keys independently', () => {
        const keyA = `test-a-${Date.now()}`;
        const keyB = `test-b-${Date.now()}`;

        rateLimit(keyA, 1, 60_000);
        const blockedA = rateLimit(keyA, 1, 60_000);
        expect(blockedA.limited).toBe(true);

        // Key B should still be allowed
        const resultB = rateLimit(keyB, 1, 60_000);
        expect(resultB.limited).toBe(false);
    });
});
