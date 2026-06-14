import { useState } from "react";
import { api } from "../services/api";

function AIChat() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMsg = message;

    // add user message
    setChat((prev) => [
      ...prev,
      { type: "user", text: userMsg },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const res = await api.sendChatMessage(userMsg);

      // SAFE parsing (works with Grok/OpenAI/custom backend)
      const aiText =
        res?.reply ||
        res?.message ||
        res?.output ||
        res?.choices?.[0]?.message?.content ||
        "No response";

      setChat((prev) => [
        ...prev,
        { type: "ai", text: aiText },
      ]);

    } catch (err) {
      setChat((prev) => [
        ...prev,
        { type: "ai", text: "AI error occurred" },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🤖 AI Chatbot</h1>

      {/* CHAT BOX */}
      <div className="h-[400px] overflow-y-auto border p-3 rounded bg-white space-y-2">

        {chat.map((c, i) => (
          <div
            key={i}
            className={`flex ${
              c.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <span
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                c.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {c.text}
            </span>
          </div>
        ))}

        {loading && (
          <div className="text-left text-gray-500 text-sm">
            AI is typing...
          </div>
        )}

      </div>

      {/* INPUT */}
      <div className="flex mt-3 gap-2">
        <input
          className="border flex-1 p-2 rounded"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask anything..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-green-600 text-white px-4 rounded disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AIChat;