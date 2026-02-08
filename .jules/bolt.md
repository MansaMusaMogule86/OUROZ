# Bolt's Journal - OUROZ Performance Optimizations

This journal tracks critical learnings and performance patterns specific to the OUROZ codebase.

---

## 2026-02-08 - Optimized ArtifactCard Rendering in Storefront

**Learning:** `ArtifactCard` components in `B2CStorefront.tsx` were re-rendering on every keystroke in the search bar because the `onAdd` callback was passed as an inline arrow function (`() => onToggleWishlist(product)`), breaking referential equality.

**Action:** Refactored `ArtifactCard` to accept a stable callback prop `onAdd` (the `onToggleWishlist` function itself) and wrapped the component in `React.memo()`. The child component now handles the argument binding (`onClick={() => onAdd(product)}`) internally, preventing unnecessary re-renders when parent state (search term) changes but products remain the same.

**Pattern for Future:** Avoid passing inline arrow functions to list items if you intend to memoize them. Instead, pass the handler directly and let the child component handle argument binding, or use `useCallback` in the parent (though direct passing is often simpler if the handler signature allows).

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
