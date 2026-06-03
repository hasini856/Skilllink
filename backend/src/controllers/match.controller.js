import User from "../models/User.model.js";
import Request from "../models/Request.js";
import Chat from "../models/Chat.js";

const normalize = (text) =>
  (text || "")
    .toString()
    .trim()
    .toLowerCase();

export const getMatches = async (req, res) => {
  try {
    // ================= CURRENT USER =================
    const currentUser = await User.findById(req.user._id);

    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ================= MY SKILLS =================
    const mySkills = (currentUser.skills || []).map(
      normalize
    );

    console.log("MY SKILLS:", mySkills);

    // ================= TARGET ROLE =================
    const targetRole =
      currentUser.role === "learner"
        ? "mentor"
        : "learner";

    // ================= FIND USERS =================
    const users = await User.find({
      role: targetRole,
      _id: { $ne: currentUser._id },
    });

    console.log("ALL USERS:", users);

    // ================= MATCHING =================
    const matchesData = await Promise.all(
      users.map(async (user) => {

        const userSkills = (
          user.skills || []
        ).map(normalize);

        console.log(
          "CHECKING USER:",
          user.name,
          userSkills
        );

        const commonSkills =
          userSkills.filter((skill) =>
            mySkills.includes(skill)
          );

        console.log(
          "COMMON SKILLS:",
          commonSkills
        );

        // ================= REQUEST =================
        let request;

        if (currentUser.role === "learner") {
          request = await Request.findOne({
            learner: currentUser._id,
            mentor: user._id,
          });
        } else {
          request = await Request.findOne({
            learner: user._id,
            mentor: currentUser._id,
          });
        }

        // ================= CHAT =================
        let chat = null;

        if (
          request &&
          request.status === "accepted"
        ) {
          chat = await Chat.findOne({
            users: {
              $all: [
                currentUser._id,
                user._id,
              ],
            },
          });
        }

        return {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,

          skills: user.skills || [],

          commonSkills,

          matchScore: commonSkills.length,

          requestStatus:
            request?.status || null,

          requestId:
            request?._id || null,

          chatId:
            chat?._id || null,
        };
      })
    );

    // ================= ONLY SHARED SKILLS USERS =================
    const matches = matchesData
      .filter(
        (match) => match.matchScore > 0
      )
      .sort(
        (a, b) =>
          b.matchScore - a.matchScore
      );

    console.log(
      "FINAL MATCHES:",
      matches
    );

    // ================= RESPONSE =================
    res.json({
      success: true,
      matches,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};