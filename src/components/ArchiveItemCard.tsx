// /components/ArchiveItemCard.tsx
import { Card, CardContent } from "@/components/ui/card";

export function ArchiveItemCard({ item }: { item: any }) {
  return (
    <Card className="hover:shadow-xl cursor-pointer bg-smokyBlack text-text border border-border">
      <CardContent className="space-y-2 p-4">
        <h3 className="text-xl font-semibold">{item.title}</h3>
        <p className="text-sm text-text-muted">{item.summary}</p>
        <div className="flex flex-wrap gap-2">
          {item.tags.map((tag: string) => (
            <span
              key={tag}
              className="bg-whiteOlive rounded-full px-2 py-1 text-xs text-text"
            >
              {tag}
            </span>
          ))}
        </div>
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-tekhelet text-sm underline"
        >
          View or Download
        </a>
      </CardContent>
    </Card>
  );
}