-- =============================================================================
-- OUROZ – Migration 055: BabMarrakesh Grocery Products (idempotent)
-- Adds ~40 curated Moroccan grocery products sourced from babmarrakesh.ae
-- with categories, variants, and wholesale price tiers.
-- =============================================================================

-- =============================================================================
-- NEW CATEGORIES
-- =============================================================================

INSERT INTO categories (slug, name, name_ar, name_fr, icon, sort_order) VALUES
    ('biscuits-snacks',   'Biscuits & Snacks',    'البسكويت والوجبات الخفيفة', 'Biscuits & Snacks',      '🍪', 8),
    ('sauces-dressings',  'Sauces & Dressings',   'الصلصات والتتبيلات',       'Sauces & Assaisonnements','🫙', 9),
    ('tuna-canned-fish',  'Tuna & Canned Fish',   'التونة والسمك المعلب',     'Thon & Poisson en Conserve','🐟', 10),
    ('bakery-sweets',     'Bakery & Sweets',       'المخبوزات والحلويات',       'Pâtisserie & Sucreries',  '🧁', 11)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- NEW BRANDS
-- =============================================================================

INSERT INTO brands (slug, name, name_ar, name_fr, is_active) VALUES
    ('damti',  'Damti',  'دمتي',  'Damti',  TRUE),
    ('hawaj',  'Hawaj',  'هواج',  'Hawaj',  TRUE)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- PRODUCTS (40 products)
-- Brand FKs use subqueries since 052 brands have auto-generated UUIDs.
-- =============================================================================

-- ── OILS & CONDIMENTS ─────────────────────────────────────────────────────────

INSERT INTO products (slug, brand_id, category_id, name, name_ar, name_fr,
    description, base_price, compare_price, image_urls, is_active, is_wholesale_enabled) VALUES
(
    'aicha-extra-virgin-olive-oil-1l',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'oils-condiments'),
    'Aicha Extra Virgin Olive Oil 1L',
    'زيت الزيتون البكر الممتاز عائشة 1 لتر',
    'Huile d''olive extra vierge Aicha 1L',
    'Premium cold-pressed Moroccan olive oil. Rich, fruity flavor perfect for salads and cooking.',
    45.00, 52.00, ARRAY['https://placehold.co/600x600/2d5016/ffffff?text=Aicha+Olive+Oil']::TEXT[], TRUE, TRUE
),
(
    'aicha-sunflower-oil-5l',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'oils-condiments'),
    'Aicha Sunflower Oil 5L',
    'زيت عباد الشمس عائشة 5 لتر',
    'Huile de tournesol Aicha 5L',
    'Light cooking sunflower oil in bulk 5-litre bottle. Ideal for frying and baking.',
    65.00, NULL, ARRAY['https://placehold.co/600x600/f5c518/333333?text=Aicha+Sunflower+5L']::TEXT[], TRUE, TRUE
),
(
    'sultan-white-vinegar-500ml',
    (SELECT id FROM brands WHERE slug = 'sultan'),
    (SELECT id FROM categories WHERE slug = 'oils-condiments'),
    'Sultan White Vinegar 500ml',
    'خل أبيض سلطان 500 مل',
    'Vinaigre blanc Sultan 500ml',
    'Crystal clear white vinegar for pickling, dressings and Moroccan salads.',
    8.50, NULL, ARRAY['https://placehold.co/600x600/e8e8e8/333333?text=Sultan+Vinegar']::TEXT[], TRUE, FALSE
),
(
    'house-of-argan-culinary-argan-oil-250ml',
    (SELECT id FROM brands WHERE slug = 'house-of-argan'),
    (SELECT id FROM categories WHERE slug = 'oils-condiments'),
    'House of Argan Culinary Argan Oil 250ml',
    'زيت الأرغان الغذائي هاوس أوف أرغان 250 مل',
    'Huile d''argan culinaire House of Argan 250ml',
    'Artisan-roasted argan oil from Souss-Massa. Nutty, rich, and perfect for amlou and drizzling.',
    95.00, 110.00, ARRAY['https://placehold.co/600x600/c9a84c/ffffff?text=Argan+Oil']::TEXT[], TRUE, TRUE
),
(
    'oued-souss-argan-amlou-350g',
    (SELECT id FROM brands WHERE slug = 'oued-souss'),
    (SELECT id FROM categories WHERE slug = 'oils-condiments'),
    'Oued Souss Argan Amlou 350g',
    'أملو بزيت الأرغان أود سوس 350 غ',
    'Amlou à l''argan Oued Souss 350g',
    'Traditional Moroccan almond and argan oil spread with honey. A Berber delicacy.',
    58.00, NULL, ARRAY['https://placehold.co/600x600/8B6914/ffffff?text=Amlou+Argan']::TEXT[], TRUE, TRUE
),

