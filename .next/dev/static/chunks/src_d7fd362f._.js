(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/shop/ShopTabs.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopTabs
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/HomeIcon.js [app-client] (ecmascript) <export default as HomeIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LangContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ShopTabs({ mode, onChange, className = '' }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const tabs = [
        {
            id: 'retail',
            label: t('shopForHome'),
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$HomeIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__HomeIcon$3e$__["HomeIcon"], {
                className: "w-4 h-4"
            }, void 0, false, {
                fileName: "[project]/src/components/shop/ShopTabs.tsx",
                lineNumber: 27,
                columnNumber: 19
            }, this)
        },
        {
            id: 'wholesale',
            label: t('forBusinesses'),
            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                className: "w-4 h-4",
                fill: "none",
                viewBox: "0 0 24 24",
                stroke: "currentColor",
                strokeWidth: 1.8,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    d: "M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/ShopTabs.tsx",
                    lineNumber: 34,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shop/ShopTabs.tsx",
                lineNumber: 33,
                columnNumber: 17
            }, this)
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `flex bg-stone-100 rounded-xl p-1 gap-1 ${className}`,
        children: tabs.map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onChange(tab.id),
                className: `
                        flex-1 flex items-center justify-center gap-2 px-4 py-2.5
                        rounded-lg text-sm font-semibold transition-all duration-200
                        ${mode === tab.id ? 'bg-white text-[var(--color-imperial)] shadow-sm ring-1 ring-[var(--color-imperial)]/20' : 'text-stone-500 hover:text-stone-700'}
                    `,
                children: [
                    tab.icon,
                    tab.label
                ]
            }, tab.id, true, {
                fileName: "[project]/src/components/shop/ShopTabs.tsx",
                lineNumber: 44,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/shop/ShopTabs.tsx",
        lineNumber: 42,
        columnNumber: 9
    }, this);
}
_s(ShopTabs, "p2BMN842WmXaElEn1NQnTw7gg40=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = ShopTabs;
var _c;
__turbopack_context__.k.register(_c, "ShopTabs");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/CategoryNav.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CategoryNav
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
'use client';
;
;
function CategoryNav({ categories, activeSlug }) {
    if (categories.length === 0) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Product categories",
        className: "overflow-x-auto scrollbar-hide py-2",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
            className: "flex items-center gap-2 min-w-max px-1",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        href: "/shop",
                        className: `
                            inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                            font-medium transition-all whitespace-nowrap
                            ${!activeSlug ? 'bg-[var(--color-imperial)] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}
                        `,
                        children: "🏪 All"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/CategoryNav.tsx",
                        lineNumber: 26,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/CategoryNav.tsx",
                    lineNumber: 25,
                    columnNumber: 17
                }, this),
                categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            href: `/shop/${cat.slug}`,
                            className: `
                                inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm
                                font-medium transition-all whitespace-nowrap
                                ${activeSlug === cat.slug ? 'bg-[var(--color-imperial)] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}
                            `,
                            children: [
                                cat.icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: cat.icon
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shop/CategoryNav.tsx",
                                    lineNumber: 54,
                                    columnNumber: 42
                                }, this),
                                cat.name
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/shop/CategoryNav.tsx",
                            lineNumber: 43,
                            columnNumber: 25
                        }, this)
                    }, cat.id, false, {
                        fileName: "[project]/src/components/shop/CategoryNav.tsx",
                        lineNumber: 42,
                        columnNumber: 21
                    }, this))
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/CategoryNav.tsx",
            lineNumber: 23,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shop/CategoryNav.tsx",
        lineNumber: 19,
        columnNumber: 9
    }, this);
}
_c = CategoryNav;
var _c;
__turbopack_context__.k.register(_c, "CategoryNav");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/PriceBlock.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>PriceBlock
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LangContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function PriceBlock({ retailPrice, comparePrice, currency = 'AED', weightLabel, priceTiers = [], isWholesaleMode = false, size = 'md' }) {
    _s();
    const { t, isRTL } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const textSizes = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-2xl'
    };
    const subSizes = {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base'
    };
    // Wholesale: find lowest price from tiers
    const lowestTierPrice = priceTiers.length > 0 ? Math.min(...priceTiers.map((t)=>Number(t.price))) : null;
    const fmt = (n)=>new Intl.NumberFormat(isRTL ? 'ar-AE' : 'en-AE', {
            style: 'currency',
            currency,
            minimumFractionDigits: 2
        }).format(n);
    if (isWholesaleMode && lowestTierPrice !== null) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col gap-0.5",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-baseline gap-1",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `${subSizes[size]} text-stone-500`,
                            children: t('fromPrice')
                        }, void 0, false, {
                            fileName: "[project]/src/components/shop/PriceBlock.tsx",
                            lineNumber: 53,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            className: `${textSizes[size]} font-bold text-[var(--color-zellige)]`,
                            children: fmt(lowestTierPrice)
                        }, void 0, false, {
                            fileName: "[project]/src/components/shop/PriceBlock.tsx",
                            lineNumber: 54,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/shop/PriceBlock.tsx",
                    lineNumber: 52,
                    columnNumber: 17
                }, this),
                weightLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `${subSizes[size]} text-stone-400`,
                    children: weightLabel
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/PriceBlock.tsx",
                    lineNumber: 59,
                    columnNumber: 21
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: `${subSizes[size]} text-[var(--color-zellige)]/80 font-medium`,
                    children: t('tierPricing')
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/PriceBlock.tsx",
                    lineNumber: 61,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/PriceBlock.tsx",
            lineNumber: 51,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col gap-0.5",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-baseline gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `${textSizes[size]} font-bold text-[var(--color-charcoal)]`,
                        children: fmt(retailPrice)
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/PriceBlock.tsx",
                        lineNumber: 71,
                        columnNumber: 17
                    }, this),
                    comparePrice && comparePrice > retailPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `${subSizes[size]} text-stone-400 line-through`,
                        children: fmt(comparePrice)
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/PriceBlock.tsx",
                        lineNumber: 75,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/PriceBlock.tsx",
                lineNumber: 70,
                columnNumber: 13
            }, this),
            weightLabel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: `${subSizes[size]} text-stone-400`,
                children: weightLabel
            }, void 0, false, {
                fileName: "[project]/src/components/shop/PriceBlock.tsx",
                lineNumber: 81,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/PriceBlock.tsx",
        lineNumber: 69,
        columnNumber: 9
    }, this);
}
_s(PriceBlock, "HN8kB9LIYaI5qjxavSOwaw2vIPI=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = PriceBlock;
var _c;
__turbopack_context__.k.register(_c, "PriceBlock");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/ProductCard.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductCard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$PriceBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/PriceBlock.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LangContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
const STOCK_BADGE = {
    in_stock: {
        bg: 'bg-emerald-100 text-emerald-700',
        label: ''
    },
    low_stock: {
        bg: 'bg-amber-100 text-amber-700',
        label: 'lowStock'
    },
    out_of_stock: {
        bg: 'bg-red-100 text-red-700',
        label: 'outOfStock'
    }
};
function ProductCard({ product, mode }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const badge = STOCK_BADGE[product.stock_status];
    const fallbackImage = `https://placehold.co/600x600/F5E6D3/1A1A1A?text=${encodeURIComponent(product.name.slice(0, 10))}`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
        href: `/product/${product.slug}`,
        className: "group flex flex-col bg-white rounded-2xl border border-stone-100 hover:border-[var(--color-imperial)]/30 hover:shadow-lg transition-all duration-200 overflow-hidden",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "relative aspect-square bg-[var(--color-sahara)] overflow-hidden",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        src: product.primary_image ?? fallbackImage,
                        alt: product.name,
                        fill: true,
                        className: "object-cover group-hover:scale-105 transition-transform duration-300",
                        sizes: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 41,
                        columnNumber: 17
                    }, this),
                    badge.label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `absolute top-2 start-2 text-xs font-semibold px-2 py-0.5 rounded-full ${badge.bg}`,
                        children: t(badge.label)
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 51,
                        columnNumber: 21
                    }, this),
                    mode === 'wholesale' && product.is_wholesale_enabled && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "absolute top-2 end-2 text-xs font-bold px-2 py-0.5 rounded-full bg-[var(--color-zellige)] text-white",
                        children: "B2B"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 58,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/ProductCard.tsx",
                lineNumber: 40,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col flex-1 p-3 gap-1",
                children: [
                    product.brand_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-[10px] font-semibold uppercase tracking-widest text-stone-400",
                        children: product.brand_name
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 69,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-sm font-semibold text-[var(--color-charcoal)] leading-snug line-clamp-2 group-hover:text-[var(--color-imperial)] transition-colors",
                        children: product.name
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 75,
                        columnNumber: 17
                    }, this),
                    product.weight_label && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "text-xs text-stone-400",
                        children: product.weight_label
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 82,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-auto pt-2",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$PriceBlock$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                            retailPrice: product.base_price,
                            comparePrice: product.compare_price,
                            weightLabel: null,
                            isWholesaleMode: mode === 'wholesale' && product.is_wholesale_enabled,
                            size: "sm"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shop/ProductCard.tsx",
                            lineNumber: 87,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductCard.tsx",
                        lineNumber: 86,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/ProductCard.tsx",
                lineNumber: 66,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/ProductCard.tsx",
        lineNumber: 33,
        columnNumber: 9
    }, this);
}
_s(ProductCard, "p2BMN842WmXaElEn1NQnTw7gg40=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = ProductCard;
var _c;
__turbopack_context__.k.register(_c, "ProductCard");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/ProductGrid.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ProductGrid
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/ProductCard.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LangContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function ProductCardSkeleton() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "rounded-2xl border border-stone-100 overflow-hidden animate-pulse",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "aspect-square bg-stone-200"
            }, void 0, false, {
                fileName: "[project]/src/components/shop/ProductGrid.tsx",
                lineNumber: 23,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "p-3 space-y-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-2 bg-stone-200 rounded w-1/3"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductGrid.tsx",
                        lineNumber: 25,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-stone-200 rounded w-4/5"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductGrid.tsx",
                        lineNumber: 26,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-3 bg-stone-200 rounded w-2/5 mt-2"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductGrid.tsx",
                        lineNumber: 27,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 bg-stone-300 rounded w-1/2 mt-1"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ProductGrid.tsx",
                        lineNumber: 28,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/ProductGrid.tsx",
                lineNumber: 24,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/ProductGrid.tsx",
        lineNumber: 22,
        columnNumber: 9
    }, this);
}
_c = ProductCardSkeleton;
function ProductGrid({ products, mode, loading = false, skeletonCount = 8 }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    const gridClass = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4';
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: gridClass,
            children: Array.from({
                length: skeletonCount
            }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ProductCardSkeleton, {}, i, false, {
                    fileName: "[project]/src/components/shop/ProductGrid.tsx",
                    lineNumber: 48,
                    columnNumber: 21
                }, this))
        }, void 0, false, {
            fileName: "[project]/src/components/shop/ProductGrid.tsx",
            lineNumber: 46,
            columnNumber: 13
        }, this);
    }
    if (products.length === 0) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-16 text-stone-400",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-4xl mb-3",
                    children: "🏪"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/ProductGrid.tsx",
                    lineNumber: 57,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-base font-medium",
                    children: t('noResults')
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/ProductGrid.tsx",
                    lineNumber: 58,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/ProductGrid.tsx",
            lineNumber: 56,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: gridClass,
        children: products.map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ProductCard$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                product: p,
                mode: mode
            }, p.id, false, {
                fileName: "[project]/src/components/shop/ProductGrid.tsx",
                lineNumber: 66,
                columnNumber: 17
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/shop/ProductGrid.tsx",
        lineNumber: 64,
        columnNumber: 9
    }, this);
}
_s(ProductGrid, "p2BMN842WmXaElEn1NQnTw7gg40=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c1 = ProductGrid;
var _c, _c1;
__turbopack_context__.k.register(_c, "ProductCardSkeleton");
__turbopack_context__.k.register(_c1, "ProductGrid");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/WholesaleGate.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WholesaleGate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/LangContext.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function WholesaleGate({ applicationStatus, children }) {
    _s();
    const { t } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"])();
    // Approved → show content
    if (applicationStatus === 'approved') return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children ?? null
    }, void 0, false);
    // Pending → show status message
    if (applicationStatus === 'pending') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-16 text-center gap-4 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-2xl",
                    children: "⏳"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 29,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-semibold text-[var(--color-charcoal)]",
                    children: "Application Under Review"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 32,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-stone-500 max-w-sm",
                    children: "Your wholesale application is being reviewed. We'll notify you by email within 1–2 business days."
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 33,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-100 text-amber-700 text-sm font-medium",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "🕐"
                        }, void 0, false, {
                            fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                            lineNumber: 37,
                            columnNumber: 21
                        }, this),
                        " ",
                        t('wholesalePending')
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 36,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/WholesaleGate.tsx",
            lineNumber: 28,
            columnNumber: 13
        }, this);
    }
    // Rejected → show why + re-apply link
    if (applicationStatus === 'rejected') {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex flex-col items-center justify-center py-16 text-center gap-4 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "w-16 h-16 rounded-full bg-red-100 flex items-center justify-center text-2xl",
                    children: "❌"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 47,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                    className: "text-xl font-semibold text-[var(--color-charcoal)]",
                    children: "Application Not Approved"
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 50,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-stone-500 max-w-sm",
                    children: "Your application was not approved at this time. Please contact us for more information or re-apply with updated documentation."
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 51,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/wholesale/apply",
                    className: "inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-imperial)] text-white font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition",
                    children: t('applyForWholesale')
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                    lineNumber: 54,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/WholesaleGate.tsx",
            lineNumber: 46,
            columnNumber: 13
        }, this);
    }
    // No application → show CTA to apply
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex flex-col items-center justify-center py-16 text-center gap-5 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-20 h-20 rounded-full bg-[var(--color-zellige)]/10 flex items-center justify-center text-3xl",
                children: "🏭"
            }, void 0, false, {
                fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                lineNumber: 69,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-2xl font-bold text-[var(--color-charcoal)] mb-2",
                        children: "Wholesale for Moroccan Restaurants & Retailers in Dubai"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                        lineNumber: 73,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "text-stone-500 max-w-md mx-auto",
                        children: "Access competitive pricing, bulk order discounts, and exclusive products. Apply with your trade license to get started."
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                        lineNumber: 76,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                lineNumber: 72,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                className: "grid grid-cols-2 sm:grid-cols-3 gap-3 max-w-lg text-sm text-stone-600",
                children: [
                    [
                        '📦',
                        'Bulk pricing tiers'
                    ],
                    [
                        '🚚',
                        'Priority delivery'
                    ],
                    [
                        '📋',
                        'Invoice & credit terms'
                    ],
                    [
                        '🤝',
                        'Dedicated account manager'
                    ],
                    [
                        '🧾',
                        'VAT compliant invoices'
                    ],
                    [
                        '🔄',
                        'Easy reordering'
                    ]
                ].map(([icon, label])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                        className: "flex items-center gap-2 bg-stone-50 rounded-lg px-3 py-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: icon
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                                lineNumber: 93,
                                columnNumber: 25
                            }, this),
                            " ",
                            label
                        ]
                    }, label, true, {
                        fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                        lineNumber: 92,
                        columnNumber: 21
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                lineNumber: 83,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/wholesale/apply",
                className: "inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[var(--color-zellige)] text-white font-semibold hover:bg-[var(--color-zellige)]/90 transition text-base",
                children: [
                    t('applyForWholesale'),
                    " →"
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/WholesaleGate.tsx",
                lineNumber: 98,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/WholesaleGate.tsx",
        lineNumber: 68,
        columnNumber: 9
    }, this);
}
_s(WholesaleGate, "p2BMN842WmXaElEn1NQnTw7gg40=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$LangContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useLang"]
    ];
});
_c = WholesaleGate;
var _c;
__turbopack_context__.k.register(_c, "WholesaleGate");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/SearchBar.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SearchBar
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * SearchBar – debounced text input for product search.
 * Emits `onSearch(value)` 350ms after the user stops typing.
 * `onSearch('')` is emitted when the input is cleared.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
