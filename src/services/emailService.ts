/**
 * OUROZ – Email Notification Service
 *
 * Transactional email for order lifecycle events.
 * Uses Resend (https://resend.com) — swap provider by changing the send function.
 *
 * Install: npm install resend
 * Set RESEND_API_KEY and EMAIL_FROM in .env.local
 */

import { createServerClient } from '@/lib/supabase';

// ---------------------------------------------------------------------------
// Provider abstraction
// ---------------------------------------------------------------------------

interface EmailPayload {
    to: string;
    subject: string;
    html: string;
}

async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean; error?: string }> {
    const apiKey = process.env.RESEND_API_KEY;
    const from = process.env.EMAIL_FROM ?? 'OUROZ <noreply@ouroz.com>';

    if (!apiKey) {
        console.warn('[emailService] RESEND_API_KEY not set — skipping email');
        return { ok: true }; // graceful no-op in dev
    }

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from, to: [payload.to], subject: payload.subject, html: payload.html }),
        });

        if (!res.ok) {
            const body = await res.text();
            return { ok: false, error: `Resend ${res.status}: ${body}` };
        }

        return { ok: true };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Email send failed';
        return { ok: false, error: message };
    }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatAed(amount: number | string): string {
    return `AED ${Number(amount).toFixed(2)}`;
}

function orderUrl(orderNumber: string): string {
    const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://ouroz.com';
    return `${base}/orders/${orderNumber}`;
}

// ---------------------------------------------------------------------------
// Order Confirmation
// ---------------------------------------------------------------------------

export async function sendOrderConfirmationEmail(orderId: string): Promise<{ ok: boolean; error?: string }> {
    const supabase = createServerClient();

    const { data: order } = await supabase
        .from('orders')
        .select('id, order_number, total, currency, shipping_name, shipping_emirate, user_id, created_at')
        .eq('id', orderId)
        .single();

    if (!order) return { ok: false, error: 'Order not found' };

    // Get user email
    const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id);
    if (!user?.email) return { ok: false, error: 'User email not found' };

    // Get order items
    const { data: items } = await supabase
        .from('order_items')
        .select('product_name, variant_label, quantity, price_at_purchase, line_total')
        .eq('order_id', orderId);

    const itemRows = (items ?? []).map(i =>
        `<tr>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0">${i.product_name}${i.variant_label ? ` (${i.variant_label})` : ''}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:center">${i.quantity}</td>
            <td style="padding:8px 12px;border-bottom:1px solid #f0f0f0;text-align:right">${formatAed(i.line_total)}</td>
        </tr>`
    ).join('');

    const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:linear-gradient(135deg,#d97706,#92400e);padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:24px">Order Confirmed</h1>
            <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:14px">Thank you for shopping with OUROZ</p>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:0">
            <p style="margin:0 0 16px">Hi ${order.shipping_name ?? 'there'},</p>
            <p style="margin:0 0 24px">Your order <strong>#${order.order_number}</strong> has been confirmed and is being prepared.</p>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
                <thead>
                    <tr style="background:#fef3c7">
                        <th style="padding:8px 12px;text-align:left">Item</th>
                        <th style="padding:8px 12px;text-align:center">Qty</th>
                        <th style="padding:8px 12px;text-align:right">Total</th>
                    </tr>
                </thead>
                <tbody>${itemRows}</tbody>
                <tfoot>
                    <tr>
                        <td colspan="2" style="padding:12px;text-align:right;font-weight:600">Total</td>
                        <td style="padding:12px;text-align:right;font-weight:600;color:#d97706">${formatAed(order.total)}</td>
                    </tr>
                </tfoot>
            </table>
            <div style="margin:24px 0;padding:16px;background:#f9fafb;border-radius:8px;font-size:14px">
                <strong>Shipping to:</strong><br/>
                ${order.shipping_name ?? ''}<br/>
                ${order.shipping_emirate ?? 'UAE'}
            </div>
            <a href="${orderUrl(order.order_number)}" style="display:inline-block;background:#d97706;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">Track Your Order</a>
        </div>
        <div style="padding:16px;text-align:center;font-size:12px;color:#9ca3af">
            <p style="margin:0">OUROZ — Authentic Moroccan Artisan Marketplace</p>
        </div>
    </div>`;

    return sendEmail({
        to: user.email,
        subject: `Order Confirmed — #${order.order_number}`,
        html,
    });
}

