# OUROZ — Research & Technical Decisions

---

## 1. Why PostgreSQL via Supabase

### Decision

PostgreSQL as the primary data store, managed through Supabase for auth, storage, and real-time capabilities.

### Reasoning

- **Relational data model fits marketplace domains.** Users have orders. Orders have items. Items reference products. Products belong to suppliers. Suppliers have certifications. These are fixed, queryable relationships.
- **1249-line typed schema** (`src/types/database.types.ts`) defines 30+ entities with 18 enums. This level of type coverage requires a database that enforces schema constraints — not a document store.
- **Morocco-specific compliance fields** (ICE, RC, Patente, CNSS) are mandatory, typed columns — not optional JSON blobs.
- **ACID transactions** matter for escrow. A payment release that updates `Payment`, `EscrowTransaction`, and `Order` simultaneously must either fully commit or fully roll back.
- **Supabase adds** auth (Firebase-compatible), storage (document uploads), and real-time subscriptions without additional infrastructure.

### What Was Rejected

| Alternative | Why Rejected |
|------------|--------------|
| MongoDB | Schema flexibility is a liability for financial/compliance data. No native joins for multi-entity queries. |
| Firebase Firestore | Poor fit for complex relational queries (RFQ → quotes → orders). Costly at B2B query volumes. |
| Raw PostgreSQL (no Supabase) | Would require building auth, storage, and real-time from scratch. |

---

## 2. Why React 19 + Vite + TailwindCSS

### Decision

React 19 with Vite for build tooling and TailwindCSS for styling.

### Reasoning

- **React 19** — Latest stable with improved rendering performance. Component model supports the complex UI hierarchy (30+ view states, nested B2B pages, AI studio, admin panel).
- **Vite** — Sub-second HMR during development. Native ESM. Code splitting via `React.lazy()` already implemented for all B2B marketplace pages.
- **TailwindCSS** — Utility-first CSS with custom design tokens. OUROZ uses a Moroccan-inspired palette (sahara, gold, indigo) and custom animations (`animate-fade-in`, `animate-particle-fly`, `yaz-shimmer`).
- **Framer Motion** — Declarative animation library for page transitions and micro-interactions.

### Trade-offs Accepted

- No SSR or SSG — the app is a client-rendered SPA. SEO for product pages will require prerendering or migration to Next.js in a future phase.
- TailwindCSS class length in complex components (some components exceed 30KB). Mitigated by component decomposition.

---

## 3. Why Express.js Backend (Not Next.js API Routes)

### Decision

Separate Express.js server for the API layer, not embedded in the frontend framework.

### Reasoning

- **API key security.** The Gemini API key must never reach the browser. The Express server acts as a proxy, keeping `GEMINI_API_KEY` server-side only.
- **WebSocket support.** Live audio streaming to Gemini requires a persistent WebSocket connection (`ws://localhost:3001/ws/live-audio`). Express + `ws` library provides this natively.
- **Separation of concerns.** Frontend deploys independently from backend. Different scaling characteristics — frontend is static assets (CDN-cacheable), backend is compute.
- **Existing middleware stack.** JWT auth, role-based authorization, Zod validation — all implemented as Express middleware. Moving to Next.js API routes would require rewriting this layer.

---

## 4. Why Gemini AI Integration

### Decision

Google Gemini (`@google/genai`) as the AI backbone for all intelligent features.

### Reasoning

- **Multi-modal.** Single API for text chat, image analysis, and voice processing. No need for separate vision and NLP models.
- **Grounding.** Gemini responses can include source citations (`GroundingSource` type in `types.ts`), critical for product information accuracy.
- **Two integration points:**
  - **AI Studio** (`components/AI/AIStudio.tsx`) — Full multi-modal interface for product exploration
  - **AMUD Engine** (`components/AI/Assistant.tsx`) — Conversational assistant with wishlist integration
- **Voice Support** (`components/VoiceSupport.tsx`) — Voice-activated product discovery via WebSocket audio streaming through the Express proxy
- **Backend proxy** (`server/routes/ai.ts`, 9729 bytes) — All Gemini calls route through the server to protect the API key

### What Was Rejected

