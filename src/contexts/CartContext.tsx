'use client';
/**
 * OUROZ – Cart Context
 * Persists to Supabase for auth'd users.
 * Falls back to localStorage for guests (merged on login).
 */

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
    type ReactNode,
} from 'react';
import { supabase } from '@/lib/supabase';
import type { CartItemEnriched, CartData } from '@/types/shop';

// =====================================================
// GUEST CART (localStorage)
// =====================================================

const GUEST_CART_KEY = 'ouroz_guest_cart';

interface GuestCartItem {
    variant_id: string;
    qty: number;
    name: string;
    image: string | null;
    sku: string;
    label: string | null;
    price: number;
    product_id: string;
    product_slug: string;
}

function loadGuestCart(): GuestCartItem[] {
    if (typeof window === 'undefined') return [];
    try {
        return JSON.parse(localStorage.getItem(GUEST_CART_KEY) ?? '[]');
    } catch {
        return [];
    }
}

function saveGuestCart(items: GuestCartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(GUEST_CART_KEY, JSON.stringify(items));
}

// =====================================================
// CONTEXT TYPES
// =====================================================

interface CartContextValue {
    cart: CartData | null;
    loading: boolean;
    isOpen: boolean;
    openCart: () => void;
    closeCart: () => void;
    addItem: (params: {
        variantId: string;
        qty: number;
        // Metadata for guest cart
        name: string;
        image: string | null;
        sku: string;
        label: string | null;
        price: number;
        productId: string;
        productSlug: string;
    }) => Promise<void>;
    updateQty: (variantId: string, qty: number) => Promise<void>;
    removeItem: (variantId: string) => Promise<void>;
    clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

// =====================================================
// PROVIDER
// =====================================================

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<CartData | null>(null);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);

    // ───── Listen to Supabase auth state ─────
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            setUserId(data.user?.id ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    // ───── Load cart on auth change ─────
    useEffect(() => {
        if (userId) {
            loadServerCart(userId);
        } else {
            loadGuestCartToState();
        }
    }, [userId]);

    // ───── Server cart (Supabase) ─────
    async function loadServerCart(uid: string) {
        setLoading(true);
        try {
            // Upsert cart row
            const { data: cartRow } = await supabase
                .from('carts')
                .upsert({ user_id: uid }, { onConflict: 'user_id' })
                .select()
                .single();

            if (!cartRow) { setLoading(false); return; }

            const { data: items } = await supabase
                .from('cart_items')
                .select(`
                    id, cart_id, variant_id, qty,
                    product_variants!inner(
                        sku, weight_label, retail_price, product_id,
                        products!inner(slug, product_translations(name, lang), product_images(url, is_primary))
                    )
                `)
                .eq('cart_id', cartRow.id);

            const enriched: CartItemEnriched[] = (items ?? []).map(item => {
                const variant = item.product_variants as any;
                const product = variant.products as any;
                const translation = (product.product_translations as any[]).find(
                    (t: any) => t.lang === 'en'
                ) ?? product.product_translations[0];
                const image = (product.product_images as any[]).find(i => i.is_primary)?.url
                    ?? product.product_images[0]?.url ?? null;

                const unitPrice = Number(variant.retail_price);
                return {
                    cart_item_id: item.id,
                    variant_id: item.variant_id,
                    qty: item.qty,
                    product_id: variant.product_id,
                    product_name: translation?.name ?? variant.sku,
                    product_slug: product.slug,
                    variant_sku: variant.sku,
                    variant_label: variant.weight_label,
                    image_url: image,
                    unit_price: unitPrice,
                    line_total: unitPrice * item.qty,
                };
            });

            const subtotal = enriched.reduce((s, i) => s + i.line_total, 0);
            setCart({
                cart_id: cartRow.id,
                items: enriched,
                subtotal,
                item_count: enriched.reduce((s, i) => s + i.qty, 0),
            });
        } finally {
            setLoading(false);
        }
    }

    // ───── Guest cart (localStorage) ─────
    function loadGuestCartToState() {
        const items = loadGuestCart();
        const enriched: CartItemEnriched[] = items.map(g => ({
            cart_item_id: g.variant_id,
            variant_id: g.variant_id,
            qty: g.qty,
            product_id: g.product_id,
            product_name: g.name,
            product_slug: g.product_slug,
            variant_sku: g.sku,
            variant_label: g.label,
            image_url: g.image,
            unit_price: g.price,
            line_total: g.price * g.qty,
        }));
        const subtotal = enriched.reduce((s, i) => s + i.line_total, 0);
        setCart(enriched.length > 0 ? {
            cart_id: 'guest',
            items: enriched,
            subtotal,
            item_count: enriched.reduce((s, i) => s + i.qty, 0),
        } : null);
    }

    // ───── Add item ─────
    const addItem = useCallback(async (params: Parameters<CartContextValue['addItem']>[0]) => {
        setLoading(true);
        try {
            if (userId) {
                // Ensure cart exists
                const { data: cartRow } = await supabase
                    .from('carts')
                    .upsert({ user_id: userId }, { onConflict: 'user_id' })
                    .select()
                    .single();

                if (!cartRow) return;

                await supabase.from('cart_items').upsert({
                    cart_id: cartRow.id,
                    variant_id: params.variantId,
                    qty: params.qty,
                }, { onConflict: 'cart_id,variant_id' });

                await loadServerCart(userId);
            } else {
                // Guest
                const existing = loadGuestCart();
                const idx = existing.findIndex(i => i.variant_id === params.variantId);
                if (idx >= 0) {
                    existing[idx].qty += params.qty;
                } else {
                    existing.push({
                        variant_id: params.variantId,
                        qty: params.qty,
                        name: params.name,
                        image: params.image,
                        sku: params.sku,
                        label: params.label,
                        price: params.price,
                        product_id: params.productId,
                        product_slug: params.productSlug,
                    });
                }
                saveGuestCart(existing);
                loadGuestCartToState();
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // ───── Update quantity ─────
    const updateQty = useCallback(async (variantId: string, qty: number) => {
        if (qty <= 0) { await removeItem(variantId); return; }
        if (userId && cart?.cart_id !== 'guest') {
            await supabase.from('cart_items')
                .update({ qty })
                .eq('cart_id', cart?.cart_id!)
                .eq('variant_id', variantId);
            await loadServerCart(userId);
        } else {
            const items = loadGuestCart().map(i =>
                i.variant_id === variantId ? { ...i, qty } : i
            );
            saveGuestCart(items);
            loadGuestCartToState();
        }
    }, [userId, cart]);

    // ───── Remove item ─────
    const removeItem = useCallback(async (variantId: string) => {
        if (userId && cart?.cart_id !== 'guest') {
            await supabase.from('cart_items')
                .delete()
                .eq('cart_id', cart?.cart_id!)
                .eq('variant_id', variantId);
            await loadServerCart(userId);
        } else {
            const items = loadGuestCart().filter(i => i.variant_id !== variantId);
            saveGuestCart(items);
            loadGuestCartToState();
        }
    }, [userId, cart]);

    // ───── Clear cart ─────
    const clearCart = useCallback(async () => {
        if (userId && cart?.cart_id !== 'guest') {
            await supabase.from('cart_items').delete().eq('cart_id', cart?.cart_id!);
            setCart(null);
        } else {
            saveGuestCart([]);
            setCart(null);
        }
    }, [userId, cart]);

    return (
        <CartContext.Provider value={{
            cart,
            loading,
            isOpen,
            openCart: () => setIsOpen(true),
            closeCart: () => setIsOpen(false),
            addItem,
            updateQty,
            removeItem,
            clearCart,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be inside CartProvider');
    return ctx;
}
