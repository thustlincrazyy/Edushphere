import { useState, useRef, useEffect } from "react";
import { Send, X, MessageCircle } from "lucide-react";
import { chatAPI, getToken } from "@/lib/api";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function FloatingChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm EduBot 🤖 powered by Groq LLaMA3. Ask me anything about your studies!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
    try {
      const data = await chatAPI.sendMessage(updated);
      setMessages([...updated, { role: "assistant", content: data.response }]);
    } catch {
      setMessages([...updated, {
        role: "assistant",
        content: "Sorry, having trouble connecting. Please try again!"
      }]);
    } finally {
      setLoading(false);
    }
  };

  if (!getToken()) return null;

  return (
    <>
      {/* Floating Button */}
      {!open && (
        <button onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-indigo-700 transition text-2xl">
          🤖
        </button>
      )}

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-6 right-6 z-50 w-80 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col border border-gray-100 overflow-hidden">

          {/* Header */}
          <div className="bg-indigo-600 text-white p-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">🤖</div>
            <div className="flex-1">
              <p className="font-bold text-sm">EduBot</p>
              <p className="text-indigo-200 text-xs">Powered by Groq LLaMA3</p>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-indigo-700 p-1 rounded-lg transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "assistant" && (
                  <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs mr-1 flex-shrink-0 mt-1">🤖</div>
                )}
                <div className={`max-w-[200px] px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-br-sm"
                    : "bg-white text-gray-800 shadow-sm border border-gray-100 rounded-bl-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center text-xs mr-1">🤖</div>
                <div className="bg-white px-3 py-2 rounded-2xl rounded-bl-sm shadow-sm border border-gray-100">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && send()}
                placeholder="Ask anything..."
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-indigo-400 transition"
              />
              <button onClick={send} disabled={loading || !input.trim()}
                className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50">
                <Send className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
