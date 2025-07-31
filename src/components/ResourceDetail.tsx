// /components/ResourceDetail.tsx
import { Download } from "lucide-react";

export function ResourceDetail({ resource }: { resource: any }) {
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6 text-text">
      <h1 className="text-3xl font-bold">{resource.title}</h1>
      <p className="text-text-muted text-lg">{resource.description}</p>
      <div className="mt-6">
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-tekhelet hover:underline text-sm"
        >
          <Download className="h-4 w-4 text-text-muted" /> Download Resource
        </a>
      </div>
    </div>
  );
}