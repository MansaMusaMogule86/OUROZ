/**
 * OUROZ Orders API Routes
 */

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validation.js';
import * as controller from './controller.js';
import * as schemas from './schemas.js';

const router = Router();

// POST /api/orders — create order (auth required)
router.post('/', authenticate, validateRequest(schemas.createOrderBody), controller.createOrder);

// GET /api/orders — list user orders (auth required)
router.get('/', authenticate, validateRequest(schemas.listOrdersQuery, 'query'), controller.listOrders);

// GET /api/orders/:id — order detail (auth required)
router.get('/:id', authenticate, controller.getOrder);

// PUT /api/orders/:id/status — update status (admin)
router.put(
    '/:id/status',
    authenticate,
    authorize(['ADMIN', 'SUPER_ADMIN']),
    validateRequest(schemas.updateOrderStatusBody),
    controller.updateOrderStatus
);

// POST /api/orders/:id/cancel — cancel order (buyer)
router.post('/:id/cancel', authenticate, controller.cancelOrder);

export default router;
