# OUROZ B2B Marketplace - Page Architecture Documentation

## Overview

This document outlines all pages in the OUROZ B2B marketplace platform, designed for Moroccan suppliers to connect with global buyers.

---

## Page Inventory

### Public Pages

| # | Page | Path | Component | Purpose |
|---|------|------|-----------|---------|
| 1 | Landing Page | `/` | `LandingPage.tsx` | Entry point, dual CTA for buyers/suppliers |
| 2 | Buyer Marketplace | `/marketplace` | `BuyerMarketplace.tsx` | Product discovery & browsing |
| 3 | Supplier Profile | `/supplier/:id` | `SupplierProfile.tsx` | Public supplier storefront |
| 4 | Product Detail | `/product/:slug` | `ProductDetail.tsx` | Full product information |
| 5 | Category Browse | `/category/:slug` | `CategoryBrowse.tsx` | Category-specific listings |

### Buyer Pages (Authenticated)

| # | Page | Path | Component | Purpose |
|---|------|------|-----------|---------|
| 6 | RFQ System | `/rfq` | `RFQSystem.tsx` | Create/manage RFQs & quotes |
| 7 | Messages | `/messages` | `MessagingSystem.tsx` | Buyer-supplier communication |
| 8 | Orders | `/orders` | `OrderManagement.tsx` | Order tracking & management |
| 9 | Checkout | `/checkout` | `Checkout.tsx` | Purchase flow with Trade Assurance |
| 10 | Buyer Dashboard | `/buyer/dashboard` | `BuyerDashboard.tsx` | Personal buyer overview |
| 11 | Favorites | `/favorites` | `Favorites.tsx` | Saved products & suppliers |
| 12 | Account Settings | `/account` | `AccountSettings.tsx` | Profile & preferences |

### Supplier Pages (Morocco Only)

| # | Page | Path | Component | Purpose |
|---|------|------|-----------|---------|
| 13 | Supplier Dashboard | `/supplier` | `SupplierDashboard.tsx` | Main supplier control center |
| 14 | Product Management | `/supplier/products` | `ProductManagement.tsx` | CRUD for products |
| 15 | RFQ Management | `/supplier/rfq` | `SupplierRFQ.tsx` | View & respond to RFQs |
| 16 | Order Management | `/supplier/orders` | `SupplierOrders.tsx` | Process orders |
| 17 | Analytics | `/supplier/analytics` | `SupplierAnalytics.tsx` | Business insights |
| 18 | Verification | `/supplier/verification` | `Verification.tsx` | Upgrade verification level |
| 19 | Shipment Management | `/supplier/shipping` | `ShippingManagement.tsx` | Track shipments |

### Authentication Pages

| # | Page | Path | Component | Purpose |
|---|------|------|-----------|---------|
| 20 | Login | `/login` | `Login.tsx` | User authentication |
| 21 | Register Buyer | `/register/buyer` | `RegisterBuyer.tsx` | Buyer signup |
| 22 | Register Supplier | `/register/supplier` | `RegisterSupplier.tsx` | Supplier signup (Morocco) |
| 23 | Forgot Password | `/forgot-password` | `ForgotPassword.tsx` | Password recovery |

### Admin Pages

| # | Page | Path | Component | Purpose |
|---|------|------|-----------|---------|
| 24 | Admin Dashboard | `/admin` | `AdminDashboard.tsx` | Platform overview |
| 25 | User Management | `/admin/users` | `UserManagement.tsx` | Manage users |
| 26 | Verification Queue | `/admin/verification` | `VerificationQueue.tsx` | Review supplier applications |
| 27 | Dispute Center | `/admin/disputes` | `DisputeCenter.tsx` | Handle disputes |
| 28 | Analytics | `/admin/analytics` | `AdminAnalytics.tsx` | Platform metrics |

---

## Core Features by Page

### 1. Landing Page (`/`)

**Purpose:** Convert visitors to registered buyers or suppliers

**Sections:**

- Hero with search & Morocco focus
- Trust badges & platform stats
- Featured categories
- Dual CTA cards (Buyer/Supplier)
- Multilingual support (EN/AR/FR)

**API Dependencies:**

- `GET /api/stats/platform`
- `GET /api/categories/featured`
- `GET /api/search/suggestions`

---

### 2. Buyer Marketplace (`/marketplace`)

**Purpose:** Main product discovery interface

**Features:**

- Product grid/list views
- Advanced filtering:
  - Categories & subcategories
  - Moroccan regions
  - Verification levels
  - Price range
  - MOQ range
  - Trade Assurance filter
- Sorting options
- Pagination
- RFQ banner

**API Dependencies:**

- `GET /api/products`
- `GET /api/categories`
- `GET /api/suppliers/regions`

