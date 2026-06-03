import { Router } from "express";

import {
  getNotifications,
  markAsRead,
} from "../controllers/notification.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", protect, getNotifications);

router.put("/:id/read", protect, markAsRead);

export default router;