"use client";

import { useState } from "react";
import { Bot } from "lucide-react";
import { AskAIModal } from "@/components/readwise/AskAIModal";

export function FloatingAskAIButton({ initialQuestion }: { initialQuestion?: string }) {
  const [open, setOpen] = useState(false);
  const [prefill, setPrefill] = useState(initialQuestion || "");

  // Optional: Expose method to allow highlights to open AskAI prefilled
  function openWithText(text: string) {
    setPrefill(text);
    setOpen(true);
  }

  // To connect to highlights: pass openWithText to context or a prop!
  // For now, just open normally.

  return (
    <>
      <button
        className="fixed bottom-32 right-6 z-50 bg-white text-accent shadow-lg rounded-full p-4 hover:bg-accent/20 focus:outline-none focus:ring"
        aria-label="Ask AI"
        onClick={() => setOpen(true)}
      >
        <Bot className="w-7 h-7" />
      </button>
      <AskAIModal open={open} onOpenChange={setOpen} prefill={prefill} />
    </>
  );
}