import { asyncHandler } from "../utils/asyncHandler.js";
import { chatWithAI, generateMatches } from "../services/ai.service.js";

// ================= CHAT =================
export const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "Message required" });
  }

  const reply = await chatWithAI(message);

  res.json({
    success: true,
    reply,
  });
});

// ================= MATCH =================
export const match = asyncHandler(async (req, res) => {
  let { skills, role } = req.body;

  console.log("RAW INPUT:", req.body);

  // 🔥 SAFETY FIX
  if (!Array.isArray(skills)) {
    skills = [];
  }

  const result = await generateMatches(skills, role);

  res.json(result);
});