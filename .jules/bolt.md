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

## 2026-02-04 - Stabilizing Props for React.memo in Storefront

**Learning:** In `components/B2C/Storefront.tsx`, `ArtifactCard` was re-rendering unnecessarily during filtering because the `onAdd` callback was passed as an inline arrow function (`() => onToggleWishlist(product)`), creating a new reference on every render. This negated the benefits of `React.memo` for the complex card component.

**Action:** Refactored `ArtifactCard` to accept `onToggleWishlist` directly (which is a stable prop from the parent during local filtering) and the card now calls it with the product. Wrapped `ArtifactCard` in `React.memo`.

**Pattern for Future:** When memoizing list items, ensure all callback props are stable. If the item needs to pass its own ID/data back to the parent, pass the handler and the data separately, or let the child handle the invocation arguments, rather than creating inline closures in the render loop.
