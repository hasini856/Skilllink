import dotenv from "dotenv";
dotenv.config();

import http from "http";
import express from "express";
import cors from "cors";

import app from "./app.js";
import connectDB from "./config/db.js";
import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

// ================= CORS CONFIG =================
const corsOptions = {
  origin: "https://skilllink-frontend-h4fg.onrender.com",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

// ================= START SERVER =================
const startServer = async () => {
  try {
    console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);

    await connectDB();

    // Create HTTP server
    const server = http.createServer(app);

    // Init Socket.IO
    initSocket(server);

    // Listen
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`✅ Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ DB Connection Failed:", err.message);
  }
};

startServer();