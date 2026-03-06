/**
 * OUROZ – Payment Service (Stripe Integration)
 *
 * Handles payment intent creation, webhook processing, and order status updates.
 * Install: npm install stripe
 * Set STRIPE_SECRET_KEY and STRIPE_WEBHOOK_SECRET in .env.local
 */

import Stripe from 'stripe';
import { createServerClient } from '@/lib/supabase';

let _stripe: Stripe | null = null;

function getStripe(): Stripe {
    if (!_stripe) {
        _stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? '', {
            apiVersion: '2026-02-25.clover',
        });
    }
    return _stripe;
}

export interface CreatePaymentIntentInput {
    orderId: string;
    amountAed: number;
    customerEmail: string;
    metadata?: Record<string, string>;
}

export interface PaymentResult {
    ok: boolean;
    clientSecret?: string;
    paymentIntentId?: string;
    error?: string;
}

/**
 * Create a Stripe PaymentIntent for an order.
 * Amount is in AED — Stripe expects fils (smallest currency unit).
 */
export async function createPaymentIntent(input: CreatePaymentIntentInput): Promise<PaymentResult> {
    try {
        const amountInFils = Math.round(input.amountAed * 100);

        const paymentIntent = await getStripe().paymentIntents.create({
            amount: amountInFils,
            currency: 'aed',
            receipt_email: input.customerEmail,
            metadata: {
                order_id: input.orderId,
                ...input.metadata,
            },
        });

        // Store payment intent reference on order
        const supabase = createServerClient();
        await supabase
            .from('orders')
            .update({ stripe_payment_intent_id: paymentIntent.id })
            .eq('id', input.orderId);

        return {
            ok: true,
            clientSecret: paymentIntent.client_secret ?? undefined,
            paymentIntentId: paymentIntent.id,
        };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Payment creation failed';
        return { ok: false, error: message };
    }
}

/**
 * Handle Stripe webhook event for payment confirmation.
 * Called from /api/stripe/webhook route.
 */
export async function handlePaymentSuccess(paymentIntentId: string): Promise<{ ok: boolean; error?: string }> {
    try {
        const supabase = createServerClient();

        // Find order by payment intent
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('id, status')
            .eq('stripe_payment_intent_id', paymentIntentId)
            .single();

        if (fetchError || !order) {
            return { ok: false, error: `Order not found for payment ${paymentIntentId}` };
        }

        // Update order status to confirmed
        const { error: updateError } = await supabase
            .from('orders')
            .update({
                status: 'confirmed',
                paid_at: new Date().toISOString(),
            })
            .eq('id', order.id);

        if (updateError) {
            return { ok: false, error: updateError.message };
        }

        return { ok: true };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Webhook handling failed';
        return { ok: false, error: message };
    }
}

/**
 * Handle payment failure — mark order back to pending or cancelled.
 */
export async function handlePaymentFailure(paymentIntentId: string): Promise<{ ok: boolean; error?: string }> {
    try {
        const supabase = createServerClient();

        const { error: updateError } = await supabase
            .from('orders')
            .update({ status: 'pending' })
            .eq('stripe_payment_intent_id', paymentIntentId);

        if (updateError) {
            return { ok: false, error: updateError.message };
        }

        return { ok: true };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failure handling failed';
        return { ok: false, error: message };
    }
}

/**
 * Verify Stripe webhook signature.
 */
export function constructWebhookEvent(body: string, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET ?? '';
    return getStripe().webhooks.constructEvent(body, signature, webhookSecret);
}
