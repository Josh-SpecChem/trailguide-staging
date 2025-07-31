"use client";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PencilLine } from "lucide-react";
import React from "react";

export function ReflectionPromptBlock({
  prompt,
  allowResponse = true,
  value,
  onChange,
  className,
}: {
  prompt: string;
  allowResponse?: boolean;
  value?: string;
  onChange?: (val: string) => void;
  className?: string;
}) {
  return (
    <Card className={cn("my-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700", className)}>
      <CardContent className="flex flex-col gap-3 p-4">
        <div className="flex items-center gap-2">
          <PencilLine className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
          <span className="font-semibold text-yellow-900 dark:text-yellow-200">Reflection</span>
        </div>
        <div className="text-sm text-muted-foreground">{prompt}</div>
        {allowResponse && (
          <Textarea
            placeholder="Write your response here..."
            value={value}
            onChange={e => onChange?.(e.target.value)}
            className="mt-2 resize-none"
            rows={3}
          />
        )}
      </CardContent>
    </Card>
  );
}