// ---------------------------------------------------------------------------
// Shipping Update
// ---------------------------------------------------------------------------

export async function sendShippingUpdateEmail(
    orderId: string,
    trackingNumber?: string,
): Promise<{ ok: boolean; error?: string }> {
    const supabase = createServerClient();

    const { data: order } = await supabase
        .from('orders')
        .select('id, order_number, shipping_name, user_id, status')
        .eq('id', orderId)
        .single();

    if (!order) return { ok: false, error: 'Order not found' };

    const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id);
    if (!user?.email) return { ok: false, error: 'User email not found' };

    const statusLabel = order.status === 'shipped' ? 'shipped' : order.status === 'delivered' ? 'delivered' : 'updated';

    const trackingBlock = trackingNumber
        ? `<p style="margin:16px 0;padding:12px;background:#f0fdf4;border-radius:8px;font-size:14px"><strong>Tracking number:</strong> ${trackingNumber}</p>`
        : '';

    const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:linear-gradient(135deg,#059669,#047857);padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:24px">Your order has been ${statusLabel}!</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:0">
            <p style="margin:0 0 16px">Hi ${order.shipping_name ?? 'there'},</p>
            <p style="margin:0 0 8px">Order <strong>#${order.order_number}</strong> has been ${statusLabel}.</p>
            ${trackingBlock}
            <a href="${orderUrl(order.order_number)}" style="display:inline-block;background:#059669;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-top:16px">View Order Details</a>
        </div>
        <div style="padding:16px;text-align:center;font-size:12px;color:#9ca3af">
            <p style="margin:0">OUROZ — Authentic Moroccan Artisan Marketplace</p>
        </div>
    </div>`;

    return sendEmail({
        to: user.email,
        subject: `Order #${order.order_number} — ${statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1)}`,
        html,
    });
}

// ---------------------------------------------------------------------------
// Invoice Email (for B2B credit purchases)
// ---------------------------------------------------------------------------

export async function sendInvoiceEmail(
    orderId: string,
    invoiceNumber: string,
    dueDate: string,
): Promise<{ ok: boolean; error?: string }> {
    const supabase = createServerClient();

    const { data: order } = await supabase
        .from('orders')
        .select('id, order_number, total, shipping_name, user_id')
        .eq('id', orderId)
        .single();

    if (!order) return { ok: false, error: 'Order not found' };

    const { data: { user } } = await supabase.auth.admin.getUserById(order.user_id);
    if (!user?.email) return { ok: false, error: 'User email not found' };

    const html = `
    <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:linear-gradient(135deg,#7c3aed,#5b21b6);padding:24px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:white;margin:0;font-size:24px">Invoice ${invoiceNumber}</h1>
        </div>
        <div style="background:#fff;padding:24px;border:1px solid #e5e7eb;border-top:0">
            <p style="margin:0 0 16px">Hi ${order.shipping_name ?? 'there'},</p>
            <p style="margin:0 0 8px">An invoice has been generated for order <strong>#${order.order_number}</strong>.</p>
            <table style="width:100%;font-size:14px;margin:16px 0">
                <tr><td style="padding:6px 0;color:#6b7280">Invoice Number</td><td style="padding:6px 0;text-align:right;font-weight:600">${invoiceNumber}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Amount Due</td><td style="padding:6px 0;text-align:right;font-weight:600;color:#7c3aed">${formatAed(order.total)}</td></tr>
                <tr><td style="padding:6px 0;color:#6b7280">Due Date</td><td style="padding:6px 0;text-align:right;font-weight:600">${dueDate}</td></tr>
            </table>
            <a href="${orderUrl(order.order_number)}" style="display:inline-block;background:#7c3aed;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;margin-top:8px">View Invoice</a>
        </div>
        <div style="padding:16px;text-align:center;font-size:12px;color:#9ca3af">
            <p style="margin:0">OUROZ — Authentic Moroccan Artisan Marketplace</p>
        </div>
    </div>`;

    return sendEmail({
        to: user.email,
        subject: `Invoice ${invoiceNumber} — ${formatAed(order.total)} due ${dueDate}`,
        html,
    });
}
