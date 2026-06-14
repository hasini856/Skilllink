import { Server } from "socket.io";
import Message from "../models/Message.js";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("🔥 Connected:", socket.id);

    // JOIN ROOM
    socket.on("join-room", (roomId) => {
      console.log("📥 join-room:", roomId);
      socket.join(roomId);
    });

    // SEND MESSAGE
    socket.on("send-message", async (data) => {
      try {
        const { roomId, text, sender } = data;

        if (!roomId || !text || !sender) return;

        const message = await Message.create({
          roomId,
          text,
          sender,
        });

        const formattedMessage = {
          _id: message._id,
          roomId,
          text,
          sender,
          createdAt: message.createdAt,
        };

        console.log("💾 Saved message:", formattedMessage);

        io.to(roomId).emit("receive-message", formattedMessage);
      } catch (err) {
        console.log("Socket error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;