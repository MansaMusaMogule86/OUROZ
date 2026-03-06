# OUROZ Platform – Setup Guide

A Moroccan products marketplace for Dubai, built on Next.js 16 + Supabase.

---

## Architecture Overview

```
Phase A  Restaurant Wholesale + Credit Terms
Phase B  Subscription Restocking
Phase C  Supplier Marketplace
```

All phases share the same Next.js app and Supabase project. Apply migrations in order.

---

## 1. Prerequisites

- Node.js 20+
- A Supabase project (free tier is fine for development)
- Git

---

## 2. Clone + Install

```bash
git clone <your-repo-url>
cd OUROZ
npm install
```

---

## 3. Environment Variables

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
VITE_API_URL=http://localhost:3001/api
```

Find your keys in: Supabase Dashboard → Settings → API

---

## 4. Run Database Migrations

Run in order from the Supabase SQL Editor (**Project → SQL Editor → New query**):

```
supabase/migrations/010_shop_v2_schema.sql     ← Core shop tables (products, variants, carts, orders)
supabase/migrations/020_phase_a_schema.sql     ← Businesses, credit, invoices, payments
supabase/migrations/022_phase_a_seed.sql       ← Seed data (10 brands, 20 products, 3 businesses)
supabase/migrations/030_phase_b_schema.sql     ← Subscriptions
supabase/migrations/040_phase_c_schema.sql     ← Suppliers, commissions
```

### Using Supabase CLI

```bash
npx supabase init                  # only if not already initialized
npx supabase db push               # applies all migrations in order
```

### Using psql

```bash
psql "$DATABASE_URL" -f supabase/migrations/010_shop_v2_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/020_phase_a_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/022_phase_a_seed.sql
psql "$DATABASE_URL" -f supabase/migrations/030_phase_b_schema.sql
psql "$DATABASE_URL" -f supabase/migrations/040_phase_c_schema.sql
```

---

## 5. Set Up Supabase Auth

Supabase Dashboard → **Authentication → Settings**:

1. Enable **Email** provider
2. Set Site URL: `http://localhost:3000` (dev) or your production domain
3. Add Redirect URLs: `http://localhost:3000/**`

---

## 6. Create an Admin User

Register any user via Supabase Auth (or use the Supabase dashboard to create one).

Then in SQL Editor:

```sql
-- Replace with your actual user UUID (from auth.users table)
UPDATE user_profiles
SET role = 'admin'
WHERE user_id = 'your-user-uuid-here';
```

Admins get full access to:
- `/admin/businesses` — approve/reject business applications
- `/admin/credit` — set credit limits, record manual adjustments
- `/admin/invoices` — mark invoices paid, handle overdue
- `/admin/products` — manage product catalog, toggle active/featured

---

## 7. Update Seed Business Owners (Local Dev)

The seed businesses use placeholder user UUIDs. Update them after creating test users:

```sql
-- After creating your test user accounts, update seed businesses:
UPDATE businesses SET owner_user_id = 'real-user-uuid-1'
WHERE id = 'biz00000-0000-0000-0000-000000000001';

UPDATE businesses SET owner_user_id = 'real-user-uuid-2'
WHERE id = 'biz00000-0000-0000-0000-000000000002';
```

---

## 8. Supabase Storage (Trade License Uploads)

In Supabase Dashboard → **Storage**:

