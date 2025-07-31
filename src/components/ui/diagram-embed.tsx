"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
// import { Diagram } from "lucide-react";

export function DiagramEmbed({
  svg,
  alt,
  caption,
  className,
}: {
  svg: string;           // SVG as string, e.g., from MDX or import
  alt?: string;
  caption?: string;
  className?: string;
}) {
  return (
    <figure className={className}>
      <Card>
        <CardContent className="p-4 flex flex-col items-center">
          <span
            className="w-full max-w-full"
            role="img"
            aria-label={alt}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: svg }}
          />
          {caption && (
            <figcaption className="mt-2 text-sm text-muted-foreground text-center">
              {caption}
            </figcaption>
          )}
        </CardContent>
      </Card>
    </figure>
  );
}