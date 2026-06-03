import { Router } from 'express';
import * as profileController from '../controllers/profile.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = Router();

router.get('/me', protect, profileController.getMyProfile);
router.put('/me', protect, profileController.updateMyProfile);

export default router;
