"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/readwise/popover";
import { Button } from "@/components/ui/button";
import { Clipboard, Share2, Pencil, Bot } from "lucide-react";

export function HighlightToolbar({
  open,
  onOpenChange,
  onAddNote,
  onCopy,
  onShare,
  onAskAI,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: () => void;
  onCopy: () => void;
  onShare: () => void;
  onAskAI: () => void;
  children: React.ReactNode;
}) {
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={onAddNote} title="Add Note">
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onCopy} title="Copy">
          <Clipboard className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onShare} title="Share">
          <Share2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onAskAI} title="Ask AI">
          <Bot className="h-4 w-4" />
        </Button>
      </PopoverContent>
    </Popover>
  );
}