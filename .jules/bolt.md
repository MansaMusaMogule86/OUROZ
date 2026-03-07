## 2024-02-04 - React.memo and useMemo in OrderManagement.tsx
**Learning:** In `OrderManagement.tsx`, `filteredOrders` was recalculating on every render, and `OrderCard`s were re-rendering unnecessarily due to an inline `onClick={() => setSelectedOrder(order)}` prop. This resulted in wasted rendering cycles.
**Action:** When filtering arrays before rendering a list, wrap the filtering logic in `useMemo`. When rendering list items that depend on a selection state, pass the stable state setter function (like `setSelectedOrder`) directly as a prop (e.g., `onSelect`) to a `React.memo` wrapped child component, rather than passing an inline function. This ensures stable props and prevents unnecessary list item re-renders.

## 2024-02-04 - cartCount memoization in App.tsx
**Learning:** The `cartCount` prop passed down to `Navigation` in `App.tsx` was being recalculated from `cart.reduce` on every render.
**Action:** Memoize values derived from arrays (like lengths or sums) using `useMemo` so that they only recalculate when the underlying array actually changes.
