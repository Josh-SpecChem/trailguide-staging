"use client";
import { Paragraph } from "@/components/readwise/paragraph";

// For demo, fake data
const demoParagraphs = [
  {
    text: `This is a demo paragraph with a highlightable sentence. Try selecting text! Here's a footnote reference [^1].`,
    footnotes: [{ number: 1, content: "This is a sample footnote for demo purposes." }],
  },
  {
    text: "You can render many paragraphs. Each is highlightable. [^2]",
    footnotes: [{ number: 2, content: "Footnotes can be different per paragraph." }],
  },
];

export default function ChapterContent() {
  return (
    <article className="prose prose-lg prose-gold dark:prose-invert font-serif max-w-prose mx-auto px-4 sm:px-0 py-8 leading-relaxed">
      {demoParagraphs.map((para, idx) => (
        <Paragraph key={idx} footnotes={para.footnotes}>{para.text}</Paragraph>
      ))}
    </article>
  );
}