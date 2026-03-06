import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { sendShippingUpdateEmail } from '@/services/emailService';

const VALID_TRANSITIONS: Record<string, string[]> = {
    pending: ['confirmed', 'cancelled'],
    confirmed: ['processing', 'cancelled'],
    processing: ['shipped', 'cancelled'],
    shipped: ['delivered'],
    delivered: [],
    cancelled: [],
};

/**
 * PATCH /api/orders/[id]/status
 * Updates order status with validation of allowed transitions.
 * Body: { status: string, trackingNumber?: string }
 */
export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    try {
        const { id } = await params;
        const body = await request.json();
        const newStatus: string = body.status;
        const trackingNumber: string | undefined = body.trackingNumber;

        if (!newStatus) {
            return NextResponse.json({ error: 'status is required' }, { status: 400 });
        }

        const supabase = createServerClient();

        // Fetch current order
        const { data: order, error: fetchError } = await supabase
            .from('orders')
            .select('id, status, order_number')
            .eq('id', id)
            .single();

        if (fetchError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // Validate transition
        const allowed = VALID_TRANSITIONS[order.status] ?? [];
        if (!allowed.includes(newStatus)) {
            return NextResponse.json(
                { error: `Cannot transition from "${order.status}" to "${newStatus}"` },
                { status: 422 },
            );
        }

        // Update order
        const updateFields: Record<string, unknown> = { status: newStatus };
        if (newStatus === 'shipped' && trackingNumber) {
            updateFields.notes = `Tracking: ${trackingNumber}`;
        }

        const { error: updateError } = await supabase
            .from('orders')
            .update(updateFields)
            .eq('id', id);

        if (updateError) {
            return NextResponse.json({ error: updateError.message }, { status: 500 });
        }

        // Send email for shipping updates
        if (newStatus === 'shipped' || newStatus === 'delivered') {
            await sendShippingUpdateEmail(id, trackingNumber);
        }

        return NextResponse.json({ ok: true, status: newStatus });
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Internal error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
