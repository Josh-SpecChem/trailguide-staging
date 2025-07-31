"use client";
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/readwise/popover";
import { Pencil, X } from "lucide-react";
import { cn } from "@/lib/utils";

type HighlightedTextProps = {
  children: React.ReactNode;
  initialNote?: string;
};

export default function HighlightedText({ children, initialNote }: HighlightedTextProps) {
  const [open, setOpen] = React.useState(false);
  const [note, setNote] = React.useState(initialNote || "");
  const [editing, setEditing] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <mark
          tabIndex={0}
          className={cn(
            "bg-gold/20 text-gold px-1 rounded cursor-pointer transition outline-none",
            "hover:bg-gold/30 focus:ring-2 focus:ring-gold"
          )}
          aria-label={note ? "View note" : "Add note"}
        >
          {children}
        </mark>
      </PopoverTrigger>
      <PopoverContent
        className="max-w-xs bg-parchment dark:bg-charcoal text-charcoal dark:text-ivory border border-gold/30 rounded shadow z-50 p-4 space-y-2"
        side="top"
        align="center"
      >
        {editing ? (
          <>
            <textarea
              className="w-full p-2 rounded bg-ivory dark:bg-charcoal/20 text-charcoal dark:text-ivory border border-gold/20"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              autoFocus
              rows={3}
              placeholder="Add your margin note..."
            />
            <div className="flex gap-2 justify-end">
              <button
                className="px-3 py-1 rounded bg-gold text-parchment font-semibold"
                onClick={() => { setEditing(false); setOpen(false); }}
              >
                Save
              </button>
              <button
                className="px-2 py-1 rounded bg-charcoal text-parchment font-semibold"
                onClick={() => { setNote(""); setEditing(false); setOpen(false); }}
                title="Remove note"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-start gap-2">
            <div className="flex-1">
              {note ? (
                <div>
                  <div className="mb-2">{note}</div>
                  <button
                    className="text-xs text-gold hover:underline"
                    onClick={() => setEditing(true)}
                  >
                    Edit
                  </button>
                </div>
              ) : (
                <button
                  className="flex items-center gap-1 text-gold text-sm hover:underline"
                  onClick={() => setEditing(true)}
                >
                  <Pencil className="w-4 h-4" /> Add a margin note
                </button>
              )}
            </div>
            <button
              className="ml-auto text-charcoal dark:text-ivory hover:text-gold"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}