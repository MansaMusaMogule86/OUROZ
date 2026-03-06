# OUROZ Shop – Setup Instructions

## What this adds to the OUROZ project

A full retail + wholesale shop system built on **Next.js App Router + Supabase**, featuring:

- `/shop` – homepage with retail/wholesale tab switch
- `/shop/[categorySlug]` – category product listing
- `/product/[productSlug]` – product detail page
- `/cart` – full cart management
- `/checkout` – checkout flow (payment stub)
- `/wholesale/apply` – wholesale business application
- `/wholesale/dashboard` – reorder, invoice stub

---

## 1. Install Dependencies

```bash
npm install @supabase/supabase-js
npm install @heroicons/react
```

---

## 2. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Save your **Project URL** and **anon key**
3. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

4. Fill in your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

---

## 3. Run Database Migrations

Run the migration files **in order** in the Supabase SQL Editor
(**Project → SQL Editor → New query**):

```
supabase/migrations/001_shop_base.sql       ← Tables + indexes + triggers
supabase/migrations/002_rls_policies.sql    ← Row Level Security
supabase/migrations/003_seed.sql            ← Categories, brands, products, tiers
```

### Using Supabase CLI (alternative)

```bash
npx supabase init           # if not already initialized
npx supabase db push        # applies migrations from supabase/migrations/
```

### Using psql directly

```bash
psql "$DATABASE_URL" -f supabase/migrations/001_shop_base.sql
psql "$DATABASE_URL" -f supabase/migrations/002_rls_policies.sql
psql "$DATABASE_URL" -f supabase/migrations/003_seed.sql
```

---

## 4. Set Up Supabase Auth

In the Supabase dashboard → **Authentication → Settings**:

- Enable **Email** provider
- Set Site URL: `http://localhost:3000` (dev) or your production URL
- Add Redirect URLs: `http://localhost:3000/**`

---

## 5. Create an Admin User

1. Register any user via Supabase Auth
2. In **SQL Editor**, run:

```sql
-- Replace with your actual user UUID (from auth.users table)
UPDATE user_profiles
SET role = 'admin'
WHERE id = 'your-user-uuid-here';
```

Admins can:
- Approve/reject wholesale applications
- Manage products, categories, inventory

---

## 6. Enable Supabase Storage (for trade license uploads)

In the Supabase dashboard → **Storage**:

```sql
-- Create bucket for trade license documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('trade-licenses', 'trade-licenses', false);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users upload trade licenses"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trade-licenses' AND auth.uid() IS NOT NULL);
```

---

## 7. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000/shop](http://localhost:3000/shop)

---

## Folder Structure

```
OUROZ/
├── supabase/
│   └── migrations/
│       ├── 001_shop_base.sql          ← Core tables
│       ├── 002_rls_policies.sql       ← Row Level Security
│       └── 003_seed.sql               ← Seed data
│
├── src/
│   ├── lib/
│   │   ├── supabase.ts                ← Supabase client
│   │   └── shop-queries.ts            ← Server-side data fetching
│   ├── types/
│   │   └── shop.ts                    ← TypeScript interfaces
│   ├── contexts/
│   │   ├── LangContext.tsx            ← AR/FR/EN language state
│   │   └── CartContext.tsx            ← Cart state (Supabase + guest)
│   └── components/shop/
│       ├── ShopClientShell.tsx        ← Tab mode + wholesale gate
│       ├── ShopTabs.tsx               ← "Shop for Home" / "For Businesses"
│       ├── CategoryNav.tsx            ← Horizontal category pills
│       ├── ProductGrid.tsx            ← Responsive product grid + skeleton
│       ├── ProductCard.tsx            ← Product card (retail/wholesale)
│       ├── ProductGallery.tsx         ← Image gallery + lightbox
│       ├── ProductDetailClient.tsx    ← Interactive product detail
│       ├── PriceBlock.tsx             ← Retail / wholesale price display
│       ├── TierPricingTable.tsx       ← Wholesale tier grid
│       ├── QuantitySelector.tsx       ← +/- qty stepper
│       ├── AddToCartButton.tsx        ← With loading/success states
│       ├── CartDrawer.tsx             ← Slide-in cart panel
│       ├── CartIconButton.tsx         ← Header cart icon
│       ├── LanguageSwitcher.tsx       ← AR/FR/EN toggle
│       └── WholesaleGate.tsx          ← Guard component
│
├── app/
│   ├── layout.tsx                     ← Root layout with providers
│   ├── shop/
│   │   ├── layout.tsx                 ← Shop nav header
│   │   ├── page.tsx                   ← /shop homepage
│   │   └── [categorySlug]/
│   │       └── page.tsx               ← /shop/couscous-pasta
│   ├── product/
│   │   └── [productSlug]/
│   │       └── page.tsx               ← /product/kenz-angel-hair-pasta-500g
│   ├── cart/
│   │   └── page.tsx                   ← /cart
│   ├── checkout/
│   │   └── page.tsx                   ← /checkout (stub)
│   └── wholesale/
│       ├── apply/
│       │   └── page.tsx               ← /wholesale/apply
│       └── dashboard/
│           └── page.tsx               ← /wholesale/dashboard
```

