// src/components/writer/WriterTopNavBar.tsx

import React from "react";
import { cn } from "@/lib/utils"; // Optional, if you want to merge classes

export const WriterTopNavBar = ({
  scripture = "Luke 15:11-32 (The Prodigal Son)",
  onClickScripture,
  className,
}: {
  scripture?: string;
  onClickScripture?: () => void;
  className?: string;
}) => {
  return (
    <nav
      className={cn(
        "fixed top-0 left-1/2 -translate-x-1/2 z-40 w-full flex justify-center pointer-events-none",
        className
      )}
      style={{ minHeight: "60px" }}
    >
      <div
        className="w-full md:w-3/4 bg-white/95 border-b border-neutral-800 shadow-xl flex items-center"
        style={{ minHeight: "60px" }}
      >
        {/* Flush left: SermonShaper AI-powered */}
        <div className="flex items-center flex-shrink-0 px-4 py-2 min-w-[200px] pointer-events-auto">
          <span className="text-lg font-bold text-black tracking-tight">
            SermonShaper
          </span>
          <span className="ml-1 text-sm text-purple-300 font-semibold">
            AI-powered
          </span>
        </div>

        {/* Center: This Week's Scripture */}
        <div className="flex-1 flex items-center justify-center pointer-events-auto">
          <button
            className="px-4 py-2 rounded font-semibold text-black bg-neutral-800 hover:bg-neutral-700 transition border border-neutral-700 shadow-sm"
            style={{ letterSpacing: "0.01em" }}
            onClick={onClickScripture}
          >
            {scripture}
          </button>
        </div>

        {/* Right: Empty for now (flex-space) */}
        <div className="flex-shrink-0 px-4 py-2" style={{ minWidth: 120 }} />
      </div>
    </nav>
  );
};