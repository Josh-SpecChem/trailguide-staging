// /components/WritingPost.tsx
import React from "react";
import ReactMarkdown from "react-markdown";

export function WritingPost({ post }: { post: any }) {
  return (
    <article className="prose prose-invert max-w-3xl mx-auto py-10 text-text">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <p className="text-sm text-text-muted mb-4">{post.date} • {post.category}</p>
      <div className="prose prose-invert">
        <ReactMarkdown
          components={{
            blockquote({ children }) {
              return (
                <blockquote className="border-l-4 border-tekhelet pl-4 italic text-text-muted">
                  {children}
                </blockquote>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </div>
    </article>
  );
}