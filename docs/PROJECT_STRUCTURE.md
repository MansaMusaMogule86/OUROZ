# OUROZ — Full Project Structure

> **Generated**: 2026-03-10
> **Stack**: Next.js 16 (App Router, Turbopack) · React 19 · TypeScript 5.8 · Tailwind CSS v4 · Supabase · Framer Motion 12
> **Path Alias**: `@/*` → `./src/*`

---

## Directory Tree

```
OUROZ/
├── app/                                    # Next.js App Router pages
│   ├── layout.tsx                          # Root layout (Geist + Geist_Mono fonts, providers)
│   ├── page.tsx                            # Landing page (/)
│   │
│   ├── home/
│   │   └── page.tsx                        # /home alternate landing
│   │
│   ├── shop/                               # B2C Storefront
│   │   ├── layout.tsx                      # Shop layout shell
│   │   ├── page.tsx                        # /shop catalog
│   │   ├── search/
│   │   │   └── page.tsx                    # /shop/search
│   │   └── [categorySlug]/
│   │       └── page.tsx                    # /shop/:category
│   │
│   ├── product/
│   │   ├── layout.tsx                      # Product layout
│   │   └── [productSlug]/
│   │       └── page.tsx                    # /product/:slug detail
│   │
│   ├── cart/
│   │   ├── layout.tsx                      # Cart layout
│   │   └── page.tsx                        # /cart
│   │
│   ├── checkout/
│   │   ├── layout.tsx                      # Checkout layout
│   │   ├── page.tsx                        # /checkout
│   │   └── success/
│   │       └── page.tsx                    # /checkout/success
│   │
│   ├── orders/
│   │   ├── layout.tsx                      # Orders layout
│   │   └── [orderNumber]/
│   │       └── page.tsx                    # /orders/:orderNumber
│   │
│   ├── wishlist/
│   │   └── page.tsx                        # /wishlist
│   │
│   ├── account/
│   │   └── page.tsx                        # /account
│   │
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx                    # /auth/login
│   │   ├── signup/
│   │   │   └── page.tsx                    # /auth/signup
│   │   ├── password-reset/
│   │   │   └── page.tsx                    # /auth/password-reset
│   │   ├── update-password/
│   │   │   └── page.tsx                    # /auth/update-password
│   │   └── callback/
│   │       └── route.ts                    # /auth/callback (Supabase OAuth)
│   │
│   ├── about/
│   │   ├── layout.tsx
│   │   └── page.tsx                        # /about
│   │
│   ├── journal/
│   │   ├── layout.tsx
│   │   ├── page.tsx                        # /journal (blog)
│   │   └── [slug]/
│   │       └── page.tsx                    # /journal/:slug
│   │
│   ├── contact/
│   │   ├── layout.tsx
│   │   └── page.tsx                        # /contact
│   │
│   ├── faq/
│   │   ├── layout.tsx
│   │   └── page.tsx                        # /faq
│   │
│   ├── suppliers/
│   │   └── page.tsx                        # /suppliers directory
│   │
│   ├── supplier/                           # Supplier Portal
│   │   ├── layout.tsx                      # Supplier dashboard layout
│   │   ├── register/
│   │   │   └── page.tsx                    # /supplier/register
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # /supplier/dashboard
│   │   ├── products/
│   │   │   ├── page.tsx                    # /supplier/products
│   │   │   └── new/
│   │   │       └── page.tsx               # /supplier/products/new
│   │   └── orders/
│   │       └── page.tsx                    # /supplier/orders
│   │
│   ├── wholesale/                          # Wholesale Buyer
│   │   ├── apply/
│   │   │   └── page.tsx                    # /wholesale/apply
│   │   └── dashboard/
│   │       └── page.tsx                    # /wholesale/dashboard
│   │
│   ├── business/                           # Business (B2B)
│   │   ├── apply/
│   │   │   └── page.tsx                    # /business/apply
│   │   ├── dashboard/
│   │   │   └── page.tsx                    # /business/dashboard
│   │   ├── invoices/
│   │   │   └── page.tsx                    # /business/invoices
│   │   ├── subscription/
│   │   │   └── page.tsx                    # /business/subscription
│   │   └── checkout/
│   │       ├── page.tsx                    # /business/checkout
│   │       └── success/
│   │           └── page.tsx               # /business/checkout/success
│   │
│   ├── admin/                              # Admin Panel
│   │   ├── layout.tsx                      # Admin sidebar layout
│   │   ├── page.tsx                        # /admin dashboard
│   │   ├── brands/
│   │   │   └── page.tsx                    # /admin/brands
│   │   ├── products/
│   │   │   └── page.tsx                    # /admin/products
│   │   ├── suppliers/
│   │   │   └── page.tsx                    # /admin/suppliers
│   │   ├── businesses/
│   │   │   └── page.tsx                    # /admin/businesses
│   │   ├── subscriptions/
│   │   │   └── page.tsx                    # /admin/subscriptions
│   │   ├── invoices/
│   │   │   └── page.tsx                    # /admin/invoices
│   │   ├── credit/
│   │   │   └── page.tsx                    # /admin/credit
│   │   └── risk/
│   │       └── page.tsx                    # /admin/risk
│   │
│   ├── trade/                              # Morocco Trade OS (B2B Sourcing)
│   │   ├── layout.tsx                      # Trade shell (sidebar + topbar + cmd palette)
│   │   ├── page.tsx                        # /trade — Command Center dashboard
│   │   ├── rfq/
│   │   │   ├── page.tsx                    # /trade/rfq — RFQ list
│   │   │   ├── new/
│   │   │   │   └── page.tsx               # /trade/rfq/new — Creation wizard
│   │   │   └── [id]/
│   │   │       └── page.tsx               # /trade/rfq/:id — Detail + quotes
│   │   ├── suppliers/
│   │   │   ├── page.tsx                    # /trade/suppliers — AI discovery
│   │   │   └── [id]/
│   │   │       └── page.tsx               # /trade/suppliers/:id — Profile
│   │   ├── prices/
│   │   │   └── page.tsx                    # /trade/prices — Market intelligence
│   │   ├── logistics/
│   │   │   ├── page.tsx                    # /trade/logistics — Shipment list
│   │   │   └── [id]/
│   │   │       └── page.tsx               # /trade/logistics/:id — Tracking
│   │   ├── compliance/
│   │   │   └── page.tsx                    # /trade/compliance — Vault
│   │   └── deals/
│   │       ├── page.tsx                    # /trade/deals — Active deals
│   │       └── [id]/
│   │           └── page.tsx               # /trade/deals/:id — Deal room
│   │
│   └── api/                                # API Routes
│       ├── stripe/
│       │   ├── create-intent/
│       │   │   └── route.ts               # POST /api/stripe/create-intent
│       │   └── webhook/
│       │       └── route.ts               # POST /api/stripe/webhook
│       ├── orders/
│       │   └── [id]/
│       │       └── status/
│       │           └── route.ts           # PATCH /api/orders/:id/status
│       └── admin/
│           └── cron/
│               └── credit-health/
│                   └── route.ts           # POST /api/admin/cron/credit-health
│
├── src/
│   ├── types/                              # TypeScript Interfaces
│   │   ├── database.types.ts              # Supabase auto-generated schema (18 enums, 30+ entities)
│   │   ├── product.types.ts               # ProductCardData, CartItem, etc.
│   │   ├── supplier.ts                    # SupplierProfile, Review, etc.
│   │   ├── business.ts                    # Business account types
│   │   └── trade.ts                       # Trade OS types (RFQ, Supplier, Deal, etc.)
│   │
│   ├── lib/                                # Utilities & Data
│   │   ├── supabase.ts                    # Supabase client init
│   │   ├── api.ts                         # API helper functions
│   │   ├── shop-queries.ts                # Supabase shop queries
│   │   ├── pricing.ts                     # Pricing calculation utils
│   │   ├── demo-data.ts                   # B2C demo/seed data
│   │   └── trade/                         # Trade OS module
│   │       ├── trade-constants.ts         # Nav config, status maps, color maps
│   │       ├── trade-utils.ts             # Formatters (currency, dates, weights)
│   │       ├── mock-data.ts               # Dashboard aggregates, AI insights
│   │       ├── mock-rfqs.ts               # 5 RFQs with quotes
│   │       ├── mock-suppliers.ts          # 8 Moroccan supplier profiles
│   │       ├── mock-prices.ts             # 12 products, 12 months history
│   │       ├── mock-shipments.ts          # 4 active shipments with milestones
│   │       ├── mock-compliance.ts         # 8 compliance records
│   │       └── mock-deals.ts              # 3 deals with chat + terms
│   │
│   ├── contexts/                           # React Context Providers
│   │   ├── LangContext.tsx                # i18n language context (en/ar/fr)
│   │   └── CartContext.tsx                # Shopping cart state
│   │
│   ├── hooks/                              # Custom React Hooks
│   │   ├── useSupplier.ts                 # Supplier data fetching
│   │   ├── useCart.ts                      # Cart operations
│   │   ├── useProducts.ts                 # Product queries
│   │   ├── useUserRole.ts                 # Role detection
│   │   └── useWholesaleStatus.ts          # Wholesale approval status
│   │
│   ├── services/                           # Business Logic Services
│   │   ├── pricingService.ts              # Tier pricing calculations
│   │   ├── subscriptionService.ts         # Subscription management
│   │   ├── supplierService.ts             # Supplier CRUD
│   │   ├── riskService.ts                 # Risk assessment
│   │   ├── creditService.ts               # Credit scoring
│   │   ├── emailService.ts                # Email notifications
│   │   └── paymentService.ts              # Payment processing
│   │
│   ├── config/                             # Configuration
│   │   ├── database.ts                    # DB connection config
│   │   └── api.routes.ts                  # 200+ API endpoint definitions
│   │
│   ├── components/
│   │   ├── HomepageClient.tsx             # Homepage client component
│   │   ├── BrandEntryClient.tsx           # Brand entry animation
│   │   ├── Header.tsx                     # Site header
│   │   ├── Navbar.tsx                     # Navigation bar
│   │   ├── Footer.tsx                     # Site footer
│   │   │
│   │   ├── ui/                            # Shared UI primitives
│   │   │   ├── SharedComponents.tsx       # Buttons, inputs, etc.
│   │   │   ├── LoadingState.tsx           # Loading spinner
│   │   │   └── ErrorState.tsx             # Error display with retry
│   │   │
│   │   ├── shop/                          # B2C Shop Components
│   │   │   ├── ShopClientShell.tsx        # Shop layout wrapper
│   │   │   ├── SearchBar.tsx              # Product search
│   │   │   ├── ShopFilters.tsx            # Category/price filters
│   │   │   ├── ShopTabs.tsx               # Tab navigation
│   │   │   ├── CategoryCard.tsx           # Category card
│   │   │   ├── CategoryShowcase.tsx       # Category showcase grid
│   │   │   ├── ProductGallery.tsx         # Product image gallery
│   │   │   ├── PriceBlock.tsx             # Price display (retail/wholesale)
│   │   │   ├── TierPricingTable.tsx       # Wholesale tier pricing
│   │   │   ├── AddToCartButton.tsx        # Add to cart CTA
│   │   │   ├── QuantitySelector.tsx       # Quantity +/- control
│   │   │   ├── CartDrawer.tsx             # Slide-out cart panel
│   │   │   ├── CartIconButton.tsx         # Cart icon with badge
│   │   │   ├── WholesaleGate.tsx          # Wholesale access gate
│   │   │   ├── BrandTicker.tsx            # Scrolling brand ticker
│   │   │   ├── LanguageSwitcher.tsx       # EN/AR/FR switcher
│   │   │   └── Pagination.tsx             # Page navigation
│   │   │
│   │   ├── supplier/                      # Supplier Profile Components
│   │   │   ├── SupplierProfilePage.tsx    # Main page container
│   │   │   ├── SupplierHeroBanner.tsx     # Hero banner + actions
│   │   │   ├── SupplierProfileHeader.tsx  # Logo, name, badges
│   │   │   ├── SupplierTabs.tsx           # Tab navigation
│   │   │   ├── sections/
│   │   │   │   ├── AboutSection.tsx       # Company overview
│   │   │   │   ├── ProductsSection.tsx    # Product grid
│   │   │   │   ├── GallerySection.tsx     # Photo/video gallery
│   │   │   │   └── ReviewsSection.tsx     # Reviews + ratings
│   │   │   └── cards/
│   │   │       ├── BusinessDetailsCard.tsx # Business info sidebar
│   │   │       ├── CertificationsCard.tsx  # Certs sidebar
│   │   │       └── ContactCard.tsx         # Contact sidebar
│   │   │
│   │   └── trade/                         # Morocco Trade OS Components
│   │       ├── shared/                    # 13 reusable primitives
│   │       │   ├── index.ts               # Barrel export
│   │       │   ├── TradeBadge.tsx         # Status badge (6 variants)
│   │       │   ├── TradeCard.tsx          # Card + header + title
│   │       │   ├── TradeMetric.tsx        # Metric with change indicator
│   │       │   ├── TradeProgressBar.tsx   # Auto-color progress bar
│   │       │   ├── TradeScoreRing.tsx     # SVG circular score
│   │       │   ├── TradeAIInsight.tsx     # Gold-border AI card
│   │       │   ├── TradeEmptyState.tsx    # Empty state
│   │       │   ├── TradeTabs.tsx          # Tab bar with counts
│   │       │   ├── TradeFilter.tsx        # Dropdown + pill filters
│   │       │   ├── TradeTable.tsx         # Generic typed table
│   │       │   ├── TradeTimeline.tsx      # Timeline (vertical/horizontal)
│   │       │   ├── TradeChart.tsx         # Pure CSS/SVG charts (line/bar/donut)
│   │       │   └── TradeDrawer.tsx        # Slide-out drawer
│   │       │
│   │       ├── shell/                     # App shell
│   │       │   ├── TradeSidebar.tsx       # Dark sidebar with ⵣ logo
│   │       │   ├── TradeTopBar.tsx        # Breadcrumbs + search trigger
│   │       │   └── TradeCommandPalette.tsx # Cmd+K search overlay
│   │       │
│   │       ├── dashboard/                 # Dashboard components
│   │       │   ├── DashboardStats.tsx     # 6-card stats grid
│   │       │   ├── DashboardAISummary.tsx # AI intelligence feed
│   │       │   ├── DashboardAlerts.tsx    # Active alerts
│   │       │   ├── DashboardActivityFeed.tsx # Activity timeline
│   │       │   └── DashboardQuickActions.tsx # Quick action cards
│   │       │
│   │       ├── rfq/                       # RFQ Engine components
│   │       │   ├── RFQQuoteCard.tsx       # Quote card with AI score
│   │       │   └── RFQComparisonTable.tsx # Side-by-side comparison
│   │       │
│   │       └── suppliers/                 # Supplier Discovery components
│   │           └── SupplierCard.tsx       # Supplier card with match ring
│   │
│   ├── legacy-pages/                      # Pre-Next.js SPA pages (reference only)
│   │   ├── LandingPage.tsx                # Original landing page
│   │   ├── BuyerMarketplace.tsx           # B2B marketplace
│   │   ├── SupplierProfile.tsx            # Supplier profiles
│   │   ├── SupplierDashboard.tsx          # Supplier management
│   │   ├── ProductDetail.tsx              # B2B product detail
│   │   ├── RFQSystem.tsx                  # RFQ lifecycle
│   │   ├── OrderManagement.tsx            # Order management
│   │   ├── MessagingSystem.tsx            # Messaging
│   │   └── Checkout.tsx                   # Escrow checkout
│   │
│   └── AppRouter.tsx                      # Legacy SPA router (reference)
│
├── components/                             # Root-level components (legacy)
│   ├── AboutPage.tsx
│   ├── AdminDashboard.tsx
│   └── ... (other legacy components)
│
├── server/                                 # Express Backend
│   ├── db/
│   │   └── migrations/
│   │       ├── 000_base_tables.sql        # Users, categories, orders
│   │       └── 001_supplier_profile_tables.sql # Supplier ecosystem
│   ├── api/
│   │   └── suppliers/
│   │       ├── routes.ts                  # REST endpoints
│   │       ├── controller.ts              # Business logic
│   │       └── schemas.ts                 # Zod validation
│   ├── middleware/
│   │   └── auth.ts                        # JWT + role-based auth
│   └── utils/
│       └── errors.ts                      # AppError class
│
├── ouroz-engine/                           # Original Next.js scaffold
│   └── src/app/
│       ├── globals.css                    # Design system tokens (@theme)
│       └── layout.tsx                     # Engine layout (Inter + Playfair)
│
├── docs/                                   # Documentation
│   ├── PROJECT_STRUCTURE.md               # This file
│   ├── TODO.md                            # Actionable TODO list
│   ├── FILE_STRUCTURE.md                  # Supplier profile file tree
│   ├── EDGE_CASES.md                      # Edge case handling
│   ├── SHOP_SETUP.md                      # Shop setup guide
│   ├── progress.md                        # Development progress tracker
│   ├── plan.md                            # Architecture plan
│   ├── discovery.md                       # Discovery notes
│   ├── research.md                        # Research notes
│   ├── build-audit.md                     # Build audit results
│   ├── missing-items-fixed.md             # Bug fixes log
│   ├── README.md                          # Docs index
│   ├── pages/
│   │   ├── INDEX.md                       # Page index
│   │   └── 01-landing-page.md             # Landing page spec
│   └── images/                            # Reference screenshots
│
├── public/                                 # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts (if present)
└── postcss.config.mjs (in ouroz-engine/)
```

