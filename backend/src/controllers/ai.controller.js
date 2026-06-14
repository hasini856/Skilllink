// src/controllers/ai.controller.js

import Groq from "groq-sdk";

/**
 * 🤖 AI CHAT
 */
export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        reply: "Message is required",
      });
    }

    // Check API key first
    if (!process.env.GROQ_API_KEY) {
      console.error("❌ GROQ_API_KEY is missing");

      return res.status(500).json({
        reply: "GROQ_API_KEY not configured in .env",
      });
    }

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply =
      completion?.choices?.[0]?.message?.content ||
      "No response from AI";

    return res.json({ reply });

  } catch (error) {
    console.error("❌ AI Chat Error:", error);

    return res.status(500).json({
      reply: "AI service error",
    });
  }
};

/**
 * 👨‍🏫 AI MATCHING
 */
export const match = async (req, res) => {
  try {
    const { learnerId, skill } = req.body;

    if (!learnerId || !skill) {
      return res.status(400).json({
        error: "learnerId and skill are required",
      });
    }

    const mentorId = "mentor_101";

    const roomId = `${learnerId}_${mentorId}`;

    return res.json({
      success: true,
      mentorId,
      learnerId,
      skill,
      roomId,
      message: "Mentor matched successfully",
    });

  } catch (error) {
    console.error("❌ AI Match Error:", error);

    return res.status(500).json({
      error: "AI match error",
    });
  }
};