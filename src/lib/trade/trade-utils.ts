/**
 * Morocco Trade OS — Utility Functions
 * Formatters, helpers, and common operations.
 */

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    const symbols: Record<string, string> = {
        USD: '$', AED: 'AED ', MAD: 'MAD ', EUR: '€', GBP: '£',
    };
    const prefix = symbols[currency] || `${currency} `;
    return `${prefix}${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}

export function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateShort(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatRelativeTime(dateStr: string): string {
    const now = new Date();
    const d = new Date(dateStr);
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateStr);
}

export function formatPercentage(value: number, decimals: number = 1): string {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}

export function formatWeight(kg: number): string {
    if (kg >= 1000) return `${(kg / 1000).toFixed(1)}t`;
    return `${kg}kg`;
}

export function formatVolume(cbm: number): string {
    return `${cbm.toFixed(1)} CBM`;
}

export function daysUntil(dateStr: string): number {
    const now = new Date();
    const target = new Date(dateStr);
    return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function getScoreColor(score: number): string {
    if (score >= 80) return 'var(--color-zellige)';
    if (score >= 60) return 'var(--color-gold)';
    return 'var(--color-imperial)';
}

export function getRiskColor(level: string): string {
    switch (level) {
        case 'low': return 'var(--color-zellige)';
        case 'medium': return 'var(--color-gold)';
        case 'high': return 'var(--color-imperial)';
        case 'critical': return '#DC2626';
        default: return 'var(--color-charcoal)';
    }
}

export function truncate(str: string, maxLen: number): string {
    if (str.length <= maxLen) return str;
    return str.slice(0, maxLen - 1) + '…';
}

export function generateId(): string {
    return Math.random().toString(36).slice(2, 10);
}
