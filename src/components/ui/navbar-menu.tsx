"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const transition = {
  type: "spring" as const,
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

// --- APP NAVBAR ---
export default function NavbarMenu({
  onLogin,
  user,
  menuItems = [],
}: {
  onLogin?: () => void;
  user?: { name: string; avatar?: string };
  menuItems?: { label: string; href: string }[];
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-200 dark:border-gray-800 bg-white/90 dark:bg-gray-950/90 backdrop-blur">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        {/* Left: App logo/title */}
        <a href="/" className="flex items-center gap-2">
          <div className="size-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500" />
          <span className="text-lg md:text-2xl font-bold text-gray-900 dark:text-black tracking-tight">
            Hirsch Books
          </span>
        </a>
        {/* Center: Menu */}
        <ul className="hidden md:flex gap-6">
          {menuItems.map((item) => (
            <li key={item.label}>
              <a
                href={item.href}
                className={cn(
                  "text-base font-medium px-2 py-1 rounded hover:bg-violet-50 dark:hover:bg-violet-900/40 transition-colors",
                  active === item.label
                    ? "text-violet-600 dark:text-fuchsia-400"
                    : "text-gray-700 dark:text-gray-200"
                )}
                onMouseEnter={() => setActive(item.label)}
                onMouseLeave={() => setActive(null)}
              >
                {item.label}
                {active === item.label && (
                  <motion.div
                    layoutId="nav-underline"
                    className="h-1 bg-gradient-to-r from-violet-400 to-fuchsia-400 rounded mt-1"
                    style={{ width: "100%" }}
                  />
                )}
              </a>
            </li>
          ))}
        </ul>
        {/* Right: User/Login */}
        <div>
          {user ? (
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || "/user.png"}
                alt={user.name}
                className="w-8 h-8 rounded-full object-cover border"
              />
              <span className="hidden md:inline text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="px-5 py-2 rounded-lg bg-violet-600 text-black font-medium hover:bg-violet-700 dark:bg-fuchsia-600 dark:hover:bg-fuchsia-700 transition"
            >
              Login
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

// Optionally, you can export supporting menu and product items if used elsewhere
export const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-black hover:opacity-90 dark:text-black"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active"
                className="bg-white dark:bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 shadow-xl"
              >
                <motion.div layout className="w-max h-full p-4">
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};