-- =============================================================================
-- OUROZ – Migration 022: Phase A Seed Data
-- - 7 categories
-- - 10 Moroccan brands
-- - 20 products (food, drinks, spices, couscous, oils, dairy, flour)
-- - 3 businesses (1 approved with credit, 1 pending, 1 rejected)
-- Requires: 010_shop_v2_schema.sql, 020_phase_a_schema.sql applied first.
-- =============================================================================

-- =============================================================================
-- CATEGORIES
-- =============================================================================

INSERT INTO categories (id, slug, name, name_ar, name_fr, icon, sort_order) VALUES
    ('c1000000-0000-0000-0000-000000000001', 'couscous-pasta',   'Couscous & Pasta',    'الكسكس والمعكرونة', 'Couscous & Pâtes',    '🫙', 1),
    ('c1000000-0000-0000-0000-000000000002', 'spices-herbs',     'Spices & Herbs',       'التوابل والأعشاب',  'Épices & Herbes',     '🌿', 2),
    ('c1000000-0000-0000-0000-000000000003', 'flour-baking',     'Flour & Baking',       'الدقيق والخبز',     'Farine & Pâtisserie', '🌾', 3),
    ('c1000000-0000-0000-0000-000000000004', 'oils-condiments',  'Oils & Condiments',    'الزيوت والتوابل',   'Huiles & Condiments', '🫒', 4),
    ('c1000000-0000-0000-0000-000000000005', 'tea-drinks',       'Tea & Drinks',         'الشاي والمشروبات',  'Thé & Boissons',      '🍵', 5),
    ('c1000000-0000-0000-0000-000000000006', 'dairy-eggs',       'Dairy & Eggs',         'الألبان والبيض',    'Produits Laitiers',   '🧀', 6),
    ('c1000000-0000-0000-0000-000000000007', 'preserved-foods',  'Preserved Foods',      'الأطعمة المعلبة',   'Conserves',           '🥫', 7)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- BRANDS  (10 Moroccan brands)
-- =============================================================================

