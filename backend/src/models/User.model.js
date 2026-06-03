

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
name: String,

email: {
type: String,
unique: true,
},

password: String,

role: {
type: String,
enum: ["learner", "mentor"],
default: "learner",
},

skills: [String],

bio: String,
},
{
timestamps: true,
}
);

// ✅ IMPORTANT FIX
const User =
mongoose.models.User ||
mongoose.model("User", userSchema);

export default User;
