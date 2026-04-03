'use client';

import { createContext, useContext, useState, useMemo, type ReactNode } from 'react';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface CartItem {
  // Core fields
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  slug?: string;
  // Computed / legacy aliases (kept in sync by CartProvider)
  cart_item_id: string;
  product_name: string;
  product_slug: string;
  variant_label?: string;
  variant_sku?: string;
  variant_id: string;
  qty: number;
  unit_price: number;
  line_total: number;
}

/** Input shape for addItem — only the core fields are required */
export interface AddItemInput {
  id?: string;
  name: string;
  price: number;
  quantity?: number;
  image_url?: string;
  slug?: string;
  variant_label?: string;
  variant_sku?: string;
  variantId?: string;
  productId?: string;
  productSlug?: string;
  qty?: number;
  image?: string | null;
  sku?: string | null;
  label?: string | null;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  item_count: number;
}

interface CartContextValue {
  cart: Cart;
  items: CartItem[];
  addItem: (item: AddItemInput) => void;
  removeItem: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  itemCount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

// ── Context ───────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue>({
  cart: { items: [], subtotal: 0, item_count: 0 },
  items: [],
  addItem: () => {},
  removeItem: () => {},
  updateQty: () => {},
  clearCart: () => {},
  itemCount: 0,
  isOpen: false,
  setIsOpen: () => {},
});

// ── Helpers ───────────────────────────────────────────────────────────────────

function buildCartItem(input: AddItemInput, existingQty = 0): CartItem {
  const resolvedId = input.id ?? input.variantId ?? input.productId;
  const resolvedQty = input.quantity ?? input.qty ?? 1;
  const resolvedImage = input.image_url ?? input.image ?? undefined;
  const resolvedSlug = input.slug ?? input.productSlug;
  const resolvedVariantLabel = input.variant_label ?? input.label ?? undefined;
  const resolvedVariantSku = input.variant_sku ?? input.sku ?? undefined;

  if (!resolvedId) {
    throw new Error('Cart item id is required.');
  }

  const qty = resolvedQty + existingQty;
  return {
    id: resolvedId,
    name: input.name,
    price: input.price,
    quantity: qty,
    image_url: resolvedImage,
    slug: resolvedSlug,
    variant_label: resolvedVariantLabel,
    variant_sku: resolvedVariantSku,
    // Computed aliases
    cart_item_id: resolvedId,
    product_name: input.name,
    product_slug: resolvedSlug ?? resolvedId,
    variant_id: input.variantId ?? resolvedId,
    qty,
    unit_price: input.price,
    line_total: input.price * qty,
  };
}

function syncQty(item: CartItem, qty: number): CartItem {
  return { ...item, quantity: qty, qty, line_total: item.price * qty };
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = (input: AddItemInput) => {
    setItems(prev => {
      const idx = prev.findIndex(i => i.id === input.id);
      const lookupId = input.id ?? input.variantId ?? input.productId;
      const nextQty = input.quantity ?? input.qty ?? 1;
      const idxByLookup = prev.findIndex(i => i.id === lookupId);
      if (idx >= 0 || idxByLookup >= 0) {
        const currentIndex = idx >= 0 ? idx : idxByLookup;
        const updated = [...prev];
        updated[currentIndex] = syncQty(prev[currentIndex], prev[currentIndex].qty + nextQty);
        return updated;
      }
      return [...prev, buildCartItem(input)];
    });
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? syncQty(i, qty) : i));
  };

  const clearCart = () => setItems([]);

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);

  const cart = useMemo<Cart>(() => ({
    items,
    subtotal: items.reduce((sum, i) => sum + i.line_total, 0),
    item_count: items.length,
  }), [items]);

  return (
    <CartContext.Provider value={{
      cart, items, addItem, removeItem, updateQty, clearCart, itemCount, isOpen, setIsOpen,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
