/**
 * OUROZ – Static demo data for development without Supabase.
 * Mirrors V2 schema types so the shop renders immediately.
 */

import type { V2Brand, V2Category, V2ProductCard } from './api';

// =============================================================================
// CATEGORIES
// =============================================================================

export const DEMO_CATEGORIES: V2Category[] = [
    { id: 'c-oils',     slug: 'oils-condiments',  parent_id: null, name: 'Oils & Condiments',  name_ar: 'الزيوت والتوابل',        name_fr: 'Huiles & Condiments',        icon: '\u{1FAD2}', image_url: null, sort_order: 1, is_active: true, created_at: '' },
    { id: 'c-preserved',slug: 'preserved-foods',  parent_id: null, name: 'Preserves & Jams',   name_ar: 'المربيات والمحفوظات',     name_fr: 'Confitures & Conserves',     icon: '\u{1F96B}', image_url: null, sort_order: 2, is_active: true, created_at: '' },
    { id: 'c-sauces',   slug: 'sauces-dressings', parent_id: null, name: 'Sauces & Dressings', name_ar: 'الصلصات والتتبيلات',      name_fr: 'Sauces & Assaisonnements',   icon: '\u{1FAD9}', image_url: null, sort_order: 3, is_active: true, created_at: '' },
    { id: 'c-biscuits', slug: 'biscuits-snacks',  parent_id: null, name: 'Biscuits & Snacks',  name_ar: 'البسكويت والوجبات الخفيفة',name_fr: 'Biscuits & Snacks',           icon: '\u{1F36A}', image_url: null, sort_order: 4, is_active: true, created_at: '' },
    { id: 'c-tea',      slug: 'tea-drinks',       parent_id: null, name: 'Tea & Beverages',    name_ar: 'الشاي والمشروبات',        name_fr: 'Th\u00e9 & Boissons',        icon: '\u{1F375}', image_url: null, sort_order: 5, is_active: true, created_at: '' },
    { id: 'c-tuna',     slug: 'tuna-canned-fish', parent_id: null, name: 'Tuna & Canned Fish', name_ar: 'التونة والسمك المعلب',    name_fr: 'Thon & Poisson en Conserve', icon: '\u{1F41F}', image_url: null, sort_order: 6, is_active: true, created_at: '' },
    { id: 'c-spices',   slug: 'spices-herbs',     parent_id: null, name: 'Spices & Herbs',     name_ar: 'التوابل والأعشاب',        name_fr: '\u00c9pices & Herbes',       icon: '\u{1F33F}', image_url: null, sort_order: 7, is_active: true, created_at: '' },
    { id: 'c-bakery',   slug: 'bakery-sweets',    parent_id: null, name: 'Bakery & Sweets',    name_ar: 'المخبوزات والحلويات',      name_fr: 'P\u00e2tisserie & Sucreries',icon: '\u{1F9C1}', image_url: null, sort_order: 8, is_active: true, created_at: '' },
    { id: 'c-flour',    slug: 'flour-baking',     parent_id: null, name: 'Flour & Baking',     name_ar: 'الدقيق والخبز',           name_fr: 'Farine & P\u00e2tisserie',   icon: '\u{1F33E}', image_url: null, sort_order: 9, is_active: true, created_at: '' },
];

// =============================================================================
// BRANDS
// =============================================================================

