"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function HeroBanner({ title, ctas }: { title: string; ctas: { label: string; href: string }[] }) {
  return (
    <section className="bg-smokyBlack py-20 px-6 text-text">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="text-center md:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">{title}</h1>
          <div className="mt-6 flex flex-col md:flex-row gap-4 justify-center md:justify-start">
            {ctas.map((cta, i) => (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} key={i}>
                <Link
                  href={cta.href}
                  className="inline-block px-6 py-3 bg-tekhelet hover:bg-tekhelet/80 transition rounded-lg font-medium text-black"
                >
                  {cta.label}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
        <div className="w-full max-w-sm mx-auto">
          <Image
            src="/images/hero-headshot.png"
            alt="Alan Hirsch portrait"
            width={600}
            height={900}
            className="w-full h-auto rounded-xl border border-border"
            priority
          />
        </div>
      </div>
    </section>
  );
}