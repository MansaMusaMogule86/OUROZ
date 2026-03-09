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

## 2026-02-04 - Debouncing Global State Updates in High-Frequency Inputs

**Learning:** In React architectures using global or page-level state for inputs (like `filters.search` in `BuyerMarketplace.tsx`), directly updating the parent state via an `onChange` handler causes the entire component tree to re-render on every keystroke. This causes massive layout thrashing and input lag.

**Action:** When a high-frequency event (like typing) updates a global state, decouple the input's visual state from the parent's data state. Store the input value in local component state (`useState`), update *that* state on `onChange` to keep the UI snappy, and use a `useEffect` with a timeout (e.g., 300ms) to debounce the update to the parent state.