-- ── PRESERVES & JAMS ──────────────────────────────────────────────────────────

(
    'aicha-apricot-jam-430g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'preserved-foods'),
    'Aicha Apricot Jam 430g',
    'مربى المشمش عائشة 430 غ',
    'Confiture d''abricot Aicha 430g',
    'Smooth apricot preserve made with sun-ripened Moroccan apricots.',
    18.00, 22.00, ARRAY['https://placehold.co/600x600/f5a623/ffffff?text=Aicha+Apricot+Jam']::TEXT[], TRUE, FALSE
),
(
    'aicha-fig-jam-430g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'preserved-foods'),
    'Aicha Fig Jam 430g',
    'مربى التين عائشة 430 غ',
    'Confiture de figue Aicha 430g',
    'Rich fig preserve with pieces of Moroccan figs. Perfect with fresh bread and cheese.',
    19.50, NULL, ARRAY['https://placehold.co/600x600/7a4b2e/ffffff?text=Aicha+Fig+Jam']::TEXT[], TRUE, FALSE
),
(
    'aicha-orange-marmalade-430g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'preserved-foods'),
    'Aicha Orange Marmalade 430g',
    'مربى البرتقال عائشة 430 غ',
    'Marmelade d''orange Aicha 430g',
    'Bittersweet orange marmalade with peel. A breakfast classic.',
    17.50, NULL, ARRAY['https://placehold.co/600x600/ff8c00/ffffff?text=Aicha+Orange']::TEXT[], TRUE, FALSE
),
(
    'aicha-strawberry-jam-430g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'preserved-foods'),
    'Aicha Strawberry Jam 430g',
    'مربى الفراولة عائشة 430 غ',
    'Confiture de fraise Aicha 430g',
    'Whole strawberry preserve made from Moroccan strawberries.',
    18.50, NULL, ARRAY['https://placehold.co/600x600/dc143c/ffffff?text=Aicha+Strawberry']::TEXT[], TRUE, FALSE
),
(
    'aicha-honey-pure-500g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'preserved-foods'),
    'Aicha Pure Honey 500g',
    'عسل نقي عائشة 500 غ',
    'Miel pur Aicha 500g',
    'Pure Moroccan multi-flower honey. Natural sweetener for tea, pastries and cooking.',
    42.00, 48.00, ARRAY['https://placehold.co/600x600/daa520/ffffff?text=Aicha+Honey']::TEXT[], TRUE, TRUE
),

-- ── SAUCES & DRESSINGS ────────────────────────────────────────────────────────

(
    'aicha-harissa-paste-380g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'sauces-dressings'),
    'Aicha Harissa Paste 380g',
    'هريسة عائشة 380 غ',
    'Harissa Aicha 380g',
    'Authentic North African chili paste. Spicy, smoky, and aromatic.',
    14.00, NULL, ARRAY['https://placehold.co/600x600/c0392b/ffffff?text=Aicha+Harissa']::TEXT[], TRUE, TRUE
),
(
    'aicha-double-concentrate-tomato-780g',
    (SELECT id FROM brands WHERE slug = 'aicha'),
    (SELECT id FROM categories WHERE slug = 'sauces-dressings'),
    'Aicha Double Concentrate Tomato Paste 780g',
    'معجون الطماطم المركز عائشة 780 غ',
    'Double concentré de tomates Aicha 780g',
    'Rich double-concentrate tomato paste. Essential for tagines, stews and sauces.',
    12.50, NULL, ARRAY['https://placehold.co/600x600/e74c3c/ffffff?text=Aicha+Tomato']::TEXT[], TRUE, TRUE
),
(
    'knorr-mayonnaise-500ml',
    (SELECT id FROM brands WHERE slug = 'knorr'),
    (SELECT id FROM categories WHERE slug = 'sauces-dressings'),
    'Knorr Mayonnaise 500ml',
    'مايونيز كنور 500 مل',
    'Mayonnaise Knorr 500ml',
    'Creamy mayonnaise with a smooth, tangy taste. Versatile condiment.',
    16.00, NULL, ARRAY['https://placehold.co/600x600/f1c40f/333333?text=Knorr+Mayo']::TEXT[], TRUE, FALSE
),
(
    'knorr-ketchup-500ml',
    (SELECT id FROM brands WHERE slug = 'knorr'),
    (SELECT id FROM categories WHERE slug = 'sauces-dressings'),
    'Knorr Tomato Ketchup 500ml',
    'كاتشب الطماطم كنور 500 مل',
    'Ketchup Knorr 500ml',
    'Classic tomato ketchup with balanced sweet and tangy flavour.',
    14.00, NULL, ARRAY['https://placehold.co/600x600/e74c3c/ffffff?text=Knorr+Ketchup']::TEXT[], TRUE, FALSE
),
(
    'star-mustard-dijon-200g',
    (SELECT id FROM brands WHERE slug = 'star'),
    (SELECT id FROM categories WHERE slug = 'sauces-dressings'),
    'Star Dijon Mustard 200g',
    'مسطردة ديجون ستار 200 غ',
    'Moutarde de Dijon Star 200g',
    'Smooth French-style Dijon mustard. Strong and aromatic.',
    12.00, NULL, ARRAY['https://placehold.co/600x600/d4a017/333333?text=Star+Mustard']::TEXT[], TRUE, FALSE
),

