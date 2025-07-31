"use client";
import * as React from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/readwise/popover";
import { cn } from "@/lib/utils"; // optional: for class merging

type FootnotePopoverProps = {
  number?: number | string;  // number or asterisk, etc.
  children: React.ReactNode; // the footnote content
};

export default function FootnotePopover({ number = 1, children }: FootnotePopoverProps) {
  // Optionally: allow keyboard open (for accessibility)
  return (
    <Popover>
      <PopoverTrigger asChild>
        <sup
          className={cn(
            "text-gold font-semibold cursor-pointer select-none px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded",
            "hover:bg-gold/20 transition"
          )}
          tabIndex={0}
          aria-label={`Show footnote ${number}`}
        >
          {number}
        </sup>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "max-w-xs text-sm p-4 bg-parchment dark:bg-charcoal text-charcoal dark:text-ivory border border-gold/30 shadow-xl rounded",
          "font-body z-50"
        )}
        side="top"
        align="center"
      >
        {children}
      </PopoverContent>
    </Popover>
  );
}