---

## Database Schema Summary

| Table | Purpose |
|-------|---------|
| `user_profiles` | Extends `auth.users` with role (customer/wholesale/admin) |
| `brands` | Brand info (Kenz, etc.) |
| `brand_translations` | Name in EN/AR/FR |
| `categories` | Nested categories (parent_id) |
| `category_translations` | Name + description in EN/AR/FR |
| `products` | Core product data |
| `product_translations` | name, description in EN/AR/FR |
| `product_images` | Gallery images per product |
| `product_variants` | SKU, weight, size per product |
| `inventory` | Stock qty per variant |
| `price_tiers` | Wholesale tiered pricing (min_qty → price) |
| `wholesale_accounts` | Business applications |
| `search_synonyms` | Arabic/French keyword mapping for search |
| `carts` | One active cart per user |
| `cart_items` | Items in cart |
| `orders` | Orders with shipping snapshot |
| `order_items` | Line items with price snapshot |
| `bulk_quote_requests` | "Request bulk quote" from product page |

---

## RLS Security Summary

| Who | Can Do |
|-----|--------|
| Public (no auth) | Read active products, categories, brands |
| Any authenticated | Have a cart, place orders |
| Wholesale approved | See `price_tiers` (wholesale pricing) |
| Account owner | Read own cart, orders, wholesale account |
| Any user | Submit bulk quote request |
| Admin | Full access to everything |

---

## Multilingual Search

Search works via PostgreSQL full-text search with:

1. **`products.search_vector`** – aggregated tsvector from all language translations
2. **`search_synonyms` table** – maps Arabic/French keywords to English canonical terms
   - `كسكسي` → `couscous`
   - `vermicelles` → `angel hair pasta`
3. **Trigram fallback** – fuzzy ILIKE if FTS returns nothing

---

## Seed Data Included

| Data | Details |
|------|---------|
| **7 categories** | Grocery, Couscous & Pasta, Flour & Baking, Tea, Spices, Oils, Dairy |
| **3 languages** | EN + AR + FR translations for all categories |
| **1 brand** | Kenz (with AR + FR names) |
| **2 products** | Kenz Angel Hair Pasta 500g + Kenz Couscous 1kg |
| **Tier pricing** | 1 unit → 13.99 / 10+ → 12.50 / 50+ → 11.20 AED |
| **Search synonyms** | 23 keyword mappings across AR/FR/EN |

---

## Adding More Products

```sql
-- 1. Insert product
INSERT INTO products (slug, brand_id, category_id, base_price) VALUES (
    'your-product-slug', 'brand-uuid', 'category-uuid', 19.99
);

-- 2. Add translations
INSERT INTO product_translations (product_id, lang, name, description)
VALUES ('product-uuid', 'en', 'Product Name', 'Description here');

-- 3. Add variant + inventory
INSERT INTO product_variants (product_id, sku, weight_label, retail_price) VALUES
    ('product-uuid', 'SKU-001', '1kg', 19.99);

INSERT INTO inventory (variant_id, qty_available) VALUES ('variant-uuid', 200);

-- 4. Add wholesale tiers
INSERT INTO price_tiers (variant_id, min_qty, price) VALUES
    ('variant-uuid', 1, 19.99),
    ('variant-uuid', 20, 17.50),
    ('variant-uuid', 100, 15.00);
```

---

## Notes

- **`app/layout.tsx`** may conflict with an existing root layout. Merge providers (`LangProvider`, `CartProvider`) into your existing layout if needed.
- **`globals.css`** import path in `app/layout.tsx` assumes `ouroz-engine/src/app/globals.css`. Adjust to your actual path.
- **Payment is a stub** – integrate Stripe, Telr, or PayTabs for live payments.
- **`@heroicons/react`** is used for icons. Replace with `lucide-react` if preferred (already in package.json).
