"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, MessageCircle, ArrowRight } from "lucide-react";
import React from "react";

export function EndOfChapterActions({
  onShareQuote,
  onDiscuss,
  onNextChapter,
  isNextDisabled = false,
  className,
}: {
  onShareQuote: () => void;
  onDiscuss: () => void;
  onNextChapter: () => void;
  isNextDisabled?: boolean;
  className?: string;
}) {
  return (
    <Card className={className}>
      <CardContent className="flex flex-col md:flex-row gap-4 justify-between items-center p-4">
        <ShareQuoteButton onClick={onShareQuote} />
        <DiscussSectionButton onClick={onDiscuss} />
        <NextChapterButton onClick={onNextChapter} disabled={isNextDisabled} />
      </CardContent>
    </Card>
  );
}

export function ShareQuoteButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
      aria-label="Share highlighted quote"
    >
      <Share2 className="h-4 w-4" />
      {children ?? "Share Quote"}
    </Button>
  );
}

export function DiscussSectionButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onClick}
      className="flex items-center gap-2"
      aria-label="Join discussion"
    >
      <MessageCircle className="h-4 w-4" />
      {children ?? "Discuss"}
    </Button>
  );
}

export function NextChapterButton({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Button
      variant="default"
      size="sm"
      onClick={onClick}
      disabled={disabled}
      className="flex items-center gap-2"
      aria-label="Go to next chapter"
    >
      {children ?? <>Next Chapter <ArrowRight className="h-4 w-4 ml-1" /></>}
    </Button>
  );
}