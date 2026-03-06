/**
 * OUROZ Product Validation Schemas
 */

import { z } from 'zod';

export const listProductsQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(24),
    category: z.string().optional(),
    search: z.string().max(200).optional(),
    sort: z.enum(['popular', 'recent', 'price_low', 'price_high', 'name']).default('recent'),
    featured: z.coerce.boolean().optional(),
    minPrice: z.coerce.number().positive().optional(),
    maxPrice: z.coerce.number().positive().optional(),
});

export type ListProductsQuery = z.infer<typeof listProductsQuery>;