-- ── BISCUITS & SNACKS ─────────────────────────────────────────────────────────

(
    'bimo-prince-chocolate-biscuit-80g',
    (SELECT id FROM brands WHERE slug = 'bimo'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Bimo Prince Chocolate Biscuit 80g',
    'بسكويت برنس شوكولاتة بيمو 80 غ',
    'Biscuit Prince chocolat Bimo 80g',
    'Iconic Moroccan chocolate-filled sandwich biscuit. A childhood favourite.',
    5.50, NULL, ARRAY['https://placehold.co/600x600/5c3317/ffffff?text=Bimo+Prince']::TEXT[], TRUE, FALSE
),
(
    'bimo-tagger-vanilla-125g',
    (SELECT id FROM brands WHERE slug = 'bimo'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Bimo Tagger Vanilla 125g',
    'تاغر فانيلا بيمو 125 غ',
    'Tagger vanille Bimo 125g',
    'Crispy vanilla-flavoured biscuit sticks. Light and satisfying snack.',
    6.00, NULL, ARRAY['https://placehold.co/600x600/fef3c7/333333?text=Bimo+Tagger']::TEXT[], TRUE, FALSE
),
(
    'bimo-golden-crackers-200g',
    (SELECT id FROM brands WHERE slug = 'bimo'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Bimo Golden Crackers 200g',
    'كراكرز ذهبية بيمو 200 غ',
    'Crackers dorés Bimo 200g',
    'Savoury golden crackers. Perfect for dips, cheese, or on their own.',
    7.00, NULL, ARRAY['https://placehold.co/600x600/daa520/333333?text=Bimo+Golden']::TEXT[], TRUE, FALSE
),
(
    'bimo-petit-beurre-200g',
    (SELECT id FROM brands WHERE slug = 'bimo'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Bimo Petit Beurre 200g',
    'بيتي بور بيمو 200 غ',
    'Petit Beurre Bimo 200g',
    'Traditional butter biscuits. Classic with Moroccan mint tea.',
    6.50, NULL, ARRAY['https://placehold.co/600x600/f5deb3/333333?text=Bimo+Petit+Beurre']::TEXT[], TRUE, FALSE
),
(
    'joly-wafer-chocolate-150g',
    (SELECT id FROM brands WHERE slug = 'joly'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Joly Chocolate Wafer 150g',
    'ويفر شوكولاتة جولي 150 غ',
    'Gaufrette chocolat Joly 150g',
    'Crispy layered wafer with chocolate cream filling.',
    8.00, NULL, ARRAY['https://placehold.co/600x600/5c3317/ffffff?text=Joly+Wafer']::TEXT[], TRUE, FALSE
),
(
    'bimo-cookies-choco-chips-200g',
    (SELECT id FROM brands WHERE slug = 'bimo'),
    (SELECT id FROM categories WHERE slug = 'biscuits-snacks'),
    'Bimo Cookies Choco Chips 200g',
    'كوكيز رقائق الشوكولاتة بيمو 200 غ',
    'Cookies pépites de chocolat Bimo 200g',
    'Soft-baked cookies loaded with chocolate chips.',
    9.50, NULL, ARRAY['https://placehold.co/600x600/8B4513/ffffff?text=Bimo+Cookies']::TEXT[], TRUE, FALSE
),

-- ── TEA & BEVERAGES ───────────────────────────────────────────────────────────

(
    'sultan-green-tea-gunpowder-200g',
    (SELECT id FROM brands WHERE slug = 'sultan'),
    (SELECT id FROM categories WHERE slug = 'tea-drinks'),
    'Sultan Gunpowder Green Tea 200g',
    'شاي أخضر البارود سلطان 200 غ',
    'Thé vert Gunpowder Sultan 200g',
    'Premium Chinese gunpowder green tea. The essential base for Moroccan mint tea.',
    22.00, 26.00, ARRAY['https://placehold.co/600x600/2d5016/ffffff?text=Sultan+Green+Tea']::TEXT[], TRUE, TRUE
),
(
    'sultan-green-tea-special-500g',
    (SELECT id FROM brands WHERE slug = 'sultan'),
    (SELECT id FROM categories WHERE slug = 'tea-drinks'),
    'Sultan Special Green Tea 500g',
    'شاي أخضر خاص سلطان 500 غ',
    'Thé vert spécial Sultan 500g',
    'Large family-size pack of Sultan''s premium green tea blend.',
    45.00, 52.00, ARRAY['https://placehold.co/600x600/1a5e1a/ffffff?text=Sultan+Tea+500g']::TEXT[], TRUE, TRUE
),
(
    'damti-mint-tea-bags-25pcs',
    (SELECT id FROM brands WHERE slug = 'damti'),
    (SELECT id FROM categories WHERE slug = 'tea-drinks'),
    'Damti Moroccan Mint Tea Bags 25pcs',
    'أكياس شاي النعناع المغربي دمتي 25 كيس',
    'Sachets thé menthe marocain Damti 25pcs',
    'Convenient tea bags combining green tea with fresh Moroccan spearmint.',
    15.00, NULL, ARRAY['https://placehold.co/600x600/16a085/ffffff?text=Damti+Mint+Tea']::TEXT[], TRUE, FALSE
),
(
    'asta-cafe-moroccan-coffee-250g',
    (SELECT id FROM brands WHERE slug = 'asta-cafe'),
    (SELECT id FROM categories WHERE slug = 'tea-drinks'),
    'Asta Cafe Moroccan Coffee 250g',
    'قهوة مغربية أسطا كافي 250 غ',
    'Café marocain Asta Café 250g',
    'Finely ground Moroccan-style spiced coffee with hints of cinnamon and cardamom.',
    28.00, NULL, ARRAY['https://placehold.co/600x600/3e2723/ffffff?text=Asta+Cafe']::TEXT[], TRUE, TRUE
),
(
    'sultan-chamomile-herbal-tea-20pcs',
    (SELECT id FROM brands WHERE slug = 'sultan'),
    (SELECT id FROM categories WHERE slug = 'tea-drinks'),
    'Sultan Chamomile Herbal Tea 20pcs',
    'شاي البابونج سلطان 20 كيس',
    'Infusion camomille Sultan 20 sachets',
    'Calming chamomile herbal infusion. Naturally caffeine-free.',
    12.00, NULL, ARRAY['https://placehold.co/600x600/f5e6b8/333333?text=Sultan+Chamomile']::TEXT[], TRUE, FALSE
),

-- ── TUNA & CANNED FISH ───────────────────────────────────────────────────────

(
    'isabel-tuna-olive-oil-160g',
    (SELECT id FROM brands WHERE slug = 'isabel'),
    (SELECT id FROM categories WHERE slug = 'tuna-canned-fish'),
    'Isabel Tuna in Olive Oil 160g',
    'تونة إيزابيل في زيت الزيتون 160 غ',
    'Thon Isabel à l''huile d''olive 160g',
    'Premium tuna chunks in extra virgin olive oil. Rich and flavourful.',
    14.00, NULL, ARRAY['https://placehold.co/600x600/1a5276/ffffff?text=Isabel+Tuna']::TEXT[], TRUE, TRUE
),
(
    'isabel-tuna-sunflower-oil-160g',
    (SELECT id FROM brands WHERE slug = 'isabel'),
    (SELECT id FROM categories WHERE slug = 'tuna-canned-fish'),
    'Isabel Tuna in Sunflower Oil 160g',
    'تونة إيزابيل في زيت عباد الشمس 160 غ',
    'Thon Isabel à l''huile de tournesol 160g',
    'Light tuna in sunflower oil. Versatile for sandwiches and salads.',
    12.00, NULL, ARRAY['https://placehold.co/600x600/2980b9/ffffff?text=Isabel+Tuna+SO']::TEXT[], TRUE, TRUE
),
(
    'isabel-sardines-olive-oil-125g',
    (SELECT id FROM brands WHERE slug = 'isabel'),
    (SELECT id FROM categories WHERE slug = 'tuna-canned-fish'),
    'Isabel Sardines in Olive Oil 125g',
    'سردين إيزابيل في زيت الزيتون 125 غ',
    'Sardines Isabel à l''huile d''olive 125g',
    'Whole Moroccan sardines in olive oil. Rich in Omega-3.',
    10.00, NULL, ARRAY['https://placehold.co/600x600/154360/ffffff?text=Isabel+Sardines']::TEXT[], TRUE, TRUE
),
(
    'isabel-mackerel-tomato-sauce-125g',
    (SELECT id FROM brands WHERE slug = 'isabel'),
    (SELECT id FROM categories WHERE slug = 'tuna-canned-fish'),
    'Isabel Mackerel in Tomato Sauce 125g',
    'ماكريل إيزابيل في صلصة الطماطم 125 غ',
    'Maquereau Isabel sauce tomate 125g',
    'Tender mackerel fillets in rich tomato sauce.',
    11.00, NULL, ARRAY['https://placehold.co/600x600/e74c3c/ffffff?text=Isabel+Mackerel']::TEXT[], TRUE, TRUE
),
(
    'jibal-tuna-spicy-160g',
    (SELECT id FROM brands WHERE slug = 'jibal'),
    (SELECT id FROM categories WHERE slug = 'tuna-canned-fish'),
    'Jibal Spicy Tuna 160g',
    'تونة حارة جبال 160 غ',
    'Thon pimenté Jibal 160g',
    'Spicy Moroccan-style tuna with harissa and peppers.',
    15.00, NULL, ARRAY['https://placehold.co/600x600/c0392b/ffffff?text=Jibal+Spicy+Tuna']::TEXT[], TRUE, TRUE
),

-- ── SPICES & HERBS ────────────────────────────────────────────────────────────

(
    'hawaj-ras-el-hanout-premium-100g',
    (SELECT id FROM brands WHERE slug = 'hawaj'),
    (SELECT id FROM categories WHERE slug = 'spices-herbs'),
    'Hawaj Ras el Hanout Premium 100g',
    'رأس الحانوت الفاخر هواج 100 غ',
    'Ras el Hanout premium Hawaj 100g',
    'Hand-blended 27-spice Moroccan ras el hanout. Aromatic, warming, and complex.',
    32.00, 38.00, ARRAY['https://placehold.co/600x600/8B4513/ffffff?text=Ras+el+Hanout']::TEXT[], TRUE, TRUE
),
(
    'hawaj-cumin-ground-200g',
    (SELECT id FROM brands WHERE slug = 'hawaj'),
    (SELECT id FROM categories WHERE slug = 'spices-herbs'),
    'Hawaj Ground Cumin 200g',
    'كمون مطحون هواج 200 غ',
    'Cumin moulu Hawaj 200g',
    'Stone-ground cumin powder. Essential Moroccan cooking spice.',
    14.00, NULL, ARRAY['https://placehold.co/600x600/b8860b/ffffff?text=Hawaj+Cumin']::TEXT[], TRUE, TRUE
),
(
    'hawaj-paprika-sweet-150g',
    (SELECT id FROM brands WHERE slug = 'hawaj'),
    (SELECT id FROM categories WHERE slug = 'spices-herbs'),
    'Hawaj Sweet Paprika 150g',
    'بابريكا حلوة هواج 150 غ',
    'Paprika doux Hawaj 150g',
    'Vibrant sweet paprika from sun-dried Moroccan peppers.',
    12.00, NULL, ARRAY['https://placehold.co/600x600/dc143c/ffffff?text=Hawaj+Paprika']::TEXT[], TRUE, TRUE
),
(
    'hawaj-turmeric-powder-150g',
    (SELECT id FROM brands WHERE slug = 'hawaj'),
    (SELECT id FROM categories WHERE slug = 'spices-herbs'),
    'Hawaj Turmeric Powder 150g',
    'كركم مطحون هواج 150 غ',
    'Curcuma moulu Hawaj 150g',
    'Bright golden turmeric. Anti-inflammatory superfood and cooking essential.',
    13.00, NULL, ARRAY['https://placehold.co/600x600/f39c12/333333?text=Hawaj+Turmeric']::TEXT[], TRUE, TRUE
),

-- ── BAKERY & SWEETS ──────────────────────────────────────────────────────────

(
    'moroccan-heritage-fekkas-almonds-300g',
    (SELECT id FROM brands WHERE slug = 'moroccan-heritage'),
    (SELECT id FROM categories WHERE slug = 'bakery-sweets'),
    'Moroccan Heritage Fekkas with Almonds 300g',
    'فقاص باللوز التراث المغربي 300 غ',
    'Fekkas aux amandes Héritage Marocain 300g',
    'Traditional twice-baked Moroccan biscotti with roasted almonds and anise.',
    25.00, NULL, ARRAY['https://placehold.co/600x600/d2b48c/333333?text=Fekkas+Almonds']::TEXT[], TRUE, FALSE
),
(
    'moroccan-heritage-chebakia-500g',
    (SELECT id FROM brands WHERE slug = 'moroccan-heritage'),
    (SELECT id FROM categories WHERE slug = 'bakery-sweets'),
    'Moroccan Heritage Chebakia 500g',
    'شباكية التراث المغربي 500 غ',
    'Chebakia Héritage Marocain 500g',
    'Flower-shaped sesame cookies glazed with honey. Traditional Ramadan sweet.',
    38.00, NULL, ARRAY['https://placehold.co/600x600/cd853f/ffffff?text=Chebakia']::TEXT[], TRUE, FALSE
),
(
    'moroccan-heritage-ghriba-coconut-400g',
    (SELECT id FROM brands WHERE slug = 'moroccan-heritage'),
    (SELECT id FROM categories WHERE slug = 'bakery-sweets'),
    'Moroccan Heritage Ghriba Coconut 400g',
    'غريبة جوز الهند التراث المغربي 400 غ',
    'Ghriba coco Héritage Marocain 400g',
    'Soft, crumbly coconut cookies. A beloved Moroccan tea-time treat.',
    22.00, NULL, ARRAY['https://placehold.co/600x600/f5deb3/333333?text=Ghriba+Coconut']::TEXT[], TRUE, FALSE
),
(
    'moroccan-heritage-medjool-dates-premium-1kg',
    (SELECT id FROM brands WHERE slug = 'moroccan-heritage'),
    (SELECT id FROM categories WHERE slug = 'bakery-sweets'),
    'Moroccan Heritage Premium Medjool Dates 1kg',
    'تمر مجهول فاخر التراث المغربي 1 كغ',
    'Dattes Medjool premium Héritage Marocain 1kg',
    'Large, soft premium Medjool dates from the Draa Valley. Naturally sweet.',
    78.00, 89.00, ARRAY['https://placehold.co/600x600/8B4513/ffffff?text=Medjool+Dates']::TEXT[], TRUE, TRUE
),

-- ── FLOUR & BAKING (additions) ────────────────────────────────────────────────

(
    'dari-fine-semolina-1kg',
    (SELECT id FROM brands WHERE slug = 'dari'),
    (SELECT id FROM categories WHERE slug = 'flour-baking'),
    'Dari Fine Semolina 1kg',
    'سميد ناعم داري 1 كغ',
    'Semoule fine Dari 1kg',
    'Fine durum wheat semolina for couscous, harcha and Moroccan pastries.',
    12.00, NULL, ARRAY['https://placehold.co/600x600/f5deb3/333333?text=Dari+Semolina']::TEXT[], TRUE, TRUE
),
(
    'alsa-baking-powder-100g',
    (SELECT id FROM brands WHERE slug = 'alsa'),
    (SELECT id FROM categories WHERE slug = 'flour-baking'),
    'Alsa Baking Powder 100g',
    'خميرة الحلويات ألسا 100 غ',
    'Levure chimique Alsa 100g',
    'Reliable baking powder for cakes, msemmen and Moroccan pastries.',
    6.00, NULL, ARRAY['https://placehold.co/600x600/ffffff/333333?text=Alsa+Baking']::TEXT[], TRUE, FALSE
)
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- VARIANTS (one per product, SKU prefix BM- to avoid collision with OZ- seeds)
-- =============================================================================

INSERT INTO product_variants (product_id, sku, weight, weight_grams, retail_price, stock_quantity, is_active, sort_order) VALUES
    -- Oils & Condiments
    ((SELECT id FROM products WHERE slug = 'aicha-extra-virgin-olive-oil-1l'),      'BM-OIL-001', '1L',    1000, 45.00, 120, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-sunflower-oil-5l'),               'BM-OIL-002', '5L',    5000, 65.00,  80, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'sultan-white-vinegar-500ml'),            'BM-OIL-003', '500ml',  500,  8.50, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'house-of-argan-culinary-argan-oil-250ml'),'BM-OIL-004','250ml',  250, 95.00,  60, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'oued-souss-argan-amlou-350g'),           'BM-OIL-005', '350g',   350, 58.00,  80, TRUE, 0),

    -- Preserves & Jams
    ((SELECT id FROM products WHERE slug = 'aicha-apricot-jam-430g'),       'BM-JAM-001', '430g', 430, 18.00, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-fig-jam-430g'),           'BM-JAM-002', '430g', 430, 19.50, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-orange-marmalade-430g'),  'BM-JAM-003', '430g', 430, 17.50, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-strawberry-jam-430g'),    'BM-JAM-004', '430g', 430, 18.50, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-honey-pure-500g'),        'BM-JAM-005', '500g', 500, 42.00, 100, TRUE, 0),

    -- Sauces & Dressings
    ((SELECT id FROM products WHERE slug = 'aicha-harissa-paste-380g'),              'BM-SAU-001', '380g', 380, 14.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'aicha-double-concentrate-tomato-780g'),  'BM-SAU-002', '780g', 780, 12.50, 180, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'knorr-mayonnaise-500ml'),                'BM-SAU-003', '500ml',500, 16.00, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'knorr-ketchup-500ml'),                   'BM-SAU-004', '500ml',500, 14.00, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'star-mustard-dijon-200g'),               'BM-SAU-005', '200g', 200, 12.00, 120, TRUE, 0),

    -- Biscuits & Snacks
    ((SELECT id FROM products WHERE slug = 'bimo-prince-chocolate-biscuit-80g'), 'BM-BSC-001', '80g',  80,  5.50, 300, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'bimo-tagger-vanilla-125g'),          'BM-BSC-002', '125g',125,  6.00, 300, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'bimo-golden-crackers-200g'),         'BM-BSC-003', '200g',200,  7.00, 250, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'bimo-petit-beurre-200g'),            'BM-BSC-004', '200g',200,  6.50, 250, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'joly-wafer-chocolate-150g'),         'BM-BSC-005', '150g',150,  8.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'bimo-cookies-choco-chips-200g'),     'BM-BSC-006', '200g',200,  9.50, 200, TRUE, 0),

    -- Tea & Beverages
    ((SELECT id FROM products WHERE slug = 'sultan-green-tea-gunpowder-200g'),   'BM-TEA-001', '200g', 200, 22.00, 180, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'sultan-green-tea-special-500g'),     'BM-TEA-002', '500g', 500, 45.00, 120, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'damti-mint-tea-bags-25pcs'),         'BM-TEA-003', '25pcs', 50, 15.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'asta-cafe-moroccan-coffee-250g'),    'BM-TEA-004', '250g', 250, 28.00, 100, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'sultan-chamomile-herbal-tea-20pcs'), 'BM-TEA-005', '20pcs', 40, 12.00, 150, TRUE, 0),

    -- Tuna & Canned Fish
    ((SELECT id FROM products WHERE slug = 'isabel-tuna-olive-oil-160g'),        'BM-TUN-001', '160g', 160, 14.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'isabel-tuna-sunflower-oil-160g'),    'BM-TUN-002', '160g', 160, 12.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'isabel-sardines-olive-oil-125g'),    'BM-TUN-003', '125g', 125, 10.00, 250, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'isabel-mackerel-tomato-sauce-125g'), 'BM-TUN-004', '125g', 125, 11.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'jibal-tuna-spicy-160g'),             'BM-TUN-005', '160g', 160, 15.00, 150, TRUE, 0),

    -- Spices & Herbs
    ((SELECT id FROM products WHERE slug = 'hawaj-ras-el-hanout-premium-100g'),  'BM-SPI-001', '100g', 100, 32.00, 150, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'hawaj-cumin-ground-200g'),           'BM-SPI-002', '200g', 200, 14.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'hawaj-paprika-sweet-150g'),          'BM-SPI-003', '150g', 150, 12.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'hawaj-turmeric-powder-150g'),        'BM-SPI-004', '150g', 150, 13.00, 200, TRUE, 0),

    -- Bakery & Sweets
    ((SELECT id FROM products WHERE slug = 'moroccan-heritage-fekkas-almonds-300g'),         'BM-BAK-001', '300g', 300, 25.00, 100, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'moroccan-heritage-chebakia-500g'),               'BM-BAK-002', '500g', 500, 38.00,  80, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'moroccan-heritage-ghriba-coconut-400g'),         'BM-BAK-003', '400g', 400, 22.00, 100, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'moroccan-heritage-medjool-dates-premium-1kg'),   'BM-BAK-004', '1kg', 1000, 78.00,  60, TRUE, 0),

    -- Flour & Baking (additions)
    ((SELECT id FROM products WHERE slug = 'dari-fine-semolina-1kg'),  'BM-FLR-001', '1kg', 1000, 12.00, 200, TRUE, 0),
    ((SELECT id FROM products WHERE slug = 'alsa-baking-powder-100g'),'BM-FLR-002', '100g', 100,  6.00, 300, TRUE, 0)
