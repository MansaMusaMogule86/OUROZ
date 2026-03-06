/**
 * OUROZ Products API Routes
 */

import { Router } from 'express';
import * as controller from './controller.js';
import { validateRequest } from '../../middleware/validation.js';
import * as schemas from './schemas.js';

const router = Router();

// GET /api/products — list with filters
router.get('/', validateRequest(schemas.listProductsQuery, 'query'), controller.listProducts);

// GET /api/products/featured — featured products
router.get('/featured', controller.getFeaturedProducts);

// GET /api/products/:slug — single product
router.get('/:slug', controller.getProductBySlug);

// GET /api/categories — all categories
router.get('/categories', controller.listCategories);

export default router;
