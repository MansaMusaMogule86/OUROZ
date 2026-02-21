# OUROZ — Discovery

## Problem Statement

Moroccan artisan products — argan oil, handwoven textiles, ceramics, leather goods, spices — are globally in demand but trapped behind fragmented export channels. Small cooperatives and artisan workshops lack direct access to international buyers. Middlemen extract margins. Quality verification is inconsistent. Cross-border trade logistics remain opaque.

OUROZ exists to connect Moroccan suppliers directly with global buyers through a dual-mode marketplace: B2C retail for individual consumers and B2B wholesale for commercial importers — powered by AI-driven discovery and trust verification.

---

## Target Users

### 1. B2C Retail Consumers

- **Profile**: Individuals who value authentic, origin-verified Moroccan products — kitchen accessories, clothing, jewelry, skincare, groceries.
- **Pain Points**: Counterfeit products, unreliable shipping, no way to verify artisan origin.
- **Platform Value**: Curated product catalog with origin certification, AI-powered product discovery (AMUD Engine), visual shopping with Gemini AI image/voice analysis.

### 2. B2B Wholesale Buyers

- **Profile**: Import businesses, specialty retailers, hospitality companies sourcing Moroccan goods at scale.
- **Pain Points**: Finding verified suppliers, negotiating MOQ/pricing, managing RFQ cycles, escrow trust, shipping logistics.
- **Platform Value**: Supplier verification pipeline (identity, business, factory, export license), RFQ system, escrow payments, order lifecycle management, real-time messaging.

### 3. Moroccan Suppliers

- **Profile**: Manufacturers, cooperatives, trading companies, artisans — primarily Morocco-based. Company types: `MANUFACTURER`, `WHOLESALER`, `TRADING_COMPANY`, `COOPERATIVE`, `ARTISAN`.
- **Pain Points**: Visibility to international markets, trust signaling (certifications, export licenses), managing multiple buyer relationships, navigating Incoterms and shipping.
- **Platform Value**: Public supplier profiles with verification badges, product catalog management, quote submission on RFQs, order dashboard, analytics.

### 4. Platform Administrators

- **Profile**: OUROZ operations team managing marketplace integrity.
- **Platform Value**: Admin dashboard for user management, supplier verification, product moderation, dispute resolution, audit logging.

---

## Core Value Proposition

| Dimension | Without OUROZ | With OUROZ |
|-----------|--------------|------------|
| Discovery | Trade fairs, personal networks | AI-powered search, categorized marketplace |
| Trust | Word of mouth | Multi-level verification (UNVERIFIED → BASIC → VERIFIED → GOLD → TRUSTED) |
| Pricing | Email negotiation | Structured RFQ with tiered pricing, MOQ visibility |
| Payment | Wire transfer risk | Escrow with release conditions |
| Logistics | Supplier-managed | Integrated shipping with tracking (sea, air, road, rail, express) |
| Communication | Email, WhatsApp | In-platform messaging tied to orders/RFQs |
| Intelligence | None | Gemini AI for product discovery, image analysis, voice support |

---

## Platform Modes

### Retail Mode (B2C)

- Product browsing by category (Kitchen, Clothing, Accessories, Skincare, Groceries)
- Chef Atelier — curated artisan chef experience
- Cart + checkout flow
- AMUD Vault (wishlist)
- AI Studio — Gemini-powered product exploration

### Wholesale Mode (B2B)

- Gated access — requires buyer/supplier application and approval
- Full marketplace with supplier profiles
- RFQ creation → quote submission → negotiation → order conversion
- Escrow payment system
- Order lifecycle management (13 states: PENDING_PAYMENT → COMPLETED/REFUNDED)
- Real-time messaging per conversation context (buyer-supplier, RFQ, order, support)

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite, TypeScript, TailwindCSS, Framer Motion |
| Backend | Express.js, Node.js, WebSocket (ws) |
| AI | Google Gemini (`@google/genai`) — chat, vision, voice |
| Auth | Firebase Authentication, JWT |
| Database | PostgreSQL via Supabase |
| Search | Elasticsearch (configured, not yet deployed) |
| Cache | Redis (configured, not yet deployed) |
| Storage | AWS S3 / GCP Cloud Storage (configured, not yet deployed) |
| Validation | Zod schemas |

---

## Architectural Direction

- **Dual-mode SPA**: Single React app with `ViewType` state machine routing between B2C and B2B views
- **API-first backend**: Express.js with 200+ defined API endpoints across 15 modules
- **Role-based access**: 7 user roles (GUEST, BUYER, SUPPLIER, ADMIN, SUPER_ADMIN, LOGISTICS_PARTNER, SUPPORT_AGENT)
- **Morocco-specialized**: ICE numbers, Patente, CNSS registration, Moroccan regions, free zone certification, origin certification
- **Multilingual foundation**: Entity fields support EN/AR/FR with RTL layout capability
- **AI-native**: Gemini integrated at the product discovery, chat, voice, and image analysis layers
