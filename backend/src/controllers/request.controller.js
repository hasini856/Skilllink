import Request from "../models/Request.js";

// ================= MATCH SCORE FUNCTION =================
const calculateMatchScore = (mentor, learner) => {
  let score = 0;

  const mentorSkills = mentor?.skills || [];
  const learnerSkills = learner?.interests || [];

  // 🔥 1. SKILL MATCH (50 points)
  const skillMatches = mentorSkills.filter((skill) =>
    learnerSkills.includes(skill)
  );

  const skillScore =
    mentorSkills.length > 0
      ? (skillMatches.length / mentorSkills.length) * 50
      : 0;

  score += skillScore;

  // 🔥 2. EXPERIENCE (20 points)
  const exp = mentor?.experience || 0;

  if (exp >= 5) score += 20;
  else if (exp >= 3) score += 15;
  else if (exp >= 1) score += 10;

  // 🔥 3. INTEREST ALIGNMENT (20 points)
  const interestMatches = learnerSkills.filter((i) =>
    mentorSkills.includes(i)
  );

  const interestScore =
    learnerSkills.length > 0
      ? (interestMatches.length / learnerSkills.length) * 20
      : 0;

  score += interestScore;

  // 🔥 4. BONUS (10 points)
  if (skillMatches.length > 0) {
    score += 10;
  }

  return Math.min(Math.round(score), 100);
};

// ================= SEND REQUEST =================
export const sendRequest = async (req, res) => {
  try {
    const { mentorId, message } = req.body;

    // Check if request already exists
    const existingRequest = await Request.findOne({
      mentor: mentorId,
      learner: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    const request = new Request({
      mentor: mentorId,
      learner: req.user._id,
      message,
      status: "pending",
    });

    await request.save();

    res.json({ request });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET REQUESTS =================
export const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      $or: [
        { mentor: req.user._id },
        { learner: req.user._id }
      ]
    }).populate("mentor learner");

    const enriched = requests.map((r) => {
      const mentor = r.mentor;
      const learner = r.learner;

      let matchScore = 50;

      const mentorSkills = mentor?.skills || [];
      const learnerSkills = learner?.interests || [];

      const common = mentorSkills.filter(s =>
        learnerSkills.includes(s)
      );

      matchScore += common.length * 10;

      if ((mentor?.experience || 0) >= 3) {
        matchScore += 10;
      }

      return {
        _id: r._id,
        status: r.status,
        message: r.message,
        mentor,
        learner,
        roomId: r.roomId || null,
        matchScore: Math.min(matchScore, 100),
      };
    });

    res.json({ requests: enriched });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// ================= ACCEPT REQUEST =================
export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Not found" });
    }

    // 🔥 CREATE ROOM ONLY HERE
    const roomId = [request.mentor, request.learner]
      .map((id) => id.toString())
      .sort()
      .join("_");

    request.status = "accepted";
    request.roomId = roomId;

    await request.save();

    res.json({
      request: {
        _id: request._id,
        status: request.status,
        roomId: request.roomId,
      },
      roomId,
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= REJECT REQUEST =================
export const rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Not found" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ request });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};