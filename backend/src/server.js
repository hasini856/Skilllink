import dotenv from "dotenv";
dotenv.config();

import http from "http";
import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // 🚀 SERVER START LOG
    console.log("🚀 SERVER STARTING...");

    // 📡 CREATE HTTP SERVER
    const server = http.createServer(app);

    console.log("📡 HTTP SERVER CREATED");

    // 🔥 INIT SOCKET
    initSocket(server);

    console.log("🔌 SOCKET INITIALIZED");

    server.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Server error:", err.message);
  }
};

startServer();