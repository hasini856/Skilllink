import Groq from "groq-sdk";
import { users } from "../data/users.js";
let groq = null;

const getGroq = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY missing in .env");
  }

  if (!groq) {
    groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });
  }

  return groq;
};

// ================= CHAT =================
export const chatWithAI = async (message) => {
  const client = getGroq();

  try {
    const safeMessage =
      typeof message === "string"
        ? message
        : JSON.stringify(message);

    const res = await client.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: "You are a helpful SkillLink assistant.",
        },
        {
          role: "user",
          content: safeMessage,
        },
      ],
    });

    return res.choices?.[0]?.message?.content || "No response";

  } catch (err) {
    console.error("❌ CHAT ERROR:", err.response?.data || err.message);
    throw new Error("AI Chat failed");
  }
};
// ================= MATCHING =================
const normalize = (s) =>
  (s || "")
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();

export const generateMatches = async (currentUser) => {
  if (!currentUser) {
    throw new Error("User not found");
  }

  // ✅ STEP 1: GET CORRECT SKILLS BASED ON ROLE
  let inputSkills = [];

  if (currentUser.role === "learner") {
    inputSkills = currentUser.learnerProfile?.skills || [];
  } else if (currentUser.role === "mentor") {
    inputSkills = currentUser.mentorProfile?.expertise || [];
  }

  const normalizedInput = inputSkills.map(normalize);

  // ✅ STEP 2: MATCH USERS
  const results = users.map((user) => {
    const userSkills = (user.skills || []).map(normalize);

    const commonSkills = userSkills.filter((skill) =>
      normalizedInput.includes(skill)
    );

    return {
      id: user.id,
      name: user.name,
      role: user.role,
      skills: user.skills,
      commonSkills,
      matchScore: commonSkills.length,
    };
  });

  // sort best matches first
  const sorted = results.sort(
    (a, b) => b.matchScore - a.matchScore
  );

  return {
    success: true,
    matches: sorted,
  };
};