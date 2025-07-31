"use client";
import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PlaySquare } from "lucide-react";

function isYouTube(url: string) {
  return /youtu\.?be/.test(url);
}
function isVimeo(url: string) {
  return /vimeo/.test(url);
}

function getEmbedSrc(url: string) {
  if (isYouTube(url)) {
    // Extract ID and return embed URL
    const id =
      url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_\-]+)/
      )?.[1] || "";
    return `https://www.youtube.com/embed/${id}`;
  }
  if (isVimeo(url)) {
    const id = url.split("/").pop();
    return `https://player.vimeo.com/video/${id}`;
  }
  return url;
}

export function VideoEmbed({
  src,
  title,
  className,
  aspect = "16/9",
}: {
  src: string;
  title?: string;
  className?: string;
  aspect?: string;
}) {
  const isExternal = isYouTube(src) || isVimeo(src);
  const embedSrc = getEmbedSrc(src);

  return (
    <Card className={className}>
      <CardContent className="p-2 flex flex-col items-center">
        <div className="relative w-full rounded overflow-hidden" style={{ aspectRatio: aspect }}>
          {isExternal ? (
            <iframe
              src={embedSrc}
              title={title || "Video"}
              className="w-full h-full rounded"
              frameBorder={0}
              allow="autoplay; encrypted-media"
              allowFullScreen
            />
          ) : (
            <video
              controls
              src={src}
              title={title || "Video"}
              className="w-full h-full rounded"
            />
          )}
        </div>
        {title && (
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <PlaySquare className="h-4 w-4" />
            <span>{title}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}