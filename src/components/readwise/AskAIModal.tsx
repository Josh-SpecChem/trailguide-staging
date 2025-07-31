"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bot, Loader2 } from "lucide-react";

export function AskAIModal({
  open,
  onOpenChange,
  prefill = "",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  prefill?: string;
}) {
  const [question, setQuestion] = useState(prefill);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Simple AI call simulation — swap for your API logic!
  async function handleAsk() {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer(null);

    // --- Replace this block with your real API call! ---
    await new Promise((r) => setTimeout(r, 1400));
    setAnswer(
      `🤖 This is a fake AI answer to: "${question}"\n\n(Connect to your real API here!)`
    );
    setLoading(false);
    // ---------------------------------------------------
  }

  // On open, reset state and use prefill
  function handleOpenChange(opening: boolean) {
    if (opening) {
      setQuestion(prefill);
      setAnswer(null);
      setLoading(false);
    }
    onOpenChange(opening);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg w-full p-0 overflow-hidden bg-white">
        <div className="bg-background rounded-xl p-6 shadow-2xl flex flex-col gap-4">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Bot className="h-6 w-6 text-accent" /> Ask AI
            </DialogTitle>
          </DialogHeader>
          <form
            className="flex flex-col gap-2"
            onSubmit={e => {
              e.preventDefault();
              handleAsk();
            }}
          >
            <input
              type="text"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
              placeholder="Ask anything about this page..."
              value={question}
              onChange={e => setQuestion(e.target.value)}
              disabled={loading}
            />
            <button
              className="self-end bg-accent text-black px-4 py-2 rounded hover:bg-accentHover transition text-sm mt-2"
              type="submit"
              disabled={loading || !question.trim()}
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : "Ask"}
            </button>
          </form>
          <div className="min-h-[50px] text-base whitespace-pre-line">
            {answer && (
              <div className="bg-muted/60 p-3 rounded-md mt-2 text-foreground">{answer}</div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}