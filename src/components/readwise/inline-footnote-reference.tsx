"use client";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/readwise/popover";
import { Info, BookOpen } from "lucide-react";

export function InlineFootnoteReference({
  number,
  content,
  children,
}: {
  number: number | string;
  content: string;
  children?: React.ReactNode;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <sup
          className="mx-0.5 cursor-pointer text-primary font-semibold hover:underline inline-block align-super"
          aria-label={`Footnote ${number}`}
        >
          {children ? children : <Info className="inline h-3 w-3 mr-0.5" />}<span>{number}</span>
        </sup>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm">
        <div className="flex items-start gap-2">
          <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
          <span>{content}</span>
        </div>
      </PopoverContent>
    </Popover>
  );
}