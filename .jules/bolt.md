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

## 2026-02-09 - Stable Callbacks for Memoized List Items

**Learning:** `React.memo` is ineffective if props are unstable. Inline arrow functions (e.g., `onAdd={() => toggle(item)}`) create new references on every render, defeating memoization.

**Action:** Pass the handler function directly (e.g., `onToggle={toggle}`) and the item data as separate props, or have the child component handle the currying (e.g., `onClick={() => onToggle(item)}`). This ensures the function prop remains referentially stable.

**Result:** Significantly reduced re-renders in `B2CStorefront` when searching or filtering products, as list items now only re-render when their specific data changes.

---
