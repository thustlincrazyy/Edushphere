import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send } from "lucide-react";
import { chatAPI, getToken } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatBot() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm EduBot 🤖 your AI tutor powered by Groq LLaMA3. Ask me anything about your studies!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Backend bypassed: No token check required for local testing
  }, [navigate]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: "user", content: input };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput("");
    setLoading(true);
    
    // Simulate network delay for realistic feel
    setTimeout(() => {
      const mockResponse = "I am a simulated AI tutor! Since your project is currently running in offline frontend-only mode, I cannot connect to Groq LLaMA3. But I'm still here to encourage you! Keep up the great studying!";
      setMessages([...updated, { role: "assistant", content: mockResponse }]);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="bg-indigo-600 text-white p-4 flex items-center gap-3 shadow-lg">
        <button onClick={() => navigate("/student-dashboard")}
          className="hover:bg-indigo-700 p-1 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">🤖</div>
        <div>
          <h1 className="font-bold text-lg">EduBot</h1>
          <p className="text-indigo-200 text-xs">AI Tutor • Powered by Groq LLaMA3</p>
        </div>
        <div className="ml-auto flex items-center gap-1">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-indigo-200">Online</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm mr-2 flex-shrink-0 mt-1">🤖</div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-indigo-600 text-white rounded-br-sm"
                : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-sm ml-2 flex-shrink-0 mt-1 text-white">👤</div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-sm mr-2">🤖</div>
            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white border-t border-gray-100 shadow-lg">
        <div className="flex gap-3 items-end">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && !e.shiftKey && send()}
            placeholder="Ask me anything about your studies..."
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400 transition"
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed">
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">Powered by Groq LLaMA3 • EduSphere AI</p>
      </div>
    </div>
  );
}
