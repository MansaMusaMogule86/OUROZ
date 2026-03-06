/**
 * OUROZ Orders Validation Schemas
 */

import { z } from 'zod';

export const createOrderBody = z.object({
    items: z.array(z.object({
        variantId: z.string().uuid(),
        quantity: z.number().int().positive(),
    })).min(1),
    shippingName: z.string().min(1).max(255),
    shippingPhone: z.string().min(5).max(50),
    shippingAddress: z.string().min(5).max(500),
    shippingEmirate: z.string().max(100).optional(),
    notes: z.string().max(1000).optional(),
    isWholesale: z.boolean().default(false),
});

export const updateOrderStatusBody = z.object({
    status: z.enum(['confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
    trackingNumber: z.string().max(200).optional(),
    notes: z.string().max(1000).optional(),
});

export const listOrdersQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    status: z.string().optional(),
});

export type CreateOrderBody = z.infer<typeof createOrderBody>;
export type UpdateOrderStatusBody = z.infer<typeof updateOrderStatusBody>;
export type ListOrdersQuery = z.infer<typeof listOrdersQuery>;
