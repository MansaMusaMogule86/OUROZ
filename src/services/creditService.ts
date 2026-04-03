/**
 * OUROZ - creditService
 * All credit-related business logic that calls Supabase.
 * Uses the browser client for client contexts and service-role for server contexts.
 * Extended with getCreditStatus, canUseInvoice, createInvoiceForOrder, activateCreditAccount
 */

import { supabase } from '@/lib/supabase';
import type {
    CreditAccount,
    CreditCheckResult,
    CreditLedgerEntry,
    Invoice,
    LedgerEntryType,
    Payment,
    PaymentMethod,
    CheckoutResult,
    CheckoutPayload,
} from '@/types/business';

// =============================================================================
// Credit eligibility check
// =============================================================================

/**
 * Check whether a business can checkout using invoice (credit terms).
 * Returns a structured result so the UI can show the correct message.
 */
export async function checkCreditEligibility(
    businessId: string,
    orderTotal: number
): Promise<CreditCheckResult> {
    // Fetch credit account
    const { data: account } = await supabase
        .from('credit_accounts')
        .select('*')
        .eq('business_id', businessId)
        .eq('status', 'active')
        .single();

    if (!account) {
        return {
            can_use_invoice:  false,
            reason:           'No active credit account. Contact your account manager.',
            available_credit: 0,
            outstanding:      0,
            credit_limit:     0,
        };
    }

    // Get outstanding balance via RPC
    const { data: outstandingRaw } = await supabase
        .rpc('get_outstanding_balance', { p_business_id: businessId });
    const outstanding = Number(outstandingRaw ?? 0);

    const { data: availableRaw } = await supabase
        .rpc('get_available_credit', { p_business_id: businessId });
    const available = Number(availableRaw ?? 0);

    // Check for overdue invoices
    const { data: hasOverdue } = await supabase
        .rpc('has_overdue_invoices', { p_business_id: businessId });

    if (hasOverdue) {
        return {
            can_use_invoice:  false,
            reason:           'Credit is on hold due to overdue invoices. Please settle outstanding amounts first.',
            available_credit: available,
            outstanding,
            credit_limit:     (account as CreditAccount).credit_limit,
        };
    }

    if (orderTotal > available) {
        return {
            can_use_invoice:  false,
            reason:           `Insufficient credit. Available: AED ${available.toFixed(2)}, Order total: AED ${orderTotal.toFixed(2)}.`,
            available_credit: available,
            outstanding,
            credit_limit:     (account as CreditAccount).credit_limit,
        };
    }

    return {
        can_use_invoice:  true,
        reason:           null,
        available_credit: available,
        outstanding,
        credit_limit:     (account as CreditAccount).credit_limit,
    };
}

// =============================================================================
// Create invoice
// =============================================================================

export interface CreateInvoiceInput {
    businessId:   string;
    orderId:      string;
    subtotal:     number;
    taxAmount:    number;
    total:        number;
    termsdays:    number;
}

export async function createInvoice(input: CreateInvoiceInput): Promise<Invoice | null> {
    // Generate invoice number
    const { data: invNumber } = await supabase.rpc('generate_invoice_number');
    if (!invNumber) return null;

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + input.termsdays);
    const dueDateStr = dueDate.toISOString().split('T')[0];

    const { data, error } = await supabase
        .from('invoices')
        .insert({
            business_id:    input.businessId,
            order_id:       input.orderId,
            invoice_number: invNumber as string,
            subtotal:       input.subtotal,
            tax_amount:     input.taxAmount,
            total:          input.total,
            amount_paid:    0,
            due_date:       dueDateStr,
            status:         'issued',
        })
        .select()
        .single();

    if (error || !data) return null;
    return data as Invoice;
}

// =============================================================================
// Post ledger entry
// =============================================================================

export async function postLedgerCharge(
    businessId: string,
    amount: number,
    orderId: string,
    invoiceId: string,
    note?: string
): Promise<number | null> {
    const { data, error } = await supabase.rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type:        'charge' as LedgerEntryType,
        p_amount:      amount,
        p_order_id:    orderId,
        p_invoice_id:  invoiceId,
        p_note:        note ?? `Invoice ${invoiceId}`,
    });
    if (error) return null;
    return Number(data);
}

export async function postLedgerPayment(
    businessId: string,
    amount: number,
    invoiceId: string,
    note?: string,
    createdBy?: string
): Promise<number | null> {
    const { data, error } = await supabase.rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type:        'payment' as LedgerEntryType,
        p_amount:      -Math.abs(amount), // payments are negative (reduce balance)
        p_invoice_id:  invoiceId,
        p_note:        note ?? 'Payment received',
        p_created_by:  createdBy ?? null,
    });
    if (error) return null;
    return Number(data);
}

