import User from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { parseList } from "../utils/parseList.js";
import { formatUser } from "../utils/formatUser.js";

// ================= GET PROFILE =================
export const getMyProfile = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    user: formatUser(req.user),
  });
});

// ================= UPDATE PROFILE =================
export const updateMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  console.log("PROFILE BODY:", req.body);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // ================= LEARNER =================
  if (user.role === "learner") {
    const { skills, interests, goals } = req.body;

    const parsedSkills = parseList(skills);

    // SAVE ROOT SKILLS
    user.skills = parsedSkills;

    user.learnerProfile = {
      skills: parsedSkills,
      interests: parseList(interests),
      goals: goals || "",
    };
  }

  // ================= MENTOR =================
  if (user.role === "mentor") {
    const { expertise, experience, availability } = req.body;

    console.log("MENTOR EXPERTISE:", expertise);

    const parsedExpertise = parseList(expertise);

    // VERY IMPORTANT
    user.skills = parsedExpertise;

    user.mentorProfile = {
      expertise: parsedExpertise,
      experience: experience || "",
      availability: availability || "",
    };
  }

  await user.save();

  console.log("FINAL SAVED USER:", user);

  res.json({
    success: true,
    user: formatUser(user),
  });
});