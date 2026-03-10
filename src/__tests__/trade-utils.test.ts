import { describe, it, expect } from 'vitest';
import {
    formatCurrency,
    formatDate,
    formatDateShort,
    formatPercentage,
    formatWeight,
    formatVolume,
    truncate,
    getScoreColor,
    getRiskColor,
    generateId,
} from '@/lib/trade/trade-utils';

describe('formatCurrency', () => {
    it('formats USD with $ symbol', () => {
        expect(formatCurrency(1250, 'USD')).toBe('$1,250');
    });

    it('formats AED with prefix', () => {
        expect(formatCurrency(500, 'AED')).toBe('AED 500');
    });

    it('formats MAD with prefix', () => {
        expect(formatCurrency(10000, 'MAD')).toBe('MAD 10,000');
    });

    it('formats EUR with euro symbol', () => {
        expect(formatCurrency(99.5, 'EUR')).toBe('€99.5');
    });

    it('defaults to USD', () => {
        expect(formatCurrency(100)).toBe('$100');
    });

    it('handles unknown currency with code prefix', () => {
        expect(formatCurrency(200, 'JPY')).toBe('JPY 200');
    });

    it('formats with comma separators', () => {
        expect(formatCurrency(1234567, 'USD')).toBe('$1,234,567');
    });
});

describe('formatDate', () => {
    it('formats ISO date string', () => {
        const result = formatDate('2025-03-15');
        expect(result).toContain('Mar');
        expect(result).toContain('15');
        expect(result).toContain('2025');
    });
});

describe('formatDateShort', () => {
    it('formats date without year', () => {
        const result = formatDateShort('2025-06-01');
        expect(result).toContain('Jun');
        expect(result).toContain('1');
        expect(result).not.toContain('2025');
    });
});

describe('formatPercentage', () => {
    it('adds + for positive values', () => {
        expect(formatPercentage(5.2)).toBe('+5.2%');
    });

    it('keeps - for negative values', () => {
        expect(formatPercentage(-3.1)).toBe('-3.1%');
    });

    it('respects decimal parameter', () => {
        expect(formatPercentage(12.345, 2)).toBe('+12.35%');
    });
});

describe('formatWeight', () => {
    it('formats kg under 1000', () => {
        expect(formatWeight(500)).toBe('500kg');
    });

    it('converts to tonnes for >= 1000', () => {
        expect(formatWeight(2500)).toBe('2.5t');
    });

    it('formats exactly 1000', () => {
        expect(formatWeight(1000)).toBe('1.0t');
    });
});

describe('formatVolume', () => {
    it('formats CBM with 1 decimal', () => {
        expect(formatVolume(12.34)).toBe('12.3 CBM');
    });
});

describe('truncate', () => {
    it('returns short strings unchanged', () => {
        expect(truncate('hello', 10)).toBe('hello');
    });

    it('truncates long strings with ellipsis', () => {
        expect(truncate('hello world', 8)).toBe('hello w…');
    });

    it('handles exact length', () => {
        expect(truncate('hello', 5)).toBe('hello');
    });
});

describe('getScoreColor', () => {
    it('returns zellige (green) for >= 80', () => {
        expect(getScoreColor(80)).toBe('var(--color-zellige)');
        expect(getScoreColor(95)).toBe('var(--color-zellige)');
    });

    it('returns gold for 60-79', () => {
        expect(getScoreColor(60)).toBe('var(--color-gold)');
        expect(getScoreColor(79)).toBe('var(--color-gold)');
    });

    it('returns imperial (red) for < 60', () => {
        expect(getScoreColor(59)).toBe('var(--color-imperial)');
        expect(getScoreColor(0)).toBe('var(--color-imperial)');
    });
});

describe('getRiskColor', () => {
    it('maps risk levels to correct colors', () => {
        expect(getRiskColor('low')).toBe('var(--color-zellige)');
        expect(getRiskColor('medium')).toBe('var(--color-gold)');
        expect(getRiskColor('high')).toBe('var(--color-imperial)');
        expect(getRiskColor('critical')).toBe('#DC2626');
    });

    it('returns charcoal for unknown levels', () => {
        expect(getRiskColor('unknown')).toBe('var(--color-charcoal)');
    });
});

describe('generateId', () => {
    it('returns a string of reasonable length', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
        expect(id.length).toBeGreaterThanOrEqual(6);
    });

    it('generates unique ids', () => {
        const ids = new Set(Array.from({ length: 100 }, () => generateId()));
        expect(ids.size).toBe(100);
    });
});
