'use client';
/**
 * useCart – Cart hook with stock validation and dynamic tier pricing.
 *
 * Authenticated users: persists to Supabase (carts + cart_items tables).
 * Guest users:         falls back to localStorage key "ouroz_guest_cart".
 * On login:           guest cart is merged into the DB cart automatically.
 *
 * Pricing follows GOD MODE spec:
 *   customer / admin → variant.retail_price
 *   wholesale        → best matching price_tier (highest min_quantity <= qty)
 *
 * Stock validation:
 *   addItem / updateQty check variant.stock_quantity before mutating.
 *   If requested qty > stock, the operation is rejected and an error is returned.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import {
    getOrCreateCart,
    fetchCartItems,
    upsertCartItem,
    removeCartItem,
    clearCartItems,
    fetchVariantStock,
    type V2CartItemEnriched,
} from '@/lib/api';
import {
    calculateUnitPrice,
    calculateLineTotal,
    type UserRole,
    type PriceTier,
} from '@/lib/pricing';

// =============================================================================
// Types
// =============================================================================

export interface CartLineItem {
    cart_item_id: string;
    variant_id: string;
    quantity: number;
    sku: string;
    /** Display label: "500g", "1kg" … */
    variant_label: string | null;
    product_id: string;
    product_name: string;
    product_slug: string;
    image_url: string | null;
    /** Effective unit price for current role + qty */
    unit_price: number;
    line_total: number;
    stock_quantity: number;
    price_tiers: PriceTier[];
}