---

## Module Inventory

### 1. B2C Storefront (LIVE — Supabase)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/` | Done | Static + demo data |
| `/home` | Done | Static |
| `/shop` | Done | Supabase (live) |
| `/shop/search` | Done | Supabase queries |
| `/shop/:category` | Done | Supabase queries |
| `/product/:slug` | Done | Supabase queries |
| `/cart` | Done | CartContext (client state) |
| `/checkout` | Done | Static form |
| `/checkout/success` | Done | Static |
| `/wishlist` | Done | localStorage |
| `/account` | Done | Supabase auth |
| `/about` | Done | Static |
| `/journal` | Done | Static/demo |
| `/journal/:slug` | Done | Static/demo |
| `/contact` | Done | Static (form not wired) |
| `/faq` | Done | Static |

### 2. Auth System (LIVE — Supabase)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/auth/login` | Done | Supabase Auth |
| `/auth/signup` | Done | Supabase Auth |
| `/auth/password-reset` | Done | Supabase Auth |
| `/auth/update-password` | Done | Supabase Auth |
| `/auth/callback` | Done | Supabase OAuth callback |

### 3. Supplier Portal (PARTIAL — Supabase + Mock)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/suppliers` | Done | Supabase |
| `/supplier/register` | Done | Form (Supabase write) |
| `/supplier/dashboard` | Done | Supabase |
| `/supplier/products` | Done | Supabase |
| `/supplier/products/new` | Done | Form (Supabase write) |
| `/supplier/orders` | Done | Supabase |

