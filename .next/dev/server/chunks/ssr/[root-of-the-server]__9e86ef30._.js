module.exports = [
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/app/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/app/shop/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/shop/layout.tsx [app-rsc] (ecmascript)"));
}),
"[project]/src/lib/supabase.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createClient",
    ()=>createClient,
    "createServerClient",
    ()=>createServerClient,
    "supabase",
    ()=>supabase
]);
/**
 * OUROZ – Supabase client
 * Install: npm install @supabase/supabase-js
 * Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-rsc] (ecmascript) <locals>");
;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'dev-anon-key';
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true
    }
});
function createClient() {
    return supabase;
}
function createServerClient() {
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
        // Fall back to anon key in dev/server components that don't need admin
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseAnonKey);
    }
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, serviceKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false
        }
    });
}
}),
"[project]/src/lib/shop-queries.ts [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getCategories",
    ()=>getCategories,
    "getCategoryBySlug",
    ()=>getCategoryBySlug,
    "getProductBySlug",
    ()=>getProductBySlug,
    "getProductCards",
    ()=>getProductCards,
    "searchProducts",
    ()=>searchProducts
]);
/**
 * OUROZ – Shop query helpers
 * Used by Next.js Server Components and API routes.
 * All functions return typed data via Supabase.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-rsc] (ecmascript)");
;
const DEFAULT_CURRENCY = 'AED';
async function getCategories(lang = 'en') {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])();
    const { data: cats, error } = await db.from('categories').select(`
            *,
            category_translations!inner(name, description)
        `).eq('is_active', true).eq('category_translations.lang', lang).order('sort_order', {
        ascending: true
    });
    if (error) throw new Error(`getCategories: ${error.message}`);
    return (cats ?? []).map((c)=>({
            ...c,
            name: c.category_translations[0]?.name ?? c.slug,
            description: c.category_translations[0]?.description ?? null
        }));
}
async function getCategoryBySlug(slug, lang = 'en') {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])();
    const { data, error } = await db.from('categories').select(`*, category_translations!inner(name, description)`).eq('slug', slug).eq('is_active', true).eq('category_translations.lang', lang).single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!data) return null;
    return {
        ...data,
        name: data.category_translations[0]?.name ?? slug,
        description: data.category_translations[0]?.description ?? null
    };
}
async function getProductCards(opts) {
    const { lang = 'en', categorySlug, featured, limit = 24, offset = 0 } = opts;
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])();
    let query = db.from('products').select(`
            id, slug, base_price, compare_price,
            is_wholesale_enabled, is_retail_enabled,
            product_translations!inner(name, short_description, lang),
            product_images(url, is_primary, sort_order),
            brands(id, brand_translations(name, lang)),
            categories(id, slug, category_translations(name, lang)),
            product_variants!inner(
                id, retail_price, weight_label, is_active,
                inventory(qty_available, low_stock_threshold, track_inventory)
            )
        `, {
        count: 'exact'
    }).eq('status', 'active').eq('product_translations.lang', lang).eq('product_variants.is_active', true).order('is_featured', {
        ascending: false
    }).range(offset, offset + limit - 1);
    if (categorySlug) {
        // Join through categories to filter by slug
        query = query.eq('categories.slug', categorySlug);
    }
    if (featured === true) {
        query = query.eq('is_featured', true);
    }
    const { data, error, count } = await query;
    if (error) throw new Error(`getProductCards: ${error.message}`);
    const products = (data ?? []).map((p)=>{
        const translation = p.product_translations[0];
        const primaryImage = (p.product_images ?? []).find((i)=>i.is_primary) ?? (p.product_images ?? [])[0];
        const brandTranslation = p.brands?.brand_translations ? p.brands.brand_translations.find((b)=>b.lang === lang) ?? p.brands.brand_translations[0] : null;
        const categoryTranslation = p.categories?.category_translations ? p.categories.category_translations.find((c)=>c.lang === lang) ?? p.categories.category_translations[0] : null;
        // Get first active variant for default price
        const firstVariant = p.product_variants[0];
        const inventory = firstVariant?.inventory?.[0];
        let stock = 'in_stock';
        if (inventory?.track_inventory) {
            const avail = inventory.qty_available;
            if (avail <= 0) stock = 'out_of_stock';
            else if (avail <= inventory.low_stock_threshold) stock = 'low_stock';
        }
        return {
            id: p.id,
            slug: p.slug,
            name: translation?.name ?? p.slug,
            short_description: translation?.short_description ?? null,
            primary_image: primaryImage?.url ?? null,
            brand_name: brandTranslation?.name ?? null,
            category_name: categoryTranslation?.name ?? null,
            base_price: Number(p.base_price),
            compare_price: p.compare_price ? Number(p.compare_price) : null,
            currency: DEFAULT_CURRENCY,
            weight_label: firstVariant?.weight_label ?? null,
            is_wholesale_enabled: p.is_wholesale_enabled,
            lowest_wholesale_price: null,
            stock_status: stock
        };
    });
    return {
        products,
        total: count ?? 0
    };
}
async function getProductBySlug(slug, lang = 'en') {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])();
    const { data: p, error } = await db.from('products').select(`
            *,
            product_translations(id, lang, name, description, short_description),
            product_images(id, url, alt_text, sort_order, is_primary),
            brands(*, brand_translations(name, lang)),
            categories(*, category_translations(name, description, lang)),
            product_variants(
                *,
                inventory(*),
                price_tiers(*)
            )
        `).eq('slug', slug).eq('status', 'active').single();
    if (error && error.code !== 'PGRST116') throw new Error(error.message);
    if (!p) return null;
    const translation = p.product_translations.find((t)=>t.lang === lang) ?? p.product_translations[0];
    const brandTranslation = p.brands ? p.brands.brand_translations.find((b)=>b.lang === lang) ?? p.brands.brand_translations[0] : null;
    const brand = p.brands ? {
        ...p.brands,
        name: brandTranslation?.name ?? p.brands.slug
    } : null;
    const categoryTranslation = p.categories ? p.categories.category_translations.find((c)=>c.lang === lang) ?? p.categories.category_translations[0] : null;
    const category = p.categories ? {
        ...p.categories,
        name: categoryTranslation?.name ?? p.categories.slug,
        description: categoryTranslation?.description ?? null
    } : null;
    const images = (p.product_images ?? []).sort((a, b)=>a.sort_order - b.sort_order);
    const variants = (p.product_variants ?? []).filter((v)=>v.is_active).sort((a, b)=>a.sort_order - b.sort_order).map((v)=>{
        const inv = v.inventory?.[0] ?? null;
        const tiers = v.price_tiers ?? [];
        const isInStock = !inv?.track_inventory ? true : inv.qty_available > 0 || inv.allow_backorder;
        return {
            ...v,
            retail_price: Number(v.retail_price),
            compare_price: v.compare_price ? Number(v.compare_price) : null,
            inventory: inv,
            price_tiers: tiers.sort((a, b)=>a.min_qty - b.min_qty).map((t)=>({
                    ...t,
                    price: Number(t.price)
                })),
            is_in_stock: isInStock,
            effective_price: Number(v.retail_price)
        };
    });
    return {
        id: p.id,
        slug: p.slug,
        brand,
        category,
        name: translation?.name ?? p.slug,
        description: translation?.description ?? null,
        short_description: translation?.short_description ?? null,
        images,
        variants,
        is_retail_enabled: p.is_retail_enabled,
        is_wholesale_enabled: p.is_wholesale_enabled,
        base_price: Number(p.base_price),
        compare_price: p.compare_price ? Number(p.compare_price) : null
    };
}
async function searchProducts(rawQuery, lang = 'en', limit = 20) {
    const db = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["createServerClient"])();
    // Step 1: Resolve synonyms
    const { data: synonymRow } = await db.from('search_synonyms').select('canonical').ilike('keyword', rawQuery.trim()).or(`lang.eq.${lang},lang.is.null`).limit(1).single();
    const resolvedQuery = synonymRow?.canonical ?? rawQuery.trim();
    // Step 2: Full-text search on product search_vector
    const { data, error } = await db.from('products').select(`
            id, slug, base_price, compare_price, is_wholesale_enabled,
            product_translations!inner(name, short_description, lang),
            product_images(url, is_primary),
            product_variants(weight_label, retail_price, is_active)
        `).eq('status', 'active').eq('product_translations.lang', lang).textSearch('search_vector', resolvedQuery, {
        type: 'websearch',
        config: 'simple'
    }).limit(limit);
    if (error) {
        // Graceful fallback: ILIKE on translation name
        const { data: fallbackData } = await db.from('product_translations').select(`
                product_id,
                name,
                products!inner(id, slug, base_price, is_wholesale_enabled, product_images(url, is_primary))
            `).eq('lang', lang).ilike('name', `%${resolvedQuery}%`).limit(limit);
        const products = (fallbackData ?? []).map((t)=>({
                id: t.products.id,
                slug: t.products.slug,
                name: t.name,
                short_description: null,
                primary_image: t.products.product_images?.find((i)=>i.is_primary)?.url ?? null,
                brand_name: null,
                category_name: null,
                base_price: Number(t.products.base_price),
                compare_price: null,
                currency: DEFAULT_CURRENCY,
                weight_label: null,
                is_wholesale_enabled: t.products.is_wholesale_enabled,
                lowest_wholesale_price: null,
                stock_status: 'in_stock'
            }));
        return {
            products,
            total: products.length,
            query: rawQuery,
            resolved_query: resolvedQuery
        };
    }
    const products = (data ?? []).map((p)=>{
        const translation = p.product_translations[0];
        const primaryImage = (p.product_images ?? []).find((i)=>i.is_primary) ?? (p.product_images ?? [])[0];
        const firstActiveVariant = (p.product_variants ?? []).find((v)=>v.is_active);
        return {
            id: p.id,
            slug: p.slug,
            name: translation?.name ?? p.slug,
            short_description: translation?.short_description ?? null,
            primary_image: primaryImage?.url ?? null,
            brand_name: null,
            category_name: null,
            base_price: Number(p.base_price),
            compare_price: p.compare_price ? Number(p.compare_price) : null,
            currency: DEFAULT_CURRENCY,
            weight_label: firstActiveVariant?.weight_label ?? null,
            is_wholesale_enabled: p.is_wholesale_enabled,
            lowest_wholesale_price: null,
            stock_status: 'in_stock'
        };
    });
    return {
        products,
        total: products.length,
        query: rawQuery,
        resolved_query: resolvedQuery
    };
}
}),
"[project]/src/components/shop/CategoryNav.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/shop/CategoryNav.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shop/CategoryNav.tsx <module evaluation>", "default");
}),
"[project]/src/components/shop/CategoryNav.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/shop/CategoryNav.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shop/CategoryNav.tsx", "default");
}),
"[project]/src/components/shop/CategoryNav.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/shop/CategoryNav.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/shop/CategoryNav.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (client reference proxy) <module evaluation>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/shop/ShopClientShell.tsx <module evaluation> from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shop/ShopClientShell.tsx <module evaluation>", "default");
}),
"[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (client reference proxy)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
// This file is generated by next-core EcmascriptClientReferenceModule.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-server-dom-turbopack-server.js [app-rsc] (ecmascript)");
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$server$2d$dom$2d$turbopack$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["registerClientReference"])(function() {
    throw new Error("Attempted to call the default export of [project]/src/components/shop/ShopClientShell.tsx from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.");
}, "[project]/src/components/shop/ShopClientShell.tsx", "default");
}),
"[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopClientShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (client reference proxy) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopClientShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__ = __turbopack_context__.i("[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (client reference proxy)");
;
__turbopack_context__.n(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopClientShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$client__reference__proxy$29$__);
}),
"[project]/app/shop/[categorySlug]/page.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryPage,
    "generateMetadata",
    ()=>generateMetadata,
    "revalidate",
    ()=>revalidate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
/**
 * /shop/[categorySlug] – Category product listing
 * Server Component with ISR.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$api$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/api/navigation.react-server.js [app-rsc] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/components/navigation.react-server.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/headers.js [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shop$2d$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/shop-queries.ts [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/CategoryNav.tsx [app-rsc] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopClientShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/ShopClientShell.tsx [app-rsc] (ecmascript)");
;
;
;
;
;
;
const revalidate = 60;
async function generateMetadata({ params }) {
    const { categorySlug } = await params;
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const lang = cookieStore.get('ouroz_lang')?.value ?? 'en';
    const category = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shop$2d$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryBySlug"])(categorySlug, lang);
    if (!category) return {
        title: 'Category Not Found'
    };
    return {
        title: `${category.name} – OUROZ Shop`,
        description: category.description ?? `Shop ${category.name} at OUROZ`
    };
}
async function CategoryPage({ params }) {
    const { categorySlug } = await params;
    const cookieStore = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$headers$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["cookies"])();
    const lang = cookieStore.get('ouroz_lang')?.value ?? 'en';
    // Parallel fetch
    const [category, categories, { products, total }] = await Promise.all([
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shop$2d$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategoryBySlug"])(categorySlug, lang),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shop$2d$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getCategories"])(lang),
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$shop$2d$queries$2e$ts__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["getProductCards"])({
            lang,
            categorySlug,
            limit: 24
        })
    ]);
    if (!category) (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$components$2f$navigation$2e$react$2d$server$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["notFound"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                className: "text-sm text-stone-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                        href: "/shop",
                        className: "hover:text-[var(--color-imperial)]",
                        children: lang === 'ar' ? 'المتجر' : lang === 'fr' ? 'Boutique' : 'Shop'
                    }, void 0, false, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 54,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "mx-2",
                        children: "/"
                    }, void 0, false, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 57,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "font-medium text-[var(--color-charcoal)]",
                        children: category.name
                    }, void 0, false, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 58,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                lineNumber: 53,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-3",
                children: [
                    category.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-3xl",
                        children: category.icon
                    }, void 0, false, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 64,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-2xl font-bold text-[var(--color-charcoal)]",
                                children: category.name
                            }, void 0, false, {
                                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                                lineNumber: 67,
                                columnNumber: 21
                            }, this),
                            category.description && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-stone-500 text-sm mt-0.5",
                                children: category.description
                            }, void 0, false, {
                                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                                lineNumber: 71,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 66,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "ms-auto text-sm text-stone-400",
                        children: [
                            total,
                            " products"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                        lineNumber: 74,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                categories: categories,
                activeSlug: categorySlug
            }, void 0, false, {
                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                lineNumber: 78,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopClientShell$2e$tsx__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["default"], {
                categories: categories,
                initialProducts: products,
                lang: lang,
                activeCategory: categorySlug
            }, void 0, false, {
                fileName: "[project]/app/shop/[categorySlug]/page.tsx",
                lineNumber: 81,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/shop/[categorySlug]/page.tsx",
        lineNumber: 51,
        columnNumber: 9
    }, this);
}
}),
"[project]/app/shop/[categorySlug]/page.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/app/shop/[categorySlug]/page.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__9e86ef30._.js.map