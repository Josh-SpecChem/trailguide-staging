"use client";
import React from "react";

interface HighlightableTextProps {
  children: React.ReactNode;
  onHighlight: (text: string) => void;
}

export function HighlightableText({ children, onHighlight }: HighlightableTextProps) {
  // Recursively flatten children to string, if needed
  function getStringFromChildren(children: React.ReactNode): string {
    if (typeof children === "string") return children;
    if (Array.isArray(children)) return children.map(getStringFromChildren).join("");
    // @ts-ignore
    if (children && typeof children === "object" && "props" in children) return getStringFromChildren(children.props.children);
    return "";
  }

  const handleMouseUp = () => {
    const sel = window.getSelection();
    if (sel && sel.toString().length > 0) {
      onHighlight(sel.toString());
      setTimeout(() => window.getSelection()?.removeAllRanges(), 200);
    }
  };

  return (
    <span onMouseUp={handleMouseUp} style={{ userSelect: "text" }}>
      {children}
    </span>
  );
}