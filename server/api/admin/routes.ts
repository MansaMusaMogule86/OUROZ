/**
 * OUROZ Admin API Routes
 */

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();

// All admin routes require ADMIN or SUPER_ADMIN
router.use(authenticate, authorize(['ADMIN', 'SUPER_ADMIN']));

router.get('/dashboard', controller.getDashboard);
router.get('/users', controller.listUsers);
router.put('/users/:id/status', controller.updateUserStatus);
router.get('/suppliers', controller.listSuppliersForVerification);
router.get('/orders', controller.listAllOrders);

export default router;
