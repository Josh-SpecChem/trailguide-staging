"use client";
import { cn } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Quote,
  Star,
  BookOpen,
} from "lucide-react";
import React from "react";

const variantIconMap = {
  info: Info,
  tip: Lightbulb,
  warning: AlertTriangle,
  quote: Quote,
  highlight: Star,
  reference: BookOpen,
};

const variantClassMap = {
  info: "border-blue-200 bg-blue-50 dark:bg-blue-950/40 text-blue-900 dark:text-blue-100",
  tip: "border-green-200 bg-green-50 dark:bg-green-950/40 text-green-900 dark:text-green-100",
  warning: "border-yellow-200 bg-yellow-50 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-100",
  quote: "border-purple-200 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-100",
  highlight: "border-orange-200 bg-orange-50 dark:bg-orange-950/40 text-orange-900 dark:text-orange-100",
  reference: "border-gray-200 bg-gray-50 dark:bg-gray-950/40 text-gray-900 dark:text-gray-100",
};

type CalloutVariant = keyof typeof variantIconMap;

export function CalloutBlock({
  variant = "info",
  title,
  icon,
  children,
  className,
}: {
  variant?: CalloutVariant;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  const Icon = variantIconMap[variant];
  const accentClass = variantClassMap[variant];

  return (
    <Alert className={cn("my-4", accentClass, className)}>
      <div className="flex items-center gap-2">
        <span className="shrink-0">{icon || <Icon className="h-5 w-5" />}</span>
        {title && <AlertTitle className="text-base font-semibold">{title}</AlertTitle>}
      </div>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}