export async function postManualAdjustment(
    businessId: string,
    amount: number,
    note: string,
    createdBy: string
): Promise<number | null> {
    const { data, error } = await supabase.rpc('post_ledger_entry', {
        p_business_id: businessId,
        p_type:        'adjustment' as LedgerEntryType,
        p_amount:      amount,
        p_note:        note,
        p_created_by:  createdBy,
    });
    if (error) return null;
    return Number(data);
}

// =============================================================================
// Record a payment
// =============================================================================

export async function recordPayment(input: {
    businessId:  string;
    invoiceId:   string;
    amount:      number;
    method:      PaymentMethod;
    reference?:  string;
    notes?:      string;
    receivedAt?: string;
    recordedBy:  string;
}): Promise<{ ok: boolean; error?: string }> {
    const { error: payError } = await supabase
        .from('payments')
        .insert({
            business_id:  input.businessId,
            invoice_id:   input.invoiceId,
            amount:       input.amount,
            method:       input.method,
            reference:    input.reference ?? null,
            notes:        input.notes ?? null,
            received_at:  input.receivedAt ?? new Date().toISOString(),
            recorded_by:  input.recordedBy,
        });

    if (payError) return { ok: false, error: payError.message };

    // Post negative ledger entry (payment reduces outstanding)
    await postLedgerPayment(
        input.businessId,
        input.amount,
        input.invoiceId,
        `Payment via ${input.method}${input.reference ? ` (ref: ${input.reference})` : ''}`,
        input.recordedBy
    );

    return { ok: true };
}

// =============================================================================
// Full B2B checkout flow
// =============================================================================

export async function processB2BCheckout(
    payload: CheckoutPayload,
    cartItems: Array<{
        variant_id: string;
        qty:        number;
        name:       string;
        sku:        string;
        label:      string | null;
        image:      string | null;
        unit_price: number;
        line_total: number;
    }>,
    subtotal: number,
    vatAmount: number,
    total: number,
    userId: string
): Promise<CheckoutResult> {
    try {
        // 1. Credit check if paying by invoice
        if (payload.payment_method === 'invoice') {
            const creditCheck = await checkCreditEligibility(payload.business_id, total);
            if (!creditCheck.can_use_invoice) {
                return { ok: false, error: creditCheck.reason ?? 'Credit checkout unavailable.' };
            }
        }

        // 2. Generate order number
        const { data: orderNumber } = await supabase.rpc('generate_order_number');
        if (!orderNumber) return { ok: false, error: 'Failed to generate order number.' };

        // 3. Create order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id:          userId,
                business_id:      payload.business_id,
                order_number:     orderNumber as string,
                subtotal,
                shipping_cost:    0,
                vat_amount:       vatAmount,
                total,
                currency:         'AED',
                is_wholesale:     true,
                payment_method:   payload.payment_method,
                status:           'pending',
                shipping_name:    payload.shipping_name,
                shipping_phone:   payload.shipping_phone,
                shipping_address: payload.shipping_address,
                shipping_emirate: payload.shipping_emirate,
                notes:            payload.notes ?? null,
            })
            .select('id')
            .single();

        if (orderError || !order) {
            return { ok: false, error: orderError?.message ?? 'Failed to create order.' };
        }

        // 4. Create order items
        const orderItemsPayload = cartItems.map(item => ({
            order_id:          order.id,
            variant_id:        item.variant_id,
            product_name:      item.name,
            variant_sku:       item.sku,
            variant_label:     item.label,
            product_image_url: item.image,
            price_at_purchase: item.unit_price,
            quantity:          item.qty,
            line_total:        item.line_total,
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItemsPayload);

        if (itemsError) {
            return { ok: false, error: itemsError.message };
        }

        // 5. If invoice checkout: create invoice + post ledger charge
        let invoiceId: string | undefined;

        if (payload.payment_method === 'invoice') {
            // Get terms from credit account
            const { data: creditAccount } = await supabase
                .from('credit_accounts')
                .select('terms_days')
                .eq('business_id', payload.business_id)
                .single();

            const termsdays = (creditAccount as { terms_days: number } | null)?.terms_days ?? 30;

            const invoice = await createInvoice({
                businessId: payload.business_id,
                orderId:    order.id,
                subtotal,
                taxAmount:  vatAmount,
                total,
                termsdays,
            });

            if (!invoice) {
                return { ok: false, error: 'Failed to create invoice.' };
            }
            invoiceId = invoice.id;

            // Link invoice to order
            await supabase
                .from('orders')
                .update({ invoice_id: invoiceId })
                .eq('id', order.id);

            // Post ledger charge
            await postLedgerCharge(
                payload.business_id,
                total,
                order.id,
                invoiceId,
                `Order ${orderNumber as string}`
            );
        }

        return {
            ok:           true,
            order_id:     order.id,
            invoice_id:   invoiceId,
            order_number: orderNumber as string,
        };
    } catch (err) {
        return {
            ok:    false,
            error: err instanceof Error ? err.message : 'Checkout failed.',
        };
    }
}

