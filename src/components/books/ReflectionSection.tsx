"use client";
import * as React from "react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // If you have this utility
import { CheckCircle2 } from "lucide-react";

type ReflectionSectionProps = {
  prompts: string[];
  chapterId: string;
};

export default function ReflectionSection({ prompts, chapterId }: ReflectionSectionProps) {
  const storageKey = `reflection-${chapterId}`;
  const [reflection, setReflection] = useState("");
  const [saved, setSaved] = useState(false);

  // Load saved reflection on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedReflection = localStorage.getItem(storageKey);
      if (savedReflection) setReflection(savedReflection);
    }
  }, [storageKey]);

  // Save on change (debounced)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handler = setTimeout(() => {
        localStorage.setItem(storageKey, reflection);
        if (reflection.length > 0) {
          setSaved(true);
          setTimeout(() => setSaved(false), 1200);
        }
      }, 400);
      return () => clearTimeout(handler);
    }
    return undefined;
  }, [reflection, storageKey]);

  return (
    <section className="mt-16 border-t border-gold/20 pt-8 max-w-prose mx-auto w-full">
      <h2 className="font-heading text-gold text-lg mb-4 tracking-wide flex items-center gap-2">
        Reflection
        {saved && (
          <span className="text-gold flex items-center gap-1 text-sm animate-in fade-in">
            <CheckCircle2 className="w-5 h-5" />
            Saved!
          </span>
        )}
      </h2>
      <ul className="mb-6 space-y-3">
        {prompts.map((prompt, i) => (
          <li
            key={i}
            className="p-3 rounded bg-parchment dark:bg-charcoal/30 text-charcoal dark:text-ivory font-medium border-l-4 border-gold/40"
          >
            {prompt}
          </li>
        ))}
      </ul>
      <label htmlFor="reflection" className="block mb-2 font-heading text-gold">
        Your Journal
      </label>
      <textarea
        id="reflection"
        value={reflection}
        onChange={(e) => setReflection(e.target.value)}
        className={cn(
          "w-full min-h-[120px] rounded border border-gold/30 p-4 font-body text-base",
          "bg-ivory dark:bg-charcoal/20 text-charcoal dark:text-ivory shadow resize-vertical transition focus:ring-2 focus:ring-gold focus:border-gold"
        )}
        placeholder="Write your thoughts, prayers, or responses here…"
      />
    </section>
  );
}