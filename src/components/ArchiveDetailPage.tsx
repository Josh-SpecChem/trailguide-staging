// /components/ArchiveDetailPage.tsx
import React from "react";

export function ArchiveDetailPage({ item }: { item: any }) {
  return (
    <div className="max-w-3xl mx-auto space-y-6 py-10 text-text">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      <p className="text-lg text-text-muted">{item.summary}</p>
      <div className="flex flex-wrap gap-3">
        {item.tags.map((tag: string) => (
          <span
            key={tag}
            className="bg-whiteOlive px-3 py-1 rounded-full text-sm text-text"
          >
            {tag}
          </span>
        ))}
      </div>
      {item.format === "Video" && (
        <video controls className="w-full rounded-xl">
          <source src={item.link} type="video/mp4" />
        </video>
      )}
      {item.format === "Audio" && (
        <audio controls className="w-full">
          <source src={item.link} type="audio/mpeg" />
        </audio>
      )}
      {item.format === "Text" && (
        <iframe src={item.link} className="w-full h-[600px] rounded-xl" />
      )}
    </div>
  );
}