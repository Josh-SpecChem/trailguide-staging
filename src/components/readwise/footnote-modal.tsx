"use client";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Info } from "lucide-react";

export function FootnoteModal({
  open,
  onOpenChange,
  footnote,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footnote: { number: number; content: string };
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>
          <Info className="h-4 w-4 mr-1" /> Footnote {footnote.number}
        </DialogTitle>
        <div className="mt-2 text-sm">{footnote.content}</div>
      </DialogContent>
    </Dialog>
  );
}