/**
 * OUROZ RFQ Validation Schemas
 */

import { z } from 'zod';

export const createRfqBody = z.object({
    title: z.string().min(5).max(255),
    description: z.string().min(10).max(5000),
    categoryId: z.string().uuid().optional(),
    quantity: z.number().int().positive(),
    unit: z.string().max(50).default('pieces'),
    targetPrice: z.number().positive().optional(),
    currency: z.string().length(3).default('USD'),
    incoterms: z.enum(['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP', 'FCA', 'CPT', 'CIP']).optional(),
    deliveryDeadline: z.string().optional(),
    specifications: z.string().max(5000).optional(),
    attachments: z.array(z.string().url()).max(5).optional(),
    targetSupplierIds: z.array(z.string().uuid()).max(10).optional(),
});

export const submitQuoteBody = z.object({
    unitPrice: z.number().positive(),
    currency: z.string().length(3).default('USD'),
    moq: z.number().int().positive(),
    leadTimeDays: z.number().int().positive(),
    validUntil: z.string(),
    notes: z.string().max(2000).optional(),
    incoterms: z.enum(['EXW', 'FOB', 'CIF', 'CFR', 'DDP', 'DAP', 'FCA', 'CPT', 'CIP']).optional(),
});

export const listRfqQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    status: z.enum(['OPEN', 'QUOTED', 'NEGOTIATING', 'CLOSED', 'EXPIRED']).optional(),
});

export type CreateRfqBody = z.infer<typeof createRfqBody>;
export type SubmitQuoteBody = z.infer<typeof submitQuoteBody>;
export type ListRfqQuery = z.infer<typeof listRfqQuery>;
