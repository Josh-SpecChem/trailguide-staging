// /components/ArchiveFilters.tsx
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function ArchiveFilters() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: "Type", options: ["Books", "Essays", "Talks", "Videos", "PDFs", "Podcasts"] },
        { label: "Theme", options: ["APEST", "Church as Movement", "Discipleship"] },
        { label: "Format", options: ["Audio", "Video", "Text"] },
        { label: "Sort By", options: ["Relevance", "Newest", "Oldest"] },
      ].map(({ label, options }) => (
        <div key={label}>
          <label className="block mb-1 text-sm font-medium text-text-muted">{label}</label>
          <Select>
            <SelectTrigger className="bg-whiteOlive text-text border-border">
              <SelectValue placeholder={`Select ${label}`} />
            </SelectTrigger>
            <SelectContent>
              {options.map((value) => (
                <SelectItem key={value} value={value}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}