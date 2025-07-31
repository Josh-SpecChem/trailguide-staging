"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bookmark, Save, Star } from "lucide-react";

export function ActionsPanel({
  onSave,
  onBookmark,
  onFavorite,
  className,
}: {
  onSave?: () => void;
  onBookmark?: () => void;
  onFavorite?: () => void;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex gap-3 justify-center p-4">
        <Button size="icon" variant="ghost" onClick={onBookmark} aria-label="Bookmark">
          <Bookmark className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onSave} aria-label="Save">
          <Save className="h-5 w-5" />
        </Button>
        <Button size="icon" variant="ghost" onClick={onFavorite} aria-label="Favorite">
          <Star className="h-5 w-5" />
        </Button>
      </CardContent>
    </Card>
  );
}