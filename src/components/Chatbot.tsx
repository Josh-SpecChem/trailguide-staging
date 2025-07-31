"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button"

type Message = {
  role: "user" | "assistant" | "system";
  content: string;
};

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "system",
      content: "You are a helpful assistant with file search capabilities.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);

    const nextMsgs = [...messages, { role: "user" as const, content: input }];
    setMessages(nextMsgs);
    setInput("");

    const eventSource = new EventSource("/api/respond/stream?messages=" + encodeURIComponent(JSON.stringify(nextMsgs)));

    let fullMessage = "";

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);

        if (parsed.type === "response.output_text.delta" && parsed.delta) {
          fullMessage += parsed.delta;
          setMessages((prev) => {
            const withoutAssistant = prev.filter(msg => msg.role !== "assistant");
            return [...withoutAssistant, { role: "assistant", content: fullMessage }];
          });
        }

        if (parsed.type === "response.output_text.done") {
          eventSource.close();
          setLoading(false);
        }

        if (parsed.type === "response.failed") {
          eventSource.close();
          setMessages([...nextMsgs, { role: "assistant", content: `Error: ${parsed.response?.error?.message}` }]);
          setLoading(false);
        }
      } catch (err) {
        console.error("Failed to parse event data:", event.data);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
      setMessages([...nextMsgs, { role: "assistant", content: "Streaming error occurred." }]);
      setLoading(false);
    };
  };

  return (
    <div className="max-w-lg mx-auto py-10 space-y-4 text-text">
      <div className="bg-whiteOlive rounded-xl shadow-lg h-96 overflow-y-auto p-4 flex flex-col gap-2 border border-border">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`whitespace-pre-line px-3 py-2 rounded text-sm ${
              msg.role === "assistant"
                ? "bg-tekhelet/20 text-tekhelet self-start"
                : msg.role === "user"
                ? "bg-amaranthPurple/20 text-amaranthPurple self-end"
                : "text-text-muted"
            }`}
          >
            <b>{msg.role === "assistant" ? "AI" : msg.role === "user" ? "You" : "System"}: </b>
            {typeof msg.content === "string" ? msg.content : JSON.stringify(msg.content)}
          </div>
        ))}
        {loading && <div className="text-text-muted">AI is thinking…</div>}
      </div>
      <form className="flex gap-2" onSubmit={sendMessage}>
        <input
          className="flex-1 px-3 py-2 rounded bg-whiteOlive border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-tekhelet"
          placeholder="Type your question…"
          value={input}
          disabled={loading}
          onChange={e => setInput(e.target.value)}
        />
        <Button type="submit" disabled={loading || !input.trim()}>Send</Button>
      </form>
    </div>
  );
}