export const DEMO_BRANDS: V2Brand[] = [
    { id: 'b-aicha',   slug: 'aicha',            name: 'Aicha',            name_ar: 'عائشة',   name_fr: 'Aicha',            logo_url: null, is_active: true, created_at: '' },
    { id: 'b-sultan',  slug: 'sultan',           name: 'Sultan',           name_ar: 'سلطان',   name_fr: 'Sultan',           logo_url: null, is_active: true, created_at: '' },
    { id: 'b-bimo',    slug: 'bimo',             name: 'Bimo',             name_ar: 'بيمو',    name_fr: 'Bimo',             logo_url: null, is_active: true, created_at: '' },
    { id: 'b-knorr',   slug: 'knorr',            name: 'Knorr',            name_ar: 'كنور',    name_fr: 'Knorr',            logo_url: null, is_active: true, created_at: '' },
    { id: 'b-isabel',  slug: 'isabel',           name: 'Isabel',           name_ar: 'إيزابيل', name_fr: 'Isabel',           logo_url: null, is_active: true, created_at: '' },
    { id: 'b-joly',    slug: 'joly',             name: 'Joly',             name_ar: 'جولي',    name_fr: 'Joly',             logo_url: null, is_active: true, created_at: '' },
    { id: 'b-hawaj',   slug: 'hawaj',            name: 'Hawaj',            name_ar: 'هواج',    name_fr: 'Hawaj',            logo_url: null, is_active: true, created_at: '' },
    { id: 'b-damti',   slug: 'damti',            name: 'Damti',            name_ar: 'دمتي',    name_fr: 'Damti',            logo_url: null, is_active: true, created_at: '' },
    { id: 'b-star',    slug: 'star',             name: 'Star',             name_ar: 'ستار',    name_fr: 'Star',             logo_url: null, is_active: true, created_at: '' },
    { id: 'b-argan',   slug: 'house-of-argan',   name: 'House of Argan',   name_ar: null,       name_fr: 'House of Argan',   logo_url: null, is_active: true, created_at: '' },
    { id: 'b-oued',    slug: 'oued-souss',       name: 'Oued Souss',       name_ar: null,       name_fr: 'Oued Souss',       logo_url: null, is_active: true, created_at: '' },
    { id: 'b-asta',    slug: 'asta-cafe',        name: 'Asta Caf\u00e9',  name_ar: null,       name_fr: 'Asta Caf\u00e9',  logo_url: null, is_active: true, created_at: '' },
    { id: 'b-heritage',slug: 'moroccan-heritage', name: 'Moroccan Heritage',name_ar: null,       name_fr: 'H\u00e9ritage Marocain', logo_url: null, is_active: true, created_at: '' },
    { id: 'b-dari',    slug: 'dari',             name: 'Dari',             name_ar: 'داري',    name_fr: 'Dari',             logo_url: null, is_active: true, created_at: '' },
    { id: 'b-alsa',    slug: 'alsa',             name: 'Alsa',             name_ar: null,       name_fr: 'Alsa',             logo_url: null, is_active: true, created_at: '' },
    { id: 'b-jibal',   slug: 'jibal',            name: 'Jibal',            name_ar: 'جبال',    name_fr: 'Jibal',            logo_url: null, is_active: true, created_at: '' },
];

// =============================================================================
// Helper to build a product entry
// =============================================================================

function p(
    id: string, slug: string, name: string, brandId: string, categoryId: string,
    price: number, comparePrice: number | null, weight: string, sku: string,
    stock: number, imgColor: string, imgText: string,
    wholesaleTiers?: { min_quantity: number; price: number; label: string }[],
): V2ProductCard {
    const brand = DEMO_BRANDS.find(b => b.id === brandId) ?? null;
    const category = DEMO_CATEGORIES.find(c => c.id === categoryId) ?? null;
    return {
        id,
        slug,
        brand_id: brandId,
        category_id: categoryId,
        name,
        name_ar: null,
        name_fr: null,
        description: null,
        description_ar: null,
        description_fr: null,
        base_price: price,
        compare_price: comparePrice,
        image_urls: [`https://placehold.co/600x600/${imgColor}?text=${encodeURIComponent(imgText)}`],
        is_active: true,
        is_featured: false,
        is_wholesale_enabled: !!wholesaleTiers?.length,
        created_at: '',
        updated_at: '',
        brand: brand ? { id: brand.id, slug: brand.slug, name: brand.name, name_ar: brand.name_ar, name_fr: brand.name_fr, logo_url: brand.logo_url } : null,
        category: category ? { id: category.id, slug: category.slug, name: category.name, name_ar: category.name_ar, name_fr: category.name_fr } : null,
        variants: [{
            id: `v-${id}`,
            sku,
            weight,
            retail_price: price,
            compare_price: comparePrice,
            stock_quantity: stock,
            is_active: true,
            sort_order: 0,
            price_tiers: (wholesaleTiers ?? []).map(t => ({ min_quantity: t.min_quantity, price: t.price, label: t.label })),
        }],
    };
}

// =============================================================================
// PRODUCTS (40 curated Moroccan grocery products)
// =============================================================================

