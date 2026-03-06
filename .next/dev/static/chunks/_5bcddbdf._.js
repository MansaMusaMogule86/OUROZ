(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/services/creditService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "activateCreditAccount",
    ()=>activateCreditAccount,
    "approveBusiness",
    ()=>approveBusiness,
    "canUseInvoice",
    ()=>canUseInvoice,
    "checkCreditEligibility",
    ()=>checkCreditEligibility,
    "createInvoice",
    ()=>createInvoice,
    "createInvoiceForOrder",
    ()=>createInvoiceForOrder,
    "fetchLedgerHistory",
    ()=>fetchLedgerHistory,
    "getCreditStatus",
    ()=>getCreditStatus,
    "markOverdueInvoices",
    ()=>markOverdueInvoices,
    "postLedgerCharge",
    ()=>postLedgerCharge,
    "postLedgerPayment",
    ()=>postLedgerPayment,
    "postManualAdjustment",
    ()=>postManualAdjustment,
    "processB2BCheckout",
    ()=>processB2BCheckout,
    "recordPayment",
    ()=>recordPayment,
    "rejectBusiness",
    ()=>rejectBusiness
]);
/**
 * OUROZ - creditService
 * All credit-related business logic that calls Supabase.
 * Uses the browser client for client contexts and service-role for server contexts.
 * Extended with getCreditStatus, canUseInvoice, createInvoiceForOrder, activateCreditAccount
 */ var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
