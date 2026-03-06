/**
 * OUROZ – subscriptionService
 * Logic for creating, running, and managing recurring subscription orders.
 *
 * "Run" flow:
 *   1. Fetch subscription + items + variants
 *   2. For each item: check stock, determine price (agreed_price || tier)
 *   3. Create order (+ invoice if payment_method = 'invoice' and credit available)
 *   4. Record subscription_run
 *   5. Advance subscription schedule
 */

import { supabase } from '@/lib/supabase';
import { calculateUnitPrice } from '@/lib/pricing';
import { createInvoice, postLedgerCharge, checkCreditEligibility } from '@/services/creditService';
import type { SubscriptionWithItems, SubscriptionRun, Subscription } from '@/types/business';

// =============================================================================
// Fetch
// =============================================================================

export async function fetchBusinessSubscriptions(
    businessId: string
): Promise<SubscriptionWithItems[]> {
    const { data, error } = await supabase
        .from('subscriptions')
        .select(`
            *,
            subscription_items (
                *,
                variant:variant_id (
                    id, sku, weight, retail_price, stock_quantity,
                    product:product_id ( id, name, image_urls ),
                    price_tiers ( min_quantity, price, label )
                )
            )
        `)
        .eq('business_id', businessId)
        .neq('status', 'cancelled')
        .order('created_at', { ascending: false });

    if (error || !data) return [];

    // Attach last/next run for each subscription
    const enriched = await Promise.all(
        (data as SubscriptionWithItems[]).map(async (sub) => {
            const { data: runs } = await supabase
                .from('subscription_runs')
                .select('*')
                .eq('subscription_id', sub.id)
                .order('scheduled_for', { ascending: false })
                .limit(2);

            const allRuns = (runs ?? []) as SubscriptionRun[];
            sub.last_run = allRuns.find(r => r.status !== 'scheduled') ?? null;
            sub.next_run = allRuns.find(r => r.status === 'scheduled') ?? null;
            return sub;
        })
    );

    return enriched;
}

// =============================================================================
// Create subscription
// =============================================================================

export interface CreateSubscriptionInput {
    businessId:     string;
    name:           string;
    cadence:        Subscription['cadence'];
    paymentMethod:  'card' | 'bank_transfer' | 'invoice';
    onPartial:      Subscription['on_partial'];
    firstRunAt:     Date;
    shippingName?:  string;
    shippingPhone?: string;
    shippingAddr?:  string;
    shippingEm?:    string;
    items: {
        variantId:    string;
        qty:          number;
        agreedPrice?: number;
    }[];
}

export async function createSubscription(
    input: CreateSubscriptionInput
): Promise<{ ok: boolean; subscription_id?: string; error?: string }> {
    const { data: sub, error: subError } = await supabase
        .from('subscriptions')
        .insert({
            business_id:      input.businessId,
            name:             input.name,
            status:           'active',
            cadence:          input.cadence,
            next_run_at:      input.firstRunAt.toISOString(),
            payment_method:   input.paymentMethod,
            on_partial:       input.onPartial,
            shipping_name:    input.shippingName ?? null,
            shipping_phone:   input.shippingPhone ?? null,
            shipping_address: input.shippingAddr ?? null,
            shipping_emirate: input.shippingEm ?? null,
        })
        .select('id')
        .single();

    if (subError || !sub) {
        return { ok: false, error: subError?.message ?? 'Failed to create subscription.' };
    }

    const subId = (sub as { id: string }).id;

    const { error: itemsError } = await supabase
        .from('subscription_items')
        .insert(
            input.items.map(item => ({
                subscription_id: subId,
                variant_id:      item.variantId,
                qty:             item.qty,
                agreed_price:    item.agreedPrice ?? null,
            }))
        );

    if (itemsError) {
        // Rollback subscription record on item failure
        await supabase.from('subscriptions').delete().eq('id', subId);
        return { ok: false, error: itemsError.message };
    }

    return { ok: true, subscription_id: subId };
}

// =============================================================================
// Update subscription status
// =============================================================================

