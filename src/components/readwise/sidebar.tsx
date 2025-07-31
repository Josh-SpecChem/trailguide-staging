"use client";
import React, { useState } from "react";
import { Sidebar as ReaderSidebar, SidebarBody } from "@/components/ui/sidebar-reader";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Link from "next/link";
import { booksIndex } from "@/constants/bookIndex";
import { cn } from "@/lib/utils";

export default function Sidebar({
  bookSlug,
  activeSlug,
  shortcuts = [],
}: {
  bookSlug: string;
  activeSlug: string;
  shortcuts?: { label: string; icon?: React.ReactNode; href: string }[];
}) {
  // Sidebar open by default, always visible on desktop
  const [open, setOpen] = useState(true);
  const book = booksIndex.find((b) => b.slug === bookSlug);

  // On mobile (smaller than md), show open button and sidebar is hidden
  // On desktop (md and up), sidebar is visible if open, hidden if closed
  return (
    <>
      {/* Open sidebar button (visible only if closed) */}
      {!open && (
        <button
          className="fixed top-4 left-4 z-50 flex items-center justify-center p-2 rounded-md bg-[#23272b] text-black/80 hover:bg-[#23272b]/80 transition md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
          style={{ boxShadow: "0 2px 8px 0 rgba(0,0,0,0.13)" }}
        >
          <FiChevronRight size={22} />
        </button>
      )}

      {/* Sidebar - visible on md+ only if open */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-[#181c1f] text-black/80 font-sans border-r border-[#23272b]",
          "w-[260px] min-w-[260px] max-w-[260px]",
          "transition-all duration-300 ease-in-out",
          open ? "md:flex" : "hidden"
        )}
        style={{ height: "100vh" }}
      >
        <ReaderSidebar open={open} setOpen={setOpen}>
          {/* Topbar with collapse toggle, aligned with main topbar */}
          <div className="h-16 flex items-center px-4 border-b border-[#23272b] relative">
            <span className="ml-0 text-lg font-bold tracking-wide select-none">Contents</span>
            {/* Collapse button only on desktop */}
            <button
              aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
              onClick={() => setOpen(false)}
              className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center p-1 rounded hover:bg-white/10 transition md:flex hidden"
            >
              <FiChevronLeft size={20} />
            </button>
          </div>
          <SidebarBody className="flex flex-col justify-between flex-1 overflow-y-auto">
            {/* Chapter list */}
            <nav className={cn("flex flex-col gap-1.5 px-3 py-4 overflow-y-auto")}>
              {book &&
                book.toc.map((chapter) => {
                  const isActive = chapter.slug === activeSlug;
                  return (
                    <Link
                      key={chapter.slug}
                      href={`/reader/${bookSlug}/${chapter.slug}`}
                      className={cn(
                        "relative block rounded-r-md px-3 py-2 text-[15px] font-medium leading-5 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
                        "hover:text-black",
                        isActive ? "text-black bg-[#23272b]" : "text-black/80",
                        isActive
                          ? "before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:rounded-r-md before:bg-gradient-to-b before:from-purple-500 before:to-indigo-400"
                          : ""
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      {chapter.title}
                    </Link>
                  );
                })}
            </nav>
            {shortcuts.length > 0 && (
              <div className="px-3 py-4 border-t border-[#23272b]">
                {/* Add shortcut links or footer content here */}
              </div>
            )}
          </SidebarBody>
        </ReaderSidebar>
      </div>
    </>
  );
}