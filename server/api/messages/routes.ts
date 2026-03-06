/**
 * OUROZ Messaging API Routes
 */

import { Router } from 'express';
import { authenticate } from '../../middleware/auth.js';
import * as controller from './controller.js';

const router = Router();

router.get('/conversations', authenticate, controller.listConversations);
router.get('/conversations/:id', authenticate, controller.getConversation);
router.post('/conversations/:id/send', authenticate, controller.sendMessage);
router.post('/start', authenticate, controller.startConversation);

export default router;
