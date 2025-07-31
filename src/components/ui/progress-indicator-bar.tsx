"use client";
import * as React from "react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ProgressIndicatorBarProps {
  value?: number;
  targetRef?: React.RefObject<HTMLElement>;
}

const ProgressIndicatorBar: React.FC<ProgressIndicatorBarProps> = ({
  targetRef,
}) => {
  const [value, setValue] = React.useState(0);

  React.useEffect(() => {
    function handleScroll() {
      let progress = 0;
      if (targetRef?.current) {
        const el = targetRef.current;
        const windowHeight = window.innerHeight;
        progress = Math.min(
          Math.max((window.scrollY - el.offsetTop) / (el.scrollHeight - windowHeight), 0),
          1
        );
      } else {
        const scrollTop = window.scrollY;
        const docHeight = document.body.scrollHeight - window.innerHeight;
        progress = docHeight > 0 ? scrollTop / docHeight : 0;
      }
      setValue(progress * 100);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetRef]);

  return (
    <div className="flex items-center w-full sticky top-0 z-30 bg-background">
      <span className="text-xs text-muted-foreground mr-2 min-w-[2.5rem] text-right select-none">
        {Math.round(value)}%
      </span>
      <Progress
        value={value}
        className="h-1 w-full rounded-none bg-neutral-800 dark:bg-neutral-700"
      >
        <div className="bg-white dark:bg-neutral-300 h-full w-full rounded-none" />
      </Progress>
    </div>
  );
};

export default ProgressIndicatorBar;