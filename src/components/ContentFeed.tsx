"use client";

export default function ContentFeed({ limit }: { limit?: number }) {
  const mockPosts = [
    { title: "The Forgotten Ways Revisited", href: "/posts/forgotten-ways", summary: "Reactivating the early church impulse." },
    { title: "APEST in the Wild", href: "/posts/apest", summary: "Field reflections on fivefold leadership." },
    { title: "On Movement Thinking", href: "/posts/movement-thinking", summary: "How systems change starts small." },
    { title: "Communitas Over Comfort", href: "/posts/communitas", summary: "Why shared risk bonds us." },
  ];
  const posts = mockPosts.slice(0, limit || 4);
  return (
    <div className="space-y-8">
      {posts.map((post, i) => (
        <a
          key={i}
          href={post.href}
          className="block p-6 border border-border rounded-lg bg-smokyBlack shadow hover:shadow-md"
        >
          <h4 className="text-xl font-semibold text-tekhelet">{post.title}</h4>
          <p className="mt-2 text-sm text-text-muted">{post.summary}</p>
        </a>
      ))}
    </div>
  );
}