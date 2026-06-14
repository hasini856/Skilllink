import express from "express";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET CHAT HISTORY
router.get("/:roomId", protect, async (req, res) => {
  try {
    const messages = await Message.find({
      roomId: req.params.roomId,
    }).sort({ createdAt: 1 });

    res.json({ messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;