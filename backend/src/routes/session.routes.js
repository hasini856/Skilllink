import { Router } from 'express';
import * as sessionController from '../controllers/session.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/upcoming', protect, sessionController.getUpcomingSessions);
router.patch('/:id/reminder', protect, sessionController.updateReminder);
router.patch('/:id/reminder-sent', protect, sessionController.markReminderSent);
router.patch('/:id/cancel', protect, sessionController.cancelSession);

export default router;