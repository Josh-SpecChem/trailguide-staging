// /app/reader/page.tsx
import { Metadata } from 'next';
import { BooksOverview } from '@/components/readwise/BooksOverview';

export const metadata: Metadata = {
  title: 'Books & Reflections — Alan Hirsch',
  description: 'Explore Alan Hirsch’s books chapter by chapter, with personal reflections and deeper teaching. Read, reflect, and engage.',
};

export default function BooksPage() {
  return (
    <main className="min-h-screen bg-smokyBlack text-text py-12">
      <BooksOverview />
    </main>
  );
}