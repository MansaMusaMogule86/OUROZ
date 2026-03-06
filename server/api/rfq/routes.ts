/**
 * OUROZ RFQ API Routes
 */

import { Router } from 'express';
import { authenticate, authorize } from '../../middleware/auth.js';
import { validateRequest } from '../../middleware/validation.js';
import * as controller from './controller.js';
import * as schemas from './schemas.js';

const router = Router();

// POST /api/rfq — create RFQ (buyer)
router.post('/', authenticate, authorize(['BUYER']), validateRequest(schemas.createRfqBody), controller.createRfq);

// GET /api/rfq — list RFQs
router.get('/', authenticate, validateRequest(schemas.listRfqQuery, 'query'), controller.listRfqs);

// GET /api/rfq/:id — RFQ detail
router.get('/:id', authenticate, controller.getRfqDetail);

// POST /api/rfq/:id/quotes — submit quote (supplier)
router.post('/:id/quotes', authenticate, authorize(['SUPPLIER']), validateRequest(schemas.submitQuoteBody), controller.submitQuote);

// POST /api/rfq/:id/quotes/:quoteId/accept — accept quote (buyer)
router.post('/:id/quotes/:quoteId/accept', authenticate, authorize(['BUYER']), controller.acceptQuote);

// POST /api/rfq/:id/close — close RFQ (buyer)
router.post('/:id/close', authenticate, authorize(['BUYER']), controller.closeRfq);

export default router;
