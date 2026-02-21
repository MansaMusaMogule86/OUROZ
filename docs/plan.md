# OUROZ — Execution Plan

---

## Phase 1: Platform Foundation

**Objective**: Establish core frontend framework, design system, and basic navigation.

**Status**: ✅ Complete

**What Was Delivered**:

- React 19 + Vite + TypeScript project setup
- TailwindCSS with custom Moroccan design tokens (sahara, gold, indigo)
- Framer Motion integration
- `App.tsx` with ViewType state machine (30+ views)
- `Navigation.tsx` with mode toggle (Retail/Wholesale)
- Landing page with shop/trade entry points
- Firebase SDK integration

**Dependencies**: None (greenfield)

**Risks**: None (resolved)

**Next Action**: None — complete.

---

## Phase 2: B2C Storefront

**Objective**: Build the retail shopping experience with product catalog, categories, cart, and checkout.

**Status**: ✅ Complete

**What Was Delivered**:

- `B2CStorefront` — product browsing with category navigation
- `CategoryPage` — filtered views for Kitchen, Clothing, Accessories, Skincare, Groceries
- `ProductDetailPage` — full product view with add-to-cart
- `CartPage` — cart management with quantity controls
- AMUD Vault (wishlist) with localStorage persistence
- `ChefAtelier` — curated artisan chef experience page
- `AboutPage`, `AccountPage`

**Dependencies**: Phase 1

**Risks**: None (resolved)

**Next Action**: None — complete.

---

## Phase 3: AI Integration

**Objective**: Integrate Gemini AI for product discovery, chat, voice, and image analysis.

**Status**: ✅ Complete

**What Was Delivered**:

- `AIStudio.tsx` (10830 bytes) — multi-modal AI interface
- `Assistant.tsx` / AMUD Engine (15496 bytes) — conversational AI with wishlist integration
- `VoiceSupport.tsx` (8321 bytes) — voice-activated support
- `server/routes/ai.ts` (9729 bytes) — backend Gemini proxy
- `server/routes/liveAudio.ts` (4379 bytes) — WebSocket audio streaming
- `services/geminiService.ts` (4554 bytes) — Gemini API wrapper
- `GroundingSource` type for citation support

**Dependencies**: Phase 1, Gemini API key

**Risks**: None (resolved)

**Next Action**: None — complete.

---

## Phase 4: B2B Marketplace

**Objective**: Build the wholesale marketplace with supplier profiles, RFQ, orders, messaging, and payment.

**Status**: ✅ Complete (Frontend)

**What Was Delivered**:

- `BuyerMarketplace.tsx` (37815 bytes) — supplier/product discovery
- `SupplierProfile.tsx` (27770 bytes) — public profiles with gallery, reviews, certifications
- `SupplierDashboard.tsx` (29743 bytes) — supplier management interface
- `ProductDetail.tsx` (34261 bytes) — B2B product pages with MOQ, tiered pricing
- `RFQSystem.tsx` (44700 bytes) — RFQ creation, quote management, negotiation
- `OrderManagement.tsx` (31276 bytes) — order lifecycle (13 states)
- `MessagingSystem.tsx` (22456 bytes) — contextual messaging
- `Checkout.tsx` (36306 bytes) — payment with escrow
- B2B components: `NegotiationRoom`, `RFQBuilder`, `VerificationWorkflow`, `Dashboard`

**Dependencies**: Phase 1

**Risks**:

- All pages use inline mock data. No live API integration.
- Props hardcoded (`supplierId="demo"`, `userId="demo"`)

**Next Action**: Connect to backend API once database layer is operational.

---

## Phase 5: Database Schema + Backend API

**Objective**: Implement PostgreSQL schema, connection pool, and Express API endpoints.

**Status**: 🟡 Partially Complete

**What Was Delivered**:

- Database type system — `database.types.ts` (1249 lines, 30+ entities, 18 enums)
- Database migrations — `000_base_tables.sql`, `001_supplier_profile_tables.sql`
- Database config — `src/config/database.ts` (PostgreSQL, Elasticsearch, Redis, S3)
- API route definitions — `src/config/api.routes.ts` (200+ endpoints)
- Supplier API — `server/api/suppliers/` (routes, controller, schemas)
- Express server — `server/index.ts` with CORS, health check, AI routes

**What Is Missing**:

- `server/db/connection.ts` — PostgreSQL connection pool (imported by auth.ts but not created)
- `server/middleware/validation.ts` — request validation middleware
- `server/config.ts` — environment configuration
- `src/utils/api.ts` — frontend API client
- `src/contexts/AuthContext.tsx` — React auth context
- Elasticsearch deployment
- Redis deployment
- S3/GCP storage deployment

**Dependencies**: PostgreSQL/Supabase instance

**Risks**:

- Auth middleware imports non-existent `db/connection.ts` — backend crashes on authenticated routes
- No frontend API client — B2B pages cannot call backend

**Next Action**: Create `server/db/connection.ts` and `src/contexts/AuthContext.tsx`.

---

## Phase 6: Auth + Security Hardening

