/**
 * OUROZ Email Service — powered by Resend.
 * Server-only: never import this in client components.
 *
 * Required env vars:
 *   RESEND_API_KEY        — Resend API key
 *   EMAIL_FROM            — Sender address (e.g. "OUROZ <orders@ouroz.com>")
 *   NEXT_PUBLIC_APP_URL   — Base URL for email links (e.g. "https://ouroz.com")
 */

import { Resend } from 'resend';
import { createClient as createSupabaseAdmin } from '@supabase/supabase-js';

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

const FROM = process.env.EMAIL_FROM ?? 'OUROZ <noreply@ouroz.com>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'https://ouroz.com';

// ── Order confirmation ────────────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(orderId: string): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping order confirmation email');
    return;
  }

  try {
    const db = getAdminClient();
    const { data: order } = await db
      .from('orders')
      .select('order_number, total, currency, created_at, user_id')
      .eq('id', orderId)
      .single();

    if (!order) {
      console.error('[email] Order not found for confirmation:', orderId);
      return;
    }

    // Get user email from auth
    const { data: { user } } = await db.auth.admin.getUserById(order.user_id);
    if (!user?.email) return;

    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject: `Your OUROZ order #${order.order_number} is confirmed`,
      html: orderConfirmationHtml({
        orderNumber: order.order_number,
        total: order.total,
        currency: order.currency ?? 'AED',
        orderUrl: `${APP_URL}/orders/${order.order_number}`,
      }),
    });
  } catch (err) {
    console.error('[email] sendOrderConfirmationEmail failed:', err);
  }
}

// ── Shipping update ───────────────────────────────────────────────────────────

export async function sendShippingUpdateEmail(
  orderId: string,
  trackingNumber?: string,
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set — skipping shipping update email');
    return;
  }

  try {
    const db = getAdminClient();
    const { data: order } = await db
      .from('orders')
      .select('order_number, status, user_id')
      .eq('id', orderId)
      .single();

    if (!order) return;

    const { data: { user } } = await db.auth.admin.getUserById(order.user_id);
    if (!user?.email) return;

    const isDelivered = order.status === 'delivered';
    const subject = isDelivered
      ? `Your OUROZ order #${order.order_number} has been delivered`
      : `Your OUROZ order #${order.order_number} has shipped`;

    await resend.emails.send({
      from: FROM,
      to: user.email,
      subject,
      html: shippingUpdateHtml({
        orderNumber: order.order_number,
        status: order.status,
        trackingNumber,
        orderUrl: `${APP_URL}/orders/${order.order_number}`,
      }),
    });
  } catch (err) {
    console.error('[email] sendShippingUpdateEmail failed:', err);
  }
}

// ── HTML templates (minimal, text-safe) ──────────────────────────────────────

function orderConfirmationHtml({
  orderNumber, total, currency, orderUrl,
}: { orderNumber: string; total: number; currency: string; orderUrl: string }) {
  return `
<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#F5E6D3;padding:40px;color:#2A2016">
<div style="max-width:520px;margin:0 auto;background:#FDF8F0;border-radius:16px;padding:40px">
  <h1 style="font-size:28px;font-weight:700;margin-bottom:4px">OUROZ</h1>
  <p style="color:#8B6B3A;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:32px">
    Moroccan Provisions from the Atlas
  </p>
  <h2 style="font-size:20px;font-weight:400;margin-bottom:16px">Order Confirmed</h2>
  <p style="margin-bottom:8px">Order <strong>#${orderNumber}</strong></p>
  <p style="margin-bottom:24px">Total: <strong>${total.toFixed(2)} ${currency}</strong></p>
  <a href="${orderUrl}" style="display:inline-block;background:#2A2016;color:#F5E6D3;text-decoration:none;padding:12px 24px;border-radius:24px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">
    View Order
  </a>
  <p style="margin-top:32px;font-size:12px;color:#8B6B3A">
    Thank you for choosing OUROZ. Your authentic Moroccan provisions are on their way.
  </p>
</div>
</body></html>
  `.trim();
}

function shippingUpdateHtml({
  orderNumber, status, trackingNumber, orderUrl,
}: { orderNumber: string; status: string; trackingNumber?: string; orderUrl: string }) {
  const headline = status === 'delivered' ? 'Your order has arrived!' : 'Your order has shipped!';
  return `
<!DOCTYPE html><html><body style="font-family:Georgia,serif;background:#F5E6D3;padding:40px;color:#2A2016">
<div style="max-width:520px;margin:0 auto;background:#FDF8F0;border-radius:16px;padding:40px">
  <h1 style="font-size:28px;font-weight:700;margin-bottom:4px">OUROZ</h1>
  <p style="color:#8B6B3A;font-size:11px;text-transform:uppercase;letter-spacing:0.2em;margin-bottom:32px">
    Moroccan Provisions from the Atlas
  </p>
  <h2 style="font-size:20px;font-weight:400;margin-bottom:16px">${headline}</h2>
  <p style="margin-bottom:8px">Order <strong>#${orderNumber}</strong></p>
  ${trackingNumber ? `<p style="margin-bottom:24px">Tracking: <strong>${trackingNumber}</strong></p>` : ''}
  <a href="${orderUrl}" style="display:inline-block;background:#2A2016;color:#F5E6D3;text-decoration:none;padding:12px 24px;border-radius:24px;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.15em">
    Track Order
  </a>
</div>
</body></html>
  `.trim();
}