| Alternative | Why Rejected |
|------------|--------------|
| OpenAI GPT-4 | No native multi-modal in single API at equivalent cost. |
| Self-hosted LLM | Operational complexity, GPU costs, model quality gap. |
| No AI | Significant competitive disadvantage in product discovery. |

---

## 5. Why Dual-Mode Architecture (B2B + B2C)

### Decision

Single application with mode switching between retail (B2C) and wholesale (B2B) experiences.

### Reasoning

- **Shared product catalog.** Same Moroccan products served to retail and wholesale buyers, with different pricing visibility (`price_visible_to: 'ALL' | 'REGISTERED' | 'VERIFIED' | 'ON_REQUEST'`).
- **Shared supplier profiles.** A supplier exists once, visible to both retail browsers and wholesale buyers.
- **Gated wholesale access.** B2B mode requires application and approval (`ApplicationStatus: PENDING → APPROVED`). This protects suppliers from unqualified inquiries.
- **Implementation**: `App.tsx` manages mode via `tradeMode` state (`'RETAIL' | 'WHOLESALE'`). Switching triggers navigation to appropriate view (SHOP vs. B2B_MARKETPLACE).

### Trade-offs

- ViewType enum has grown to 30+ states. This is a scaling concern documented in technical debt.
- B2B pages are significantly heavier (RFQSystem alone is 44700 bytes). Lazy loading mitigates initial bundle impact.

---

## 6. Why JWT + Firebase Auth (Hybrid)

### Decision

Firebase for client-side auth (social login, email/password), JWT for server-side API authorization.

### Reasoning

- **Firebase handles** authentication complexity: email verification, password reset, social providers, session management.
- **JWT middleware** (`server/middleware/auth.ts`) validates tokens server-side, loads user from PostgreSQL, checks account status, attaches role information.
- **Three auth middleware variants:**
  - `authenticate` — Required auth. 401 if missing/invalid.
  - `optionalAuth` — Attaches user if token present, continues without if not. Used for public pages where auth enhances (e.g., showing favorite status).
  - `authorize(roles)` — Role check after authentication.
- **Permission matrix** documented inline in `auth.ts` — 20+ action/role combinations for supplier profile operations.

---

## 7. Why Zod for Validation

### Decision

Zod schemas for all request validation on the API layer.

### Reasoning

- **Runtime + compile-time safety.** Zod schemas produce TypeScript types, so validated data flows through typed handlers without casting.
- **Declarative rules.** Rating must be 1–5 integer. Review content 10–2000 chars. Country codes ISO 3166-1 alpha-2. Supplier year 1900–current. All expressed as schema constraints.
- **Middleware pattern.** `validateRequest(schema, target)` middleware runs Zod parse, returns structured errors on failure, attaches validated data to request on success.
- **Consistent error format.** Validation errors produce `AppError` with code `VALIDATION_ERROR` and concatenated field-level messages.

---

## 8. Why Morocco-Specialized Data Model

### Decision

First-class support for Morocco-specific business registration, geographic, and trade data.

### Implementation

| Field | Purpose |
|-------|---------|
| `ice_number` | ICE (Identifiant Commun de l'Entreprise) — mandatory Moroccan business ID |
| `business_registration_number` | RC (Registre de Commerce) |
| `tax_identification_number` | IF (Identifiant Fiscal) |
| `patent_number` | Patente — Moroccan business tax registration |
| `cnss_number` | CNSS (Caisse Nationale de Sécurité Sociale) |
| `region: MoroccanRegion` | 12 typed Moroccan regions (Casablanca-Settat, Marrakech-Safi, Tanger-Tétouan, etc.) |
| `free_zone_certified` | Tangier Free Zone and similar |
| `export_license_number` | Moroccan export license tracking |
| `has_export_license` | Boolean for quick filtering |

### Why This Matters

- **Trust signaling.** A supplier with verified ICE, RC, and export license is demonstrably legitimate. This is the foundation of the verification level system (UNVERIFIED → TRUSTED).
- **Regulatory compliance.** Moroccan B2B trade has specific documentation requirements. The platform must capture and verify these to facilitate compliant cross-border transactions.
- **Competitive moat.** Generic B2B platforms (Alibaba, IndiaMART) treat all suppliers identically. OUROZ's Morocco-first data model creates domain expertise that generalists cannot match.
