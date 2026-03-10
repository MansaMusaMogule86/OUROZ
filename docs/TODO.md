# OUROZ — TODO & Roadmap

> **Updated**: 2026-03-10
> **Build Status**: Passing (53 pages, 0 errors)

---

## What's Done

### B2C Storefront (LIVE)
- [x] Landing page with brand entry animation
- [x] Shop catalog with Supabase product queries
- [x] Category browsing (`/shop/:category`)
- [x] Product detail pages with gallery, pricing, add-to-cart
- [x] Search functionality (`/shop/search`)
- [x] Shopping cart with CartContext state management
- [x] Checkout flow with Stripe payment intent
- [x] Order confirmation page
- [x] Wishlist with localStorage persistence
- [x] Account page
- [x] Multi-language support (EN/AR/FR via LangContext)
- [x] Brand ticker, category showcase, wholesale gate

### Auth System (LIVE)
- [x] Login / Signup (Supabase Auth)
- [x] Password reset flow
- [x] OAuth callback handler
- [x] Role-based hook (`useUserRole`)
- [x] Middleware route protection for admin, supplier, business, wholesale, trade routes

### Supplier Portal (LIVE)
- [x] Supplier registration form
- [x] Supplier dashboard
- [x] Product management (list + create)
- [x] Order management
- [x] Public supplier directory (`/suppliers`)
- [x] Supplier profile components (hero, tabs, about, products, gallery, reviews)

### Content Pages (LIVE)
- [x] About page
- [x] Journal / Blog (list + detail)
- [x] Contact page with backend (Supabase `contact_submissions` table + API route)
- [x] FAQ page

### Admin Panel (LIVE — Supabase queries)
- [x] Admin dashboard shell
- [x] Brands management (Supabase)
- [x] Products management (Supabase)
- [x] Suppliers page (Supabase)
- [x] Businesses page (Supabase)
- [x] Subscriptions page (Supabase)
- [x] Invoices page (Supabase + RPC)
- [x] Credit page (Supabase + RPC)
- [x] Risk page (Supabase + service functions)

### Wholesale / Business (LIVE — Supabase queries)
- [x] Wholesale application form
- [x] Wholesale dashboard (Supabase)
- [x] Business application, dashboard, invoices, subscription (all Supabase)

### Morocco Trade OS (UI COMPLETE — mock data, no backend)
- [x] Phase 0: Foundation — types, constants, utils
- [x] Phase 1: 13 shared components (badge, card, metric, chart, table, timeline, drawer, etc.)
- [x] Phase 2: App shell (sidebar, topbar, command palette)
- [x] Phase 3: Dashboard (stats, AI summary, alerts, activity feed, quick actions)
- [x] Phase 4: RFQ Engine (list, detail with quote comparison, creation wizard)
- [x] Phase 5: Supplier Discovery (AI search, cards, full profile)
- [x] Phase 6: Price Intelligence (trends, benchmarks, alerts, heatmap)
- [x] Phase 7: Logistics Tracker (shipment list, timeline, route, documents)
- [x] Phase 8: Compliance Vault (score cards, document list, audit trail)
- [x] Phase 9: Deal Negotiation (chat, contract sheet, AI advisor, terms)

### API Routes
- [x] Stripe create-intent (with auth + ownership verification)
- [x] Stripe webhook (with signature verification)
- [x] Order status update (with auth + ownership/admin check)
- [x] Credit health cron (with dual auth: cron secret + admin JWT)
- [x] Contact form submission (with validation)

### Infrastructure (DONE)
- [x] Stripe webhook signature verification
- [x] Environment variable separation (client-safe vs server-only)
- [x] Express server config (`server/config.ts`)
- [x] Express DB connection (`server/db/connection.ts`)
- [x] Express validation middleware (`server/middleware/validation.ts`)
- [x] Email service (Resend provider, order confirmation + shipping + invoice)

### Design System
- [x] Tailwind v4 @theme tokens (sahara, charcoal, imperial, zellige, gold)
- [x] Custom utilities (glass-pillar, gold-shimmer, scrollbar-thin)
- [x] Fonts loaded via next/font (Geist, Geist Mono, Playfair Display)
- [x] Responsive layouts across all modules

### Database
- [x] Supabase schema types (`database.types.ts` — 18 enums, 30+ entities)
- [x] SQL migrations (base tables + supplier tables + risk + products + contact)
- [x] Express API for supplier CRUD with Zod validation

---

## What's Left — TODOs

### Priority 1: Trade OS — Live API Integration

