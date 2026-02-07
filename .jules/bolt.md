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

## 2026-02-05 - State Colocation for Landing Page Search

**Learning:** The `LandingPage` component was lifting `searchQuery` state up to the top level, causing the entire page (including heavy `motion` components in `StatsSection`, `CategoriesSection`, etc.) to re-render on every keystroke. This resulted in significant unnecessary CPU usage during text input.

**Action:** Moved `searchQuery` state and handler down into the `HeroSection` component where it is actually used. This isolates the re-renders to just the search input area.

**Pattern for Future:** Avoid lifting state to page-level components unless absolutely necessary (e.g., shared between siblings). For controlled inputs in hero sections or headers, colocate the state within the component to prevent full-page layout thrashing.

---
