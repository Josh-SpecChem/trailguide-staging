// /components/WritingTags.tsx
export function WritingTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="bg-whiteOlive text-text text-sm px-3 py-1 rounded-full"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}