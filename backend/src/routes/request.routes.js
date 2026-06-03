import express from "express";
import {
  sendRequest,
  acceptRequest,
  rejectRequest,
  getMyRequests,
} from "../controllers/request.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// CREATE REQUEST
router.post("/", protect, sendRequest);

// GET ALL REQUESTS (IMPORTANT FIX)
router.get("/mine", protect, getMyRequests);

// ACCEPT
router.put("/:id/accept", protect, acceptRequest);

// REJECT
router.put("/:id/reject", protect, rejectRequest);

export default router;