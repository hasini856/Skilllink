import Request from "../models/Request.js";
import Notification from "../models/Notification.js";
import Chat from "../models/Chat.js";
import { getIO } from "../socket/socket.js";

// ================= SEND REQUEST =================
export const sendRequest = async (req, res) => {
  try {
    const { mentorId, topic, message } = req.body;

    const request = await Request.create({
      learner: req.user._id,
      mentor: mentorId,
      topic,
      message,
    });

    const notification = await Notification.create({
      receiver: mentorId,
      sender: req.user._id,
      senderName: req.user.name,
      type: "request",
      message,
      status: "pending",
    });

    getIO()
      .to(String(mentorId))
      .emit("new-session-request", notification);

    res.json({
      success: true,
      request,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= ACCEPT REQUEST =================
export const acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "accepted";
    await request.save();

    const chat = await Chat.create({
      users: [request.learner, request.mentor],
    });

    const notification = await Notification.create({
      receiver: request.learner,
      sender: request.mentor,
      type: "accepted",
      chatId: chat._id,
      message: "Your mentorship request was accepted",
    });

    getIO()
      .to(String(request.learner))
      .emit("request-accepted", notification);

    res.json({
      success: true,
      chatId: chat._id,
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
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "rejected";
    await request.save();

    const notification = await Notification.create({
      receiver: request.learner,
      sender: request.mentor,
      type: "rejected",
      message: "Your mentorship request was rejected",
    });

    getIO()
      .to(String(request.learner))
      .emit("request-rejected", notification);

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================= GET MY REQUESTS =================
export const getMyRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const requests = await Request.find({
      $or: [{ mentor: userId }, { learner: userId }],
    })
      .populate("learner", "name email")
      .populate("mentor", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};