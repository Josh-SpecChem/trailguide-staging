import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Headphones } from "lucide-react";

interface BookHeaderProps {
  title: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  published: string;
  readingTime: string;
  onListen: () => void;
  className?: string;
}

export function BookHeader({
  title,
  author,
  published,
  readingTime,
  onListen,
  className,
}: BookHeaderProps) {
  return (
    <header
      className={cn(
        "flex flex-col md:flex-row md:items-end gap-6 w-full border-b border-zinc-800 pb-6 pt-4 bg-white",
        className
      )}
    >
      {/* Left: Title and author */}
      <div className="flex-1 flex flex-col gap-2">
        <h1 className="text-3xl md:text-4xl font-semibold leading-tight tracking-tight text-black">
          {title}
        </h1>
        <div className="flex items-center gap-3 mt-2">
          <img
            src={author.avatar}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700"
          />
          <div>
            <div className="font-semibold text-black text-base">{author.name}</div>
            {author.bio && (
              <div className="text-zinc-400 text-xs font-medium">{author.bio}</div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 text-zinc-400 text-xs mt-1 font-mono">
          <span>Published: {published}</span>
          <span>•</span>
          <span>Reading time: {readingTime}</span>
        </div>
      </div>
      {/* Right: Listen button */}
      <div className="flex-none mt-6 md:mt-0 md:ml-8">
        <Button
          variant="outline"
          size="sm"
          onClick={onListen}
          className="flex items-center gap-2 border-purple-600 text-black hover:border-purple-400 hover:bg-purple-900/20 transition"
        >
          <Headphones className="h-5 w-5 text-purple-400" />
          Listen
        </Button>
      </div>
    </header>
  );
}