```sql
-- Create bucket for trade licenses
INSERT INTO storage.buckets (id, name, public) VALUES ('trade-licenses', 'trade-licenses', false);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users upload trade licenses"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'trade-licenses' AND auth.uid() IS NOT NULL);

-- Allow uploader to read their own files
CREATE POLICY "Users read own trade licenses"
ON storage.objects FOR SELECT
USING (bucket_id = 'trade-licenses' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 9. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Routes Reference

### Customer
| Route | Description |
|-------|-------------|
| `/shop` | Main shop (retail + wholesale tabs) |
| `/product/[slug]` | Product detail page |
| `/cart` | Cart |
| `/checkout` | Retail checkout |

### Business (B2B)
| Route | Description |
|-------|-------------|
| `/business/apply` | Apply for a wholesale account |
| `/business/dashboard` | Business hub: credit, invoices, quick reorder |
| `/business/invoices` | Invoice list + status |
| `/business/checkout` | B2B checkout with pay-now or pay on invoice |
| `/business/subscription` | Manage recurring orders |

### Admin
| Route | Description |
|-------|-------------|
| `/admin/businesses` | Approve/reject business applications + set credit |
| `/admin/credit` | Credit balances, outstanding, manual adjustments |
| `/admin/invoices` | Invoice management, mark paid, handle overdue |
| `/admin/products` | Product catalog + inventory management |

---

## Key Business Rules

### Credit Terms
- Credit account must be `active` for invoice checkout
- Outstanding balance = sum of all ledger entries (charges − payments)
- Available credit = credit_limit − outstanding_balance
- Invoice checkout blocked if: outstanding > limit, OR any overdue invoice exists
- Overdue invoices trigger automatic credit suspension (DB trigger)
- Credit auto-lifts when all overdue invoices are paid and no others remain

### Wholesale Pricing
- customer / admin → `retail_price` always
- wholesale → best tier where `min_quantity ≤ qty` (highest matching tier)
- Agreed price on subscription items overrides tier pricing

### Subscription Runs
- On partial stock: configured per subscription (partial / fail / skip)
- Creates order using same price logic as manual checkout
- If payment_method = invoice: must pass credit check; creates invoice + ledger entry
- Schedule advances automatically after each successful run

### Supplier Products
- Products start as `draft` (inactive)
- Supplier submits for review → `pending`
- Admin approves → product goes live (`is_active = true`)
- Commission calculated at order item level (default 15%)

---

## Overdue Invoice Cron (Production)

To automatically mark invoices as overdue, set up a daily job. With pg_cron (available on Supabase Pro):

```sql
SELECT cron.schedule('mark-overdue-daily', '0 6 * * *', $$
    SELECT mark_overdue_invoices();
$$);
```

Or call from your application on a schedule:

```typescript
import { markOverdueInvoices } from '@/services/creditService';
// Call once daily from a serverless function / cron edge function
await markOverdueInvoices();
```

---

## Payment Integration (Production)

Current implementation uses payment method stubs. For production, integrate:
- **Telr** — popular in UAE, supports AED
- **Network International** — UAE bank integration
- **Stripe** — international cards

The `payment_method` field on orders accepts: `card | cash | bank_transfer | cheque | invoice`

---

## Folder Structure

```
OUROZ/
├── supabase/migrations/
│   ├── 010_shop_v2_schema.sql     Core shop
│   ├── 020_phase_a_schema.sql     Phase A: businesses + credit
│   ├── 022_phase_a_seed.sql       Seed data
│   ├── 030_phase_b_schema.sql     Phase B: subscriptions
│   └── 040_phase_c_schema.sql     Phase C: suppliers
│
├── src/
│   ├── lib/
│   │   ├── supabase.ts            Supabase client
│   │   ├── pricing.ts             Tier pricing pure functions
│   │   └── api.ts                 Centralized Supabase queries (V2 schema)
│   ├── types/
│   │   ├── shop.ts                V2 shop types
│   │   └── business.ts            Phase A/B/C types
│   ├── services/
│   │   ├── pricingService.ts      Order totals + line item pricing
│   │   ├── creditService.ts       Credit checks, invoices, payments
│   │   ├── subscriptionService.ts Subscription run engine
│   │   └── supplierService.ts     Supplier + product draft workflow
│   ├── hooks/
│   │   ├── useUserRole.ts
│   │   ├── useWholesaleStatus.ts
│   │   ├── useCart.ts
│   │   └── useProducts.ts
│   └── components/shop/           UI components
│
├── app/
│   ├── shop/                      Customer shop
│   ├── business/                  B2B portal
│   │   ├── apply/
│   │   ├── dashboard/
│   │   ├── invoices/
│   │   ├── checkout/
│   │   └── subscription/
│   └── admin/                     Admin panel
│       ├── businesses/
│       ├── credit/
│       ├── invoices/
│       └── products/
└── docs/
    └── README.md                  This file
```

---

## Adding Products (SQL)

```sql
-- Insert product
INSERT INTO products (slug, brand_id, category_id, name, base_price, is_active, is_wholesale_enabled)
VALUES ('my-product-slug', 'brand-uuid', 'category-uuid', 'Product Name', 29.99, TRUE, TRUE);

-- Insert variant
INSERT INTO product_variants (product_id, sku, weight, retail_price, stock_quantity)
VALUES ('product-uuid', 'SKU-001', '500g', 29.99, 100);

-- Add wholesale tiers
INSERT INTO price_tiers (variant_id, min_quantity, price) VALUES
    ('variant-uuid',  1, 29.99),
    ('variant-uuid', 10, 26.99),
    ('variant-uuid', 50, 24.99);
```
