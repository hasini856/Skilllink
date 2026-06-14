import User from "../models/User.model.js";

export const getMatches = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // ✅ Learner sees mentors, Mentor sees learners
    const targetRole =
      currentUser.role === "learner"
        ? "mentor"
        : "learner";

    const users = await User.find({
      _id: { $ne: currentUser._id },
      role: targetRole,
    });

    const currentSkills = (currentUser.skills || []).map(
      (skill) => skill.toLowerCase().trim()
    );

    const matches = users
      .map((user) => {
        const userSkills = (user.skills || []).map(
          (skill) => skill.toLowerCase().trim()
        );

        const commonSkills = userSkills.filter((skill) =>
          currentSkills.includes(skill)
        );

        return {
          _id: user._id,
          name: user.name,
          role: user.role,
          skills: user.skills,
          commonSkills,
          matchScore: commonSkills.length,
        };
      })

      // ✅ REMOVE ZERO MATCHES
      .filter((user) => user.matchScore > 0)

      // ✅ HIGHEST SCORE FIRST
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      matches,
    });
  } catch (err) {
    console.error("Match Error:", err);

    res.status(500).json({
      message: err.message,
    });
  }
};