- [ ] **Trade OS API routes** — Create Next.js API routes for all Trade OS operations (RFQs, suppliers, prices, logistics, compliance, deals)
- [ ] **Trade OS database tables** — Create Supabase tables for trade entities (or use existing supplier tables where applicable)
- [ ] **Trade OS mock → live swap** — Replace all 7 `mock-*.ts` files with Supabase queries once tables exist
- [ ] **AI integration** — Connect Trade OS AI features (insights, scoring, strategy) to actual AI service

### Priority 2: Security Hardening

- [ ] **Row-level security (RLS)** — Expand RLS policies for all tables (contact_submissions has RLS, others need audit)
- [ ] **CORS configuration** — Review and lock down CORS for production
- [ ] **API rate limiting** — Add rate limiting to public endpoints (contact form, auth)
- [ ] **Input sanitization audit** — Verify all user inputs are sanitized (XSS prevention)

### Priority 3: UX & Polish

- [ ] **Error boundaries** — No React error boundary. Component crash takes down the app.
- [ ] **Loading skeletons** — Some pages show blank state during data fetch. Add skeleton loaders.
- [ ] **Toast notifications** — Several `// TODO: Show toast notification` comments in supplier components. Implement toast system.
- [ ] **Video player modal** — `GallerySection.tsx:91` has `// TODO: Open video player modal`
- [ ] **SEO metadata** — Add per-page Open Graph / Twitter Card metadata beyond root layout
- [ ] **Image optimization** — Ensure all product/supplier images use `next/image` with proper sizing

### Priority 4: Backend Gaps

- [ ] **Email notification for contact form** — Send admin notification when contact form is submitted
- [ ] **File upload endpoint** — No cloud storage integration (S3/GCP) despite config existing
- [ ] **Email provider production config** — Verify Resend API key and sender domain for production

### Priority 5: Testing & CI/CD

- [ ] **Unit tests** — Zero test coverage. Add tests for services, hooks, and utility functions.
- [ ] **Integration tests** — Test API routes and Supabase queries
- [ ] **E2E tests** — Playwright or Cypress for critical flows (shop, checkout, auth)
- [ ] **CI/CD pipeline** — GitHub Actions for lint, type-check, test, build on PR
- [ ] **Staging environment** — Deploy staging branch to Vercel preview

### Priority 6: Performance

- [ ] **Bundle analysis** — Run `next build --analyze` to identify large chunks
- [ ] **Legacy pages cleanup** — `src/legacy-pages/` (8 files, 244KB+) are not routed but may inflate bundle if imported anywhere
- [ ] **Code splitting** — Verify all Trade OS pages use dynamic imports where appropriate
- [ ] **Database indexing** — Add indexes to frequently queried columns

---

## Known Code TODOs (from source)

| File | Line | TODO |
|------|------|------|
| `server/api/suppliers/controller.ts` | 514 | Add `helpful_count` column for review sorting |
| `server/api/suppliers/controller.ts` | 1132 | Log status change with reason |
| `src/legacy-pages/BuyerMarketplace.tsx` | 115 | Implement product fetch from multiple suppliers |
| `src/components/supplier/SupplierHeroBanner.tsx` | 41 | Show toast notification (favorite) |
| `src/components/supplier/SupplierHeroBanner.tsx` | 115 | Show success toast (share/report) |
| `src/components/supplier/sections/GallerySection.tsx` | 91 | Open video player modal |

---

## Legacy Code Inventory

These files exist from a pre-Next.js SPA architecture. They are **not actively routed** but serve as reference implementations:

| Directory | Files | Total Size | Notes |
|-----------|-------|------------|-------|
| `src/legacy-pages/` | 8 | ~244 KB | B2B marketplace, RFQ, orders, messaging, checkout |
| `src/AppRouter.tsx` | 1 | — | Legacy BrowserRouter config |
| `components/` (root) | ~5 | — | AboutPage, AdminDashboard, etc. |

**Decision needed**: Archive, delete, or migrate remaining useful patterns from legacy pages.

---

## Quick Reference: File Counts by Status

| Status | Count | Description |
|--------|-------|-------------|
| Live (Supabase) | ~35 pages | B2C storefront, auth, supplier, admin, business, wholesale |
| Mock data UI | ~13 pages | Trade OS (7 mock data files, 13 pages) |
| Static content | ~5 pages | About, journal, FAQ |
| API routes | 5 | Stripe (2), orders, cron, contact |
| Legacy (unused) | ~14 files | Pre-Next.js SPA code |
