import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../socket";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";

function MentorChat() {
  const { roomId } = useParams();
  const { user } = useAuth();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const joined = useRef(false);

  // ================= LOAD HISTORY =================
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await api.getMessages(roomId);
        setMessages(res.messages || []);
      } catch (err) {
        console.log(err);
      }
    };

    if (roomId) loadMessages();
  }, [roomId]);

  // ================= SOCKET LISTENER =================
  useEffect(() => {
    const handleMessage = (msg) => {
      // ✅ prevent duplicates
      setMessages((prev) => {
        const exists = prev.some((m) => m._id === msg._id);
        if (exists) return prev;
        return [...prev, msg];
      });
    };

    socket.on("receive-message", handleMessage);

    return () => {
      socket.off("receive-message", handleMessage);
    };
  }, []);

  // ================= JOIN ROOM =================
  useEffect(() => {
    if (!roomId) return;

    if (!socket.connected) {
      socket.connect();
    }

    if (!joined.current) {
      socket.emit("join-room", roomId);
      joined.current = true;
    }
  }, [roomId]);

  // ================= SEND MESSAGE =================
  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      roomId,
      text: input,
      sender: user._id,
    };

    // ❌ DO NOT add locally (prevents double message issue)
    socket.emit("send-message", msg);

    setInput("");
  };

  return (
    <div className="p-4">
      <h2>Chat</h2>

      <div className="h-[400px] overflow-y-auto border p-3">
        {messages.map((m, i) => {
          const isMe = m.sender === user._id;

          return (
            <div key={m._id || i} style={{ textAlign: isMe ? "right" : "left" }}>
              <p
                style={{
                  background: isMe ? "blue" : "gray",
                  color: "white",
                  padding: 8,
                  margin: 5,
                  display: "inline-block",
                }}
              >
                {m.text}
              </p>
            </div>
          );
        })}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />

      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default MentorChat;