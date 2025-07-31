// /components/ArchiveSearch.tsx
import { Input } from "@/components/ui/input";
import { ArchiveFilters } from "./ArchiveFilters";

export function ArchiveSearch({ onSearch }: { onSearch: (query: string) => void }) {
  return (
    <div className="w-full space-y-4 bg-white text-text">
      <Input
        placeholder="Search the Archive..."
        onChange={(e) => onSearch(e.target.value)}
        className="w-full text-lg bg-whiteOlive text-text border border-border placeholder:text-text-muted"
      />
      <ArchiveFilters />
    </div>
  );
}