import { Router } from 'express';

import authRoutes from './auth.routes.js';
import userRoutes from './user.routes.js';
import skillRoutes from './skill.routes.js';
import profileRoutes from './profile.routes.js';
import matchRoutes from './match.routes.js';
import slotRoutes from './slot.routes.js';
import sessionRoutes from './session.routes.js';
import analyticsRoutes from './analytics.routes.js';
import notificationRoutes from "./notification.routes.js";
import aiRoutes from "./ai.routes.js";
import requestRoutes from "./request.routes.js";
import quizRoutes from "./quiz.routes.js";

// 🔥 ADD THIS
import messageRoutes from "./message.routes.js";

const router = Router();

router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/matches', matchRoutes);
router.use('/slots', slotRoutes);
router.use('/sessions', sessionRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use("/ai", aiRoutes);
router.use("/requests", requestRoutes);
router.use("/quiz", quizRoutes);
router.use("/notifications", notificationRoutes);

// 🔥 CHAT ROUTE (MISSING BEFORE)
router.use("/messages", messageRoutes);

export default router;