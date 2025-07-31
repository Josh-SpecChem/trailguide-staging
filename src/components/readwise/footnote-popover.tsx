"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/readwise/popover";
import { Info } from "lucide-react";

export function InlineFootnoteReference({
  number,
  content,
}: {
  number: number;
  content: string;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <sup className="cursor-pointer text-primary hover:underline mx-0.5">
          <Info className="inline-block h-3 w-3 mr-0.5" />
          {number}
        </sup>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs text-sm">{content}</PopoverContent>
    </Popover>
  );
}