-- =====================================================
-- OUROZ Shop - Migration 003: Seed Data
-- Real products, categories, brands, translations
-- =====================================================

-- Run AFTER 001_shop_base.sql and 002_rls_policies.sql

-- =====================================================
-- CATEGORIES
-- =====================================================

INSERT INTO categories (id, slug, icon, sort_order, is_active) VALUES
    ('cat-grocery', 'grocery', '🛒', 1, TRUE),
    ('cat-couscous', 'couscous-pasta', '🍝', 2, TRUE),
    ('cat-flour', 'flour-baking', '🌾', 3, TRUE),
    ('cat-tea', 'tea-coffee', '🫖', 4, TRUE),
    ('cat-spices', 'spices', '🌶', 5, TRUE),
    ('cat-oils', 'oils', '🫙', 6, TRUE),
    ('cat-dairy', 'dairy-drinks', '🥛', 7, TRUE)
ON CONFLICT (slug) DO NOTHING;

-- Set parent: subcategories under Grocery
UPDATE categories SET parent_id = 'cat-grocery'
WHERE slug IN ('couscous-pasta', 'flour-baking', 'tea-coffee', 'spices', 'oils', 'dairy-drinks');

-- Category Translations: English
INSERT INTO category_translations (category_id, lang, name, description) VALUES
    ('cat-grocery', 'en', 'Grocery', 'Authentic Moroccan grocery staples'),
    ('cat-couscous', 'en', 'Couscous & Pasta', 'Premium Moroccan couscous and pasta'),
    ('cat-flour', 'en', 'Flour & Baking', 'Fine flours for Moroccan bread and pastries'),
    ('cat-tea', 'en', 'Tea & Coffee', 'Moroccan mint tea, spice coffee blends'),
    ('cat-spices', 'en', 'Spices', 'Ras el hanout, cumin, paprika and more'),
    ('cat-oils', 'en', 'Oils', 'Argan, olive and specialty oils'),
    ('cat-dairy', 'en', 'Dairy & Drinks', 'Moroccan dairy products and traditional drinks')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category Translations: Arabic
INSERT INTO category_translations (category_id, lang, name, description) VALUES
    ('cat-grocery', 'ar', 'بقالة', 'مواد بقالة مغربية أصيلة'),
    ('cat-couscous', 'ar', 'كسكس ومعكرونة', 'كسكس ومعكرونة مغربية فاخرة'),
    ('cat-flour', 'ar', 'دقيق ومخبوزات', 'دقيق مختار للخبز المغربي والمعجنات'),
    ('cat-tea', 'ar', 'شاي وقهوة', 'شاي النعناع المغربي وخلطات القهوة بالبهارات'),
    ('cat-spices', 'ar', 'بهارات', 'رأس الحانوت والكمون والفلفل الحلو وأكثر'),
    ('cat-oils', 'ar', 'زيوت', 'زيت أركان وزيت الزيتون وزيوت متخصصة'),
    ('cat-dairy', 'ar', 'ألبان ومشروبات', 'منتجات الألبان المغربية والمشروبات التقليدية')
ON CONFLICT (category_id, lang) DO NOTHING;

-- Category Translations: French
INSERT INTO category_translations (category_id, lang, name, description) VALUES
    ('cat-grocery', 'fr', 'Épicerie', 'Épicerie marocaine authentique'),
    ('cat-couscous', 'fr', 'Couscous & Pâtes', 'Couscous et pâtes marocains premium'),
    ('cat-flour', 'fr', 'Farine & Pâtisserie', 'Farines fines pour pain et pâtisseries marocains'),
    ('cat-tea', 'fr', 'Thé & Café', 'Thé à la menthe marocain et cafés épicés'),
    ('cat-spices', 'fr', 'Épices', 'Ras el hanout, cumin, paprika et plus'),
    ('cat-oils', 'fr', 'Huiles', 'Huile d''argan, d''olive et huiles spéciales'),
    ('cat-dairy', 'fr', 'Laitiers & Boissons', 'Produits laitiers marocains et boissons traditionnelles')
ON CONFLICT (category_id, lang) DO NOTHING;

-- =====================================================
-- BRAND: Kenz
-- =====================================================

INSERT INTO brands (id, slug, is_active) VALUES
    ('brand-kenz', 'kenz', TRUE)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO brand_translations (brand_id, lang, name) VALUES
    ('brand-kenz', 'en', 'Kenz'),
    ('brand-kenz', 'ar', 'كنز'),
    ('brand-kenz', 'fr', 'Kenz')
ON CONFLICT (brand_id, lang) DO NOTHING;

-- =====================================================
-- PRODUCT: Kenz Angel Hair Pasta 500g
-- =====================================================

