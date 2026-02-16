/**
 * OUROZ Supplier Profile API Routes
 * REST API endpoints for supplier profile operations
 */

import { Router } from 'express';
import { authenticate, authorize, optionalAuth } from '../../middleware/auth';
import * as controller from './controller';
import { validateRequest } from '../../middleware/validation';
import * as schemas from './schemas';
import productRoutes from './product_routes';

const router = Router();

// ============================================
// PUBLIC ENDPOINTS (No Auth Required)
// ============================================

/**
 * GET /api/suppliers/:id
 * Get public supplier profile
 * Auth: No
 * Response: SupplierProfileResponse
 */
router.get(
    '/:id',
    optionalAuth, // Optional: to track if user favorited
    controller.getSupplierProfile
);

router.use('/:id/products', productRoutes); // Nested product routes

/**
 * GET /api/suppliers/:id/products
 * Get supplier's products (paginated)
 * Auth: No
 * Query: ?page=1&limit=20&category=uuid&sort=popular
 * Response: PaginatedProductsResponse
 */
router.get(
    '/:id/products',
    validateRequest(schemas.getProductsQuery, 'query'),
    controller.getSupplierProducts
);

/**
 * GET /api/suppliers/:id/reviews
 * Get supplier reviews (paginated)
 * Auth: No
 * Query: ?page=1&limit=10&rating=5&sort=recent
 * Response: PaginatedReviewsResponse
 */
router.get(
    '/:id/reviews',
    validateRequest(schemas.getReviewsQuery, 'query'),
    controller.getSupplierReviews
);

/**
 * GET /api/suppliers/:id/gallery
 * Get supplier gallery media
 * Auth: No
 * Response: GalleryResponse
 */
router.get('/:id/gallery', controller.getSupplierGallery);

// ============================================
// BUYER ENDPOINTS (Auth Required)
// ============================================

/**
 * POST /api/suppliers/:id/favorite
 * Add supplier to favorites
 * Auth: Yes (BUYER)
 * Response: { success: true }
 */
router.post(
    '/:id/favorite',
    authenticate,
    authorize(['BUYER']),
    controller.addToFavorites
);

/**
 * DELETE /api/suppliers/:id/favorite
 * Remove supplier from favorites
 * Auth: Yes (BUYER)
 * Response: { success: true }
 */
router.delete(
    '/:id/favorite',
    authenticate,
    authorize(['BUYER']),
    controller.removeFromFavorites
);

/**
 * POST /api/suppliers/:id/reviews
 * Create a review for supplier
 * Auth: Yes (BUYER)
 * Body: CreateReviewRequest
 * Response: ReviewResponse
 */
router.post(
    '/:id/reviews',
    authenticate,
    authorize(['BUYER']),
    validateRequest(schemas.createReviewBody),
    controller.createReview
);

/**
 * POST /api/suppliers/:id/report
 * Report/flag a supplier
 * Auth: Yes (BUYER, SUPPLIER)
 * Body: ReportRequest
 * Response: { success: true, reportId: uuid }
 */
router.post(
    '/:id/report',
    authenticate,
    authorize(['BUYER', 'SUPPLIER']),
    validateRequest(schemas.reportSupplierBody),
    controller.reportSupplier
);

// ============================================
// SUPPLIER ENDPOINTS (Owner Only)
// ============================================

/**
 * PUT /api/suppliers/:id
 * Update supplier profile (own profile only)
 * Auth: Yes (SUPPLIER - owner)
 * Body: UpdateSupplierRequest
 * Response: SupplierProfileResponse
 */
router.put(
    '/:id',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.updateSupplierBody),
    controller.updateSupplierProfile
);

/**
 * PUT /api/suppliers/:id/contact
 * Update contact information
 * Auth: Yes (SUPPLIER - owner)
 * Body: UpdateContactRequest
 * Response: { success: true }
 */
router.put(
    '/:id/contact',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.updateContactBody),
    controller.updateContact
);

/**
 * POST /api/suppliers/:id/gallery
 * Add media to gallery
 * Auth: Yes (SUPPLIER - owner)
 * Body: AddGalleryItemRequest
 * Response: GalleryItemResponse
 */
router.post(
    '/:id/gallery',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.addGalleryBody),
    controller.addGalleryItem
);

/**
 * DELETE /api/suppliers/:id/gallery/:mediaId
 * Remove media from gallery
 * Auth: Yes (SUPPLIER - owner)
 * Response: { success: true }
 */
router.delete(
    '/:id/gallery/:mediaId',
    authenticate,
    authorize(['SUPPLIER']),
    controller.removeGalleryItem
);

/**
 * POST /api/suppliers/:id/certifications
 * Add certification
 * Auth: Yes (SUPPLIER - owner)
 * Body: AddCertificationRequest
 * Response: CertificationResponse
 */
router.post(
    '/:id/certifications',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.addCertificationBody),
    controller.addCertification
);

/**
 * DELETE /api/suppliers/:id/certifications/:certId
 * Remove certification
 * Auth: Yes (SUPPLIER - owner)
 * Response: { success: true }
 */
router.delete(
    '/:id/certifications/:certId',
    authenticate,
    authorize(['SUPPLIER']),
    controller.removeCertification
);

/**
 * POST /api/suppliers/:id/reviews/:reviewId/response
 * Respond to a review
 * Auth: Yes (SUPPLIER - owner)
 * Body: { response: string }
 * Response: ReviewResponse
 */
router.post(
    '/:id/reviews/:reviewId/response',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.reviewResponseBody),
    controller.respondToReview
);

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * PUT /api/suppliers/:id/verification
 * Update supplier verification level
 * Auth: Yes (ADMIN)
 * Body: { level: 'BASIC' | 'VERIFIED' | 'GOLD' | 'TRUSTED' }
 * Response: { success: true }
 */
router.put(
    '/:id/verification',
    authenticate,
    authorize(['ADMIN', 'SUPER_ADMIN']),
    validateRequest(schemas.updateVerificationBody),
    controller.updateVerificationLevel
);

/**
 * PUT /api/suppliers/:id/status
 * Update supplier status (suspend/activate)
 * Auth: Yes (ADMIN)
 * Body: { status: 'ACTIVE' | 'SUSPENDED', reason?: string }
 * Response: { success: true }
 */
router.put(
    '/:id/status',
    authenticate,
    authorize(['ADMIN', 'SUPER_ADMIN']),
    validateRequest(schemas.updateStatusBody),
    controller.updateSupplierStatus
);

/**
 * PUT /api/suppliers/:id/certifications/:certId/verify
 * Verify a certification
 * Auth: Yes (ADMIN)
 * Body: { isVerified: boolean }
 * Response: { success: true }
 */
router.put(
    '/:id/certifications/:certId/verify',
    authenticate,
    authorize(['ADMIN', 'SUPER_ADMIN']),
    controller.verifyCertification
);

export default router;
