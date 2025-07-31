"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Full book list with slugs, authors, and updated descriptions
const books = [
  {
    slug: 'the-faith-of-leap',
    title: 'The Faith of Leap',
    author: 'Alan Hirsch & Michael Frost',
    cover: '/images/books/the-faith-of-leap-book.png',
    description:
      "In *The Faith of Leap*, Alan Hirsch and Michael Frost challenge readers to abandon comfort for adventure and risk—unleashing a daring, missionally engaged way of following Jesus in today’s world.",
  },
  {
    slug: 'untamed',
    title: 'Untamed',
    author: 'Alan Hirsch & Debra Hirsch',
    cover: '/images/books/untamed-book.png',
    description:
      "*Untamed* (co‑authored with Debra Hirsch) calls the church to rediscover authentic discipleship, breaking free from culture and religious idols to follow Jesus outside your comfort zone.",
  },
  {
    slug: 'right-here-right-now',
    title: 'Right Here, Right Now',
    author: 'Alan Hirsch & Lance Ford',
    cover: '/images/books/right-here-right-now-book.png',
    description:
      "*Right Here, Right Now* is a practical guide to missional living—showing how everyday Christians can embody Jesus’ mission wherever they are, at work or home.",
  },
  {
    slug: 'on-the-verge',
    title: 'On the Verge',
    author: 'Alan Hirsch & Dave Ferguson',
    cover: '/images/books/on-the-verge-book.png',
    description:
      "*On the Verge* explores how innovation and apostolic imagination can drive the next wave of church movements, inspiring leaders for the future.",
  },
  {
    slug: 'the-forgotten-ways',
    title: 'The Forgotten Ways',
    author: 'Alan Hirsch',
    cover: '/images/books/the-forgotten-ways.png',
    description:
      "*The Forgotten Ways* unlocks the missional DNA of the early church, revealing six impulses for vibrant, multiplying Jesus movements today.",
  },
  {
    slug: 'the-forgotten-ways-handbook',
    title: 'The Forgotten Ways Handbook',
    author: 'Alan Hirsch',
    cover: '/images/books/the-forgotten-ways-handbook.png',
    description:
      "A practical companion to *The Forgotten Ways*, this handbook guides readers and groups to implement and apply the principles for missional discipleship and multiplication.",
  },
  {
    slug: 'rejesus',
    title: 'ReJesus',
    author: 'Alan Hirsch & Michael Frost',
    cover: '/images/books/rejesus-book.png',
    description:
      "*ReJesus* challenges us to re‑center on the radical example of Jesus, re-imagining the church in light of His mission and life.",
  },
  {
    slug: 'the-permanent-revolution',
    title: 'The Permanent Revolution',
    author: 'Alan Hirsch & Tim Catchim',
    cover: '/images/books/the-permanent-revolution-book.png',
    description:
      "*The Permanent Revolution* explores the fivefold ministry model (APEST) and how apostolic leadership can fuel movement and mission for the church.",
  },
  {
    slug: 'the-shaping-of-things-to-come',
    title: 'The Shaping of Things to Come',
    author: 'Alan Hirsch & Michael Frost',
    cover: '/images/books/the-shaping-of-things-to-come-book.png',
    description:
      "*The Shaping of Things to Come* provides a vision for the missional church—offering innovative models and practices for thriving in post-Christian contexts.",
  },
];

export function BooksOverview() {
  const [selectedBook, setSelectedBook] = useState<null | typeof books[0]>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Trap focus inside modal when open
  useEffect(() => {
    if (!selectedBook) return;

    const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements?.[0];
    const lastElement = focusableElements?.[focusableElements.length - 1];

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault();
        setSelectedBook(null);
      }
      if (e.key === 'Tab' && focusableElements && focusableElements.length > 0) {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    // Prevent background scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [selectedBook]);

  return (
    <>
      <section className="py-16 max-w-7xl mx-auto px-4 dark:bg-white rounded-lg">
        <h2 className="text-4xl font-bold text-center text-black dark:text-black mb-12">
          Books & Reflections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
          {books.map((book) => (
            <button
              key={book.slug}
              onClick={() => setSelectedBook(book)}
              className="bg-neutral-50 dark:bg-neutral-900 rounded-lg shadow-md overflow-hidden text-left cursor-pointer focus:outline-none focus:ring-4 focus:ring-purple-400 transition hover:scale-105"
              aria-haspopup="dialog"
              aria-expanded={selectedBook?.slug === book.slug}
              aria-controls={`${book.slug}-modal`}
            >
              <div className="w-full h-64 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
                <Image
                  src={book.cover}
                  alt={book.title}
                  width={120}
                  height={180}
                  className="h-56 w-auto object-contain rounded-lg"
                  priority={true}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl text-black font-semibold dark:text-black mb-1">{book.title}</h3>
                {book.author && <div className="text-xs mb-2 text-neutral-600 dark:text-neutral-400">{book.author}</div>}
                <p className="text-neutral-800 dark:text-neutral-300 text-sm line-clamp-4">{book.description}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {selectedBook && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`${selectedBook.slug}-title`}
          id={`${selectedBook.slug}-modal`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-70 px-4"
        >
          <div
            ref={modalRef}
            className="w-full max-w-[400px] bg-white dark:bg-neutral-900 rounded-3xl shadow-lg overflow-hidden flex flex-col items-center relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedBook(null)}
              aria-label="Close modal"
              className="absolute top-4 right-4 z-10 text-neutral-800 dark:text-black hover:text-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-400 rounded"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {/* Book Cover */}
            <div className="w-full h-80 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">
              <Image
                src={selectedBook.cover}
                alt={selectedBook.title}
                width={210}
                height={315}
                className="h-72 w-auto object-contain rounded-lg shadow"
                priority={true}
              />
            </div>
            {/* Book Details */}
            <div className="w-full flex flex-col items-center px-8 py-6">
              <h3 id={`${selectedBook.slug}-title`} className="text-2xl font-bold mb-2 text-center text-black dark:text-black">
                {selectedBook.title}
              </h3>
              {selectedBook.author && (
                <div className="mb-4 text-neutral-600 dark:text-neutral-400 text-xs">{selectedBook.author}</div>
              )}
              <p className="mb-6 text-center text-neutral-800 dark:text-neutral-300">{selectedBook.description}</p>
              <Link
                href={`/reader/${selectedBook.slug}/intro`}
                className="inline-block bg-purple-600 text-black font-semibold px-6 py-3 rounded-full shadow hover:bg-purple-500 focus:outline-none focus:ring-4 focus:ring-purple-400 text-center transition"
                onClick={() => setSelectedBook(null)}
              >
                Read Book
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}