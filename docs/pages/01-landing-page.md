# PAGE 1: LANDING PAGE - Complete Specification

## Page Objective

The Landing Page is the **first impression point** of the OUROZ Moroccan B2B Marketplace. It must:

1. **Establish credibility** as Morocco's premier B2B trade platform
2. **Capture both audiences**: International buyers seeking Moroccan products AND Moroccan suppliers wanting to export
3. **Drive conversions** to registration (buyer or supplier)
4. **Enable discovery** through search and category browsing
5. **Build trust** through social proof, stats, and verification badges

---

## User Actions

| Action | Element | Outcome |
|--------|---------|---------|
| Search products/suppliers | Hero search bar | Navigate to search results |
| Choose buyer path | "Start Sourcing" CTA | Redirect to buyer registration |
| Choose supplier path | "Start Selling" CTA | Redirect to supplier registration |
| Browse categories | Category cards | Navigate to category page |
| Change language | Language dropdown | Switch UI to EN/AR/FR |
| Sign in | Header button | Navigate to login page |
| Get started | Header button | Navigate to registration |

---

## UI Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ HEADER (Fixed on scroll)                                        │
│ [Logo] [Marketplace] [Suppliers] [Categories] [RFQ]  [Lang] [Auth]│
├─────────────────────────────────────────────────────────────────┤
│ HERO SECTION                                                     │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │  Badge: "Morocco's #1 B2B Trade Platform"                   │ │
│ │                                                             │ │
│ │  The Gateway to                                             │ │
│ │  MOROCCAN EXCELLENCE                                        │ │
│ │                                                             │ │
│ │  [========== SEARCH BAR ==========] [Search]                │ │
│ │                                                             │ │
│ │  [Start Sourcing]    [Start Selling]                        │ │
│ └─────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────┤
│ TRUST BADGES                                                     │
│ [Trade Assurance] [Secure Payments] [Global Logistics] [24/7]   │
├─────────────────────────────────────────────────────────────────┤
│ STATS SECTION (Dark background)                                  │
│ [15,000+ Suppliers] [120,000+ Products] [85+ Countries] [$2.5B+]│
├─────────────────────────────────────────────────────────────────┤
│ CATEGORIES SECTION                                               │
│ [Agriculture] [Textiles] [Handicrafts] [Cosmetics] [Food] [...]  │
├─────────────────────────────────────────────────────────────────┤
│ DUAL CTA SECTION                                                 │
│ ┌───────────────────┐  ┌───────────────────┐                    │
│ │ FOR BUYERS        │  │ FOR SUPPLIERS     │                    │
│ │ - Verified        │  │ - Global reach    │                    │
│ │ - Trade assurance │  │ - Export support  │                    │
│ │ - RFQ system      │  │ - Multi-language  │                    │
│ │ [Start Sourcing]  │  │ [Start Selling]   │                    │
│ └───────────────────┘  └───────────────────┘                    │
├─────────────────────────────────────────────────────────────────┤
│ FOOTER                                                           │
│ [Brand] [Marketplace links] [Business links] [Support links]    │
│ [Copyright] [Privacy] [Terms] [Cookies]                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## UX Logic

### 1. Page Load Sequence

1. Header animates in from top (0.5s)
2. Hero content fades in with stagger (0.1s intervals)
3. Trust badges appear after hero
4. Stats section reveals on scroll
5. Categories animate in with stagger

### 2. Search Interaction

1. User types query in search bar
2. Debounced suggestions appear (300ms delay)
3. On submit, redirect to `/search?q={query}`
4. Recent searches stored in localStorage

### 3. Language Switch

1. User selects language from dropdown
2. All text updates immediately (client-side)
3. Language preference stored in localStorage
4. RTL layout applies for Arabic

### 4. Scroll Behavior

1. Header becomes opaque with blur on scroll > 50px
2. Sections animate in on viewport entry
3. Smooth scroll for anchor links

---

## Backend Logic

### APIs Required

```typescript
// GET /api/landing/stats
// Returns platform statistics for landing page
Response: {
  supplierCount: number;
  productCount: number;
  countriesServed: number;
  tradeVolume: string;
}

// GET /api/categories/featured
// Returns featured categories for homepage
Response: {
  categories: Array<{
    id: string;
    name: { en: string; ar: string; fr: string };
    icon: string;
    productCount: number;
    supplierCount: number;
    image: string;
  }>;
}

// GET /api/search/suggestions?q={query}
// Returns search suggestions
Response: {
  products: Array<{ id: string; name: string; image: string }>;
  suppliers: Array<{ id: string; name: string; logo: string }>;
  categories: Array<{ id: string; name: string }>;
}

// POST /api/analytics/page-view
// Track page view
Body: { page: string; referrer: string; language: string }
```