INSERT INTO brands (id, slug, name, name_ar, name_fr, is_active) VALUES
    ('b1000000-0000-0000-0000-000000000001', 'kenz',       'Kenz',       'كنز',      'Kenz',       TRUE),
    ('b1000000-0000-0000-0000-000000000002', 'dari',       'Dari',       'داري',     'Dari',       TRUE),
    ('b1000000-0000-0000-0000-000000000003', 'tassili',    'Tassili',    'تاسيلي',   'Tassili',    TRUE),
    ('b1000000-0000-0000-0000-000000000004', 'wahran',     'Wahran',     'وهران',    'Wahran',     TRUE),
    ('b1000000-0000-0000-0000-000000000005', 'atlas',      'Atlas',      'أطلس',     'Atlas',      TRUE),
    ('b1000000-0000-0000-0000-000000000006', 'riad-zitoun','Riad Zitoun','رياض الزيتون','Riad Zitoun',TRUE),
    ('b1000000-0000-0000-0000-000000000007', 'safran-dor', 'Safran d''Or','زعفران الذهب','Safran d''Or',TRUE),
    ('b1000000-0000-0000-0000-000000000008', 'medina',     'Medina',     'المدينة',  'Medina',     TRUE),
    ('b1000000-0000-0000-0000-000000000009', 'baraka',     'Baraka',     'بركة',     'Baraka',     TRUE),
    ('b1000000-0000-0000-0000-00000000000a', 'douar',      'Douar',      'الدوار',   'Douar',      TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- PRODUCTS  (20 products)
-- =============================================================================

-- ── COUSCOUS & PASTA ────────────────────────────────────────────────────────

INSERT INTO products (id, slug, brand_id, category_id, name, name_ar, name_fr,
    description, base_price, image_urls, is_active, is_wholesale_enabled) VALUES
(
    'p1000000-0000-0000-0000-000000000001',
    'kenz-fine-couscous-1kg',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Kenz Fine Couscous 1kg',
    'كسكس كنز ناعم 1 كغ',
    'Couscous fin Kenz 1kg',
    'Premium fine couscous from Morocco, steamed and dried for perfect texture.',
    18.50, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000002',
    'kenz-angel-hair-pasta-500g',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Kenz Angel Hair Pasta 500g',
    'شعيرية كنز 500 غ',
    'Cheveux d''ange Kenz 500g',
    'Fine vermicelli pasta, traditional Moroccan style.',
    13.99, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000003',
    'dari-medium-couscous-5kg',
    'b1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000001',
    'Dari Medium Couscous 5kg',
    'كسكس داري متوسط 5 كغ',
    'Couscous moyen Dari 5kg',
    'Restaurant-grade medium couscous in 5kg catering pack.',
    75.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000004',
    'atlas-whole-wheat-couscous-1kg',
    'b1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000001',
    'Atlas Whole Wheat Couscous 1kg',
    'كسكس أطلس كامل القمح 1 كغ',
    'Couscous complet Atlas 1kg',
    'Wholegrain couscous, high fibre, nutty flavour.',
    22.00, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── SPICES & HERBS ──────────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000005',
    'safran-dor-ras-el-hanout-100g',
    'b1000000-0000-0000-0000-000000000007',
    'c1000000-0000-0000-0000-000000000002',
    'Safran d''Or Ras el Hanout 100g',
    'رأس الحانوت سافران دور 100 غ',
    'Ras el Hanout Safran d''Or 100g',
    'Authentic 28-spice Moroccan blend. Fragrant, warming, complex.',
    28.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000006',
    'baraka-cumin-powder-200g',
    'b1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000002',
    'Baraka Ground Cumin 200g',
    'كمون مطحون بركة 200 غ',
    'Cumin moulu Baraka 200g',
    'Stone-ground cumin, earthy and aromatic.',
    15.50, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000007',
    'medina-chermoula-spice-50g',
    'b1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000002',
    'Medina Chermoula Spice Mix 50g',
    'خلطة الشرمولة مدينة 50 غ',
    'Mélange Chermoula Medina 50g',
    'Classic Moroccan marinade blend with coriander, paprika and lemon.',
    19.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000008',
    'atlas-saffron-1g',
    'b1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000002',
    'Atlas Pure Saffron 1g',
    'زعفران أطلس نقي 1 غ',
    'Safran pur Atlas 1g',
    'Grade A Moroccan saffron threads from Taliouine region.',
    55.00, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── FLOUR & BAKING ──────────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000009',
    'tassili-semolina-fine-2kg',
    'b1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000003',
    'Tassili Fine Semolina 2kg',
    'سميد ناعم تاسيلي 2 كغ',
    'Semoule fine Tassili 2kg',
    'Fine durum wheat semolina for couscous, cakes and pastries.',
    21.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000010',
    'dari-whole-wheat-flour-5kg',
    'b1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000003',
    'Dari Whole Wheat Flour 5kg',
    'دقيق القمح الكامل داري 5 كغ',
    'Farine complète Dari 5kg',
    'Stone-milled wholegrain flour for bread and pastry.',
    39.00, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── OILS & CONDIMENTS ───────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000011',
    'riad-zitoun-argan-oil-250ml',
    'b1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000004',
    'Riad Zitoun Pure Argan Oil 250ml',
    'زيت الأرغان النقي رياض الزيتون 250 مل',
    'Huile d''argan pure Riad Zitoun 250ml',
    'Cold-pressed culinary argan oil from Agadir cooperatives.',
    89.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000012',
    'douar-olive-oil-extra-virgin-500ml',
    'b1000000-0000-0000-0000-00000000000a',
    'c1000000-0000-0000-0000-000000000004',
    'Douar Extra Virgin Olive Oil 500ml',
    'زيت الزيتون البكر الممتاز الدوار 500 مل',
    'Huile d''olive extra vierge Douar 500ml',
    'Single-estate Moroccan olive oil, fruity and balanced.',
    62.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000013',
    'wahran-harissa-paste-300g',
    'b1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000004',
    'Wahran Harissa Paste 300g',
    'هريسة وهران معجون 300 غ',
    'Pâte Harissa Wahran 300g',
    'Authentic harissa with sun-dried chilies, caraway and garlic.',
    24.50, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── TEA & DRINKS ────────────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000014',
    'atlas-gunpowder-green-tea-500g',
    'b1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000005',
    'Atlas Gunpowder Green Tea 500g',
    'شاي أطلس الأخضر البارود 500 غ',
    'Thé vert Atlas Gunpowder 500g',
    'Classic Moroccan mint tea base. Strong, smooth, traditional.',
    35.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000015',
    'baraka-dried-mint-100g',
    'b1000000-0000-0000-0000-000000000009',
    'c1000000-0000-0000-0000-000000000005',
    'Baraka Dried Mint 100g',
    'نعناع مجفف بركة 100 غ',
    'Menthe séchée Baraka 100g',
    'Sun-dried Moroccan spearmint for tea and cooking.',
    18.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000016',
    'medina-rose-water-250ml',
    'b1000000-0000-0000-0000-000000000008',
    'c1000000-0000-0000-0000-000000000005',
    'Medina Rose Water 250ml',
    'ماء الورد مدينة 250 مل',
    'Eau de rose Medina 250ml',
    'Triple-distilled Dades Valley rose water for drinks and pastries.',
    32.00, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── DAIRY & EGGS ────────────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000017',
    'kenz-smen-fermented-butter-400g',
    'b1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000006',
    'Kenz Smen Fermented Butter 400g',
    'سمن كنز مخمر 400 غ',
    'Smen beurre fermenté Kenz 400g',
    'Traditional preserved Moroccan butter. Aged 3 months, intensely savoury.',
    48.00, ARRAY[]::TEXT[], TRUE, TRUE
),

-- ── PRESERVED FOODS ─────────────────────────────────────────────────────────

(
    'p1000000-0000-0000-0000-000000000018',
    'riad-zitoun-preserved-lemons-jar-450g',
    'b1000000-0000-0000-0000-000000000006',
    'c1000000-0000-0000-0000-000000000007',
    'Riad Zitoun Preserved Lemons 450g',
    'الليمون المخلل رياض الزيتون 450 غ',
    'Citrons confits Riad Zitoun 450g',
    'Authentic salt-preserved Moroccan lemons. Essential for tagine.',
    27.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000019',
    'wahran-black-olives-kalamata-500g',
    'b1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000007',
    'Wahran Picholine Olives 500g',
    'زيتون بيشولين وهران 500 غ',
    'Olives Picholine Wahran 500g',
    'Cured Moroccan picholine olives in herb brine.',
    22.00, ARRAY[]::TEXT[], TRUE, TRUE
),
(
    'p1000000-0000-0000-0000-000000000020',
    'atlas-medjool-dates-1kg',
    'b1000000-0000-0000-0000-000000000005',
    'c1000000-0000-0000-0000-000000000007',
    'Atlas Medjool Dates 1kg',
    'تمر مجدول أطلس 1 كغ',
    'Dattes Medjool Atlas 1kg',
    'Premium Moroccan Medjool dates. Soft, caramel-sweet, naturally preserved.',
    85.00, ARRAY[]::TEXT[], TRUE, TRUE
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VARIANTS  (default variants for each product)
-- =============================================================================

INSERT INTO product_variants (id, product_id, sku, weight, weight_grams, retail_price, stock_quantity, is_active, sort_order)
VALUES
    -- Couscous & Pasta
    ('v1000000-0000-0000-0000-000000000001','p1000000-0000-0000-0000-000000000001','KENZ-COUS-1KG',    '1kg',  1000, 18.50, 500, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000002','p1000000-0000-0000-0000-000000000002','KENZ-AH-500G',     '500g',  500, 13.99, 500, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000003','p1000000-0000-0000-0000-000000000003','DARI-COUS-5KG',    '5kg',  5000, 75.00, 200, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000004','p1000000-0000-0000-0000-000000000004','ATLAS-WW-1KG',     '1kg',  1000, 22.00, 300, TRUE, 0),
    -- Spices
    ('v1000000-0000-0000-0000-000000000005','p1000000-0000-0000-0000-000000000005','SFRD-RH-100G',     '100g',  100, 28.00, 400, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000006','p1000000-0000-0000-0000-000000000006','BARA-CUM-200G',    '200g',  200, 15.50, 600, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000007','p1000000-0000-0000-0000-000000000007','MEDI-CHE-50G',     '50g',    50, 19.00, 350, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000008','p1000000-0000-0000-0000-000000000008','ATLS-SAFF-1G',     '1g',      1, 55.00, 150, TRUE, 0),
    -- Flour
    ('v1000000-0000-0000-0000-000000000009','p1000000-0000-0000-0000-000000000009','TASS-SEM-2KG',     '2kg',  2000, 21.00, 400, TRUE, 0),
    ('v1000000-0000-0000-0000-00000000000a','p1000000-0000-0000-0000-000000000010','DARI-WW-5KG',      '5kg',  5000, 39.00, 200, TRUE, 0),
    -- Oils
    ('v1000000-0000-0000-0000-00000000000b','p1000000-0000-0000-0000-000000000011','RZIT-ARG-250ML',   '250ml',  250, 89.00, 120, TRUE, 0),
    ('v1000000-0000-0000-0000-00000000000c','p1000000-0000-0000-0000-000000000012','DOUR-OO-500ML',    '500ml',  500, 62.00, 180, TRUE, 0),
    ('v1000000-0000-0000-0000-00000000000d','p1000000-0000-0000-0000-000000000013','WAHR-HAR-300G',    '300g',   300, 24.50, 300, TRUE, 0),
    -- Tea
    ('v1000000-0000-0000-0000-00000000000e','p1000000-0000-0000-0000-000000000014','ATLS-TEA-500G',    '500g',   500, 35.00, 250, TRUE, 0),
    ('v1000000-0000-0000-0000-00000000000f','p1000000-0000-0000-0000-000000000015','BARA-MINT-100G',   '100g',   100, 18.00, 400, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000010','p1000000-0000-0000-0000-000000000016','MEDI-ROSE-250ML',  '250ml',  250, 32.00, 200, TRUE, 0),
    -- Dairy
    ('v1000000-0000-0000-0000-000000000011','p1000000-0000-0000-0000-000000000017','KENZ-SMEN-400G',   '400g',   400, 48.00,  80, TRUE, 0),
    -- Preserved
    ('v1000000-0000-0000-0000-000000000012','p1000000-0000-0000-0000-000000000018','RZIT-PLM-450G',    '450g',   450, 27.00, 300, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000013','p1000000-0000-0000-0000-000000000019','WAHR-OLV-500G',    '500g',   500, 22.00, 350, TRUE, 0),
    ('v1000000-0000-0000-0000-000000000014','p1000000-0000-0000-0000-000000000020','ATLS-DAT-1KG',     '1kg',   1000, 85.00, 150, TRUE, 0)
ON CONFLICT (sku) DO NOTHING;

-- =============================================================================
-- PRICE TIERS (wholesale tiers for key products)
-- Tier logic: SELECT WHERE min_quantity <= :qty ORDER BY min_quantity DESC LIMIT 1
-- =============================================================================

INSERT INTO price_tiers (variant_id, min_quantity, price, label) VALUES
    -- Kenz Fine Couscous 1kg: 1-9 = 18.50, 10-49 = 16.50, 50+ = 14.50
    ('v1000000-0000-0000-0000-000000000001',  1, 18.50, NULL),
    ('v1000000-0000-0000-0000-000000000001', 10, 16.50, 'Case (10)'),
    ('v1000000-0000-0000-0000-000000000001', 50, 14.50, 'Pallet (50)'),

    -- Kenz Angel Hair 500g: 1-9 = 13.99, 10-49 = 12.50, 50+ = 11.20
    ('v1000000-0000-0000-0000-000000000002',  1, 13.99, NULL),
    ('v1000000-0000-0000-0000-000000000002', 10, 12.50, 'Case (10)'),
    ('v1000000-0000-0000-0000-000000000002', 50, 11.20, 'Pallet (50)'),

    -- Dari Couscous 5kg catering: 1 = 75.00, 5 = 68.00, 20 = 62.00
    ('v1000000-0000-0000-0000-000000000003',  1, 75.00, NULL),
    ('v1000000-0000-0000-0000-000000000003',  5, 68.00, 'Box (5)'),
    ('v1000000-0000-0000-0000-000000000003', 20, 62.00, 'Pallet (20)'),

    -- Atlas Whole Wheat Couscous: 1 = 22.00, 10= 20.00, 50 = 18.00
    ('v1000000-0000-0000-0000-000000000004',  1, 22.00, NULL),
    ('v1000000-0000-0000-0000-000000000004', 10, 20.00, 'Case (10)'),
    ('v1000000-0000-0000-0000-000000000004', 50, 18.00, 'Pallet (50)'),

    -- Ras el Hanout: 1 = 28.00, 12 = 25.00, 48 = 22.00
    ('v1000000-0000-0000-0000-000000000005',  1, 28.00, NULL),
    ('v1000000-0000-0000-0000-000000000005', 12, 25.00, 'Dozen (12)'),
    ('v1000000-0000-0000-0000-000000000005', 48, 22.00, 'Carton (48)'),

    -- Argan oil 250ml: 1 = 89.00, 6 = 82.00, 24 = 75.00
    ('v1000000-0000-0000-0000-00000000000b',  1, 89.00, NULL),
    ('v1000000-0000-0000-0000-00000000000b',  6, 82.00, 'Box (6)'),
    ('v1000000-0000-0000-0000-00000000000b', 24, 75.00, 'Carton (24)'),

    -- Olive Oil 500ml: 1 = 62.00, 6 = 57.00, 24 = 52.00
    ('v1000000-0000-0000-0000-00000000000c',  1, 62.00, NULL),
    ('v1000000-0000-0000-0000-00000000000c',  6, 57.00, 'Box (6)'),
    ('v1000000-0000-0000-0000-00000000000c', 24, 52.00, 'Carton (24)'),

    -- Green Tea 500g: 1 = 35.00, 10 = 31.00, 50 = 28.00
    ('v1000000-0000-0000-0000-00000000000e',  1, 35.00, NULL),
    ('v1000000-0000-0000-0000-00000000000e', 10, 31.00, 'Case (10)'),
    ('v1000000-0000-0000-0000-00000000000e', 50, 28.00, 'Pallet (50)'),

    -- Medjool Dates 1kg: 1 = 85.00, 5 = 78.00, 20 = 72.00
    ('v1000000-0000-0000-0000-000000000014',  1, 85.00, NULL),
    ('v1000000-0000-0000-0000-000000000014',  5, 78.00, 'Box (5)'),
    ('v1000000-0000-0000-0000-000000000014', 20, 72.00, 'Carton (20)')
ON CONFLICT (variant_id, min_quantity) DO NOTHING;

-- =============================================================================
-- BUSINESSES  (3 seed businesses – use stable UUIDs so they're removable)
-- NOTE: owner_user_id references auth.users. In production replace these
-- with real UIDs after creating the users. For local dev they are left as
-- placeholder values that will be updated when test users are created.
-- =============================================================================

-- Approved business: Al Noor Restaurant Group
INSERT INTO businesses (id, owner_user_id, name, legal_name, business_type,
    contact_email, contact_phone, address, status, approved_at) VALUES
(
    'biz00000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',  -- placeholder: replace with real UID
    'Al Noor Restaurant Group',
    'Al Noor Hospitality LLC',
    'restaurant',
    'orders@alnoorgroup.ae',
    '+971 4 555 0101',
    'Deira, Dubai, UAE',
    'approved',
    NOW()
) ON CONFLICT (id) DO NOTHING;

-- Pending business
INSERT INTO businesses (id, owner_user_id, name, legal_name, business_type,
    contact_email, contact_phone, status) VALUES
(
    'biz00000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000002',
    'Marrakech Spice Café',
    'Spice Route Hospitality FZ-LLC',
    'cafe',
    'info@marrakechcafe.ae',
    '+971 4 555 0202',
    'pending'
) ON CONFLICT (id) DO NOTHING;

-- Rejected business
INSERT INTO businesses (id, owner_user_id, name, legal_name, business_type,
    contact_email, contact_phone, status, rejection_reason) VALUES
(
    'biz00000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000003',
    'Desert Star Catering',
    NULL,
    'distributor',
    'contact@desertstar.ae',
    NULL,
    'rejected',
    'Incomplete trade license documentation.'
) ON CONFLICT (id) DO NOTHING;

-- =============================================================================
-- CREDIT ACCOUNT for approved business
-- Net 14 days, limit AED 10,000
-- =============================================================================

INSERT INTO credit_accounts (business_id, credit_limit, terms_days, status) VALUES
    ('biz00000-0000-0000-0000-000000000001', 10000.00, 14, 'active')
ON CONFLICT (business_id) DO NOTHING;

-- =============================================================================
-- ADMIN NOTES (sample notes on businesses)
-- =============================================================================
-- These require a real admin user UUID. We use a placeholder here.

INSERT INTO admin_notes (entity_type, entity_id, note, created_by) VALUES
    ('business', 'biz00000-0000-0000-0000-000000000001',
     'Approved after trade license verification. Reliable 3-year customer.',
     '00000000-0000-0000-0000-000000000099'),
    ('business', 'biz00000-0000-0000-0000-000000000003',
     'Rejected: trade license expired Dec 2023. Can re-apply with updated docs.',
     '00000000-0000-0000-0000-000000000099')
ON CONFLICT DO NOTHING;
