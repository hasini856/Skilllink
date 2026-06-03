import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";

function ChatPage() {
  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = input;
    setInput("");
    setLoading(true);

    try {
      // ✅ FIXED API CALL (IMPORTANT)
      const res = await api.sendChatMessage({
        message: messageToSend,
      });

      const botMessage = {
        role: "assistant",
        content: res.reply,
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ AI failed. Backend /ai/chat issue",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">
        {id ? "User Chat" : "AI Chat"}
      </h1>

      <div className="h-[400px] overflow-y-auto border p-3 rounded bg-white">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.role === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                m.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>

      <div className="flex mt-3 gap-2">
        <input
          className="border flex-1 p-2 rounded"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type message..."
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 text-white px-4 rounded"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatPage;