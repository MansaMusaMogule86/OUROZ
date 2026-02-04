# OUROZ Supplier Profile - File Structure

## Complete Directory Tree

```
OUROZ/
├── docs/
│   ├── EDGE_CASES.md                    # Edge case handling documentation
│   └── FILE_STRUCTURE.md                # This file
│
├── server/
│   ├── db/
│   │   ├── connection.ts                # Database connection pool (to create)
│   │   └── migrations/
│   │       ├── 000_base_tables.sql      # Users, categories, orders base tables
│   │       └── 001_supplier_profile_tables.sql  # Supplier-specific tables
│   │
│   ├── api/
│   │   └── suppliers/
│   │       ├── routes.ts                # Express router with all endpoints
│   │       ├── controller.ts            # Request handlers with business logic
│   │       └── schemas.ts               # Zod validation schemas
│   │
│   ├── middleware/
│   │   ├── auth.ts                      # Authentication & authorization middleware
│   │   └── validation.ts                # Request validation middleware (to create)
│   │
│   └── utils/
│       └── errors.ts                    # Custom error classes & error handler
│
└── src/
    ├── types/
    │   └── supplier.ts                  # TypeScript interfaces & types
    │
    ├── hooks/
    │   └── useSupplier.ts               # React hooks for data fetching
    │
    └── components/
        ├── ui/
        │   ├── LoadingState.tsx         # Full-page loading spinner
        │   ├── ErrorState.tsx           # Full-page error with retry
        │   └── SharedComponents.tsx     # Existing shared UI components
        │
        └── supplier/
            ├── SupplierProfilePage.tsx  # Main page container component
            ├── SupplierHeroBanner.tsx   # Banner with floating actions
            ├── SupplierProfileHeader.tsx # Logo, name, badges, CTAs
            ├── SupplierTabs.tsx         # Animated tab navigation
            │
            ├── sections/
            │   ├── AboutSection.tsx     # Company overview, metrics, export markets
            │   ├── ProductsSection.tsx  # Product grid with sorting/pagination
            │   ├── GallerySection.tsx   # Photo/video gallery with lightbox
            │   └── ReviewsSection.tsx   # Reviews list with filtering
            │
            └── cards/
                ├── BusinessDetailsCard.tsx   # Sidebar business info
                ├── CertificationsCard.tsx    # Sidebar certifications list
                └── ContactCard.tsx           # Sidebar contact information
```

---

## File Descriptions

### Database (`server/db/`)

| File | Description |
|------|-------------|
| `migrations/000_base_tables.sql` | Base schema: users, categories, orders tables required as foreign keys |
| `migrations/001_supplier_profile_tables.sql` | All supplier-related tables: suppliers, certifications, gallery, reviews, products, favorites, reports |

### API (`server/api/suppliers/`)

| File | Description |
|------|-------------|
| `routes.ts` | Defines all REST endpoints with their HTTP methods, authentication requirements, and connects to controller functions |
| `controller.ts` | Contains business logic for each endpoint - database queries, data transformation, error handling |
| `schemas.ts` | Zod validation schemas for request bodies and query parameters |

### Middleware (`server/middleware/`)

| File | Description |
|------|-------------|
| `auth.ts` | JWT verification, user session loading, role-based authorization, includes full permission matrix documentation |

### Utilities (`server/utils/`)

| File | Description |
|------|-------------|
| `errors.ts` | AppError class, predefined error factories, Express error handling middleware |

### Types (`src/types/`)

| File | Description |
|------|-------------|
| `supplier.ts` | All TypeScript interfaces: SupplierProfile, Review, Product, etc. Shared between components and hooks |

### Hooks (`src/hooks/`)

| File | Description |
|------|-------------|
| `useSupplier.ts` | Custom React hooks: useSupplierProfile, useSupplierProducts, useSupplierReviews, useSupplierGallery, useSupplierActions |

### Components (`src/components/`)

| File | Description |
|------|-------------|
| `ui/LoadingState.tsx` | Centered spinner with optional message for loading states |
| `ui/ErrorState.tsx` | Error display with icon, message, and retry button |
| `supplier/SupplierProfilePage.tsx` | Main orchestrating component - fetches data, manages tabs, renders sections |
| `supplier/SupplierHeroBanner.tsx` | Full-width banner image with favorite, share, report buttons + ReportModal |
| `supplier/SupplierProfileHeader.tsx` | Company logo, name, verification badges, quick stats, Contact/RFQ buttons |
| `supplier/SupplierTabs.tsx` | Animated tab bar for About/Products/Gallery/Reviews |
| `supplier/sections/AboutSection.tsx` | Company description, performance metrics grid, export countries |
| `supplier/sections/ProductsSection.tsx` | Product grid with sort dropdown, pagination |
| `supplier/sections/GallerySection.tsx` | Image/video grid with fullscreen lightbox modal |
| `supplier/sections/ReviewsSection.tsx` | Rating summary, distribution bars, filterable review list |
| `supplier/cards/BusinessDetailsCard.tsx` | Sidebar card showing business type, year, employees, revenue, etc. |
| `supplier/cards/CertificationsCard.tsx` | Sidebar card listing certifications with verification status |
| `supplier/cards/ContactCard.tsx` | Sidebar card showing contact person, languages, address |

---

## Files To Create (Not Included)

These supporting files need to be created for a complete implementation:

```
server/
├── db/
│   └── connection.ts          # PostgreSQL connection pool setup
├── middleware/
│   └── validation.ts          # Request validation middleware wrapper
├── index.ts                   # Express app entry point
└── config.ts                  # Environment configuration

src/
├── contexts/
│   └── AuthContext.tsx        # Authentication context provider
└── utils/
    └── api.ts                 # API client configuration
```

---

## Implementation Order

1. **Database**: Run migrations in order (000, 001)
2. **Server Setup**: Create connection.ts, config.ts, index.ts
3. **Middleware**: Create validation.ts
4. **API**: Routes → Schemas → Controller (already created)
5. **Frontend Types**: Already created
6. **Frontend Hooks**: Already created
7. **Frontend Components**: Already created
8. **Integration**: Connect frontend to backend, test all flows

---

## Summary Statistics

| Category | Files Created | Lines of Code (approx) |
|----------|--------------|------------------------|
| Database | 2 | ~350 |
| API | 3 | ~800 |
| Middleware | 1 | ~150 |
| Utils | 1 | ~100 |
| Types | 1 | ~150 |
| Hooks | 1 | ~250 |
| Components | 12 | ~1,100 |
| Documentation | 2 | ~400 |
| **Total** | **23** | **~3,300** |
