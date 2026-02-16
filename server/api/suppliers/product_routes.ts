/**
 * OUROZ Supplier Product API Routes
 * Nested under /api/suppliers/:supplierId/products
 */

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth';
import * as controller from './controller';
import { validateRequest } from '../../middleware/validation';
import * as schemas from './schemas';

const router = Router({ mergeParams: true }); // Merge params from parent router

// ============================================
// SUPPLIER PRODUCT ENDPOINTS (Owner Only)
// ============================================

/**
 * GET /api/suppliers/:supplierId/products/:productId
 * Get a single product by ID
 * Auth: No (publicly viewable, potentially enhanced for owner)
 * Response: ProductResponse
 */
router.get(
    '/:productId',
    // We could add optionalAuth here to check if the viewer is the owner
    // and return additional details, but for now it's public.
    controller.getProductById
);

/**
 * POST /api/suppliers/:supplierId/products
 * Create a new product for the supplier
 * Auth: Yes (SUPPLIER - owner)
 * Body: CreateProductRequest
 * Response: ProductResponse
 */
router.post(
    '/',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.createProductBody),
    controller.createProduct
);

/**
 * PUT /api/suppliers/:supplierId/products/:productId
 * Update an existing product for the supplier
 * Auth: Yes (SUPPLIER - owner)
 * Body: UpdateProductRequest
 * Response: ProductResponse
 */
router.put(
    '/:productId',
    authenticate,
    authorize(['SUPPLIER']),
    validateRequest(schemas.updateProductBody),
    controller.updateProduct
);

/**
 * DELETE /api/suppliers/:supplierId/products/:productId
 * Delete a product for the supplier
 * Auth: Yes (SUPPLIER - owner)
 * Response: { success: true }
 */
router.delete(
    '/:productId',
    authenticate,
    authorize(['SUPPLIER']),
    controller.deleteProduct
);

export default router;
