// /components/BookChapterEntry.tsx
export function BookChapterEntry({ title, content }: { title: string; content: string }) {
  return (
    <article className="prose prose-invert prose-lg max-w-3xl mx-auto">
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </article>
  );
}