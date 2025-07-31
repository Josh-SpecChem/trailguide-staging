"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NotebookPen, Info, BookOpen, Bookmark } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function InfoPanel({
  summary,
  metadata,
  notes,
}: {
  summary: string;
  metadata: { [key: string]: string };
  notes: { highlight: string; note?: string }[];
}) {
  return (
    <Card>
      <Tabs defaultValue="summary" className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="summary"><Info className="h-4 w-4 mr-1" />Summary</TabsTrigger>
          <TabsTrigger value="metadata"><BookOpen className="h-4 w-4 mr-1" />Metadata</TabsTrigger>
          <TabsTrigger value="notebook"><NotebookPen className="h-4 w-4 mr-1" />Notebook</TabsTrigger>
        </TabsList>
        <TabsContent value="summary">
          <SummaryBox summary={summary} />
        </TabsContent>
        <TabsContent value="metadata">
          <MetadataBox metadata={metadata} />
        </TabsContent>
        <TabsContent value="notebook">
          <NotebookTab notes={notes} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export function SummaryBox({ summary }: { summary: string }) {
  return (
    <CardContent className="p-4 text-sm">{summary}</CardContent>
  );
}

export function MetadataBox({ metadata }: { metadata: { [key: string]: string } }) {
  return (
    <CardContent className="p-4 space-y-1">
      {Object.entries(metadata).map(([key, val]) => (
        <div key={key} className="flex gap-2 text-xs">
          <span className="font-semibold text-muted-foreground">{key}:</span>
          <span>{val}</span>
        </div>
      ))}
    </CardContent>
  );
}

export function NotebookTab({ notes }: { notes: { highlight: string; note?: string }[] }) {
  if (!notes.length)
    return (
      <CardContent className="p-4 text-muted-foreground text-sm">
        No highlights or notes yet.
      </CardContent>
    );
  return (
    <CardContent className="p-4 flex flex-col gap-3">
      {notes.map((n, i) => (
        <div key={i} className="border-b pb-2">
          <div className="text-primary text-sm">&ldquo;{n.highlight}&rdquo;</div>
          {n.note && <div className="text-xs mt-1 text-muted-foreground">Note: {n.note}</div>}
        </div>
      ))}
    </CardContent>
  );
}