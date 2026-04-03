/**
 * OUROZ – Tier pricing calculation
 * Pure functions, no side effects, no DB calls.
 *
 * Logic (per GOD MODE spec):
 *   customer | admin → always retail_price
 *   wholesale        → find highest tier where min_quantity <= qty, else retail_price
 *
 * Example tiers: [{min_quantity:1, price:13.99}, {min_quantity:10, price:12.50}, {min_quantity:50, price:11.20}]
 *   qty=5  → tier min_quantity=1  → 13.99
 *   qty=15 → tier min_quantity=10 → 12.50
 *   qty=60 → tier min_quantity=50 → 11.20
 */

export type UserRole = 'customer' | 'wholesale' | 'admin';

export interface PriceTier {
    min_quantity: number;
    price: number;
    label?: string | null;
}

/**
 * Find the active tier for a given quantity.
 * Returns the tier with the highest min_quantity that is still <= qty.
 * Returns null if no tier qualifies (caller should fall back to retail_price).
 */
export function getActiveTier(
    tiers: PriceTier[],
    quantity: number
): PriceTier | null {
    if (!tiers || tiers.length === 0) return null;
    const sorted = [...tiers].sort((a, b) => b.min_quantity - a.min_quantity);
    return sorted.find(t => t.min_quantity <= quantity) ?? null;
}

/**
 * Calculate the effective unit price.
 *   customer / admin → retailPrice always
 *   wholesale        → best matching tier price, or retailPrice if no tier qualifies
 */
export function calculateUnitPrice(
    retailPrice: number,
    userRole: UserRole,
    priceTiers: PriceTier[],
    quantity: number
): number {
    if (userRole !== 'wholesale') return retailPrice;
    const tier = getActiveTier(priceTiers, quantity);
    return tier ? tier.price : retailPrice;
}

/** unit_price × qty, rounded to 2 decimal places */
export function calculateLineTotal(unitPrice: number, quantity: number): number {
    return Math.round(unitPrice * quantity * 100) / 100;
}

/**
 * Return the lowest possible wholesale price across all tiers.
 * Used on product cards to display "From AED X".
 */
export function getLowestTierPrice(tiers: PriceTier[]): number | null {
    if (!tiers || tiers.length === 0) return null;
    return Math.min(...tiers.map(t => t.price));
}

/**
 * Format a number as AED currency string.
 * e.g. formatAED(13.99) → "AED 13.99"
 */
export function formatAED(amount: number): string {
    return new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        minimumFractionDigits: 2,
    }).format(amount);
}

/**
 * Calculate 5% UAE VAT on a subtotal.
 * Returns rounded amount (2dp).
 */
export function calculateVAT(subtotal: number, rate = 0.05): number {
    return Math.round(subtotal * rate * 100) / 100;
}
