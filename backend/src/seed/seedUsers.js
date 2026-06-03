import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";

import connectDB from "../config/db.js";
import User from "../models/User.model.js";

import { generateUsers } from "../data/generateUsers.js";

const seedUsers = async () => {
  try {
    await connectDB();

    const fakeUsers = generateUsers(100);

    await User.deleteMany({
      email: /user/i,
    });

    const formattedUsers =
      await Promise.all(
        fakeUsers.map(async (user) => ({
          name: user.name,
          email: user.email,

          password:
            await bcrypt.hash(
              "123456",
              10
            ),

          role: user.role,

          skills: user.skills,
        }))
      );

    await User.insertMany(
      formattedUsers
    );

    console.log(
      "✅ 100 fake users added"
    );

    process.exit();

  } catch (err) {
    console.error(err);

    process.exit(1);
  }
};

seedUsers();