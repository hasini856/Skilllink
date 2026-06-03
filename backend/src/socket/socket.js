import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
io = new Server(server, {
cors: {
origin: "http://localhost:5173",
credentials: true,
},
});

io.on("connection", (socket) => {
console.log("✅ User connected:", socket.id);

socket.on("join", (userId) => {
socket.join(String(userId));

console.log(`User joined room: ${userId}`);
});

socket.on("disconnect", () => {
console.log("❌ User disconnected");
});
});

return io;
};

// ✅ THIS FIXES YOUR ERROR
export const getIO = () => {
if (!io) {
throw new Error("Socket.io not initialized");
}

return io;
};
