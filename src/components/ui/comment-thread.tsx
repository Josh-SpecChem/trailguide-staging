"use client";
import { useState } from "react";
import { CommentList } from "@/components/ui/comment-list";
import { AddCommentBox } from "@/components/ui/add-comment-box";
import { Card, CardContent } from "@/components/ui/card";

export interface Comment {
  id: string;
  author: { name: string; avatar?: string };
  content: string;
  createdAt: string; // ISO string
}

export function CommentThread({
  initialComments = [],
  onAddComment,
  title = "Comments",
  className,
}: {
  initialComments?: Comment[];
  onAddComment?: (comment: string) => Promise<void> | void;
  title?: string;
  className?: string;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);

  const handleAdd = async (comment: string) => {
    if (!comment.trim()) return;
    if (onAddComment) await onAddComment(comment);
    // Demo: append locally for now
    setComments([
      ...comments,
      {
        id: Math.random().toString(36).slice(2),
        author: { name: "You" },
        content: comment,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <Card className={className}>
      <CardContent className="p-4 flex flex-col gap-4">
        <h4 className="text-base font-semibold">{title}</h4>
        <CommentList comments={comments} />
        <AddCommentBox onSubmit={handleAdd} />
      </CardContent>
    </Card>
  );
}