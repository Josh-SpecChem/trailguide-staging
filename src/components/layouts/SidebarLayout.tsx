// app/components/layouts/SidebarLayout.tsx

"use client"

import React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

interface SidebarLayoutProps {
    sections: { id: string; label: string }[]
    children: React.ReactNode
}

export const SidebarLayout: React.FC<SidebarLayoutProps> = ({ sections, children }) => {
    const pathname = usePathname()

    return (
        <div className="flex w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 gap-10">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 shrink-0 sticky top-20 h-fit self-start">
                <nav className="space-y-2 border-l border-gray-200 pl-4">
                    {sections.map((section) => (
                        <Link
                            key={section.id}
                            href={`#${section.id}`}
                            className={cn(
                                "block text-sm font-medium transition-colors",
                                pathname?.includes(section.id)
                                    ? "text-primary"
                                    : "text-gray-700 hover:text-primary"
                            )}
                        >
                            {section.label}
                        </Link>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 space-y-16">{children}</main>
        </div>
    )
}

export default SidebarLayout