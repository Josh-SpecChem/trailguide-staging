"use client";
import { useState } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/readwise/popover";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const steps = [
  { title: "Welcome!", text: "This digital reader has powerful features: highlights, notes, AI, and more." },
  { title: "Highlight & Take Notes", text: "Select text to annotate, share, or ask the AI." },
  { title: "Use the Sidebar", text: "Jump chapters, manage notes, and engage with community." },
  { title: "Explore AI Help", text: "Get insights by chatting with Alanbot in the sidebar." },
];

export function OnboardingTooltipSequence() {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(false);

  const current = steps[step];
  const isLast = step === steps.length - 1;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="fixed bottom-18 right-6 z-50 mb-16">
          <HelpCircle className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="max-w-xs bg-white">
s        <div className="font-semibold mb-1">{current.title}</div>
        <div className="mb-2 text-sm">{current.text}</div>
        <div className="flex gap-2">
          {step > 0 && (
            <Button size="sm" variant="ghost" onClick={() => setStep(s => s - 1)}>Back</Button>
          )}
          {!isLast ? (
            <Button size="sm" onClick={() => setStep(s => s + 1)}>Next</Button>
          ) : (
            <Button size="sm" onClick={() => { setStep(0); setOpen(false); }}>Finish</Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}