ON CONFLICT (sku) DO NOTHING;

-- =============================================================================
-- WHOLESALE PRICE TIERS (for bulk-friendly products)
-- Tier logic: qty 6+ → ~8% off, qty 12+ → ~15% off
-- =============================================================================

INSERT INTO price_tiers (variant_id, min_quantity, price, label) VALUES
    -- Aicha Olive Oil 1L
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-001'),  6, 41.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-001'), 12, 38.00, 'Case (12)'),

    -- Aicha Sunflower Oil 5L
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-002'),  4, 60.00, 'Box (4)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-002'), 12, 55.00, 'Pallet (12)'),

    -- House of Argan Oil 250ml
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-004'),  6, 88.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-OIL-004'), 12, 80.00, 'Case (12)'),

    -- Aicha Harissa 380g
    ((SELECT id FROM product_variants WHERE sku = 'BM-SAU-001'),  6, 13.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-SAU-001'), 24, 11.50, 'Carton (24)'),

    -- Aicha Tomato Paste 780g
    ((SELECT id FROM product_variants WHERE sku = 'BM-SAU-002'),  6, 11.50, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-SAU-002'), 24, 10.00, 'Carton (24)'),

    -- Sultan Green Tea 200g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-001'),  6, 20.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-001'), 24, 18.50, 'Carton (24)'),

    -- Sultan Green Tea 500g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-002'),  6, 42.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-002'), 12, 38.00, 'Case (12)'),

    -- Isabel Tuna Olive Oil 160g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-001'),  6, 13.00, 'Pack (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-001'), 24, 11.50, 'Carton (24)'),

    -- Isabel Tuna Sunflower 160g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-002'),  6, 11.00, 'Pack (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-002'), 24,  9.80, 'Carton (24)'),

    -- Isabel Sardines 125g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-003'),  6,  9.20, 'Pack (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TUN-003'), 24,  8.00, 'Carton (24)'),

    -- Hawaj Ras el Hanout 100g
    ((SELECT id FROM product_variants WHERE sku = 'BM-SPI-001'),  6, 29.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-SPI-001'), 12, 27.00, 'Case (12)'),

    -- Moroccan Heritage Medjool Dates 1kg
    ((SELECT id FROM product_variants WHERE sku = 'BM-BAK-004'),  5, 72.00, 'Box (5)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-BAK-004'), 10, 66.00, 'Case (10)'),

    -- Dari Semolina 1kg
    ((SELECT id FROM product_variants WHERE sku = 'BM-FLR-001'), 10, 11.00, 'Case (10)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-FLR-001'), 50,  9.50, 'Pallet (50)'),

    -- Aicha Honey 500g
    ((SELECT id FROM product_variants WHERE sku = 'BM-JAM-005'),  6, 38.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-JAM-005'), 12, 35.00, 'Case (12)'),

    -- Asta Cafe Coffee 250g
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-004'),  6, 26.00, 'Box (6)'),
    ((SELECT id FROM product_variants WHERE sku = 'BM-TEA-004'), 12, 24.00, 'Case (12)')
ON CONFLICT (variant_id, min_quantity) DO NOTHING;
