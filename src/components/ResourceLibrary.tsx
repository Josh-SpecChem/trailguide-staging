// /components/ResourceLibrary.tsx
import { DownloadableCard } from "./DownloadableCard";

export function ResourceLibrary({ resources }: { resources: any[] }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 text-text">
      {resources.map((res, idx) => (
        <DownloadableCard key={idx} resource={res} />
      ))}
    </div>
  );
}