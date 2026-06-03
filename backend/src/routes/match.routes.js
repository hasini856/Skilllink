import { Router } from "express";
import { getMatches } from "../controllers/match.controller.js";
import { protect } from "../middleware/auth.middleware.js";

const router = Router();
console.log("🔥 MATCH CONTROLLER HIT");
router.get("/", protect, getMatches);

export default router;