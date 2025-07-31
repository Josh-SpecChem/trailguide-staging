"use client";
import { use, useEffect, useRef, useState } from "react";
import ReflectionSection from "./ReflectionSection";
import FootnotePopover from "./FootnotePopover";
import ProgressBar from "./ProgressBar";
import HighlightedText from "./HighlightedText";
import BookSidebar from "./BookSidebar";
// import { Progress } from "@/components/ui/progress"; // ShadCN Progress component if available

interface LayoutProps {
  bookTitle: string;
  bookSlug: string;
  toc: any;
  activeSlug: string;
  children: React.ReactNode;
}

export default function Layout({ bookTitle, bookSlug, toc, activeSlug, children }: LayoutProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function handleScroll() {
      if (!contentRef.current) return;
      const element = contentRef.current;
      const scrollTop = window.scrollY || window.pageYOffset;
      const elementTop = element.getBoundingClientRect().top + scrollTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;

      const maxScroll = elementTop + elementHeight - windowHeight;
      const scrollPosition = Math.min(Math.max(scrollTop, elementTop), maxScroll);
      const scrolled = ((scrollPosition - elementTop) / (maxScroll - elementTop)) * 100;
      setProgress(Math.min(Math.max(scrolled, 0), 100));
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-parchment text-charcoal dark:bg-white dark:text-gray-100">
      {/* Left Sidebar */}
      <BookSidebar toc={toc} activeSlug={activeSlug} bookSlug={bookSlug} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Sticky Top Bar */}
        <header className="sticky top-0 z-20 bg-parchment/80 dark:bg-white/80 backdrop-blur border-b border-gold/10 px-4 md:px-12 py-4 flex items-center">
          <h1 className="font-heading text-gold tracking-wide text-lg md:text-xl flex-1">
            {bookTitle}
          </h1>
          {/* Subtle Progress Bar */}
          <div className="w-1/3 ml-6">
            <ProgressBar value={Math.round(progress)} />
          </div>
        </header>
        {/* Main Content (Prose) */}
        <main ref={contentRef} className="flex-1 px-0 md:px-8 py-8 max-w-prose mx-auto w-full">
          <article className="prose prose-lg prose-gold dark:prose-invert font-body leading-relaxed">
            {children}
          </article>
          <ReflectionSection
            prompts={[
              "Where have you sensed God inviting you to take a leap of faith?",
              "What holds you back from risking for Christ?",
              "When have you seen faith grow at the edge of certainty?"
            ]}
            chapterId={activeSlug}
          />
          {/* FootnotePopover will be used here in the future */}
          {/* <FootnotePopover ... /> */}
          {/* ProgressBar will be used here in the future */}
          {/* <ProgressBar ... /> */}
          {/* HighlightedText will be used here in the future */}
          {/* <HighlightedText ... /> */}
        </main>
      </div>

      {/* Right-side Floating Icon Stack (placeholders for now) */}
      <div className="hidden md:flex flex-col gap-4 fixed right-8 top-1/4 z-30">
        <button className="bg-gold/10 text-gold rounded-full p-3 shadow-gold hover:bg-gold/20 transition" title="Reflection Mode">
          <span className="sr-only">Reflection Mode</span>
          {/* icon here, e.g. <IconReflect /> */}
          🧘
        </button>
        <button className="bg-gold/10 text-gold rounded-full p-3 shadow-gold hover:bg-gold/20 transition" title="Footnotes">
          <span className="sr-only">Footnotes</span>
          {/* icon here */}
          ✍️
        </button>
        <button className="bg-gold/10 text-gold rounded-full p-3 shadow-gold hover:bg-gold/20 transition" title="Media">
          <span className="sr-only">Embedded Media</span>
          {/* icon here */}
          🎧
        </button>
      </div>
    </div>
  );
}