export const DEMO_PRODUCTS: V2ProductCard[] = [
    // ── OILS & CONDIMENTS ────────────────────────────────────────────────
    p('p01', 'aicha-extra-virgin-olive-oil-1l',       'Aicha Extra Virgin Olive Oil 1L',       'b-aicha', 'c-oils', 45.00, 52.00, '1L',    'BM-OIL-001', 120, '2d5016/ffffff', 'Aicha+Olive+Oil',
        [{ min_quantity: 6, price: 41.00, label: 'Box (6)' }, { min_quantity: 12, price: 38.00, label: 'Case (12)' }]),
    p('p02', 'aicha-sunflower-oil-5l',                'Aicha Sunflower Oil 5L',                'b-aicha', 'c-oils', 65.00, null,  '5L',    'BM-OIL-002',  80, 'f5c518/333333', 'Sunflower+Oil+5L',
        [{ min_quantity: 4, price: 60.00, label: 'Box (4)' }, { min_quantity: 12, price: 55.00, label: 'Pallet (12)' }]),
    p('p03', 'sultan-white-vinegar-500ml',            'Sultan White Vinegar 500ml',            'b-sultan','c-oils', 8.50,  null,  '500ml', 'BM-OIL-003', 200, 'e8e8e8/333333', 'Sultan+Vinegar'),
    p('p04', 'house-of-argan-culinary-argan-oil-250ml','House of Argan Culinary Argan Oil 250ml','b-argan','c-oils', 95.00, 110.00,'250ml','BM-OIL-004',  60, 'c9a84c/ffffff', 'Argan+Oil',
        [{ min_quantity: 6, price: 88.00, label: 'Box (6)' }, { min_quantity: 12, price: 80.00, label: 'Case (12)' }]),
    p('p05', 'oued-souss-argan-amlou-350g',           'Oued Souss Argan Amlou 350g',           'b-oued', 'c-oils', 58.00, null,  '350g',  'BM-OIL-005',  80, '8B6914/ffffff', 'Amlou+Argan'),

    // ── PRESERVES & JAMS ─────────────────────────────────────────────────
    p('p06', 'aicha-apricot-jam-430g',    'Aicha Apricot Jam 430g',    'b-aicha','c-preserved', 18.00, 22.00, '430g', 'BM-JAM-001', 150, 'f5a623/ffffff', 'Apricot+Jam'),
    p('p07', 'aicha-fig-jam-430g',        'Aicha Fig Jam 430g',        'b-aicha','c-preserved', 19.50, null,  '430g', 'BM-JAM-002', 150, '7a4b2e/ffffff', 'Fig+Jam'),
    p('p08', 'aicha-orange-marmalade-430g','Aicha Orange Marmalade 430g','b-aicha','c-preserved',17.50, null,  '430g', 'BM-JAM-003', 150, 'ff8c00/ffffff', 'Orange+Marmalade'),
    p('p09', 'aicha-strawberry-jam-430g', 'Aicha Strawberry Jam 430g', 'b-aicha','c-preserved', 18.50, null,  '430g', 'BM-JAM-004', 150, 'dc143c/ffffff', 'Strawberry+Jam'),
    p('p10', 'aicha-honey-pure-500g',     'Aicha Pure Honey 500g',     'b-aicha','c-preserved', 42.00, 48.00, '500g', 'BM-JAM-005', 100, 'daa520/ffffff', 'Pure+Honey',
        [{ min_quantity: 6, price: 38.00, label: 'Box (6)' }, { min_quantity: 12, price: 35.00, label: 'Case (12)' }]),

    // ── SAUCES & DRESSINGS ───────────────────────────────────────────────
    p('p11', 'aicha-harissa-paste-380g',             'Aicha Harissa Paste 380g',             'b-aicha','c-sauces', 14.00, null, '380g', 'BM-SAU-001', 200, 'c0392b/ffffff', 'Aicha+Harissa',
        [{ min_quantity: 6, price: 13.00, label: 'Box (6)' }, { min_quantity: 24, price: 11.50, label: 'Carton (24)' }]),
    p('p12', 'aicha-double-concentrate-tomato-780g', 'Aicha Double Concentrate Tomato 780g', 'b-aicha','c-sauces', 12.50, null, '780g', 'BM-SAU-002', 180, 'e74c3c/ffffff', 'Tomato+Paste',
        [{ min_quantity: 6, price: 11.50, label: 'Box (6)' }, { min_quantity: 24, price: 10.00, label: 'Carton (24)' }]),
    p('p13', 'knorr-mayonnaise-500ml',  'Knorr Mayonnaise 500ml',  'b-knorr','c-sauces', 16.00, null, '500ml','BM-SAU-003', 150, 'f1c40f/333333', 'Knorr+Mayo'),
    p('p14', 'knorr-ketchup-500ml',     'Knorr Tomato Ketchup 500ml','b-knorr','c-sauces',14.00, null, '500ml','BM-SAU-004', 150, 'e74c3c/ffffff', 'Knorr+Ketchup'),
    p('p15', 'star-mustard-dijon-200g', 'Star Dijon Mustard 200g', 'b-star', 'c-sauces', 12.00, null, '200g', 'BM-SAU-005', 120, 'd4a017/333333', 'Star+Mustard'),

    // ── BISCUITS & SNACKS ────────────────────────────────────────────────
    p('p16', 'bimo-prince-chocolate-biscuit-80g', 'Bimo Prince Chocolate Biscuit 80g', 'b-bimo','c-biscuits', 5.50,  null, '80g',  'BM-BSC-001', 300, '5c3317/ffffff', 'Bimo+Prince'),
    p('p17', 'bimo-tagger-vanilla-125g',          'Bimo Tagger Vanilla 125g',          'b-bimo','c-biscuits', 6.00,  null, '125g', 'BM-BSC-002', 300, 'fef3c7/333333', 'Bimo+Tagger'),
    p('p18', 'bimo-golden-crackers-200g',         'Bimo Golden Crackers 200g',         'b-bimo','c-biscuits', 7.00,  null, '200g', 'BM-BSC-003', 250, 'daa520/333333', 'Bimo+Golden'),
    p('p19', 'bimo-petit-beurre-200g',            'Bimo Petit Beurre 200g',            'b-bimo','c-biscuits', 6.50,  null, '200g', 'BM-BSC-004', 250, 'f5deb3/333333', 'Petit+Beurre'),
    p('p20', 'joly-wafer-chocolate-150g',         'Joly Chocolate Wafer 150g',         'b-joly','c-biscuits', 8.00,  null, '150g', 'BM-BSC-005', 200, '5c3317/ffffff', 'Joly+Wafer'),
    p('p21', 'bimo-cookies-choco-chips-200g',     'Bimo Cookies Choco Chips 200g',     'b-bimo','c-biscuits', 9.50,  null, '200g', 'BM-BSC-006', 200, '8B4513/ffffff', 'Bimo+Cookies'),

    // ── TEA & BEVERAGES ──────────────────────────────────────────────────
    p('p22', 'sultan-green-tea-gunpowder-200g',   'Sultan Gunpowder Green Tea 200g',   'b-sultan','c-tea', 22.00, 26.00, '200g', 'BM-TEA-001', 180, '2d5016/ffffff', 'Sultan+Green+Tea',
        [{ min_quantity: 6, price: 20.00, label: 'Box (6)' }, { min_quantity: 24, price: 18.50, label: 'Carton (24)' }]),
    p('p23', 'sultan-green-tea-special-500g',     'Sultan Special Green Tea 500g',     'b-sultan','c-tea', 45.00, 52.00, '500g', 'BM-TEA-002', 120, '1a5e1a/ffffff', 'Sultan+Tea+500g',
        [{ min_quantity: 6, price: 42.00, label: 'Box (6)' }, { min_quantity: 12, price: 38.00, label: 'Case (12)' }]),
    p('p24', 'damti-mint-tea-bags-25pcs',         'Damti Moroccan Mint Tea Bags 25pcs','b-damti','c-tea',  15.00, null,  '25pcs','BM-TEA-003', 200, '16a085/ffffff', 'Damti+Mint+Tea'),
    p('p25', 'asta-cafe-moroccan-coffee-250g',    'Asta Cafe Moroccan Coffee 250g',    'b-asta', 'c-tea',  28.00, null,  '250g', 'BM-TEA-004', 100, '3e2723/ffffff', 'Asta+Cafe',
        [{ min_quantity: 6, price: 26.00, label: 'Box (6)' }, { min_quantity: 12, price: 24.00, label: 'Case (12)' }]),
    p('p26', 'sultan-chamomile-herbal-tea-20pcs', 'Sultan Chamomile Herbal Tea 20pcs', 'b-sultan','c-tea', 12.00, null,  '20pcs','BM-TEA-005', 150, 'f5e6b8/333333', 'Chamomile+Tea'),

    // ── TUNA & CANNED FISH ───────────────────────────────────────────────
    p('p27', 'isabel-tuna-olive-oil-160g',        'Isabel Tuna in Olive Oil 160g',        'b-isabel','c-tuna', 14.00, null, '160g', 'BM-TUN-001', 200, '1a5276/ffffff', 'Isabel+Tuna',
        [{ min_quantity: 6, price: 13.00, label: 'Pack (6)' }, { min_quantity: 24, price: 11.50, label: 'Carton (24)' }]),
    p('p28', 'isabel-tuna-sunflower-oil-160g',    'Isabel Tuna in Sunflower Oil 160g',    'b-isabel','c-tuna', 12.00, null, '160g', 'BM-TUN-002', 200, '2980b9/ffffff', 'Isabel+Tuna+SO',
        [{ min_quantity: 6, price: 11.00, label: 'Pack (6)' }, { min_quantity: 24, price: 9.80,  label: 'Carton (24)' }]),
    p('p29', 'isabel-sardines-olive-oil-125g',    'Isabel Sardines in Olive Oil 125g',    'b-isabel','c-tuna', 10.00, null, '125g', 'BM-TUN-003', 250, '154360/ffffff', 'Isabel+Sardines',
        [{ min_quantity: 6, price: 9.20,  label: 'Pack (6)' }, { min_quantity: 24, price: 8.00,  label: 'Carton (24)' }]),
    p('p30', 'isabel-mackerel-tomato-sauce-125g', 'Isabel Mackerel in Tomato Sauce 125g', 'b-isabel','c-tuna', 11.00, null, '125g', 'BM-TUN-004', 200, 'e74c3c/ffffff', 'Isabel+Mackerel'),
    p('p31', 'jibal-tuna-spicy-160g',             'Jibal Spicy Tuna 160g',                'b-jibal', 'c-tuna', 15.00, null, '160g', 'BM-TUN-005', 150, 'c0392b/ffffff', 'Jibal+Spicy+Tuna'),

    // ── SPICES & HERBS ───────────────────────────────────────────────────
    p('p32', 'hawaj-ras-el-hanout-premium-100g', 'Hawaj Ras el Hanout Premium 100g', 'b-hawaj','c-spices', 32.00, 38.00, '100g', 'BM-SPI-001', 150, '8B4513/ffffff', 'Ras+el+Hanout',
        [{ min_quantity: 6, price: 29.00, label: 'Box (6)' }, { min_quantity: 12, price: 27.00, label: 'Case (12)' }]),
    p('p33', 'hawaj-cumin-ground-200g',          'Hawaj Ground Cumin 200g',          'b-hawaj','c-spices', 14.00, null,  '200g', 'BM-SPI-002', 200, 'b8860b/ffffff', 'Hawaj+Cumin'),
    p('p34', 'hawaj-paprika-sweet-150g',         'Hawaj Sweet Paprika 150g',         'b-hawaj','c-spices', 12.00, null,  '150g', 'BM-SPI-003', 200, 'dc143c/ffffff', 'Hawaj+Paprika'),
    p('p35', 'hawaj-turmeric-powder-150g',       'Hawaj Turmeric Powder 150g',       'b-hawaj','c-spices', 13.00, null,  '150g', 'BM-SPI-004', 200, 'f39c12/333333', 'Hawaj+Turmeric'),

    // ── BAKERY & SWEETS ──────────────────────────────────────────────────
    p('p36', 'moroccan-heritage-fekkas-almonds-300g',       'Moroccan Heritage Fekkas with Almonds 300g',  'b-heritage','c-bakery', 25.00, null,  '300g', 'BM-BAK-001', 100, 'd2b48c/333333', 'Fekkas+Almonds'),
    p('p37', 'moroccan-heritage-chebakia-500g',             'Moroccan Heritage Chebakia 500g',             'b-heritage','c-bakery', 38.00, null,  '500g', 'BM-BAK-002',  80, 'cd853f/ffffff', 'Chebakia'),
    p('p38', 'moroccan-heritage-ghriba-coconut-400g',       'Moroccan Heritage Ghriba Coconut 400g',       'b-heritage','c-bakery', 22.00, null,  '400g', 'BM-BAK-003', 100, 'f5deb3/333333', 'Ghriba+Coconut'),
    p('p39', 'moroccan-heritage-medjool-dates-premium-1kg', 'Moroccan Heritage Premium Medjool Dates 1kg', 'b-heritage','c-bakery', 78.00, 89.00, '1kg',  'BM-BAK-004',  60, '8B4513/ffffff', 'Medjool+Dates',
        [{ min_quantity: 5, price: 72.00, label: 'Box (5)' }, { min_quantity: 10, price: 66.00, label: 'Case (10)' }]),

    // ── FLOUR & BAKING ───────────────────────────────────────────────────
    p('p40', 'dari-fine-semolina-1kg',   'Dari Fine Semolina 1kg',   'b-dari','c-flour', 12.00, null, '1kg',  'BM-FLR-001', 200, 'f5deb3/333333', 'Dari+Semolina',
        [{ min_quantity: 10, price: 11.00, label: 'Case (10)' }, { min_quantity: 50, price: 9.50, label: 'Pallet (50)' }]),
    p('p41', 'alsa-baking-powder-100g',  'Alsa Baking Powder 100g', 'b-alsa','c-flour',  6.00, null, '100g', 'BM-FLR-002', 300, 'ffffff/333333', 'Alsa+Baking'),
];