function SearchBar({ onSearch, value: controlledValue, placeholder = 'Search products…', debounceMs = 350, className = '', autoFocus = false }) {
    _s();
    const [inputValue, setInputValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(controlledValue ?? '');
    const timerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    // Sync if parent changes controlled value
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SearchBar.useEffect": ()=>{
            if (controlledValue !== undefined && controlledValue !== inputValue) {
                setInputValue(controlledValue);
            }
        // Intentionally only react to controlledValue changes
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }
    }["SearchBar.useEffect"], [
        controlledValue
    ]);
    const emit = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "SearchBar.useCallback[emit]": (val)=>{
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout({
                "SearchBar.useCallback[emit]": ()=>onSearch(val)
            }["SearchBar.useCallback[emit]"], debounceMs);
        }
    }["SearchBar.useCallback[emit]"], [
        onSearch,
        debounceMs
    ]);
    function handleChange(e) {
        const val = e.target.value;
        setInputValue(val);
        emit(val);
    }
    function handleClear() {
        if (timerRef.current) clearTimeout(timerRef.current);
        setInputValue('');
        onSearch('');
    }
    function handleKeyDown(e) {
        if (e.key === 'Escape') handleClear();
        if (e.key === 'Enter') {
            if (timerRef.current) clearTimeout(timerRef.current);
            onSearch(inputValue.trim());
        }
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: `relative flex items-center ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                className: "absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none select-none",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 20 20",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M13.5 13.5L18 18M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Z",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/SearchBar.tsx",
                        lineNumber: 72,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/SearchBar.tsx",
                    lineNumber: 71,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shop/SearchBar.tsx",
                lineNumber: 70,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                type: "search",
                value: inputValue,
                onChange: handleChange,
                onKeyDown: handleKeyDown,
                placeholder: placeholder,
                autoFocus: autoFocus,
                className: " w-full pl-9 pr-9 py-2.5 text-sm bg-white border border-stone-200 rounded-xl placeholder:text-stone-400 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/30 focus:border-[var(--color-imperial)] transition [appearance:none] ",
                "aria-label": "Search products"
            }, void 0, false, {
                fileName: "[project]/src/components/shop/SearchBar.tsx",
                lineNumber: 81,
                columnNumber: 13
            }, this),
            inputValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleClear,
                "aria-label": "Clear search",
                className: " absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition w-5 h-5 flex items-center justify-center rounded-full hover:bg-stone-100 ",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "12",
                    height: "12",
                    viewBox: "0 0 12 12",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M1 1l10 10M11 1L1 11",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        strokeLinecap: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/SearchBar.tsx",
                        lineNumber: 114,
                        columnNumber: 25
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/SearchBar.tsx",
                    lineNumber: 113,
                    columnNumber: 21
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shop/SearchBar.tsx",
                lineNumber: 102,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/SearchBar.tsx",
        lineNumber: 68,
        columnNumber: 9
    }, this);
}
_s(SearchBar, "L+mKcyXIrTKrspm6jTS551uIRI4=");
_c = SearchBar;
var _c;
__turbopack_context__.k.register(_c, "SearchBar");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/ShopFilters.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopFilters
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ShopFilters – Brand + Category filter sidebar / topbar.
 *
 * Renders two sections:
 *   1. Category pills (horizontal scroll on mobile, vertical list on md+)
 *   2. Brand checkboxes
 *
 * All filter state lives in the parent; this component is purely presentational.
 * Pass `null` to clear a filter (shows all results).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronUpIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronUpIcon.js [app-client] (ecmascript) <export default as ChevronUpIcon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__ = __turbopack_context__.i("[project]/node_modules/@heroicons/react/24/outline/esm/ChevronRightIcon.js [app-client] (ecmascript) <export default as ChevronRightIcon>");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
function categoryName(cat, lang) {
    if (lang === 'ar' && cat.name_ar) return cat.name_ar;
    if (lang === 'fr' && cat.name_fr) return cat.name_fr;
    return cat.name;
}
function brandName(brand, lang) {
    if (lang === 'ar' && brand.name_ar) return brand.name_ar;
    if (lang === 'fr' && brand.name_fr) return brand.name_fr;
    return brand.name;
}
function ShopFilters({ categories, brands, selectedCategoryId, selectedBrandId, onCategoryChange, onBrandChange, lang = 'en', className = '' }) {
    _s();
    const [expandedCategories, setExpandedCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(new Set());
    const toggleCategory = (categoryId)=>{
        setExpandedCategories((prev)=>{
            const next = new Set(prev);
            if (next.has(categoryId)) {
                next.delete(categoryId);
            } else {
                next.add(categoryId);
            }
            return next;
        });
    };
    // Only show root-level categories (no parent)
    const rootCategories = categories.filter((c)=>!c.parent_id);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
        className: `space-y-6 ${className}`,
        children: [
            rootCategories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex flex-wrap gap-2 md:hidden mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                label: "All",
                                active: selectedCategoryId === null,
                                onClick: ()=>onCategoryChange(null)
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                lineNumber: 76,
                                columnNumber: 25
                            }, this),
                            rootCategories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Pill, {
                                    label: categoryName(cat, lang),
                                    active: selectedCategoryId === cat.id,
                                    onClick: ()=>onCategoryChange(selectedCategoryId === cat.id ? null : cat.id)
                                }, cat.id, false, {
                                    fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                    lineNumber: 82,
                                    columnNumber: 29
                                }, this))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                        lineNumber: 75,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "hidden md:block rounded-xl overflow-hidden border border-stone-200",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "bg-[#044c46] text-white px-4 py-3 text-sm font-bold uppercase tracking-wide",
                                children: "Categories"
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                lineNumber: 98,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                className: "flex flex-col bg-white",
                                children: rootCategories.map((cat, index)=>{
                                    const hasChildren = categories.some((c)=>c.parent_id === cat.id);
                                    const isExpanded = expandedCategories.has(cat.id);
                                    const isSelected = selectedCategoryId === cat.id;
                                    // Subcategories for this node
                                    const subCategories = categories.filter((c)=>c.parent_id === cat.id);
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                        className: index !== 0 ? "border-t border-stone-100" : "",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full flex items-center justify-between px-4 py-3 cursor-pointer group hover:bg-stone-50 transition",
                                                onClick: ()=>{
                                                    if (hasChildren) {
                                                        toggleCategory(cat.id);
                                                    } else {
                                                        onCategoryChange(isSelected ? null : cat.id);
                                                    }
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: `text-[15px] flex-1 ${isSelected || isExpanded ? 'font-semibold text-stone-900' : 'text-stone-700'}`,
                                                        children: categoryName(cat, lang)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                        lineNumber: 124,
                                                        columnNumber: 45
                                                    }, this),
                                                    hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-1 text-stone-400 group-hover:text-stone-700 transition",
                                                        children: isExpanded ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronUpIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronUpIcon$3e$__["ChevronUpIcon"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                            lineNumber: 132,
                                                            columnNumber: 57
                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                            lineNumber: 134,
                                                            columnNumber: 57
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                        lineNumber: 130,
                                                        columnNumber: 49
                                                    }, this),
                                                    !hasChildren && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-6 h-6 flex items-center justify-center text-stone-300",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$heroicons$2f$react$2f$24$2f$outline$2f$esm$2f$ChevronRightIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ChevronRightIcon$3e$__["ChevronRightIcon"], {
                                                            className: "w-4 h-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                            lineNumber: 140,
                                                            columnNumber: 53
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                        lineNumber: 139,
                                                        columnNumber: 49
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                lineNumber: 114,
                                                columnNumber: 41
                                            }, this),
                                            hasChildren && isExpanded && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "pl-4 pr-4 pb-3 flex flex-col",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                    className: "border-l border-stone-200 ml-2 pl-4 flex flex-col gap-3 pt-1",
                                                    children: subCategories.map((subCat)=>{
                                                        const isSubSelected = selectedCategoryId === subCat.id;
                                                        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                onClick: (e)=>{
                                                                    e.stopPropagation();
                                                                    onCategoryChange(isSubSelected ? null : subCat.id);
                                                                },
                                                                className: `text-sm text-left transition w-full ${isSubSelected ? 'text-[#044c46] font-medium' : 'text-[#3E5C76] hover:text-[#044c46]'}`,
                                                                children: categoryName(subCat, lang)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                                lineNumber: 154,
                                                                columnNumber: 65
                                                            }, this)
                                                        }, subCat.id, false, {
                                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                            lineNumber: 153,
                                                            columnNumber: 61
                                                        }, this);
                                                    })
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                    lineNumber: 149,
                                                    columnNumber: 49
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                                lineNumber: 147,
                                                columnNumber: 45
                                            }, this)
                                        ]
                                    }, cat.id, true, {
                                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                        lineNumber: 113,
                                        columnNumber: 37
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                lineNumber: 103,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                        lineNumber: 96,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                lineNumber: 73,
                columnNumber: 17
            }, this),
            brands.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                        className: "text-xs font-semibold uppercase tracking-widest text-stone-400 mb-3",
                        children: "Brand"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                        lineNumber: 180,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                        className: "flex flex-col gap-1",
                        children: brands.map((brand)=>{
                            const checked = selectedBrandId === brand.id;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                    className: "flex items-center gap-2.5 cursor-pointer group py-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                            type: "checkbox",
                                            checked: checked,
                                            onChange: ()=>onBrandChange(checked ? null : brand.id),
                                            className: " w-4 h-4 rounded border-stone-300 text-[var(--color-imperial)] focus:ring-[var(--color-imperial)]/30 cursor-pointer "
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                            lineNumber: 189,
                                            columnNumber: 41
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-sm text-stone-700 group-hover:text-stone-900 transition leading-none",
                                            children: brandName(brand, lang)
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                            lineNumber: 202,
                                            columnNumber: 41
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                    lineNumber: 188,
                                    columnNumber: 37
                                }, this)
                            }, brand.id, false, {
                                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                                lineNumber: 187,
                                columnNumber: 33
                            }, this);
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ShopFilters.tsx",
                        lineNumber: 183,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/ShopFilters.tsx",
                lineNumber: 179,
                columnNumber: 17
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/ShopFilters.tsx",
        lineNumber: 69,
        columnNumber: 9
    }, this);
}
_s(ShopFilters, "3mlQDaY6ZK4TR/7J1/SePVkIFAk=");
_c = ShopFilters;
// =============================================================================
// Internal sub-components
// =============================================================================
function Pill({ label, active, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        type: "button",
        onClick: onClick,
        className: `
                px-3 py-1.5 rounded-full text-sm font-medium transition whitespace-nowrap
                ${active ? 'bg-[var(--color-imperial)] text-white shadow-sm' : 'bg-stone-100 text-stone-600 hover:bg-stone-200'}
            `,
        children: label
    }, void 0, false, {
        fileName: "[project]/src/components/shop/ShopFilters.tsx",
        lineNumber: 230,
        columnNumber: 9
    }, this);
}
_c1 = Pill;
function CategoryRow({ label, icon, active, onClick }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
            type: "button",
            onClick: onClick,
            className: `
                    w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm
                    font-medium transition text-left
                    ${active ? 'bg-[var(--color-imperial)]/10 text-[var(--color-imperial)]' : 'text-stone-600 hover:bg-stone-100'}
                `,
            children: [
                icon && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "text-base leading-none",
                    children: icon
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/ShopFilters.tsx",
                    lineNumber: 271,
                    columnNumber: 26
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "truncate",
                    children: label
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/ShopFilters.tsx",
                    lineNumber: 272,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/shop/ShopFilters.tsx",
            lineNumber: 259,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/shop/ShopFilters.tsx",
        lineNumber: 258,
        columnNumber: 9
    }, this);
}
_c2 = CategoryRow;
var _c, _c1, _c2;
__turbopack_context__.k.register(_c, "ShopFilters");
__turbopack_context__.k.register(_c1, "Pill");
__turbopack_context__.k.register(_c2, "CategoryRow");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/Pagination.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Pagination
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
'use client';
;
function Pagination({ page, totalPages, onPageChange, className = '' }) {
    if (totalPages <= 1) return null;
    // Build page number array with null as ellipsis placeholder
    function buildPages() {
        const delta = 2;
        const range = [];
        for(let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++){
            range.push(i);
        }
        if (page - delta > 2) range.unshift(null); // left ellipsis
        if (page + delta < totalPages - 1) range.push(null); // right ellipsis
        return [
            1,
            ...range,
            totalPages
        ];
    }
    const pages = buildPages();
    const btnBase = `
        inline-flex items-center justify-center min-w-[2rem] h-9 px-2
        text-sm rounded-lg font-medium transition select-none
    `;
    const activeBtn = `${btnBase} bg-[var(--color-imperial)] text-white`;
    const inactiveBtn = `${btnBase} text-stone-600 hover:bg-stone-100 cursor-pointer`;
    const disabledBtn = `${btnBase} text-stone-300 cursor-not-allowed`;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
        "aria-label": "Pagination",
        className: `flex items-center justify-center gap-1 ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(page - 1),
                disabled: page === 1,
                "aria-label": "Previous page",
                className: page === 1 ? disabledBtn : inactiveBtn,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M10 12L6 8l4-4",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/Pagination.tsx",
                        lineNumber: 69,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/Pagination.tsx",
                    lineNumber: 68,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shop/Pagination.tsx",
                lineNumber: 62,
                columnNumber: 13
            }, this),
            pages.map((p, i)=>p === null ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: "inline-flex items-center justify-center min-w-[2rem] h-9 text-sm text-stone-400 select-none",
                    "aria-hidden": "true",
                    children: "…"
                }, `ellipsis-${i}`, false, {
                    fileName: "[project]/src/components/shop/Pagination.tsx",
                    lineNumber: 75,
                    columnNumber: 21
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: ()=>onPageChange(p),
                    "aria-label": `Page ${p}`,
                    "aria-current": p === page ? 'page' : undefined,
                    className: p === page ? activeBtn : inactiveBtn,
                    children: p
                }, p, false, {
                    fileName: "[project]/src/components/shop/Pagination.tsx",
                    lineNumber: 83,
                    columnNumber: 21
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                onClick: ()=>onPageChange(page + 1),
                disabled: page === totalPages,
                "aria-label": "Next page",
                className: page === totalPages ? disabledBtn : inactiveBtn,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 16 16",
                    fill: "none",
                    "aria-hidden": "true",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                        d: "M6 4l4 4-4 4",
                        stroke: "currentColor",
                        strokeWidth: "1.8",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/Pagination.tsx",
                        lineNumber: 103,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/components/shop/Pagination.tsx",
                    lineNumber: 102,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/components/shop/Pagination.tsx",
                lineNumber: 96,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/Pagination.tsx",
        lineNumber: 57,
        columnNumber: 9
    }, this);
}
_c = Pagination;
var _c;
__turbopack_context__.k.register(_c, "Pagination");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearCartItems",
    ()=>clearCartItems,
    "fetchBrands",
    ()=>fetchBrands,
    "fetchCartItems",
    ()=>fetchCartItems,
    "fetchCategories",
    ()=>fetchCategories,
    "fetchProductBySlug",
    ()=>fetchProductBySlug,
    "fetchProducts",
    ()=>fetchProducts,
    "fetchProductsByKeyword",
    ()=>fetchProductsByKeyword,
    "fetchUserOrders",
    ()=>fetchUserOrders,
    "fetchUserProfile",
    ()=>fetchUserProfile,
    "fetchVariantStock",
    ()=>fetchVariantStock,
    "fetchWholesaleApplication",
    ()=>fetchWholesaleApplication,
    "getOrCreateCart",
    ()=>getOrCreateCart,
    "removeCartItem",
    ()=>removeCartItem,
    "submitWholesaleApplication",
    ()=>submitWholesaleApplication,
    "upsertCartItem",
    ()=>upsertCartItem
]);
/**
 * OUROZ – Centralized Supabase API layer (V2 schema)
 * Targets tables defined in supabase/migrations/010_shop_v2_schema.sql
 *
 * Import from here instead of writing inline supabase queries in hooks/components.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
// =============================================================================
// Shared join selector strings
// =============================================================================
const PRODUCT_CARD_SELECT = `
    *,
    brand:brand_id ( id, slug, name, name_ar, name_fr, logo_url ),
    category:category_id ( id, slug, name, name_ar, name_fr ),
    variants:product_variants (
        id, sku, weight, retail_price, compare_price,
        stock_quantity, is_active, sort_order,
        price_tiers ( min_quantity, price, label )
    )
`;
async function fetchUserProfile(userId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('user_id', userId).single();
    if (error || !data) return null;
    return data;
}
async function fetchWholesaleApplication(userId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('wholesale_applications').select('*').eq('user_id', userId).single();
    if (error || !data) return null;
    return data;
}
async function submitWholesaleApplication(payload) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('wholesale_applications').insert(payload);
    if (error) return {
        ok: false,
        error: error.message
    };
    return {
        ok: true
    };
}
async function fetchCategories() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('categories').select('*').eq('is_active', true).order('sort_order', {
        ascending: true
    });
    if (error || !data) return [];
    return data;
}
async function fetchBrands() {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('brands').select('*').eq('is_active', true).order('name', {
        ascending: true
    });
    if (error || !data) return [];
    return data;
}
async function fetchProducts(filters = {}) {
    const { page = 1, limit = 24, category_id, brand_id, search, is_featured, is_wholesale_enabled } = filters;
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let query = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select(PRODUCT_CARD_SELECT, {
        count: 'exact'
    }).eq('is_active', true).order('created_at', {
        ascending: false
    }).range(from, to);
    if (category_id) query = query.eq('category_id', category_id);
    if (brand_id) query = query.eq('brand_id', brand_id);
    if (is_featured) query = query.eq('is_featured', true);
    if (is_wholesale_enabled != null) query = query.eq('is_wholesale_enabled', is_wholesale_enabled);
    if (search?.trim()) {
        // Full-text search via the search_vector tsvector column
        query = query.textSearch('search_vector', search.trim(), {
            type: 'websearch',
            config: 'simple'
        });
    }
    const { data, error, count } = await query;
    if (error || !data) return {
        products: [],
        total: 0
    };
    return {
        products: data,
        total: count ?? 0
    };
}
async function fetchProductsByKeyword(keyword, limit = 24) {
    // Step 1: resolve keyword → product_id via search_keywords
    const { data: kwRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('search_keywords').select('product_id').ilike('keyword', `%${keyword}%`);
    const resolvedIds = (kwRows ?? []).map((r)=>r.product_id);
    if (resolvedIds.length > 0) {
        const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select(PRODUCT_CARD_SELECT).in('id', resolvedIds).eq('is_active', true).limit(limit);
        if (data?.length) return data;
    }
    // Step 2: ILIKE fallback against name / name_ar / name_fr
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select(PRODUCT_CARD_SELECT).or(`name.ilike.%${keyword}%,name_ar.ilike.%${keyword}%,name_fr.ilike.%${keyword}%`).eq('is_active', true).limit(limit);
    return data ?? [];
}
async function fetchProductBySlug(slug) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('products').select(PRODUCT_CARD_SELECT).eq('slug', slug).eq('is_active', true).single();
    if (error || !data) return null;
    return data;
}
async function getOrCreateCart(userId) {
    const { data: existing } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('carts').select('id').eq('user_id', userId).single();
    if (existing) return existing.id;
    const { data: newCart, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('carts').insert({
        user_id: userId
    }).select('id').single();
    if (error || !newCart) return null;
    return newCart.id;
}
async function fetchCartItems(cartId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('cart_items').select(`*,
             variant:variant_id (
                 *,
                 product:product_id ( id, slug, name, name_ar, name_fr, image_urls ),
                 price_tiers ( min_quantity, price, label )
             )`).eq('cart_id', cartId);
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data;
}
async function upsertCartItem(cartId, variantId, quantity) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('cart_items').upsert({
        cart_id: cartId,
        variant_id: variantId,
        quantity
    }, {
        onConflict: 'cart_id,variant_id'
    });
    return !error;
}
async function removeCartItem(cartId, variantId) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('cart_items').delete().eq('cart_id', cartId).eq('variant_id', variantId);
    return !error;
}
async function clearCartItems(cartId) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('cart_items').delete().eq('cart_id', cartId);
    return !error;
}
async function fetchVariantStock(variantId) {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').select('stock_quantity').eq('id', variantId).single();
    return data?.stock_quantity ?? 0;
}
async function fetchUserOrders(userId) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('*, order_items(*)').eq('user_id', userId).order('created_at', {
        ascending: false
    });
    if (error || !data) return [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data;
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useProducts.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useProducts",
    ()=>useProducts
]);
/**
 * useProducts – Products listing hook with filters, search, and pagination.
 *
 * Search strategy (per GOD MODE spec):
 *   1. If search input is present → Postgres FTS via search_vector
 *   2. If FTS yields 0 results → fallback to search_keywords UNION + ILIKE
 *   3. Otherwise → standard filtered query with pagination
 *
 * Returns:
 *   products, total, page, totalPages, loading, error
 *   setPage, setFilters (stable references → safe in dependency arrays)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
const DEFAULT_LIMIT = 24;
function useProducts(initialFilters = {}, limit = DEFAULT_LIMIT) {
    _s();
    const [filters, _setFilters] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters);
    const [page, _setPage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [total, setTotal] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Debounce search input to avoid hitting Supabase on every keystroke
    const searchDebounceRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const [debouncedSearch, setDebouncedSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialFilters.search ?? '');
    // Stable setters
    const setFilters = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProducts.useCallback[setFilters]": (next)=>{
            _setPage(1); // reset pagination on filter change
            _setFilters(next);
            // Debounce search specifically
            if (next.search !== undefined) {
                if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                searchDebounceRef.current = setTimeout({
                    "useProducts.useCallback[setFilters]": ()=>{
                        setDebouncedSearch(next.search ?? '');
                    }
                }["useProducts.useCallback[setFilters]"], 350);
            }
        }
    }["useProducts.useCallback[setFilters]"], []);
    const setPage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProducts.useCallback[setPage]": (p)=>_setPage(p)
    }["useProducts.useCallback[setPage]"], []);
    const reset = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useProducts.useCallback[reset]": ()=>{
            _setFilters({});
            _setPage(1);
            setDebouncedSearch('');
        }
    }["useProducts.useCallback[reset]"], []);
    // Fetch whenever effective filters or page changes
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useProducts.useEffect": ()=>{
            let cancelled = false;
            setLoading(true);
            setError(null);
            const effectiveSearch = debouncedSearch.trim();
            const run = {
                "useProducts.useEffect.run": async ()=>{
                    try {
                        const apiFilters = {
                            page,
                            limit,
                            category_id: filters.categoryId ?? null,
                            brand_id: filters.brandId ?? null,
                            is_featured: filters.isFeatured,
                            is_wholesale_enabled: filters.isWholesaleEnabled,
                            search: effectiveSearch || null
                        };
                        let result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProducts"])(apiFilters);
                        // If FTS returned 0 and there's a search term → try keyword fallback
                        if (result.total === 0 && effectiveSearch) {
                            const fallback = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchProductsByKeyword"])(effectiveSearch, limit);
                            result = {
                                products: fallback,
                                total: fallback.length
                            };
                        }
                        if (!cancelled) {
                            setProducts(result.products);
                            setTotal(result.total);
                        }
                    } catch (err) {
                        if (!cancelled) {
                            setError(err instanceof Error ? err.message : 'Failed to load products.');
                            setProducts([]);
                            setTotal(0);
                        }
                    } finally{
                        if (!cancelled) setLoading(false);
                    }
                }
            }["useProducts.useEffect.run"];
            run();
            return ({
                "useProducts.useEffect": ()=>{
                    cancelled = true;
                }
            })["useProducts.useEffect"];
        }
    }["useProducts.useEffect"], [
        filters,
        debouncedSearch,
        page,
        limit
    ]);
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return {
        products,
        total,
        page,
        totalPages,
        loading,
        error,
        setPage,
        setFilters,
        reset
    };
}
_s(useProducts, "iBz0kTLdiX9Zu8bfWxXE+9NS3qc=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useUserRole.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useUserRole",
    ()=>useUserRole
]);
/**
 * useUserRole – resolves the current user's role from user_profiles.
 * Listens to Supabase auth state changes so role updates immediately after
 * login/logout without requiring a full page refresh.
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useUserRole() {
    _s();
    const [profile, setProfile] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const loadProfile = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUserRole.useCallback[loadProfile]": async (uid)=>{
            if (!uid) {
                setProfile(null);
                setUserId(null);
                setLoading(false);
                return;
            }
            setLoading(true);
            const p = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchUserProfile"])(uid);
            setProfile(p);
            setUserId(uid);
            setLoading(false);
        }
    }["useUserRole.useCallback[loadProfile]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useUserRole.useEffect": ()=>{
            let cancelled = false;
            // Initial load from current session
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser().then({
                "useUserRole.useEffect": ({ data: { user } })=>{
                    if (!cancelled) loadProfile(user?.id ?? null);
                }
            }["useUserRole.useEffect"]);
            // React to login / logout / token refresh
            const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "useUserRole.useEffect": (_event, session)=>{
                    if (!cancelled) loadProfile(session?.user?.id ?? null);
                }
            }["useUserRole.useEffect"]);
            return ({
                "useUserRole.useEffect": ()=>{
                    cancelled = true;
                    subscription.unsubscribe();
                }
            })["useUserRole.useEffect"];
        }
    }["useUserRole.useEffect"], [
        loadProfile
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useUserRole.useCallback[refresh]": async ()=>{
            if (userId) await loadProfile(userId);
        }
    }["useUserRole.useCallback[refresh]"], [
        userId,
        loadProfile
    ]);
    return {
        role: profile?.role ?? null,
        profile,
        userId,
        loading,
        isAdmin: profile?.role === 'admin',
        isWholesale: profile?.role === 'wholesale',
        isCustomer: profile?.role === 'customer' || profile === null,
        refresh
    };
}
_s(useUserRole, "6qMllmnE8lBz2XVQZe+6QBnN1bw=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/hooks/useWholesaleStatus.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useWholesaleStatus",
    ()=>useWholesaleStatus
]);
/**
 * useWholesaleStatus – tracks the current user's wholesale application status.
 *
 * States:
 *   'not_applied' → no row in wholesale_applications
 *   'pending'     → submitted, awaiting admin review
 *   'approved'    → account active; wholesale pricing visible
 *   'rejected'    → admin rejected; can re-apply (business logic decision)
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/api.ts [app-client] (ecmascript)");
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
function useWholesaleStatus() {
    _s();
    const [application, setApplication] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const load = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWholesaleStatus.useCallback[load]": async (uid)=>{
            setLoading(true);
            if (!uid) {
                setApplication(null);
                setUserId(null);
                setLoading(false);
                return;
            }
            setUserId(uid);
            const app = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["fetchWholesaleApplication"])(uid);
            setApplication(app);
            setLoading(false);
        }
    }["useWholesaleStatus.useCallback[load]"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "useWholesaleStatus.useEffect": ()=>{
            let cancelled = false;
            __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser().then({
                "useWholesaleStatus.useEffect": ({ data: { user } })=>{
                    if (!cancelled) load(user?.id ?? null);
                }
            }["useWholesaleStatus.useEffect"]);
            const { data: { subscription } } = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.onAuthStateChange({
                "useWholesaleStatus.useEffect": (_event, session)=>{
                    if (!cancelled) load(session?.user?.id ?? null);
                }
            }["useWholesaleStatus.useEffect"]);
            return ({
                "useWholesaleStatus.useEffect": ()=>{
                    cancelled = true;
                    subscription.unsubscribe();
                }
            })["useWholesaleStatus.useEffect"];
        }
    }["useWholesaleStatus.useEffect"], [
        load
    ]);
    const refresh = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "useWholesaleStatus.useCallback[refresh]": async ()=>{
            if (userId) await load(userId);
        }
    }["useWholesaleStatus.useCallback[refresh]"], [
        userId,
        load
    ]);
    const status = application?.status ?? 'not_applied';
    return {
        status,
        application,
        loading,
        isApproved: status === 'approved',
        isPending: status === 'pending',
        isRejected: status === 'rejected',
        hasNotApplied: status === 'not_applied',
        refresh
    };
}
_s(useWholesaleStatus, "04Oo0RZBGVg1qvhPWCH82o8OEwo=");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/ShopPageClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ShopPageClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
/**
 * ShopPageClient – Full client-side shop page with:
 *   - Retail / Wholesale tabs
 *   - Search (debounced FTS + keyword fallback)
 *   - Category + Brand filters
 *   - Paginated product grid
 *   - Wholesale gate (role-aware)
 *
 * Receives category + brand lists as SSR props from the Server Component.
 * Product data is fetched client-side via useProducts (allows real-time filters).
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/ShopTabs.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/CategoryNav.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ProductGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/ProductGrid.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$WholesaleGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/WholesaleGate.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/SearchBar.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopFilters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/ShopFilters.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/shop/Pagination.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useProducts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useProducts.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUserRole$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useUserRole.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWholesaleStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/hooks/useWholesaleStatus.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
;
;
;
// -----------------------------------------------------------------------------
// Adapter: V2ProductCard → ProductCardData (for existing ProductCard component)
// -----------------------------------------------------------------------------
function toCardData(p, lang) {
    const activeVariants = p.variants?.filter((v)=>v.is_active) ?? [];
    const defaultVariant = activeVariants[0] ?? p.variants?.[0];
    const totalStock = activeVariants.reduce((s, v)=>s + v.stock_quantity, 0);
    const name = lang === 'ar' && p.name_ar ? p.name_ar : lang === 'fr' && p.name_fr ? p.name_fr : p.name;
    const tiers = defaultVariant?.price_tiers ?? [];
    const lowestTier = tiers.length > 0 ? Math.min(...tiers.map((t)=>t.price)) : null;
    return {
        id: p.id,
        slug: p.slug,
        name,
        short_description: null,
        primary_image: p.image_urls?.[0] ?? null,
        brand_name: p.brand?.name ?? null,
        category_name: p.category?.name ?? null,
        base_price: defaultVariant?.retail_price ?? p.base_price,
        compare_price: defaultVariant?.compare_price ?? p.compare_price,
        currency: 'AED',
        weight_label: defaultVariant?.weight ?? null,
        is_wholesale_enabled: p.is_wholesale_enabled,
        lowest_wholesale_price: lowestTier,
        stock_status: totalStock === 0 ? 'out_of_stock' : totalStock <= 10 ? 'low_stock' : 'in_stock'
    };
}
function ShopPageClient({ categories, brands, lang }) {
    _s();
    const [mode, setMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('retail');
    const [searchInput, setSearchInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    const [selectedCategoryId, setSelectedCategoryId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [selectedBrandId, setSelectedBrandId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const { isWholesale } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUserRole$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserRole"])();
    const { status: wholesaleStatus, loading: wsLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWholesaleStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWholesaleStatus"])();
    const { products, total, page, totalPages, loading, setPage, setFilters } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useProducts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"])({
        categoryId: selectedCategoryId,
        brandId: selectedBrandId,
        search: searchInput || undefined,
        isWholesaleEnabled: mode === 'wholesale' ? true : undefined
    });
    const cardData = products.map((p)=>toCardData(p, lang));
    // ------------------------------------------------------------------
    // Filter change handlers — sync useProducts filters
    // ------------------------------------------------------------------
    const handleSearch = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopPageClient.useCallback[handleSearch]": (val)=>{
            setSearchInput(val);
            setFilters({
                search: val || undefined,
                categoryId: selectedCategoryId,
                brandId: selectedBrandId,
                isWholesaleEnabled: mode === 'wholesale' ? true : undefined
            });
        }
    }["ShopPageClient.useCallback[handleSearch]"], [
        selectedCategoryId,
        selectedBrandId,
        mode,
        setFilters
    ]);
    const handleCategoryChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopPageClient.useCallback[handleCategoryChange]": (catId)=>{
            setSelectedCategoryId(catId);
            setFilters({
                search: searchInput || undefined,
                categoryId: catId,
                brandId: selectedBrandId,
                isWholesaleEnabled: mode === 'wholesale' ? true : undefined
            });
        }
    }["ShopPageClient.useCallback[handleCategoryChange]"], [
        searchInput,
        selectedBrandId,
        mode,
        setFilters
    ]);
    const handleBrandChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopPageClient.useCallback[handleBrandChange]": (brandId)=>{
            setSelectedBrandId(brandId);
            setFilters({
                search: searchInput || undefined,
                categoryId: selectedCategoryId,
                brandId,
                isWholesaleEnabled: mode === 'wholesale' ? true : undefined
            });
        }
    }["ShopPageClient.useCallback[handleBrandChange]"], [
        searchInput,
        selectedCategoryId,
        mode,
        setFilters
    ]);
    const handleModeChange = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCallback"])({
        "ShopPageClient.useCallback[handleModeChange]": (newMode)=>{
            setMode(newMode);
            setFilters({
                search: searchInput || undefined,
                categoryId: selectedCategoryId,
                brandId: selectedBrandId,
                isWholesaleEnabled: newMode === 'wholesale' ? true : undefined
            });
        }
    }["ShopPageClient.useCallback[handleModeChange]"], [
        searchInput,
        selectedCategoryId,
        selectedBrandId,
        setFilters
    ]);
    // ------------------------------------------------------------------
    // Wholesale gate status mapping (V2 → V1 compatible type)
    // ------------------------------------------------------------------
    const gateStatus = wsLoading ? null : wholesaleStatus === 'not_applied' ? null : wholesaleStatus;
    // ------------------------------------------------------------------
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-6",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopTabs$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                mode: mode,
                onChange: handleModeChange,
                className: "max-w-sm"
            }, void 0, false, {
                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                lineNumber: 151,
                columnNumber: 13
            }, this),
            mode === 'wholesale' && !wsLoading && gateStatus !== 'approved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$WholesaleGate$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                applicationStatus: gateStatus
            }, void 0, false, {
                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                lineNumber: 155,
                columnNumber: 17
            }, this),
            (mode === 'retail' || mode === 'wholesale' && (wsLoading || gateStatus === 'approved')) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Fragment"], {
                children: [
                    mode === 'wholesale' && gateStatus === 'approved' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2 bg-[var(--color-zellige)]/10 border border-[var(--color-zellige)]/30 rounded-xl px-4 py-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "✅"
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                lineNumber: 165,
                                columnNumber: 29
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[var(--color-zellige)] font-medium",
                                children: "You're viewing wholesale pricing. Tier discounts apply at checkout."
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                lineNumber: 166,
                                columnNumber: 29
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                        lineNumber: 163,
                        columnNumber: 25
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$SearchBar$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        onSearch: handleSearch,
                        value: searchInput,
                        placeholder: lang === 'ar' ? 'ابحث عن المنتجات…' : lang === 'fr' ? 'Rechercher des produits…' : 'Search products…',
                        className: "w-full max-w-xl"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                        lineNumber: 173,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$CategoryNav$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                        categories: categories.map((c)=>({
                                id: c.id,
                                slug: c.slug,
                                name: lang === 'ar' && c.name_ar ? c.name_ar : lang === 'fr' && c.name_fr ? c.name_fr : c.name,
                                is_active: c.is_active,
                                sort_order: c.sort_order,
                                icon: c.icon,
                                image_url: c.image_url,
                                parent_id: c.parent_id,
                                created_at: c.created_at,
                                updated_at: c.created_at
                            })),
                        activeSlug: undefined
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                        lineNumber: 185,
                        columnNumber: 21
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex gap-8 items-start",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                                className: "hidden md:block w-52 flex-shrink-0",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopFilters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                    categories: categories,
                                    brands: brands,
                                    selectedCategoryId: selectedCategoryId,
                                    selectedBrandId: selectedBrandId,
                                    onCategoryChange: handleCategoryChange,
                                    onBrandChange: handleBrandChange,
                                    lang: lang
                                }, void 0, false, {
                                    fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                    lineNumber: 206,
                                    columnNumber: 29
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                lineNumber: 205,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex-1 min-w-0 space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "md:hidden",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ShopFilters$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                            categories: categories,
                                            brands: brands,
                                            selectedCategoryId: selectedCategoryId,
                                            selectedBrandId: selectedBrandId,
                                            onCategoryChange: handleCategoryChange,
                                            onBrandChange: handleBrandChange,
                                            lang: lang
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                            lineNumber: 221,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                        lineNumber: 220,
                                        columnNumber: 29
                                    }, this),
                                    !loading && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-stone-400",
                                        children: [
                                            total,
                                            " ",
                                            total === 1 ? 'product' : 'products',
                                            " found"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                        lineNumber: 234,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$ProductGrid$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        products: cardData,
                                        mode: mode,
                                        loading: loading,
                                        skeletonCount: 8
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                        lineNumber: 239,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$shop$2f$Pagination$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                        page: page,
                                        totalPages: totalPages,
                                        onPageChange: setPage,
                                        className: "pt-2"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                        lineNumber: 247,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                                lineNumber: 218,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
                        lineNumber: 203,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/ShopPageClient.tsx",
        lineNumber: 149,
        columnNumber: 9
    }, this);
}
_s(ShopPageClient, "oxYLseoSCVGNmkQMOXBoY/m+vYg=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useUserRole$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useUserRole"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useWholesaleStatus$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useWholesaleStatus"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$hooks$2f$useProducts$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useProducts"]
    ];
});
_c = ShopPageClient;
var _c;
__turbopack_context__.k.register(_c, "ShopPageClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/shop/BrandTicker.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>BrandTicker
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/styled-jsx/style.js [app-client] (ecmascript)");
'use client';
;
;
const SCREENSHOT_BRAND_NAMES = [
    'Aicha',
    'Alitkane',
    'Alsa',
    'Amber',
    'Asta Café',
    'Bellar',
    'Bimo',
    'Dari',
    'Délicia',
    'Leo',
    'Ghadaq',
    'Hanouna Taste',
    'Henry’s',
    'House of Argan',
    'Idéal',
    'Isabel',
    'Jibal',
    'Joly',
    'Kenz',
    'Knorr',
    'Made in Morocco',
    'Moroccan Heritage',
    'Oued Souss',
    'Rouh Dounia',
    'Star',
    'Sultan',
    'Taous',
    'Tiyya Maroc',
    'TopChef',
    'Yamfu'
];
function normalize(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
}
function BrandTicker({ brands }) {
    const brandByNormalizedName = new Map(brands.map((brand)=>[
            normalize(brand.name),
            brand
        ]));
    const orderedBrands = SCREENSHOT_BRAND_NAMES.map((name)=>{
        const matched = brandByNormalizedName.get(normalize(name));
        return {
            id: matched?.id ?? name,
            name,
            logoUrl: matched?.logo_url ?? null,
            slug: matched?.slug ?? null
        };
    });
    const items = [
        ...orderedBrands,
        ...orderedBrands
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: "jsx-ce87af6ab4d54617" + " " + "rounded-3xl border border-stone-200 bg-white px-4 py-6 md:px-6 md:py-8",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-ce87af6ab4d54617" + " " + "mb-4 md:mb-5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "jsx-ce87af6ab4d54617" + " " + "text-lg md:text-xl font-semibold text-[var(--color-charcoal)]",
                        children: "Trusted Moroccan Brands"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                        lineNumber: 71,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        className: "jsx-ce87af6ab4d54617" + " " + "text-sm text-stone-500",
                        children: "Selected brands available across retail and wholesale."
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                        lineNumber: 72,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/BrandTicker.tsx",
                lineNumber: 70,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "jsx-ce87af6ab4d54617" + " " + "relative overflow-hidden rounded-2xl border border-stone-100 bg-stone-50/70 py-3",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-ce87af6ab4d54617" + " " + "pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-stone-50 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                        lineNumber: 76,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "jsx-ce87af6ab4d54617" + " " + "pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-stone-50 to-transparent"
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                        lineNumber: 77,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        "aria-label": "Moroccan brands ticker",
                        className: "jsx-ce87af6ab4d54617" + " " + "brand-ticker-track motion-reduce:!animate-none",
                        children: items.map((brand, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("article", {
                                className: "jsx-ce87af6ab4d54617" + " " + "inline-flex min-w-[180px] items-center gap-3 rounded-2xl border border-stone-200 bg-white px-3 py-2.5 shadow-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-ce87af6ab4d54617" + " " + "h-9 w-9 overflow-hidden rounded-xl border border-stone-200 bg-stone-50 flex items-center justify-center",
                                        children: brand.logoUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                            src: brand.logoUrl,
                                            alt: `${brand.name} logo`,
                                            loading: "lazy",
                                            className: "jsx-ce87af6ab4d54617" + " " + "h-full w-full object-cover"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                            lineNumber: 87,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "jsx-ce87af6ab4d54617" + " " + "text-xs font-semibold text-stone-500",
                                            children: brand.name.slice(0, 2).toUpperCase()
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                            lineNumber: 94,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "jsx-ce87af6ab4d54617" + " " + "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-ce87af6ab4d54617" + " " + "truncate text-sm font-semibold text-stone-700",
                                                children: brand.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                                lineNumber: 100,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "jsx-ce87af6ab4d54617" + " " + "truncate text-[11px] text-stone-400",
                                                children: "Moroccan Brand"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                                lineNumber: 101,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                        lineNumber: 99,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, `${brand.id}-${idx}`, true, {
                                fileName: "[project]/src/components/shop/BrandTicker.tsx",
                                lineNumber: 81,
                                columnNumber: 13
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/src/components/shop/BrandTicker.tsx",
                        lineNumber: 79,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/shop/BrandTicker.tsx",
                lineNumber: 75,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$styled$2d$jsx$2f$style$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                id: "ce87af6ab4d54617",
                children: ".brand-ticker-track.jsx-ce87af6ab4d54617{will-change:transform;align-items:center;gap:.75rem;width:max-content;animation:36s linear infinite brandTickerRightToLeft;display:flex}.brand-ticker-track.jsx-ce87af6ab4d54617:hover{animation-play-state:paused}@keyframes brandTickerRightToLeft{0%{transform:translate(0)}to{transform:translate(-50%)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/shop/BrandTicker.tsx",
        lineNumber: 69,
        columnNumber: 5
    }, this);
}
_c = BrandTicker;
var _c;
__turbopack_context__.k.register(_c, "BrandTicker");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_d7fd362f._.js.map