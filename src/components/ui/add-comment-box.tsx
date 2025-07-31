"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export function AddCommentBox({
  onSubmit,
}: {
  onSubmit: (text: string) => void | Promise<void>;
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    await onSubmit(text);
    setText("");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <Textarea
        value={text}
        onChange={e => setText(e.target.value)}
        rows={2}
        placeholder="Add a comment..."
        className="resize-none"
        disabled={loading}
      />
      <div className="flex justify-end">
        <Button
          type="submit"
          size="sm"
          disabled={loading || !text.trim()}
          aria-label="Add comment"
        >
          <Send className="h-4 w-4 mr-1" />
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </form>
  );
}