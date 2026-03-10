# Global Design Rules

These rules must be strictly adhered to across all UI components and page designs:

1. **No Flat UI:** Never use solid hex colors for backgrounds. Always apply a 5% grain texture overlay to add depth and tactile quality.

2. **Halo Lighting:** All central elements must have a radial-gradient "halo" (`rgba(255,255,255,0.4)`) positioned behind them to create a glowing focal point.

3. **Glassmorphism:** Product cards and similar surface elements must use `backdrop-filter: blur(15px)` and a 1px border of `rgba(255,255,255,0.3)` instead of standard shadows to achieve an elevated, premium feel.
