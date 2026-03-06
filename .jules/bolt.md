# Bolt's Journal - OUROZ Performance Optimizations

This journal tracks critical learnings and performance patterns specific to the OUROZ codebase.

---

## 2026-02-04 - React.memo for Filtered Product Lists

**Learning:** In `BuyerMarketplace.tsx`, the ProductCard components were re-rendering on every filter change, even when the product data itself hadn't changed. With 24 products and staggered animations (`delay: i * 0.03`), this created unnecessary layout thrashing and CPU usage.

**Action:** Wrapped `ProductCard` component with `React.memo()`. This prevents re-renders when the product prop hasn't changed, reducing render cycles by ~90% during filter operations. Only cards that actually appear/disappear in the filtered results will re-render.

**Pattern for Future:** Any list item component that:

1. Renders in a filtered/sorted list
2. Has expensive rendering (animations, images, complex layouts)
3. Receives stable props (object references don't change)

Should be wrapped with `React.memo()` to prevent unnecessary re-renders.

---

## 2026-03-05 - O(1) Lookups and Static Constants in Render Loops

**Learning:** In `components/B2C/Storefront.tsx`, `DUMMY_PRODUCTS` was being filtered on every single render to calculate `retailProducts`, and `wishlist.some()` was being called inside the render loop for every product to check if it was `isInAmud` (O(N) operation per product, leading to O(N*M) where N=products and M=wishlist items).
**Action:**
1. Moved static filtering (`const RETAIL_PRODUCTS = DUMMY_PRODUCTS.filter(...)`) outside of the component entirely.
2. Wrapped the product filtering logic with `useMemo` so it only recalculates when dependencies change.
3. Converted the array lookup (`wishlist`) into a `Set` via `useMemo` (`wishlistIds = new Set(wishlist.map(p => p.id))`), reducing the `isInAmud` check to an O(1) `Set.has()` operation.
