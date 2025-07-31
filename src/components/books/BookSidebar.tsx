"use client";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarProvider,
  SidebarMenuButton,
  SidebarMenu,
  SidebarMenuItem
} from "../ui/sidebar";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import Link from "next/link";

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
  const links = useMemo(
    () =>
      toc.map((chapter, index) => ({
        label: chapter.title,
        href: `/reader/${bookSlug}/${chapter.slug}`,
        active: chapter.slug === activeSlug,
      })),
    [toc, activeSlug, bookSlug]
  );

  return (
    <div className="w-64 border-r bg-white h-full">
      <div className="px-4 py-4 border-b">
        <h2 className="text-lg font-semibold text-gray-900">Table of Contents</h2>
      </div>
      <div className="p-4">
        {links.map((link, index) => (
          <div key={index} className="mb-2">
            <Link 
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors",
                link.active 
                  ? "bg-blue-50 text-blue-700 font-medium" 
                  : "text-gray-700 hover:bg-gray-50"
              )}
            >
              <span className="w-4 h-4 text-xs">{index + 1}</span>
              {link.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
