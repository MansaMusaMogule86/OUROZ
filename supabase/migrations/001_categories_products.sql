-- ============================================================
-- OUROZ — Schema Extension & Seed Data
-- Applied via Supabase MCP on 2026-04-03
-- Run these in order if re-applying from scratch.
-- ============================================================

-- NOTE: The existing DB had tables: categories (code, name_en, name_ar),
-- brands (code, name_en, name_ar), products (slug, name_en, name_ar),
-- product_variants (sku-based schema). This migration extends them
-- non-destructively to support the storefront query layer.

-- ── 1. Extend categories ──────────────────────────────────
ALTER TABLE categories
  ADD COLUMN IF NOT EXISTS slug          TEXT,
  ADD COLUMN IF NOT EXISTS name          TEXT,
  ADD COLUMN IF NOT EXISTS name_fr       TEXT,
  ADD COLUMN IF NOT EXISTS description   TEXT,
  ADD COLUMN IF NOT EXISTS description_ar TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT,
  ADD COLUMN IF NOT EXISTS icon          TEXT,
  ADD COLUMN IF NOT EXISTS image_url     TEXT,
  ADD COLUMN IF NOT EXISTS parent_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS is_active     BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at    TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE categories ALTER COLUMN code DROP NOT NULL;

UPDATE categories SET slug = CASE code
  WHEN 'BAK' THEN 'baking-mixes'      WHEN 'CAN' THEN 'canned-food'
  WHEN 'COF' THEN 'coffee-sugar'      WHEN 'CON' THEN 'condiments-pantry'
  WHEN 'GRA' THEN 'grains-pasta'      WHEN 'KIT' THEN 'kitchenware'
  WHEN 'OLV' THEN 'olives-moroccan'   WHEN 'SNK' THEN 'snacks-confectionery'
  WHEN 'TEA' THEN 'tea-herbal'
  ELSE lower(regexp_replace(name_en, '[^a-zA-Z0-9]+', '-', 'g'))
END WHERE slug IS NULL;

UPDATE categories SET name = name_en WHERE name IS NULL AND name_en IS NOT NULL;

UPDATE categories SET display_order = CASE code
  WHEN 'OLV' THEN 1  WHEN 'TEA' THEN 2  WHEN 'COF' THEN 3
  WHEN 'CON' THEN 4  WHEN 'GRA' THEN 5  WHEN 'KIT' THEN 6
  WHEN 'CAN' THEN 7  WHEN 'SNK' THEN 8  WHEN 'BAK' THEN 9
  ELSE 10
END WHERE display_order = 0;

UPDATE categories SET icon = CASE code
  WHEN 'BAK' THEN '🧁'  WHEN 'CAN' THEN '🥫'  WHEN 'COF' THEN '☕'
  WHEN 'CON' THEN '🫙'  WHEN 'GRA' THEN '🌾'  WHEN 'KIT' THEN '🍳'
  WHEN 'OLV' THEN '🫒'  WHEN 'SNK' THEN '🍿'  WHEN 'TEA' THEN '🍵'
END WHERE icon IS NULL;

ALTER TABLE categories ALTER COLUMN slug SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_categories_slug      ON categories(slug);
CREATE        INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE        INDEX IF NOT EXISTS idx_categories_active    ON categories(is_active);

-- ── 2. Extend products ────────────────────────────────────
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS name             TEXT,
  ADD COLUMN IF NOT EXISTS name_ar          TEXT,
  ADD COLUMN IF NOT EXISTS name_fr          TEXT,
  ADD COLUMN IF NOT EXISTS short_description TEXT,
  ADD COLUMN IF NOT EXISTS description      TEXT,
  ADD COLUMN IF NOT EXISTS description_ar   TEXT,
  ADD COLUMN IF NOT EXISTS description_fr   TEXT,
  ADD COLUMN IF NOT EXISTS base_price       NUMERIC(10,2) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS currency         TEXT DEFAULT 'AED',
  ADD COLUMN IF NOT EXISTS origin           TEXT,
  ADD COLUMN IF NOT EXISTS origin_region    TEXT,
  ADD COLUMN IF NOT EXISTS weight           TEXT,
  ADD COLUMN IF NOT EXISTS certifications   TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS badge            TEXT,
  ADD COLUMN IF NOT EXISTS is_active        BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS in_stock         BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS updated_at       TIMESTAMPTZ DEFAULT NOW();

UPDATE products SET name = name_en WHERE name IS NULL AND name_en IS NOT NULL;
UPDATE products SET name = slug     WHERE name IS NULL;

CREATE INDEX IF NOT EXISTS idx_products_slug        ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_active      ON products(is_active);

-- ── 3. Extend brands ──────────────────────────────────────
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS slug        TEXT,
  ADD COLUMN IF NOT EXISTS name        TEXT,
  ADD COLUMN IF NOT EXISTS name_fr     TEXT,
  ADD COLUMN IF NOT EXISTS logo_url    TEXT,
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS is_active   BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ DEFAULT NOW();

UPDATE brands SET slug = lower(regexp_replace(code, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
UPDATE brands SET name = name_en WHERE name IS NULL AND name_en IS NOT NULL;
UPDATE brands SET name = code    WHERE name IS NULL;

-- ── 4. Extend product_variants ────────────────────────────
ALTER TABLE product_variants
  ADD COLUMN IF NOT EXISTS name             TEXT,
  ADD COLUMN IF NOT EXISTS price            NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS in_stock         BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS display_order    INTEGER DEFAULT 0;

UPDATE product_variants SET name = CASE
  WHEN variant_name_en IS NOT NULL AND variant_name_en != '' THEN variant_name_en
  WHEN size_value IS NOT NULL AND size_unit IS NOT NULL THEN size_value::text || size_unit
  ELSE sku
END WHERE name IS NULL;

-- ── 5. Create product_images ──────────────────────────────
CREATE TABLE IF NOT EXISTS product_images (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url        TEXT        NOT NULL,
  alt        TEXT,
  position   INTEGER     DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ── 6. RLS ────────────────────────────────────────────────
ALTER TABLE categories       ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands           ENABLE ROW LEVEL SECURITY;
ALTER TABLE products         ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images   ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories"       ON categories;
DROP POLICY IF EXISTS "public_read_brands"           ON brands;
DROP POLICY IF EXISTS "public_read_products"         ON products;
DROP POLICY IF EXISTS "public_read_product_images"   ON product_images;
DROP POLICY IF EXISTS "public_read_product_variants" ON product_variants;

CREATE POLICY "public_read_categories"       ON categories       FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_brands"           ON brands           FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_products"         ON products         FOR SELECT USING (is_active = true);
CREATE POLICY "public_read_product_images"   ON product_images   FOR SELECT USING (true);
CREATE POLICY "public_read_product_variants" ON product_variants FOR SELECT USING (true);

-- ── 7. Subcategory seed ───────────────────────────────────
-- (see seed_subcategories migration for full data)