### Auth Requirements

- **None** - Landing page is fully public
- Cached aggressively (CDN, 5 minute TTL for stats)

---

## Database Schema

Landing page primarily reads from these tables:

```sql
-- Platform statistics (materialized view, updated hourly)
CREATE MATERIALIZED VIEW platform_stats AS
SELECT
  COUNT(DISTINCT s.id) as supplier_count,
  COUNT(DISTINCT p.id) as product_count,
  COUNT(DISTINCT o.destination_country) as countries_served,
  SUM(o.total_amount) as trade_volume
FROM suppliers s
LEFT JOIN products p ON p.supplier_id = s.id
LEFT JOIN orders o ON o.supplier_id = s.id
WHERE s.status = 'ACTIVE' AND p.product_status = 'ACTIVE';

-- Featured categories
CREATE TABLE featured_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id),
  display_order INT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_featured_categories_order ON featured_categories(display_order) WHERE is_active = true;

-- Page analytics
CREATE TABLE page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page VARCHAR(255) NOT NULL,
  user_id UUID REFERENCES users(id),
  session_id VARCHAR(255),
  referrer TEXT,
  language VARCHAR(5),
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_page_views_created ON page_views(created_at);
CREATE INDEX idx_page_views_page ON page_views(page);
```

---

## Moroccan Supplier Customization

### Language Support

- **English (en)**: Default for international buyers
- **Arabic (ar)**: Native Moroccan/MENA, RTL layout
- **French (fr)**: Second official language of Morocco

### Visual Elements

- Amazigh symbol (ⵣ) in logo
- Moroccan color palette (sahara, henna, gold)
- Categories highlight Moroccan industries

### Content Focus

- Stats emphasize Moroccan supplier verification
- Categories prioritize Moroccan export strengths
- Trust badges include Morocco-specific compliance

---

## Edge Cases

| Case | Handling |
|------|----------|
| Stats API fails | Show cached values with "Last updated" note |
| Empty search query | Show popular searches instead |
| Slow connection | Skeleton loaders for images |
| JavaScript disabled | Server-side rendered fallback |
| Invalid language param | Default to English |
| Mobile with slow connection | Lazy load images below fold |
| RTL language selected | Entire layout mirrors |

---

## Improvements Beyond Alibaba

| Feature | Alibaba | OUROZ |
|---------|---------|-------|
| Language support | Global but generic | Native Arabic/French with cultural context |
| Supplier focus | Global, diluted | Morocco-first, specialized |
| Visual design | Dense, overwhelming | Editorial, premium feel |
| Trust indicators | Trade Assurance only | Moroccan certifications + verification |
| Search UX | Cluttered | Clean, focused |
| Mobile experience | App-focused | PWA-first responsive |
| Category discovery | Hierarchical lists | Visual, immersive cards |

---

## Performance Targets

| Metric | Target |
|--------|--------|
| FCP (First Contentful Paint) | < 1.2s |
| LCP (Largest Contentful Paint) | < 2.5s |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 3.5s |
| Lighthouse Score | > 90 |

---

## SEO Optimization

```html
<title>OUROZ - Morocco's Premier B2B Marketplace | Verified Suppliers</title>
<meta name="description" content="Connect with 15,000+ verified Moroccan manufacturers, wholesalers, and artisans. Source authentic products with trade assurance and global logistics.">
<meta name="keywords" content="Morocco B2B, Moroccan suppliers, wholesale Morocco, trade assurance, argan oil wholesale, Moroccan handicrafts, export Morocco">

<!-- Open Graph -->
<meta property="og:title" content="OUROZ - Morocco's Premier B2B Marketplace">
<meta property="og:description" content="Connect with verified Moroccan suppliers">
<meta property="og:image" content="https://ouroz.ma/og-image.jpg">

<!-- Structured Data -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "OUROZ",
  "url": "https://ouroz.ma",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://ouroz.ma/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
}
</script>
```

---

## Files Created

1. `src/pages/LandingPage.tsx` - Main landing page component
2. `src/styles/design-system.css` - Design tokens and utilities
3. `src/types/database.types.ts` - Complete database schema types
4. `src/config/database.ts` - Database configuration
5. `src/config/api.routes.ts` - API routes configuration

---

## Next: Page 2 - Buyer Marketplace Homepage

The next page will be the **Buyer Marketplace Homepage** - the main discovery interface for international buyers searching for Moroccan products and suppliers.
