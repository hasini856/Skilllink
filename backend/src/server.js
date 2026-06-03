import dotenv from "dotenv";
dotenv.config();

import http from "http";

import app from "./app.js";
import connectDB from "./config/db.js";

import { initSocket } from "./socket/socket.js";

const PORT = process.env.PORT || 5000;

const startServer = async () => {
try {
console.log("GROQ KEY:", process.env.GROQ_API_KEY);

await connectDB();

// ✅ CREATE HTTP SERVER
const server = http.createServer(app);

// ✅ INITIALIZE SOCKET.IO
initSocket(server);

// ✅ START SERVER
server.listen(PORT, () => {
console.log(`✅ Server running on port ${PORT}`);
console.log(
"GROQ KEY LOADED:",
!!process.env.GROQ_API_KEY
);
});
} catch (err) {
console.error(
"❌ DB Connection Failed:",
err.message
);
}
};

startServer();
