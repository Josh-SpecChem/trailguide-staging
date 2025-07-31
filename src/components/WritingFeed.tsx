// /components/WritingFeed.tsx
import { WritingPost } from "./WritingPost";

export function WritingFeed({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-6 text-text">
      {posts.map((post, i) => (
        <WritingPost key={i} post={post} />
      ))}
    </div>
  );
}