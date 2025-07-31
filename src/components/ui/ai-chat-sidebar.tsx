"use client";
import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Bot, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export function AIChatSidebar({
  initialMessages = [],
  onSend,
  className,
}: {
  initialMessages?: AIChatMessage[];
  onSend?: (message: string) => Promise<string> | string;
  className?: string;
}) {
  const [messages, setMessages] = useState<AIChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setMessages([...messages, { sender: "user", text: input }]);
    let reply = "I'm a helpful AI. This is a demo response!";
    if (onSend) {
      const res = await onSend(input);
      if (typeof res === "string") reply = res;
    }
    setTimeout(() => {
      setMessages((msgs) => [...msgs, { sender: "ai", text: reply }]);
      setLoading(false);
      setInput("");
    }, 600);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <Card className={className}>
      <CardContent className="p-0 flex flex-col h-[480px]">
        <AIChatHeader />
        <ScrollArea className="flex-1 p-4 space-y-3 overflow-y-auto">
          <AIChatMessages messages={messages} />
          <div ref={messagesEndRef} />
        </ScrollArea>
        <AIChatInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          loading={loading}
        />
      </CardContent>
    </Card>
  );
}

export interface AIChatMessage {
  sender: "user" | "ai";
  text: string;
}

export function AIChatHeader() {
  return (
    <div className="flex items-center gap-2 bg-muted/60 border-b border-muted px-4 py-2">
      <Bot className="h-5 w-5 text-primary" />
      <span className="font-medium text-sm">Ask Alanbot</span>
    </div>
  );
}

export function AIChatMessages({ messages }: { messages: AIChatMessage[] }) {
  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg, i) => (
        <div key={i} className="flex items-start gap-2">
          {msg.sender === "ai" ? (
            <Bot className="h-5 w-5 text-primary shrink-0 mt-1" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground shrink-0 mt-1" />
          )}
          <div
            className={
              msg.sender === "ai"
                ? "rounded-md bg-muted px-3 py-2 text-sm"
                : "rounded-md bg-primary/10 px-3 py-2 text-sm"
            }
          >
            {msg.text}
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIChatInput({
  value,
  onChange,
  onSend,
  loading,
}: {
  value: string;
  onChange: (v: string) => void;
  onSend: () => void;
  loading?: boolean;
}) {
  return (
    <form
      className="flex items-center gap-2 border-t border-muted px-3 py-2"
      onSubmit={e => {
        e.preventDefault();
        if (!loading) onSend();
      }}
    >
      <Input
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
        placeholder="Ask anything about this chapter…"
        className="flex-1"
      />
      <Button type="submit" size="icon" disabled={loading || !value.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}