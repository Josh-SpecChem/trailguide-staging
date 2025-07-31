"use client";
import React from "react";

interface HighlightModalProps {
  open: boolean;
  onClose: () => void;
  highlightText: string;
  onCopy?: () => void;
  onShare?: () => void;
  onAskAI?: () => void;
}

export function HighlightModal({
  open,
  onClose,
  highlightText,
  onCopy,
  onShare,
  onAskAI,
}: HighlightModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/40">
      <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 shadow-xl w-full max-w-md relative">
        <button onClick={onClose} className="absolute right-3 top-3 text-lg text-gray-500 hover:text-gray-900">&times;</button>
        <h2 className="font-semibold text-lg mb-2">Highlighted Text</h2>
        <div className="bg-neutral-200 dark:bg-neutral-800 rounded p-3 mb-4 text-neutral-800 dark:text-neutral-100 text-sm">
          {highlightText}
        </div>
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-purple-600 text-black font-medium hover:bg-purple-700"
            onClick={onCopy}
          >
            Copy
          </button>
          <button
            className="px-4 py-2 rounded bg-blue-600 text-black font-medium hover:bg-blue-700"
            onClick={onShare}
          >
            Share
          </button>
          <button
            className="px-4 py-2 rounded bg-green-600 text-black font-medium hover:bg-green-700"
            onClick={onAskAI}
          >
            Ask AI
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-400 text-black font-medium hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}