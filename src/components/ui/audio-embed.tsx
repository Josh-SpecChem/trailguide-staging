"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Headphones } from "lucide-react";

export function AudioEmbed({
  src,
  title,
  className,
}: {
  src: string;
  title?: string;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="p-4 flex flex-col items-center">
        <audio controls className="w-full mt-2">
          <source src={src} />
          Your browser does not support the audio element.
        </audio>
        {title && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <Headphones className="h-4 w-4" />
            <span>{title}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}