### 4. Wholesale / Business (PARTIAL — Mock heavy)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/wholesale/apply` | Done | Form (mock submit) |
| `/wholesale/dashboard` | Done | Mock data |
| `/business/apply` | Done | Form |
| `/business/dashboard` | Done | Mock data |
| `/business/invoices` | Done | Mock data |
| `/business/subscription` | Done | Mock data |
| `/business/checkout` | Done | Mock data |

### 5. Admin Panel (PARTIAL — Mock heavy)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/admin` | Done | Mock data |
| `/admin/brands` | Done | Supabase |
| `/admin/products` | Done | Supabase |
| `/admin/suppliers` | Done | Mock data |
| `/admin/businesses` | Done | Mock data |
| `/admin/subscriptions` | Done | Mock data |
| `/admin/invoices` | Done | Mock data |
| `/admin/credit` | Done | Mock data |
| `/admin/risk` | Done | Mock data |

### 6. Morocco Trade OS (COMPLETE — Mock data, all 9 phases)
| Route | Status | Data Source |
|-------|--------|-------------|
| `/trade` | Done | Mock data |
| `/trade/rfq` | Done | Mock data (5 RFQs) |
| `/trade/rfq/new` | Done | Form wizard (mock) |
| `/trade/rfq/:id` | Done | Mock data |
| `/trade/suppliers` | Done | Mock data (8 suppliers) |
| `/trade/suppliers/:id` | Done | Mock data |
| `/trade/prices` | Done | Mock data (12 products) |
| `/trade/logistics` | Done | Mock data (4 shipments) |
| `/trade/logistics/:id` | Done | Mock data |
| `/trade/compliance` | Done | Mock data (8 records) |
| `/trade/deals` | Done | Mock data (3 deals) |
| `/trade/deals/:id` | Done | Mock data |

