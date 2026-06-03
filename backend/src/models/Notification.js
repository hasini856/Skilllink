import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
{
receiver: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},

sender: {
type: mongoose.Schema.Types.ObjectId,
ref: "User",
},

senderName: String,

type: {
type: String,
enum: ["request", "accepted", "rejected"],
default: "request",
},

message: String,

status: {
type: String,
enum: ["pending", "accepted", "rejected"],
default: "pending",
},

chatId: {
type: mongoose.Schema.Types.ObjectId,
ref: "Chat",
},

read: {
type: Boolean,
default: false,
},
},
{ timestamps: true }
);

export default mongoose.model(
"Notification",
notificationSchema
);

