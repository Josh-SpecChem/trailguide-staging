"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Headphones } from "lucide-react";

export interface BookHeaderProps {
  title: string;
  author: {
    name: string;
    avatar?: string;
    bio?: string;
  };
  published: string;
  readingTime: string;
  onListen?: () => void;
  className?: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const titleVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring" as const, stiffness: 100, damping: 15 } },
};

const subtitleVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 0.75, transition: { duration: 0.5 } },
};

export function BookHeader({
  title,
  author,
  published,
  readingTime,
  onListen,
  className,
}: BookHeaderProps) {
  function getInitials(name: string) {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <section className={`relative bg-gray-50 dark:bg-gray-900 py-20 px-6 md:px-12 ${className ?? ""}`}>
      {/* Decorative lines */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <svg
          className="absolute top-0 left-1/2 transform -translate-x-1/2 opacity-10"
          width="600"
          height="600"
          fill="none"
          viewBox="0 0 600 600"
          aria-hidden="true"
        >
          <circle cx="300" cy="300" r="300" stroke="#cbd5e1" strokeWidth="1" />
        </svg>
        <div className="absolute top-0 left-0 w-full h-px bg-gray-300 dark:bg-gray-700" />
        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-300 dark:bg-gray-700" />
      </div>

      <motion.div
        className="max-w-4xl mx-auto text-center md:text-left"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.h1
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 leading-tight"
          variants={titleVariants}
        >
          {title}
        </motion.h1>

        <motion.div
          className="mt-4 flex flex-col md:flex-row md:items-center md:gap-4 justify-center md:justify-start"
          variants={subtitleVariants}
        >
          <div className="flex items-center gap-3 mb-3 md:mb-0">
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.name}
                className="h-12 w-12 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                loading="lazy"
              />
            ) : (
              <div className="h-12 w-12 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold text-lg border border-gray-300 dark:border-gray-700 select-none">
                {getInitials(author.name)}
              </div>
            )}
            <div className="text-left">
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{author.name}</p>
              {author.bio && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{author.bio}</p>
              )}
            </div>
          </div>

          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 space-x-2 md:ml-6">
            <span>Published: {published}</span>
            <span aria-hidden="true">•</span>
            <span>Reading time: {readingTime}</span>
          </div>
        </motion.div>

        <motion.div className="mt-8 flex justify-center md:justify-start" variants={subtitleVariants}>
          <Button
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
            onClick={onListen}
            aria-label="Listen to audio"
            type="button"
          >
            <Headphones className="h-6 w-6" />
            Listen
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}