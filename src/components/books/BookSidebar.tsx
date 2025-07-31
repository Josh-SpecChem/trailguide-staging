"use client";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";

type Chapter = {
  slug: string;
  title: string;
};

type BookSidebarProps = {
  toc: Chapter[];
  activeSlug: string;
  bookSlug: string;
};

export default function BookSidebar({
  toc,
  activeSlug,
  bookSlug,
}: BookSidebarProps) {
  // This manages the sidebar's open/closed state
  const [open, setOpen] = useState(true);

  // Links for each chapter
  const links = useMemo(
    () =>
      toc.map((chapter, index) => ({
        label: chapter.title,
        href: `/reader/${bookSlug}/${chapter.slug}`,
        icon: (
          <div
            className={cn(
              "w-7 h-7 flex items-center justify-center rounded-full border-2 font-semibold",
              chapter.slug === activeSlug
                ? "bg-gold text-parchment border-gold"
                : "border-gold text-gold"
            )}
          >
            {index === 0 ? "i" : index}
          </div>
        ),
        active: chapter.slug === activeSlug,
      })),
    [toc, activeSlug, bookSlug]
  );

  return (
    <div
      // This wrapper is needed for hover/collapse on desktop
      className={cn(
        "relative h-screen", // always fill height
        "z-30",
        "mt-[20px]",
        "sticky top-0"
      )}
    >
      {/* Mobile: toggle button */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="md:hidden absolute top-4 left-4 z-40 bg-gold text-black dark:bg-gold/80 rounded p-2"
        aria-label={open ? "Close Sidebar" : "Open Sidebar"}
      >
        {/* Simple hamburger/cross, you can sub your icon here */}
        <span className="sr-only">Toggle sidebar</span>
        {open ? "✕" : "☰"}
      </button>

      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody
          className={cn(
            // Animated width for desktop
            "flex flex-col justify-between gap-4 h-full bg-parchment dark:bg-charcoal border-r border-gold/20 font-body text-lg",
            "transition-all duration-300 ease-in-out",
            open
              ? "w-[270px] min-w-[270px] max-w-[270px]" // expanded width
              : "w-0 min-w-0 max-w-0 overflow-hidden" // collapsed width
          )}
        >
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto mt-16 ml-0">
            <div className="flex flex-col gap-4">
              {links.map((link, idx) => (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={cn(
                    "px-4 py-2 rounded font-medium transition-all",
                    link.active
                      ? "bg-gold/80 text-charcoal dark:bg-gold/60 dark:text-charcoal font-bold"
                      : "text-charcoal/70 hover:bg-gold/10 dark:text-parchment/70 dark:hover:bg-gold/10"
                  )}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}