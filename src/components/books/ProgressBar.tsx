"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

type ProgressBarProps = {
  /** Value: 0-100 */
  value: number;
  /** Optionally add a label or aria label for accessibility */
  label?: string;
  className?: string;
};

export default function ProgressBar({ value, label = "Reading progress", className }: ProgressBarProps) {
  return (
    <div
      aria-label={label}
      role="progressbar"
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("w-full h-1 bg-gold/20 rounded", className)}
      style={{ position: "relative" }}
    >
      <div
        className="h-1 bg-gold rounded transition-all"
        style={{ width: `${Math.max(0, Math.min(value, 100))}%` }}
      />
    </div>
  );
}