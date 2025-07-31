import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { notFound } from "next/navigation";
import { evaluate } from "@mdx-js/mdx";
import * as runtime from "react/jsx-runtime";
import ReaderShell from "./ReaderShell";

// Set the content directory for books
const BOOKS_DIR = path.join(process.cwd(), "src/content/books");

// Get all chapters for the given book
function getChapters(book: string) {
  const dir = path.join(BOOKS_DIR, book);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx"))
    .sort()
    .map((file) => {
      const filePath = path.join(dir, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data } = matter(raw);
      // Remove prefix and extension for slug, display title if set in frontmatter
      return {
        slug: file.replace(/\.mdx$/, "").replace(/^\d+-/, ""),
        file,
        title: data.title || file.replace(/\.mdx$/, ""),
      };
    });
}

interface PageParams {
  book: string;
  chapter: string;
}

export default async function Page({ params }: { params: Promise<PageParams> }) {
  const { book, chapter } = await params;
  const chapters = getChapters(book);
  if (!chapters.length) return notFound();

  // Find the matching chapter meta
  const chapterMeta = chapters.find(
    (ch) => ch.slug.toLowerCase() === chapter.toLowerCase()
  );
  if (!chapterMeta) return notFound();

  // Read and parse the MDX file
  const filePath = path.join(BOOKS_DIR, book, chapterMeta.file);
  if (!fs.existsSync(filePath)) return notFound();

  const raw = fs.readFileSync(filePath, "utf-8");
  const { content } = matter(raw);

  // Evaluate MDX content into a React component
  const { default: MDXContent } = await evaluate(content, {
    ...runtime,
    // You can pass custom MDX components here
  });

  // Format book title from slug
  const bookTitle = book.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // Render the chapter in the shell layout
  return (
    <ReaderShell
      chapters={chapters}
      book={book}
      bookTitle={bookTitle}
      chapterMeta={chapterMeta}
    >
      <MDXContent />
    </ReaderShell>
  );
}