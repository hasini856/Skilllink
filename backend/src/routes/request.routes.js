import express from "express";
import {
  sendRequest,
  getMyRequests,
  acceptRequest,
  rejectRequest,
} from "../controllers/request.controller.js";

import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();

router.post("/", protect, sendRequest);
router.get("/mine", protect, getMyRequests);
router.post("/:id/accept", protect, acceptRequest);
router.post("/:id/reject", protect, rejectRequest);
export default router;