// =============================================================================
// Admin: approve / reject business
// =============================================================================

export async function approveBusiness(
    businessId: string,
    adminUserId: string,
    creditLimit = 0,
    termsdays = 30
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
        .from('businesses')
        .update({
            status:      'approved',
            approved_at: new Date().toISOString(),
            approved_by: adminUserId,
            rejection_reason: null,
        })
        .eq('id', businessId);

    if (error) return { ok: false, error: error.message };

    // Create credit account with conservative defaults
    await supabase
        .from('credit_accounts')
        .upsert(
            { business_id: businessId, credit_limit: creditLimit, terms_days: termsdays, status: 'active' },
            { onConflict: 'business_id' }
        );

    return { ok: true };
}

export async function rejectBusiness(
    businessId: string,
    reason: string
): Promise<{ ok: boolean; error?: string }> {
    const { error } = await supabase
        .from('businesses')
        .update({ status: 'rejected', rejection_reason: reason })
        .eq('id', businessId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

// =============================================================================
// Fetch ledger history for a business
// =============================================================================

export async function fetchLedgerHistory(
    businessId: string,
    limit = 50
): Promise<CreditLedgerEntry[]> {
    const { data, error } = await supabase
        .from('credit_ledger')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
        .limit(limit);

    if (error || !data) return [];
    return data as CreditLedgerEntry[];
}

// =============================================================================
// Mark invoices overdue (admin action)
// =============================================================================

export async function markOverdueInvoices(): Promise<number> {
    const { data } = await supabase.rpc('mark_overdue_invoices');
    return Number(data ?? 0);
}

// =============================================================================
// getCreditStatus
// =============================================================================

export interface CreditStatusResult {
    status:           'active' | 'suspended' | 'inactive' | 'none';
    credit_limit:     number;
    outstanding:      number;
    available:        number;
    has_overdue:      boolean;
    terms_days:       number;
    risk_tier:        'starter' | 'trusted' | 'pro';
    suspended_reason: string | null;
    last_reviewed_at: string | null;
}

/**
 * Returns a comprehensive credit status snapshot for a business.
 * The three Supabase calls (account row, outstanding RPC, overdue RPC) are
 * issued in parallel for minimal latency. Returns a 'none' status object when
 * no credit account exists. Never throws.
 */
export async function getCreditStatus(
    businessId: string
): Promise<CreditStatusResult> {
    const [accountResult, outstandingResult, overdueResult] = await Promise.all([
        supabase
            .from('credit_accounts')
            .select('*')
            .eq('business_id', businessId)
            .maybeSingle(),
        supabase.rpc('get_outstanding_balance', { p_business_id: businessId }),
        supabase.rpc('has_overdue_invoices',    { p_business_id: businessId }),
    ]);

    const account = accountResult.data as CreditAccount | null;

    if (!account) {
        return {
            status:           'none',
            credit_limit:     0,
            outstanding:      0,
            available:        0,
            has_overdue:      false,
            terms_days:       0,
            risk_tier:        'starter',
            suspended_reason: null,
            last_reviewed_at: null,
        };
    }

    const outstanding = Number(outstandingResult.data ?? 0);
    const hasOverdue  = Boolean(overdueResult.data   ?? false);

    // Map DB enum ('active' | 'suspended') to the extended status union.
    const status: CreditStatusResult['status'] =
        account.status === 'active'      ? 'active'
        : account.status === 'suspended' ? 'suspended'
        : 'inactive';

    const available = Math.max(0, account.credit_limit - outstanding);

    // risk_tier is not a column in the base CreditAccount schema; fall back to
    // 'starter'. Callers that need the precise tier should use riskService.
    const riskTierRaw = (account as CreditAccount & { risk_tier?: string }).risk_tier;
    const riskTier: CreditStatusResult['risk_tier'] =
        riskTierRaw === 'trusted' ? 'trusted'
        : riskTierRaw === 'pro'   ? 'pro'
        : 'starter';

    return {
        status,
        credit_limit:     account.credit_limit,
        outstanding,
        available,
        has_overdue:      hasOverdue,
        terms_days:       account.terms_days,
        risk_tier:        riskTier,
        suspended_reason: account.suspended_reason,
        last_reviewed_at: account.updated_at ?? null,
    };
}

// =============================================================================
// canUseInvoice
// =============================================================================

/**
 * Lightweight guard used before presenting the "Pay on Invoice" option.
 * Returns whether invoice checkout is allowed, the blocking reason (if any),
 * and the available credit balance.
 */
export async function canUseInvoice(
    businessId: string,
    orderTotal: number
): Promise<{ allowed: boolean; reason: string | null; available: number }> {
    const creditStatus = await getCreditStatus(businessId);

    if (creditStatus.status === 'none' || creditStatus.status === 'inactive') {
        return {
            allowed:   false,
            reason:    'No active credit account. Contact your account manager.',
            available: 0,
        };
    }

    if (creditStatus.status === 'suspended') {
        return {
            allowed:   false,
            reason:    creditStatus.suspended_reason ?? 'Credit account is suspended.',
            available: creditStatus.available,
        };
    }

    if (creditStatus.has_overdue) {
        return {
            allowed:   false,
            reason:    'Credit is on hold due to overdue invoices. Please settle outstanding amounts first.',
            available: creditStatus.available,
        };
    }

    if (orderTotal > creditStatus.available) {
        return {
            allowed:   false,
            reason:    `Insufficient credit. Available: AED ${creditStatus.available.toFixed(2)}, Order total: AED ${orderTotal.toFixed(2)}.`,
            available: creditStatus.available,
        };
    }

    return { allowed: true, reason: null, available: creditStatus.available };
}

// =============================================================================
// createInvoiceForOrder
// =============================================================================

/**
 * Fetches the order amounts from the `orders` table, retrieves the credit
 * terms for the business, creates an invoice, links it back to the order, and
 * posts a ledger charge - all in a single call. Returns the created Invoice
 * row, or null on any failure. Never throws.
 */
export async function createInvoiceForOrder(
    orderId:    string,
    businessId: string
): Promise<Invoice | null> {
    // Fetch order financials and credit terms in parallel.
    const [orderResult, accountResult] = await Promise.all([
        supabase
            .from('orders')
            .select('subtotal, vat_amount, total')
            .eq('id', orderId)
            .single(),
        supabase
            .from('credit_accounts')
            .select('terms_days')
            .eq('business_id', businessId)
            .single(),
    ]);

    if (orderResult.error || !orderResult.data) return null;

    const order = orderResult.data as {
        subtotal:   number;
        vat_amount: number;
        total:      number;
    };

    const termsdays =
        (accountResult.data as { terms_days: number } | null)?.terms_days ?? 30;

    // Create the invoice record.
    const invoice = await createInvoice({
        businessId,
        orderId,
        subtotal:  Number(order.subtotal),
        taxAmount: Number(order.vat_amount),
        total:     Number(order.total),
        termsdays,
    });

    if (!invoice) return null;

    // Link invoice to order (best-effort; non-fatal if it fails).
    await supabase
        .from('orders')
        .update({ invoice_id: invoice.id })
        .eq('id', orderId);

    // Post the corresponding ledger charge.
    await postLedgerCharge(
        businessId,
        Number(order.total),
        orderId,
        invoice.id,
        `Invoice ${invoice.invoice_number}`
    );

    return invoice;
}

// =============================================================================
// activateCreditAccount
// =============================================================================

/**
 * Creates or replaces a credit account for a business with status = 'active'
 * and the supplied terms, then records the action in the admin audit log.
 * Returns { ok: true } on success, { ok: false, error } otherwise.
 */
export async function activateCreditAccount(
    businessId:  string,
    creditLimit: number,
    termsDays:   number,
    riskTier:    'starter',
    adminUserId: string
): Promise<{ ok: boolean; error?: string }> {
    const now = new Date().toISOString();

    const { error: upsertError } = await supabase
        .from('credit_accounts')
        .upsert(
            {
                business_id:      businessId,
                credit_limit:     creditLimit,
                terms_days:       termsDays,
                status:           'active',
                suspended_at:     null,
                suspended_reason: null,
                updated_at:       now,
            },
            { onConflict: 'business_id' }
        );

    if (upsertError) return { ok: false, error: upsertError.message };

    // Record the activation in the admin audit log.
    await supabase.rpc('log_admin_action', {
        p_actor_user_id: adminUserId,
        p_action:        'activate_credit',
        p_entity_type:   'credit_account',
        p_entity_id:     businessId,
        p_payload:       {
            credit_limit: creditLimit,
            terms_days:   termsDays,
            risk_tier:    riskTier,
            activated_at: now,
        },
    });

    return { ok: true };
}
