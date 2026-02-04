/**
 * OUROZ Supplier Profile Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';

// ============================================
// QUERY SCHEMAS
// ============================================

export const getProductsQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20),
    category: z.string().uuid().optional(),
    sort: z.enum(['popular', 'recent', 'price_low', 'price_high']).default('popular'),
});

export const getReviewsQuery = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(50).default(10),
    rating: z.coerce.number().int().min(1).max(5).optional(),
    sort: z.enum(['recent', 'highest', 'lowest', 'helpful']).default('recent'),
});

// ============================================
// BODY SCHEMAS
// ============================================

export const createReviewBody = z.object({
    rating: z.number().int().min(1).max(5),
    title: z.string().min(3).max(255).optional(),
    content: z.string().min(10).max(2000),
    communicationRating: z.number().int().min(1).max(5).optional(),
    qualityRating: z.number().int().min(1).max(5).optional(),
    deliveryRating: z.number().int().min(1).max(5).optional(),
    orderId: z.string().uuid().optional(),
});

export const reportSupplierBody = z.object({
    reason: z.enum(['SPAM', 'FRAUD', 'INAPPROPRIATE', 'FAKE_INFO', 'OTHER']),
    description: z.string().min(10).max(1000).optional(),
});

export const updateSupplierBody = z.object({
    companyName: z.string().min(2).max(255).optional(),
    companyNameAr: z.string().max(255).optional(),
    companyNameFr: z.string().max(255).optional(),
    companyType: z.enum(['MANUFACTURER', 'WHOLESALER', 'TRADING_COMPANY', 'COOPERATIVE', 'ARTISAN']).optional(),
    yearEstablished: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
    employeeCount: z.enum(['1-10', '11-50', '51-100', '101-500', '500+']).optional(),
    annualRevenue: z.enum(['< $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', '$10M+']).optional(),
    region: z.string().min(2).max(100).optional(),
    city: z.string().min(2).max(100).optional(),
    fullAddress: z.string().max(500).optional(),
    exportExperienceYears: z.number().int().min(0).max(100).optional(),
    hasExportLicense: z.boolean().optional(),
    freeZoneCertified: z.boolean().optional(),
    description: z.string().max(5000).optional(),
    videoUrl: z.string().url().max(500).optional().nullable(),
    logoUrl: z.string().url().max(500).optional(),
    bannerUrl: z.string().url().max(500).optional(),
    exportCountries: z.array(z.string().length(2)).max(50).optional(),
    categories: z.array(z.string().uuid()).max(10).optional(),
    languages: z.array(z.object({
        code: z.string().max(10),
        name: z.string().max(50),
        proficiency: z.enum(['BASIC', 'CONVERSATIONAL', 'FLUENT', 'NATIVE']).optional(),
    })).max(10).optional(),
});

export const updateContactBody = z.object({
    contactName: z.string().min(2).max(255),
    contactTitle: z.string().max(100).optional(),
    contactEmail: z.string().email().max(255).optional(),
    contactPhone: z.string().max(50).optional(),
});

export const addGalleryBody = z.object({
    mediaType: z.enum(['IMAGE', 'VIDEO']).default('IMAGE'),
    url: z.string().url().max(500),
    thumbnailUrl: z.string().url().max(500).optional(),
    title: z.string().max(255).optional(),
    description: z.string().max(500).optional(),
    sortOrder: z.number().int().min(0).optional(),
    isFeatured: z.boolean().optional(),
});

export const addCertificationBody = z.object({
    name: z.string().min(2).max(100),
    issuer: z.string().min(2).max(100),
    icon: z.string().max(50).optional(),
    certificateNumber: z.string().max(100).optional(),
    issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    expiryDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
    documentUrl: z.string().url().max(500).optional(),
});

export const reviewResponseBody = z.object({
    response: z.string().min(10).max(1000),
});

export const updateVerificationBody = z.object({
    level: z.enum(['BASIC', 'VERIFIED', 'GOLD', 'TRUSTED']),
});

export const updateStatusBody = z.object({
    status: z.enum(['PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED']),
    reason: z.string().max(500).optional(),
});

// ============================================
// TYPE EXPORTS
// ============================================

export type GetProductsQuery = z.infer<typeof getProductsQuery>;
export type GetReviewsQuery = z.infer<typeof getReviewsQuery>;
export type CreateReviewBody = z.infer<typeof createReviewBody>;
export type ReportSupplierBody = z.infer<typeof reportSupplierBody>;
export type UpdateSupplierBody = z.infer<typeof updateSupplierBody>;
export type UpdateContactBody = z.infer<typeof updateContactBody>;
export type AddGalleryBody = z.infer<typeof addGalleryBody>;
export type AddCertificationBody = z.infer<typeof addCertificationBody>;
export type ReviewResponseBody = z.infer<typeof reviewResponseBody>;
export type UpdateVerificationBody = z.infer<typeof updateVerificationBody>;
export type UpdateStatusBody = z.infer<typeof updateStatusBody>;
