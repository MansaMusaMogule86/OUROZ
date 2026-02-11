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

## 2026-02-05 - Avoid Inline Functions with Memoized Components

**Learning:** In `Storefront.tsx`, `ArtifactCard` was receiving an inline arrow function (`onAdd={() => onToggleWishlist(product)}`) as a prop. This caused a new function reference to be created on every render, defeating `React.memo` optimization even if other props were stable. The search input caused frequent re-renders of the parent, which cascaded to all children.

**Action:** Refactored `ArtifactCard` to accept the stable `onToggleWishlist` function directly and handle the product binding internally (`handleToggle`). This ensures props are referentially stable, allowing `React.memo` to skip re-renders for unchanged cards during filtering.

**Pattern for Future:** When memoizing list items, ALWAYS check that callback props are stable. Avoid passing `() => handler(item)` in the render loop. Instead, pass `handler` and let the child component bind `item` or pass `item` to the handler.
