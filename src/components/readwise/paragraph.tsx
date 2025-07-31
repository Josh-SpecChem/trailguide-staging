"use client";
import { HighlightableText } from "@/components/readwise/highlightable-text";
import React from "react";

export function Paragraph({
  children,
  footnotes,
}: {
  children: React.ReactNode;
  footnotes?: { number: number; content: string }[];
}) {
  return (
    <p className="text-base leading-relaxed my-4">
      <HighlightableText footnotes={footnotes}>
        {children}
      </HighlightableText>
    </p>
  );
}