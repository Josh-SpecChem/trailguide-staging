"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ZoomIn } from "lucide-react";

export function ImageEmbed({
  src,
  alt,
  caption,
  zoomable = true,
  className,
  ...props
}: {
  src: string;
  alt?: string;
  caption?: string;
  zoomable?: boolean;
  className?: string;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const image = (
    <img
      src={src}
      alt={alt || ""}
      className="max-w-full rounded-md shadow border border-muted"
      {...props}
    />
  );

  return (
    <figure className={className}>
      <Card>
        <CardContent className="p-2 flex flex-col items-center">
          {zoomable ? (
            <Dialog>
              <DialogTrigger asChild>
                <button className="relative group focus:outline-none">
                  {image}
                  <span className="absolute bottom-2 right-2 p-1 rounded-full bg-white/60 text-black opacity-80 group-hover:opacity-100">
                    <ZoomIn className="h-4 w-4" />
                  </span>
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl flex justify-center">
                <img src={src} alt={alt || ""} className="rounded-lg max-h-[75vh]" />
              </DialogContent>
            </Dialog>
          ) : (
            image
          )}
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