export interface UseCartReturn {
    items: CartLineItem[];
    itemCount: number;
    subtotal: number;
    loading: boolean;
    cartId: string | null;
    /** Returns an error string on failure (e.g. insufficient stock) */
    addItem: (variantId: string, quantity?: number) => Promise<string | null>;
    updateQty: (variantId: string, newQty: number) => Promise<string | null>;
    removeItem: (variantId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    /** Whether the cart drawer is open */
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
}

// =============================================================================
// Guest cart helpers
// =============================================================================

const GUEST_KEY = 'ouroz_guest_cart';

interface GuestItem { variantId: string; quantity: number }

function readGuestCart(): GuestItem[] {
    try {
        return JSON.parse(localStorage.getItem(GUEST_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function writeGuestCart(items: GuestItem[]): void {
    localStorage.setItem(GUEST_KEY, JSON.stringify(items));
}

function clearGuestCart(): void {
    localStorage.removeItem(GUEST_KEY);
}

// =============================================================================
// Hook
// =============================================================================

export function useCart(userRole: UserRole = 'customer'): UseCartReturn {
    const [rawItems, setRawItems] = useState<V2CartItemEnriched[]>([]);
    const [cartId, setCartId] = useState<string | null>(null);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);

    // ------------------------------------------------------------------
    // Load cart on mount / auth change
    // ------------------------------------------------------------------
    const loadCart = useCallback(async (uid: string | null) => {
        setLoading(true);
        if (!uid) {
            // Guest: no DB cart; items shown from localStorage via enrichment
            setCartId(null);
            setUserId(null);
            setRawItems([]);
            setLoading(false);
            return;
        }
        setUserId(uid);
        const cid = await getOrCreateCart(uid);
        setCartId(cid);
        if (cid) {
            const items = await fetchCartItems(cid);
            setRawItems(items);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        let cancelled = false;

        supabase.auth.getUser().then(({ data: { user } }) => {
            if (!cancelled) loadCart(user?.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (_event, session) => {
                if (cancelled) return;
                const uid = session?.user?.id ?? null;

                if (uid && !userId) {
                    // User just logged in → merge guest cart first
                    const guestItems = readGuestCart();
                    if (guestItems.length > 0) {
                        const cid = await getOrCreateCart(uid);
                        if (cid) {
                            for (const gi of guestItems) {
                                const stock = await fetchVariantStock(gi.variantId);
                                const safeQty = Math.min(gi.quantity, stock);
                                if (safeQty > 0) await upsertCartItem(cid, gi.variantId, safeQty);
                            }
                        }
                        clearGuestCart();
                    }
                }
                loadCart(uid);
            }
        );

        return () => {
            cancelled = true;
            subscription.unsubscribe();
        };
    }, [loadCart, userId]);

    // ------------------------------------------------------------------
    // Derived enriched line items
    // ------------------------------------------------------------------
    const items = useMemo<CartLineItem[]>(() => {
        return rawItems.map((ci) => {
            const v = ci.variant;
            const tiers: PriceTier[] = v.price_tiers ?? [];
            const unitPrice = calculateUnitPrice(v.retail_price, userRole, tiers, ci.quantity);
            const product = v.product;

            return {
                cart_item_id:   ci.id,
                variant_id:     ci.variant_id,
                quantity:       ci.quantity,
                sku:            v.sku,
                variant_label:  v.weight ?? v.size_label ?? null,
                product_id:     product.id,
                product_name:   product.name,
                product_slug:   product.slug,
                image_url:      product.image_urls?.[0] ?? null,
                unit_price:     unitPrice,
                line_total:     calculateLineTotal(unitPrice, ci.quantity),
                stock_quantity: v.stock_quantity,
                price_tiers:    tiers,
            };
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rawItems, userRole]);

    const itemCount = useMemo(
        () => items.reduce((acc, i) => acc + i.quantity, 0),
        [items]
    );

    const subtotal = useMemo(
        () => Math.round(items.reduce((acc, i) => acc + i.line_total, 0) * 100) / 100,
        [items]
    );

    // ------------------------------------------------------------------
    // Mutations
    // ------------------------------------------------------------------

    /** Add `quantity` of a variant. Returns error string or null on success. */
    const addItem = useCallback(async (
        variantId: string,
        quantity = 1
    ): Promise<string | null> => {
        // Stock check
        const stock = await fetchVariantStock(variantId);
        const existing = items.find(i => i.variant_id === variantId);
        const currentQty = existing?.quantity ?? 0;
        if (currentQty + quantity > stock) {
            return `Only ${stock - currentQty} unit${stock - currentQty === 1 ? '' : 's'} available.`;
        }

        if (!cartId) {
            // Guest cart
            const guestItems = readGuestCart();
            const idx = guestItems.findIndex(g => g.variantId === variantId);
            if (idx >= 0) {
                guestItems[idx].quantity = Math.min(guestItems[idx].quantity + quantity, stock);
            } else {
                guestItems.push({ variantId, quantity });
            }
            writeGuestCart(guestItems);
            // Re-trigger enrichment (we don't enrich guest cart items here;
            // host application should handle guest display separately)
            return null;
        }

        const newQty = currentQty + quantity;
        const ok = await upsertCartItem(cartId, variantId, newQty);
        if (!ok) return 'Failed to add item. Please try again.';

        // Optimistic refresh
        const fresh = await fetchCartItems(cartId);
        setRawItems(fresh);
        return null;
    }, [cartId, items]);

    /** Set exact qty for a variant. Pass 0 to remove. */
    const updateQty = useCallback(async (
        variantId: string,
        newQty: number
    ): Promise<string | null> => {
        if (newQty <= 0) {
            await removeItem(variantId);
            return null;
        }

        const stock = await fetchVariantStock(variantId);
        if (newQty > stock) {
            return `Only ${stock} unit${stock === 1 ? '' : 's'} in stock.`;
        }

        if (!cartId) {
            const guestItems = readGuestCart();
            const idx = guestItems.findIndex(g => g.variantId === variantId);
            if (idx >= 0) guestItems[idx].quantity = newQty;
            writeGuestCart(guestItems);
            return null;
        }

        const ok = await upsertCartItem(cartId, variantId, newQty);
        if (!ok) return 'Update failed. Please try again.';

        const fresh = await fetchCartItems(cartId);
        setRawItems(fresh);
        return null;
    }, [cartId]); // eslint-disable-line react-hooks/exhaustive-deps

    const removeItem = useCallback(async (variantId: string): Promise<void> => {
        if (!cartId) {
            const guestItems = readGuestCart().filter(g => g.variantId !== variantId);
            writeGuestCart(guestItems);
            return;
        }
        await removeCartItem(cartId, variantId);
        const fresh = await fetchCartItems(cartId);
        setRawItems(fresh);
    }, [cartId]);

    const clearCart = useCallback(async (): Promise<void> => {
        if (!cartId) {
            clearGuestCart();
            return;
        }
        await clearCartItems(cartId);
        setRawItems([]);
    }, [cartId]);

    return {
        items,
        itemCount,
        subtotal,
        loading,
        cartId,
        addItem,
        updateQty,
        removeItem,
        clearCart,
        isOpen,
        openCart:  () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
    };
}
