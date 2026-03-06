import { NextRequest, NextResponse } from 'next/server';
import { constructWebhookEvent, handlePaymentSuccess, handlePaymentFailure } from '@/services/paymentService';
import { sendOrderConfirmationEmail } from '@/services/emailService';

/**
 * POST /api/stripe/webhook
 * Handles Stripe webhook events.
 * Must be configured in Stripe Dashboard to point to this URL.
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        const signature = request.headers.get('stripe-signature');

        if (!signature) {
            return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
        }

        const event = constructWebhookEvent(body, signature);

        switch (event.type) {
            case 'payment_intent.succeeded': {
                const paymentIntent = event.data.object;
                const result = await handlePaymentSuccess(paymentIntent.id);

                if (result.ok && paymentIntent.metadata?.order_id) {
                    // Send order confirmation email
                    await sendOrderConfirmationEmail(paymentIntent.metadata.order_id);
                }

                if (!result.ok) {
                    console.error('Payment success handler failed:', result.error);
                }
                break;
            }

            case 'payment_intent.payment_failed': {
                const paymentIntent = event.data.object;
                await handlePaymentFailure(paymentIntent.id);
                break;
            }

            default:
                // Unhandled event type — ignore
                break;
        }

        return NextResponse.json({ received: true });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Webhook error';
        console.error('Stripe webhook error:', message);
        return NextResponse.json({ error: message }, { status: 400 });
    }
}
