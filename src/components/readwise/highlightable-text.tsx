"use client";
import React, { useState } from "react";
import { HighlightToolbar } from "@/components/readwise/highlight-toolbar";
import { InlineFootnoteReference } from "@/components/readwise/footnote-popover";

// Utility to get plain text from any React children
function getStringFromChildren(children: React.ReactNode): string {
  console.log('[getStringFromChildren] Called with:', children);
  if (typeof children === "string" || typeof children === "number") {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(getStringFromChildren).join("");
  }
  if (
    React.isValidElement(children) &&
    children.props &&
    children.props.children
  ) {
    return getStringFromChildren(children.props.children);
  }
  return "";
}

export function HighlightableText({
  children,
  footnotes = [],
  onHighlight,
}: {
  children: React.ReactNode;
  footnotes?: { number: number; content: string }[];
  onHighlight?: (text: string) => void;
}) {
  console.log('[HighlightableText] Rendered with children:', children);
  const [showToolbar, setShowToolbar] = useState(false);

  const handleMouseUp = () => {
    const sel = window.getSelection();
    const selectedText = sel?.toString() ?? "";
    console.log('[HighlightableText] handleMouseUp fired. Selected text:', selectedText);
    if (sel) console.log('[HighlightableText] Selection object:', sel);
    if (selectedText.length > 0) {
      if (onHighlight) {
        onHighlight(selectedText);
        setShowToolbar(false);
      } else {
        setShowToolbar(true);
      }
    } else {
      setShowToolbar(false);
    }
  };

  const handleCloseToolbar = () => {
    setShowToolbar(false);
    window.getSelection()?.removeAllRanges();
  };

  // Render with highlight toolbar or not
  const contentString = getStringFromChildren(children);

  return (
    <span
      className="relative group"
      onMouseUp={handleMouseUp}
      style={{ userSelect: "text" }}
    >
      {!onHighlight ? (
        <HighlightToolbar
          open={showToolbar}
          onOpenChange={setShowToolbar}
          onAddNote={handleCloseToolbar}
          onCopy={() => {
            navigator.clipboard.writeText(contentString);
            handleCloseToolbar();
          }}
          onShare={handleCloseToolbar}
          onAskAI={handleCloseToolbar}
        >
          <span
            className={`px-0.5 rounded ${
              showToolbar ? "bg-yellow-100 dark:bg-yellow-800/40" : ""
            }`}
          >
            {renderTextWithFootnotes(contentString, footnotes)}
          </span>
        </HighlightToolbar>
      ) : (
        <span className="px-0.5 rounded">
          {renderTextWithFootnotes(contentString, footnotes)}
        </span>
      )}
    </span>
  );
}

// Util: parse text and inject footnote refs
function renderTextWithFootnotes(
  text: string,
  footnotes: { number: number; content: string }[]
) {
  console.log('[renderTextWithFootnotes] Called with text:', text);
  let output: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /\[\^(\d+)\]/g;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text))) {
    const n = Number(match[1]);
    const note = footnotes.find((f) => f.number === n);
    output.push(text.slice(lastIndex, match.index));
    if (note) {
      output.push(
        <InlineFootnoteReference key={n} number={n} content={note.content} />
      );
    } else {
      output.push(match[0]);
    }
    lastIndex = regex.lastIndex;
  }
  output.push(text.slice(lastIndex));
  return output;
}