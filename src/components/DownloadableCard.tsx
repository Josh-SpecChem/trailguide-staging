// /components/DownloadableCard.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadableCard({ resource }: { resource: any }) {
  return (
    <Card className="p-4 flex flex-col justify-between h-full bg-smokyBlack border border-border text-text">
      <CardContent className="space-y-4">
        <h3 className="text-xl font-semibold text-tekhelet">{resource.title}</h3>
        <p className="text-sm text-text-muted">{resource.description}</p>
        <Button asChild className="mt-4 w-full">
          <a href={resource.link} target="_blank" rel="noopener noreferrer">
            <Download className="mr-2 h-4 w-4 text-text" /> Download
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}