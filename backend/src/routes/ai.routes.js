import { Router } from "express";
import { chat, match } from "../controllers/ai.controller.js";

const router = Router();

// 🤖 AI CHATBOT
router.post("/chat", chat);

// 👨‍🏫 AI MATCHING (returns mentor + roomId)
router.post("/match", match);

export default router;