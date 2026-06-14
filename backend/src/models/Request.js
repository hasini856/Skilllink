import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    learner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: String,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },

    roomId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);