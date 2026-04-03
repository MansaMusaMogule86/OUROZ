/**
 * OUROZ – pricingService
 * Server-safe tier pricing functions. Pure logic, no Supabase calls.
 * Re-exported here to give services a single import point.
 */

export type { PriceTier, UserRole } from '@/lib/pricing';
export {
    getActiveTier,
    calculateUnitPrice,
    calculateLineTotal,
    getLowestTierPrice,
    formatAED,
    calculateVAT,
} from '@/lib/pricing';

// Re-export with business-specific helpers
import { calculateUnitPrice, calculateLineTotal, calculateVAT } from '@/lib/pricing';
import type { PriceTier, UserRole } from '@/lib/pricing';

export interface LineItemInput {
    variantId:   string;
    retailPrice: number;
    priceTiers:  PriceTier[];
    qty:         number;
}

export interface PricedLineItem extends LineItemInput {
    unitPrice:  number;
    lineTotal:  number;
}

/**
 * Price an array of cart line items for a given user role.
 * Returns items with computed unitPrice and lineTotal.
 */
export function priceLineItems(
    items: LineItemInput[],
    userRole: UserRole
): PricedLineItem[] {
    return items.map(item => {
        const unitPrice = calculateUnitPrice(item.retailPrice, userRole, item.priceTiers, item.qty);
        return {
            ...item,
            unitPrice,
            lineTotal: calculateLineTotal(unitPrice, item.qty),
        };
    });
}

export interface OrderTotals {
    subtotal:  number;
    vatAmount: number;
    shipping:  number;
    total:     number;
}

/**
 * Compute order totals from priced line items.
 * shippingCost default 0 — integrate shipping calc separately if needed.
 */
export function computeOrderTotals(
    pricedItems: PricedLineItem[],
    shippingCost = 0,
    vatRate = 0.05
): OrderTotals {
    const subtotal  = Math.round(pricedItems.reduce((s, i) => s + i.lineTotal, 0) * 100) / 100;
    const vatAmount = calculateVAT(subtotal, vatRate);
    const total     = Math.round((subtotal + vatAmount + shippingCost) * 100) / 100;
    return { subtotal, vatAmount, shipping: shippingCost, total };
}