INSERT INTO products (
    id, slug, brand_id, category_id,
    base_price, compare_price,
    status, is_retail_enabled, is_wholesale_enabled, is_featured,
    meta_image_url
) VALUES (
    'prod-kenz-angel-hair-500g',
    'kenz-angel-hair-pasta-500g',
    'brand-kenz',
    'cat-couscous',
    13.99,
    NULL,
    'active',
    TRUE,
    TRUE,
    TRUE,
    'https://via.placeholder.com/600x600/F5E6D3/1A1A1A?text=Kenz+Pasta'
)
ON CONFLICT (slug) DO NOTHING;

-- Product Translations: English
INSERT INTO product_translations (product_id, lang, name, short_description, description) VALUES (
    'prod-kenz-angel-hair-500g',
    'en',
    'Kenz Angel Hair Pasta 500g',
    'Fine durum wheat angel hair from Morocco''s trusted Kenz brand.',
    'Kenz Angel Hair Pasta is crafted from 100% premium durum wheat semolina, stone-milled in the Moroccan tradition. Its delicate threads cook in under 3 minutes, making it the go-to pasta for Moroccan homes and professional kitchens alike. Perfect for soups, light sauces, and butter-based preparations. Halal certified. No artificial additives.'
)
ON CONFLICT (product_id, lang) DO NOTHING;

-- Product Translations: Arabic
INSERT INTO product_translations (product_id, lang, name, short_description, description) VALUES (
    'prod-kenz-angel-hair-500g',
    'ar',
    'شعريّة كنز ٥٠٠ غ',
    'شعرية من القمح الصلب الفاخر من منتجات كنز المغربية الموثوقة.',
    'شعرية كنز مصنوعة من ١٠٠٪ سميد القمح الصلب الفاخر، مطحون على الطريقة المغربية التقليدية. تُطهى في أقل من ٣ دقائق، مما يجعلها الخيار الأول للمطابخ المغربية والاحترافية. مثالية للحساء والصلصات الخفيفة والأطباق بالزبدة. حلال معتمد. بدون إضافات صناعية.'
)
ON CONFLICT (product_id, lang) DO NOTHING;

-- Product Translations: French
INSERT INTO product_translations (product_id, lang, name, short_description, description) VALUES (
    'prod-kenz-angel-hair-500g',
    'fr',
    'Vermicelles Kenz 500g',
    'Vermicelles fins de blé dur du Maroc, marque Kenz.',
    'Les vermicelles Kenz sont élaborés à partir de 100% de semoule de blé dur premium, moulue selon la tradition marocaine. Leurs fins filaments cuisent en moins de 3 minutes, ce qui en fait la pâte idéale pour les cuisines marocaines et professionnelles. Parfait pour les soupes, les sauces légères et les préparations au beurre. Certifié Halal. Sans additifs artificiels.'
)
ON CONFLICT (product_id, lang) DO NOTHING;

-- Product Images
INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary) VALUES
    ('prod-kenz-angel-hair-500g', 'https://via.placeholder.com/800x800/F5E6D3/1A1A1A?text=Kenz+Angel+Hair', 'Kenz Angel Hair Pasta 500g – front', 1, TRUE),
    ('prod-kenz-angel-hair-500g', 'https://via.placeholder.com/800x800/F5E6D3/1A1A1A?text=Kenz+Packaging', 'Kenz Angel Hair Pasta – packaging detail', 2, FALSE),
    ('prod-kenz-angel-hair-500g', 'https://via.placeholder.com/800x800/F5E6D3/1A1A1A?text=Kenz+Prepared', 'Kenz Angel Hair Pasta – prepared dish', 3, FALSE)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VARIANT: Kenz Angel Hair 500g
-- =====================================================

INSERT INTO product_variants (
    id, product_id, sku,
    weight_grams, weight_label,
    retail_price, compare_price,
    is_active, sort_order
) VALUES (
    'var-kenz-angel-hair-500g',
    'prod-kenz-angel-hair-500g',
    'KENZ-AH-500G',
    500,
    '500g',
    13.99,
    NULL,
    TRUE,
    1
)
ON CONFLICT (sku) DO NOTHING;

-- Inventory for the variant
INSERT INTO inventory (variant_id, qty_available, qty_reserved, low_stock_threshold, track_inventory) VALUES
    ('var-kenz-angel-hair-500g', 500, 0, 50, TRUE)
ON CONFLICT (variant_id) DO NOTHING;

-- =====================================================
-- PRICE TIERS: Wholesale pricing for Kenz 500g variant
-- =====================================================

INSERT INTO price_tiers (variant_id, min_qty, price, label) VALUES
    ('var-kenz-angel-hair-500g', 1,  13.99, NULL),
    ('var-kenz-angel-hair-500g', 10, 12.50, 'Box of 10'),
    ('var-kenz-angel-hair-500g', 50, 11.20, 'Carton of 50')