export async function updateSubscriptionStatus(
    subscriptionId: string,
    status: 'active' | 'paused' | 'cancelled'
): Promise<{ ok: boolean; error?: string }> {
    const updates: Record<string, unknown> = { status };

    // When resuming: push next_run to tomorrow if it's in the past
    if (status === 'active') {
        const { data: sub } = await supabase
            .from('subscriptions')
            .select('next_run_at')
            .eq('id', subscriptionId)
            .single();

        const nextRun = new Date((sub as { next_run_at: string } | null)?.next_run_at ?? '');
        if (nextRun < new Date()) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            tomorrow.setHours(9, 0, 0, 0);
            updates.next_run_at = tomorrow.toISOString();
        }
    }

    const { error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('id', subscriptionId);

    if (error) return { ok: false, error: error.message };
    return { ok: true };
}

// =============================================================================
// Run a subscription (create order from its items)
// =============================================================================

export interface RunResult {
    ok:         boolean;
    order_id?:  string;
    run_id?:    string;
    status:     SubscriptionRun['status'];
    notes?:     string;
    errors?:    string[];
}

export async function runSubscription(
    subscriptionId: string,
    executedBy: string
): Promise<RunResult> {
    // 1. Fetch subscription with items
    const { data: sub } = await supabase
        .from('subscriptions')
        .select(`
            *,
            subscription_items (
                *,
                variant:variant_id (
                    id, sku, retail_price, stock_quantity,
                    price_tiers ( min_quantity, price, label )
                )
            )
        `)
        .eq('id', subscriptionId)
        .single();

    if (!sub) return { ok: false, status: 'failed', notes: 'Subscription not found.' };

    const subscription = sub as SubscriptionWithItems;

    if (subscription.status !== 'active') {
        return { ok: false, status: 'skipped', notes: `Subscription is ${subscription.status}.` };
    }

    // 2. Create run record (status = running)
    const { data: run } = await supabase
        .from('subscription_runs')
        .insert({
            subscription_id: subscriptionId,
            scheduled_for:   subscription.next_run_at,
            run_at:          new Date().toISOString(),
            status:          'running',
        })
        .select('id')
        .single();

    const runId = (run as { id: string } | null)?.id;

    const errors: string[] = [];
    const orderLineItems: {
        variant_id: string; qty: number;
        unit_price: number; line_total: number;
        name: string; sku: string; label: string | null; image: string | null;
    }[] = [];

    // 3. Determine price + check stock for each item
    for (const item of subscription.items) {
        const variant = item.variant as {
            id: string; sku: string; retail_price: number;
            stock_quantity: number;
            price_tiers: { min_quantity: number; price: number }[];
            product: { id: string; name: string; image_urls: string[] };
        };

        const available = variant.stock_quantity;
        const requestedQty = item.qty;

        if (available === 0) {
            if (subscription.on_partial === 'fail') {
                await updateRunStatus(runId, 'failed', `Out of stock: ${variant.sku}`);
                return { ok: false, status: 'failed', run_id: runId, notes: `Out of stock: ${variant.sku}`, errors };
            }
            if (subscription.on_partial === 'skip') {
                errors.push(`Skipped ${variant.sku}: out of stock`);
                continue;
            }
        }

        const fulfillQty = Math.min(requestedQty, available);
        if (fulfillQty < requestedQty) errors.push(`Partial: ${variant.sku} (requested ${requestedQty}, got ${fulfillQty})`);

        const unitPrice = item.agreed_price ?? calculateUnitPrice(
            variant.retail_price,
            'wholesale',
            variant.price_tiers,
            fulfillQty
        );
        const lineTotal = Math.round(unitPrice * fulfillQty * 100) / 100;

        orderLineItems.push({
            variant_id: variant.id,
            qty:        fulfillQty,
            unit_price: unitPrice,
            line_total: lineTotal,
            name:       variant.product.name,
            sku:        variant.sku,
            label:      null,
            image:      variant.product.image_urls?.[0] ?? null,
        });
    }

    if (orderLineItems.length === 0) {
        await updateRunStatus(runId, 'skipped', 'No eligible items.');
        return { ok: false, status: 'skipped', run_id: runId, notes: 'No eligible items.', errors };
    }

    // 4. Compute totals
    const subtotal  = orderLineItems.reduce((s, i) => s + i.line_total, 0);
    const vatAmount = Math.round(subtotal * 0.05 * 100) / 100;
    const total     = subtotal + vatAmount;

    // 5. Credit check if invoice
    if (subscription.payment_method === 'invoice') {
        const creditCheck = await checkCreditEligibility(subscription.business_id, total);
        if (!creditCheck.can_use_invoice) {
            await updateRunStatus(runId, 'failed', creditCheck.reason ?? 'Credit unavailable');
            return { ok: false, status: 'failed', run_id: runId, notes: creditCheck.reason ?? undefined, errors };
        }
    }

    // 6. Generate order number
    const { data: orderNumber } = await supabase.rpc('generate_order_number');
    if (!orderNumber) {
        await updateRunStatus(runId, 'failed', 'Could not generate order number.');
        return { ok: false, status: 'failed', run_id: runId, errors };
    }

    // 7. Create order
    const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
            user_id:          executedBy,
            business_id:      subscription.business_id,
            order_number:     orderNumber as string,
            subtotal,
            shipping_cost:    0,
            vat_amount:       vatAmount,
            total,
            currency:         'AED',
            is_wholesale:     true,
            payment_method:   subscription.payment_method,
            status:           'pending',
            shipping_name:    subscription.shipping_name,
            shipping_phone:   subscription.shipping_phone,
            shipping_address: subscription.shipping_address,
            shipping_emirate: subscription.shipping_emirate,
            notes:            `Auto-generated by subscription: ${subscription.name}`,
        })
        .select('id')
        .single();

    if (orderError || !order) {
        await updateRunStatus(runId, 'failed', orderError?.message);
        return { ok: false, status: 'failed', run_id: runId, errors };
    }

    const orderId = (order as { id: string }).id;

    // 8. Insert order items
    const { error: itemsError } = await supabase
        .from('order_items')
        .insert(
            orderLineItems.map(li => ({
                order_id:          orderId,
                variant_id:        li.variant_id,
                product_name:      li.name,
                variant_sku:       li.sku,
                variant_label:     li.label,
                product_image_url: li.image,
                price_at_purchase: li.unit_price,
                quantity:          li.qty,
                line_total:        li.line_total,
            }))
        );

    if (itemsError) {
        await updateRunStatus(runId, 'failed', itemsError.message);
        return { ok: false, status: 'failed', run_id: runId, errors };
    }

    // 9. Create invoice if needed
    if (subscription.payment_method === 'invoice') {
        // Fetch terms
        const { data: creditAcc } = await supabase
            .from('credit_accounts')
            .select('terms_days')
            .eq('business_id', subscription.business_id)
            .single();

        const termsdays = (creditAcc as { terms_days: number } | null)?.terms_days ?? 30;
        const invoice = await createInvoice({
            businessId: subscription.business_id,
            orderId,
            subtotal,
            taxAmount:  vatAmount,
            total,
            termsdays,
        });

        if (invoice) {
            await supabase.from('orders').update({ invoice_id: invoice.id }).eq('id', orderId);
            await postLedgerCharge(subscription.business_id, total, orderId, invoice.id, `Subscription run: ${subscription.name}`);
        }
    }

    // 10. Update run record
    const finalStatus: SubscriptionRun['status'] =
        errors.length > 0 ? 'partial' : 'created_order';

    await updateRunStatus(runId, finalStatus, errors.join('; ') || undefined, orderId);

    // 11. Advance schedule
    await supabase.rpc('advance_subscription_schedule', { p_subscription_id: subscriptionId });

    return {
        ok:       true,
        order_id: orderId,
        run_id:   runId,
        status:   finalStatus,
        notes:    errors.length > 0 ? errors.join('; ') : undefined,
        errors,
    };
}

async function updateRunStatus(
    runId: string | undefined,
    status: SubscriptionRun['status'],
    notes?: string | null,
    orderId?: string
) {
    if (!runId) return;
    const update: Record<string, unknown> = { status };
    if (notes) update.notes = notes;
    if (orderId) update.order_id = orderId;
    await supabase.from('subscription_runs').update(update).eq('id', runId);
}
