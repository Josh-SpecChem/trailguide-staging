// /components/BookChaptersList.tsx
import Link from 'next/link';

export function BookChaptersList({ bookSlug, chapters }: { bookSlug: string; chapters: { title: string; slug: string; summary?: string }[] }) {
  return (
    <div className="space-y-6">
      {chapters.map((chapter, index) => (
        <Link
          key={chapter.slug}
          href={`/reader/${bookSlug}/${chapter.slug}`}
          className="block p-4 border border-gray-700 rounded-lg hover:border-tekhelet transition"
        >
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-lg font-semibold text-text">Chapter {index + 1}: {chapter.title}</h4>
              {chapter.summary && <p className="text-sm text-text-muted mt-1">{chapter.summary}</p>}
            </div>
            <span className="text-tekhelet font-bold">→</span>
          </div>
        </Link>
      ))}
    </div>
  );
}