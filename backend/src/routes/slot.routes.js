import { Router } from 'express';
import * as slotController from '../controllers/slot.controller.js';
import * as sessionController from '../controllers/session.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', protect, slotController.createSlot);
router.get('/mine', protect, slotController.getMySlots);
router.get('/available', protect, slotController.getAvailableSlots);
router.delete('/:id', protect, slotController.deleteSlot);
router.post('/:id/book', protect, sessionController.bookSlot);

export default router;
