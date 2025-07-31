// src/app/reader/[book]/[chapter]/ReaderShell.tsx
"use client";

import ReaderClientLayout from "./ReaderClientLayout";

interface ReaderShellProps {
  chapters: Array<{ slug: string; title: string }>;
  book: string;
  bookTitle: string;
  chapterMeta: { slug: string; title: string };
  children: React.ReactNode;
}

// We need to create a component that can be passed to ReaderClientLayout
function MDXWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

export default function ReaderShell(props: ReaderShellProps) {
  const { chapters, book, bookTitle, chapterMeta, children } = props;

  return (
    <ReaderClientLayout
      MDXContent={() => MDXWrapper({ children })}
      bookTitle={bookTitle}
      chapterMeta={chapterMeta}
      chapters={chapters}
      book={book}
    />
  );
}