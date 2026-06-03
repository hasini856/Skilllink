import { Router } from "express";
import { generateQuiz } from "../controllers/quiz.controller.js";

const router = Router();

router.post("/", generateQuiz);

export default router;