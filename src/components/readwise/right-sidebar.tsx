"use client";
import { AIChatSidebar } from "@/components/ui/ai-chat-sidebar";
import { InfoPanel } from "@/components/ui/info-panel";
import { ActionsPanel } from "@/components/ui/actions-panel";

// Example data (replace with real props/state)
const summary = "This chapter explores wild faith, risk, and the untamed gospel.";
const metadata = {
  "Author": "Alan Hirsch",
  "Published": "2021",
  "Chapters": "12",
  "Length": "18 min",
};
const notes = [
  { highlight: "Jesus lived at the edge of culture.", note: "Profound idea!" },
  { highlight: "Risk is central to mission." },
];

export default function RightSidebar() {
  return (
    <aside className="flex flex-col gap-4 w-full max-w-xs h-full">
      <AIChatSidebar />
      <InfoPanel summary={summary} metadata={metadata} notes={notes} />
      <ActionsPanel
        onSave={() => alert("Saved!")}
        onBookmark={() => alert("Bookmarked!")}
        onFavorite={() => alert("Favorited!")}
      />
    </aside>
  );
}