---

### 3. Supplier Profile (`/supplier/:id`)

**Purpose:** Showcase supplier to build buyer trust

**Tabs:**

- About (company description, metrics)
- Products (grid with quick view)
- Gallery (images, factory tour video)
- Reviews (with rating breakdown)

**Sidebar:**

- Business details
- Certifications
- Contact info
- Quick actions (Contact, RFQ)

**API Dependencies:**

- `GET /api/suppliers/:id`
- `GET /api/suppliers/:id/products`
- `GET /api/suppliers/:id/reviews`

---

### 4. Product Detail (`/product/:slug`)

**Purpose:** Complete product information for purchase decision

**Features:**

- Image gallery with zoom
- Price tiers by quantity
- Quantity selector
- Lead time & origin info
- Specification tabs
- Supplier card
- Trade Assurance badge
- Related products

**API Dependencies:**

- `GET /api/products/:slug`
- `GET /api/products/:slug/related`
- `GET /api/suppliers/:id/mini`

---

### 5. RFQ System (`/rfq`)

**Purpose:** Request quotes from multiple suppliers

**Features:**

- Multi-step creation wizard:
  1. Product details
  2. Quantity & budget
  3. Shipping terms
  4. Review & submit
- RFQ list with status filters
- Quote comparison view
- Supplier response tracking

**API Dependencies:**

- `POST /api/rfq`
- `GET /api/rfq`
- `GET /api/rfq/:id/quotes`

---

### 6. Messaging System (`/messages`)

**Purpose:** Secure buyer-supplier communication

**Features:**

- Conversation list
- Real-time chat
- Quote sharing in chat
- Product context banners
- Attachment support
- Supplier verification badges
- RTL support for Arabic

**API Dependencies:**

- `GET /api/messages/conversations`
- `GET /api/messages/:conversationId`
- `POST /api/messages/:conversationId`
- WebSocket for real-time

---

### 7. Order Management (`/orders`)

**Purpose:** Track order lifecycle

**Features:**

- Order list with filters
- Status badges
- Order detail view:
  - Timeline/progress
  - Item list
  - Shipping tracking
  - Payment status
  - Trade Assurance protection
- Actions (confirm receipt, dispute)

**API Dependencies:**

- `GET /api/orders`
- `GET /api/orders/:id`
- `POST /api/orders/:id/confirm`
- `POST /api/orders/:id/dispute`

---

### 8. Checkout (`/checkout`)

**Purpose:** Secure payment with Trade Assurance

**Steps:**

1. Review order
2. Shipping address & Incoterm
3. Payment method selection
4. Confirmation

**Payment Methods:**

- Trade Assurance (recommended)
- Credit Card
- Bank Transfer
- PayPal

**API Dependencies:**

- `POST /api/orders`
- `POST /api/payments/initiate`
- `GET /api/shipping/estimate`

---

### 9. Supplier Dashboard (`/supplier`)

**Purpose:** Morocco-only supplier control center

**Features:**

- Key metrics (orders, revenue, views)
- Pending actions list
- Recent orders table
- Top products
- Top buyer countries
- Verification status banner

**API Dependencies:**

- `GET /api/supplier/dashboard`
- `GET /api/supplier/pending`
- `GET /api/supplier/analytics/summary`

---

## Moroccan Specialization

### Language Support

- **English** - Default for international buyers
- **Arabic** - RTL support, Moroccan dialect
- **French** - Common in Moroccan business

### Verification Levels

1. **Basic** - Email verified
2. **Verified** - Business documents submitted
3. **Gold** - Site inspection completed
4. **Trusted** - Long-term high performance

### Morocco-Specific Features

- Regional filtering (12 regions)
- Origin certificates
- Free zone certification
- Amazigh cultural elements (ⵣ symbol)
- Local phone prefixes (+212)

---

## Trade Assurance

Available on all transactions:

- Payment protection until goods received
- Dispute resolution support
- Quality guarantee compliance
- Full refund for non-delivery

Coverage limits based on supplier level:

- Verified: $50,000
- Gold: $100,000
- Trusted: $500,000

---

## Technical Architecture

### State Management

- React Context for auth/user
- URL params for filters
- Local storage for preferences

### API Structure

- RESTful endpoints
- JWT authentication
- WebSocket for messaging

### Performance

- Lazy loading for images
- Pagination (24 items/page)
- Skeleton loading states
- Service worker caching

---

## Next Steps

1. **Phase 1:** Complete core pages (Landing, Marketplace, Product Detail)
2. **Phase 2:** Authentication & user management
3. **Phase 3:** RFQ & Messaging systems
4. **Phase 4:** Order & Payment flow
5. **Phase 5:** Admin panel
6. **Phase 6:** Analytics & reporting
