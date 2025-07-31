// src/components/readwise/resizable-navbar.tsx
import { Headphones } from "lucide-react";
import { cn } from "@/lib/utils";

export const ReaderTopbar = ({
  title = "Untamed",
  authors = "Alan Hirsch & Debra Hirsch",
  onLogin,
  onListen,
  className,
}: {
  title?: string;
  authors?: string;
  onLogin?: () => void;
  onListen?: () => void;
  className?: string;
}) => {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 w-full bg-white text-black border-b border-gray-800",
        className
      )}
      style={{
        minHeight: "64px",
      }}
    >
      <div className="flex items-center justify-between h-16 px-4 md:px-8">
        {/* Left: Headphones button */}
        <button
          onClick={onListen}
          className="p-2 rounded-full hover:bg-white/10 transition flex items-center justify-center"
          aria-label="Listen"
        >
          <Headphones className="w-5 h-5 text-black" />
        </button>

        {/* Center: Title & authors */}
        <div className="flex flex-col items-center flex-1 min-w-0 px-4">
          <span className="truncate text-lg md:text-2xl font-bold tracking-tight text-black">
            {title}
          </span>
          <span className="text-xs md:text-sm font-medium text-gray-400 mt-0.5 tracking-wide italic">
            {authors}
          </span>
        </div>

        {/* Right: Login button */}
        <button
          onClick={onLogin}
          className="px-4 py-1 rounded bg-violet-700 text-black text-xs font-semibold hover:bg-violet-800 transition border border-violet-900"
          style={{ minWidth: "70px" }}
        >
          Login
        </button>
      </div>
    </header>
  );
};