;
async function checkCreditEligibility(businessId, orderTotal) {
    // Fetch credit account
    const { data: account } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').select('*').eq('business_id', businessId).eq('status', 'active').single();
    if (!account) {
        return {
            can_use_invoice: false,
            reason: 'No active credit account. Contact your account manager.',
            available_credit: 0,
            outstanding: 0,
            credit_limit: 0
        };
    }
    // Get outstanding balance via RPC
    const { data: outstandingRaw } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_outstanding_balance', {
        p_business_id: businessId
    });
    const outstanding = Number(outstandingRaw ?? 0);
    const { data: availableRaw } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_available_credit', {
        p_business_id: businessId
    });
    const available = Number(availableRaw ?? 0);
    // Check for overdue invoices
    const { data: hasOverdue } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('has_overdue_invoices', {
        p_business_id: businessId
    });
    if (hasOverdue) {
        return {
            can_use_invoice: false,
            reason: 'Credit is on hold due to overdue invoices. Please settle outstanding amounts first.',
            available_credit: available,
            outstanding,
            credit_limit: account.credit_limit
        };
    }
    if (orderTotal > available) {
        return {
            can_use_invoice: false,
            reason: `Insufficient credit. Available: AED ${available.toFixed(2)}, Order total: AED ${orderTotal.toFixed(2)}.`,
            available_credit: available,
            outstanding,
            credit_limit: account.credit_limit
        };
    }
    return {
        can_use_invoice: true,
        reason: null,
        available_credit: available,
        outstanding,
        credit_limit: account.credit_limit
    };
}
async function createInvoice(input) {
    // Generate invoice number
    const { data: invNumber } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('generate_invoice_number');
    if (!invNumber) return null;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + input.termsdays);
    const dueDateStr = dueDate.toISOString().split('T')[0];
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('invoices').insert({
        business_id: input.businessId,
        order_id: input.orderId,
        invoice_number: invNumber,
        subtotal: input.subtotal,
        tax_amount: input.taxAmount,
        total: input.total,
        amount_paid: 0,
        due_date: dueDateStr,
        status: 'issued'
    }).select().single();
    if (error || !data) return null;
    return data;
}
async function postLedgerCharge(businessId, amount, orderId, invoiceId, note) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type: 'charge',
        p_amount: amount,
        p_order_id: orderId,
        p_invoice_id: invoiceId,
        p_note: note ?? `Invoice ${invoiceId}`
    });
    if (error) return null;
    return Number(data);
}
async function postLedgerPayment(businessId, amount, invoiceId, note, createdBy) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type: 'payment',
        p_amount: -Math.abs(amount),
        p_invoice_id: invoiceId,
        p_note: note ?? 'Payment received',
        p_created_by: createdBy ?? null
    });
    if (error) return null;
    return Number(data);
}
async function postManualAdjustment(businessId, amount, note, createdBy) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type: 'adjustment',
        p_amount: amount,
        p_note: note,
        p_created_by: createdBy
    });
    if (error) return null;
    return Number(data);
}
async function recordPayment(input) {
    const { error: payError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('payments').insert({
        business_id: input.businessId,
        invoice_id: input.invoiceId,
        amount: input.amount,
        method: input.method,
        reference: input.reference ?? null,
        notes: input.notes ?? null,
        received_at: input.receivedAt ?? new Date().toISOString(),
        recorded_by: input.recordedBy
    });
    if (payError) return {
        ok: false,
        error: payError.message
    };
    // Post negative ledger entry (payment reduces outstanding)
    await postLedgerPayment(input.businessId, input.amount, input.invoiceId, `Payment via ${input.method}${input.reference ? ` (ref: ${input.reference})` : ''}`, input.recordedBy);
    return {
        ok: true
    };
}
async function processB2BCheckout(payload, cartItems, subtotal, vatAmount, total, userId) {
    try {
        // 1. Credit check if paying by invoice
        if (payload.payment_method === 'invoice') {
            const creditCheck = await checkCreditEligibility(payload.business_id, total);
            if (!creditCheck.can_use_invoice) {
                return {
                    ok: false,
                    error: creditCheck.reason ?? 'Credit checkout unavailable.'
                };
            }
        }
        // 2. Generate order number
        const { data: orderNumber } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('generate_order_number');
        if (!orderNumber) return {
            ok: false,
            error: 'Failed to generate order number.'
        };
        // 3. Create order
        const { data: order, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').insert({
            user_id: userId,
            business_id: payload.business_id,
            order_number: orderNumber,
            subtotal,
            shipping_cost: 0,
            vat_amount: vatAmount,
            total,
            currency: 'AED',
            is_wholesale: true,
            payment_method: payload.payment_method,
            status: 'pending',
            shipping_name: payload.shipping_name,
            shipping_phone: payload.shipping_phone,
            shipping_address: payload.shipping_address,
            shipping_emirate: payload.shipping_emirate,
            notes: payload.notes ?? null
        }).select('id').single();
        if (orderError || !order) {
            return {
                ok: false,
                error: orderError?.message ?? 'Failed to create order.'
            };
        }
        // 4. Create order items
        const orderItemsPayload = cartItems.map((item)=>({
                order_id: order.id,
                variant_id: item.variant_id,
                product_name: item.name,
                variant_sku: item.sku,
                variant_label: item.label,
                product_image_url: item.image,
                price_at_purchase: item.unit_price,
                quantity: item.qty,
                line_total: item.line_total
            }));
        const { error: itemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').insert(orderItemsPayload);
        if (itemsError) {
            return {
                ok: false,
                error: itemsError.message
            };
        }
        // 5. If invoice checkout: create invoice + post ledger charge
        let invoiceId;
        if (payload.payment_method === 'invoice') {
            // Get terms from credit account
            const { data: creditAccount } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').select('terms_days').eq('business_id', payload.business_id).single();
            const termsdays = creditAccount?.terms_days ?? 30;
            const invoice = await createInvoice({
                businessId: payload.business_id,
                orderId: order.id,
                subtotal,
                taxAmount: vatAmount,
                total,
                termsdays
            });
            if (!invoice) {
                return {
                    ok: false,
                    error: 'Failed to create invoice.'
                };
            }
            invoiceId = invoice.id;
            // Link invoice to order
            await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
                invoice_id: invoiceId
            }).eq('id', order.id);
            // Post ledger charge
            await postLedgerCharge(payload.business_id, total, order.id, invoiceId, `Order ${orderNumber}`);
        }
        return {
            ok: true,
            order_id: order.id,
            invoice_id: invoiceId,
            order_number: orderNumber
        };
    } catch (err) {
        return {
            ok: false,
            error: err instanceof Error ? err.message : 'Checkout failed.'
        };
    }
}
async function approveBusiness(businessId, adminUserId, creditLimit = 0, termsdays = 30) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('businesses').update({
        status: 'approved',
        approved_at: new Date().toISOString(),
        approved_by: adminUserId,
        rejection_reason: null
    }).eq('id', businessId);
    if (error) return {
        ok: false,
        error: error.message
    };
    // Create credit account with conservative defaults
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').upsert({
        business_id: businessId,
        credit_limit: creditLimit,
        terms_days: termsdays,
        status: 'active'
    }, {
        onConflict: 'business_id'
    });
    return {
        ok: true
    };
}
async function rejectBusiness(businessId, reason) {
    const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('businesses').update({
        status: 'rejected',
        rejection_reason: reason
    }).eq('id', businessId);
    if (error) return {
        ok: false,
        error: error.message
    };
    return {
        ok: true
    };
}
async function fetchLedgerHistory(businessId, limit = 50) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_ledger').select('*').eq('business_id', businessId).order('created_at', {
        ascending: false
    }).limit(limit);
    if (error || !data) return [];
    return data;
}
async function markOverdueInvoices() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('mark_overdue_invoices');
    return Number(data ?? 0);
}
async function getCreditStatus(businessId) {
    const [accountResult, outstandingResult, overdueResult] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').select('*').eq('business_id', businessId).maybeSingle(),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('get_outstanding_balance', {
            p_business_id: businessId
        }),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('has_overdue_invoices', {
            p_business_id: businessId
        })
    ]);
    const account = accountResult.data;
    if (!account) {
        return {
            status: 'none',
            credit_limit: 0,
            outstanding: 0,
            available: 0,
            has_overdue: false,
            terms_days: 0,
            risk_tier: 'starter',
            suspended_reason: null,
            last_reviewed_at: null
        };
    }
    const outstanding = Number(outstandingResult.data ?? 0);
    const hasOverdue = Boolean(overdueResult.data ?? false);
    // Map DB enum ('active' | 'suspended') to the extended status union.
    const status = account.status === 'active' ? 'active' : account.status === 'suspended' ? 'suspended' : 'inactive';
    const available = Math.max(0, account.credit_limit - outstanding);
    // risk_tier is not a column in the base CreditAccount schema; fall back to
    // 'starter'. Callers that need the precise tier should use riskService.
    const riskTierRaw = account.risk_tier;
    const riskTier = riskTierRaw === 'trusted' ? 'trusted' : riskTierRaw === 'pro' ? 'pro' : 'starter';
    return {
        status,
        credit_limit: account.credit_limit,
        outstanding,
        available,
        has_overdue: hasOverdue,
        terms_days: account.terms_days,
        risk_tier: riskTier,
        suspended_reason: account.suspended_reason,
        last_reviewed_at: account.updated_at ?? null
    };
}
async function canUseInvoice(businessId, orderTotal) {
    const creditStatus = await getCreditStatus(businessId);
    if (creditStatus.status === 'none' || creditStatus.status === 'inactive') {
        return {
            allowed: false,
            reason: 'No active credit account. Contact your account manager.',
            available: 0
        };
    }
    if (creditStatus.status === 'suspended') {
        return {
            allowed: false,
            reason: creditStatus.suspended_reason ?? 'Credit account is suspended.',
            available: creditStatus.available
        };
    }
    if (creditStatus.has_overdue) {
        return {
            allowed: false,
            reason: 'Credit is on hold due to overdue invoices. Please settle outstanding amounts first.',
            available: creditStatus.available
        };
    }
    if (orderTotal > creditStatus.available) {
        return {
            allowed: false,
            reason: `Insufficient credit. Available: AED ${creditStatus.available.toFixed(2)}, Order total: AED ${orderTotal.toFixed(2)}.`,
            available: creditStatus.available
        };
    }
    return {
        allowed: true,
        reason: null,
        available: creditStatus.available
    };
}
async function createInvoiceForOrder(orderId, businessId) {
    // Fetch order financials and credit terms in parallel.
    const [orderResult, accountResult] = await Promise.all([
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').select('subtotal, vat_amount, total').eq('id', orderId).single(),
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').select('terms_days').eq('business_id', businessId).single()
    ]);
    if (orderResult.error || !orderResult.data) return null;
    const order = orderResult.data;
    const termsdays = accountResult.data?.terms_days ?? 30;
    // Create the invoice record.
    const invoice = await createInvoice({
        businessId,
        orderId,
        subtotal: Number(order.subtotal),
        taxAmount: Number(order.vat_amount),
        total: Number(order.total),
        termsdays
    });
    if (!invoice) return null;
    // Link invoice to order (best-effort; non-fatal if it fails).
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').update({
        invoice_id: invoice.id
    }).eq('id', orderId);
    // Post the corresponding ledger charge.
    await postLedgerCharge(businessId, Number(order.total), orderId, invoice.id, `Invoice ${invoice.invoice_number}`);
    return invoice;
}
async function activateCreditAccount(businessId, creditLimit, termsDays, riskTier, adminUserId) {
    const now = new Date().toISOString();
    const { error: upsertError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('credit_accounts').upsert({
        business_id: businessId,
        credit_limit: creditLimit,
        terms_days: termsDays,
        status: 'active',
        suspended_at: null,
        suspended_reason: null,
        updated_at: now
    }, {
        onConflict: 'business_id'
    });
    if (upsertError) return {
        ok: false,
        error: upsertError.message
    };
    // Record the activation in the admin audit log.
    await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('log_admin_action', {
        p_actor_user_id: adminUserId,
        p_action: 'activate_credit',
        p_entity_type: 'credit_account',
        p_entity_id: businessId,
        p_payload: {
            credit_limit: creditLimit,
            terms_days: termsDays,
            risk_tier: riskTier,
            activated_at: now
        }
    });
    return {
        ok: true
    };
}
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/checkout/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/supabase.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/contexts/CartContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$creditService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/creditService.ts [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
const EMIRATES = [
    'Dubai',
    'Abu Dhabi',
    'Sharjah',
    'Ajman',
    'Umm Al Quwain',
    'Ras Al Khaimah',
    'Fujairah'
];
const INITIAL_SHIPPING = {
    name: '',
    phone: '',
    address: '',
    emirate: 'Dubai'
};
function CheckoutPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { cart, clearCart } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [placingOrder, setPlacingOrder] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [business, setBusiness] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [shipping, setShipping] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(INITIAL_SHIPPING);
    const [checkoutMode, setCheckoutMode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('pay_now');
    const [invoiceEligible, setInvoiceEligible] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [invoiceReason, setInvoiceReason] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [availableCredit, setAvailableCredit] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const subtotal = cart?.subtotal ?? 0;
    const vat = subtotal * 0.05;
    const shippingFee = subtotal >= 150 ? 0 : 25;
    const total = subtotal + vat + shippingFee;
    const canAttemptInvoice = business?.status === 'approved';
    const summary = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useMemo"])({
        "CheckoutPage.useMemo[summary]": ()=>{
            return {
                itemCount: cart?.item_count ?? 0,
                subtotal,
                vat,
                shippingFee,
                total
            };
        }
    }["CheckoutPage.useMemo[summary]"], [
        cart?.item_count,
        subtotal,
        vat,
        shippingFee,
        total
    ]);
    const fmtAED = (value)=>`AED ${value.toLocaleString('en-AE', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            void initialize();
        }
    }["CheckoutPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (!canAttemptInvoice) {
                setInvoiceEligible(false);
                setInvoiceReason('Only approved business accounts can use Pay on Invoice.');
                setCheckoutMode('pay_now');
                return;
            }
            void refreshInvoiceEligibility();
        }
    }["CheckoutPage.useEffect"], [
        canAttemptInvoice,
        business?.id,
        total
    ]);
    async function initialize() {
        setLoading(true);
        setError(null);
        const { data: { user } } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
        setUserId(user?.id ?? null);
        if (!user) {
            setLoading(false);
            return;
        }
        // Business membership first, owner fallback second.
        const { data: membershipRows } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('business_members').select('business:business_id(id, status, name)').eq('user_id', user.id).limit(1);
        const memberBusiness = membershipRows?.[0]?.business;
        if (memberBusiness) {
            setBusiness(Array.isArray(memberBusiness) ? memberBusiness[0] ?? null : memberBusiness);
            setLoading(false);
            return;
        }
        const { data: ownerBusiness } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('businesses').select('id, status, name').eq('owner_user_id', user.id).limit(1).maybeSingle();
        setBusiness(ownerBusiness ?? null);
        setLoading(false);
    }
    async function refreshInvoiceEligibility() {
        if (!business?.id || !canAttemptInvoice) {
            return;
        }
        const check = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$creditService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseInvoice"])(business.id, total);
        setInvoiceEligible(check.allowed);
        setInvoiceReason(check.reason);
        setAvailableCredit(check.available);
        if (!check.allowed && checkoutMode === 'invoice') {
            setCheckoutMode('pay_now');
        }
    }
    function updateField(field, value) {
        setShipping((prev)=>({
                ...prev,
                [field]: value
            }));
    }
    function validateShipping() {
        if (!shipping.name.trim()) return 'Full name is required.';
        if (!shipping.phone.trim()) return 'Phone number is required.';
        if (!shipping.address.trim()) return 'Address is required.';
        if (!shipping.emirate.trim()) return 'Emirate is required.';
        return null;
    }
    async function validateStock() {
        if (!cart?.items?.length) return {
            ok: false,
            message: 'Cart is empty.'
        };
        const variantIds = cart.items.map((item)=>item.variant_id);
        const { data, error: stockError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('product_variants').select('id, stock_quantity').in('id', variantIds);
        if (stockError || !data) {
            return {
                ok: false,
                message: 'Unable to validate stock right now. Please retry.'
            };
        }
        const stockMap = new Map(data.map((row)=>[
                row.id,
                Number(row.stock_quantity)
            ]));
        for (const line of cart.items){
            const available = stockMap.get(line.variant_id) ?? 0;
            if (line.qty > available) {
                return {
                    ok: false,
                    message: `Stock is not enough for ${line.product_name}. Available: ${available}, requested: ${line.qty}.`
                };
            }
        }
        return {
            ok: true,
            message: null
        };
    }
    async function placeOrder() {
        setError(null);
        if (!userId) {
            setError('Please sign in to place your order.');
            return;
        }
        if (!cart?.items?.length) {
            setError('Your cart is empty.');
            return;
        }
        const shippingError = validateShipping();
        if (shippingError) {
            setError(shippingError);
            return;
        }
        if (checkoutMode === 'invoice') {
            if (!business?.id) {
                setError('Invoice checkout requires an approved business account.');
                return;
            }
            const check = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$creditService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["canUseInvoice"])(business.id, total);
            if (!check.allowed) {
                setError(check.reason ?? 'Pay on Invoice is currently unavailable.');
                setCheckoutMode('pay_now');
                return;
            }
        }
        const stockCheck = await validateStock();
        if (!stockCheck.ok) {
            setError(stockCheck.message);
            return;
        }
        setPlacingOrder(true);
        try {
            const { data: orderNumber, error: orderNumberError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].rpc('generate_order_number');
            if (orderNumberError || !orderNumber) {
                throw new Error('Failed to generate order number.');
            }
            const isWholesale = checkoutMode === 'invoice' || business?.status === 'approved';
            const { data: order, error: orderError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('orders').insert({
                user_id: userId,
                business_id: checkoutMode === 'invoice' ? business?.id ?? null : null,
                order_number: orderNumber,
                subtotal,
                shipping_cost: shippingFee,
                vat_amount: vat,
                total,
                currency: 'AED',
                is_wholesale: isWholesale,
                order_type: isWholesale ? 'wholesale' : 'retail',
                payment_mode: checkoutMode,
                payment_method: checkoutMode === 'invoice' ? 'invoice' : 'card',
                status: 'pending',
                shipping_name: shipping.name,
                shipping_phone: shipping.phone,
                shipping_address: shipping.address,
                shipping_emirate: shipping.emirate
            }).select('id').single();
            if (orderError || !order) {
                throw new Error(orderError?.message ?? 'Failed to create order.');
            }
            const orderItemsPayload = cart.items.map((item)=>({
                    order_id: order.id,
                    variant_id: item.variant_id,
                    product_name: item.product_name,
                    variant_sku: item.variant_sku,
                    variant_label: item.variant_label,
                    product_image_url: item.image_url,
                    price_at_purchase: item.unit_price,
                    quantity: item.qty,
                    line_total: item.line_total
                }));
            const { error: itemsError } = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$supabase$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["supabase"].from('order_items').insert(orderItemsPayload);
            if (itemsError) {
                throw new Error(itemsError.message);
            }
            let invoiceNumber = null;
            let invoiceDueDate = null;
            if (checkoutMode === 'invoice' && business?.id) {
                const invoice = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$creditService$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createInvoiceForOrder"])(order.id, business.id);
                if (!invoice) {
                    throw new Error('Order placed, but invoice generation failed. Please contact support.');
                }
                invoiceNumber = invoice.invoice_number;
                invoiceDueDate = invoice.due_date;
            }
            await clearCart();
            const query = new URLSearchParams({
                order: orderNumber,
                mode: checkoutMode
            });
            if (invoiceNumber) query.set('invoice', invoiceNumber);
            if (invoiceDueDate) query.set('due', invoiceDueDate);
            router.push(`/checkout/success?${query.toString()}`);
        } catch (checkoutError) {
            setError(checkoutError instanceof Error ? checkoutError.message : 'Checkout failed. Please try again.');
        } finally{
            setPlacingOrder(false);
        }
    }
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-5xl mx-auto py-16 px-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "h-10 w-48 rounded bg-stone-100 animate-pulse motion-reduce:animate-none"
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 299,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:col-span-2 h-96 rounded bg-stone-100 animate-pulse motion-reduce:animate-none"
                        }, void 0, false, {
                            fileName: "[project]/app/checkout/page.tsx",
                            lineNumber: 301,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "h-72 rounded bg-stone-100 animate-pulse motion-reduce:animate-none"
                        }, void 0, false, {
                            fileName: "[project]/app/checkout/page.tsx",
                            lineNumber: 302,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 300,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/checkout/page.tsx",
            lineNumber: 298,
            columnNumber: 13
        }, this);
    }
    if (!userId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md mx-auto py-20 px-4 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-semibold text-[var(--color-charcoal)]",
                    children: "Sign in required"
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 311,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-stone-500 mt-2",
                    children: "Please sign in to continue to checkout."
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 312,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/auth/login?return=/checkout",
                    className: "inline-flex mt-6 px-6 py-3 rounded-xl bg-[var(--color-imperial)] text-white text-sm font-semibold hover:bg-[var(--color-imperial)]/90 transition",
                    children: "Sign In"
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 313,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/checkout/page.tsx",
            lineNumber: 310,
            columnNumber: 13
        }, this);
    }
    if (!cart?.items?.length) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "max-w-md mx-auto py-20 px-4 text-center",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                    className: "text-2xl font-semibold text-[var(--color-charcoal)]",
                    children: "Your cart is empty"
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 323,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-stone-500 mt-2",
                    children: "Add products first, then return to checkout."
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 324,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                    href: "/shop",
                    className: "inline-flex mt-6 px-6 py-3 rounded-xl bg-[var(--color-imperial)] text-white text-sm font-semibold hover:bg-[var(--color-imperial)]/90 transition",
                    children: "Back to Shop"
                }, void 0, false, {
                    fileName: "[project]/app/checkout/page.tsx",
                    lineNumber: 325,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/checkout/page.tsx",
            lineNumber: 322,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "max-w-6xl mx-auto py-8 px-4",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                className: "text-2xl font-semibold text-[var(--color-charcoal)] mb-6",
                children: "Checkout"
            }, void 0, false, {
                fileName: "[project]/app/checkout/page.tsx",
                lineNumber: 334,
                columnNumber: 13
            }, this),
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700",
                children: error
            }, void 0, false, {
                fileName: "[project]/app/checkout/page.tsx",
                lineNumber: 337,
                columnNumber: 17
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "lg:col-span-2 bg-white rounded-2xl border border-stone-100 p-6 space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-semibold text-[var(--color-charcoal)] mb-3",
                                        children: "Shipping details"
                                    }, void 0, false, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 345,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-semibold text-stone-500 mb-1.5",
                                                        children: "Full name *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 348,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: shipping.name,
                                                        onChange: (e)=>updateField('name', e.target.value),
                                                        className: "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 349,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 347,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-semibold text-stone-500 mb-1.5",
                                                        children: "Phone *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 357,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "tel",
                                                        value: shipping.phone,
                                                        onChange: (e)=>updateField('phone', e.target.value),
                                                        className: "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 356,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-semibold text-stone-500 mb-1.5",
                                                        children: "Emirate *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 366,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                        value: shipping.emirate,
                                                        onChange: (e)=>updateField('emirate', e.target.value),
                                                        className: "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20",
                                                        children: EMIRATES.map((emirate)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                value: emirate,
                                                                children: emirate
                                                            }, emirate, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 373,
                                                                columnNumber: 41
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 367,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 365,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-semibold text-stone-500 mb-1.5",
                                                        children: "Address *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 378,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                        rows: 3,
                                                        value: shipping.address,
                                                        onChange: (e)=>updateField('address', e.target.value),
                                                        className: "w-full px-3.5 py-2.5 text-sm border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-imperial)]/20"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 379,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 377,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 346,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 344,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "text-base font-semibold text-[var(--color-charcoal)] mb-3",
                                        children: "Payment option"
                                    }, void 0, false, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 390,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "flex items-start gap-3 rounded-xl border border-stone-200 px-4 py-3 cursor-pointer",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "checkoutMode",
                                                        checked: checkoutMode === 'pay_now',
                                                        onChange: ()=>setCheckoutMode('pay_now'),
                                                        className: "mt-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 393,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-[var(--color-charcoal)]",
                                                                children: "Pay Now"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 401,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-stone-500",
                                                                children: "Available for all customers and businesses."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 402,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 400,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 392,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: `flex items-start gap-3 rounded-xl border px-4 py-3 ${invoiceEligible ? 'border-stone-200 cursor-pointer' : 'border-stone-100 bg-stone-50 cursor-not-allowed'}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "checkoutMode",
                                                        checked: checkoutMode === 'invoice',
                                                        onChange: ()=>invoiceEligible && setCheckoutMode('invoice'),
                                                        disabled: !invoiceEligible,
                                                        className: "mt-1"
                                                    }, void 0, false, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 407,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-sm font-semibold text-[var(--color-charcoal)]",
                                                                children: "Pay on Invoice"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 416,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-stone-500",
                                                                children: "Only for approved businesses with active credit terms."
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 417,
                                                                columnNumber: 37
                                                            }, this),
                                                            invoiceEligible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-emerald-600 mt-1",
                                                                children: [
                                                                    "Eligible. Available credit: ",
                                                                    fmtAED(availableCredit)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 419,
                                                                columnNumber: 41
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-amber-700 mt-1",
                                                                children: invoiceReason ?? 'Not eligible for invoice checkout yet.'
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 421,
                                                                columnNumber: 41
                                                            }, this),
                                                            !canAttemptInvoice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                                                href: "/business/apply",
                                                                className: "inline-block mt-2 text-xs font-semibold text-[var(--color-imperial)] hover:underline",
                                                                children: "Apply for business account"
                                                            }, void 0, false, {
                                                                fileName: "[project]/app/checkout/page.tsx",
                                                                lineNumber: 424,
                                                                columnNumber: 41
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/app/checkout/page.tsx",
                                                        lineNumber: 415,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 406,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 391,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 389,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: placeOrder,
                                disabled: placingOrder,
                                className: "w-full py-3 bg-[var(--color-imperial)] text-white rounded-xl font-semibold text-sm hover:bg-[var(--color-imperial)]/90 transition disabled:opacity-60",
                                children: placingOrder ? 'Placing order...' : `Place Order (${fmtAED(summary.total)})`
                            }, void 0, false, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 433,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/checkout/page.tsx",
                        lineNumber: 343,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("aside", {
                        className: "bg-white rounded-2xl border border-stone-100 p-5 space-y-3 h-fit sticky top-20",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                className: "font-semibold text-sm text-[var(--color-charcoal)]",
                                children: "Order Summary"
                            }, void 0, false, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 444,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-1.5 text-sm",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-stone-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: [
                                                    "Subtotal (",
                                                    summary.itemCount,
                                                    " items)"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 447,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: fmtAED(summary.subtotal)
                                            }, void 0, false, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 448,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 446,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-stone-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Shipping"
                                            }, void 0, false, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 451,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: summary.shippingFee === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-[var(--color-zellige)]",
                                                    children: "Free"
                                                }, void 0, false, {
                                                    fileName: "[project]/app/checkout/page.tsx",
                                                    lineNumber: 452,
                                                    columnNumber: 64
                                                }, this) : fmtAED(summary.shippingFee)
                                            }, void 0, false, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 452,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 450,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between text-stone-500",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "VAT (5%)"
                                            }, void 0, false, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 455,
                                                columnNumber: 29
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: fmtAED(summary.vat)
                                            }, void 0, false, {
                                                fileName: "[project]/app/checkout/page.tsx",
                                                lineNumber: 456,
                                                columnNumber: 29
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 454,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 445,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "pt-2 border-t flex justify-between font-bold text-[var(--color-charcoal)]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Total"
                                    }, void 0, false, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 460,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: fmtAED(summary.total)
                                    }, void 0, false, {
                                        fileName: "[project]/app/checkout/page.tsx",
                                        lineNumber: 461,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 459,
                                columnNumber: 21
                            }, this),
                            checkoutMode === 'invoice' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-xs text-stone-500",
                                children: "This order will generate an invoice with your approved credit terms."
                            }, void 0, false, {
                                fileName: "[project]/app/checkout/page.tsx",
                                lineNumber: 464,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/app/checkout/page.tsx",
                        lineNumber: 443,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/app/checkout/page.tsx",
                lineNumber: 342,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/app/checkout/page.tsx",
        lineNumber: 333,
        columnNumber: 9
    }, this);
}
_s(CheckoutPage, "OGqY7nspc1/I1lIqqhtcejyr07s=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$contexts$2f$CartContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useCart"]
    ];
});
_c = CheckoutPage;
var _c;
__turbopack_context__.k.register(_c, "CheckoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/next/navigation.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = __turbopack_context__.r("[project]/node_modules/next/dist/client/components/navigation.js [app-client] (ecmascript)");
}),
]);

//# sourceMappingURL=_5bcddbdf._.js.map