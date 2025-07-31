"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment } from "@/components/ui/comment-thread";
import { MessageCircle } from "lucide-react";

function timeAgo(date: string) {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return past.toLocaleDateString();
}

export function CommentList({
  comments,
}: {
  comments: Comment[];
}) {
  if (!comments.length)
    return (
      <div className="text-muted-foreground flex items-center gap-2 text-sm opacity-75">
        <MessageCircle className="h-4 w-4" /> No comments yet.
      </div>
    );
  return (
    <div className="flex flex-col gap-4">
      {comments.map((c) => (
        <div key={c.id} className="flex gap-2 items-start">
          <Avatar className="h-8 w-8">
            {c.author.avatar ? (
              <AvatarImage src={c.author.avatar} alt={c.author.name} />
            ) : (
              <AvatarFallback>
                {c.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            )}
          </Avatar>
          <div>
            <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
              {c.author.name}
              <span className="ml-2 text-xs text-muted-foreground font-normal">
                {timeAgo(c.createdAt)}
              </span>
            </div>
            <div className="text-sm">{c.content}</div>
          </div>
        </div>
      ))}
    </div>
  );
}