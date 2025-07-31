"use client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Pencil, Share2, Bot, Clipboard } from "lucide-react";

export function HighlightActionsModal({
  open,
  onOpenChange,
  onAddNote,
  onCopy,
  onShare,
  onAskAI,
  highlightText,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddNote: () => void;
  onCopy: () => void;
  onShare: () => void;
  onAskAI: () => void;
  highlightText: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Highlighted Text</DialogTitle>
        <div className="my-3 p-2 bg-muted rounded">{highlightText}</div>
        <div className="flex gap-2 mt-2">
          <Button variant="outline" onClick={onAddNote}><Pencil className="h-4 w-4" /> Note</Button>
          <Button variant="outline" onClick={onCopy}><Clipboard className="h-4 w-4" /> Copy</Button>
          <Button variant="outline" onClick={onShare}><Share2 className="h-4 w-4" /> Share</Button>
          <Button variant="outline" onClick={onAskAI}><Bot className="h-4 w-4" /> Ask AI</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}