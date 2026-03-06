import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { createPaymentIntent } from '@/services/paymentService';

/**
 * POST /api/stripe/create-intent
 * Creates a Stripe PaymentIntent for a given order.
 * Requires authenticated user who owns the order.
 */
export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: { user }, error: authError } = await supabase.auth.getUser(
            authHeader.replace('Bearer ', '')
        );

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { orderId } = body;

        if (!orderId) {
            return NextResponse.json({ error: 'orderId is required' }, { status: 400 });
        }

        // Verify user owns this order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('id, total, user_id, status')
            .eq('id', orderId)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        if (order.user_id !== user.id) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        if (order.status !== 'pending') {
            return NextResponse.json({ error: 'Order is not pending payment' }, { status: 400 });
        }

        const result = await createPaymentIntent({
            orderId: order.id,
            amountAed: order.total,
            customerEmail: user.email ?? '',
            metadata: { user_id: user.id },
        });

        if (!result.ok) {
            return NextResponse.json({ error: result.error }, { status: 500 });
        }

        return NextResponse.json({ clientSecret: result.clientSecret });
    } catch {
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