### 7. API Routes
| Route | Status | Notes |
|-------|--------|-------|
| `POST /api/stripe/create-intent` | Done | Stripe payment intent |
| `POST /api/stripe/webhook` | Done | Stripe webhook handler |
| `PATCH /api/orders/:id/status` | Done | Order status updates |
| `POST /api/admin/cron/credit-health` | Done | Credit health cron |

---

## Design System

### Colors (`globals.css` @theme tokens)
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-sahara` | `#F5E6D3` | Primary background |
| `--color-charcoal` | `#1A1A1A` | Primary text |
| `--color-imperial` | `#9B1B30` | Accent, CTAs, alerts |
| `--color-zellige` | `#006644` | Success, Morocco green |
| `--color-gold` | `#D4AF37` | Premium accents, AI cards |
| `--color-parchment` | `#FAF6F1` | Content backgrounds (Trade OS) |
| `--color-clay` | `#C4A882` | Muted accents |
| `--color-ink` | `#0D0D0D` | Dark UI (sidebars) |

### Fonts
| Font | Variable | Usage |
|------|----------|-------|
| Geist | `--font-sans` | Body text (loaded via next/font) |
| Geist Mono | `--font-mono` | Code/data |
| Playfair Display | `--font-serif` | Headings, brand elements |
| Montserrat | — | UI labels, nav (9-10px uppercase tracking) |

### Custom Utilities
| Class | Effect |
|-------|--------|
| `glass-pillar` | Frosted glass with blur + border |
| `gold-shimmer` | Animated gold gradient sweep |
| `scrollbar-thin` | Thin native scrollbar |

---

## Technology Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16 (App Router) |
| Runtime | React | 19 |
| Language | TypeScript | 5.8 |
| Styling | Tailwind CSS | v4 |
| Database | Supabase (PostgreSQL) | — |
| Animation | Framer Motion | 12 |
| Payments | Stripe | — |
| Bundler | Turbopack | (Next.js built-in) |

---

## File Count Summary

| Module | Files |
|--------|-------|
| App Router pages | ~75 |
| Components (`src/components/`) | ~55 |
| Trade OS components | ~25 |
| Trade OS mock data | 7 |
| Services | 7 |
| Hooks | 5 |
| Types | 5 |
| Lib utilities | 5 |
| API routes | 4 |
| Server (Express legacy) | ~8 |
| Legacy pages | 8 |
| Documentation | ~15 |
| **Total** | **~220+** |