**Objective**: Complete authentication flow and enforce role-based access.

**Status**: 🟡 Partially Complete

**What Was Delivered**:

- JWT middleware — `authenticate`, `optionalAuth`, `authorize(roles)` in `server/middleware/auth.ts`
- Permission matrix — 20+ action/role combinations documented in-code
- User roles — GUEST, BUYER, SUPPLIER, ADMIN, SUPER_ADMIN, LOGISTICS_PARTNER, SUPPORT_AGENT
- Zod validation schemas — `server/api/suppliers/schemas.ts`
- Error handling — `AppError` class with factories in `server/utils/errors.ts`
- Edge case handling documented — missing data, unauthorized access, invalid input, abuse prevention, rate limiting

**What Is Missing**:

- `ProtectedRoute` HOC — defined as comment in `AppRouter.tsx` (lines 82–96) but not implemented
- `AuthContext.tsx` — no frontend auth state management
- Route protection enforcement — `protected`, `buyerOnly`, `supplierOnly` flags defined but not enforced
- Row-level security (RLS) in Supabase
- Rate limiting implementation (documented in `EDGE_CASES.md` but not coded)

**Dependencies**: Phase 5 (database connection)

**Risks**:

- All routes currently accessible without authentication
- Frontend auth is simulated via `App.tsx` useState

**Next Action**: Implement `AuthContext.tsx` and `ProtectedRoute` HOC.

---

## Phase 7: Admin Panel

**Objective**: Build admin dashboard for marketplace operations.

**Status**: 🟡 Partially Complete

**What Was Delivered**:

- `AdminDashboard.tsx` (4103 bytes) — basic admin interface
- Admin API routes defined (dashboard, users, suppliers, products, orders, disputes, reports, verification, settings, audit-log)
- `AdminAuditLog` entity type — action tracking
- `PlatformSetting` entity type — configuration storage
- `ReportedContent` entity type — moderation
- Admin role in auth middleware

**What Is Missing**:

- Admin API endpoint implementations (routes defined, not implemented)
- User management UI
- Supplier verification workflow (backend)
- Dispute resolution UI
- Analytics dashboards
- Audit log viewer

**Dependencies**: Phase 5, Phase 6

**Risks**: Basic admin shell exists but lacks operational capability

**Next Action**: Implement admin API endpoints for user and supplier management.

---

## Phase 8: Search + Discovery

**Objective**: Full-text search across products and suppliers with faceted filtering.

**Status**: 🔴 Not Started

**Scope**:

- Deploy Elasticsearch instance
- Index products (`ProductSearchDocument`) and suppliers (`SupplierSearchDocument`) — schemas defined in `database.types.ts`
- Implement search API endpoints (`/search/products`, `/search/suppliers`, `/search/suggestions`, `/search/trending`)
- Build frontend search UI with faceted filters (category, region, verification level, price range)
- Index sync pipeline — PostgreSQL → Elasticsearch on entity mutations

**Dependencies**: Phase 5 (database), Elasticsearch deployment

**Risks**: Elasticsearch operational overhead. Alternative: PostgreSQL full-text search as interim solution.

**Next Action**: Evaluate PostgreSQL `tsvector` as interim search before committing to Elasticsearch.

---

## Phase 9: Payments + Escrow

**Objective**: Production payment processing with escrow for B2B trade assurance.

**Status**: 🔴 Not Started

**Scope**:

- Payment gateway integration (Stripe, PayPal, wire transfer)
- Escrow implementation — fund, hold, conditional release, dispute, refund
- Payment API endpoints (defined in `api.routes.ts`: initiate, confirm, status, release, refund)
- Escrow API endpoints (create, fund, release, dispute, status)
- Transaction lifecycle tied to order status machine
- Currency handling via `Currency` enum (USD, EUR, MAD, AED, GBP, SAR)

**Dependencies**: Phase 5, Phase 6, payment gateway accounts

**Risks**: Financial compliance requirements. PCI DSS for card handling. Moroccan banking regulations for MAD transactions.

**Next Action**: Select payment gateway. Define escrow flow state machine.

---

## Phase 10: Shipping + Logistics

**Objective**: Integrated shipping with tracking, customs documentation, and logistics partner management.

**Status**: 🔴 Not Started

**Scope**:

- Logistics partner onboarding (entity defined: `LogisticsPartner`)
- Shipping methods: sea, air, road, rail, express, multimodal
- Shipment tracking with events (`TrackingEvent`)
- Customs status tracking (PENDING → IN_PROGRESS → CLEARED → HELD)
- Shipping document management (bill of lading, certificate of origin, customs forms)
- Container management for sea freight (20FT, 40FT, 40FT_HC, LCL)
- Incoterms support (EXW, FOB, CIF, CFR, DDP, DAP, FCA, CPT, CIP)
- Shipping API endpoints (quote, create, track, documents, partners)

**Dependencies**: Phase 5, Phase 9 (payments), logistics partner APIs

**Risks**: External API reliability. Customs clearance variability by destination country.

**Next Action**: Identify initial logistics partner integrations for Morocco → EU/US corridors.
