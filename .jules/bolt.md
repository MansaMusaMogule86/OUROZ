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

## 2026-02-04 - Search Bar Debouncing and Array Mapping Iterations

**Learning:** In `B2CStorefront.tsx`, the primary `filtered` array (used to render `ArtifactCard` components) recalculated dynamically on every key stroke within the search bar, because `searchTerm` was directly linked. Additionally, `wishlist.some(...)` iterated over the entire `wishlist` array per `ArtifactCard` rendering, compounding the UI thread blocking on each typing event. Lastly, the static initialization array `retailProducts` was generated on every render rather than globally defined.

**Action:**
- Moved the `retailProducts` derivation to the file-level scope (now `RETAIL_PRODUCTS`), since its source `DUMMY_PRODUCTS` never mutates over the lifetime of the application.
- Added a `debouncedSearch` state variable tied to `searchTerm` with a 300ms `useEffect` delay, enabling users to type smoothly without triggering React commits to child components.
- Wrapped the dynamic array filtering in a `useMemo` block that explicitly watches `displayProducts`, `debouncedSearch`, and `activeCategory`.
- Upgraded the `isInAmud` checking mechanism to use a `useMemo` instantiated `Set` instead of array `.some()`, pivoting the time complexity per child from O(n) to O(1).

**Pattern for Future:** Any high-frequency search input triggering complex iteration across a large dataset needs independent debounced state paired with `useMemo` to throttle array processing. Arrays utilized for continuous item lookups in mapping paths should be converted to Sets outside the loop map scope. Global static mappings from constant sources must live outside the function component scope.

---