ON CONFLICT (variant_id, min_qty) DO NOTHING;

-- =====================================================
-- SEARCH SYNONYMS
-- Multilingual + transliteration mappings
-- =====================================================

INSERT INTO search_synonyms (keyword, canonical, lang) VALUES
    -- Arabic → English
    ('كسكسي', 'couscous', 'ar'),
    ('كسكس', 'couscous', 'ar'),
    ('شعرية', 'angel hair pasta', 'ar'),
    ('معكرونة', 'pasta', 'ar'),
    ('دقيق', 'flour', 'ar'),
    ('شاي', 'tea', 'ar'),
    ('قهوة', 'coffee', 'ar'),
    ('بهارات', 'spices', 'ar'),
    ('زيت أركان', 'argan oil', 'ar'),
    ('زيت الزيتون', 'olive oil', 'ar'),
    ('كنز', 'kenz', 'ar'),

    -- French → English
    ('couscous marocain', 'couscous', 'fr'),
    ('semoule', 'couscous', 'fr'),
    ('vermicelles', 'angel hair pasta', 'fr'),
    ('farine', 'flour', 'fr'),
    ('huile argane', 'argan oil', 'fr'),
    ('épices', 'spices', 'fr'),
    ('menthe', 'mint tea', 'fr'),

    -- English variants/typos
    ('couscos', 'couscous', 'en'),
    ('angle hair', 'angel hair pasta', 'en'),
    ('argan', 'argan oil', 'en'),
    ('moroccan pasta', 'angel hair pasta', 'en'),
    ('moroccan flour', 'flour', 'en')
ON CONFLICT (keyword, lang) DO NOTHING;

-- =====================================================
-- ADDITIONAL PRODUCTS (minimal - expand as needed)
-- =====================================================

-- Kenz Couscous 1kg
INSERT INTO products (id, slug, brand_id, category_id, base_price, status, is_retail_enabled, is_wholesale_enabled, is_featured, meta_image_url)
VALUES ('prod-kenz-couscous-1kg', 'kenz-medium-couscous-1kg', 'brand-kenz', 'cat-couscous', 18.50, 'active', TRUE, TRUE, TRUE, 'https://via.placeholder.com/600x600/F5E6D3/1A1A1A?text=Kenz+Couscous')
ON CONFLICT (slug) DO NOTHING;

INSERT INTO product_translations (product_id, lang, name, short_description, description) VALUES
    ('prod-kenz-couscous-1kg', 'en', 'Kenz Medium Couscous 1kg', 'Premium Moroccan medium-grain couscous.', 'Premium durum wheat couscous, medium grain, perfect for traditional tagines and celebrations.'),
    ('prod-kenz-couscous-1kg', 'ar', 'كسكس متوسط كنز ١ كغ', 'كسكس مغربي حبة متوسطة فاخر.', 'كسكس من القمح الصلب الفاخر، حبة متوسطة، مثالي للطواجن والاحتفالات التقليدية.'),
    ('prod-kenz-couscous-1kg', 'fr', 'Couscous Moyen Kenz 1kg', 'Couscous marocain grain moyen premium.', 'Couscous de blé dur premium grain moyen, parfait pour les tajines et fêtes traditionnelles.')
ON CONFLICT (product_id, lang) DO NOTHING;

INSERT INTO product_images (product_id, url, alt_text, sort_order, is_primary)
VALUES ('prod-kenz-couscous-1kg', 'https://via.placeholder.com/800x800/F5E6D3/1A1A1A?text=Kenz+Couscous', 'Kenz Medium Couscous 1kg', 1, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO product_variants (id, product_id, sku, weight_grams, weight_label, retail_price, is_active, sort_order)
VALUES ('var-kenz-couscous-1kg', 'prod-kenz-couscous-1kg', 'KENZ-CS-1KG', 1000, '1kg', 18.50, TRUE, 1)
ON CONFLICT (sku) DO NOTHING;

INSERT INTO inventory (variant_id, qty_available, low_stock_threshold) VALUES ('var-kenz-couscous-1kg', 300, 30)
ON CONFLICT (variant_id) DO NOTHING;

INSERT INTO price_tiers (variant_id, min_qty, price, label) VALUES
    ('var-kenz-couscous-1kg', 1,  18.50, NULL),
    ('var-kenz-couscous-1kg', 12, 16.00, 'Case of 12'),
    ('var-kenz-couscous-1kg', 48, 14.20, 'Pallet tier')
ON CONFLICT (variant_id, min_qty) DO NOTHING;

-- =====================================================
-- Refresh all search vectors after seed
-- =====================================================

DO $$
DECLARE r RECORD;
BEGIN
    FOR r IN SELECT id FROM products LOOP
        PERFORM refresh_product_search_vector(r.id);
    END LOOP;
END $$;
