import { Router } from "express";
import { chat, match } from "../controllers/ai.controller.js";

const router = Router();

router.post("/chat", chat);
router.post("/match", match);

export default router;